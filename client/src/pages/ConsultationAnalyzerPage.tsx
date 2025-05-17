import MainLayout from '@/layouts/MainLayout';
import ConsultationAnalyzer from '@/components/ConsultationAnalyzer';
import BackNavigation from '@/components/BackNavigation';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const ConsultationAnalyzerPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <BackNavigation 
          text="Back to consultation"
          onClick={() => {
            window.location.href = "/consultation";
          }}
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Consultation Analyzer</h1>
          <p className="text-gray-600">
            Enter your consultation notes to extract key insights and create personalized marketing content for your clients.
          </p>
        </div>
        
        <ConsultationAnalyzer />
        
        <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-semibold mb-2 text-blue-800">How To Use This Tool</h3>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Enter your consultation notes, including client needs, challenges, and goals</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Click "Analyze Consultation" to process the text with our AI</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Review the personalized hook, story, and offer generated for your client</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
              <span>Copy the content and use it in your marketing materials or client communications</span>
            </li>
          </ul>
          
          <p className="text-blue-700 font-medium">
            Need help with your business? Connect with our specialized AI agents:
          </p>
          
          <div className="mt-3 flex space-x-3">
            <Link href="/consultation">
              <Button variant="outline" className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                Chat with Agency Assistant
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                Explore AI Agents
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConsultationAnalyzerPage;