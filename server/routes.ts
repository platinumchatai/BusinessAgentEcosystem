import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { nanoid } from "nanoid";
import { setupAuth } from "./auth";
import Stripe from "stripe";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Stripe 
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);
  
  // API routes
  
  // Get all messages for the current session
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message to selected agents
  app.post("/api/messages", async (req, res) => {
    try {
      const schema = z.object({
        content: z.string().min(1),
        agentIds: z.array(z.number()).min(1),
      });

      const { content, agentIds } = schema.parse(req.body);
      
      // Get agent details for context
      const agents = await storage.getAgentsByIds(agentIds);
      const agentNames = agents.map(agent => agent.name).join(", ");
      
      // Generate agent response using OpenAI API
      let response;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a business agency AI representing the following agents: ${agentNames}. 
              Respond as these agents would, providing valuable business advice in your areas of expertise.
              
              FORMAT YOUR RESPONSES:
              - Always use clear organization with headers, subheaders, and bulleted lists for readability
              - For any plans, strategies, or formal business documents, format them using HTML
              - Use <h1>, <h2>, <h3> tags for headers/subheaders
              - Use <ul> and <li> for bullet points
              - Use <p> for paragraphs
              - Include line breaks between sections
              
              Respond in a professional, helpful manner. Keep responses concise but valuable.`
            },
            { role: "user", content }
          ],
        });
        
        response = completion.choices[0].message.content || "";
      } catch (error) {
        // Fallback response if API call fails
        response = `Thank you for your message about "${content}". Our agents (${agentNames}) will analyze your query and provide tailored business advice shortly.`;
      }
      
      // Save user message and agent response
      const userMessage = await storage.createMessage({
        content,
        agentIds,
        sender: "user",
        id: nanoid(),
      });
      
      const agentMessage = await storage.createMessage({
        content: response,
        agentIds,
        sender: "agent",
        id: nanoid(),
      });
      
      res.status(201).json({ 
        userMessage, 
        agentMessage,
        success: true 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process message" });
      }
    }
  });

  // Send a message to a single agent (from agent detail page)
  app.post("/api/agent-message", async (req, res) => {
    try {
      const schema = z.object({
        content: z.string().min(1),
        agentId: z.number(),
      });

      const { content, agentId } = schema.parse(req.body);
      
      // Get agent details
      const agent = await storage.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      // Generate agent response using OpenAI API
      let response;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are the ${agent.name}, an AI business agent with expertise in ${agent.expertise.join(", ")}. 
              Your primary role is to help businesses in the Phase ${agent.phase} stage.
              
              FORMAT YOUR RESPONSES:
              - Always use clear organization with headers, subheaders, and bulleted lists for readability
              - For any plans, strategies, or formal business documents, format them using HTML
              - Use <h1>, <h2>, <h3> tags for headers/subheaders
              - Use <ul> and <li> for bullet points
              - Use <p> for paragraphs
              - Include line breaks between sections
              
              Respond in a professional, helpful manner. Keep responses concise but valuable.`
            },
            { role: "user", content }
          ],
        });
        
        response = completion.choices[0].message.content || "";
      } catch (error) {
        // Fallback response if API call fails
        response = `Thank you for your message. As the ${agent.name}, I specialize in ${agent.expertise.join(", ")}. I'll analyze your request and provide tailored advice shortly.`;
      }
      
      res.status(200).json({ 
        response,
        agentId,
        success: true 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to process agent message" });
      }
    }
  });

  // Get agent information
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });
  
  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Payment routes for service purchases with account creation
  
  // Create payment intent for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const schema = z.object({
        amount: z.number().min(1),
        serviceLevel: z.string(),
        username: z.string().min(3),
        password: z.string().min(6),
        email: z.string().email(),
      });

      const { amount, serviceLevel, username, password, email } = schema.parse(req.body);
      
      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          serviceLevel,
          username,
          email,
          isAccountCreation: "true"
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating payment intent: " + error.message });
      }
    }
  });

  // Payment webhook for account creation after successful payment
  app.post("/api/payment-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    
    let event;
    
    try {
      // Use stripe webhook secret if provided
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          req.body, 
          sig, 
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        // For development, just parse the webhook payload
        event = req.body;
      }
      
      // Handle the event
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Extract data from metadata
        const { serviceLevel, username, email, isAccountCreation } = paymentIntent.metadata;
        
        if (isAccountCreation === "true") {
          // Create user account
          const user = await storage.createUser({
            username,
            password: req.body.password, // This would come from a secure temp storage in production
            email,
            serviceLevel,
          });
          
          // Create Stripe customer for future payments
          const customer = await stripe.customers.create({
            email,
            name: username,
            metadata: {
              userId: user.id.toString()
            }
          });
          
          // Update user with Stripe customer ID
          await storage.updateStripeCustomerId(user.id, customer.id);
        }
      }
      
      res.status(200).send({ received: true });
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Verify payment status
  app.get("/api/payment-status/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        status: paymentIntent.status,
        success: paymentIntent.status === 'succeeded'
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error checking payment status: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
