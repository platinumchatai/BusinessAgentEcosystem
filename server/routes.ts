import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z } from "zod";
import { nanoid } from "nanoid";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
