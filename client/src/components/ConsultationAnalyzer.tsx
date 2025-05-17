import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsultationAnalyzerProps {
  apiEndpoint?: string;
}

type AnalysisResults = {
  keyPhrases: string[];
  topicDistribution: { name: string; percentage: number }[];
  recommendedAgents: string[];
  personalizedContent: {
    hook: string;
    story: string;
    offer: string;
    combinedContent?: string;
  };
};

const ConsultationAnalyzer = ({ apiEndpoint = '/api/consultation/analyze' }: ConsultationAnalyzerProps) => {
  const [consultationText, setConsultationText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
      setError((error as Error).message || 'Error analyzing consultation');
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
        // Show feedback via temporary message
        const copyBtn = document.getElementById('copy-btn');
        if (copyBtn) {
          const originalText = copyBtn.innerText;
          copyBtn.innerText = 'Copied!';
          setTimeout(() => {
            copyBtn.innerText = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Initial Consultation Analyzer</h3>
        <p className="text-gray-600 mb-4">Enter the consultation text to extract key insights and generate personalized marketing content:</p>
        
        <textarea 
          rows={6}
          placeholder="Enter consultation text here (client needs, challenges, background, goals, etc.)..."
          value={consultationText}
          onChange={(e) => setConsultationText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 mb-4"
        />
        
        <Button 
          onClick={analyzeConsultation}
          disabled={isAnalyzing}
          className={cn(
            "bg-primary hover:bg-primary/90",
            isAnalyzing && "opacity-70 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Consultation'
          )}
        </Button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {results && (
        <div className="analyzer-results bg-gray-50 p-6 border-t border-gray-100" ref={resultsRef}>
          {/* Personalized Marketing Content */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Personalized Marketing Content</h4>
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
              {results.personalizedContent.combinedContent ? (
                <div className="whitespace-pre-line">
                  {results.personalizedContent.combinedContent}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h5 className="text-md font-medium mb-2">Hook:</h5>
                    <p className="text-gray-700">{results.personalizedContent.hook}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="text-md font-medium mb-2">Story:</h5>
                    <p className="text-gray-700">{results.personalizedContent.story}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-md font-medium mb-2">Offer:</h5>
                    <p className="text-gray-700">{results.personalizedContent.offer}</p>
                  </div>
                </>
              )}
            </div>
            
            <Button 
              id="copy-btn"
              variant="outline" 
              className="mt-3"
              onClick={copyContentToClipboard}
            >
              Copy to Clipboard
            </Button>
          </div>
          
          {/* Recommended AI Agents */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-3">Recommended AI Agents</h4>
            <div className="flex flex-wrap gap-2">
              {results.recommendedAgents.map((agent, index) => (
                <div key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {agent}
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Insights */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Key Topics & Insights</h4>
            
            {/* Key Phrases */}
            {results.keyPhrases && results.keyPhrases.length > 0 && (
              <div className="mb-6">
                <h5 className="text-md font-medium mb-2">Key Phrases:</h5>
                <div className="flex flex-wrap gap-2">
                  {results.keyPhrases.map((phrase, index) => (
                    <div key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {phrase}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Topic Distribution */}
            {results.topicDistribution && results.topicDistribution.length > 0 && (
              <div>
                <h5 className="text-md font-medium mb-2">Top Topics:</h5>
                <div className="flex flex-wrap gap-2">
                  {results.topicDistribution.slice(0, 5).map((topic, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationAnalyzer;