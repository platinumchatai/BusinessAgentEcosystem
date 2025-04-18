import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AgentDetail from "@/pages/AgentDetail";
import WorkflowDetail from "@/pages/WorkflowDetail";
import MainLayout from "@/layouts/MainLayout";
import { useEffect } from 'react';

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/agent/:id" component={AgentDetail} />
        <Route path="/workflow/:id" component={WorkflowDetail} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
