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
    <section id="agents" className="mb-16">
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
                onClick={() => window.scrollTo(0, 0)}
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
            <div className="relative w-full max-w-md mx-auto mb-6">
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-icons absolute left-3 top-2 text-gray-400">search</span>
            </div>
            
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
                      onClick={() => window.scrollTo(0, 0)}
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

      {/* Workflow Phases - Simplified Vertical Design */}
      <div className="mt-16 mb-12 max-w-4xl mx-auto">
        <h3 className="font-heading text-xl font-medium mb-8 text-center">Business Development Phases</h3>
        
        {/* Simple stacked phase layout */}
        <div className="space-y-4">
          {phases.map((phase) => (
            <div 
              key={phase.id}
              className={cn(
                "bg-white rounded-lg shadow-sm overflow-hidden border-l-2",
                phase.id === activePhase ? "ring-1 ring-gray-200" : "",
                phase.id === 1 ? "border-gray-300" : 
                phase.id === 2 ? "border-gray-300" : 
                phase.id === 3 ? "border-gray-300" : 
                "border-gray-300"
              )}
            >
              {/* Phase header */}
              <div 
                className={cn(
                  "p-5 cursor-pointer",
                  phase.id === activePhase && "bg-gray-50"
                )}
                onClick={() => setActivePhase(phase.id)}
              >
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <h4 className="font-heading font-medium text-lg">
                    Phase {phase.id}: {phase.name}
                  </h4>
                  
                  {/* Use Workflow button - subtle design */}
                  <Link
                    href={`/workflow/${phase.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo(0, 0);
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <span className="material-icons text-sm mr-1">play_arrow</span>
                    Use Workflow
                  </Link>
                </div>
                
                {/* Phase description */}
                <p className="text-neutral-500 text-sm mt-3">{phase.description}</p>
                
                {/* Workflow description - subtle design */}
                <div className="mt-3 pt-3 text-sm border-t border-gray-100 text-gray-500">
                  <span className="font-medium">Workflow:</span> {phase.workflowDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Phase-specific agents - simplified */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-heading text-lg font-medium text-gray-700">
              Phase {activePhase} Specialist Agents
            </h4>
            
            {/* Phase selector dropdown - always visible for simplicity */}
            <div className="">
              <select 
                className="p-2 border border-gray-200 rounded-md text-sm bg-white"
                value={activePhase}
                onChange={(e) => setActivePhase(Number(e.target.value))}
              >
                {phases.map(phase => (
                  <option key={phase.id} value={phase.id}>
                    Phase {phase.id}: {phase.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Phase agents grid - reduced to 1-2 columns for simplicity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents
              .filter(agent => 
                agent.phase === activePhase &&
                (filter === 'All Agents' || agent.category === filter)
              )
              .map(agent => (
                <div 
                  key={agent.id}
                  className="bg-white border border-gray-100 rounded-md p-4 hover:shadow-sm transition-shadow"
                >
                  <Link 
                    href={`/agent/${agent.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="block"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-base">{agent.name}</h5>
                      <span className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {agent.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{agent.description}</p>
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-400">
                        {agent.coordinator ? "Coordinating Agent" : "Specialist Agent"}
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            }
            
            {/* Empty state */}
            {agents.filter(agent => 
              agent.phase === activePhase &&
              (filter === 'All Agents' || agent.category === filter)
            ).length === 0 && (
              <div className="col-span-2 py-10 text-center text-gray-400">
                No agents found for the selected phase and category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentSelector;
