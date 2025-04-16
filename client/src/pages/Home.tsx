import Hero from '@/components/Hero';
import AgentSelector from '@/components/AgentSelector';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import AgentInteraction from '@/components/AgentInteraction';

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <AgentSelector />
        <WorkflowVisualizer />
        <AgentInteraction />
      </div>
    </div>
  );
};

export default Home;
