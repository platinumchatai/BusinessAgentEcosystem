/**
 * Core Agent Types and Interfaces
 * 
 * This file defines the fundamental types and interfaces used throughout
 * the AI Agent Business Intelligence Framework
 */

// Business Growth Phases
export enum BusinessPhase {
  IDEATION = 1,  // Phase 1: Ideation & Planning
  LAUNCH = 2,    // Phase 2: Launch & Establish  
  GROWTH = 3,    // Phase 3: Growth & Optimization
  SCALING = 4    // Phase 4: Scaling Beyond $10M
}

// Agent Roles
export enum AgentRole {
  // Coordinators
  VENTURE_GROWTH_STRATEGIST = "Venture Growth Strategist",
  ORCHESTRATION_INTERFACE_ENGINEER = "Orchestration Interface Engineer",
  FINANCIAL_GROWTH_STRATEGIST = "Financial Growth Strategist",
  
  // Phase 1 Agents
  CONCEPT_INNOVATION_CATALYST = "Concept Innovation Catalyst",
  BRAND_EXPERIENCE_STRATEGIST = "Brand Experience Strategist",
  CONTENT_QUALITY_ASSURANCE_DIRECTOR = "Content Quality Assurance Director",
  
  // Phase 2 Agents
  SOLUTION_DESIGN_ORCHESTRATOR = "Solution Design Orchestrator",
  NARRATIVE_STRATEGY_ARCHITECT = "Narrative Strategy Architect",
  DIGITAL_AUDIENCE_ENGAGEMENT_PLANNER = "Digital Audience Engagement Planner",
  TRANSFORMATIVE_CONTENT_CREATOR = "Transformative Content Creator",
  CUSTOMER_SUCCESS_ARCHITECT = "Customer Success Architect",
  
  // Phase 3 Agents
  DISCOVERY_OPTIMIZATION_ARCHITECT = "Discovery Optimization Architect",
  BEHAVIORAL_ENGAGEMENT_ARCHITECT = "Behavioral Engagement Architect",
  EXPERIENCE_INTELLIGENCE_ANALYST = "Experience Intelligence Analyst",
  ECONOMIC_DATA_INTELLIGENCE_SPECIALIST = "Economic Data Intelligence Specialist",
  AUTOMATION_ARCHITECT = "Automation Architect"
}

// Agent Categories
export enum AgentCategory {
  COORDINATOR = "Coordinator",
  STRATEGY = "Strategy",
  MARKETING = "Marketing",
  CONTENT = "Content",
  PRODUCT = "Product",
  FINANCE = "Finance",
  DATA = "Data",
  AUTOMATION = "Automation",
  CUSTOMER = "Customer"
}

// Agent Interface - Core properties and methods all agents must implement
export interface Agent {
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
  
  // Methods
  respondToPrompt(prompt: string, businessContext: BusinessContext): Promise<AgentResponse>;
  collaborateWithAgent(agent: Agent, topic: string, businessContext: BusinessContext): Promise<AgentResponse>;
  summarizeFindings(responses: AgentResponse[]): Promise<AgentResponse>;
}

// Business Context - The shared context about the business
export interface BusinessContext {
  businessName?: string;
  industry?: string;
  targetAudience?: string[];
  currentPhase: BusinessPhase;
  missionStatement?: string;
  vision?: string;
  values?: string[];
  competitors?: string[];
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  financials?: {
    revenue?: number;
    expenses?: number;
    profit?: number;
    runway?: number;
  };
  products?: {
    name: string;
    description: string;
    price?: number;
    features?: string[];
  }[];
  teamSize?: number;
  location?: string;
  foundingYear?: number;
  goals?: {
    shortTerm?: string[];
    mediumTerm?: string[];
    longTerm?: string[];
  };
  history?: string;
  brandIdentity?: {
    colors?: string[];
    typography?: string;
    voiceTone?: string;
    values?: string[];
  };
}

// Agent Response - The structured response from an agent
export interface AgentResponse {
  agentId: number;
  agentRole: AgentRole;
  timestamp: Date;
  content: string;
  format: "text" | "html" | "markdown" | "json";
  recommendations?: string[];
  nextSteps?: string[];
  questions?: string[];
  resources?: {
    title: string;
    url?: string;
    description: string;
  }[];
  collaborators?: AgentRole[];
  metadata: {
    processingTime?: number;
    confidenceScore?: number;
    dataSourcesConsulted?: string[];
    [key: string]: any;
  };
}

// Workflow - A sequence of agent interactions
export interface Workflow {
  id: number;
  name: string;
  description: string;
  phaseId: BusinessPhase;
  coordinator: AgentRole;
  steps: WorkflowStep[];
}

// Workflow Step - A single step in a workflow
export interface WorkflowStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  agent: AgentRole;
  inputs?: string[];
  outputs?: string[];
  dependencies?: number[]; // IDs of steps that must be completed before this one
}