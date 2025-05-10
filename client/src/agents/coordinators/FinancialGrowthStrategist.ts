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
 * Financial Growth Strategist (Finance & Budgeting Agent)
 * 
 * Coordinator for Phase 4 (Scaling Beyond $10M)
 * Provides financial expertise, budget planning, and scaling strategy
 */
export class FinancialGrowthStrategist extends BaseAgent {
  constructor() {
    super(
      3, // id
      "Financial Growth Strategist",
      AgentRole.FINANCIAL_GROWTH_STRATEGIST,
      AgentCategory.FINANCE,
      [BusinessPhase.IDEATION, BusinessPhase.SCALING], // Active in Phase 1 and 4
      true, // Is a coordinator for Phase 4
      [
        "Financial modeling",
        "Budget planning",
        "Revenue forecasting",
        "Cash flow management",
        "Capital allocation",
        "Financial analysis",
        "Scaling economics"
      ],
      [
        "Develop comprehensive financial models",
        "Create scalable budget frameworks",
        "Project revenue and expense scenarios",
        "Analyze financial performance metrics",
        "Design capital allocation strategies",
        "Structure financial reporting systems",
        "Coordinate financial aspects of business scaling"
      ],
      "The Financial Growth Strategist serves as a financial expert and coordinator for the Scaling Beyond $10M phase, providing comprehensive financial frameworks, analysis, and scaling strategies.",
      {
        responseFormat: "Clear, structured responses with financial models and scaling frameworks summarized at the beginning.",
        tone: "Professional tone balancing analytical precision with practical business guidance.",
        detailLevel: "Thorough yet accessible financial analyses with specific implementation steps and performance metrics.",
        suggestionTypes: [
          "Improving financial efficiency",
          "Providing relevant forecasting methodologies",
          "Highlighting emerging financial models for scaling businesses"
        ],
        questionTypes: [
          "Questions that clarify financial priorities",
          "Questions about resource allocation",
          "Questions about scaling economics"
        ],
        checksAndBalances: "Verification of financial metrics and benchmarks against industry standards and financial best practices.",
        resourceReferences: "Financial frameworks, scaling case studies, and economic models when discussing growth strategies.",
        criticalThinkingLevel: "Thoughtful analysis of financial viability that considers both immediate performance and long-term sustainability.",
        creativityLevel: "Innovative financial approaches that balance growth objectives with fiscal responsibility.",
        problemSolvingApproach: "Data-driven approach to financial challenges, considering both immediate metrics and long-term financial health.",
        biasAwareness: "Avoids overly optimistic projections and presents realistic financial assessments with appropriate risk considerations.",
        languagePreferences: "Standard English with financial terminology explained in accessible business terms when needed."
      }
    );
  }

  /**
   * Generate a response to the user's prompt as the Financial Growth Strategist
   */
  async respondToPrompt(prompt: string, businessContext: BusinessContext): Promise<AgentResponse> {
    const systemPrompt = this.generateSystemPrompt(businessContext);
    
    // Additional coordinator-specific context
    const coordinatorContext = `
      As the Financial Growth Strategist ${
        businessContext.currentPhase === BusinessPhase.SCALING ? "and coordinator for the Scaling Beyond $10M phase" : ""
      }, your role is to:
      
      1. Provide comprehensive financial analysis and guidance
      2. ${businessContext.currentPhase === BusinessPhase.SCALING ? "Coordinate the efforts of other agents in the scaling phase" : "Support the business with financial insights during the ideation phase"}
      3. Ensure all recommendations align with sound financial principles
      4. Maintain a balanced view of growth objectives and financial sustainability
      
      When responding, always consider:
      - The business's current phase and financial position
      - Revenue and expense projections
      - Capital requirements and allocation
      - Financial metrics and KPIs
      - Risk management and contingency planning
      - Scaling economics and efficiency
    `;
    
    const fullSystemPrompt = systemPrompt + coordinatorContext;
    
    try {
      // Use OpenAI to generate the response
      const openAIResponse = await createOpenAICompletion(fullSystemPrompt, prompt);
      
      // Process and structure the response
      const response: AgentResponse = {
        agentId: this.id,
        agentRole: this.role,
        timestamp: new Date(),
        content: openAIResponse,
        format: "markdown",
        recommendations: this.extractRecommendations(openAIResponse),
        nextSteps: this.extractNextSteps(openAIResponse),
        questions: this.extractQuestions(openAIResponse),
        resources: [
          {
            title: "Financial Modeling Templates",
            description: "Frameworks for creating comprehensive financial projections for various business stages"
          },
          {
            title: "Scaling Financial Metrics",
            description: "Key performance indicators and financial metrics for scaling businesses beyond $10M"
          }
        ],
        metadata: {
          processingTime: 2.2, // placeholder
          businessPhase: businessContext.currentPhase,
          coordinatorRole: businessContext.currentPhase === BusinessPhase.SCALING
        }
      };
      
      return response;
    } catch (error: any) {
      console.error("Error generating Financial Growth Strategist response:", error);
      
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
    // Enhance with coordinator-specific guidance if in scaling phase
    let enhancedTopic = topic;
    
    if (businessContext.currentPhase === BusinessPhase.SCALING) {
      enhancedTopic = `As the Financial Growth Strategist coordinator for the Scaling Beyond $10M phase, I need your expertise on "${topic}" specifically focused on the financial implications and scaling economics. Please provide insights that align with our financial objectives and scaling strategy.`;
    } else {
      enhancedTopic = `As the Financial Growth Strategist, I need your expertise on "${topic}" with particular attention to the financial implications. Please provide insights that align with our financial planning objectives.`;
    }
    
    return super.collaborateWithAgent(agent, enhancedTopic, businessContext);
  }
  
  /**
   * Extract recommendations from OpenAI response
   */
  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    
    const recommendationSections = [
      "recommendation",
      "recommend",
      "suggest",
      "advice",
      "financial",
      "budget",
      "forecast"
    ];
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      const hasRecommendationMarker = recommendationSections.some(marker => 
        line.toLowerCase().includes(marker)
      );
      
      const isListItem = line.trim().match(/^[-*•]|\d+\.\s/);
      
      if (hasRecommendationMarker || isListItem) {
        let recommendation = line.trim();
        recommendation = recommendation.replace(/^[-*•]|\d+\.\s/, '').trim();
        
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
    const nextSteps: string[] = [];
    
    const nextStepSections = [
      "next step",
      "action item",
      "to do",
      "implement",
      "allocate",
      "budget",
      "financial"
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
      if (line.includes('?')) {
        let question = line.trim();
        
        const questionMarkIndex = question.indexOf('?');
        if (questionMarkIndex >= 0) {
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