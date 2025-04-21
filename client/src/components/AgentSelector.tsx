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
    { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', textColor: 'text-blue-600' },
    { bg: 'bg-green-600', hover: 'hover:bg-green-700', textColor: 'text-green-600' },
    { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', textColor: 'text-amber-500' },
    { bg: 'bg-secondary', hover: 'hover:bg-secondary-dark', textColor: 'text-secondary' },
  ];
  
  const color = phaseColors[phase - 1];
  
  return (
    <motion.div 
      className={`agent-card bg-white rounded-xl shadow-sm overflow-hidden 
        ${agent.coordinator ? `border-l-4 ${phase === 1 ? 'border-blue-600' : phase === 2 ? 'border-green-600' : phase === 3 ? 'border-amber-500' : 'border-secondary'}` : ''}
        cursor-pointer hover:shadow-md`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href={`/agent/${agent.id}`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-heading font-semibold text-lg text-gray-800">{agent.name}</h5>
            <span className={`
              ${agent.coordinator 
                ? `${phase === 1 ? 'bg-blue-100 text-blue-700' : phase === 2 ? 'bg-green-100 text-green-700' : phase === 3 ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`
                : 'bg-gray-100 text-gray-700'} 
              text-xs px-2 py-1 rounded-full font-medium`}
            >
              {agent.coordinator ? 'Coordinator' : agent.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{agent.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500">
              {`Phase ${phase}${agent.coordinator ? ' Primary' : ''}`}
            </span>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center ${color.bg} text-white ${color.hover}`}>
              <span className="material-icons text-sm">arrow_forward</span>
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
  
  // Category color mapping
  const categoryColors = {
    'Marketing': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Finance': { bg: 'bg-green-100', text: 'text-green-700' },
    'Product': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Strategy': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'All Agents': { bg: 'bg-gray-100', text: 'text-gray-700' }
  } as const;
  
  // Helper function to get category color styles
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Marketing':
        return categoryColors['Marketing'];
      case 'Finance':
        return categoryColors['Finance'];
      case 'Product':
        return categoryColors['Product'];
      case 'Strategy':
        return categoryColors['Strategy'];
      default:
        return categoryColors['All Agents'];
    }
  };
  
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

      {/* Top-level category filters - with consistent color scheme */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
        {categoryFilters.map(category => (
          <button 
            key={category}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              filter === category 
                ? category === 'Marketing' ? 'bg-amber-600 text-white font-medium shadow-sm' :
                  category === 'Finance' ? 'bg-green-600 text-white font-medium shadow-sm' :
                  category === 'Product' ? 'bg-purple-600 text-white font-medium shadow-sm' :
                  category === 'Strategy' ? 'bg-blue-600 text-white font-medium shadow-sm' :
                  'bg-gray-800 text-white font-medium shadow-sm'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Agents - Improved */}
      <div className="mb-12 max-w-4xl mx-auto">
        <h3 className="font-heading text-xl font-medium mb-6 text-center">Featured Agents</h3>
        
        {/* 2x2 Grid for Featured Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredAgents.map(agent => (
            <div 
              key={agent.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5"
            >
              <Link 
                href={`/agent/${agent.id}`}
                className="block"
              >
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-medium text-lg text-gray-800">{agent.name}</h5>
                  <span className={`
                    ${getCategoryColors(agent.category).bg} 
                    ${getCategoryColors(agent.category).text}
                    text-xs px-2.5 py-1 rounded-full font-medium`}
                  >
                    {agent.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{agent.description}</p>
                <div className="flex justify-start items-center">
                  <span className="text-xs font-medium text-gray-500">
                    Phase {agent.phase}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* "See Other Agents" Button - Improved */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setShowAllAgents(!showAllAgents)}
            className="flex items-center gap-1.5 bg-white text-gray-700 border border-gray-300 px-5 py-2 text-sm rounded-full hover:bg-gray-50 shadow-sm transition-colors font-medium"
          >
            {showAllAgents ? (
              <>
                <span className="material-icons text-sm">expand_less</span>
                Hide Other Agents
              </>
            ) : (
              <>
                <span className="material-icons text-sm">expand_more</span>
                See Other Agents
              </>
            )}
          </button>
        </div>
        
        {/* Other Agents Section - Improved */}
        {showAllAgents && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all"
                  >
                    <Link 
                      href={`/agent/${agent.id}`}
                      className="block"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-base text-gray-800">{agent.name}</h5>
                        <span className={`
                          ${getCategoryColors(agent.category).bg} 
                          ${getCategoryColors(agent.category).text} 
                          text-xs px-2 py-0.5 rounded-full font-medium`}
                        >
                          {agent.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{agent.description}</p>
                      <div className="flex justify-end">
                        <span className="text-xs font-medium text-gray-500">Phase {agent.phase}</span>
                      </div>
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Consultation Button - Improved */}
      <div className="mt-12 mb-16 text-center">
        <Link 
          href="/consultation" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-accent hover:bg-accent/90 transition-all shadow-md font-semibold"
        >
          <span className="material-icons text-sm">chat</span>
          Start Agency Consultation
        </Link>
        <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
          Chat with our agency assistant to learn about our services and subscription options
        </p>
      </div>
    </section>
  );
};

export default AgentSelector;
