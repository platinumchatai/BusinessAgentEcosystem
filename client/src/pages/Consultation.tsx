import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SendHorizontal, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi there! 👋 I\'m the Business Agency AI Assistant. I can answer your questions about our services, agents, and subscription options. How can I help you today?',
    timestamp: new Date(),
  },
];

// Pre-defined responses for the agency assistant
const AGENCY_RESPONSES: Record<string, string> = {
  'subscription': `
    <div>
      <h3 class="text-lg font-medium mb-2">Our Subscription Options</h3>
      <ul class="space-y-2">
        <li><strong>Basic Plan ($29/month)</strong>: Access to individual agents for focused expertise.</li>
        <li><strong>Professional Plan ($79/month)</strong>: Full access to all preset workflows and individual agents.</li>
        <li><strong>Enterprise Plan ($199/month)</strong>: Custom AI agent solutions tailored to your specific business needs.</li>
      </ul>
      <p class="mt-3">Subscribe to start working with our specialized agents and workflows. You can visit our <a href="/subscribe" class="text-blue-600 hover:underline">subscription page</a> to learn more.</p>
    </div>
  `,
  'workflows': `
    <div>
      <h3 class="text-lg font-medium mb-2">About Our Workflows</h3>
      <p>Our AI workflows combine multiple specialized agents working together under a coordinator to solve complex business challenges.</p>
      <p class="mt-2">We offer workflows for each phase of business development:</p>
      <ul class="mt-2 space-y-1">
        <li>• <strong>Phase 1</strong>: Ideation & Concept Development</li>
        <li>• <strong>Phase 2</strong>: Launch & Market Entry Strategy</li>
        <li>• <strong>Phase 3</strong>: Growth & Scaling Solutions</li>
        <li>• <strong>Phase 4</strong>: Optimization & Expansion Planning</li>
      </ul>
      <p class="mt-3">Each workflow combines the best agents for that business stage to provide comprehensive solutions.</p>
    </div>
  `,
  'agents': `
    <div>
      <h3 class="text-lg font-medium mb-2">Our AI Agent Ecosystem</h3>
      <p>Our platform features 16 specialized AI agents, each with unique expertise:</p>
      <ul class="mt-2 space-y-1">
        <li>• <strong>Business Development Agents</strong>: Strategic planning and business model optimization</li>
        <li>• <strong>Marketing & Branding Agents</strong>: Brand identity, marketing strategy, and customer acquisition</li>
        <li>• <strong>Financial Agents</strong>: Budgeting, financial projections, and investment analysis</li>
        <li>• <strong>Operations Agents</strong>: Process optimization, logistics, and operational efficiency</li>
      </ul>
      <p class="mt-3">You can explore all our agents from the home page and learn about their specific capabilities.</p>
    </div>
  `,
  'help': `
    <div>
      <h3 class="text-lg font-medium mb-2">How Can I Help You?</h3>
      <p>Here are some things you can ask me about:</p>
      <ul class="mt-2 space-y-1">
        <li>• Information about our subscription plans</li>
        <li>• Details about our AI agents and their capabilities</li>
        <li>• Explanation of our workflows and how they function</li>
        <li>• Next steps to get started with our platform</li>
        <li>• General information about our agency</li>
      </ul>
      <p class="mt-3">Feel free to ask any questions you have!</p>
    </div>
  `,
  'get started': `
    <div>
      <h3 class="text-lg font-medium mb-2">Getting Started</h3>
      <p>Here's how to get started with our AI agency platform:</p>
      <ol class="mt-2 space-y-2">
        <li><strong>1. Explore</strong>: Browse our agents and workflows on the home page to understand our capabilities</li>
        <li><strong>2. Subscribe</strong>: Choose a subscription plan that best fits your needs</li>
        <li><strong>3. Create Account</strong>: Set up your profile with username, password, and optional profile picture</li>
        <li><strong>4. Start Using</strong>: Begin interacting with agents or use complete workflows for comprehensive solutions</li>
      </ol>
      <p class="mt-3">To get started right away, <a href="/subscribe" class="text-blue-600 hover:underline">visit our subscription page</a>.</p>
    </div>
  `,
  'default': `I'm here to provide information about our agency, our AI agents, and subscription options. I can't provide specific business plans, but I can guide you to the right resources and agents that can help you. What specific area of our services would you like to know more about?`
};

