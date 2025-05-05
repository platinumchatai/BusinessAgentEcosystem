import { agents as agentsSchema, messages as messagesSchema, users, type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { agents as agentsData } from "../client/src/data/agents";
import { db } from "./db";
import { eq, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string, serviceLevel?: string }): Promise<User>;
  getAgents(): Promise<typeof agentsData>;
  getAgent(id: number): Promise<typeof agentsData[0] | undefined>;
  getAgentsByIds(ids: number[]): Promise<typeof agentsData>;
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  private agents: typeof agentsData;
  sessionStore: session.Store;

  constructor() {
    this.agents = agentsData;
    
    // Setup PostgreSQL-based session store
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // For agents, we're still using the static data from the agentsData array
  // since these are predefined and not dynamically created
  async getAgents(): Promise<typeof agentsData> {
    return this.agents;
  }

  async getAgent(id: number): Promise<typeof agentsData[0] | undefined> {
    return this.agents.find(agent => agent.id === id);
  }

  async getAgentsByIds(ids: number[]): Promise<typeof agentsData> {
    return this.agents.filter(agent => ids.includes(agent.id));
  }

  // For messages, we use the database
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messagesSchema).orderBy(messagesSchema.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messagesSchema).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();