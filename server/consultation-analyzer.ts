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
  // Skip OpenAI API call for development/demo purposes
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
  
  try {
    // Create a comprehensive prompt for the analysis that generates business-specific content with package recommendations
    const analysisPrompt = `
Analyze this business consultation text in detail and extract the following information in JSON format:

1. businessName: Identify the specific business name mentioned in the consultation. If none is explicitly mentioned, use clues to determine the business type/industry.
2. businessType: Determine the type of business or industry being discussed (be very specific).
3. keyPhrases: Extract 5-7 key phrases that represent the most important or distinctive aspects of the consultation.
4. businessChallenges: Identify 2-4 specific challenges or pain points mentioned for this particular business.
5. businessGoals: Identify 2-4 specific goals or desired outcomes mentioned for this business.
6. industryInsights: Provide 2-3 relevant industry statistics or trends that would be relevant to this business (as if from Bureau of Labor Statistics).
7. recommendedAgents: Identify exactly which 3-5 specialized agents would be most helpful (choose from: Business Development, Marketing and Branding, Content Planner, Financial Strategist, Customer Success, SEO Strategist, Product Development, Automation Specialist).
8. recommendedPackage: Recommend a specific subscription package (Basic Plan at $29/month, Professional Plan at $79/month, or Enterprise Plan at $199/month) with a 1-2 sentence explanation why this is the right fit for their business.
9. personalizedContent: Create highly personalized marketing content specific to this exact business with these sections:
   - hook: A compelling hook that addresses this specific business's main challenge/need by name (30-40 words)
   - story: A detailed narrative connecting their specific business needs to our solution, mentioning their business name and industry details and including at least one industry statistic (90-110 words)
   - offer: A personalized offer that presents our AI agency services as the ideal solution for their specific business situation, recommending specific agents by name and a specific package tier with price ($29/month, $79/month, or $199/month) (60-80 words)
   - combinedContent: The hook, story, and offer combined into a cohesive piece that feels custom-written for this specific business

Make sure all content is extremely specific to the business mentioned, including direct references to their business name, industry, challenges, and specific agents that can help them. Avoid generic content at all costs. Always mention which specific package (Basic, Professional, or Enterprise) you recommend with the monthly price.

Format the response as a valid JSON object.

Client consultation text:
${text}
`;

    // Call OpenAI API for text analysis
    const analysisResponse = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: analysisPrompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    // Parse the JSON response
    const analysisResult = JSON.parse(analysisResponse.choices[0].message.content || "{}");

    return analysisResult;

  } catch (error) {
    console.error("Error analyzing consultation:", error);
    throw new Error(`Failed to analyze consultation: ${(error as Error).message}`);
  }
}