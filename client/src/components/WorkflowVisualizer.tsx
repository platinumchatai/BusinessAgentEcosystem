import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { workflows, WorkflowType } from "@/data/workflows";

const WorkflowVisualizer = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>(workflows[0]);
  const workflowRef = useRef<HTMLDivElement>(null);
  const [connectionLines, setConnectionLines] = useState<JSX.Element[]>([]);

  // Calculate and draw the connection lines between workflow steps
  useEffect(() => {
    if (!workflowRef.current) return;

    const stepElements = workflowRef.current.querySelectorAll('.workflow-step');
    const lines: JSX.Element[] = [];

    for (let i = 0; i < stepElements.length - 1; i++) {
      const current = stepElements[i].getBoundingClientRect();
      const next = stepElements[i + 1].getBoundingClientRect();
      const containerRect = workflowRef.current.getBoundingClientRect();

      const isVertical = window.innerWidth < 768; // Mobile view is vertical

      if (isVertical) {
        // Vertical line for mobile
        lines.push(
          <div
            key={`line-${i}`}
            className="workflow-line"
            style={{
              left: current.left - containerRect.left + current.width / 2,
              top: current.bottom - containerRect.top,
              width: 2,
              height: next.top - current.bottom,
            }}
          />
        );
      } else {
        // Horizontal line for desktop
        lines.push(
          <div
            key={`line-${i}`}
            className="workflow-line"
            style={{
              left: current.right - containerRect.left,
              top: current.top - containerRect.top + current.height / 2,
              width: next.left - current.right,
              height: 2,
            }}
          />
        );
      }
    }

    setConnectionLines(lines);
  }, [activeWorkflow, workflowRef.current]);

  // Re-calculate lines on window resize
  useEffect(() => {
    const handleResize = () => {
      if (workflowRef.current) {
        const stepElements = workflowRef.current.querySelectorAll('.workflow-step');
        const lines: JSX.Element[] = [];

        for (let i = 0; i < stepElements.length - 1; i++) {
          const current = stepElements[i].getBoundingClientRect();
          const next = stepElements[i + 1].getBoundingClientRect();
          const containerRect = workflowRef.current.getBoundingClientRect();

          const isVertical = window.innerWidth < 768; // Mobile view is vertical

          if (isVertical) {
            // Vertical line for mobile
            lines.push(
              <div
                key={`line-${i}`}
                className="workflow-line"
                style={{
                  left: current.left - containerRect.left + current.width / 2,
                  top: current.bottom - containerRect.top,
                  width: 2,
                  height: next.top - current.bottom,
                }}
              />
            );
          } else {
            // Horizontal line for desktop
            lines.push(
              <div
                key={`line-${i}`}
                className="workflow-line"
                style={{
                  left: current.right - containerRect.left,
                  top: current.top - containerRect.top + current.height / 2,
                  width: next.left - current.right,
                  height: 2,
                }}
              />
            );
          }
        }

        setConnectionLines(lines);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const phaseColors = [
    { bg: 'bg-phase1', indicator: 'phase1-indicator', text: 'text-blue-700', accent: 'bg-blue-700' },
    { bg: 'bg-phase2', indicator: 'phase2-indicator', text: 'text-blue-700', accent: 'bg-blue-700' },
    { bg: 'bg-phase3', indicator: 'phase3-indicator', text: 'text-blue-700', accent: 'bg-blue-700' },
    { bg: 'bg-phase4', indicator: 'phase4-indicator', text: 'text-blue-700', accent: 'bg-blue-700' },
  ];

  const colors = phaseColors[activeWorkflow.phaseId - 1];

  return (
    <section id="workflows" className="mb-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="font-heading font-bold text-3xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Agent Workflows
        </motion.h2>
        <motion.p 
          className="text-neutral-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          See how our agents work together to deliver comprehensive solutions for each business phase.
        </motion.p>
      </div>
      
      {/* Workflow selector tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {workflows.map((workflow) => (
          <button 
            key={workflow.id}
            className={`px-4 py-2 rounded-lg transition-colors ${activeWorkflow.id === workflow.id ? 'bg-blue-900 text-white' : 'bg-white border border-gray-200 hover:bg-blue-50'}`}
            onClick={() => setActiveWorkflow(workflow)}
          >
            Phase {workflow.phaseId}: {workflow.name}
          </button>
        ))}
      </div>
      
      {/* Workflow visualization */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={activeWorkflow.id}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-semibold text-xl">
            Phase {activeWorkflow.phaseId}: {activeWorkflow.name} Workflow
          </h3>
          <Link 
            href={`/workflow/${activeWorkflow.phaseId}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-md hover:opacity-90 transition-colors"
          >
            Use this workflow
          </Link>
        </div>
        
        <div className="relative" ref={workflowRef}>
          {/* Workflow steps */}
          <div className="flex flex-col md:flex-row gap-4 py-8 relative">
            {activeWorkflow.steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className={`workflow-step flex-1 ${colors.bg} rounded-lg p-4 relative z-10`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`${colors.accent} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-3`}>
                  {step.stepNumber}
                </div>
                <h4 className="font-heading font-medium text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-400">{step.description}</p>
                <div className={`mt-3 flex items-center ${colors.text} text-sm`}>
                  <span className="material-icons text-sm mr-1">person</span>
                  <span>{step.agent}</span>
                </div>
              </motion.div>
            ))}
            
            {/* Connection lines */}
            {connectionLines}
          </div>
          
          {/* Coordinator indicator */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <span className="material-icons text-blue-700 mr-2">
                hub
              </span>
              <h4 className="font-heading font-medium">Workflow Coordinator</h4>
            </div>
            <p className="text-sm mt-2">
              The {activeWorkflow.coordinator} oversees this entire workflow, ensuring all specialized agents work together coherently.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkflowVisualizer;
