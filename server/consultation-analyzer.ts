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