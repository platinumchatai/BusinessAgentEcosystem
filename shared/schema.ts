import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Agents table for agent data - just define the types, we'll use the static data
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  phase: integer("phase").notNull(),
  coordinator: boolean("coordinator").notNull().default(false),
  expertise: text("expertise").array().notNull(),
  capabilities: text("capabilities").array().notNull(),
  whenToUse: text("when_to_use").array().notNull(),
  relatedAgents: integer("related_agents").array().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// Messages table for chat history
export const messages = pgTable("messages", {
  id: text("id").primaryKey(), // Use text for nanoid compatibility
  content: text("content").notNull(),
  agentIds: integer("agent_ids").array(),
  sender: text("sender").notNull(), // 'user' or 'agent'
  timestamp: timestamp("timestamp").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
