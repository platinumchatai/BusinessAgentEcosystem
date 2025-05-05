/**
 * Utility function to format message content that might contain HTML markup
 * 
 * This function takes a string that might contain HTML tags or markdown-like formatting
 * and returns a properly formatted version for display in the UI.
 * 
 * It sanitizes the HTML to remove potentially unsafe tags and preserves formatting
 * like lists, paragraphs, and text styling.
 */
export function formatMessageContent(content: string): string {
  // Check if the content appears to contain HTML
  const containsHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  
  if (containsHtml) {
    // If it has HTML, we need to sanitize and format it properly
    
    // Basic sanitization - removes script tags and event handlers
    // This is a simple implementation. In a production app, use a proper HTML sanitizer
    const sanitized = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/on\w+="[^"]*"/g, '') // Remove event handlers
      .replace(/on\w+='[^']*'/g, ''); // Remove event handlers with single quotes
    
    // Wrap the sanitized content in a div with prose styling
    return `<div class="prose prose-sm max-w-none overflow-hidden">${sanitized}</div>`;
  }
  
  // If it's plain text, format new lines as breaks for better readability
  return content.replace(/\n/g, '<br>');
}

/**
 * Determine if content should be rendered with HTML formatting
 */
export function shouldRenderAsHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}