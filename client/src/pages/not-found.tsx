import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";

export default function NotFound() {
  // Ensure page is at the top when component loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-primary hover:underline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
