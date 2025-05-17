import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { analyzeConsultation } from '@/lib/consultationAnalyzer';

interface DirectConsultationAnalyzerProps {
  inputText: string;
  onAnalysisComplete: (result: any) => void;
}

/**
 * A component that directly calls the consultation analyzer and formats the results
 */
const DirectConsultationAnalyzer = ({ inputText, onAnalysisComplete }: DirectConsultationAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!inputText || inputText.length < 20) {
      setError('Please enter more details about your business');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const results = await analyzeConsultation(inputText);
      onAnalysisComplete(results);
    } catch (error) {
      setError((error as Error).message || 'Failed to analyze your business details');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      
      <Button
        onClick={runAnalysis}
        disabled={isAnalyzing || !inputText}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your business...
          </>
        ) : (
          'Get Personalized Recommendations'
        )}
      </Button>
    </div>
  );
};

export default DirectConsultationAnalyzer;