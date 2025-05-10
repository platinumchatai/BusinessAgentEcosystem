import { BaseAgent } from '../shared/BaseAgent';
import { 
  AgentRole, 
  AgentCategory, 
  BusinessPhase, 
  BusinessContext,
  AgentResponse 
} from '../types';
import { createOpenAICompletion } from '../utils/openai';

/**
 * Venture Growth Strategist (Business Development Agent)
 * 
 * Coordinator for Phase 1 (Ideation & Planning) and Phase 3 (Growth & Optimization)
 * Provides strategic business development guidance and coordinates agent collaboration
 */
export class VentureGrowthStrategist extends BaseAgent {
  constructor() {
    super(
      1, // id
      "Venture Growth Strategist",
      AgentRole.VENTURE_GROWTH_STRATEGIST,
      AgentCategory.STRATEGY,
      [BusinessPhase.IDEATION, BusinessPhase.GROWTH], // Active in Phases 1 and 3
      true, // Is a coordinator
      [
        "Business model development",
        "Market validation",
        "Go-to-market strategy",
        "Growth strategy",
        "Competitive analysis",
        "Revenue modeling",
        "Business metrics"
      ],
      [
        "Develop comprehensive business strategies",
        "Validate market opportunities",
        "Design revenue and business models",
        "Identify competitive advantages",
        "Create growth frameworks",
        "Structure business metrics and KPIs",
        "Coordinate agent collaboration for business development"
      ],
      "The Venture Growth Strategist serves as a business development expert and coordinator, guiding businesses through ideation, validation, and growth phases with strategic frameworks and market-driven approaches.",
      {
        responseFormat: "Clear, structured responses with growth hypotheses and market validation approaches summarized at the beginning.",
        tone: "Professional tone balancing entrepreneurial energy with data-driven rigor.",
        detailLevel: "Thorough yet actionable business strategies with specific implementation steps and success metrics.",
        suggestionTypes: [
          "Improving customer acquisition economics",
          "Providing relevant market sizing methodologies",
          "Highlighting emerging business models in relevant sectors"
        ],
        questionTypes: [
          "Questions that challenge assumptions about market needs",
          "Questions about competitive advantages",
          "Questions about scalability constraints"
        ],
        checksAndBalances: "Verification of market size statistics or competitive landscape assessments against reliable industry reports and investor presentations.",
        resourceReferences: "Market research, funding trends, and competitive benchmarks when discussing growth potential.",
        criticalThinkingLevel: "Thoughtful analysis of business model viability that considers unit economics, network effects, and regulatory trends.",
        creativityLevel: "Innovative go-to-market strategies that challenge conventional business development approaches.",
        problemSolvingApproach: "First-principles approach to business challenges, considering both immediate traction tactics and long-term defensibility.",
        biasAwareness: "Avoids startup hype cycles and presents realistic assessments of venture success probabilities and timeline expectations.",
        languagePreferences: "Standard English with a balance of entrepreneurial terminology and business fundamentals vocabulary."
      }
    );
  }

  /**
   * Generate a response to the user's prompt as the Venture Growth Strategist
   */
  async respondToPrompt(prompt: string, businessContext: BusinessContext): Promise<AgentResponse> {
    const systemPrompt = this.generateSystemPrompt(businessContext);
    
    // Additional coordinator-specific context
    const coordinatorContext = `
      As the Venture Growth Strategist and coordinator for ${
        businessContext.currentPhase === BusinessPhase.IDEATION ? "Ideation & Planning" : "Growth & Optimization"
      } phase, your role is to:
      
      1. Provide strategic business guidance
      2. Coordinate the efforts of other agents in your phase
      3. Ensure all recommendations align with the business's growth objectives
      4. Maintain a holistic view of the business development process
      
      When responding, always consider:
      - The business's current phase and specific needs
      - Market validation requirements
      - Competitive positioning
      - Revenue and business model implications
      - Realistic growth trajectories
      - Resource constraints
    `;
    
    const fullSystemPrompt = systemPrompt + coordinatorContext;
    
    try {
      // Use OpenAI to generate the response
      const openAIResponse = await createOpenAICompletion(fullSystemPrompt, prompt);
      
      // Process and structure the response
      const recommendations = this.extractRecommendations(openAIResponse);
      const nextSteps = this.extractNextSteps(openAIResponse);
      const questions = this.extractQuestions(openAIResponse);
      
      const response: AgentResponse = {
        agentId: this.id,
        agentRole: this.role,
        timestamp: new Date(),
        content: openAIResponse,
        format: "markdown",
        recommendations,
        nextSteps,
        questions,
        resources: [
          {
            title: "Business Model Canvas",
            description: "A strategic management template for developing new business models or documenting existing ones"
          },
          {
            title: "Market Sizing Guide",
            description: "Methodologies for estimating total addressable market (TAM), serviceable available market (SAM), and serviceable obtainable market (SOM)"
          }
        ],
        metadata: {
          processingTime: 2.3, // placeholder
          businessPhase: businessContext.currentPhase,
          coordinatorRole: true
        }
      };
      
      return response;
    } catch (error: any) {
      console.error("Error generating Venture Growth Strategist response:", error);
      
      // Return a fallback response
      return {
        agentId: this.id,
        agentRole: this.role,
        timestamp: new Date(),
        content: "I apologize, but I'm unable to provide a complete response at this time. Please try again later.",
        format: "text",
        metadata: {
          error: true,
          errorMessage: error.message || "Unknown error"
        }
      };
    }
  }
  
