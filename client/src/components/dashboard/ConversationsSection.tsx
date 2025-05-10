import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Download, Copy, Trash2, Archive, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Conversation, Message as DatabaseMessage } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConversationsSectionProps {
  userId: number | undefined;
}

// Define interfaces for API responses
interface ConversationResponse {
  conversation: Conversation;
  messages: DatabaseMessage[];
  agents: any[];
}

interface Message extends DatabaseMessage {
  agentAvatar?: string;
}

export default function ConversationsSection({ userId }: ConversationsSectionProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Fetch user conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!userId,
  });
  
  // Fetch conversation details when selected
  const { isLoading: isLoadingConversationDetails } = useQuery<any, Error, ConversationResponse>({
    queryKey: ["/api/conversations", selectedConversation?.id],
    enabled: !!selectedConversation,
    select: (data) => data as ConversationResponse,
    // Moving the onSuccess logic to refetch:
    refetchOnMount: true
  });
  
  // Use a separate useEffect to handle the data setting
  useEffect(() => {
    const queryData = queryClient.getQueryData(["/api/conversations", selectedConversation?.id]) as ConversationResponse | undefined;
    if (queryData) {
      setMessages(queryData.messages as Message[]);
    }
  }, [selectedConversation, isLoadingConversationDetails]);
  
  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      return await apiRequest("DELETE", `/api/conversations/${conversationId}`);
    },
    onSuccess: () => {
      toast({
        title: "Conversation Deleted",
        description: "The conversation has been permanently deleted.",
      });
      // Invalidate and refetch conversations
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setSelectedConversation(null);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Archive conversation mutation
  const archiveConversationMutation = useMutation({
    mutationFn: async (conversationId: number) => {
      return await apiRequest("PATCH", `/api/conversations/${conversationId}/archive`);
    },
    onSuccess: () => {
      toast({
        title: "Conversation Archived",
        description: "The conversation has been archived.",
      });
      // Invalidate and refetch conversations
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setSelectedConversation(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to archive conversation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleViewConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setDialogOpen(true);
  };
  
  const handleDeleteConversation = (conversationId: number) => {
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (conversationToDelete) {
      deleteConversationMutation.mutate(conversationToDelete);
    }
  };
  
  const handleArchiveConversation = (conversationId: number) => {
    archiveConversationMutation.mutate(conversationId);
  };
  
  const handleDownloadConversation = () => {
    if (!selectedConversation || !messages.length) return;
    
    // Format the conversation data for download
    const title = selectedConversation.title;
    const date = selectedConversation.createdAt ? new Date(selectedConversation.createdAt).toLocaleDateString() : 'Unknown date';
    
    let conversationText = `# ${title}\nDate: ${date}\n\n`;
    
    messages.forEach((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'Unknown time';
      const sender = message.sender === 'user' ? 'You' : 'Agent';
      
      conversationText += `## ${sender} - ${timestamp}\n${message.content}\n\n`;
    });
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([conversationText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `conversation-${selectedConversation.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Conversation Downloaded",
      description: "Your conversation has been downloaded as Markdown.",
    });
  };
  
  const handleCopyConversation = () => {
    if (!selectedConversation || !messages.length) return;
    
    // Format the conversation data for copying
    const title = selectedConversation.title;
    const date = selectedConversation.createdAt ? new Date(selectedConversation.createdAt).toLocaleDateString() : 'Unknown date';
    
    let conversationText = `${title} - ${date}\n\n`;
    
    messages.forEach((message) => {
      const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleString() : 'Unknown time';
      const sender = message.sender === 'user' ? 'You' : 'Agent';
      
      conversationText += `${sender} - ${timestamp}\n${message.content}\n\n`;
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(conversationText).then(
      () => {
        toast({
          title: "Copied to Clipboard",
          description: "Conversation text has been copied to clipboard.",
        });
      },
      () => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy text. Please try again.",
          variant: "destructive",
        });
      }
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Conversations</CardTitle>
          <CardDescription>
            View, download, or manage your agent conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConversations ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-slate-500 mt-2">
                Start a conversation with an agent to see it here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {conversations.map((conversation: Conversation) => (
                <div 
                  key={conversation.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-primary mr-3" />
                    <div>
                      <h3 className="font-medium">{conversation.title}</h3>
                      <p className="text-sm text-slate-500">
                        {conversation.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewConversation(conversation)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveConversation(conversation.id)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Archive Conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteConversation(conversation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Conversation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Conversation Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedConversation?.title}</DialogTitle>
            <DialogDescription>
              Created on {selectedConversation?.createdAt ? new Date(selectedConversation.createdAt).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-grow py-4">
            {isLoadingConversationDetails ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-500">This conversation is empty.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg: Message, index: number) => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 
                        ${msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-slate-100 text-slate-900'
                        }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {msg.sender === 'user' ? 'You' : 'Agent'}
                      </div>
                      <div 
                        className={msg.sender === 'agent' ? 'agent-message' : ''}
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
                      <div className="text-xs mt-2 opacity-70">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Unknown time'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadConversation}
                disabled={!messages.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyConversation}
                disabled={!messages.length}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
            </div>
            <Button 
              variant="default" 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteConversationMutation.isPending}
            >
              {deleteConversationMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}