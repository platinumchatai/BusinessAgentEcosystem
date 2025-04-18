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
      <div className="text-center mb-12">
        <motion.h2 
          className="font-heading font-bold text-3xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meet Our AI Agent Ecosystem
        </motion.h2>
        <motion.p 
          className="text-neutral-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Choose between complete workflows tailored to your business stage or individual agents for specific needs.
        </motion.p>
      </div>

      {/* Top-level category filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categoryFilters.map(category => (
          <button 
            key={category}
            className={`px-4 py-2 border border-gray-200 rounded-lg transition-colors ${filter === category ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Agents */}
      <div className="mb-12">
        <h3 className="font-heading text-2xl font-bold mb-6 text-center">Featured Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map(agent => (
            <motion.div 
              key={agent.id}
              className={`agent-card bg-white rounded-lg shadow-card overflow-hidden 
                ${agent.coordinator ? `border-l-4 ${agent.phase === 1 ? 'border-primary' : agent.phase === 2 ? 'border-green-600' : agent.phase === 3 ? 'border-amber-500' : 'border-secondary'}` : ''}
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
                        ? `${agent.phase === 1 ? 'bg-primary/10 text-primary' : agent.phase === 2 ? 'bg-green-600/10 text-green-600' : agent.phase === 3 ? 'bg-amber-500/10 text-amber-500' : 'bg-secondary/10 text-secondary'}`
                        : 'bg-gray-100 text-gray-600'} 
                      text-xs px-2 py-1 rounded-full`}
                    >
                      {agent.category}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{agent.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-300">
                      {`Phase ${agent.phase}${agent.coordinator ? ' Primary' : ''}`}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => setShowAllAgents(!showAllAgents)}
            className="bg-white text-primary border border-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition-colors"
          >
            {showAllAgents ? 'Hide Other Agents' : 'See Other Agents'}
          </button>
        </div>
        
        {showAllAgents && (
          <div className="mt-8">
            <div className="relative w-full max-w-md mx-auto mb-6">
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-icons absolute left-3 top-2 text-gray-400">search</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {agents
                .filter(agent => 
                  !featuredAgents.some(featured => featured.id === agent.id) &&
                  (searchTerm === '' || agent.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (filter === 'All Agents' || agent.category === filter)
                )
                .slice(0, 8)
                .map(agent => (
                  <motion.div 
                    key={agent.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md p-4 border border-gray-100"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link 
                      href={`/agent/${agent.id}`}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-base">{agent.name}</h5>
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {agent.category}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs mb-3 line-clamp-2 flex-grow">{agent.description}</p>
                        <div className="flex justify-end">
                          <span className="text-xs text-neutral-300">Phase {agent.phase}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Workflow Phases */}
      <div className="mt-16 mb-12">
        <h3 className="font-heading text-2xl font-bold mb-6 text-center">Business Development Phases</h3>
        
        {/* Simple phase cards with clean layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase) => (
            <div 
              key={phase.id}
              className={cn(
                "bg-white rounded-lg shadow-md overflow-hidden border-t-4",
                phase.id === 1 ? "border-primary" : 
                phase.id === 2 ? "border-green-600" : 
                phase.id === 3 ? "border-amber-500" : 
                "border-secondary"
              )}
            >
              {/* Phase header */}
              <div 
                className={cn(
                  "p-4 cursor-pointer",
                  phase.id === activePhase && "bg-gray-50"
                )}
                onClick={() => setActivePhase(phase.id)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-heading font-semibold text-lg">
                    Phase {phase.id}: {phase.name}
                  </h4>
                  
                  {/* Use Workflow button */}
                  <Link
                    href={`/workflow/${phase.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo(0, 0);
                    }}
                    className={cn(
                      "inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white",
                      phase.id === 1 ? "bg-primary hover:bg-primary-dark" : 
                      phase.id === 2 ? "bg-green-600 hover:bg-green-700" : 
                      phase.id === 3 ? "bg-amber-500 hover:bg-amber-600" : 
                      "bg-secondary hover:bg-secondary-dark"
                    )}
                  >
                    <span className="material-icons text-sm mr-1">play_arrow</span>
                    Use Workflow
                  </Link>
                </div>
                
                {/* Phase description */}
                <p className="text-neutral-500 text-sm mt-2">{phase.description}</p>
                
                {/* Workflow description */}
                <div className={cn(
                  "mt-3 pt-3 text-sm border-t border-gray-100",
                  phase.id === 1 ? "text-primary/80" : 
                  phase.id === 2 ? "text-green-600/80" : 
                  phase.id === 3 ? "text-amber-500/80" : 
                  "text-secondary/80"
                )}>
                  <span className="font-medium">Workflow:</span> {phase.workflowDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Phase-specific agents */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-heading text-xl font-medium">
              <span className={cn(
                activePhase === 1 ? "text-primary" : 
                activePhase === 2 ? "text-green-600" : 
                activePhase === 3 ? "text-amber-500" : 
                "text-secondary"
              )}>
                Phase {activePhase}
              </span> Specialist Agents
            </h4>
            
            {/* Phase selector for mobile */}
            <div className="md:hidden">
              <select 
                className="p-2 border border-gray-200 rounded-lg"
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
          
          {/* Phase agents grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {agents
              .filter(agent => 
                agent.phase === activePhase &&
                (filter === 'All Agents' || agent.category === filter)
              )
              .map(agent => (
                <AgentCard key={agent.id} agent={agent} phase={activePhase} />
              ))
            }
            
            {/* Empty state */}
            {agents.filter(agent => 
              agent.phase === activePhase &&
              (filter === 'All Agents' || agent.category === filter)
            ).length === 0 && (
              <div className="col-span-3 py-10 text-center text-gray-500">
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
