import { 
  Agent, 
  AgentRole, 
  AgentCategory, 
  BusinessPhase, 
  BusinessContext,
  AgentResponse 
} from '../types';

/**
 * BaseAgent Class
 * 
 * Abstract base class that all specific agents will extend.
 * Implements common functionality and enforces the Agent interface.
 */
export abstract class BaseAgent implements Agent {
  id: number;
  name: string;
  role: AgentRole;
  category: AgentCategory;
  phases: BusinessPhase[];
  isCoordinator: boolean;
  expertise: string[];
  capabilities: string[];
  description: string;
  communicationStyle: {
    responseFormat: string;
    tone: string;
    detailLevel: string;
    suggestionTypes: string[];
    questionTypes: string[];
    checksAndBalances: string;
    resourceReferences: string;
    criticalThinkingLevel: string;
    creativityLevel: string;
    problemSolvingApproach: string;
    biasAwareness: string;
    languagePreferences: string;
  };

  constructor(
    id: number,
    name: string,
    role: AgentRole,
    category: AgentCategory,
    phases: BusinessPhase[],
    isCoordinator: boolean,
    expertise: string[],
    capabilities: string[],
    description: string,
    communicationStyle: {
      responseFormat: string;
      tone: string;
      detailLevel: string;
      suggestionTypes: string[];
      questionTypes: string[];
      checksAndBalances: string;
      resourceReferences: string;
      criticalThinkingLevel: string;
      creativityLevel: string;
      problemSolvingApproach: string;
      biasAwareness: string;
      languagePreferences: string;
    }
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.category = category;
    this.phases = phases;
    this.isCoordinator = isCoordinator;
    this.expertise = expertise;
    this.capabilities = capabilities;
    this.description = description;
    this.communicationStyle = communicationStyle;
  }

  /**
   * Generate the agent's system prompt based on its role and communication style
   */
  protected generateSystemPrompt(businessContext: BusinessContext): string {
    return `You are ${this.name}, a ${this.role} with expertise in ${this.expertise.join(", ")}.
    
    Your communication style:
    - Response Format: ${this.communicationStyle.responseFormat}
    - Tone: ${this.communicationStyle.tone}
    - Detail Level: ${this.communicationStyle.detailLevel}
    - Problem-Solving Approach: ${this.communicationStyle.problemSolvingApproach}
    
    Business Context:
    - Business Name: ${businessContext.businessName || "Unspecified"}
    - Industry: ${businessContext.industry || "Unspecified"}
    - Current Phase: Phase ${businessContext.currentPhase}
    ${businessContext.missionStatement ? `- Mission: ${businessContext.missionStatement}` : ""}
    ${businessContext.vision ? `- Vision: ${businessContext.vision}` : ""}
    
    Respond in a way that aligns with your communication style and expertise.`;
  }

  /**
   * Process the user's prompt and generate a response
   * To be implemented by specific agent classes
   */
  abstract respondToPrompt(prompt: string, businessContext: BusinessContext): Promise<AgentResponse>;

  /**
   * Collaborate with another agent on a specific topic
   */
  async collaborateWithAgent(
    agent: Agent, 
    topic: string, 
    businessContext: BusinessContext
  ): Promise<AgentResponse> {
    // Default implementation - can be overridden by specific agents
    const myResponse = await this.respondToPrompt(
      `Please provide your expertise on "${topic}" for collaboration with ${agent.role}`,
      businessContext
    );
    
    const theirResponse = await agent.respondToPrompt(
      `Please provide your expertise on "${topic}" for collaboration with ${this.role}`,
      businessContext
    );
    
    // Combine responses
    const combinedResponse: AgentResponse = {
      agentId: this.id,
      agentRole: this.role,
      timestamp: new Date(),
      content: `# Collaborative Response on ${topic}\n\n` +
               `## Input from ${this.role}:\n${myResponse.content}\n\n` +
               `## Input from ${agent.role}:\n${theirResponse.content}\n\n` +
               `## Synthesis:\nBased on our combined expertise, we recommend the following approach to "${topic}"...`,
      format: "markdown",
      recommendations: [
        ...myResponse.recommendations || [],
        ...theirResponse.recommendations || []
      ],
      nextSteps: [
        ...myResponse.nextSteps || [],
        ...theirResponse.nextSteps || []
      ],
      questions: [
        ...myResponse.questions || [],
        ...theirResponse.questions || []
      ],
      resources: [
        ...myResponse.resources || [],
        ...theirResponse.resources || []
      ],
      collaborators: [this.role, agent.role],
      metadata: {
        processingTime: 
          (myResponse.metadata.processingTime || 0) + 
          (theirResponse.metadata.processingTime || 0),
        collaborationTimestamp: new Date(),
      }
    };
    
    return combinedResponse;
  }

  /**
   * Summarize findings from multiple agent responses
   */
  async summarizeFindings(responses: AgentResponse[]): Promise<AgentResponse> {
    // Default implementation - can be overridden by specific agents
    const summary: AgentResponse = {
      agentId: this.id,
      agentRole: this.role,
      timestamp: new Date(),
      content: `# Summary of Findings\n\n`,
      format: "markdown",
      recommendations: [],
      nextSteps: [],
      questions: [],
      resources: [],
      collaborators: responses.map(r => r.agentRole),
      metadata: {
        processingTime: 0,
        summarizedResponses: responses.length,
      }
    };
    
    // Add each response to the summary
    responses.forEach((response, index) => {
      summary.content += `## ${response.agentRole} Contribution\n`;
      summary.content += `${response.content.substring(0, 300)}...\n\n`;
      
      // Collect all recommendations, next steps, etc.
      if (response.recommendations) {
        summary.recommendations = [
          ...summary.recommendations || [],
          ...response.recommendations
        ];
      }
      
      if (response.nextSteps) {
        summary.nextSteps = [
          ...summary.nextSteps || [],
          ...response.nextSteps
        ];
      }
      
      if (response.questions) {
        summary.questions = [
          ...summary.questions || [],
          ...response.questions
        ];
      }
      
      if (response.resources) {
        summary.resources = [
          ...summary.resources || [],
          ...response.resources
        ];
      }
    });
    
    // Add a synthesized conclusion
    summary.content += `\n## Synthesis\n`;
    summary.content += `Based on the collective input from ${responses.length} agents, the key findings are...\n`;
    
    return summary;
  }
}