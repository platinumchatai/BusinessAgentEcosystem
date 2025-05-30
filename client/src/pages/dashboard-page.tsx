import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";
import { User } from "@shared/schema";
import MainLayout from "@/layouts/MainLayout";

// Import dashboard components
import ProfileSection from "../components/dashboard/ProfileSection";
import ConversationsSection from "../components/dashboard/ConversationsSection";
import InvoicesSection from "../components/dashboard/InvoicesSection";
import WorkflowsSection from "../components/dashboard/WorkflowsSection";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  // Fetch user profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery<Partial<User>>({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  // If not authenticated, redirect to auth page
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Dashboard Header */}
        <div className="w-full bg-gradient-to-r from-[#1e4388] to-[#2a549e] py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {user?.displayName || user?.username}!
            </h1>
            <p className="text-slate-200 mt-2">
              Manage your account, conversations, and subscription
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading || isLoadingProfile ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs 
              defaultValue="profile" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full h-12 mb-8 grid grid-cols-2 md:grid-cols-4 gap-0">
                <TabsTrigger value="profile" className="w-full h-full data-[state=active]:w-full data-[state=active]:h-full mx-0 px-4 data-[state=active]:bg-[#1e4388] data-[state=active]:text-white rounded-sm">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="invoices" className="w-full h-full data-[state=active]:w-full data-[state=active]:h-full mx-0 px-4 data-[state=active]:bg-[#1e4388] data-[state=active]:text-white rounded-sm">
                  Billing & Invoices
                </TabsTrigger>
                <TabsTrigger value="conversations" className="w-full h-full data-[state=active]:w-full data-[state=active]:h-full mx-0 px-4 data-[state=active]:bg-[#1e4388] data-[state=active]:text-white rounded-sm">
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="workflows" className="w-full h-full data-[state=active]:w-full data-[state=active]:h-full mx-0 px-4 data-[state=active]:bg-[#1e4388] data-[state=active]:text-white rounded-sm">
                  Workflows
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <ProfileSection profile={profile} />
              </TabsContent>

              <TabsContent value="conversations" className="mt-6">
                <ConversationsSection userId={user?.id} />
              </TabsContent>

              <TabsContent value="invoices" className="mt-6">
                <InvoicesSection userId={user?.id} />
              </TabsContent>

              <TabsContent value="workflows" className="mt-6">
                <WorkflowsSection userId={user?.id} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </MainLayout>
  );
}