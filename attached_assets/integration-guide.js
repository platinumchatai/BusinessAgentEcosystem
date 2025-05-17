// integration-guide.js
// Guide for integrating the Consultation Analyzer into your existing Replit app

/**
 * This file provides instructions and code snippets for integrating
 * the Consultation Analyzer into your existing Replit application.
 */

// =====================================================================
// BACKEND INTEGRATION
// =====================================================================

/**
 * Add this to your Express app's main file (index.js or app.js)
 * 
 * 1. Make sure you have the required dependencies:
 *    - express
 * 
 * 2. Place the consultation-analyzer.js and consultation-analyzer-api.js files
 *    in your project directory
 * 
 * 3. Add the following code to your main server file:
 */

// Express app setup (you likely already have this)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Import and use the consultation analyzer routes
const consultationAnalyzerRoutes = require('./consultation-analyzer-api');
app.use('/api/consultation', consultationAnalyzerRoutes);

// Your existing routes and middleware...

// Start server (you likely already have this)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// =====================================================================
// FRONTEND INTEGRATION
// =====================================================================

/**
 * Option 1: Standalone HTML/JS Integration
 * 
 * 1. Place the consultation-analyzer-component.js file in your public directory
 * 
 * 2. Create a container div in your HTML where you want the analyzer to appear:
 */

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Agent Agency</title>
  <link rel="stylesheet" href="your-styles.css">
</head>
<body>
  <header>
    <!-- Your existing header content -->
  </header>
  
  <main>
    <!-- Other content -->
    
    <!-- Consultation Analyzer Container -->
    <section class="analyzer-section">
      <div id="consultation-analyzer-container"></div>
    </section>
    
    <!-- Other content -->
  </main>
  
  <footer>
    <!-- Your existing footer content -->
  </footer>
  
  <!-- Your existing scripts -->
  <script src="consultation-analyzer-component.js"></script>
  <script>
    // Initialize the analyzer when the page loads
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize with container ID and API endpoint
      const analyzer = initConsultationAnalyzer(
        'consultation-analyzer-container', 
        '/api/consultation/analyze'
      );
      
      // You can access the analyzer methods:
      // analyzer.analyze() - Trigger analysis
      // analyzer.setText(text) - Set text programmatically
      // analyzer.getText() - Get current text
      // analyzer.reset() - Reset the component
    });
  </script>
</body>
</html>
*/

/**
 * Option 2: React Integration
 * 
 * If your Replit app uses React, you can convert the component to a React component:
 */

/*
// ConsultationAnalyzer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ConsultationAnalyzer.css'; // Create a CSS file based on the styles in the component

const ConsultationAnalyzer = ({ apiEndpoint = '/api/consultation/analyze' }) => {
  const [consultationText, setConsultationText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const resultsRef = useRef(null);

  const analyzeConsultation = async () => {
    const text = consultationText.trim();
    
    if (!text || text.length < 20) {
      setError('Please enter consultation text (at least 20 characters)');
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(apiEndpoint, {
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
      
      const data = await response.json();
      setResults(data);
      
      // Scroll to results after they're rendered
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      setError(error.message || 'Error analyzing consultation');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyContentToClipboard = () => {
    if (!results) return;
    
    const content = results.personalizedContent.combinedContent || 
      `${results.personalizedContent.hook}\n\n${results.personalizedContent.story}\n\n${results.personalizedContent.offer}`;
    
    navigator.clipboard.writeText(content)
      .then(() => {
        // Show feedback (you could use a toast notification)
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="consultation-analyzer">
      <div className="analyzer-input">
        <h3>Initial Consultation Analyzer</h3>
        <p>Enter the consultation text to extract key insights and generate personalized marketing content:</p>
        <textarea 
          rows="6"
          placeholder="Enter consultation text here (client needs, challenges, background, goals, etc.)..."
          value={consultationText}
          onChange={(e) => setConsultationText(e.target.value)}
        />
        <button 
          className="primary-btn"
          onClick={analyzeConsultation}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Consultation'}
        </button>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        {isAnalyzing && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Analyzing consultation...</span>
          </div>
        )}
      </div>
      
      {results && (
        <div className="analyzer-results" ref={resultsRef}>
          <div className="results-section">
            <h4>Personalized Marketing Content</h4>
            <div className="content-box">
              {results.personalizedContent.combinedContent || (
                <>
                  {results.personalizedContent.hook}
                  <br /><br />
                  {results.personalizedContent.story}
                  <br /><br />
                  {results.personalizedContent.offer}
                </>
              )}
            </div>
            <button className="secondary-btn" onClick={copyContentToClipboard}>
              Copy to Clipboard
            </button>
          </div>
          
          <div className="results-section">
            <h4>Recommended AI Agents</h4>
            <div className="agents-container">
              {results.recommendedAgents.map((agent, index) => (
                <div key={index} className="agent-tag">
                  {agent}
                </div>
              ))}
            </div>
          </div>
          
          <div className="results-section">
            <h4>Key Topics & Insights</h4>
            <div className="insights-container">
              {results.keyPhrases && results.keyPhrases.length > 0 && (
                <>
                  <h5>Key Phrases:</h5>
                  {results.keyPhrases.map((phrase, index) => (
                    <div key={index} className="insight-item">
                      {phrase}
                    </div>
                  ))}
                </>
              )}
              
              {results.topicDistribution && results.topicDistribution.length > 0 && (
                <>
                  <h5 style={{ marginTop: '15px' }}>Top Topics:</h5>
                  <div className="agents-container">
                    {results.topicDistribution.slice(0, 5).map((topic, index) => (
                      <div 
                        key={index} 
                        className="agent-tag"
                        style={{ background: '#f0f5e9', color: '#558b2f' }}
                      >
                        {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationAnalyzer;
*/

