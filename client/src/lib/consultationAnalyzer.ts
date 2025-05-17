/**
 * Direct consultation analyzer for business messages
 * This implementation works directly on the client side to provide immediate feedback
 */

interface BusinessDetails {
  businessType: string;
  challenges: string[];
  goals: string[];
  revenue: string;
  packageTier: string;
  packagePrice: string;
  agents: string[];
}

export const analyzeConsultation = (message: string): any => {
  const businessDetails = analyzeBusinessMessage(message);
  
  return {
    businessName: "your business",
    businessType: businessDetails.businessType,
    keyPhrases: ["client acquisition", "marketing visibility", "revenue growth"],
    businessChallenges: businessDetails.challenges,
    businessGoals: businessDetails.goals,
    industryInsights: [
      `The ${businessDetails.businessType} industry is experiencing significant digital transformation in 2025`,
      `Businesses with strategic digital marketing achieve 3x better client acquisition rates`
    ],
    recommendedAgents: businessDetails.agents,
    recommendedPackage: `${businessDetails.packageTier} at ${businessDetails.packagePrice}`,
    personalizedContent: {
      hook: `Is your ${businessDetails.businessType} struggling to attract the clients you deserve? Let's transform your market presence and overcome ${businessDetails.challenges[0]}.`,
      story: `In today's competitive market, standing out as a ${businessDetails.businessType} requires more than just excellent products or services. Without the right strategy, potential clients simply don't discover what you offer. Our research shows that ${businessDetails.businessType} businesses with tailored AI-powered marketing strategies achieve significantly better results in addressing challenges like ${businessDetails.challenges.join(' and ')}. With our specialized AI agents, we'll help you develop effective solutions specifically designed for your industry needs.`,
      offer: `Our ${businessDetails.packageTier} gives your ${businessDetails.businessType} access to ${businessDetails.agents.join(', ')} - all essential for businesses looking to ${businessDetails.goals.join(' and ')}. We'll create industry-specific strategies to make your business visible to the right clients and help you reach your revenue targets.`
    }
  };
};

export const getPersonalizedContent = (results: any): string => {
  return `${results.personalizedContent.hook}\n\n${results.personalizedContent.story}\n\n${results.personalizedContent.offer}`;
};

export const getRecommendedAgents = (results: any): string[] => {
  return results.recommendedAgents || [];
};

export const analyzeBusinessMessage = (message: string): BusinessDetails => {
  const lowercaseMessage = message.toLowerCase();
  
  // Default values
  let businessDetails: BusinessDetails = {
    businessType: "business",
    challenges: ["client acquisition", "marketing visibility"],
    goals: ["increase revenue", "improve marketing effectiveness"],
    revenue: "$100,000",
    packageTier: "Professional Plan",
    packagePrice: "$79/month",
    agents: ["Marketing Specialist", "Content Strategist", "Lead Generation Agent", "SEO Expert"]
  };
  
  // Business type detection
  if (lowercaseMessage.includes('concrete') || lowercaseMessage.includes('manufacturing')) {
    businessDetails.businessType = "concrete manufacturing";
    businessDetails.agents = ["Manufacturing Marketing Specialist", "B2B Lead Generation Agent", 
                             "Industrial SEO Strategist", "Content Distribution Planner"];
  } else if (lowercaseMessage.includes('tech') || lowercaseMessage.includes('software')) {
    businessDetails.businessType = "technology";
    businessDetails.agents = ["Tech Marketing Strategist", "Digital Visibility Expert", 
                             "SaaS Growth Specialist", "Technology Content Creator"];
  } else if (lowercaseMessage.includes('retail') || lowercaseMessage.includes('shop')) {
    businessDetails.businessType = "retail";
    businessDetails.agents = ["Retail Marketing Expert", "Customer Acquisition Specialist", 
                             "E-commerce Strategy Agent", "Retail Content Creator"];
  } else if (lowercaseMessage.includes('consult')) {
    businessDetails.businessType = "consulting";
    businessDetails.agents = ["Consulting Practice Growth Agent", "B2B Lead Generator", 
                             "Authority Content Creator", "Professional Services Marketer"];
  }
  
  // Challenge detection
  let detectedChallenges: string[] = [];
  if (lowercaseMessage.includes('client') || lowercaseMessage.includes('customer')) {
    detectedChallenges.push("client acquisition");
  }
  if (lowercaseMessage.includes('consistent')) {
    detectedChallenges.push("finding consistent clients");
  }
  if (lowercaseMessage.includes('market') || lowercaseMessage.includes('visibility')) {
    detectedChallenges.push("marketing visibility");
  }
  if (detectedChallenges.length > 0) {
    businessDetails.challenges = detectedChallenges;
  }
  
  // Goal detection
  let detectedGoals: string[] = [];
  if (lowercaseMessage.includes('grow') || lowercaseMessage.includes('increase')) {
    detectedGoals.push("grow business revenue");
  }
  
  // Revenue detection
  const moneyRegex = /\$(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)(k|m|thousand|million)?/gi;
  const moneyMatches = lowercaseMessage.match(moneyRegex);
  if (moneyMatches && moneyMatches.length > 0) {
    businessDetails.revenue = moneyMatches[0];
    
    if (moneyMatches.length > 1) {
      detectedGoals = [`reach ${moneyMatches[0]} in revenue`, `grow to ${moneyMatches[1]} in the future`];
    } else {
      detectedGoals.push(`reach ${moneyMatches[0]} in revenue`);
    }
  }
  
  if (detectedGoals.length > 0) {
    businessDetails.goals = detectedGoals;
  }
  
  // Package determination
  if (lowercaseMessage.includes('enterprise') || lowercaseMessage.includes('large') || 
      lowercaseMessage.match(/\$\d*,?\d*,?\d*0{5,}/)) {
    businessDetails.packageTier = "Enterprise Plan";
    businessDetails.packagePrice = "$199/month";
  } else if (lowercaseMessage.includes('start') || lowercaseMessage.includes('basic')) {
    businessDetails.packageTier = "Basic Plan";
    businessDetails.packagePrice = "$29/month";
  }
  
  return businessDetails;
};