  /**
   * Enhanced collaboration method for the coordinator role
   */
  async collaborateWithAgent(
    agent: any, 
    topic: string, 
    businessContext: BusinessContext
  ): Promise<AgentResponse> {
    // Enhance with coordinator-specific guidance
    const enhancedTopic = `As the Venture Growth Strategist coordinator, I need your expertise on "${topic}" specifically focused on ${
      businessContext.currentPhase === BusinessPhase.IDEATION ? "early-stage ideation and validation" : "growth optimization and scaling"
    }. Please provide insights that align with our business objectives and current phase.`;
    
    return super.collaborateWithAgent(agent, enhancedTopic, businessContext);
  }
  
  /**
   * Extract recommendations from OpenAI response
   */
  private extractRecommendations(text: string): string[] {
    // Simple extraction logic - could be enhanced with more sophisticated parsing
    const recommendations: string[] = [];
    
    // Look for sections that might contain recommendations
    const recommendationSections = [
      "recommendation",
      "recommend",
      "suggest",
      "advice",
      "proposed",
      "strategy"
    ];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Check if line contains recommendation markers
      const hasRecommendationMarker = recommendationSections.some(marker => 
        line.toLowerCase().includes(marker)
      );
      
      // Check if line looks like a list item with a recommendation
      const isListItem = line.trim().match(/^[-*•]|\d+\.\s/);
      
      if (hasRecommendationMarker || isListItem) {
        // Clean up the line
        let recommendation = line.trim();
        
        // Remove list markers
        recommendation = recommendation.replace(/^[-*•]|\d+\.\s/, '').trim();
        
        // Only add if not empty and not a duplicate
        if (recommendation && !recommendations.includes(recommendation)) {
          recommendations.push(recommendation);
        }
      }
    }
    
    return recommendations;
  }
  
  /**
   * Extract next steps from OpenAI response
   */
  private extractNextSteps(text: string): string[] {
    // Similar to recommendations but looking for next steps markers
    const nextSteps: string[] = [];
    
    const nextStepSections = [
      "next step",
      "action item",
      "to do",
      "implementation",
      "execute",
      "proceed"
    ];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      const hasNextStepMarker = nextStepSections.some(marker => 
        line.toLowerCase().includes(marker)
      );
      
      const isListItem = line.trim().match(/^[-*•]|\d+\.\s/);
      
      if (hasNextStepMarker || isListItem) {
        let step = line.trim();
        step = step.replace(/^[-*•]|\d+\.\s/, '').trim();
        
        if (step && !nextSteps.includes(step)) {
          nextSteps.push(step);
        }
      }
    }
    
    return nextSteps;
  }
  
  /**
   * Extract questions from OpenAI response
   */
  private extractQuestions(text: string): string[] {
    const questions: string[] = [];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Check if line contains a question mark and seems to be a question
      if (line.includes('?')) {
        let question = line.trim();
        
        // Ensure we're capturing just the question
        const questionMarkIndex = question.indexOf('?');
        if (questionMarkIndex >= 0) {
          // Find the start of the question
          let startIndex = 0;
          for (let i = questionMarkIndex; i >= 0; i--) {
            if (['.', '!', '\n'].includes(question[i])) {
              startIndex = i + 1;
              break;
            }
          }
          
          question = question.substring(startIndex, questionMarkIndex + 1).trim();
          
          if (question && !questions.includes(question)) {
            questions.push(question);
          }
        }
      }
    }
    
    return questions;
  }
}