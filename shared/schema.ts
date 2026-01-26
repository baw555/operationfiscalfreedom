import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (Admin and Affiliate)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // "admin" or "affiliate"
  referralCode: text("referral_code").unique(), // Unique referral code for affiliates
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Affiliate Applications
export const affiliateApplications = pgTable("affiliate_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAffiliateApplicationSchema = createInsertSchema(affiliateApplications).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAffiliateApplication = z.infer<typeof insertAffiliateApplicationSchema>;
export type AffiliateApplication = typeof affiliateApplications.$inferSelect;

// Help Requests
export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  helpType: text("help_type").notNull(), // disability_denial, appeal, low_rating, exam_issues, service_connection, other
  otherHelpType: text("other_help_type"),
  description: text("description").notNull(),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  referredBy: integer("referred_by").references(() => users.id), // Affiliate who referred this lead
  referralCode: text("referral_code"), // The referral code used
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;

// Startup Grant Applications
export const startupGrants = pgTable("startup_grants", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  branch: text("branch").notNull(),
  serviceStatus: text("service_status").notNull(),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  businessDescription: text("business_description").notNull(),
  fundingNeeds: text("funding_needs").notNull(),
  grantAmount: text("grant_amount").notNull(),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStartupGrantSchema = createInsertSchema(startupGrants).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStartupGrant = z.infer<typeof insertStartupGrantSchema>;
export type StartupGrant = typeof startupGrants.$inferSelect;

// Furniture Assistance Requests
export const furnitureAssistance = pgTable("furniture_assistance", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  branch: text("branch").notNull(),
  serviceStatus: text("service_status").notNull(),
  homeStatus: text("home_status").notNull(),
  expectedCloseDate: text("expected_close_date"),
  homeLocation: text("home_location"),
  additionalInfo: text("additional_info"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFurnitureAssistanceSchema = createInsertSchema(furnitureAssistance).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFurnitureAssistance = z.infer<typeof insertFurnitureAssistanceSchema>;
export type FurnitureAssistance = typeof furnitureAssistance.$inferSelect;

// Investor Submissions
export const investorSubmissions = pgTable("investor_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  investmentInterest: text("investment_interest").notNull(),
  investmentRange: text("investment_range").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInvestorSubmissionSchema = createInsertSchema(investorSubmissions).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInvestorSubmission = z.infer<typeof insertInvestorSubmissionSchema>;
export type InvestorSubmission = typeof investorSubmissions.$inferSelect;

// Private Doctor Requests
export const privateDoctorRequests = pgTable("private_doctor_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  zip: text("zip").notNull(),
  branch: text("branch").notNull(),
  careType: text("care_type").notNull(),
  situation: text("situation"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPrivateDoctorRequestSchema = createInsertSchema(privateDoctorRequests).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPrivateDoctorRequest = z.infer<typeof insertPrivateDoctorRequestSchema>;
export type PrivateDoctorRequest = typeof privateDoctorRequests.$inferSelect;

// Website Applications
export const websiteApplications = pgTable("website_applications", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  branch: text("branch").notNull(),
  serviceStatus: text("service_status").notNull(),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
  websiteNeeds: text("website_needs"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWebsiteApplicationSchema = createInsertSchema(websiteApplications).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebsiteApplication = z.infer<typeof insertWebsiteApplicationSchema>;
export type WebsiteApplication = typeof websiteApplications.$inferSelect;

// General Contact Submissions
export const generalContact = pgTable("general_contact", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertGeneralContactSchema = createInsertSchema(generalContact).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGeneralContact = z.infer<typeof insertGeneralContactSchema>;
export type GeneralContact = typeof generalContact.$inferSelect;

// VLT Affiliates with 6-level hierarchy (new comp model)
// Note: level7Id kept for legacy compatibility, new model uses L1-L6 only
export const vltAffiliates = pgTable("vlt_affiliates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  role: text("role").notNull().default("affiliate"), // master, sub_master, affiliate
  level1Id: integer("level1_id"), // Direct upline (closest upline - L2 in comp model)
  level2Id: integer("level2_id"), // 2nd level upline (L3 in comp model)
  level3Id: integer("level3_id"), // 3rd level upline (L4 in comp model)
  level4Id: integer("level4_id"), // 4th level upline (L5 in comp model)
  level5Id: integer("level5_id"), // 5th level upline (Company - L6 in comp model)
  level6Id: integer("level6_id"), // Legacy - maps to L6/Company
  level7Id: integer("level7_id"), // Legacy - kept for backward compatibility
  recruiterId: integer("recruiter_id"), // Who recruited this affiliate (for 2.5% bounty)
  status: text("status").notNull().default("active"), // active, inactive, suspended
  isCompActive: text("is_comp_active").notNull().default("true"), // For compression logic
  totalLeads: integer("total_leads").default(0),
  totalSales: integer("total_sales").default(0),
  totalCommissions: integer("total_commissions").default(0), // cents
  totalRecruiterBounties: integer("total_recruiter_bounties").default(0), // cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Opportunities/Services (modular - B2B and B2C)
export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // disability, holistic, healthcare, insurance, tax_credits, sales, b2b, b2c
  description: text("description"),
  commissionType: text("commission_type").notNull().default("percentage"), // percentage, flat
  commissionL1: integer("commission_l1").default(0), // Level 1 commission (percentage x100 or cents)
  commissionL2: integer("commission_l2").default(0),
  commissionL3: integer("commission_l3").default(0),
  commissionL4: integer("commission_l4").default(0),
  commissionL5: integer("commission_l5").default(0),
  commissionL6: integer("commission_l6").default(0),
  commissionL7: integer("commission_l7").default(0),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
});

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

// Sales tracking with 6-level comp model
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  opportunityId: integer("opportunity_id").references(() => opportunities.id),
  affiliateId: integer("affiliate_id").references(() => vltAffiliates.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  saleAmount: integer("sale_amount").notNull(), // cents
  status: text("status").notNull().default("pending"), // pending, approved, paid, cancelled
  referredByL1: integer("referred_by_l1"), // Top producer (67%)
  referredByL2: integer("referred_by_l2"), // Closest upline (3.5%)
  referredByL3: integer("referred_by_l3"), // 2.0%
  referredByL4: integer("referred_by_l4"), // 1.2%
  referredByL5: integer("referred_by_l5"), // 0.8%
  referredByL6: integer("referred_by_l6"), // Company (0.5% + compression)
  referredByL7: integer("referred_by_l7"), // Legacy - kept for backward compatibility
  recruiterId: integer("recruiter_id"), // For 2.5% bounty
  recruiterBounty: integer("recruiter_bounty").default(0), // cents
  l2Active: text("l2_active").default("true"), // For compression
  l3Active: text("l3_active").default("true"),
  l4Active: text("l4_active").default("true"),
  l5Active: text("l5_active").default("true"),
  compressedToL6: integer("compressed_to_l6").default(0), // Amount compressed to company
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

// Commission payouts
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").references(() => sales.id),
  affiliateId: integer("affiliate_id").references(() => vltAffiliates.id),
  level: integer("level").notNull(), // 1-7
  amount: integer("amount").notNull(), // cents
  status: text("status").notNull().default("pending"), // pending, approved, paid
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  status: true,
  paidAt: true,
  createdAt: true,
});

export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Commission = typeof commissions.$inferSelect;

// Veteran intake for various programs
export const veteranIntake = pgTable("veteran_intake", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  branch: text("branch"),
  serviceStatus: text("service_status"), // active, veteran, reserve, guard
  programType: text("program_type").notNull(), // disability, holistic, healthcare, sales_opportunity
  currentRating: text("current_rating"), // For disability assistance
  desiredRating: text("desired_rating"),
  healthInterests: text("health_interests"), // For holistic/healthcare
  salesInterest: text("sales_interest"), // For sales opportunities
  additionalInfo: text("additional_info"),
  referralCode: text("referral_code"),
  referredByL1: integer("referred_by_l1"),
  referredByL2: integer("referred_by_l2"),
  referredByL3: integer("referred_by_l3"),
  referredByL4: integer("referred_by_l4"),
  referredByL5: integer("referred_by_l5"),
  referredByL6: integer("referred_by_l6"),
  referredByL7: integer("referred_by_l7"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVeteranIntakeSchema = createInsertSchema(veteranIntake).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  referredByL1: true,
  referredByL2: true,
  referredByL3: true,
  referredByL4: true,
  referredByL5: true,
  referredByL6: true,
  referredByL7: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVeteranIntake = z.infer<typeof insertVeteranIntakeSchema>;
export type VeteranIntake = typeof veteranIntake.$inferSelect;

// Business intake for B2B services
export const businessIntake = pgTable("business_intake", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessType: text("business_type"), // llc, s_corp, c_corp, sole_prop, partnership
  industry: text("industry"),
  annualRevenue: text("annual_revenue"),
  employeeCount: text("employee_count"),
  serviceType: text("service_type").notNull(), // insurance, tax_credits, payroll, accounting, other
  serviceDetails: text("service_details"),
  isVeteranOwned: text("is_veteran_owned"),
  referralCode: text("referral_code"),
  referredByL1: integer("referred_by_l1"),
  referredByL2: integer("referred_by_l2"),
  referredByL3: integer("referred_by_l3"),
  referredByL4: integer("referred_by_l4"),
  referredByL5: integer("referred_by_l5"),
  referredByL6: integer("referred_by_l6"),
  referredByL7: integer("referred_by_l7"),
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessIntakeSchema = createInsertSchema(businessIntake).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  referredByL1: true,
  referredByL2: true,
  referredByL3: true,
  referredByL4: true,
  referredByL5: true,
  referredByL6: true,
  referredByL7: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBusinessIntake = z.infer<typeof insertBusinessIntakeSchema>;
export type BusinessIntake = typeof businessIntake.$inferSelect;

export const insertVltAffiliateSchema = createInsertSchema(vltAffiliates).omit({
  id: true,
  totalLeads: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVltAffiliate = z.infer<typeof insertVltAffiliateSchema>;
export type VltAffiliate = typeof vltAffiliates.$inferSelect;

// VLT Tax Intake Submissions
export const vltIntake = pgTable("vlt_intake", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  issue: text("issue").notNull(), // credits, resolution, preparation, planning, payroll, other
  issueDetails: text("issue_details"),
  businessType: text("business_type"), // individual, sole_prop, llc, s_corp, c_corp, partnership
  businessName: text("business_name"),
  annualRevenue: text("annual_revenue"),
  isVeteran: text("is_veteran"),
  leadType: text("lead_type").default("direct_client"), // affiliate_referral, direct_client
  referrerName: text("referrer_name"), // For affiliate referrals
  referrerEmail: text("referrer_email"),
  referrerPhone: text("referrer_phone"),
  routedTo: text("routed_to"), // CPA, Tax Attorney, General
  status: text("status").notNull().default("new"), // new, contacted, in_progress, closed, converted
  assignedTo: integer("assigned_to"),
  notes: text("notes"),
  referralCode: text("referral_code"), // Affiliate referral code
  referredByL1: integer("referred_by_l1"), // Level 1 affiliate who referred
  referredByL2: integer("referred_by_l2"), // Level 2 upline
  referredByL3: integer("referred_by_l3"), // Level 3 upline
  referredByL4: integer("referred_by_l4"), // Level 4 upline
  referredByL5: integer("referred_by_l5"), // Level 5 upline
  referredByL6: integer("referred_by_l6"), // Level 6 upline (master)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVltIntakeSchema = createInsertSchema(vltIntake).omit({
  id: true,
  routedTo: true,
  status: true,
  assignedTo: true,
  notes: true,
  referredByL1: true,
  referredByL2: true,
  referredByL3: true,
  referredByL4: true,
  referredByL5: true,
  referredByL6: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVltIntake = z.infer<typeof insertVltIntakeSchema>;
export type VltIntake = typeof vltIntake.$inferSelect;

// Contract templates for e-signature
export const contractTemplates = pgTable("contract_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "MAH Independent Representative Agreement"
  version: text("version").notNull().default("1.0"),
  content: text("content").notNull(), // Full contract text in markdown/HTML
  companyName: text("company_name").notNull(), // MISSION ACT HEALTH, INC.
  requiredFor: text("required_for").notNull().default("all"), // all, affiliate, sub_master, master
  isActive: text("is_active").notNull().default("true"),
  contractType: text("contract_type").notNull().default("general"), // general, service
  grossCommissionPct: integer("gross_commission_pct"), // e.g., 18 for 18% (for service contracts)
  serviceName: text("service_name"), // e.g., "ICC Logistics"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContractTemplateSchema = createInsertSchema(contractTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContractTemplate = z.infer<typeof insertContractTemplateSchema>;
export type ContractTemplate = typeof contractTemplates.$inferSelect;

// Signed agreements tracking
export const signedAgreements = pgTable("signed_agreements", {
  id: serial("id").primaryKey(),
  contractTemplateId: integer("contract_template_id").references(() => contractTemplates.id).notNull(),
  affiliateId: integer("affiliate_id").notNull(), // User ID (not FK - can be user or VLT affiliate)
  userId: integer("user_id").references(() => users.id), // Link to regular user account
  affiliateName: text("affiliate_name").notNull(),
  affiliateEmail: text("affiliate_email").notNull(),
  signatureData: text("signature_data"), // Base64 signature image
  signedIpAddress: text("signed_ip_address"),
  agreedToTerms: text("agreed_to_terms").notNull().default("true"),
  physicalAddress: text("physical_address"),
  businessActivities: text("business_activities"),
  achName: text("ach_name"),
  achBank: text("ach_bank"),
  achAccountNumber: text("ach_account_number"),
  achRoutingNumber: text("ach_routing_number"),
  recruitedBy: text("recruited_by"),
  status: text("status").notNull().default("signed"), // signed, void, superseded
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSignedAgreementSchema = createInsertSchema(signedAgreements).omit({
  id: true,
  status: true,
  signedAt: true,
  createdAt: true,
});

export type InsertSignedAgreement = z.infer<typeof insertSignedAgreementSchema>;
export type SignedAgreement = typeof signedAgreements.$inferSelect;

// Commission configuration - simplified formula
// Producer: 69% base + compression from empty uplines (1% each, max 6 uplines)
// Each upline: 1% each
// House: 22.5% always
// Recruiter: 2.5% separate bounty
export const commissionConfig = pgTable("commission_config", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("default"),
  producerBasePct: integer("producer_base_pct").notNull().default(6900), // 69% = 6900 (x100)
  uplinePctEach: integer("upline_pct_each").notNull().default(100), // 1% = 100 per upline
  maxUplineLevels: integer("max_upline_levels").notNull().default(6), // max 6 uplines
  housePct: integer("house_pct").notNull().default(2250), // 22.5% = 2250
  recruiterBountyPct: integer("recruiter_bounty_pct").notNull().default(250), // 2.5% = 250
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCommissionConfigSchema = createInsertSchema(commissionConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCommissionConfig = z.infer<typeof insertCommissionConfigSchema>;
export type CommissionConfig = typeof commissionConfig.$inferSelect;
