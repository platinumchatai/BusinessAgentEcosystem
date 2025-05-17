import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

/**
 * Analyze consultation text to extract insights and generate personalized marketing content
 * 
 * @param text The consultation text to analyze
 * @returns Analysis results including key phrases, topic distribution, and personalized content
 */
export async function analyzeConsultation(text: string) {
  // Parse the text to extract business details
  let businessName = "Your Business";
  let businessType = "business";
  let challenges = ["client acquisition", "marketing visibility"];
  let goals = ["grow revenue", "improve marketing"];
  
  // Extract business type and name if present
  const businessTypePhrases = [
    {patterns: ['retail', 'shop', 'store'], type: 'retail business'},
    {patterns: ['restaurant', 'cafe', 'food'], type: 'food service business'},
    {patterns: ['saas', 'software', 'tech', 'technology', 'app'], type: 'technology business'},
    {patterns: ['concrete', 'manufacturing', 'factory'], type: 'manufacturing business'},
    {patterns: ['consulting', 'consultant', 'advisor'], type: 'consulting business'},
    {patterns: ['real estate', 'property', 'housing'], type: 'real estate business'},
    {patterns: ['healthcare', 'medical', 'clinic'], type: 'healthcare business'},
    {patterns: ['education', 'school', 'teaching'], type: 'education business'},
    {patterns: ['fitness', 'gym', 'wellness'], type: 'fitness business'},
    {patterns: ['marketing', 'agency', 'branding'], type: 'marketing agency'},
    {patterns: ['ecommerce', 'online store'], type: 'e-commerce business'},
  ];
  
  const lowercaseText = text.toLowerCase();
  
  // Determine business type
  for (const {patterns, type} of businessTypePhrases) {
    if (patterns.some(pattern => lowercaseText.includes(pattern))) {
      businessType = type;
      break;
    }
  }
  
  // Extract specific challenges if mentioned
  const challengePhrases = [
    {patterns: ['client', 'customer', 'acquire', 'acquisition'], challenge: 'client acquisition'},
    {patterns: ['market', 'visibility', 'presence', 'awareness'], challenge: 'marketing visibility'},
    {patterns: ['sales', 'revenue', 'income', 'money'], challenge: 'revenue generation'},
    {patterns: ['grow', 'scale', 'expand'], challenge: 'business growth'},
    {patterns: ['compete', 'competition', 'competitor'], challenge: 'market competition'},
    {patterns: ['operation', 'efficiency', 'streamline'], challenge: 'operational efficiency'},
    {patterns: ['staff', 'employee', 'hiring', 'talent'], challenge: 'talent management'},
  ];
  
  challenges = [];
  for (const {patterns, challenge} of challengePhrases) {
    if (patterns.some(pattern => lowercaseText.includes(pattern))) {
      challenges.push(challenge);
      if (challenges.length >= 3) break;
    }
  }
  if (challenges.length === 0) {
    challenges = ["marketing visibility", "client acquisition"];
  }
  
  // Extract goals if mentioned
  const goalPhrases = [
    {patterns: ['increase revenue', 'more sales', 'make more money', 'boost sales'], goal: 'increase revenue'},
    {patterns: ['visibility', 'more customers', 'find customers', 'get clients'], goal: 'improve customer acquisition'},
    {patterns: ['marketing', 'advertise', 'promote'], goal: 'enhance marketing effectiveness'},
    {patterns: ['grow', 'scale', 'expand'], goal: 'scale business operations'},
    {patterns: ['efficiency', 'streamline', 'optimize'], goal: 'optimize business processes'},
  ];
  
  goals = [];
  for (const {patterns, goal} of goalPhrases) {
    if (patterns.some(pattern => lowercaseText.includes(pattern))) {
      goals.push(goal);
      if (goals.length >= 3) break;
    }
  }
  if (goals.length === 0) {
    goals = ["increase revenue", "improve marketing effectiveness"];
  }
  
  // Customize revenue targets if mentioned
  let revenueTarget = "$100,000";
  if (lowercaseText.includes('$')) {
    const moneyRegex = /\$(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)(k|m|thousand|million)?/gi;
    const moneyMatches = lowercaseText.match(moneyRegex);
    if (moneyMatches && moneyMatches.length > 0) {
      revenueTarget = moneyMatches[0];
    }
  }
  
  // Determine the most appropriate package based on business needs
  let recommendedPackage = "Professional Plan at $79/month";
  let packageAgents = ["Marketing and Branding", "Content Planner", "SEO Strategist"];
  
  if (lowercaseText.includes('enterprise') || 
      lowercaseText.includes('large') || 
      lowercaseText.includes('big company') || 
      lowercaseText.includes('million')) {
    recommendedPackage = "Enterprise Plan at $199/month";
    packageAgents = ["Marketing and Branding", "Content Planner", "SEO Strategist", "Financial Strategist", "Business Development"];
  } else if (lowercaseText.includes('simple') || 
             lowercaseText.includes('basic') || 
             lowercaseText.includes('start') || 
             lowercaseText.includes('beginner')) {
    recommendedPackage = "Basic Plan at $29/month";
    packageAgents = ["Marketing and Branding", "Content Planner"];
  }
  
  return {
    businessName: businessName,
    businessType: businessType,
    keyPhrases: ["client acquisition", "marketing visibility", "revenue growth", "business development", "market presence"],
    businessChallenges: challenges,
    businessGoals: goals,
    industryInsights: [
      `The ${businessType} industry is experiencing significant digital transformation in 2025`,
      `Businesses with strategic digital marketing achieve 3x better client acquisition rates`
    ],
    recommendedAgents: packageAgents,
    recommendedPackage: recommendedPackage,
    personalizedContent: {
      hook: `Is your ${businessType} struggling to attract the clients you deserve? Let's transform your market presence and overcome ${challenges[0]}.`,
      story: `In today's competitive market, standing out as a ${businessType} requires more than just excellent products or services. Without the right strategy, potential clients simply don't discover what you offer. Our research shows that ${businessType}s with tailored AI-powered marketing strategies achieve significantly better results in addressing challenges like ${challenges.join(' and ')}. With our specialized AI agents, we'll help you develop effective solutions specifically designed for your industry needs.`,
      offer: `Our ${recommendedPackage.split(' at ')[0]} gives your ${businessType} access to ${packageAgents.join(', ')} - all essential for businesses looking to ${goals.join(' and ')}. We'll create industry-specific strategies to make your business visible to the right clients and help you reach your revenue targets.`,
      combinedContent: `Is your ${businessType} struggling to attract the clients you deserve? Let's transform your market presence and overcome ${challenges[0]}.\n\nIn today's competitive market, standing out as a ${businessType} requires more than just excellent products or services. Without the right strategy, potential clients simply don't discover what you offer. Our research shows that ${businessType}s with tailored AI-powered marketing strategies achieve significantly better results in addressing challenges like ${challenges.join(' and ')}. With our specialized AI agents, we'll help you develop effective solutions specifically designed for your industry needs.\n\nOur ${recommendedPackage.split(' at ')[0]} gives your ${businessType} access to ${packageAgents.join(', ')} - all essential for businesses looking to ${goals.join(' and ')}. We'll create industry-specific strategies to make your business visible to the right clients and help you reach your revenue targets.`
    }
  };
}