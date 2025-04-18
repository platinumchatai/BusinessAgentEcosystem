import { useEffect } from 'react';
import Hero from '@/components/Hero';
import AgentSelector from '@/components/AgentSelector';
import ScrollToTop from '@/components/ScrollToTop';

const Home = () => {
  // Ensure page starts at the top on first render
  useEffect(() => {
    // Simple and direct scroll to top
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div id="top" className="bg-gray-50">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <AgentSelector />
      </div>
      
      {/* Floating scroll to top button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
