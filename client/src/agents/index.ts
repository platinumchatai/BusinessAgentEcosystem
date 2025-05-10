/**
 * AI Agent Business Intelligence Framework
 * 
 * This module provides a comprehensive AI agent ecosystem designed to support
 * small business owners through various stages of growth, from ideation to
 * scaling beyond $10M.
 */

// Export core types
export * from './types';

// Export base agent class
export { BaseAgent } from './shared/BaseAgent';

// Export coordinator agents
export * from './coordinators';

// Export workflow utilities
export * from './workflows';

// Export OpenAI utilities
export * from './utils/openai';

// Main framework functions

import { 
  BusinessContext, 
  BusinessPhase, 
  AgentRole, 
  Agent, 
  AgentResponse 
} from './types';
import { VentureGrowthStrategist } from './coordinators/VentureGrowthStrategist';
import { OrchestrationInterfaceEngineer } from './coordinators/OrchestrationInterfaceEngineer';
import { FinancialGrowthStrategist } from './coordinators/FinancialGrowthStrategist';

/**
 * Get the coordinator agent for a specific business phase
 * 
 * @param phase - The business phase
 * @returns The coordinator agent for the specified phase
 */
export function getCoordinatorForPhase(phase: BusinessPhase): Agent {
  switch (phase) {
    case BusinessPhase.IDEATION:
      return new VentureGrowthStrategist();
    case BusinessPhase.LAUNCH:
      return new OrchestrationInterfaceEngineer();
    case BusinessPhase.GROWTH:
      return new VentureGrowthStrategist();
    case BusinessPhase.SCALING:
      return new FinancialGrowthStrategist();
    default:
      throw new Error(`No coordinator defined for phase ${phase}`);
  }
}

/**
 * Get all coordinator agents
 * 
 * @returns Array of all coordinator agents
 */
export function getAllCoordinators(): Agent[] {
  return [
    new VentureGrowthStrategist(),
    new OrchestrationInterfaceEngineer(),
    new FinancialGrowthStrategist()
  ];
}

/**
 * Process a user prompt with the appropriate coordinator based on business context
 * 
 * @param prompt - The user's prompt/question
 * @param businessContext - The current business context
 * @returns Promise resolving to the agent response
 */
export async function processPromptWithCoordinator(
  prompt: string,
  businessContext: BusinessContext
): Promise<AgentResponse> {
  const coordinator = getCoordinatorForPhase(businessContext.currentPhase);
  return coordinator.respondToPrompt(prompt, businessContext);
}

/**
 * Initialize a default business context
 * 
 * @param businessName - Optional business name
 * @param industry - Optional industry
 * @returns A default business context object
 */
export function initializeBusinessContext(
  businessName?: string,
  industry?: string
): BusinessContext {
  return {
    businessName,
    industry,
    currentPhase: BusinessPhase.IDEATION, // Default to ideation phase
    targetAudience: [],
    missionStatement: "",
    vision: "",
    values: [],
    competitors: [],
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    financials: {
      revenue: 0,
      expenses: 0,
      profit: 0,
      runway: 0
    },
    products: [],
    teamSize: 1,
    location: "",
    foundingYear: new Date().getFullYear(),
    goals: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    },
    history: "",
    brandIdentity: {
      colors: [],
      typography: "",
      voiceTone: "",
      values: []
    }
  };
}