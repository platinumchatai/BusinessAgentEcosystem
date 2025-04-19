import { useEffect } from 'react';
import Hero from '@/components/Hero';
import AgentSelector from '@/components/AgentSelector';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ScrollToTop from '@/components/ScrollToTop';

const Home = () => {
  // Ensure page starts at the top on first render
  // Or scrolls to workflows section if coming from a workflow detail page
  useEffect(() => {
    const scrollToWorkflows = sessionStorage.getItem("scrollToWorkflows");
    
    if (scrollToWorkflows === "true") {
      // Clear the flag
      sessionStorage.removeItem("scrollToWorkflows");
      
      // Small delay to ensure the page is fully rendered before scrolling
      setTimeout(() => {
        const workflowsSection = document.getElementById("workflows");
        if (workflowsSection) {
          workflowsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Simple and direct scroll to top
      window.scrollTo(0, 0);
    }
  }, []);
  
  return (
    <div id="top" className="bg-gray-50">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <AgentSelector />
        <WorkflowVisualizer />
      </div>
      
      {/* Floating scroll to top button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
