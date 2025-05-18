import { 
  agents as agentsSchema, 
  messages as messagesSchema, 
  users, 
  conversations,
  conversationAgents,
  invoices,
  type User, 
  type InsertUser, 
  type Message, 
  type InsertMessage,
  type Conversation,
  type InsertConversation,
  type Invoice,
  type InsertInvoice
} from "@shared/schema";
import { agents as agentsData } from "../client/src/data/agents";
import { db } from "./db";
import { eq, inArray, desc, and, isNull } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";
import { nanoid } from "nanoid";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string, serviceLevel?: string }): Promise<User>;
  getAllUsers(): Promise<User[]>; // Admin functionality
  updateUserRole(userId: number, role: "user" | "admin"): Promise<User>; // Admin functionality
  
  // Agent methods
  getAgents(): Promise<typeof agentsData>;
  getAgent(id: number): Promise<typeof agentsData[0] | undefined>;
  getAgentsByIds(ids: number[]): Promise<typeof agentsData>;
  
  // Message methods
  getMessages(): Promise<Message[]>;
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Conversation methods
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation>;
  archiveConversation(id: number): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getAllConversations(): Promise<Conversation[]>; // Admin functionality
  
  // Conversation-Agent relationships
  addAgentToConversation(conversationId: number, agentId: number): Promise<void>;
  getAgentsByConversationId(conversationId: number): Promise<typeof agentsData>;
  
  // Invoice methods
  getInvoicesByUserId(userId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getAllInvoices(): Promise<Invoice[]>; // Admin functionality
  
  // Session store
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

  // User methods
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
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async updateUserStripeInfo(
    userId: number,
    info: { customerId: string, subscriptionId: string, serviceLevel?: string }
  ): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId: info.customerId,
        stripeSubscriptionId: info.subscriptionId,
        serviceLevel: info.serviceLevel || null
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Agent methods - still using static data
  async getAgents(): Promise<typeof agentsData> {
    return this.agents;
  }

  async getAgent(id: number): Promise<typeof agentsData[0] | undefined> {
    return this.agents.find(agent => agent.id === id);
  }

  async getAgentsByIds(ids: number[]): Promise<typeof agentsData> {
    return this.agents.filter(agent => ids.includes(agent.id));
  }

  // Message methods
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messagesSchema).orderBy(messagesSchema.timestamp);
  }
  
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return await db.select()
      .from(messagesSchema)
      .where(eq(messagesSchema.conversationId, conversationId))
      .orderBy(messagesSchema.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    // Generate a unique ID for the message if not provided
    const messageWithId = {
      ...message,
      id: message.id || nanoid(),
    };
    
    const [newMessage] = await db.insert(messagesSchema)
      .values(messageWithId)
      .returning();
    
    return newMessage;
  }
  
  // Conversation methods
  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    return await db.select()
      .from(conversations)
      .where(
        and(
          eq(conversations.userId, userId),
          eq(conversations.isArchived, false)
        )
      )
      .orderBy(desc(conversations.updatedAt));
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select()
      .from(conversations)
      .where(eq(conversations.id, id));
    
    return conversation;
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations)
      .values(conversation)
      .returning();
    
    return newConversation;
  }
  
  async updateConversation(id: number, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [updatedConversation] = await db.update(conversations)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    
    return updatedConversation;
  }
  
  async archiveConversation(id: number): Promise<Conversation> {
    const [archivedConversation] = await db.update(conversations)
      .set({
        isArchived: true,
        updatedAt: new Date()
      })
      .where(eq(conversations.id, id))
      .returning();
    
    return archivedConversation;
  }
  
  async deleteConversation(id: number): Promise<void> {
    // First delete all related conversation-agent records
    await db.delete(conversationAgents)
      .where(eq(conversationAgents.conversationId, id));
    
    // Then delete all messages in the conversation
    await db.delete(messagesSchema)
      .where(eq(messagesSchema.conversationId, id));
    
    // Finally delete the conversation itself
    await db.delete(conversations)
      .where(eq(conversations.id, id));
  }
  
  // Conversation-Agent relationships
  async addAgentToConversation(conversationId: number, agentId: number): Promise<void> {
    await db.insert(conversationAgents)
      .values({
        conversationId,
        agentId
      })
      .onConflictDoNothing();
  }
  
  async getAgentsByConversationId(conversationId: number): Promise<typeof agentsData> {
    // Get the agent IDs for this conversation
    const conversationAgentRows = await db.select()
      .from(conversationAgents)
      .where(eq(conversationAgents.conversationId, conversationId));
    
    const agentIds = conversationAgentRows.map(row => row.agentId);
    
    // Return the corresponding agents
    return this.getAgentsByIds(agentIds);
  }
  
  // Invoice methods
  async getInvoicesByUserId(userId: number): Promise<Invoice[]> {
    return await db.select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.invoiceDate));
  }
  
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select()
      .from(invoices)
      .where(eq(invoices.id, id));
    
    return invoice;
  }
  
  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices)
      .values(invoice)
      .returning();
    
    return newInvoice;
  }

  // Admin functionality
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.id);
  }

  async updateUserRole(userId: number, role: "user" | "admin"): Promise<User> {
    const [updatedUser] = await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db.select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt));
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await db.select()
      .from(invoices)
      .orderBy(desc(invoices.invoiceDate));
  }
}

export const storage = new DatabaseStorage();