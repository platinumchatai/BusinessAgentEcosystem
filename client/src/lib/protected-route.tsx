import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect, useState } from "react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [simulatedUser, setSimulatedUser] = useState<{ username: string } | null>(null);
  
  // Check for simulated user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('simulatedUser');
    if (storedUser) {
      try {
        setSimulatedUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing simulated user from localStorage");
      }
    }
  }, []);
  
  // Consider user authenticated if either real user exists or simulated user exists
  const effectiveUser = user || simulatedUser;

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      ) : !effectiveUser && path !== "/" ? (
        // Only redirect if not on home page
        <Redirect to="/" />
      ) : (
        <Component />
      )}
    </Route>
  );
}