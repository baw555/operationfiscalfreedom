import { 
  users, type User, type InsertUser,
  affiliateApplications, type AffiliateApplication, type InsertAffiliateApplication,
  helpRequests, type HelpRequest, type InsertHelpRequest,
  startupGrants, type StartupGrant, type InsertStartupGrant
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull, or, ilike } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAffiliates(): Promise<User[]>;
  updateUserPassword(id: number, passwordHash: string): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;

  // Affiliate Applications
  createAffiliateApplication(app: InsertAffiliateApplication): Promise<AffiliateApplication>;
  getAffiliateApplication(id: number): Promise<AffiliateApplication | undefined>;
  getAllAffiliateApplications(): Promise<AffiliateApplication[]>;
  getAffiliateApplicationsByAssignee(userId: number): Promise<AffiliateApplication[]>;
  updateAffiliateApplication(id: number, updates: Partial<AffiliateApplication>): Promise<AffiliateApplication | undefined>;

  // Help Requests
  createHelpRequest(req: InsertHelpRequest): Promise<HelpRequest>;
  getHelpRequest(id: number): Promise<HelpRequest | undefined>;
  getAllHelpRequests(): Promise<HelpRequest[]>;
  getHelpRequestsByAssignee(userId: number): Promise<HelpRequest[]>;
  updateHelpRequest(id: number, updates: Partial<HelpRequest>): Promise<HelpRequest | undefined>;

  // Startup Grants
  createStartupGrant(grant: InsertStartupGrant): Promise<StartupGrant>;
  getStartupGrant(id: number): Promise<StartupGrant | undefined>;
  getAllStartupGrants(): Promise<StartupGrant[]>;
  getStartupGrantsByAssignee(userId: number): Promise<StartupGrant[]>;
  updateStartupGrant(id: number, updates: Partial<StartupGrant>): Promise<StartupGrant | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllAffiliates(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "affiliate")).orderBy(desc(users.createdAt));
  }

  async updateUserPassword(id: number, passwordHash: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ passwordHash }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Affiliate Applications
  async createAffiliateApplication(app: InsertAffiliateApplication): Promise<AffiliateApplication> {
    const [application] = await db.insert(affiliateApplications).values(app).returning();
    return application;
  }

  async getAffiliateApplication(id: number): Promise<AffiliateApplication | undefined> {
    const [app] = await db.select().from(affiliateApplications).where(eq(affiliateApplications.id, id));
    return app || undefined;
  }

  async getAllAffiliateApplications(): Promise<AffiliateApplication[]> {
    return db.select().from(affiliateApplications).orderBy(desc(affiliateApplications.createdAt));
  }

  async getAffiliateApplicationsByAssignee(userId: number): Promise<AffiliateApplication[]> {
    return db.select().from(affiliateApplications)
      .where(eq(affiliateApplications.assignedTo, userId))
      .orderBy(desc(affiliateApplications.createdAt));
  }

  async updateAffiliateApplication(id: number, updates: Partial<AffiliateApplication>): Promise<AffiliateApplication | undefined> {
    const [app] = await db.update(affiliateApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(affiliateApplications.id, id))
      .returning();
    return app || undefined;
  }

  // Help Requests
  async createHelpRequest(req: InsertHelpRequest): Promise<HelpRequest> {
    const [request] = await db.insert(helpRequests).values(req).returning();
    return request;
  }

  async getHelpRequest(id: number): Promise<HelpRequest | undefined> {
    const [req] = await db.select().from(helpRequests).where(eq(helpRequests.id, id));
    return req || undefined;
  }

  async getAllHelpRequests(): Promise<HelpRequest[]> {
    return db.select().from(helpRequests).orderBy(desc(helpRequests.createdAt));
  }

  async getHelpRequestsByAssignee(userId: number): Promise<HelpRequest[]> {
    return db.select().from(helpRequests)
      .where(eq(helpRequests.assignedTo, userId))
      .orderBy(desc(helpRequests.createdAt));
  }

  async updateHelpRequest(id: number, updates: Partial<HelpRequest>): Promise<HelpRequest | undefined> {
    const [req] = await db.update(helpRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(helpRequests.id, id))
      .returning();
    return req || undefined;
  }

  // Startup Grants
  async createStartupGrant(grant: InsertStartupGrant): Promise<StartupGrant> {
    const [result] = await db.insert(startupGrants).values(grant).returning();
    return result;
  }

  async getStartupGrant(id: number): Promise<StartupGrant | undefined> {
    const [grant] = await db.select().from(startupGrants).where(eq(startupGrants.id, id));
    return grant || undefined;
  }

  async getAllStartupGrants(): Promise<StartupGrant[]> {
    return db.select().from(startupGrants).orderBy(desc(startupGrants.createdAt));
  }

  async getStartupGrantsByAssignee(userId: number): Promise<StartupGrant[]> {
    return db.select().from(startupGrants)
      .where(eq(startupGrants.assignedTo, userId))
      .orderBy(desc(startupGrants.createdAt));
  }

  async updateStartupGrant(id: number, updates: Partial<StartupGrant>): Promise<StartupGrant | undefined> {
    const [grant] = await db.update(startupGrants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(startupGrants.id, id))
      .returning();
    return grant || undefined;
  }
}

export const storage = new DatabaseStorage();