// =====================================================================
// PROGRAMMATIC USAGE
// =====================================================================

/**
 * If you want to use the analyzer programmatically in your application logic:
 */

/*
// Import the core analyzer functionality
const { analyzeConsultation } = require('./consultation-analyzer');

// Example function using the analyzer
async function processClientInput(clientInput) {
  // Extract insights from the consultation
  const analysisResults = analyzeConsultation(clientInput);
  
  // Use the results in your application
  const { 
    recommendedAgents,
    topDomains,
    keyPhrases,
    personalizedContent 
  } = analysisResults;
  
  // Example: Save to database
  await saveClientAnalysis({
    clientId: currentClient.id,
    consultationText: clientInput,
    recommendedAgents,
    topDomains,
    marketingContent: personalizedContent
  });
  
  // Example: Route to specific agents based on analysis
  const primaryAgent = recommendedAgents[0];
  routeToAgent(primaryAgent, {
    clientId: currentClient.id,
    consultationSummary: keyPhrases.join(' ')
  });
  
  return {
    success: true,
    marketingContent: personalizedContent.combinedContent
  };
}
*/

// =====================================================================
// ADVANCED: INTEGRATING WITH YOUR AI AGENT ECOSYSTEM
// =====================================================================

/**
 * To integrate the consultation analyzer with your AI Agent ecosystem:
 * 
 * 1. Create a middleware layer that routes consultation insights to the 
 *    appropriate AI agents as defined in your documentation
 */

/*
// agent-router.js

// Import your AI agents (implement these based on your documentation)
const businessDevelopmentAgent = require('./agents/business-development');
const contentPlanner = require('./agents/content-planner');
const marketingAgent = require('./agents/marketing');
const seoAgent = require('./agents/seo');
// Import other agents...

// Import the analyzer
const { analyzeConsultation } = require('./consultation-analyzer');

// Router function
async function routeConsultationToAgents(consultationText) {
  // Analyze the consultation
  const analysis = analyzeConsultation(consultationText);
  
  // Get the recommended agents
  const { recommendedAgents, topDomains, keyPhrases, personalizedContent } = analysis;
  
  // Create a context object to pass to the agents
  const agentContext = {
    consultationText,
    keyPhrases,
    topDomains,
    personalizedContent
  };
  
  // Initialize results object
  const agentResults = {};
  
  // Route to each recommended agent
  for (const agentName of recommendedAgents) {
    switch(agentName) {
      case 'Business Development':
        agentResults.businessDevelopment = await businessDevelopmentAgent.process(agentContext);
        break;
      case 'Content Planner':
        agentResults.contentPlanner = await contentPlanner.process(agentContext);
        break;
      case 'Marketing and Branding':
        agentResults.marketing = await marketingAgent.process(agentContext);
        break;
      case 'SEO Strategist':
        agentResults.seo = await seoAgent.process(agentContext);
        break;
      // Add cases for other agents...
    }
  }
  
  // Return combined results
  return {
    analysis,
    agentResults
  };
}

module.exports = { routeConsultationToAgents };
*/

// =====================================================================
// COMPLETE INTEGRATION EXAMPLE
// =====================================================================

/**
 * Here's a complete example of how the consultation analyzer could be 
 * integrated into your Replit application workflow:
 */

/*
// 1. Client submits initial consultation form
// 2. Backend analyzes the consultation
const { analyzeConsultation } = require('./consultation-analyzer');
const { routeConsultationToAgents } = require('./agent-router');

app.post('/api/client/consultation', async (req, res) => {
  const { clientId, consultationText } = req.body;
  
  try {
    // First, analyze the consultation
    const analysis = analyzeConsultation(consultationText);
    
    // Store the analysis results
    await db.clientAnalysis.create({
      clientId,
      consultationText,
      analysis: JSON.stringify(analysis)
    });
    
    // Route to appropriate agents
    const agentResults = await routeConsultationToAgents(consultationText);
    
    // Store agent recommendations
    await db.agentRecommendations.create({
      clientId,
      recommendations: JSON.stringify(agentResults)
    });
    
    // Generate personalized subscribe link with UTM parameters
    const subscribeUrl = generateSubscribeUrl({
      clientId,
      source: 'consultation',
      agents: analysis.recommendedAgents.slice(0, 2).join('-'),
      campaign: 'initial-analysis'
    });
    
    // Return success with marketing content and subscribe URL
    return res.json({
      success: true,
      marketingContent: analysis.personalizedContent,
      subscribeUrl,
      recommendedAgents: analysis.recommendedAgents
    });
    
  } catch (error) {
    console.error('Consultation processing error:', error);
    return res.status(500).json({
      error: 'Error processing consultation'
    });
  }
});

// Function to generate subscribe URL with proper UTM parameters
function generateSubscribeUrl({ clientId, source, agents, campaign }) {
  const baseUrl = 'https://your-replit-app.com/subscribe';
  const utmParams = new URLSearchParams({
    utm_source: source,
    utm_medium: 'consultation',
    utm_campaign: campaign,
    utm_content: agents,
    client: clientId
  });
  
  return `${baseUrl}?${utmParams.toString()}`;
}
*/