/**
 * Agent Factory
 * 
 * Utility for creating and accessing different types of agents
 */

import { Agent, AgentRole } from '../types';
import { VentureGrowthStrategist } from '../coordinators/VentureGrowthStrategist';
import { OrchestrationInterfaceEngineer } from '../coordinators/OrchestrationInterfaceEngineer';
import { FinancialGrowthStrategist } from '../coordinators/FinancialGrowthStrategist';

// Agent instances cache
const agentInstances: Map<AgentRole, Agent> = new Map();

/**
 * Get an agent instance by role
 * 
 * @param role - The agent role
 * @returns The agent instance
 */
export function getAgentByRole(role: AgentRole): Agent {
  // Check if we already have an instance
  const existingInstance = agentInstances.get(role);
  if (existingInstance) {
    return existingInstance;
  }
  
  // Create a new instance based on the role
  let agent: Agent;
  
  switch (role) {
    // Coordinators
    case AgentRole.VENTURE_GROWTH_STRATEGIST:
      agent = new VentureGrowthStrategist();
      break;
    case AgentRole.ORCHESTRATION_INTERFACE_ENGINEER:
      agent = new OrchestrationInterfaceEngineer();
      break;
    case AgentRole.FINANCIAL_GROWTH_STRATEGIST:
      agent = new FinancialGrowthStrategist();
      break;
      
    // Phase 1 Agents
    // These would be implemented as needed
    
    // Phase 2 Agents
    // These would be implemented as needed
    
    // Phase 3 Agents
    // These would be implemented as needed
    
    default:
      throw new Error(`Agent implementation not found for role: ${role}`);
  }
  
  // Cache the instance for future use
  agentInstances.set(role, agent);
  
  return agent;
}

/**
 * Clear the agent instances cache
 */
export function clearAgentCache(): void {
  agentInstances.clear();
}

/**
 * Get all implemented agent roles
 * 
 * @returns Array of implemented agent roles
 */
export function getImplementedAgentRoles(): AgentRole[] {
  return [
    AgentRole.VENTURE_GROWTH_STRATEGIST,
    AgentRole.ORCHESTRATION_INTERFACE_ENGINEER,
    AgentRole.FINANCIAL_GROWTH_STRATEGIST
  ];
}