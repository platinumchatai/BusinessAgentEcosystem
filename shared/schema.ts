import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Agents table for agent data
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

export const insertAgentSchema = createInsertSchema(agents).pick({
  name: true,
  description: true,
  category: true,
  phase: true,
  coordinator: true,
  expertise: true,
  capabilities: true,
  whenToUse: true,
  relatedAgents: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// Messages table for chat history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  content: text("content").notNull(),
  agentIds: integer("agent_ids").array(),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  content: true,
  agentIds: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
