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
    // Create a concise prompt for the analysis
    const analysisPrompt = `
Analyze this business consultation text and extract the following information in JSON format:

1. keyPhrases: Extract 5-7 key phrases that represent the most important or distinctive aspects of the consultation.
2. topicDistribution: Identify 3-5 main topics discussed and their approximate percentage of the conversation.
3. recommendedAgents: Based on the content, which 2-4 specialized agents would be most helpful (choose from: Business Development, Marketing and Branding, Content Planner, Financial Strategist, Customer Success, SEO Strategist, Product Development, Automation Specialist).
4. personalizedContent: Create personalized marketing content with these sections:
   - hook: A compelling hook that addresses the client's main challenge/need (20-30 words)
   - story: A brief relatable narrative connecting their needs to our solution (60-80 words)
   - offer: A personalized offer that presents our AI agency services as the ideal solution (40-50 words)
   - combinedContent: The hook, story, and offer combined into a cohesive piece

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