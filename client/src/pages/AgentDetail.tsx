import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { agents, phases } from "@/data/agents";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatMessageContent } from "@/lib/formatMessage";

const AgentDetail = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [showConnecting, setShowConnecting] = useState(false);
  const { toast } = useToast();

  // Scroll to top when component mounts or when agent ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find the agent from the data
  const agent = agents.find(agent => agent.id === Number(id));

  // If agent not found, show error
  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Agent Not Found</h2>
          <p className="mb-6">Sorry, the agent you're looking for doesn't exist.</p>
          <Link href="/" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Find the phase this agent belongs to
  const phase = phases.find(phase => phase.id === agent.phase);

  // Background colors based on agent's phase
  const phaseColors = [
    { bg: 'bg-phase1', light: 'bg-primary/10', text: 'text-primary', dark: 'bg-primary' },
    { bg: 'bg-phase2', light: 'bg-green-600/10', text: 'text-green-600', dark: 'bg-green-600' },
    { bg: 'bg-phase3', light: 'bg-amber-500/10', text: 'text-amber-500', dark: 'bg-amber-500' },
    { bg: 'bg-phase4', light: 'bg-secondary/10', text: 'text-secondary', dark: 'bg-secondary' },
  ];

  const colors = phaseColors[agent.phase - 1];

  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('POST', '/api/agent-message', { content, agentId: agent.id });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setMessage("");
      setShowConnecting(true);

      // Simulate agent typing delay
      setTimeout(() => {
        setShowConnecting(false);
        setAgentResponse(data.response);
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle submit message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: message,
            agentIds: [agent.id],
            conversationId: null
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAgentResponse(data.response);
        } else {
          setAgentResponse('Sorry, I encountered an error. Please try again.');
        }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/#agents-section" 
          className="flex items-center text-primary hover:underline mb-4"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Back to all agents
        </Link>

        <div className={`${colors.bg} rounded-lg overflow-hidden`}>
          <div className="p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="mb-4 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.light} ${colors.text} mr-3`}>
                    {agent.coordinator ? 'Coordinator' : agent.category}
                  </span>
                  <span className="text-sm text-white font-medium">
                    Phase {agent.phase}: {phase?.name}
                  </span>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-white">{agent.name}</h1>
                <p className="text-white font-light max-w-3xl">{agent.description}</p>
              </div>

              <div className={`bg-white/20 p-4 rounded-lg self-start shadow-sm`}>
                <h3 className="font-medium mb-2 text-white">Expertise Areas</h3>
                <ul className="space-y-1">
                  {agent.expertise.map((item, index) => (
                    <li key={index} className="flex items-center text-white">
                      <span className="material-icons text-sm mr-2">check_circle</span>
                      <span className="font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border-b pb-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">About {agent.name}</h2>
            </div>
            <div className="prose max-w-none">
              <p>
                The {agent.name} is a specialized AI assistant focused on helping businesses
                in the {phase?.name.toLowerCase()} phase. With expertise in {agent.expertise.join(', ')},
                this agent provides valuable insights and guidance to entrepreneurs and business owners.
              </p>

              <h3>When to Use This Agent</h3>
              <ul>
                {agent.whenToUse.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3>Key Capabilities</h3>
              <ul>
                {agent.capabilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          {agent.relatedAgents.length > 0 && (
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="border-b pb-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Related Agents</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.relatedAgents.map(relatedId => {
                  const related = agents.find(a => a.id === relatedId);
                  if (!related) return null;

                  const relatedColors = phaseColors[related.phase - 1];

                  return (
                    <Link key={related.id} href={`/agent/${related.id}`}>
                      <div 
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{related.name}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${relatedColors.light} ${relatedColors.text} font-medium`}>
                            Phase {related.phase}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{related.description.substring(0, 100)}...</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className={`${colors.dark} text-white p-4`}>
              <h2 className="font-bold">Chat with {agent.name}</h2>
            </div>

            <div className="flex flex-col h-[calc(100%-60px)]">
              <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                <div className="flex mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="material-icons text-white text-sm">smart_toy</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800 font-medium">
                      Hello! I'm your {agent.name}. How can I assist you with {agent.expertise.join(', ')} today?
                    </p>
                  </div>
                </div>

                {agentResponse && (
                  <>
                    <div className="flex mb-4 justify-end">
                      <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm text-primary-dark font-medium">{message}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 flex-shrink-0">
                        <span className="material-icons text-white text-sm">person</span>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="material-icons text-white text-sm">smart_toy</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <div 
                          className="text-sm text-gray-800"
                          dangerouslySetInnerHTML={{ __html: formatMessageContent(agentResponse) }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {showConnecting && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 rounded-full px-4 py-1">
                      <span className="text-xs text-gray-600 font-medium">{agent.name} is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Ask a question..." 
                    className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPending}
                  />
                  <button 
                    type="submit"
                    className={`${colors.dark} text-white px-4 rounded-r-lg hover:opacity-90 transition-colors disabled:bg-gray-300`}
                    disabled={isPending || !message.trim()}
                  >
                    <span className="material-icons">send</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;