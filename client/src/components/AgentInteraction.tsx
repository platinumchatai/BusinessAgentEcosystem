import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { agents, AgentType } from "@/data/agents";
import type { Message as DatabaseMessage } from "@shared/schema";
import { formatMessageContent } from "@/lib/formatMessage";

interface Message extends DatabaseMessage {
  agentAvatar?: string;
}

const AgentInteraction = () => {
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [showConnecting, setShowConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages from API
  const { data, refetch } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    staleTime: 0,
  });

  // Use a safe messages array, ensuring it's always defined
  const messages = data || [];

  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const data = { content, agentIds: selectedAgents };
      return await apiRequest('POST', '/api/messages', data);
    },
    onSuccess: () => {
      setMessage('');
      setShowConnecting(true);

      // Simulate time for agent to connect and respond
      setTimeout(() => {
        setShowConnecting(false);
        refetch();
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedAgents.length > 0) {
      sendMessage(message);
    } else if (!selectedAgents.length) {
      toast({
        title: "No agents selected",
        description: "Please select at least one agent to chat with.",
        variant: "destructive",
      });
    }
  };

  // Toggle agent selection
  const toggleAgentSelection = (agentId: number) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId) 
        : [...prev, agentId]
    );
  };

  // REMOVED: Auto-scroll to the most recent message
  // This was causing the page to automatically scroll to the bottom

  const selectedAgentNames = agents
    .filter(agent => selectedAgents.includes(agent.id))
    .map(agent => agent.name)
    .join(', ');

  return (
    <section id="chat" className="mb-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="font-heading font-bold text-3xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Start a Consultation
        </motion.h2>
        <motion.p 
          className="text-neutral-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tell us about your business needs and we'll connect you with the right AI agents.
        </motion.p>
      </div>

      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Agent selection sidebar */}
          <div className="bg-gray-50 p-4 border-r lg:col-span-1">
            <h3 className="font-heading font-semibold text-lg mb-4">Select Agents</h3>

            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="w-full p-2 border border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAgents.map(agent => (
                <div 
                  key={agent.id}
                  className={`flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${selectedAgents.includes(agent.id) ? 'bg-primary/10' : ''}`}
                  onClick={() => toggleAgentSelection(agent.id)}
                >
                  <input 
                    type="checkbox" 
                    id={`agent-${agent.id}`} 
                    className="mr-3"
                    checked={selectedAgents.includes(agent.id)}
                    onChange={() => {}} // Handled by the parent div click
                  />
                  <label htmlFor={`agent-${agent.id}`} className="flex-1 cursor-pointer">
                    <span className="block font-medium">{agent.name}</span>
                    <span className="block text-xs text-neutral-400">{agent.category}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <h4 className="font-heading font-medium text-sm mb-2">Recommended Workflow</h4>
              <button 
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                onClick={() => {
                  // Preset Phase 1 workflow
                  const phase1Agents = agents.filter(agent => agent.phase === 1).map(agent => agent.id);
                  setSelectedAgents(phase1Agents);
                  toast({
                    title: "Phase 1 Workflow Selected",
                    description: "All Phase 1 agents have been added to your consultation.",
                  });
                }}
              >
                Use Phase 1 Workflow
              </button>
            </div>
          </div>

          {/* Chat interface */}
          <div className="p-4 lg:col-span-2 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto mb-4 p-2">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="flex mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="material-icons text-white text-sm">smart_toy</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-sm prose prose-sm max-w-none">
                      <h3>Welcome to Business Agency AI</h3>
                      <p>I'm your Business Development Agent. How can I help with your business today?</p>
                      <ul>
                        <li>Select agents on the left panel to assist you</li>
                        <li>Ask for specific business advice or strategies</li>
                        <li>Request plans or documents in structured format</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg: Message, index: number) => (
                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="material-icons text-white text-sm">smart_toy</span>
                    </div>
                  )}

                  <div className={`${msg.sender === 'user' ? 'bg-primary/10' : 'bg-gray-100'} rounded-lg p-3 max-w-[80%]`}>
                    {msg.sender === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <div 
                        className="text-sm prose prose-sm max-w-none" 
                        dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                      />
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 flex-shrink-0">
                      <span className="material-icons text-white text-sm">person</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Agent connection notice */}
              {showConnecting && (
                <div className="text-center text-xs text-neutral-400 my-4">
                  <span>Connecting with agents...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="border-t pt-4">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isPending || selectedAgents.length === 0}
                />
                <button 
                  type="submit"
                  className="bg-primary text-white px-4 rounded-r-lg hover:bg-primary-dark transition-colors disabled:bg-gray-300"
                  disabled={isPending || !message.trim() || selectedAgents.length === 0}
                >
                  <span className="material-icons">send</span>
                </button>
              </div>
              <div className="text-xs text-neutral-400 mt-2 flex items-center">
                <span className="material-icons text-xs mr-1">info</span>
                <span>
                  {selectedAgents.length > 0 
                    ? `Connected with: ${selectedAgentNames}` 
                    : 'Please select at least one agent to start a conversation'}
                </span>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AgentInteraction;