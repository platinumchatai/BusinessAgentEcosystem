import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, type InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define a simulated user type
type SimulatedUser = {
  id: number;
  username: string;
  isSimulated: true;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | SimulatedUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
  simulateLogin: (username: string) => void;
  simulateLogout: () => void;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [simulatedUser, setSimulatedUser] = useState<SimulatedUser | null>(null);
  
  // Load simulated user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('simulatedUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setSimulatedUser({
          id: 999, // Use a high ID that won't conflict
          username: userData.username,
          isSimulated: true
        });
      } catch (e) {
        console.error("Error parsing simulated user from localStorage");
      }
    }
  }, []);
  
  const {
    data: realUser,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/user");
        if (res.status === 401) {
          return null;
        }
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  });
  
  // Use either the real user or the simulated one
  const user = realUser || simulatedUser;

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Username might already be taken",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Simulate login function
  const simulateLogin = (username: string) => {
    // Create a simulated user and save to localStorage
    const mockUser: SimulatedUser = {
      id: 999,
      username,
      isSimulated: true
    };
    
    localStorage.setItem('simulatedUser', JSON.stringify(mockUser));
    setSimulatedUser(mockUser);
    
    toast({
      title: "Simulated Login",
      description: `Welcome, ${username}!`,
    });
  };
  
  // Simulate logout function
  const simulateLogout = () => {
    localStorage.removeItem('simulatedUser');
    setSimulatedUser(null);
    
    // Clear any cookies just to be safe
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to home page
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        simulateLogin,
        simulateLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}