import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AgentDetail from "@/pages/AgentDetail";
import WorkflowDetail from "@/pages/WorkflowDetail";
import Consultation from "@/pages/Consultation";
import Subscribe from "@/pages/subscribe";
import AuthPage from "@/pages/auth-page";
import Agents from "@/pages/Agents";
import DashboardPage from "@/pages/dashboard-page";
import { useEffect } from 'react';
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agents" component={Agents} />
      <ProtectedRoute path="/agent/:id" component={AgentDetail} />
      <ProtectedRoute path="/workflow/:id" component={WorkflowDetail} />
      <ProtectedRoute path="/consultation" component={Consultation} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/subscribe" component={Subscribe} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force scroll to top on initial app load
  useEffect(() => {
    // Double ensure scroll to top when the app first loads
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
