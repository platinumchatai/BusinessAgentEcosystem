import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { workflows } from "@/data/workflows";
import { phases, agents, AgentType } from "@/data/agents";
import { ArrowLeft, Users, Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const WorkflowDetail = () => {
  const { id } = useParams();
  const workflowId = parseInt(id || "1");
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string, from?: string}[]>([
    {
      role: "assistant",
      content: "Welcome to the workflow chat! I'll help coordinate this entire process. What would you like to know or discuss about your business needs?",
      from: "Coordinator"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Always scroll to top when this page loads
  useEffect(() => {
    // Force scroll to top with immediate effect
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Use 'auto' instead of 'smooth' for immediate positioning
    });
    
    // Set a fallback in case the first method doesn't work
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For Safari
    }, 0);
  }, [id]);
  
  // Find the workflow data
  const workflow = workflows.find(wf => wf.id === workflowId) || workflows[0];
  
  // Find the phase this workflow belongs to
  const phase = phases.find(p => p.id === workflow.phaseId);
  
  // Find agents involved in this workflow
  const workflowAgents = agents.filter(agent => 
    workflow.steps.some(step => step.agent === agent.name) || 
    agent.name === workflow.coordinator
  );
  
  // Background colors based on workflow's phase
  const phaseColors = [
    { bg: 'bg-phase1', light: 'bg-primary/10', text: 'text-primary', dark: 'bg-primary' },
    { bg: 'bg-phase2', light: 'bg-green-600/10', text: 'text-green-600', dark: 'bg-green-600' },
    { bg: 'bg-phase3', light: 'bg-amber-500/10', text: 'text-amber-500', dark: 'bg-amber-500' },
    { bg: 'bg-phase4', light: 'bg-secondary/10', text: 'text-secondary', dark: 'bg-secondary' },
  ];
  
  const colors = phaseColors[workflow.phaseId - 1];
  
  // Handle chat submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      role: "user",
      content: userInput
    }]);
    
    // Clear input and set loading
    setUserInput("");
    setIsLoading(true);
    
    // Simulate response time
    setTimeout(() => {
      // Add mock response from coordinator
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `This is a simulated response. In the actual application, this would be a response from our AI agents working together to address your query: "${userInput}"`,
        from: "Coordinator"
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div id="top" className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/#workflows" 
          className="flex items-center text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all workflows
        </Link>
        
        <div className={`${colors.bg} rounded-lg overflow-hidden`}>
          <div className="p-8">
            <div className="flex flex-col">
              <div className="mb-4 flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${colors.light} ${colors.text} mr-3`}>
                  Phase {workflow.phaseId}: {phase?.name}
                </span>
                <span className="flex items-center text-sm text-neutral-500">
                  <Users className="h-4 w-4 mr-1" />
                  Coordinated by {workflow.coordinator}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{workflow.name}</h1>
              <p className="text-neutral-600 max-w-3xl">{workflow.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Horizontal Workflow Process */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 mb-10">
        <h2 className="text-lg font-medium mb-6">Workflow Process</h2>
        
        {/* Horizontal Steps */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-0 right-0 top-8 h-0.5 bg-gray-200 -z-10"></div>
          
          {workflow.steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="mb-8 md:mb-0 relative flex flex-col items-center max-w-[250px] text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 flex items-center justify-center rounded-full ${colors.dark} text-white text-xl font-medium mb-4 z-10`}>
                {step.stepNumber}
              </div>
              <h3 className="text-base font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{step.description}</p>
              <span className={`px-3 py-1 rounded-full text-xs ${colors.light} ${colors.text}`}>
                {step.agent}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Workflow Coordinator info */}
        <div className="bg-blue-50 p-4 rounded-md mt-6">
          <div className="flex items-center">
            <span className="material-icons text-blue-600 mr-2">hub</span>
            <h5 className="font-medium text-sm">Workflow Coordinator</h5>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            The {workflow.coordinator} oversees this entire workflow, ensuring all specialized agents work together coherently.
          </p>
        </div>
      </div>
      
      {/* Workflow Agents */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 mb-10">
        <h2 className="text-lg font-medium mb-6">Workflow Agents</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowAgents.map(agent => (
            <div 
              key={agent.id}
              className="bg-gray-50 rounded-md p-4 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-base">{agent.name}</h5>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {agent.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{agent.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Phase {agent.phase}</span>
                {agent.coordinator && (
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    Coordinator
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      

      
      <div className="flex justify-center mb-10">
        <button 
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => window.history.back()}
        >
          Return to Selection
        </button>
      </div>
    </div>
  );
};

export default WorkflowDetail;