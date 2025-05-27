import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, User, DollarSign, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";

// Define types for our data
interface UserData {
  id: number;
  username: string;
  email: string | null;
  serviceLevel: string | null;
  createdAt: string;
  isAdmin?: boolean;
}

interface InvoiceData {
  id: number;
  userId: number;
  amount: number;
  status: string;
  invoiceDate: string;
  description: string;
  url?: string;
}

interface ConversationData {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

interface AgentData {
  id: number;
  name: string;
  category: string;
  phase: number;
  coordinator: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);

  // Check if user is admin (based on username)
  const isAdminUser = user && ["admin", "owner", "janice"].some(name => user.username.toLowerCase() === name.toLowerCase());

  // Use useEffect for navigation instead of doing it during render
  useEffect(() => {
    if (user && !isAdminUser) {
      navigate("/");
    }
  }, [user, isAdminUser, navigate]);

  // Fetch all users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<UserData[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  // Fetch all invoices
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery<InvoiceData[]>({
    queryKey: ["/api/admin/invoices"],
    retry: false,
  });

  // Fetch all conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<ConversationData[]>({
    queryKey: ["/api/admin/conversations"],
    retry: false,
  });

  // Fetch agents (using existing endpoint)
  const { data: agents = [], isLoading: isLoadingAgents } = useQuery<AgentData[]>({
    queryKey: ["/api/agents"],
    retry: false,
  });

  // Handle view user details
  const handleViewUser = (userId: number) => {
    setSelectedUserId(userId);
    setIsPromoteDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100); // Convert cents to dollars
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, view finances, and monitor system performance
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User size={16} />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Conversations</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Info size={16} />
              <span>Agents</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableCaption>List of all registered users</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Service Level</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={["admin", "owner"].includes(user.username) ? "destructive" : "outline"}>
                                {["admin", "owner"].includes(user.username) ? "Admin" : "User"}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</TableCell>
                            <TableCell>{user.serviceLevel || "Free"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewUser(user.id)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  View all financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInvoices ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableCaption>List of all invoices</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.userId}</TableCell>
                            <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                invoice.status === "paid" ? "default" : 
                                invoice.status === "pending" ? "outline" : "destructive"
                              }>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {invoice.description}
                            </TableCell>
                            <TableCell>
                              {invoice.url ? (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={invoice.url} target="_blank" rel="noopener noreferrer">
                                    View
                                  </a>
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" disabled>
                                  No PDF
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>
                  View all user conversations with agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConversations ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableCaption>List of all conversations</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversations.map((conversation) => (
                          <TableRow key={conversation.id}>
                            <TableCell>{conversation.id}</TableCell>
                            <TableCell>{conversation.userId}</TableCell>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {conversation.title}
                            </TableCell>
                            <TableCell>{formatDate(conversation.createdAt)}</TableCell>
                            <TableCell>{formatDate(conversation.updatedAt)}</TableCell>
                            <TableCell>
                              <Badge variant={conversation.isArchived ? "outline" : "default"}>
                                {conversation.isArchived ? "Archived" : "Active"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agents</CardTitle>
                <CardDescription>
                  View and manage AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAgents ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableCaption>List of all AI agents</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Phase</TableHead>
                          <TableHead>Coordinator</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents.map((agent) => (
                          <TableRow key={agent.id}>
                            <TableCell>{agent.id}</TableCell>
                            <TableCell className="font-medium">{agent.name}</TableCell>
                            <TableCell>{agent.category}</TableCell>
                            <TableCell>Phase {agent.phase}</TableCell>
                            <TableCell>
                              {agent.coordinator ? (
                                <Badge>Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog for viewing user details */}
        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected user
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedUserId && users.find(u => u.id === selectedUserId) && (
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <div className="font-medium">{users.find(u => u.id === selectedUserId)?.username}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="font-medium">{users.find(u => u.id === selectedUserId)?.email || "N/A"}</div>
                  </div>
                  <div>
                    <Label>Service Level</Label>
                    <div className="font-medium">{users.find(u => u.id === selectedUserId)?.serviceLevel || "Free"}</div>
                  </div>
                  <div>
                    <Label>Created At</Label>
                    <div className="font-medium">
                      {users.find(u => u.id === selectedUserId)?.createdAt 
                        ? formatDate(users.find(u => u.id === selectedUserId)!.createdAt) 
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <Label>Admin Status</Label>
                    <div className="font-medium">
                      {["admin", "owner"].includes(users.find(u => u.id === selectedUserId)?.username || "") 
                        ? "Admin" 
                        : "Regular User"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}