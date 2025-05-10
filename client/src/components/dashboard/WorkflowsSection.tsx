import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlayCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WorkflowsSectionProps {
  userId: number | undefined;
}

interface Workflow {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  progress: number;
  createdAt: string | Date;
  completedAt?: string | Date | null;
  agentIds: number[];
}

export default function WorkflowsSection({ userId }: WorkflowsSectionProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch user workflows
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
    enabled: !!userId,
  });
  
  // Get a badge for the workflow status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get an icon for the workflow status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const handleViewWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Workflow History</CardTitle>
          <CardDescription>
            Track the status and progress of your business optimization workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingWorkflows ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No workflow history found.</p>
              <p className="text-sm mt-2">
                Start a new workflow to optimize your business processes.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow: Workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell>
                      {getStatusIcon(workflow.status)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{workflow.title}</p>
                        <p className="text-sm text-slate-500 truncate max-w-[250px]">
                          {workflow.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[100px]">
                        <Progress value={workflow.progress} className="h-2" />
                        <span className="text-xs text-slate-500 mt-1 inline-block">
                          {workflow.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {workflow.createdAt ? new Date(workflow.createdAt).toLocaleDateString() : 'Unknown date'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewWorkflow(workflow)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow?.title}</DialogTitle>
            <DialogDescription>
              Detailed information about this workflow
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflow && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-500">Status</h4>
                <div className="flex items-center">
                  {getStatusIcon(selectedWorkflow.status)}
                  <span className="ml-2">{getStatusBadge(selectedWorkflow.status)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-500">Progress</h4>
                <div>
                  <Progress value={selectedWorkflow.progress} className="h-2" />
                  <span className="text-sm mt-1 inline-block">
                    {selectedWorkflow.progress}% Complete
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-500">Description</h4>
                <p className="text-sm">{selectedWorkflow.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Started</h4>
                  <p className="text-sm">
                    {selectedWorkflow.createdAt 
                      ? new Date(selectedWorkflow.createdAt).toLocaleString() 
                      : 'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Completed</h4>
                  <p className="text-sm">
                    {selectedWorkflow.completedAt 
                      ? new Date(selectedWorkflow.completedAt).toLocaleString() 
                      : 'Not completed'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}