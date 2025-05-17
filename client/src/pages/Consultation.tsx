import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SendHorizontal, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import BackNavigation from '@/components/BackNavigation';
import { cn } from '@/lib/utils';
import { formatMessageContent } from '@/lib/formatMessage';
import { analyzeConsultation, getPersonalizedContent, getRecommendedAgents } from '@/lib/consultationAnalyzer';

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
    content: `
      <div>
        <p>Hi there! 👋 I'm the Business Agency AI Assistant. I'd love to understand more about your business so I can provide personalized recommendations.</p>
        
        <p class="mt-3">To get started, could you tell me:</p>
        <ul class="list-disc pl-6 mt-2 space-y-1">
          <li>What's your business name and industry?</li>
          <li>What are your biggest business challenges right now?</li>
          <li>What are your main goals for the next 6-12 months?</li>
          <li>Are there specific areas where you need help (marketing, operations, finance, etc.)?</li>
        </ul>
        
        <p class="mt-3">The more you share, the better I can tailor our AI agents and solutions to your specific needs!</p>
      </div>
    `,
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
  
  // If message contains specific business challenges, goals, or marketing needs
  // Don't return a canned response, let the consultation analyzer handle it
  if ((lowerMessage.includes('challenge') || lowerMessage.includes('client') || 
       lowerMessage.includes('marketing') || lowerMessage.includes('improve') || 
       lowerMessage.includes('goal') || lowerMessage.includes('month')) && 
      lowerMessage.length > 50) {
    // Return an empty response so the analyzer will take over
    return '';
  }
  
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to generate response with potential content from the analyzer
  const generateEnhancedResponse = async (userMessage: string) => {
    // Process messages with any business info or specific challenges/goals mentioned
    // More aggressive triggering to ensure we catch all potential business details
    const containsBusinessInfo = userMessage.length > 50 || 
                               userMessage.toLowerCase().includes('business') ||
                               userMessage.toLowerCase().includes('challenge') ||
                               userMessage.toLowerCase().includes('goal') ||
                               userMessage.toLowerCase().includes('client') ||
                               userMessage.toLowerCase().includes('market') ||
                               userMessage.toLowerCase().includes('improve');
       
    // Standard response based on keywords
    let responseContent = generateResponse(userMessage);
    
    // Combine all previous user messages to provide context for analysis
    const allUserMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ');
    
    const textToAnalyze = allUserMessages + ' ' + userMessage;
    
    // Always try to analyze and enhance the response for anything except very short messages
    if (userMessage.length > 20) {
      setIsAnalyzing(true);
      
      try {
        // Analyze the full conversation context
        const results = await analyzeConsultation(textToAnalyze);
        setAnalysisResults(results);
        
        // Extract personalized content
        const personalizedContent = getPersonalizedContent(results);
        
        // Create a professional, sales-oriented response focusing on package tiers and specific business benefits
        // Format with rich, well-structured HTML for better presentation
        const businessName = results.businessName || "your business";
        const businessType = results.businessType || "business";
        const packageTier = results.recommendedPackage?.split(' at ')[0] || "Professional Plan";
        const packagePrice = results.recommendedPackage?.split(' at ')[1] || "$79/month";
        
        // Get business goals or provide defaults
        const businessGoals = results.businessGoals && results.businessGoals.length > 0 
          ? results.businessGoals.join(' and ') 
          : "achieve your business objectives";
          
        responseContent = `
          <div>
            <div class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              <div class="p-4">
                <p>${personalizedContent.replace(/\n\n/g, '</p><p class="mt-3">')}</p>
              </div>
            </div>
            
            <div class="mt-5 p-4 border border-blue-100 bg-blue-50 rounded-md">
              <h4 class="text-lg font-semibold mb-3">Your Personalized Recommendation</h4>
              
              <p class="mb-3">Based on <strong>${businessName}</strong>'s specific needs as a ${businessType}, you would be best suited for our <strong>${packageTier} (${packagePrice})</strong>.</p>
              
              <p class="mb-2"><strong>This package includes these specialized AI agents:</strong></p>
              <ul class="list-disc pl-6 mb-4 space-y-1">
                ${results.recommendedAgents.map(agent => 
                  `<li><strong>${agent}</strong> - Helping you develop your ${businessType} and ${results.businessChallenges?.[0] ? `overcome challenges like ${results.businessChallenges[0]}` : 'overcome industry challenges'}</li>`
                ).join('')}
              </ul>
              
              <p class="mb-2">Together, these agents will help ${businessName}:</p>
              <ul class="list-disc pl-6 mb-3 space-y-1">
                <li>Develop targeted strategies for ${businessType} growth</li>
                <li>${businessGoals}</li>
                <li>Stay ahead of competitors in the ${businessType} market</li>
              </ul>
              
              <p class="mt-3 text-sm font-medium">We also offer these alternative tiers:</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span class="px-3 py-1 ${packageTier.includes('Basic') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Basic Plan ($29/month)</span>
                <span class="px-3 py-1 ${packageTier.includes('Professional') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Professional Plan ($79/month)</span>
                <span class="px-3 py-1 ${packageTier.includes('Enterprise') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Enterprise Plan ($199/month)</span>
              </div>
            </div>
            
            <div class="mt-4">
              <p class="font-medium">Would you like me to explain how our ${packageTier} will specifically help ${businessName} achieve ${results.businessGoals?.[0] || 'your business goals'}?</p>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Analysis failed:', error);
        // The standard response will be used if analysis fails
      } finally {
        setIsAnalyzing(false);
      }
    }
    
    return responseContent;
  };
  
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
    
    try {
      // Generate enhanced response based on user input
      const responseContent = await generateEnhancedResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Ask follow-up questions if we need more business details
      // This happens if the user's message is short and it's early in the conversation
      if (messages.length <= 2 && userMessage.content.length < 100) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `
              <div>
                <p>To provide you with more tailored recommendations, could you share a bit more about your business?</p>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li>What specific challenges is your business facing right now?</li>
                  <li>What are your main goals for the next 6-12 months?</li>
                  <li>Which areas of your business need the most improvement?</li>
                </ul>
                <p class="mt-2">The more details you provide, the better I can customize our AI solutions to your specific situation.</p>
              </div>
            `,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 3000); // Wait 3 seconds before sending the follow-up
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback to standard response if enhanced response fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <BackNavigation 
          text="Back to home"
          onClick={() => {
            // Navigate to home page
            window.location.href = "/";
          }}
        />
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
                      <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} className="prose prose-sm max-w-none" />
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
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
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
                  <Button variant="outline" className="w-full mt-2 bg-white border-gray-300 text-gray-800 hover:bg-gray-50">
                    View Plans
                  </Button>
                </Link>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700">Agent Explorer</h4>
                <p className="text-sm text-gray-500 mt-1">Browse all available AI business agents</p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                  onClick={() => {
                    // Navigate to home page
                    window.location.href = "/";
                    
                    // Store in session storage that we want to scroll to agents
                    sessionStorage.setItem("scrollToAgents", "true");
                  }}
                >
                  Explore Agents
                </Button>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700">Workflows</h4>
                <p className="text-sm text-gray-500 mt-1">See how our agents work together</p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                  onClick={() => {
                    // Navigate to home page
                    window.location.href = "/";
                    
                    // Store in session storage that we want to scroll to workflows
                    sessionStorage.setItem("scrollToWorkflows", "true");
                  }}
                >
                  Browse Workflows
                </Button>
              </div>
              

              
              <div className="pt-4 mt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700">Ready to get started?</h4>
                <p className="text-sm text-gray-500 mt-1">Subscribe now to access our AI agent ecosystem</p>
                <Link href="/subscribe">
                  <Button className="w-full mt-2 bg-primary hover:bg-primary/90">
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