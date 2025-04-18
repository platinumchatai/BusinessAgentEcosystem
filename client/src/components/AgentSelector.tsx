import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { agents, AgentType, phases } from "@/data/agents";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentType;
  phase: number;
}

const AgentCard = ({ agent, phase }: AgentCardProps) => {
  const phaseColors = [
    { bg: 'text-primary', hover: 'hover:text-primary-dark' },
    { bg: 'text-green-600', hover: 'hover:text-green-700' },
    { bg: 'text-amber-500', hover: 'hover:text-amber-600' },
    { bg: 'text-secondary', hover: 'hover:text-secondary-dark' },
  ];
  
  const color = phaseColors[phase - 1];
  
  return (
    <motion.div 
      className={`agent-card bg-white rounded-lg shadow-card overflow-hidden 
        ${agent.coordinator ? `border-l-4 ${phase === 1 ? 'border-primary' : phase === 2 ? 'border-green-600' : phase === 3 ? 'border-amber-500' : 'border-secondary'}` : ''}
        cursor-pointer hover:shadow-lg`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href={`/agent/${agent.id}`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-heading font-semibold text-lg">{agent.name}</h5>
            <span className={`
              ${agent.coordinator 
                ? `${phase === 1 ? 'bg-primary/10 text-primary' : phase === 2 ? 'bg-green-600/10 text-green-600' : phase === 3 ? 'bg-amber-500/10 text-amber-500' : 'bg-secondary/10 text-secondary'}`
                : 'bg-gray-100 text-gray-600'} 
              text-xs px-2 py-1 rounded-full`}
            >
              {agent.coordinator ? 'Coordinator' : agent.category}
            </span>
          </div>
          <p className="text-neutral-400 text-sm mb-4">{agent.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-300">
              {`Phase ${phase}${agent.coordinator ? ' Primary' : ''}`}
            </span>
            <button className={`${color.bg} ${color.hover}`}>
              <span className="material-icons">arrow_forward</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const AgentSelector = () => {
  const [activePhase, setActivePhase] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Agents');
  const [showAllAgents, setShowAllAgents] = useState(false);
  
  // Category filters for top-level agents
  const categoryFilters = ['All Agents', 'Marketing', 'Finance', 'Product', 'Strategy'];
  
  // Exactly 4 featured agents - prioritize coordinators, but fill with others if needed
  const coordinatorAgents = agents.filter(agent => agent.coordinator)
    .sort((a, b) => a.phase - b.phase); // Sort by phase
  
  // Take 4 agents, either all coordinators or coordinators + other important agents
  const featuredAgents = coordinatorAgents.length >= 4 
    ? coordinatorAgents.slice(0, 4) 
    : [...coordinatorAgents, ...agents
        .filter(agent => !agent.coordinator)
        .sort((a, b) => (a.phase === b.phase) 
          ? a.category.localeCompare(b.category) 
          : a.phase - b.phase)
        .slice(0, 4 - coordinatorAgents.length)
      ];
  
  // Filtered agents for each phase
  const filteredAgents = agents.filter(agent => 
    agent.phase === activePhase && 
    (searchTerm === '' || agent.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'All Agents' || agent.category === filter)
  );
  
  // Get the current phase data
  const currentPhase = phases.find(phase => phase.id === activePhase) || phases[0];
  
  // Background colors for phases
  const phaseBackgrounds = ['bg-phase1', 'bg-phase2', 'bg-phase3', 'bg-phase4'];
  const phaseIndicators = ['phase1-indicator', 'phase2-indicator', 'phase3-indicator', 'phase4-indicator'];
  const phaseButtonColors = [
    { bg: 'bg-primary', hover: 'hover:bg-primary-dark' },
    { bg: 'bg-green-600', hover: 'hover:bg-green-700' },
    { bg: 'bg-amber-500', hover: 'hover:bg-amber-600' },
    { bg: 'bg-secondary', hover: 'hover:bg-secondary-dark' },
  ];
  
  return (
    <section id="agents-section" className="mb-16">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h2 className="font-heading font-medium text-2xl mb-3">
          AI Agent Ecosystem
        </h2>
        <p className="text-gray-500 text-base mx-auto">
          Choose between complete workflows tailored to your business stage or individual agents for specific needs.
        </p>
      </div>

      {/* Top-level category filters - simplified */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
        {categoryFilters.map(category => (
          <button 
            key={category}
            className={`px-3 py-1.5 border border-gray-200 rounded-md text-sm transition-colors ${filter === category ? 'bg-gray-100 font-medium' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Agents - Simplified */}
      <div className="mb-12 max-w-4xl mx-auto">
        <h3 className="font-heading text-xl font-medium mb-6 text-center">Featured Agents</h3>
        
        {/* 2x2 Grid for Featured Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredAgents.map(agent => (
            <div 
              key={agent.id}
              className="bg-white border border-gray-200 rounded-md hover:shadow-sm transition-shadow p-4"
            >
              <Link 
                href={`/agent/${agent.id}`}
                className="block"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-lg">{agent.name}</h5>
                  <span className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {agent.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{agent.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    Phase {agent.phase}
                  </span>
                  {agent.coordinator && (
                    <span className="text-xs bg-gray-50 px-2 py-0.5 rounded-full text-gray-500">
                      Coordinator
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* "See Other Agents" Button - Simplified */}
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setShowAllAgents(!showAllAgents)}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-1.5 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            {showAllAgents ? 'Hide Other Agents' : 'See Other Agents'}
          </button>
        </div>
        
        {/* Other Agents Section - Simplified */}
        {showAllAgents && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents
                .filter(agent => 
                  !featuredAgents.some(featured => featured.id === agent.id) &&
                  (searchTerm === '' || agent.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (filter === 'All Agents' || agent.category === filter)
                )
                .slice(0, 8)
                .map(agent => (
                  <div 
                    key={agent.id}
                    className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow"
                  >
                    <Link 
                      href={`/agent/${agent.id}`}
                      className="block"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-base">{agent.name}</h5>
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          {agent.category}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{agent.description}</p>
                      <div className="flex justify-end">
                        <span className="text-xs text-gray-400">Phase {agent.phase}</span>
                      </div>
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Consultation Button */}
      <div className="mt-12 mb-16 text-center">
        <Link 
          href="/consultation" 
          className="inline-flex items-center px-5 py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <span className="material-icons text-sm mr-2">chat</span>
          Start Agency Consultation
        </Link>
        <p className="text-sm text-gray-500 mt-2">
          Chat with our agency assistant to learn about our services and subscription options
        </p>
      </div>
      
      {/* Agent Workflow Preview based on image */}
      <div className="mt-16 mb-16 max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="font-heading text-xl font-medium mb-2">Agent Workflows</h3>
          <p className="text-gray-500 text-sm mb-6">
            See how our agents work together to deliver comprehensive solutions for each business phase.
          </p>
          
          {/* Phase tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "px-4 py-2 text-sm rounded-md transition-colors",
                  activePhase === phase.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Phase {phase.id}: {phase.name}
              </button>
            ))}
          </div>
          
          {/* Current phase details */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-heading text-lg font-medium text-gray-800 text-left">
                Phase {activePhase}: {phases.find(p => p.id === activePhase)?.name} Workflow
              </h4>
              <Link 
                href={`/workflow/${activePhase}`}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Use this workflow
              </Link>
            </div>
            
            <p className="text-gray-500 text-sm mb-6 text-left">
              {phases.find(p => p.id === activePhase)?.description}
            </p>
            
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Step 1 */}
              <div className="text-center bg-gray-50 rounded-md p-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span>1</span>
                </div>
                <h5 className="font-medium text-sm mb-2">Business Concept Refinement</h5>
                <p className="text-xs text-gray-500">The Ideation Agent works with the entrepreneur to clarify and refine the business concept.</p>
                <div className="mt-3 text-xs text-blue-600">
                  <span className="material-icons text-xs mr-1 inline-block">person</span>
                  Ideation Agent
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="text-center bg-gray-50 rounded-md p-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span>2</span>
                </div>
                <h5 className="font-medium text-sm mb-2">Brand Foundation Development</h5>
                <p className="text-xs text-gray-500">Marketing & Branding Agent creates initial brand identity based on the refined business concept.</p>
                <div className="mt-3 text-xs text-blue-600">
                  <span className="material-icons text-xs mr-1 inline-block">person</span>
                  Marketing & Branding Agent
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="text-center bg-gray-50 rounded-md p-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span>3</span>
                </div>
                <h5 className="font-medium text-sm mb-2">Financial Planning</h5>
                <p className="text-xs text-gray-500">Finance & Budgeting Agent develops initial financial projections and startup budget requirements.</p>
                <div className="mt-3 text-xs text-blue-600">
                  <span className="material-icons text-xs mr-1 inline-block">person</span>
                  Finance & Budgeting Agent
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="text-center bg-gray-50 rounded-md p-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span>4</span>
                </div>
                <h5 className="font-medium text-sm mb-2">Strategic Roadmap Creation</h5>
                <p className="text-xs text-gray-500">Business Development Agent synthesizes all inputs to create a comprehensive business strategy.</p>
                <div className="mt-3 text-xs text-blue-600">
                  <span className="material-icons text-xs mr-1 inline-block">person</span>
                  Business Development Agent
                </div>
              </div>
            </div>
            
            {/* Workflow Coordinator */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <span className="material-icons text-blue-600 mr-2">hub</span>
                <h5 className="font-medium text-sm">Workflow Coordinator</h5>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The Business Development Agent oversees this entire workflow, ensuring all specialized agents work together coherently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentSelector;
