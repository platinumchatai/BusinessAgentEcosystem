import { Request, Response, NextFunction } from "express";

// List of admin usernames
const ADMIN_USERNAMES = ["admin", "owner"];

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Check if user is in the admin list
  if (!ADMIN_USERNAMES.includes(req.user!.username)) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  // User is authenticated and has admin permissions
  next();
};