import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Check if user has admin role
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  // User is authenticated and has admin role
  next();
};