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
 * Orchestration Interface Engineer (Dashboard Agent)
 * 
 * Coordinator for Phase 2 (Launch & Establish)
 * Manages visualization, reporting, and dashboard interfaces
 */
export class OrchestrationInterfaceEngineer extends BaseAgent {
  constructor() {
    super(
      2, // id
      "Orchestration Interface Engineer",
      AgentRole.ORCHESTRATION_INTERFACE_ENGINEER,
      AgentCategory.DATA,
      [BusinessPhase.LAUNCH], // Active in Phase 2
      true, // Is a coordinator
      [
        "Data visualization",
        "Dashboard interfaces",
        "Business analytics",
        "UX/UI design",
        "Information architecture",
        "Performance tracking",
        "Progress reporting"
      ],
      [
        "Design comprehensive dashboards",
        "Visualize complex business data",
        "Create intuitive interfaces",
        "Develop performance tracking systems",
        "Structure business analytics frameworks",
        "Coordinate agent outputs for visualization",
        "Integrate multiple data sources"
      ],
      "The Orchestration Interface Engineer serves as the dashboard specialist and coordinator for the Launch & Establish phase, creating visualization systems that integrate agent insights and business metrics into actionable interfaces.",
      {
        responseFormat: "Clear, structured responses with dashboard components and visualization approaches summarized at the beginning.",
        tone: "Professional tone balancing technical precision with user experience considerations.",
        detailLevel: "Thorough yet implementable interface specifications with clear rationales for design decisions and data relationships.",
        suggestionTypes: [
          "Improving data visualization clarity",
          "Providing relevant dashboard organization frameworks",
          "Highlighting emerging visualization techniques"
        ],
        questionTypes: [
          "Questions that clarify business metrics priorities",
          "Questions about interface preferences",
          "Questions about data relationships"
        ],
        checksAndBalances: "Verification of visualization best practices against user experience research and data visualization standards.",
        resourceReferences: "Dashboard frameworks, visualization libraries, and UX research when discussing interface recommendations.",
        criticalThinkingLevel: "Thoughtful analysis of interface effectiveness that considers both aesthetic appeal and functional utility.",
        creativityLevel: "Innovative visualization approaches that balance creativity with usability and information hierarchy.",
        problemSolvingApproach: "User-centered approach to interface challenges, considering both immediate comprehension and long-term dashboard sustainability.",
        biasAwareness: "Avoids unnecessary complexity and presents interfaces that prioritize clarity and actionability over visual impressiveness.",
        languagePreferences: "Standard English with a balance of technical visualization terminology and user experience vocabulary."
      }
    );
  }

  /**
   * Generate a response to the user's prompt as the Orchestration Interface Engineer
   */
  async respondToPrompt(prompt: string, businessContext: BusinessContext): Promise<AgentResponse> {
    const systemPrompt = this.generateSystemPrompt(businessContext);
    
    // Additional coordinator-specific context
    const coordinatorContext = `
      As the Orchestration Interface Engineer and coordinator for the Launch & Establish phase, your role is to:
      
      1. Design comprehensive dashboards and visualization interfaces
      2. Coordinate the outputs from other agents into cohesive visual frameworks
      3. Ensure all data is represented clearly and actionably
      4. Maintain a user-centered approach to interface design
      
      When responding, always consider:
      - The business's key performance indicators and metrics
      - User experience best practices
      - Data visualization principles
      - Information hierarchy and organization
      - Dashboard usability and accessibility
      - Integration points for multiple data sources
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
            title: "Dashboard Design Patterns",
            description: "Common patterns and frameworks for effective business dashboards"
          },
          {
            title: "Data Visualization Best Practices",
            description: "Guidelines for creating clear, informative, and actionable visualizations"
          }
        ],
        metadata: {
          processingTime: 2.1, // placeholder
          businessPhase: businessContext.currentPhase,
          coordinatorRole: true
        }
      };
      
      return response;
    } catch (error) {
      console.error("Error generating Orchestration Interface Engineer response:", error);
      
      // Return a fallback response
      return {
        agentId: this.id,
        agentRole: this.role,
        timestamp: new Date(),
        content: "I apologize, but I'm unable to provide a complete response at this time. Please try again later.",
        format: "text",
        metadata: {
          error: true,
          errorMessage: error.message
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
    const enhancedTopic = `As the Orchestration Interface Engineer coordinator, I need your expertise on "${topic}" specifically focused on how we can visualize and integrate this into our dashboard interfaces for the Launch & Establish phase. Please provide insights that align with our visualization objectives.`;
    
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
      "visualization",
      "dashboard",
      "interface"
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
      "implementation",
      "integrate",
      "design",
      "develop"
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