import { agents as agentsSchema, messages as messagesSchema, users, type User, type InsertUser } from "@shared/schema";
import { agents as agentsData } from "../client/src/data/agents";

interface Message {
  id: string;
  content: string;
  agentIds?: number[];
  sender: string;
  timestamp: Date;
}

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAgents(): Promise<typeof agentsData>;
  getAgent(id: number): Promise<typeof agentsData[0] | undefined>;
  getAgentsByIds(ids: number[]): Promise<typeof agentsData>;
  getMessages(): Promise<Message[]>;
  createMessage(message: Message): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private agents: typeof agentsData;
  private messages: Message[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.agents = agentsData;
    this.messages = [];
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAgents(): Promise<typeof agentsData> {
    return this.agents;
  }

  async getAgent(id: number): Promise<typeof agentsData[0] | undefined> {
    return this.agents.find(agent => agent.id === id);
  }

  async getAgentsByIds(ids: number[]): Promise<typeof agentsData> {
    return this.agents.filter(agent => ids.includes(agent.id));
  }

  async getMessages(): Promise<Message[]> {
    return this.messages;
  }

  async createMessage(message: Message): Promise<Message> {
    this.messages.push(message);
    return message;
  }
}

export const storage = new MemStorage();
