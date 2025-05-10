import { useState } from "react";
import { User } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ProfileSectionProps {
  profile: Partial<User> | undefined;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(profile?.email || "");

  // Get a proper display format for the service level
  const formatServiceLevel = (level: string | undefined | null) => {
    if (!level) return "Free";
    
    // Convert from snake_case or camelCase to Title Case with spaces
    return level
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to spaces
      .replace(/_/g, ' ') // Convert snake_case to spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  // Get a visual representation (badge) for the service level
  const getServiceLevelBadge = (level: string | undefined | null) => {
    const displayLevel = formatServiceLevel(level);
    
    if (!level || level.toLowerCase().includes('free')) {
      return <Badge variant="outline" className="ml-2 text-slate-600">Free</Badge>;
    }
    
    if (level.toLowerCase().includes('basic') || level.toLowerCase().includes('starter')) {
      return <Badge variant="default" className="ml-2 bg-blue-500">Basic</Badge>;
    }
    
    if (level.toLowerCase().includes('pro') || level.toLowerCase().includes('premium')) {
      return <Badge variant="default" className="ml-2 bg-purple-600">Pro</Badge>;
    }
    
    if (level.toLowerCase().includes('enterprise') || level.toLowerCase().includes('business')) {
      return <Badge variant="default" className="ml-2 bg-amber-600">Enterprise</Badge>;
    }

    return <Badge variant="default" className="ml-2">{displayLevel}</Badge>;
  };

  const handleSubmit = () => {
    // In a real app, this would send an API request to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Account Information</CardTitle>
          <CardDescription>
            Manage your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile?.username || ""}
              disabled
              className="bg-slate-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-slate-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service-level">Service Level</Label>
            <div className="flex items-center">
              <Input
                id="service-level"
                value={formatServiceLevel(profile?.serviceLevel ?? null)}
                disabled
                className="bg-slate-50"
              />
              {getServiceLevelBadge(profile?.serviceLevel ?? null)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="created-at">Member Since</Label>
            <Input
              id="created-at"
              value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Not available"}
              disabled
              className="bg-slate-50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}