export const generateConsultationResponse = (businessDetails: BusinessDetails): string => {
  return `
    <div>
      <div class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div class="p-4">
          <p>I see you're in ${businessDetails.businessType} and facing challenges with ${businessDetails.challenges.join(' and ')}. Let's solve that with an industry-specific approach!</p>
          <p class="mt-3">${businessDetails.businessType.charAt(0).toUpperCase() + businessDetails.businessType.slice(1)} businesses often struggle with marketing because traditional approaches don't highlight their unique capabilities effectively. Without specialized marketing strategies, potential clients can't discover your offerings. In fact, businesses using industry-specific AI marketing strategies see 37% better client acquisition rates and 42% improved retention.</p>
          <p class="mt-3">Our ${businessDetails.packageTier} gives your ${businessDetails.businessType} business access to specialized agents that will create targeted strategies to make your capabilities visible to the right clients and help you ${businessDetails.goals[0]}.</p>
        </div>
      </div>
      
      <div class="mt-5 p-4 border border-blue-100 bg-blue-50 rounded-md">
        <h4 class="text-lg font-semibold mb-3">Your Personalized Recommendation</h4>
        
        <p class="mb-3">Based on your ${businessDetails.businessType} needs, you would be best suited for our <strong>${businessDetails.packageTier} (${businessDetails.packagePrice})</strong>.</p>
        
        <p class="mb-2"><strong>This package includes these specialized AI agents:</strong></p>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          ${businessDetails.agents.map((agent, index) => 
            `<li><strong>${agent}</strong> - ${index === 0 
              ? `Creates industry-specific content that showcases your capabilities to the right audience`
              : index === 1 
              ? `Identifies and targets potential clients in need of your ${businessDetails.businessType} services`
              : index === 2 
              ? `Optimizes your online presence for industry-specific search terms`
              : `Ensures your capabilities are visible in the right channels`
            }</li>`
          ).join('')}
        </ul>
        
        <p class="mb-2">Together, these agents will help your business:</p>
        <ul class="list-disc pl-6 mb-3 space-y-1">
          <li>Build a consistent client acquisition strategy specifically for ${businessDetails.businessType}</li>
          <li>Create marketing materials that highlight your unique capabilities and quality standards</li>
          <li>${businessDetails.goals.join(' and ')}</li>
          <li>Develop industry-specific pricing and proposal frameworks</li>
        </ul>
        
        <p class="mt-3 text-sm font-medium">We also offer these alternative tiers:</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="px-3 py-1 ${businessDetails.packageTier.includes('Basic') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Basic Plan ($29/month)</span>
          <span class="px-3 py-1 ${businessDetails.packageTier.includes('Professional') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Professional Plan ($79/month)</span>
          <span class="px-3 py-1 ${businessDetails.packageTier.includes('Enterprise') ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'} rounded-full text-xs font-medium">Enterprise Plan ($199/month)</span>
        </div>
      </div>
      
      <div class="mt-4">
        <p class="font-medium">Would you like me to explain how our specialized ${businessDetails.businessType} marketing strategies will help you reach ${businessDetails.goals[0]}?</p>
      </div>
    </div>
  `;
};