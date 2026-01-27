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
  vltAffiliates, type VltAffiliate, type InsertVltAffiliate,
  opportunities, type Opportunity, type InsertOpportunity,
  sales, type Sale, type InsertSale,
  commissions, type Commission, type InsertCommission,
  veteranIntake, type VeteranIntake, type InsertVeteranIntake,
  businessIntake, type BusinessIntake, type InsertBusinessIntake,
  contractTemplates, type ContractTemplate, type InsertContractTemplate,
  signedAgreements, type SignedAgreement, type InsertSignedAgreement,
  commissionConfig, type CommissionConfig, type InsertCommissionConfig,
  affiliateNda, type AffiliateNda, type InsertAffiliateNda,
  businessLeads, type BusinessLead, type InsertBusinessLead,
  ipReferralTracking, type IpReferralTracking, type InsertIpReferralTracking,
  affiliateW9, type AffiliateW9, type InsertAffiliateW9,
  finopsReferrals, type FinopsReferral, type InsertFinopsReferral
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull, or, ilike, gt } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByReferralCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAffiliates(): Promise<User[]>;
  updateUserPassword(id: number, passwordHash: string): Promise<User | undefined>;
  updateUserReferralCode(id: number, referralCode: string): Promise<User | undefined>;
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
  getVltAffiliatesByRole(role: string): Promise<VltAffiliate[]>;
  getVltAffiliateDownline(affiliateId: number): Promise<VltAffiliate[]>;
  updateVltAffiliate(id: number, updates: Partial<VltAffiliate>): Promise<VltAffiliate | undefined>;
  deleteVltAffiliate(id: number): Promise<void>;

  // Opportunities
  createOpportunity(opp: InsertOpportunity): Promise<Opportunity>;
  getOpportunity(id: number): Promise<Opportunity | undefined>;
  getAllOpportunities(): Promise<Opportunity[]>;
  getOpportunitiesByCategory(category: string): Promise<Opportunity[]>;
  updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity | undefined>;

  // Sales
  createSale(sale: InsertSale): Promise<Sale>;
  getSale(id: number): Promise<Sale | undefined>;
  getAllSales(): Promise<Sale[]>;
  getSalesByAffiliate(affiliateId: number): Promise<Sale[]>;
  getSalesByDownline(affiliateId: number): Promise<Sale[]>;
  updateSale(id: number, updates: Partial<Sale>): Promise<Sale | undefined>;

  // Commissions
  createCommission(commission: InsertCommission): Promise<Commission>;
  getCommission(id: number): Promise<Commission | undefined>;
  getCommissionsByAffiliate(affiliateId: number): Promise<Commission[]>;
  getCommissionsBySale(saleId: number): Promise<Commission[]>;
  updateCommission(id: number, updates: Partial<Commission>): Promise<Commission | undefined>;

  // Veteran Intake
  createVeteranIntake(intake: InsertVeteranIntake): Promise<VeteranIntake>;
  getVeteranIntake(id: number): Promise<VeteranIntake | undefined>;
  getAllVeteranIntakes(): Promise<VeteranIntake[]>;
  getVeteranIntakesByProgram(programType: string): Promise<VeteranIntake[]>;
  updateVeteranIntake(id: number, updates: Partial<VeteranIntake>): Promise<VeteranIntake | undefined>;

  // Business Intake
  createBusinessIntake(intake: InsertBusinessIntake): Promise<BusinessIntake>;
  getBusinessIntake(id: number): Promise<BusinessIntake | undefined>;
  getAllBusinessIntakes(): Promise<BusinessIntake[]>;
  getBusinessIntakesByService(serviceType: string): Promise<BusinessIntake[]>;
  updateBusinessIntake(id: number, updates: Partial<BusinessIntake>): Promise<BusinessIntake | undefined>;

  // Contract Templates
  createContractTemplate(template: InsertContractTemplate): Promise<ContractTemplate>;
  getContractTemplate(id: number): Promise<ContractTemplate | undefined>;
  getAllContractTemplates(): Promise<ContractTemplate[]>;
  getActiveContractTemplates(): Promise<ContractTemplate[]>;
  updateContractTemplate(id: number, updates: Partial<ContractTemplate>): Promise<ContractTemplate | undefined>;

  // Signed Agreements
  createSignedAgreement(agreement: InsertSignedAgreement): Promise<SignedAgreement>;
  getSignedAgreement(id: number): Promise<SignedAgreement | undefined>;
  getAllSignedAgreements(): Promise<SignedAgreement[]>;
  getSignedAgreementsByAffiliate(affiliateId: number): Promise<SignedAgreement[]>;
  hasAffiliateSignedContract(affiliateId: number, contractTemplateId: number): Promise<boolean>;
  updateSignedAgreement(id: number, updates: Partial<SignedAgreement>): Promise<SignedAgreement | undefined>;

  // Commission Config
  createCommissionConfig(config: InsertCommissionConfig): Promise<CommissionConfig>;
  getActiveCommissionConfig(): Promise<CommissionConfig | undefined>;
  updateCommissionConfig(id: number, updates: Partial<CommissionConfig>): Promise<CommissionConfig | undefined>;

  // Affiliate NDA
  createAffiliateNda(nda: InsertAffiliateNda): Promise<AffiliateNda>;
  getAffiliateNdaByUserId(userId: number): Promise<AffiliateNda | undefined>;
  hasAffiliateSignedNda(userId: number): Promise<boolean>;
  getAllAffiliateNdas(): Promise<AffiliateNda[]>;

  // Business Leads
  createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead>;
  getBusinessLead(id: number): Promise<BusinessLead | undefined>;
  getAllBusinessLeads(): Promise<BusinessLead[]>;
  getBusinessLeadsByType(leadType: string): Promise<BusinessLead[]>;
  getBusinessLeadsByReferrer(referredBy: number): Promise<BusinessLead[]>;
  updateBusinessLead(id: number, updates: Partial<BusinessLead>): Promise<BusinessLead | undefined>;

  // IP Referral Tracking
  createIpReferralTracking(data: InsertIpReferralTracking): Promise<IpReferralTracking>;
  getActiveIpReferral(ipAddress: string): Promise<IpReferralTracking | undefined>;
  getIpReferralsByAffiliate(affiliateId: number): Promise<IpReferralTracking[]>;
  getAllIpReferrals(): Promise<IpReferralTracking[]>;

  // W9 Forms
  createAffiliateW9(w9: InsertAffiliateW9): Promise<AffiliateW9>;
  getAffiliateW9ByUserId(userId: number): Promise<AffiliateW9 | undefined>;
  hasAffiliateSubmittedW9(userId: number): Promise<boolean>;

  // Fin-Ops Referral Tracking
  createFinopsReferral(referral: InsertFinopsReferral): Promise<FinopsReferral>;
  getFinopsReferral(id: number): Promise<FinopsReferral | undefined>;
  getAllFinopsReferrals(): Promise<FinopsReferral[]>;
  getFinopsReferralsByAffiliate(affiliateId: number): Promise<FinopsReferral[]>;
  getFinopsReferralsByPartnerType(partnerType: string): Promise<FinopsReferral[]>;
  updateFinopsReferral(id: number, updates: Partial<FinopsReferral>): Promise<FinopsReferral | undefined>;
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

  async getUserByReferralCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.referralCode, code));
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

  async updateUserReferralCode(id: number, referralCode: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ referralCode }).where(eq(users.id, id)).returning();
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

  async getVltAffiliatesByRole(role: string): Promise<VltAffiliate[]> {
    return db.select().from(vltAffiliates).where(eq(vltAffiliates.role, role)).orderBy(desc(vltAffiliates.createdAt));
  }

  async getVltAffiliateDownline(affiliateId: number): Promise<VltAffiliate[]> {
    return db.select().from(vltAffiliates).where(
      or(
        eq(vltAffiliates.level1Id, affiliateId),
        eq(vltAffiliates.level2Id, affiliateId),
        eq(vltAffiliates.level3Id, affiliateId),
        eq(vltAffiliates.level4Id, affiliateId),
        eq(vltAffiliates.level5Id, affiliateId),
        eq(vltAffiliates.level6Id, affiliateId),
        eq(vltAffiliates.level7Id, affiliateId)
      )
    ).orderBy(desc(vltAffiliates.createdAt));
  }

  // Opportunities
  async createOpportunity(opp: InsertOpportunity): Promise<Opportunity> {
    const [result] = await db.insert(opportunities).values(opp).returning();
    return result;
  }

  async getOpportunity(id: number): Promise<Opportunity | undefined> {
    const [opp] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return opp || undefined;
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunitiesByCategory(category: string): Promise<Opportunity[]> {
    return db.select().from(opportunities).where(eq(opportunities.category, category)).orderBy(desc(opportunities.createdAt));
  }

  async updateOpportunity(id: number, updates: Partial<Opportunity>): Promise<Opportunity | undefined> {
    const [opp] = await db.update(opportunities).set(updates).where(eq(opportunities.id, id)).returning();
    return opp || undefined;
  }

  // Sales
  async createSale(sale: InsertSale): Promise<Sale> {
    const [result] = await db.insert(sales).values(sale).returning();
    return result;
  }

  async getSale(id: number): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async getAllSales(): Promise<Sale[]> {
    return db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSalesByAffiliate(affiliateId: number): Promise<Sale[]> {
    return db.select().from(sales).where(eq(sales.affiliateId, affiliateId)).orderBy(desc(sales.createdAt));
  }

  async getSalesByDownline(affiliateId: number): Promise<Sale[]> {
    return db.select().from(sales).where(
      or(
        eq(sales.referredByL1, affiliateId),
        eq(sales.referredByL2, affiliateId),
        eq(sales.referredByL3, affiliateId),
        eq(sales.referredByL4, affiliateId),
        eq(sales.referredByL5, affiliateId),
        eq(sales.referredByL6, affiliateId),
        eq(sales.referredByL7, affiliateId)
      )
    ).orderBy(desc(sales.createdAt));
  }

  async updateSale(id: number, updates: Partial<Sale>): Promise<Sale | undefined> {
    const [sale] = await db.update(sales).set({ ...updates, updatedAt: new Date() }).where(eq(sales.id, id)).returning();
    return sale || undefined;
  }

  // Commissions
  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [result] = await db.insert(commissions).values(commission).returning();
    return result;
  }

  async getCommission(id: number): Promise<Commission | undefined> {
    const [comm] = await db.select().from(commissions).where(eq(commissions.id, id));
    return comm || undefined;
  }

  async getCommissionsByAffiliate(affiliateId: number): Promise<Commission[]> {
    return db.select().from(commissions).where(eq(commissions.affiliateId, affiliateId)).orderBy(desc(commissions.createdAt));
  }

  async getCommissionsBySale(saleId: number): Promise<Commission[]> {
    return db.select().from(commissions).where(eq(commissions.saleId, saleId)).orderBy(desc(commissions.createdAt));
  }

  async updateCommission(id: number, updates: Partial<Commission>): Promise<Commission | undefined> {
    const [comm] = await db.update(commissions).set(updates).where(eq(commissions.id, id)).returning();
    return comm || undefined;
  }

  // Veteran Intake
  async createVeteranIntake(intake: InsertVeteranIntake): Promise<VeteranIntake> {
    const [result] = await db.insert(veteranIntake).values(intake).returning();
    return result;
  }

  async getVeteranIntake(id: number): Promise<VeteranIntake | undefined> {
    const [vi] = await db.select().from(veteranIntake).where(eq(veteranIntake.id, id));
    return vi || undefined;
  }

  async getAllVeteranIntakes(): Promise<VeteranIntake[]> {
    return db.select().from(veteranIntake).orderBy(desc(veteranIntake.createdAt));
  }

  async getVeteranIntakesByProgram(programType: string): Promise<VeteranIntake[]> {
    return db.select().from(veteranIntake).where(eq(veteranIntake.programType, programType)).orderBy(desc(veteranIntake.createdAt));
  }

  async updateVeteranIntake(id: number, updates: Partial<VeteranIntake>): Promise<VeteranIntake | undefined> {
    const [vi] = await db.update(veteranIntake).set({ ...updates, updatedAt: new Date() }).where(eq(veteranIntake.id, id)).returning();
    return vi || undefined;
  }

  // Business Intake
  async createBusinessIntake(intake: InsertBusinessIntake): Promise<BusinessIntake> {
    const [result] = await db.insert(businessIntake).values(intake).returning();
    return result;
  }

  async getBusinessIntake(id: number): Promise<BusinessIntake | undefined> {
    const [bi] = await db.select().from(businessIntake).where(eq(businessIntake.id, id));
    return bi || undefined;
  }

  async getAllBusinessIntakes(): Promise<BusinessIntake[]> {
    return db.select().from(businessIntake).orderBy(desc(businessIntake.createdAt));
  }

  async getBusinessIntakesByService(serviceType: string): Promise<BusinessIntake[]> {
    return db.select().from(businessIntake).where(eq(businessIntake.serviceType, serviceType)).orderBy(desc(businessIntake.createdAt));
  }

  async updateBusinessIntake(id: number, updates: Partial<BusinessIntake>): Promise<BusinessIntake | undefined> {
    const [bi] = await db.update(businessIntake).set({ ...updates, updatedAt: new Date() }).where(eq(businessIntake.id, id)).returning();
    return bi || undefined;
  }

  // Contract Templates
  async createContractTemplate(template: InsertContractTemplate): Promise<ContractTemplate> {
    const [result] = await db.insert(contractTemplates).values(template).returning();
    return result;
  }

  async getContractTemplate(id: number): Promise<ContractTemplate | undefined> {
    const [ct] = await db.select().from(contractTemplates).where(eq(contractTemplates.id, id));
    return ct || undefined;
  }

  async getAllContractTemplates(): Promise<ContractTemplate[]> {
    return db.select().from(contractTemplates).orderBy(desc(contractTemplates.createdAt));
  }

  async getActiveContractTemplates(): Promise<ContractTemplate[]> {
    return db.select().from(contractTemplates).where(eq(contractTemplates.isActive, "true")).orderBy(desc(contractTemplates.createdAt));
  }

  async updateContractTemplate(id: number, updates: Partial<ContractTemplate>): Promise<ContractTemplate | undefined> {
    const [ct] = await db.update(contractTemplates).set({ ...updates, updatedAt: new Date() }).where(eq(contractTemplates.id, id)).returning();
    return ct || undefined;
  }

  // Signed Agreements
  async createSignedAgreement(agreement: InsertSignedAgreement): Promise<SignedAgreement> {
    const [result] = await db.insert(signedAgreements).values(agreement).returning();
    return result;
  }

  async getSignedAgreement(id: number): Promise<SignedAgreement | undefined> {
    const [sa] = await db.select().from(signedAgreements).where(eq(signedAgreements.id, id));
    return sa || undefined;
  }

  async getAllSignedAgreements(): Promise<SignedAgreement[]> {
    return db.select().from(signedAgreements).orderBy(desc(signedAgreements.signedAt));
  }

  async getSignedAgreementsByAffiliate(affiliateId: number): Promise<SignedAgreement[]> {
    return db.select().from(signedAgreements).where(eq(signedAgreements.affiliateId, affiliateId)).orderBy(desc(signedAgreements.signedAt));
  }

  async hasAffiliateSignedContract(affiliateId: number, contractTemplateId: number): Promise<boolean> {
    const [sa] = await db.select().from(signedAgreements)
      .where(and(
        eq(signedAgreements.affiliateId, affiliateId),
        eq(signedAgreements.contractTemplateId, contractTemplateId),
        eq(signedAgreements.status, "signed")
      ));
    return !!sa;
  }

  async updateSignedAgreement(id: number, updates: Partial<SignedAgreement>): Promise<SignedAgreement | undefined> {
    const [sa] = await db.update(signedAgreements).set(updates).where(eq(signedAgreements.id, id)).returning();
    return sa || undefined;
  }

  // Commission Config
  async createCommissionConfig(config: InsertCommissionConfig): Promise<CommissionConfig> {
    const [c] = await db.insert(commissionConfig).values(config).returning();
    return c;
  }

  async getActiveCommissionConfig(): Promise<CommissionConfig | undefined> {
    const [config] = await db.select().from(commissionConfig).where(eq(commissionConfig.isActive, "true")).orderBy(desc(commissionConfig.createdAt)).limit(1);
    return config || undefined;
  }

  async updateCommissionConfig(id: number, updates: Partial<CommissionConfig>): Promise<CommissionConfig | undefined> {
    const [config] = await db.update(commissionConfig).set({ ...updates, updatedAt: new Date() }).where(eq(commissionConfig.id, id)).returning();
    return config || undefined;
  }

  // Affiliate NDA
  async createAffiliateNda(nda: InsertAffiliateNda): Promise<AffiliateNda> {
    const [created] = await db.insert(affiliateNda).values(nda).returning();
    return created;
  }

  async getAffiliateNdaByUserId(userId: number): Promise<AffiliateNda | undefined> {
    const [nda] = await db.select().from(affiliateNda).where(eq(affiliateNda.userId, userId));
    return nda || undefined;
  }

  async hasAffiliateSignedNda(userId: number): Promise<boolean> {
    const nda = await this.getAffiliateNdaByUserId(userId);
    return !!nda;
  }

  async getAllAffiliateNdas(): Promise<AffiliateNda[]> {
    return db.select().from(affiliateNda).orderBy(desc(affiliateNda.signedAt));
  }

  // Business Leads
  async createBusinessLead(lead: InsertBusinessLead): Promise<BusinessLead> {
    const [created] = await db.insert(businessLeads).values(lead).returning();
    return created;
  }

  async getBusinessLead(id: number): Promise<BusinessLead | undefined> {
    const [lead] = await db.select().from(businessLeads).where(eq(businessLeads.id, id));
    return lead || undefined;
  }

  async getAllBusinessLeads(): Promise<BusinessLead[]> {
    return db.select().from(businessLeads).orderBy(desc(businessLeads.createdAt));
  }

  async getBusinessLeadsByType(leadType: string): Promise<BusinessLead[]> {
    return db.select().from(businessLeads).where(eq(businessLeads.leadType, leadType)).orderBy(desc(businessLeads.createdAt));
  }

  async getBusinessLeadsByReferrer(referredBy: number): Promise<BusinessLead[]> {
    return db.select().from(businessLeads).where(eq(businessLeads.referredBy, referredBy)).orderBy(desc(businessLeads.createdAt));
  }

  async updateBusinessLead(id: number, updates: Partial<BusinessLead>): Promise<BusinessLead | undefined> {
    const [updated] = await db.update(businessLeads).set({ ...updates, updatedAt: new Date() }).where(eq(businessLeads.id, id)).returning();
    return updated || undefined;
  }

  // IP Referral Tracking
  async createIpReferralTracking(data: InsertIpReferralTracking): Promise<IpReferralTracking> {
    const [created] = await db.insert(ipReferralTracking).values(data).returning();
    return created;
  }

  async getActiveIpReferral(ipAddress: string): Promise<IpReferralTracking | undefined> {
    const now = new Date();
    const [tracking] = await db.select().from(ipReferralTracking)
      .where(and(
        eq(ipReferralTracking.ipAddress, ipAddress),
        gt(ipReferralTracking.expiresAt, now)
      ))
      .orderBy(desc(ipReferralTracking.createdAt))
      .limit(1);
    return tracking || undefined;
  }

  async getIpReferralsByAffiliate(affiliateId: number): Promise<IpReferralTracking[]> {
    return db.select().from(ipReferralTracking)
      .where(eq(ipReferralTracking.affiliateId, affiliateId))
      .orderBy(desc(ipReferralTracking.createdAt));
  }

  async getAllIpReferrals(): Promise<IpReferralTracking[]> {
    return db.select().from(ipReferralTracking)
      .orderBy(desc(ipReferralTracking.createdAt));
  }

  // W9 Forms
  async createAffiliateW9(w9: InsertAffiliateW9): Promise<AffiliateW9> {
    const [created] = await db.insert(affiliateW9).values(w9).returning();
    return created;
  }

  async getAffiliateW9ByUserId(userId: number): Promise<AffiliateW9 | undefined> {
    const [w9] = await db.select().from(affiliateW9).where(eq(affiliateW9.userId, userId));
    return w9 || undefined;
  }

  async hasAffiliateSubmittedW9(userId: number): Promise<boolean> {
    const w9 = await this.getAffiliateW9ByUserId(userId);
    return !!w9;
  }

  // Fin-Ops Referral Tracking
  async createFinopsReferral(referral: InsertFinopsReferral): Promise<FinopsReferral> {
    const [created] = await db.insert(finopsReferrals).values(referral).returning();
    return created;
  }

  async getFinopsReferral(id: number): Promise<FinopsReferral | undefined> {
    const [referral] = await db.select().from(finopsReferrals).where(eq(finopsReferrals.id, id));
    return referral || undefined;
  }

  async getAllFinopsReferrals(): Promise<FinopsReferral[]> {
    return db.select().from(finopsReferrals).orderBy(desc(finopsReferrals.createdAt));
  }

  async getFinopsReferralsByAffiliate(affiliateId: number): Promise<FinopsReferral[]> {
    return db.select().from(finopsReferrals)
      .where(eq(finopsReferrals.affiliateId, affiliateId))
      .orderBy(desc(finopsReferrals.createdAt));
  }

  async getFinopsReferralsByPartnerType(partnerType: string): Promise<FinopsReferral[]> {
    return db.select().from(finopsReferrals)
      .where(eq(finopsReferrals.partnerType, partnerType))
      .orderBy(desc(finopsReferrals.createdAt));
  }

  async updateFinopsReferral(id: number, updates: Partial<FinopsReferral>): Promise<FinopsReferral | undefined> {
    const [updated] = await db.update(finopsReferrals)
      .set(updates)
      .where(eq(finopsReferrals.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
