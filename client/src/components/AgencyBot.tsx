// Here's how we would update your AgencyBot.tsx file with the complete implementation:

import React, { useState, useEffect } from "react";

// Define the AgencyBotState interface
interface AgencyBotState {
  step: string;
  userName: string;
  businessType: string;
  businessPhase: number | null;
  needsLiveConsultation: boolean | null;
  recommendedAgents: string[];
}

class AgencyBot {
  state: AgencyBotState;
  responses: Record<string, any>;

  constructor() {
    this.state = {
      step: "greeting",
      userName: "",
      businessType: "",
      businessPhase: null,
      needsLiveConsultation: null,
      recommendedAgents: [],
    };

    this.responses = {
      greeting: () => `
Hello there! 👋 Welcome to Platinum Chat AI Business Agency! 

I'm your AI Business Consultant, ready to help you leverage our team of 16 specialized AI agents to grow your business. 

How are you doing today?
      `,

      askName: () => `
Great to hear that! I'd love to get to know you a bit better. What name would you like me to refer to you as during our conversation?
      `,

      askBusinessType: (name: string) => `
Wonderful to meet you, ${name}! I'm excited to learn more about your business.

What type of business do you have or are you planning to start? This will help me recommend the right AI agents for your specific needs.
      `,

      askBusinessPhase: (name: string, businessType: string) => `
Thanks for sharing that, ${name}! A ${businessType} business has great potential.

Which of these phases best describes your current business stage?

1. Ideation and Planning: You're developing concepts, researching markets, and creating strategic plans
2. Launch and Establishment: You're implementing your brand, finalizing products, and acquiring initial customers
3. Growth and Optimization: You're improving customer experience, growing marketing efforts, and optimizing processes
4. Scaling Beyond $10 Million: You're developing scaling strategies, expanding markets, and implementing enterprise-level automation
      `,

      recommendAgents: (name: string, businessType: string, phase: number) => {
        // Logic to determine recommended agents based on business phase
        let phaseAgents: string[] = [];
        let phaseDescription: string = "";

        if (phase === 1) {
          phaseAgents = [
            "Ideation Agent",
            "BLS Data Handler",
            "Business Development Agent",
          ];
          phaseDescription = "Ideation and Planning";
        } else if (phase === 2) {
          phaseAgents = [
            "Business Development Agent",
            "Marketing & Branding",
            "Product Development",
          ];
          phaseDescription = "Launch and Establishment";
        } else if (phase === 3) {
          phaseAgents = [
            "Customer Experience Feedback Specialist",
            "Content Strategist",
            "SEO Strategist",
          ];
          phaseDescription = "Growth and Optimization";
        } else if (phase === 4) {
          phaseAgents = [
            "Business Development Agent",
            "Finance & Budgeting",
            "Automation Expert",
          ];
          phaseDescription = "Scaling Beyond $10 Million";
        }

        return `
Based on your ${phaseDescription} phase for your ${businessType} business, I'd recommend starting with these AI agents:

${phaseAgents.map((agent) => `• ${agent}`).join("\n")}

These specialized agents will work together to address your most pressing business needs at this stage. Would you like me to tell you more about what these agents can do for your business?
        `;
      },

      offerConsultation: (name: string) => `
${name}, would you be interested in scheduling a one-on-one consultation with one of our live business consultants? 

They can provide personalized guidance and help you get the most out of our AI agent platform.
      `,

      scheduleConsultation: (name: string) => `
Excellent, ${name}! I'll make sure we arrange that consultation for you.

Could you let me know what days and times generally work best for you? One of our consultants will reach out to confirm the exact time.
      `,

      finalMessage: (name: string, hasConsultation: boolean) => {
        if (hasConsultation) {
          return `
Thank you for chatting with me today, ${name}! We'll be in touch soon to confirm your consultation.

In the meantime, feel free to explore our website to learn more about our AI agents and how they can transform your business. If you have any questions before your consultation, don't hesitate to message us again!

Have a wonderful day! 😊
          `;
        } else {
          return `
Thank you for chatting with me today, ${name}! Our AI agents are ready to help you take your business to the next level.

If you'd like to get started, check out our pricing plans:
- Starter Tier: $49/month - Access to 3 AI Agents of choice
- Growth Tier: $79/month - Access to 5 AI Agents of choice plus 1 Workflow automation
- Accelerator Tier: $129/month - Access to all 16 AI Agents and all 4 Workflow automations

Feel free to message us anytime if you have questions or change your mind about that consultation!

Have a wonderful day! 😊
          `;
        }
      },

      agentDescription: (agent: string) => {
        const descriptions: Record<string, string> = {
          "Automation Expert":
            "The Automation Expert builds scenarios and automations using Make.com, n8n, and Zapier to streamline your business processes and save you time.",
          "BLS Data Handler":
            "The BLS Data Handler pulls and analyzes data from BLS.gov to provide market research and industry trends for your business decisions.",
          "Business Development Agent":
            "The Business Development Agent builds comprehensive business strategies for small business owners and entrepreneurs, coordinating with other agents.",
          "Content Planner":
            "The Content Planner helps build your social media presence through organized content calendars and posting schedules.",
          "Content Strategist":
            "The Content Strategist works with the Content Planner to create effective content that resonates with your target audience.",
          "Copywriter & Author":
            "The Copywriter & Author creates ebooks, job aids, and other business content to establish your authority and generate leads.",
          "Customer Experience Feedback Specialist":
            "The Customer Experience Feedback Specialist helps refine and grow your business based on customer feedback and insights.",
          "Dashboard Agent":
            "The Dashboard Agent outlines which agents are working together at any given time and provides visibility into your business metrics.",
          "Editor-in-Chief":
            "The Editor-in-Chief proofreads all copy and content and ensures proper HTML formatting for all your business documents.",
          "Engagement Hooks Agent":
            "The Engagement Hooks Agent works with your social media content strategy to build engagement and grow your organic customer base.",
          "Finance & Budgeting":
            "The Finance & Budgeting agent reviews and ensures proper budgeting to achieve your scaling goals beyond $10 million.",
          "Ideation Agent":
            "The Ideation Agent helps you refine business ideas and brainstorm new concepts for products and services.",
          "Marketing & Branding":
            "The Marketing & Branding agent handles all aspects of marketing, branding, style guides, and messaging for your business.",
          "Onboarding Agent":
            "The Onboarding Agent gets customers on the right path with using your products and services, reducing churn.",
          "Product Development":
            "The Product Development agent helps create effective and marketable products to fit your business or niche.",
          "SEO Strategist":
            "The SEO Strategist uses the right keywords and tags to help your business rank high in search results across all search engines.",
        };

        return descriptions[agent] || "Agent description not available.";
      },
    };
  }

  processUserMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    let response = "";

    switch (this.state.step) {
      case "greeting":
        if (
          lowerMessage.includes("hello") ||
          lowerMessage.includes("hi") ||
          lowerMessage.includes("hey")
        ) {
          response = this.responses.greeting();
          this.state.step = "user_feeling";
        } else {
          response = this.responses.greeting();
          this.state.step = "user_feeling";
        }
        break;

      case "user_feeling":
        response = this.responses.askName();
        this.state.step = "get_name";
        break;

      case "get_name":
        this.state.userName = message.trim();
        response = this.responses.askBusinessType(this.state.userName);
        this.state.step = "get_business_type";
        break;

      case "get_business_type":
        this.state.businessType = message.trim();
        response = this.responses.askBusinessPhase(
          this.state.userName,
          this.state.businessType,
        );
        this.state.step = "get_business_phase";
        break;

      case "get_business_phase":
        const phaseInput = parseInt(message.trim().charAt(0));
        if (phaseInput >= 1 && phaseInput <= 4) {
          this.state.businessPhase = phaseInput;
          response = this.responses.recommendAgents(
            this.state.userName,
            this.state.businessType,
            this.state.businessPhase,
          );
          this.state.step = "agent_info";
        } else {
          response =
            "I didn't quite catch that. Please select a number from 1-4 that best describes your business phase.";
        }
        break;

      case "agent_info":
        response = this.responses.offerConsultation(this.state.userName);
        this.state.step = "offer_consultation";
        break;

      case "offer_consultation":
        if (
          lowerMessage.includes("yes") ||
          lowerMessage.includes("sure") ||
          lowerMessage.includes("ok")
        ) {
          this.state.needsLiveConsultation = true;
          response = this.responses.scheduleConsultation(this.state.userName);
          this.state.step = "schedule_consultation";
        } else {
          this.state.needsLiveConsultation = false;
          response = this.responses.finalMessage(this.state.userName, false);
          this.state.step = "end";
        }
        break;

      case "schedule_consultation":
        response = this.responses.finalMessage(this.state.userName, true);
        this.state.step = "end";
        break;

      case "end":
        response = `Is there anything else I can help you with today, ${this.state.userName}?`;
        break;

      default:
        response = "I'm not sure I understand. Can you please rephrase that?";
    }

    return response;
  }
}

// React component for the chatbot UI
const AgencyChatbot: React.FC = () => {
  const [bot] = useState(new AgencyBot());
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: bot.processUserMessage(""), isBot: true },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputText, isBot: false }]);

    // Get bot response
    const botResponse = bot.processUserMessage(inputText);

    // Add bot message after a small delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 500);

    setInputText("");
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="agency-chatbot">
      <div className="chat-header">
        <h2>Platinum Chat AI Business Agency</h2>
        <p>Your AI Business Consultant</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
            <div className="message-bubble">
              {msg.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-gray-900"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AgencyChatbot;
