/**
 * Consultation analyzer client-side utility
 * For analyzing consultation text and generating personalized content
 */

interface AnalysisResults {
  businessName?: string;
  businessType?: string;
  keyPhrases: string[];
  businessChallenges?: string[];
  businessGoals?: string[];
  topicDistribution: { name: string; percentage: number }[];
  industryInsights?: string[];
  recommendedAgents: string[];
  recommendedPackage?: string;
  personalizedContent: {
    hook: string;
    story: string;
    offer: string;
    combinedContent?: string;
  };
}

/**
 * Analyzes consultation text using the backend API
 * 
 * @param text The consultation text to analyze
 * @returns Promise resolving to analysis results
 */
export async function analyzeConsultation(text: string): Promise<AnalysisResults> {
  if (!text || text.length < 20) {
    throw new Error('Consultation text must be at least 20 characters long');
  }
  
  const response = await fetch('/api/consultation/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to analyze consultation');
  }
  
  return await response.json();
}

/**
 * Extracts the combined personalized content from analysis results
 * 
 * @param results The analysis results
 * @returns The combined personalized content (hook, story, offer)
 */
export function getPersonalizedContent(results: AnalysisResults): string {
  if (!results) return '';
  
  return results.personalizedContent.combinedContent || 
    `${results.personalizedContent.hook}\n\n${results.personalizedContent.story}\n\n${results.personalizedContent.offer}`;
}

/**
 * Gets recommended agents from analysis results
 * 
 * @param results The analysis results
 * @returns Array of recommended agent names
 */
export function getRecommendedAgents(results: AnalysisResults): string[] {
  if (!results) return [];
  
  return results.recommendedAgents;
}