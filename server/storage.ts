import { 
  users, type User, type InsertUser,
  affiliateApplications, type AffiliateApplication, type InsertAffiliateApplication,
  helpRequests, type HelpRequest, type InsertHelpRequest,
  startupGrants, type StartupGrant, type InsertStartupGrant,
  furnitureAssistance, type FurnitureAssistance, type InsertFurnitureAssistance,
  investorSubmissions, type InvestorSubmission, type InsertInvestorSubmission,
  privateDoctorRequests, type PrivateDoctorRequest, type InsertPrivateDoctorRequest,
  websiteApplications, type WebsiteApplication, type InsertWebsiteApplication,
  generalContact, type GeneralContact, type InsertGeneralContact,
  vltIntake, type VltIntake, type InsertVltIntake,
  vltAffiliates, type VltAffiliate, type InsertVltAffiliate
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

  // Furniture Assistance
  createFurnitureAssistance(req: InsertFurnitureAssistance): Promise<FurnitureAssistance>;
  getFurnitureAssistance(id: number): Promise<FurnitureAssistance | undefined>;
  getAllFurnitureAssistance(): Promise<FurnitureAssistance[]>;
  getFurnitureAssistanceByAssignee(userId: number): Promise<FurnitureAssistance[]>;
  updateFurnitureAssistance(id: number, updates: Partial<FurnitureAssistance>): Promise<FurnitureAssistance | undefined>;

  // Investor Submissions
  createInvestorSubmission(submission: InsertInvestorSubmission): Promise<InvestorSubmission>;
  getInvestorSubmission(id: number): Promise<InvestorSubmission | undefined>;
  getAllInvestorSubmissions(): Promise<InvestorSubmission[]>;
  getInvestorSubmissionsByAssignee(userId: number): Promise<InvestorSubmission[]>;
  updateInvestorSubmission(id: number, updates: Partial<InvestorSubmission>): Promise<InvestorSubmission | undefined>;

  // Private Doctor Requests
  createPrivateDoctorRequest(req: InsertPrivateDoctorRequest): Promise<PrivateDoctorRequest>;
  getPrivateDoctorRequest(id: number): Promise<PrivateDoctorRequest | undefined>;
  getAllPrivateDoctorRequests(): Promise<PrivateDoctorRequest[]>;
  getPrivateDoctorRequestsByAssignee(userId: number): Promise<PrivateDoctorRequest[]>;
  updatePrivateDoctorRequest(id: number, updates: Partial<PrivateDoctorRequest>): Promise<PrivateDoctorRequest | undefined>;

  // Website Applications
  createWebsiteApplication(app: InsertWebsiteApplication): Promise<WebsiteApplication>;
  getWebsiteApplication(id: number): Promise<WebsiteApplication | undefined>;
  getAllWebsiteApplications(): Promise<WebsiteApplication[]>;
  getWebsiteApplicationsByAssignee(userId: number): Promise<WebsiteApplication[]>;
  updateWebsiteApplication(id: number, updates: Partial<WebsiteApplication>): Promise<WebsiteApplication | undefined>;

  // General Contact
  createGeneralContact(contact: InsertGeneralContact): Promise<GeneralContact>;
  getGeneralContact(id: number): Promise<GeneralContact | undefined>;
  getAllGeneralContacts(): Promise<GeneralContact[]>;
  getGeneralContactsByAssignee(userId: number): Promise<GeneralContact[]>;
  updateGeneralContact(id: number, updates: Partial<GeneralContact>): Promise<GeneralContact | undefined>;

  // VLT Intake
  createVltIntake(intake: InsertVltIntake): Promise<VltIntake>;
  getVltIntake(id: number): Promise<VltIntake | undefined>;
  getAllVltIntakes(): Promise<VltIntake[]>;
  updateVltIntake(id: number, updates: Partial<VltIntake>): Promise<VltIntake | undefined>;
  getVltIntakesByAffiliate(affiliateId: number): Promise<VltIntake[]>;

  // VLT Affiliates
  createVltAffiliate(affiliate: InsertVltAffiliate): Promise<VltAffiliate>;
  getVltAffiliate(id: number): Promise<VltAffiliate | undefined>;
  getVltAffiliateByEmail(email: string): Promise<VltAffiliate | undefined>;
  getVltAffiliateByReferralCode(code: string): Promise<VltAffiliate | undefined>;
  getAllVltAffiliates(): Promise<VltAffiliate[]>;
  updateVltAffiliate(id: number, updates: Partial<VltAffiliate>): Promise<VltAffiliate | undefined>;
  deleteVltAffiliate(id: number): Promise<void>;
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

  // Furniture Assistance
  async createFurnitureAssistance(req: InsertFurnitureAssistance): Promise<FurnitureAssistance> {
    const [result] = await db.insert(furnitureAssistance).values(req).returning();
    return result;
  }

  async getFurnitureAssistance(id: number): Promise<FurnitureAssistance | undefined> {
    const [req] = await db.select().from(furnitureAssistance).where(eq(furnitureAssistance.id, id));
    return req || undefined;
  }

  async getAllFurnitureAssistance(): Promise<FurnitureAssistance[]> {
    return db.select().from(furnitureAssistance).orderBy(desc(furnitureAssistance.createdAt));
  }

  async getFurnitureAssistanceByAssignee(userId: number): Promise<FurnitureAssistance[]> {
    return db.select().from(furnitureAssistance)
      .where(eq(furnitureAssistance.assignedTo, userId))
      .orderBy(desc(furnitureAssistance.createdAt));
  }

  async updateFurnitureAssistance(id: number, updates: Partial<FurnitureAssistance>): Promise<FurnitureAssistance | undefined> {
    const [req] = await db.update(furnitureAssistance)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(furnitureAssistance.id, id))
      .returning();
    return req || undefined;
  }

  // Investor Submissions
  async createInvestorSubmission(submission: InsertInvestorSubmission): Promise<InvestorSubmission> {
    const [result] = await db.insert(investorSubmissions).values(submission).returning();
    return result;
  }

  async getInvestorSubmission(id: number): Promise<InvestorSubmission | undefined> {
    const [submission] = await db.select().from(investorSubmissions).where(eq(investorSubmissions.id, id));
    return submission || undefined;
  }

  async getAllInvestorSubmissions(): Promise<InvestorSubmission[]> {
    return db.select().from(investorSubmissions).orderBy(desc(investorSubmissions.createdAt));
  }

  async getInvestorSubmissionsByAssignee(userId: number): Promise<InvestorSubmission[]> {
    return db.select().from(investorSubmissions)
      .where(eq(investorSubmissions.assignedTo, userId))
      .orderBy(desc(investorSubmissions.createdAt));
  }

  async updateInvestorSubmission(id: number, updates: Partial<InvestorSubmission>): Promise<InvestorSubmission | undefined> {
    const [submission] = await db.update(investorSubmissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(investorSubmissions.id, id))
      .returning();
    return submission || undefined;
  }

  // Private Doctor Requests
  async createPrivateDoctorRequest(req: InsertPrivateDoctorRequest): Promise<PrivateDoctorRequest> {
    const [result] = await db.insert(privateDoctorRequests).values(req).returning();
    return result;
  }

  async getPrivateDoctorRequest(id: number): Promise<PrivateDoctorRequest | undefined> {
    const [req] = await db.select().from(privateDoctorRequests).where(eq(privateDoctorRequests.id, id));
    return req || undefined;
  }

  async getAllPrivateDoctorRequests(): Promise<PrivateDoctorRequest[]> {
    return db.select().from(privateDoctorRequests).orderBy(desc(privateDoctorRequests.createdAt));
  }

  async getPrivateDoctorRequestsByAssignee(userId: number): Promise<PrivateDoctorRequest[]> {
    return db.select().from(privateDoctorRequests)
      .where(eq(privateDoctorRequests.assignedTo, userId))
      .orderBy(desc(privateDoctorRequests.createdAt));
  }

  async updatePrivateDoctorRequest(id: number, updates: Partial<PrivateDoctorRequest>): Promise<PrivateDoctorRequest | undefined> {
    const [req] = await db.update(privateDoctorRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(privateDoctorRequests.id, id))
      .returning();
    return req || undefined;
  }

  // Website Applications
  async createWebsiteApplication(app: InsertWebsiteApplication): Promise<WebsiteApplication> {
    const [result] = await db.insert(websiteApplications).values(app).returning();
    return result;
  }

  async getWebsiteApplication(id: number): Promise<WebsiteApplication | undefined> {
    const [app] = await db.select().from(websiteApplications).where(eq(websiteApplications.id, id));
    return app || undefined;
  }

  async getAllWebsiteApplications(): Promise<WebsiteApplication[]> {
    return db.select().from(websiteApplications).orderBy(desc(websiteApplications.createdAt));
  }

  async getWebsiteApplicationsByAssignee(userId: number): Promise<WebsiteApplication[]> {
    return db.select().from(websiteApplications)
      .where(eq(websiteApplications.assignedTo, userId))
      .orderBy(desc(websiteApplications.createdAt));
  }

  async updateWebsiteApplication(id: number, updates: Partial<WebsiteApplication>): Promise<WebsiteApplication | undefined> {
    const [app] = await db.update(websiteApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(websiteApplications.id, id))
      .returning();
    return app || undefined;
  }

  // General Contact
  async createGeneralContact(contact: InsertGeneralContact): Promise<GeneralContact> {
    const [result] = await db.insert(generalContact).values(contact).returning();
    return result;
  }

  async getGeneralContact(id: number): Promise<GeneralContact | undefined> {
    const [contact] = await db.select().from(generalContact).where(eq(generalContact.id, id));
    return contact || undefined;
  }

  async getAllGeneralContacts(): Promise<GeneralContact[]> {
    return db.select().from(generalContact).orderBy(desc(generalContact.createdAt));
  }

  async getGeneralContactsByAssignee(userId: number): Promise<GeneralContact[]> {
    return db.select().from(generalContact)
      .where(eq(generalContact.assignedTo, userId))
      .orderBy(desc(generalContact.createdAt));
  }

  async updateGeneralContact(id: number, updates: Partial<GeneralContact>): Promise<GeneralContact | undefined> {
    const [contact] = await db.update(generalContact)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(generalContact.id, id))
      .returning();
    return contact || undefined;
  }

  // VLT Intake
  async createVltIntake(intake: InsertVltIntake): Promise<VltIntake> {
    // Lead routing logic based on issue type
    const routedTo =
      intake.issue === "credits" ? "CPA" :
      intake.issue === "resolution" ? "Tax Attorney" :
      "General";

    console.log("NEW LEAD:", {
      ...intake,
      routedTo,
      timestamp: new Date().toISOString()
    });

    const [result] = await db.insert(vltIntake).values({ ...intake, routedTo }).returning();
    return result;
  }

  async getVltIntake(id: number): Promise<VltIntake | undefined> {
    const [intake] = await db.select().from(vltIntake).where(eq(vltIntake.id, id));
    return intake || undefined;
  }

  async getAllVltIntakes(): Promise<VltIntake[]> {
    return db.select().from(vltIntake).orderBy(desc(vltIntake.createdAt));
  }

  async updateVltIntake(id: number, updates: Partial<VltIntake>): Promise<VltIntake | undefined> {
    const [intake] = await db.update(vltIntake)
      .set(updates)
      .where(eq(vltIntake.id, id))
      .returning();
    return intake || undefined;
  }

  async getVltIntakesByAffiliate(affiliateId: number): Promise<VltIntake[]> {
    return db.select().from(vltIntake)
      .where(or(
        eq(vltIntake.referredByL1, affiliateId),
        eq(vltIntake.referredByL2, affiliateId),
        eq(vltIntake.referredByL3, affiliateId),
        eq(vltIntake.referredByL4, affiliateId),
        eq(vltIntake.referredByL5, affiliateId),
        eq(vltIntake.referredByL6, affiliateId)
      ))
      .orderBy(desc(vltIntake.createdAt));
  }

  // VLT Affiliates
  async createVltAffiliate(affiliate: InsertVltAffiliate): Promise<VltAffiliate> {
    const [result] = await db.insert(vltAffiliates).values(affiliate).returning();
    return result;
  }

  async getVltAffiliate(id: number): Promise<VltAffiliate | undefined> {
    const [affiliate] = await db.select().from(vltAffiliates).where(eq(vltAffiliates.id, id));
    return affiliate || undefined;
  }

  async getVltAffiliateByEmail(email: string): Promise<VltAffiliate | undefined> {
    const [affiliate] = await db.select().from(vltAffiliates).where(eq(vltAffiliates.email, email));
    return affiliate || undefined;
  }

  async getVltAffiliateByReferralCode(code: string): Promise<VltAffiliate | undefined> {
    const [affiliate] = await db.select().from(vltAffiliates).where(eq(vltAffiliates.referralCode, code));
    return affiliate || undefined;
  }

  async getAllVltAffiliates(): Promise<VltAffiliate[]> {
    return db.select().from(vltAffiliates).orderBy(desc(vltAffiliates.createdAt));
  }

  async updateVltAffiliate(id: number, updates: Partial<VltAffiliate>): Promise<VltAffiliate | undefined> {
    const [affiliate] = await db.update(vltAffiliates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vltAffiliates.id, id))
      .returning();
    return affiliate || undefined;
  }

  async deleteVltAffiliate(id: number): Promise<void> {
    await db.delete(vltAffiliates).where(eq(vltAffiliates.id, id));
  }
}

export const storage = new DatabaseStorage();
