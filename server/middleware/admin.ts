import { Request, Response, NextFunction } from "express";

// List of admin usernames
const ADMIN_USERNAMES = ["admin", "owner"];

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Check if user is in the admin list (case insensitive)
  if (!ADMIN_USERNAMES.some(admin => admin.toLowerCase() === req.user!.username.toLowerCase())) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  // User is authenticated and has admin permissions
  next();
};