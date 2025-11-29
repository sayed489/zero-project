import { drizzle } from "drizzle-orm/neon-serverless";
import { type User, type InsertUser, type Preorder, type InsertPreorder, users, preorders } from "@shared/schema";
import { eq } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Preorder methods
  createPreorder(preorder: InsertPreorder): Promise<Preorder>;
  getAllPreorders(): Promise<Preorder[]>;
  getPreorderById(id: string): Promise<Preorder | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createPreorder(insertPreorder: InsertPreorder): Promise<Preorder> {
    const result = await db.insert(preorders).values(insertPreorder).returning();
    return result[0];
  }

  async getAllPreorders(): Promise<Preorder[]> {
    return await db.select().from(preorders);
  }

  async getPreorderById(id: string): Promise<Preorder | undefined> {
    const result = await db.select().from(preorders).where(eq(preorders.id, id));
    return result[0];
  }
}

export const storage = new DatabaseStorage();