const generateResponse = (message: string): string => {
  // Convert message to lowercase for easier keyword matching
  const lowerMessage = message.toLowerCase();
  
  // Check for subscription related questions
  if (lowerMessage.includes('subscription') || lowerMessage.includes('pricing') || lowerMessage.includes('plan') || lowerMessage.includes('cost')) {
    return AGENCY_RESPONSES['subscription'];
  }
  
  // Check for workflow related questions
  if (lowerMessage.includes('workflow') || lowerMessage.includes('process') || lowerMessage.includes('phases')) {
    return AGENCY_RESPONSES['workflows'];
  }
  
  // Check for agent related questions
  if (lowerMessage.includes('agent') || lowerMessage.includes('expert') || lowerMessage.includes('assistance')) {
    return AGENCY_RESPONSES['agents'];
  }
  
  // Check for help or general questions
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('what do you do')) {
    return AGENCY_RESPONSES['help'];
  }
  
  // Check for getting started questions
  if (lowerMessage.includes('get started') || lowerMessage.includes('begin') || lowerMessage.includes('start') || lowerMessage.includes('setup')) {
    return AGENCY_RESPONSES['get started'];
  }
  
  // Default response
  return AGENCY_RESPONSES['default'];
};

const Consultation = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate API delay for more realistic experience
    setTimeout(() => {
      // Generate assistant response based on user input
      const responseContent = generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chat panel */}
          <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 p-4 bg-gray-50">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 bg-primary text-white">
                  <Bot size={20} />
                </Avatar>
                <div className="ml-3">
                  <h2 className="text-lg font-medium">Agency Consultation</h2>
                  <p className="text-sm text-gray-500">Ask about our services, agents, and options</p>
                </div>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="h-[600px] overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "mb-4 max-w-[80%]",
                    message.role === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "rounded-lg p-3 shadow-sm",
                    message.role === "user" 
                      ? "bg-primary text-white font-medium rounded-br-none" 
                      : "bg-gray-100 border border-gray-200 text-gray-800 font-medium rounded-bl-none"
                  )}>
                    {message.role === "assistant" ? (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} className="prose prose-sm max-w-none" />
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    {message.role === "user" ? (
                      <div className="ml-auto flex items-center">
                        <span>You</span>
                        <User className="h-3 w-3 ml-1" />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Bot className="h-3 w-3 mr-1" />
                        <span>Agency Assistant</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 shadow-sm rounded-full px-4 py-1">
                    <span className="text-xs text-gray-600 font-medium">Agency Assistant is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about our services, agents, or subscriptions..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                  disabled={isLoading}
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700",
                    (isLoading || !inputValue.trim()) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          
          {/* Info sidebar */}
          <div className="lg:w-80 bg-white rounded-lg shadow-md border border-gray-100 p-6 h-fit">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Subscription Plans</h4>
                <p className="text-sm text-gray-500 mt-1">Choose a plan that fits your business needs</p>
                <Link href="/subscribe">
                  <Button variant="outline" className="w-full mt-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Plans
                  </Button>
                </Link>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700">Agent Explorer</h4>
                <p className="text-sm text-gray-500 mt-1">Browse all available AI business agents</p>
                <Link href="/#agents">
                  <Button variant="outline" className="w-full mt-2">
                    Explore Agents
                  </Button>
                </Link>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700">Workflows</h4>
                <p className="text-sm text-gray-500 mt-1">See how our agents work together</p>
                <Link href="/">
                  <Button variant="outline" className="w-full mt-2">
                    Browse Workflows
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 mt-3 border-t border-gray-100 bg-blue-50 p-4 -mx-4 rounded-md">
                <h4 className="text-sm font-medium text-blue-700">Ready to get started?</h4>
                <p className="text-sm text-blue-600 mt-1">Subscribe now to access our AI agent ecosystem</p>
                <Link href="/subscribe">
                  <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Consultation;