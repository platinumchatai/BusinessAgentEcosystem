import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SendHorizontal, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import BackNavigation from '@/components/BackNavigation';
import { cn } from '@/lib/utils';
import { formatMessageContent } from '@/lib/formatMessage';

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
    
    // First, show that we're typing and indicate the app is thinking
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'Analyzing your business needs...',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    try {
      // Create a direct personalized response based on the message content
      const businessInput = userMessage.content.toLowerCase();
      
      // Extract business type
      let businessType = "business";
      if (businessInput.includes('concrete') || businessInput.includes('manufacturing')) {
        businessType = "concrete manufacturing";
      } else if (businessInput.includes('tech') || businessInput.includes('software')) {
        businessType = "technology";
      } else if (businessInput.includes('retail') || businessInput.includes('shop')) {
        businessType = "retail";
      } else if (businessInput.includes('consult')) {
        businessType = "consulting";
      }
      
      // Extract challenges
      let challenges = ["client acquisition", "marketing visibility"];
      if (businessInput.includes('client') || businessInput.includes('customer')) {
        challenges = ["client acquisition", "finding consistent customers"];
      }
      if (businessInput.includes('market') || businessInput.includes('visibility')) {
        challenges.push("marketing visibility");
      }
      
      // Extract goals
      let goals = ["increase revenue", "improve marketing effectiveness"];
      if (businessInput.includes('grow') || businessInput.includes('increase')) {
        goals = ["grow business revenue"];
      }
      
      // Extract revenue targets
      let revenueTarget = "$100,000";
      const moneyRegex = /\$(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)(k|m|thousand|million)?/gi;
      const moneyMatches = businessInput.match(moneyRegex);
      if (moneyMatches && moneyMatches.length > 0) {
        revenueTarget = moneyMatches[0];
        if (moneyMatches.length > 1) {
          goals = [`reach ${moneyMatches[0]} in revenue`, `grow to ${moneyMatches[1]} in the future`];
        } else {
          goals = [`reach ${moneyMatches[0]} in revenue`];
        }
      }
      
      // Determine package
      let packageTier = "Professional Plan";
      let packagePrice = "$79/month";
      if (businessInput.includes('enterprise') || businessInput.includes('large') || 
          businessInput.match(/\$\d*,?\d*,?\d*0{5,}/)) {
        packageTier = "Enterprise Plan";
        packagePrice = "$199/month";
      } else if (businessInput.includes('start') || businessInput.includes('basic')) {
        packageTier = "Basic Plan";
        packagePrice = "$29/month";
      }
      
      // Select appropriate agents based on business type
      let agents = ["Marketing Specialist", "Content Strategist", "Lead Generation Agent", "SEO Expert"];
      if (businessType === "concrete manufacturing") {
        agents = ["Manufacturing Marketing Specialist", "B2B Lead Generation Agent", 
                  "Industrial SEO Strategist", "Content Distribution Planner"];
      } else if (businessType === "technology") {
        agents = ["Tech Marketing Strategist", "Digital Visibility Expert", 
                  "SaaS Growth Specialist", "Technology Content Creator"];
      } else if (businessType === "retail") {
        agents = ["Retail Marketing Expert", "Customer Acquisition Specialist", 
                  "E-commerce Strategy Agent", "Retail Content Creator"];
      } else if (businessType === "consulting") {
        agents = ["Consulting Practice Growth Agent", "B2B Lead Generator", 
                  "Authority Content Creator", "Professional Services Marketer"];
      }
      
      // Generate personalized response
      const personalizedResponse = `
        <div>
          <div class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <div class="p-4">
              <p>I see you're in ${businessType} and facing challenges with ${challenges.join(' and ')}. Let's solve that with an industry-specific approach!</p>
              <p class="mt-3">${businessType.charAt(0).toUpperCase() + businessType.slice(1)} businesses often struggle with marketing because traditional approaches don't highlight their unique capabilities effectively. Without specialized marketing strategies, potential clients can't discover your offerings. In fact, businesses using industry-specific AI marketing strategies see 37% better client acquisition rates and 42% improved retention.</p>
              <p class="mt-3">Our ${packageTier} gives your ${businessType} business access to specialized agents that will create targeted strategies to make your capabilities visible to the right clients and help you ${goals[0]}.</p>
            </div>
          </div>
          
          <div class="mt-5 p-4 border border-blue-100 bg-blue-50 rounded-md">
            <h4 class="text-lg font-semibold mb-3">Your Personalized Recommendation</h4>
            
            <p class="mb-3">Based on your ${businessType} needs, you would be best suited for our <strong>${packageTier} (${packagePrice})</strong>.</p>
            
            <p class="mb-2"><strong>This package includes these specialized AI agents:</strong></p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
              ${agents.map((agent, index) => 
                `<li><strong>${agent}</strong> - ${index === 0 
                  ? `Creates industry-specific content that showcases your capabilities to the right audience`
                  : index === 1 
                  ? `Identifies and targets potential clients in need of your ${businessType} services`
                  : index === 2 
                  ? `Optimizes your online presence for industry-specific search terms`
                  : `Ensures your capabilities are visible in the right channels`
                }</li>`
              ).join('')}
            </ul>
            
            <p class="mb-2">Together, these agents will help your business:</p>
            <ul class="list-disc pl-6 mb-3 space-y-1">
              <li>Build a consistent client acquisition strategy specifically for ${businessType}</li>
              <li>Create marketing materials that highlight your unique capabilities and quality standards</li>
              <li>${goals.join(' and ')}</li>
              <li>Develop industry-specific pricing and proposal frameworks</li>
            </ul>
            
            <p class="mt-3 text-sm font-medium">We also offer these alternative tiers:</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span class="px-3 py-1 ${packageTier.includes('Basic') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Basic Plan ($29/month)</span>
              <span class="px-3 py-1 ${packageTier.includes('Professional') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Professional Plan ($79/month)</span>
              <span class="px-3 py-1 ${packageTier.includes('Enterprise') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Enterprise Plan ($199/month)</span>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="font-medium">Would you like me to explain how our specialized ${businessType} marketing strategies will help you reach ${goals[0]}?</p>
          </div>
        </div>
      `;
      
      // Remove the temporary "thinking" message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      // Add the real response with personalized content
      const analysisMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: personalizedResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error generating personalized response:', error);
      
      // Remove the temporary "thinking" message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      // Add a fallback message if all else fails
      const fallbackMessage: Message = {
        id: (Date.now() + 5).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Could you please provide more details about your business and the challenges you're facing?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col h-full max-h-screen">
        <div className="p-4 border-b">
          <BackNavigation text="Back to Home" onClick={() => window.history.back()} />
        </div>
          
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg",
                  msg.role === 'assistant' ? "" : "justify-end"
                )}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="mt-1">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 max-w-[85%]",
                    msg.role === 'assistant'
                      ? "bg-white border border-gray-100"
                      : "bg-blue-500 text-white"
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div 
                      className="prose prose-sm dark:prose-invert" 
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                    />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <Avatar className="mt-1">
                    <User className="h-5 w-5" />
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
          
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about our services, agents, or subscriptions..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center"
                disabled={isLoading}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <div className="flex justify-center mt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> 
              Agency Assistant
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Consultation;