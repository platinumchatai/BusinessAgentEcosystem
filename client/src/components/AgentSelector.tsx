import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { agents, AgentType, phases } from "@/data/agents";

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
  
  // Function to handle click and scroll to top
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <motion.div 
      className={`agent-card bg-white rounded-lg shadow-card overflow-hidden 
        ${agent.coordinator ? `border-l-4 ${phase === 1 ? 'border-primary' : phase === 2 ? 'border-green-600' : phase === 3 ? 'border-amber-500' : 'border-secondary'}` : ''}
        cursor-pointer hover:shadow-lg`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <Link href={`/agent/${agent.id}`}>
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
  
  const filteredAgents = agents.filter(agent => 
    agent.phase === activePhase && 
    (searchTerm === '' || agent.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter === 'All Agents' || agent.category === filter)
  );
  
  const categoryFilters = ['All Agents', 'Marketing', 'Finance', 'Product', 'Strategy'];
  
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

      {/* Phase navigation tabs */}
      <div className="mb-8 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {phases.map((phase, index) => (
            <li className="mr-2" role="presentation" key={phase.id}>
              <button 
                className={`inline-block p-4 border-b-2 rounded-t-lg hover:text-primary hover:border-primary 
                  ${activePhase === phase.id ? 'text-primary border-primary' : 'border-transparent'}`}
                onClick={() => setActivePhase(phase.id)}
                type="button" 
                role="tab" 
                aria-selected={activePhase === phase.id}
              >
                Phase {phase.id}: {phase.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search and filter controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search agents..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-icons absolute left-3 top-2 text-gray-400">search</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Phase content */}
      <div className="tab-content">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`${phaseBackgrounds[activePhase-1]} rounded-lg p-6 mb-8 relative overflow-hidden phase-indicator ${phaseIndicators[activePhase-1]}`}
          >
            <h3 className="font-heading font-semibold text-2xl mb-2">
              Phase {currentPhase.id}: {currentPhase.name}
            </h3>
            <p className="text-neutral-400 mb-4">{currentPhase.description}</p>
            
            <div className={`${activePhase === 1 ? 'bg-primary/10' : activePhase === 2 ? 'bg-green-600/10' : activePhase === 3 ? 'bg-amber-500/10' : 'bg-secondary/10'} rounded-lg p-4 mb-6`}>
              <div className="flex items-center">
                <span className={`material-icons ${activePhase === 1 ? 'text-primary' : activePhase === 2 ? 'text-green-600' : activePhase === 3 ? 'text-amber-500' : 'text-secondary'} mr-2`}>
                  group_work
                </span>
                <h4 className="font-heading font-medium">Recommended Workflow</h4>
              </div>
              <p className="text-sm mt-2">{currentPhase.workflowDescription}</p>
              <button 
                className={`mt-3 ${phaseButtonColors[activePhase-1].bg} text-white px-4 py-2 rounded-lg text-sm ${phaseButtonColors[activePhase-1].hover} transition-colors`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Use this workflow
              </button>
            </div>
            
            {/* Agents grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} phase={activePhase} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AgentSelector;
