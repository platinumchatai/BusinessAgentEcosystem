import { Request, Response, NextFunction } from "express";

// List of admin usernames - add your actual username here
const ADMIN_USERNAMES = ["admin", "owner", "Janice"];

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    console.log("Admin check failed: User not authenticated");
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  console.log(`Admin check for user: ${req.user!.username}`);
  
  // Check if user is in the admin list (case insensitive)
  if (!ADMIN_USERNAMES.some(admin => admin.toLowerCase() === req.user!.username.toLowerCase())) {
    console.log(`Admin access denied for user: ${req.user!.username}`);
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  console.log(`Admin access granted for user: ${req.user!.username}`);
  // User is authenticated and has admin permissions
  next();
};