/**
 * OpenAI API Integration Utilities
 * 
 * This module provides utility functions for interacting with OpenAI's API
 * to power the AI agent framework's capabilities.
 */

/**
 * Create a completion using OpenAI's API
 * 
 * @param systemPrompt - The system prompt/instructions
 * @param userPrompt - The user's input/query
 * @returns Promise<string> - The generated text response
 */
export async function createOpenAICompletion(
  systemPrompt: string, 
  userPrompt: string
): Promise<string> {
  try {
    // Prepare the request payload
    const payload = {
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    // Make the API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    // Parse and return the response
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Create a structured JSON completion using OpenAI's API
 * 
 * @param systemPrompt - The system prompt/instructions
 * @param userPrompt - The user's input/query
 * @param jsonStructure - A description or example of the expected JSON structure
 * @returns Promise<any> - The generated structured response as a JSON object
 */
export async function createOpenAIStructuredCompletion<T>(
  systemPrompt: string,
  userPrompt: string,
  jsonStructure: string
): Promise<T> {
  try {
    // Enhance the system prompt to request JSON output
    const enhancedSystemPrompt = `${systemPrompt}

Please respond with a JSON object that follows this structure:
${jsonStructure}

Your response should be valid JSON without any additional text, markdown formatting, or explanations outside the JSON structure.`;

    // Make the API request
    const payload = {
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: enhancedSystemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    // Parse and return the response
    const data = await response.json();
    const jsonResponse = JSON.parse(data.choices[0].message.content);
    return jsonResponse as T;
  } catch (error) {
    console.error('Error calling OpenAI structured API:', error);
    throw error;
  }
}

/**
 * Analyze an image using OpenAI's multimodal capabilities
 * 
 * @param systemPrompt - The system prompt/instructions
 * @param userPrompt - The user's text input/query
 * @param imageBase64 - The base64-encoded image
 * @returns Promise<string> - The generated text response analyzing the image
 */
export async function analyzeImageWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  imageBase64: string
): Promise<string> {
  try {
    // Prepare the request payload with the image
    const payload = {
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    // Make the API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    // Parse and return the response
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI image analysis API:', error);
    throw error;
  }
}