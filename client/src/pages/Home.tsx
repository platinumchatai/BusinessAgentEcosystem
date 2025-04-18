import { useEffect } from 'react';
import Hero from '@/components/Hero';
import AgentSelector from '@/components/AgentSelector';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import AgentInteraction from '@/components/AgentInteraction';
import ScrollToTop from '@/components/ScrollToTop';

const Home = () => {
  // Ensure page starts at the top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' instead of 'smooth' to prevent scrolling during page load
    });
  }, []);
  
  return (
    <div id="top" className="bg-gray-50">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <AgentSelector />
        <WorkflowVisualizer />
        <AgentInteraction />
      </div>
      
      {/* Floating scroll to top button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
