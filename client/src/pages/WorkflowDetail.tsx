import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { workflows } from "@/data/workflows";
import { phases } from "@/data/agents";
import { ArrowLeft, Users } from "lucide-react";

const WorkflowDetail = () => {
  const { id } = useParams();
  const workflowId = parseInt(id || "1");
  
  // Always scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Find the workflow data
  const workflow = workflows.find(wf => wf.id === workflowId) || workflows[0];
  
  // Find the phase this workflow belongs to
  const phase = phases.find(p => p.id === workflow.phaseId);
  
  // Background colors based on workflow's phase
  const phaseColors = [
    { bg: 'bg-phase1', light: 'bg-primary/10', text: 'text-primary', dark: 'bg-primary' },
    { bg: 'bg-phase2', light: 'bg-green-600/10', text: 'text-green-600', dark: 'bg-green-600' },
    { bg: 'bg-phase3', light: 'bg-amber-500/10', text: 'text-amber-500', dark: 'bg-amber-500' },
    { bg: 'bg-phase4', light: 'bg-secondary/10', text: 'text-secondary', dark: 'bg-secondary' },
  ];
  
  const colors = phaseColors[workflow.phaseId - 1];

  return (
    <div id="top" className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="flex items-center text-primary hover:underline mb-4"
          onClick={() => window.scrollTo(0, 0)}
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
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Workflow Process</h2>
        <div className="relative">
          {workflow.steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="mb-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex">
                <div className="relative mr-4 flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${colors.dark} text-white text-sm font-semibold`}>
                    {step.stepNumber}
                  </div>
                  {index < workflow.steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 absolute top-10"></div>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-neutral-600 mb-4">{step.description}</p>
                  <div className="flex items-center text-sm">
                    <span className={`px-3 py-1 rounded-full ${colors.light} ${colors.text}`}>
                      Agent: {step.agent}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className={`${colors.dark} text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-colors`}
          onClick={() => window.history.back()}
        >
          Return to Selection
        </button>
      </div>
    </div>
  );
};

export default WorkflowDetail;