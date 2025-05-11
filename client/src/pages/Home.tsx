import { useEffect } from 'react';
import Hero from '@/components/Hero';
import AgentSelector from '@/components/AgentSelector';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import ScrollToTop from '@/components/ScrollToTop';
import MainLayout from '@/layouts/MainLayout';

const Home = () => {
  // Ensure page starts at the top on first render
  // Or scrolls to specific section if redirected from another page
  useEffect(() => {
    const scrollToWorkflows = sessionStorage.getItem("scrollToWorkflows");
    const scrollToAgents = sessionStorage.getItem("scrollToAgents");
    
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
    } 
    else if (scrollToAgents === "true") {
      // Clear the flag
      sessionStorage.removeItem("scrollToAgents");
      
      // Small delay to ensure the page is fully rendered before scrolling
      setTimeout(() => {
        const agentsSection = document.getElementById("agents-section");
        if (agentsSection) {
          agentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } 
    else {
      // Simple and direct scroll to top
      window.scrollTo(0, 0);
    }
  }, []);
  
  return (
    <MainLayout>
      <div id="top">
        <Hero />
        <div className="container mx-auto px-4 py-12 bg-white rounded-t-[40px] -mt-6 relative z-10">
          <AgentSelector />
          <WorkflowVisualizer />
        </div>
        
        {/* Floating scroll to top button */}
        <ScrollToTop />
      </div>
    </MainLayout>
  );
};

export default Home;
