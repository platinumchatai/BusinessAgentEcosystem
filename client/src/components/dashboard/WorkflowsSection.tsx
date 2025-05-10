import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Workflow, ClipboardList, BarChart, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { workflows as workflowsData } from "@/data/workflows";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WorkflowsSectionProps {
  userId: number | undefined;
}

// This would eventually come from API
// but for now we'll use static data
interface UserWorkflow {
  id: number;
  workflowId: number;
  userId: number;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  phase: number;
  lastUpdated: string;
}

export default function WorkflowsSection({ userId }: WorkflowsSectionProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // This would be fetched from an API in a real app
  // For now, we'll create some mock data based on our static workflows
  const userWorkflows: UserWorkflow[] = workflowsData.map((workflow, index) => ({
    id: index + 1,
    workflowId: workflow.id,
    userId: userId || 1,
    progress: Math.random() * 100,
    status: Math.random() > 0.7 ? 'completed' : (Math.random() > 0.3 ? 'in_progress' : 'not_started'),
    phase: workflow.phaseId,
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
  
  // Get workflow details by ID
  const getWorkflowById = (id: number) => {
    return workflowsData.find(w => w.id === id);
  };
  
  // Format the workflow status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleContinueWorkflow = (userWorkflow: UserWorkflow) => {
    const workflow = getWorkflowById(userWorkflow.workflowId);
    
    if (workflow) {
      toast({
        title: "Continuing Workflow",
        description: `Navigating to ${workflow.name}...`,
      });
      
      // This would typically navigate to the workflow page
      // window.location.href = `/workflows/${workflow.id}`;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Workflows</CardTitle>
          <CardDescription>
            Track and continue your business workflow progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userWorkflows.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No workflows yet</h3>
              <p className="text-slate-500 mt-2">
                Start working with our agents to create workflow templates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userWorkflows.map((userWorkflow) => {
                const workflow = getWorkflowById(userWorkflow.workflowId);
                if (!workflow) return null;
                
                return (
                  <div 
                    key={userWorkflow.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{workflow.name}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 ml-2">
                            Phase {workflow.phaseId}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {workflow.description}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(userWorkflow.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{Math.round(userWorkflow.progress)}%</span>
                      </div>
                      <Progress value={userWorkflow.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-slate-500">
                        Last updated: {new Date(userWorkflow.lastUpdated).toLocaleDateString()}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleContinueWorkflow(userWorkflow)}
                        disabled={userWorkflow.status === 'completed'}
                      >
                        {userWorkflow.status === 'not_started' ? 'Start' : 
                         userWorkflow.status === 'in_progress' ? 'Continue' : 'View'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Workflow Analytics</CardTitle>
          <CardDescription>
            Summary of your workflow progress and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <BarChart className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{userWorkflows.length}</div>
              <div className="text-sm text-slate-500">Total Workflows</div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {userWorkflows.filter(w => w.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-500">Completed</div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {userWorkflows.filter(w => w.status === 'in_progress').length}
              </div>
              <div className="text-sm text-slate-500">In Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}