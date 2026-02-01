import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, serial, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { veteranAuthUsers } from "./models/auth";

// Users table (Admin and Affiliate)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // "admin" or "affiliate"
  portal: text("portal"), // Restricts user to specific portal (e.g., "payzium"). Null = general admin access
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

// Affiliate NDA - Simple good-faith agreement with Navigator USA Corp 501(c)(3)
export const affiliateNda = pgTable("affiliate_nda", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fullName: text("full_name").notNull(),
  veteranNumber: text("veteran_number"),
  address: text("address").notNull(),
  customReferralCode: text("custom_referral_code"),
  signatureData: text("signature_data"),
  facePhoto: text("face_photo"), // Base64 webcam capture of face
  idPhoto: text("id_photo"), // Base64 uploaded ID document
  signedIpAddress: text("signed_ip_address"),
  agreedToTerms: text("agreed_to_terms").notNull().default("true"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAffiliateNdaSchema = createInsertSchema(affiliateNda).omit({
  id: true,
  signedAt: true,
  createdAt: true,
});

export type InsertAffiliateNda = z.infer<typeof insertAffiliateNdaSchema>;
export type AffiliateNda = typeof affiliateNda.$inferSelect;

// Business Leads - Submissions from the Vet Biz Owner page
export const businessLeads = pgTable("business_leads", {
  id: serial("id").primaryKey(),
  leadType: text("lead_type").notNull(), // "access_talent", "utilize_service", "promote_network"
  businessName: text("business_name").notNull(),
  contactName: text("contact_name").notNull(),
  position: text("position").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  comment: text("comment"),
  status: text("status").notNull().default("new"), // new, contacted, in_progress, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  referredBy: integer("referred_by").references(() => users.id),
  referralCode: text("referral_code"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessLeadSchema = createInsertSchema(businessLeads).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBusinessLead = z.infer<typeof insertBusinessLeadSchema>;
export type BusinessLead = typeof businessLeads.$inferSelect;

// IP Referral Tracking - tracks IP addresses linked to affiliates for 30 days
export const ipReferralTracking = pgTable("ip_referral_tracking", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  affiliateId: integer("affiliate_id").references(() => users.id),
  referralCode: text("referral_code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIpReferralTrackingSchema = createInsertSchema(ipReferralTracking).omit({
  id: true,
  createdAt: true,
});

export type InsertIpReferralTracking = z.infer<typeof insertIpReferralTrackingSchema>;
export type IpReferralTracking = typeof ipReferralTracking.$inferSelect;

// W9 Tax Forms - Affiliate tax information for 1099 reporting
export const affiliateW9 = pgTable("affiliate_w9", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  businessName: text("business_name"),
  taxClassification: text("tax_classification").notNull().default("individual"), // individual, c_corp, s_corp, partnership, trust, llc
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  ssn: text("ssn"), // Encrypted - Social Security Number (last 4 only stored)
  ein: text("ein"), // Employer Identification Number
  signatureData: text("signature_data"), // Base64 signature image
  signedIpAddress: text("signed_ip_address"),
  certificationDate: timestamp("certification_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAffiliateW9Schema = createInsertSchema(affiliateW9).omit({
  id: true,
  certificationDate: true,
  createdAt: true,
});

export type InsertAffiliateW9 = z.infer<typeof insertAffiliateW9Schema>;
export type AffiliateW9 = typeof affiliateW9.$inferSelect;

// Fin-Ops Partner Referral Tracking
export const finopsReferrals = pgTable("finops_referrals", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => users.id),
  referralCode: text("referral_code"),
  partnerType: text("partner_type").notNull(), // my_locker, merchant_services, vgift_cards
  externalUrl: text("external_url").notNull(),
  visitorIp: text("visitor_ip"),
  userAgent: text("user_agent"),
  status: text("status").notNull().default("clicked"), // clicked, registered, converted
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFinopsReferralSchema = createInsertSchema(finopsReferrals).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertFinopsReferral = z.infer<typeof insertFinopsReferralSchema>;
export type FinopsReferral = typeof finopsReferrals.$inferSelect;

// Disability Referrals - Tracking intakes from disability rating pages
export const disabilityReferrals = pgTable("disability_referrals", {
  id: serial("id").primaryKey(),
  // Affiliate tracking
  affiliateId: integer("affiliate_id").references(() => users.id),
  referralCode: text("referral_code"),
  // Claim type
  claimType: text("claim_type").notNull(), // initial, increase, denial, ssdi, widow
  // Veteran/applicant info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Veteran details
  veteranStatus: text("veteran_status"), // veteran, spouse, dependent
  branchOfService: text("branch_of_service"),
  dischargeStatus: text("discharge_status"),
  currentRating: text("current_rating"), // 0-100% or "none"
  // Case details
  conditions: text("conditions"), // List of conditions
  caseDescription: text("case_description"),
  hasDocumentation: text("has_documentation"), // yes, no, partial
  // Contact preferences
  bestTimeToCall: text("best_time_to_call"),
  preferredContact: text("preferred_contact"), // phone, email, text
  // Status tracking
  status: text("status").notNull().default("new"), // new, contacted, in_progress, assigned, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  // Metadata
  visitorIp: text("visitor_ip"),
  userAgent: text("user_agent"),
  sourcePage: text("source_page"), // Which page they came from
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDisabilityReferralSchema = createInsertSchema(disabilityReferrals).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDisabilityReferral = z.infer<typeof insertDisabilityReferralSchema>;
export type DisabilityReferral = typeof disabilityReferrals.$inferSelect;

// Job Placement Intakes - for affiliates and veterans seeking job opportunities
export const jobPlacementIntakes = pgTable("job_placement_intakes", {
  id: serial("id").primaryKey(),
  // Affiliate tracking
  affiliateId: integer("affiliate_id").references(() => users.id),
  referralCode: text("referral_code"),
  // Intake type
  intakeType: text("intake_type").notNull(), // job_seeker, business_referral, business_services
  // Personal info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Veteran status (for job seekers)
  isVeteran: text("is_veteran"), // yes, no
  branchOfService: text("branch_of_service"),
  // Industries or services selected (stored as JSON)
  industriesSelected: text("industries_selected").notNull(), // JSON array of selected industries (job_seeker/business_referral) or services (business_services)
  // Business info (for business referrals)
  businessName: text("business_name"),
  businessType: text("business_type"),
  businessWebsite: text("business_website"),
  hiringNeeds: text("hiring_needs"),
  // Additional info
  experience: text("experience"),
  preferredLocation: text("preferred_location"),
  additionalNotes: text("additional_notes"),
  // Status tracking
  status: text("status").notNull().default("new"), // new, contacted, in_progress, placed, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJobPlacementIntakeSchema = createInsertSchema(jobPlacementIntakes).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobPlacementIntake = z.infer<typeof insertJobPlacementIntakeSchema>;
export type JobPlacementIntake = typeof jobPlacementIntakes.$inferSelect;

// Vet Professionals Intakes
export const vetProfessionalIntakes = pgTable("vet_professional_intakes", {
  id: serial("id").primaryKey(),
  // Affiliate tracking
  affiliateId: integer("affiliate_id").references(() => users.id),
  referralCode: text("referral_code"),
  // Profession type
  professionType: text("profession_type").notNull(), // attorneys, insurance, cpa, doctors
  // Personal info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Veteran status
  isVeteran: text("is_veteran"),
  branchOfService: text("branch_of_service"),
  // Business info
  businessName: text("business_name"),
  businessType: text("business_type"),
  licenseNumber: text("license_number"),
  yearsExperience: text("years_experience"),
  specializations: text("specializations"),
  serviceArea: text("service_area"),
  // Additional
  additionalNotes: text("additional_notes"),
  // Admin fields
  status: text("status").notNull().default("new"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVetProfessionalIntakeSchema = createInsertSchema(vetProfessionalIntakes).omit({
  id: true,
  status: true,
  assignedTo: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVetProfessionalIntake = z.infer<typeof insertVetProfessionalIntakeSchema>;
export type VetProfessionalIntake = typeof vetProfessionalIntakes.$inferSelect;

// Healthcare Intakes - for veterans seeking treatment info/services
export const healthcareIntakes = pgTable("healthcare_intakes", {
  id: serial("id").primaryKey(),
  referralCode: text("referral_code"),
  // Treatment category
  category: text("category").notNull(), // ptsd, exosomes, less_invasive, new_treatments, guidance
  // Personal info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  // Veteran info
  branchOfService: text("branch_of_service"),
  yearsOfService: text("years_of_service"),
  currentVaRating: text("current_va_rating"),
  // Healthcare needs
  currentConditions: text("current_conditions"),
  treatmentHistory: text("treatment_history"),
  treatmentGoals: text("treatment_goals"),
  preferredLocation: text("preferred_location"),
  insuranceType: text("insurance_type"),
  additionalNotes: text("additional_notes"),
  // Provider offering services
  isOfferingServices: boolean("is_offering_services").default(false),
  providerType: text("provider_type"), // If offering services
  providerCredentials: text("provider_credentials"),
  // Status tracking
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHealthcareIntakeSchema = createInsertSchema(healthcareIntakes).omit({
  id: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHealthcareIntake = z.infer<typeof insertHealthcareIntakeSchema>;
export type HealthcareIntake = typeof healthcareIntakes.$inferSelect;

// Schedule A Signatures - Track affiliate acknowledgment of commission structure
export const scheduleASignatures = pgTable("schedule_a_signatures", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  affiliateName: text("affiliate_name").notNull(),
  affiliateEmail: text("affiliate_email").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  acknowledgedUplineCount: integer("acknowledged_upline_count").notNull().default(0),
  version: text("version").notNull().default("1.0"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});

export const insertScheduleASignatureSchema = createInsertSchema(scheduleASignatures).omit({
  id: true,
  signedAt: true,
});

export type InsertScheduleASignature = z.infer<typeof insertScheduleASignatureSchema>;
export type ScheduleASignature = typeof scheduleASignatures.$inferSelect;

// Insurance Intakes - Track insurance inquiries
export const insuranceIntakes = pgTable("insurance_intakes", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  userType: text("user_type").notNull(), // consumer, business, insurance_agent
  intentType: text("intent_type").notNull(), // buy, sell, refer
  insuranceTypes: text("insurance_types").notNull(), // comma-separated: life, disability, health, business, auto, home
  businessName: text("business_name"),
  employeeCount: text("employee_count"),
  currentProvider: text("current_provider"),
  additionalInfo: text("additional_info"),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by").references(() => users.id),
  status: text("status").notNull().default("new"), // new, contacted, quoted, closed_won, closed_lost
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInsuranceIntakeSchema = createInsertSchema(insuranceIntakes).omit({
  id: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInsuranceIntake = z.infer<typeof insertInsuranceIntakeSchema>;
export type InsuranceIntake = typeof insuranceIntakes.$inferSelect;

// Medical Sales Intakes - Track medical equipment/device sales leads
export const medicalSalesIntakes = pgTable("medical_sales_intakes", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  roleType: text("role_type").notNull(), // buyer, seller, referrer
  productCategory: text("product_category").notNull(), // medical_devices, pharmaceuticals, equipment, supplies, other
  description: text("description"),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by").references(() => users.id),
  assignedTo: integer("assigned_to").references(() => users.id),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMedicalSalesIntakeSchema = createInsertSchema(medicalSalesIntakes).omit({
  id: true,
  assignedTo: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMedicalSalesIntake = z.infer<typeof insertMedicalSalesIntakeSchema>;
export type MedicalSalesIntake = typeof medicalSalesIntakes.$inferSelect;

// Business Development Intakes - Track business development leads
export const businessDevIntakes = pgTable("business_dev_intakes", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  industry: text("industry").notNull(),
  serviceInterest: text("service_interest").notNull(), // consulting, partnerships, vendor_relations, lead_gen, other
  businessSize: text("business_size"), // small, medium, enterprise
  description: text("description"),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by").references(() => users.id),
  assignedTo: integer("assigned_to").references(() => users.id),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessDevIntakeSchema = createInsertSchema(businessDevIntakes).omit({
  id: true,
  assignedTo: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBusinessDevIntake = z.infer<typeof insertBusinessDevIntakeSchema>;
export type BusinessDevIntake = typeof businessDevIntakes.$inferSelect;

// ============================================
// COST SAVINGS UNIVERSITY (CSU) PLATFORM
// ============================================

// CSU Contract Templates - Available contract types for CSU
export const csuContractTemplates = pgTable("csu_contract_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  portal: text("portal"), // Optional: restrict template to specific portal (e.g., "payzium")
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCsuContractTemplateSchema = createInsertSchema(csuContractTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCsuContractTemplate = z.infer<typeof insertCsuContractTemplateSchema>;
export type CsuContractTemplate = typeof csuContractTemplates.$inferSelect;

// CSU Contract Template Fields - Dynamic field definitions for each template
export const csuContractTemplateFields = pgTable("csu_contract_template_fields", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => csuContractTemplates.id).notNull(),
  fieldKey: text("field_key").notNull(), // e.g., "clientCompany", "primaryOwner"
  label: text("label").notNull(), // e.g., "Company Name", "Full Name"
  placeholder: text("placeholder").notNull(), // e.g., "[COMPANY]", "[NAME]"
  fieldType: text("field_type").notNull().default("text"), // text, email, phone, date, initials
  required: boolean("required").notNull().default(true),
  order: integer("order").notNull().default(0), // Display order in form
  defaultValue: text("default_value"), // Optional default value
  validation: text("validation"), // Optional regex or validation rules
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCsuContractTemplateFieldSchema = createInsertSchema(csuContractTemplateFields).omit({
  id: true,
  createdAt: true,
});

export type InsertCsuContractTemplateField = z.infer<typeof insertCsuContractTemplateFieldSchema>;
export type CsuContractTemplateField = typeof csuContractTemplateFields.$inferSelect;

// CSU Contract Sends - When admin sends a contract to someone
export const csuContractSends = pgTable("csu_contract_sends", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => csuContractTemplates.id).notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  recipientPhone: text("recipient_phone"),
  signToken: text("sign_token").notNull().unique(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
  status: text("status").notNull().default("pending"), // pending, signed, expired
  fieldValues: text("field_values"), // JSON string of submitted field values for dynamic templates
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  sentBy: integer("sent_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCsuContractSendSchema = createInsertSchema(csuContractSends).omit({
  id: true,
  sentAt: true,
  createdAt: true,
});

export type InsertCsuContractSend = z.infer<typeof insertCsuContractSendSchema>;
export type CsuContractSend = typeof csuContractSends.$inferSelect;

// CSU Signed Agreements - Completed signed contracts
export const csuSignedAgreements = pgTable("csu_signed_agreements", {
  id: serial("id").primaryKey(),
  contractSendId: integer("contract_send_id").references(() => csuContractSends.id).notNull(),
  templateId: integer("template_id").references(() => csuContractTemplates.id).notNull(),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email").notNull(),
  signerPhone: text("signer_phone"),
  address: text("address"),
  initials: text("initials"),
  effectiveDate: text("effective_date"),
  signatureData: text("signature_data"),
  signedIpAddress: text("signed_ip_address"),
  agreedToTerms: text("agreed_to_terms").notNull().default("true"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCsuSignedAgreementSchema = createInsertSchema(csuSignedAgreements).omit({
  id: true,
  signedAt: true,
  createdAt: true,
});

export type InsertCsuSignedAgreement = z.infer<typeof insertCsuSignedAgreementSchema>;
export type CsuSignedAgreement = typeof csuSignedAgreements.$inferSelect;

// ============================================
// CSU ENVELOPES - DocuSign-like Multi-Recipient Signing
// ============================================

// Routing types for signing order
export const routingTypeEnum = pgEnum("routing_type", ["sequential", "parallel", "mixed"]);

// CSU Envelopes - Groups recipients for ordered signing workflows
export const csuEnvelopes = pgTable("csu_envelopes", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => csuContractTemplates.id).notNull(),
  name: text("name").notNull(), // Envelope name/description
  routingType: routingTypeEnum("routing_type").notNull().default("sequential"),
  status: text("status").notNull().default("draft"), // draft, sent, in_progress, completed, voided, expired
  
  // Reminder settings
  reminderEnabled: boolean("reminder_enabled").default(false),
  reminderDaysAfterSend: integer("reminder_days_after_send").default(3), // Days after sending to first reminder
  reminderFrequencyDays: integer("reminder_frequency_days").default(3), // Reminder every X days
  lastReminderSentAt: timestamp("last_reminder_sent_at"),
  
  // Expiration settings
  expiresAt: timestamp("expires_at"), // Overall envelope expiration
  
  sentBy: integer("sent_by").references(() => users.id),
  sentAt: timestamp("sent_at"),
  completedAt: timestamp("completed_at"),
  voidedAt: timestamp("voided_at"),
  voidReason: text("void_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCsuEnvelopeSchema = createInsertSchema(csuEnvelopes);

export type InsertCsuEnvelope = Omit<z.infer<typeof insertCsuEnvelopeSchema>, 'id' | 'createdAt' | 'updatedAt'>;
export type CsuEnvelope = typeof csuEnvelopes.$inferSelect;

// CSU Envelope Recipients - Individual recipients with signing order
export const csuEnvelopeRecipients = pgTable("csu_envelope_recipients", {
  id: serial("id").primaryKey(),
  envelopeId: integer("envelope_id").references(() => csuEnvelopes.id).notNull(),
  
  // Recipient info
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role").default("signer"), // signer, approver, viewer, etc.
  
  // Signing order (same number = parallel signing)
  routingOrder: integer("routing_order").notNull().default(1),
  
  // Status tracking
  status: text("status").notNull().default("pending"), // pending, sent, viewed, signed, declined, voided
  signToken: text("sign_token").unique(),
  tokenExpiresAt: timestamp("token_expires_at"),
  
  // Timestamps
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  signedAt: timestamp("signed_at"),
  declinedAt: timestamp("declined_at"),
  declineReason: text("decline_reason"),
  
  // Signed data
  signatureData: text("signature_data"),
  signedIpAddress: text("signed_ip_address"),
  fieldValues: text("field_values"), // JSON string of submitted field values
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCsuEnvelopeRecipientSchema = createInsertSchema(csuEnvelopeRecipients);

export type InsertCsuEnvelopeRecipient = Omit<z.infer<typeof insertCsuEnvelopeRecipientSchema>, 'id' | 'createdAt'>;
export type CsuEnvelopeRecipient = typeof csuEnvelopeRecipients.$inferSelect;

// ============================================
// CSU AUDIT TRAIL - Track all contract events
// ============================================

// Audit event types
export const auditEventTypeEnum = pgEnum("audit_event_type", [
  "envelope_created",
  "envelope_sent", 
  "envelope_viewed",
  "envelope_signed",
  "envelope_declined",
  "envelope_voided",
  "envelope_completed",
  "envelope_expired",
  "recipient_sent",
  "recipient_viewed",
  "recipient_signed",
  "recipient_declined",
  "reminder_sent",
  "link_resent",
  "document_downloaded",
  "email_failed"
]);

// CSU Audit Trail - Immutable log of all contract events
export const csuAuditTrail = pgTable("csu_audit_trail", {
  id: serial("id").primaryKey(),
  
  // What was affected
  envelopeId: integer("envelope_id").references(() => csuEnvelopes.id),
  recipientId: integer("recipient_id").references(() => csuEnvelopeRecipients.id),
  contractSendId: integer("contract_send_id").references(() => csuContractSends.id), // For legacy single sends
  
  // Event details
  eventType: auditEventTypeEnum("event_type").notNull(),
  eventDescription: text("event_description"), // Human-readable description
  
  // Actor info
  actorType: text("actor_type").notNull(), // system, admin, recipient
  actorEmail: text("actor_email"),
  actorUserId: integer("actor_user_id").references(() => users.id),
  
  // Technical details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  // Additional metadata (JSON)
  metadata: text("metadata"),
  
  // Immutable timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCsuAuditTrailSchema = createInsertSchema(csuAuditTrail);

export type InsertCsuAuditTrail = Omit<z.infer<typeof insertCsuAuditTrailSchema>, 'id' | 'createdAt'>;
export type CsuAuditTrail = typeof csuAuditTrail.$inferSelect;

// ============================================
// PORTAL ACTIVITY TRACKING
// ============================================

// Portal Activity - Tracks page visits, form submissions, and events for each portal
export const portalActivity = pgTable("portal_activity", {
  id: serial("id").primaryKey(),
  portal: text("portal").notNull(), // e.g., "payzium"
  eventType: text("event_type").notNull(), // page_view, contract_sent, contract_signed, login, etc.
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  pagePath: text("page_path"),
  sessionId: text("session_id"), // To correlate events from same visitor
  userId: integer("user_id").references(() => users.id), // If logged in
  metadata: text("metadata"), // JSON string for additional event data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortalActivitySchema = createInsertSchema(portalActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertPortalActivity = z.infer<typeof insertPortalActivitySchema>;
export type PortalActivity = typeof portalActivity.$inferSelect;

// Password Reset Tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  usedAt: true,
  createdAt: true,
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Partner Sharing Log - Tracks all data shares with affiliated partners (COMPLIANCE REQUIRED)
export const partnerSharingLog = pgTable("partner_sharing_log", {
  id: serial("id").primaryKey(),
  submissionType: text("submission_type").notNull(), // e.g., "veteran_intake", "help_request", "contact"
  submissionId: integer("submission_id").notNull(),
  partnerName: text("partner_name").notNull(),
  partnerEndpoint: text("partner_endpoint"),
  deliveryStatus: text("delivery_status").notNull(), // "success", "failed", "pending"
  responseCode: integer("response_code"),
  errorMessage: text("error_message"),
  sharedAt: timestamp("shared_at").defaultNow().notNull(),
});

export const insertPartnerSharingLogSchema = createInsertSchema(partnerSharingLog).omit({
  id: true,
  sharedAt: true,
});

export type InsertPartnerSharingLog = z.infer<typeof insertPartnerSharingLogSchema>;
export type PartnerSharingLog = typeof partnerSharingLog.$inferSelect;

// Consent Records - Tracks TCPA consent for audit compliance (5-year retention required)
export const consentRecords = pgTable("consent_records", {
  id: serial("id").primaryKey(),
  submissionType: text("submission_type").notNull(), // e.g., "veteran_intake", "help_request"
  submissionId: integer("submission_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  consentCheckbox: boolean("consent_checkbox").notNull(),
  trustedFormCertUrl: text("trusted_form_cert_url"),
  landingPageUrl: text("landing_page_url"),
  consentLanguageVersion: text("consent_language_version").default("v1.0"),
  partnersSharedWith: text("partners_shared_with"), // JSON array of partner names
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertConsentRecordSchema = createInsertSchema(consentRecords).omit({
  id: true,
  submittedAt: true,
});

export type InsertConsentRecord = z.infer<typeof insertConsentRecordSchema>;
export type ConsentRecord = typeof consentRecords.$inferSelect;

// Affiliated Partners - List of mission-aligned partners for public disclosure
export const affiliatedPartners = pgTable("affiliated_partners", {
  id: serial("id").primaryKey(),
  legalName: text("legal_name").notNull(),
  displayName: text("display_name").notNull(),
  category: text("category").notNull(), // "va_benefits", "financial", "healthcare", "legal"
  description: text("description"),
  website: text("website"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAffiliatedPartnerSchema = createInsertSchema(affiliatedPartners).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliatedPartner = z.infer<typeof insertAffiliatedPartnerSchema>;
export type AffiliatedPartner = typeof affiliatedPartners.$inferSelect;

// Ranger Tab Applications - People requesting their own contract portal
export const rangerTabApplications = pgTable("ranger_tab_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  business: text("business").notNull(),
  address: text("address").notNull(),
  initials: text("initials").notNull(),
  credentials: text("credentials"), // Why do you want to be a Ranger? (How can you help the cause)
  status: text("status").notNull().default("new"), // new, contacted, approved, active
  notes: text("notes"),
  portalSlug: text("portal_slug"), // When approved, this is their portal URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRangerTabApplicationSchema = createInsertSchema(rangerTabApplications).omit({
  id: true,
  status: true,
  notes: true,
  portalSlug: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRangerTabApplication = z.infer<typeof insertRangerTabApplicationSchema>;
export type RangerTabApplication = typeof rangerTabApplications.$inferSelect;

// Conversations for AI chat (used by OpenAI integration)
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// ===== HIPAA COMPLIANCE TABLES =====

// HIPAA Audit Log - System-wide PHI access logging
// §164.312(b) - Audit Controls
// Tracks all access to Protected Health Information (PHI)
export const hipaaAuditLog = pgTable("hipaa_audit_log", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id), // Null for unauthenticated access
  userName: text("user_name"), // Captured at time of access for historical record
  userRole: text("user_role"), // admin, affiliate, etc.
  action: text("action").notNull(), // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, FAILED_LOGIN
  resourceType: text("resource_type").notNull(), // veteran_intake, help_request, medical_record, etc.
  resourceId: text("resource_id"), // ID of the accessed resource
  resourceDescription: text("resource_description"), // Brief description of what was accessed
  ipAddress: text("ip_address"), // Client IP address
  userAgent: text("user_agent"), // Browser/client user agent
  sessionId: text("session_id"), // Session identifier for tracking
  success: boolean("success").notNull().default(true), // Whether the action succeeded
  errorMessage: text("error_message"), // Error details if action failed
  phiAccessed: boolean("phi_accessed").notNull().default(false), // Flag for PHI access
  metadata: text("metadata"), // JSON string for additional context
});

export const insertHipaaAuditLogSchema = createInsertSchema(hipaaAuditLog).omit({
  id: true,
  timestamp: true,
});

export type InsertHipaaAuditLog = z.infer<typeof insertHipaaAuditLogSchema>;
export type HipaaAuditLog = typeof hipaaAuditLog.$inferSelect;

// HIPAA Training Records - Track workforce training completion
// §164.308(a)(5) - Security Awareness and Training
export const hipaaTrainingRecords = pgTable("hipaa_training_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trainingType: text("training_type").notNull(), // initial, annual, security_reminder, policy_update
  trainingName: text("training_name").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  expiresAt: timestamp("expires_at"), // When recertification is needed
  score: integer("score"), // Assessment score if applicable
  passed: boolean("passed").notNull().default(true),
  certificateUrl: text("certificate_url"), // Link to certificate if available
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHipaaTrainingRecordSchema = createInsertSchema(hipaaTrainingRecords).omit({
  id: true,
  createdAt: true,
});

export type InsertHipaaTrainingRecord = z.infer<typeof insertHipaaTrainingRecordSchema>;
export type HipaaTrainingRecord = typeof hipaaTrainingRecords.$inferSelect;

// Business Associate Agreements (BAA) Tracking
// §164.504(e) - Business Associate Contracts
export const businessAssociateAgreements = pgTable("business_associate_agreements", {
  id: serial("id").primaryKey(),
  vendorName: text("vendor_name").notNull(),
  vendorType: text("vendor_type").notNull(), // hosting, email, ai, database, etc.
  vendorContact: text("vendor_contact"),
  vendorEmail: text("vendor_email"),
  baaStatus: text("baa_status").notNull(), // not_started, requested, in_review, executed, expired, not_applicable
  baaDocumentUrl: text("baa_document_url"), // Link to signed agreement
  executedDate: timestamp("executed_date"),
  expirationDate: timestamp("expiration_date"),
  renewalReminderDays: integer("renewal_reminder_days").default(90),
  description: text("description"),
  phiShared: text("phi_shared"), // Description of what PHI is shared
  securityMeasures: text("security_measures"), // Vendor's security measures
  notes: text("notes"),
  lastReviewedAt: timestamp("last_reviewed_at"),
  lastReviewedBy: integer("last_reviewed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBusinessAssociateAgreementSchema = createInsertSchema(businessAssociateAgreements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBusinessAssociateAgreement = z.infer<typeof insertBusinessAssociateAgreementSchema>;
export type BusinessAssociateAgreement = typeof businessAssociateAgreements.$inferSelect;

// MFA Configuration for users
// §164.312(d) - Person or Entity Authentication
export const userMfaConfig = pgTable("user_mfa_config", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  mfaSecret: text("mfa_secret"), // Encrypted TOTP secret
  backupCodes: text("backup_codes"), // Encrypted JSON array of backup codes
  lastMfaUsedAt: timestamp("last_mfa_used_at"),
  mfaSetupCompletedAt: timestamp("mfa_setup_completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserMfaConfigSchema = createInsertSchema(userMfaConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserMfaConfig = z.infer<typeof insertUserMfaConfigSchema>;
export type UserMfaConfig = typeof userMfaConfig.$inferSelect;

// HIPAA §164.312(d) - Persistent Rate Limiting for Auth
// Tracks failed auth attempts with lockout for brute-force prevention
export const authRateLimits = pgTable("auth_rate_limits", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(), // userId, email, or IP
  identifierType: text("identifier_type").notNull(), // "user", "email", "ip"
  attemptType: text("attempt_type").notNull(), // "login", "mfa"
  failedAttempts: integer("failed_attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAuthRateLimitSchema = createInsertSchema(authRateLimits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAuthRateLimit = z.infer<typeof insertAuthRateLimitSchema>;
export type AuthRateLimit = typeof authRateLimits.$inferSelect;

// AI Generation - Naval Intelligence Feature
// Tracks AI-generated videos, music, and music videos
export const aiGenerations = pgTable("ai_generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For anonymous users
  type: text("type").notNull(), // "text-to-video", "image-to-video", "text-to-music", "music-video"
  status: text("status").notNull().default("queued"), // "queued", "processing", "completed", "failed"
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  inputImageUrl: text("input_image_url"), // For image-to-video
  inputMusicUrl: text("input_music_url"), // For music-video (user-provided)
  generatedVideoUrl: text("generated_video_url"),
  generatedMusicUrl: text("generated_music_url"),
  generatedMusicVideoUrl: text("generated_music_video_url"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // Seconds
  resolution: text("resolution"), // "720p", "1080p"
  aspectRatio: text("aspect_ratio"), // "16:9", "9:16", "1:1"
  provider: text("provider"), // "replit", "suno", "replicate", etc.
  providerJobId: text("provider_job_id"), // External job ID for polling
  musicGenre: text("music_genre"), // For music generation
  musicLyrics: text("music_lyrics"), // Custom lyrics
  musicInstrumental: boolean("music_instrumental").default(false),
  beatSyncEnabled: boolean("beat_sync_enabled").default(false),
  beatMap: text("beat_map"), // JSON array of beat timestamps for sync
  templateId: integer("template_id"), // Link to ai_templates
  errorMessage: text("error_message"),
  metadata: text("metadata"), // JSON for additional data
  processingStartedAt: timestamp("processing_started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiGenerationSchema = createInsertSchema(aiGenerations).omit({
  id: true,
  status: true,
  generatedVideoUrl: true,
  generatedMusicUrl: true,
  generatedMusicVideoUrl: true,
  thumbnailUrl: true,
  providerJobId: true,
  beatMap: true,
  errorMessage: true,
  processingStartedAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiGeneration = z.infer<typeof insertAiGenerationSchema>;
export type AiGeneration = typeof aiGenerations.$inferSelect;

// AI Generation Templates - Pre-built prompts for veterans
export const aiTemplates = pgTable("ai_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "memorial", "tribute", "celebration", "family", "motivation", "custom"
  type: text("type").notNull(), // "video", "music", "music-video"
  description: text("description"),
  videoPrompt: text("video_prompt"),
  musicPrompt: text("music_prompt"),
  musicGenre: text("music_genre"),
  suggestedLyrics: text("suggested_lyrics"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  isActive: boolean("is_active").notNull().default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiTemplateSchema = createInsertSchema(aiTemplates).omit({
  id: true,
  usageCount: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiTemplate = z.infer<typeof insertAiTemplateSchema>;
export type AiTemplate = typeof aiTemplates.$inferSelect;

// Operator AI Memory - Stores conversation history with 3 modes
// Mode: "stateless" (no storage), "session" (temp), "persistent" (user-linked)
export const operatorAiMemory = pgTable("operator_ai_memory", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(), // Unique session identifier
  userId: integer("user_id").references(() => users.id), // Null for anonymous, linked for persistent
  memoryMode: text("memory_mode").notNull().default("stateless"), // "stateless", "session", "persistent"
  role: text("role").notNull(), // "user", "assistant", "system"
  content: text("content").notNull(),
  model: text("model"), // Which AI model was used
  preset: text("preset"), // Task preset used
  messageOrder: integer("message_order").notNull().default(0), // Order in conversation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // For session memory auto-cleanup
});

export const insertOperatorAiMemorySchema = createInsertSchema(operatorAiMemory).omit({
  id: true,
  createdAt: true,
});

export type InsertOperatorAiMemory = z.infer<typeof insertOperatorAiMemorySchema>;
export type OperatorAiMemory = typeof operatorAiMemory.$inferSelect;

// ============================================================================
// AI APPLICATION SCHEMA - Full-stack AI with memory, files, and async jobs
// ============================================================================

// Memory mode enum: OFF = stateless, SESSION = temp, PERSISTENT = remember forever
export const memoryModeEnum = pgEnum("memory_mode", ["OFF", "SESSION", "PERSISTENT"]);

// Job types for async media generation
export const jobTypeEnum = pgEnum("job_type", [
  "IMAGE_GEN",      // Image generation
  "AUDIO_TTS",      // Text-to-speech
  "AUDIO_MUSIC",    // Music generation
  "VIDEO_GEN",      // Video generation
  "VIDEO_EDIT",     // Video editing/stitching
  "FUSION_RENDER",  // Multi-modal fusion (image+audio→video)
  "DOC_INGEST",     // Document ingestion/OCR
]);

// Job status for tracking async work
export const jobStatusEnum = pgEnum("job_status", ["QUEUED", "RUNNING", "DONE", "FAILED"]);

// AI Users - Separate from admin users, supports anonymous
export const aiUsers = pgTable("ai_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),                    // Null for anonymous
  anonDeviceId: text("anon_device_id").unique(),    // Device fingerprint for anonymous users
  memoryMode: memoryModeEnum("memory_mode").notNull().default("OFF"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

export const insertAiUserSchema = createInsertSchema(aiUsers).omit({
  id: true,
  createdAt: true,
  lastActiveAt: true,
});
export type InsertAiUser = z.infer<typeof insertAiUserSchema>;
export type AiUser = typeof aiUsers.$inferSelect;

// AI Sessions - Conversation sessions with memory mode snapshot
export const aiSessions = pgTable("ai_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(), // UUID token for API access
  userId: integer("user_id").references(() => aiUsers.id), // Null for totally anonymous
  memoryModeAtStart: memoryModeEnum("memory_mode_at_start").notNull().default("OFF"),
  title: text("title"),                             // Auto-generated or user-set session title
  createdAt: timestamp("created_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),                   // When session was explicitly ended
  lastMessageAt: timestamp("last_message_at"),      // For sorting active sessions
});

export const insertAiSessionSchema = createInsertSchema(aiSessions).omit({
  id: true,
  createdAt: true,
});
export type InsertAiSession = z.infer<typeof insertAiSessionSchema>;
export type AiSession = typeof aiSessions.$inferSelect;

// AI Messages - Chat history per session
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => aiSessions.id).notNull(),
  role: text("role").notNull(),                     // "user" | "assistant" | "system"
  content: text("content").notNull(),               // Message text content
  attachments: text("attachments"),                 // JSON array of file IDs
  model: text("model"),                             // Which AI model generated this (for assistant)
  tokenCount: integer("token_count"),               // Token usage tracking
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiMessage = typeof aiMessages.$inferSelect;

// AI Files - Uploaded documents, images, audio, video
export const aiFiles = pgTable("ai_files", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").references(() => aiUsers.id), // Null if anonymous
  sessionId: integer("session_id").references(() => aiSessions.id),   // Null if persistent file
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  storageUrl: text("storage_url").notNull(),        // Where file is stored
  extractedText: text("extracted_text"),            // OCR/transcription result
  extractedMetadata: text("extracted_metadata"),    // JSON metadata from file
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),               // Soft delete for cleanup
});

export const insertAiFileSchema = createInsertSchema(aiFiles).omit({
  id: true,
  createdAt: true,
});
export type InsertAiFile = z.infer<typeof insertAiFileSchema>;
export type AiFile = typeof aiFiles.$inferSelect;

// AI Memory - Persistent key-value store for user memories
export const aiMemory = pgTable("ai_memory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => aiUsers.id).notNull(),
  key: text("key").notNull(),                       // Short label like "preferred_name", "occupation"
  value: text("value").notNull(),                   // The remembered value (text or JSON)
  sourceMessageId: integer("source_message_id").references(() => aiMessages.id), // Which message created this
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiMemorySchema = createInsertSchema(aiMemory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAiMemory = z.infer<typeof insertAiMemorySchema>;
export type AiMemory = typeof aiMemory.$inferSelect;

// AI Jobs - Async media generation tasks
export const aiJobs = pgTable("ai_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => aiUsers.id),
  sessionId: integer("session_id").references(() => aiSessions.id),
  jobType: jobTypeEnum("job_type").notNull(),
  status: jobStatusEnum("status").notNull().default("QUEUED"),
  input: text("input").notNull(),                   // JSON input parameters
  output: text("output"),                           // JSON output results (file URLs, etc.)
  progress: integer("progress").notNull().default(0), // 0-100 progress indicator
  errorMessage: text("error_message"),              // Error details if FAILED
  model: text("model"),                             // Which model was used
  estimatedDuration: integer("estimated_duration"), // Estimated ms to complete
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const insertAiJobSchema = createInsertSchema(aiJobs).omit({
  id: true,
  createdAt: true,
});
export type InsertAiJob = z.infer<typeof insertAiJobSchema>;
export type AiJob = typeof aiJobs.$inferSelect;

// ============================================================================
// MEDIA PIPELINE ORCHESTRATION - Multi-step job execution with planner
// ============================================================================

// Pipeline types for different media workflows
export const pipelineTypeEnum = pgEnum("pipeline_type", [
  "DOC_TO_CHAT",      // A) Documents → RAG for chat
  "TEXT_TO_AUDIO",    // B) Text → TTS audio narration
  "MEDIA_TO_VIDEO",   // C) Images + audio → video montage
  "TEXT_TO_VIDEO",    // D) Text prompt → AI video
  "CUSTOM",           // Custom pipeline with user-defined steps
]);

// Pipeline status
export const pipelineStatusEnum = pgEnum("pipeline_status", [
  "PLANNING",         // Planner LLM is generating execution plan
  "QUEUED",           // Plan ready, waiting to execute
  "RUNNING",          // Steps are executing
  "RENDERING",        // Final render/stitch in progress
  "DONE",             // Complete with downloadable artifact
  "FAILED",           // Error occurred
]);

// Media Pipelines - Orchestrated multi-step workflows
export const mediaPipelines = pgTable("media_pipelines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => aiUsers.id),
  sessionId: integer("session_id").references(() => aiSessions.id),
  pipelineType: pipelineTypeEnum("pipeline_type").notNull(),
  status: pipelineStatusEnum("status").notNull().default("PLANNING"),
  userIntent: text("user_intent").notNull(),           // Original user request
  executionPlan: text("execution_plan"),               // JSON: LLM-generated plan
  totalSteps: integer("total_steps").notNull().default(0),
  completedSteps: integer("completed_steps").notNull().default(0),
  progress: integer("progress").notNull().default(0),  // 0-100 overall progress
  finalArtifactUrl: text("final_artifact_url"),        // Downloadable result
  finalArtifactType: text("final_artifact_type"),      // MIME type of result
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const insertMediaPipelineSchema = createInsertSchema(mediaPipelines).omit({
  id: true,
  createdAt: true,
});
export type InsertMediaPipeline = z.infer<typeof insertMediaPipelineSchema>;
export type MediaPipeline = typeof mediaPipelines.$inferSelect;

// Step status for individual pipeline steps
export const stepStatusEnum = pgEnum("step_status", [
  "PENDING",          // Waiting for dependencies
  "RUNNING",          // Currently executing
  "DONE",             // Completed successfully
  "FAILED",           // Error occurred
  "SKIPPED",          // Skipped due to condition
]);

// Pipeline Steps - Individual steps within a pipeline
export const pipelineSteps = pgTable("pipeline_steps", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => mediaPipelines.id).notNull(),
  stepOrder: integer("step_order").notNull(),          // Execution order (1, 2, 3...)
  stepType: text("step_type").notNull(),               // "ingest" | "tts" | "image_gen" | "render" | etc.
  stepName: text("step_name").notNull(),               // Human-readable step name
  status: stepStatusEnum("status").notNull().default("PENDING"),
  inputParams: text("input_params").notNull(),         // JSON input for this step
  outputData: text("output_data"),                     // JSON output from this step
  dependsOn: text("depends_on"),                       // JSON array of step IDs this depends on
  artifactUrls: text("artifact_urls"),                 // JSON array of generated file URLs
  progress: integer("progress").notNull().default(0),  // 0-100 step progress
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPipelineStepSchema = createInsertSchema(pipelineSteps).omit({
  id: true,
  createdAt: true,
});
export type InsertPipelineStep = z.infer<typeof insertPipelineStepSchema>;
export type PipelineStep = typeof pipelineSteps.$inferSelect;

// Pipeline Artifacts - Generated files from pipeline execution
export const pipelineArtifacts = pgTable("pipeline_artifacts", {
  id: serial("id").primaryKey(),
  pipelineId: integer("pipeline_id").references(() => mediaPipelines.id).notNull(),
  stepId: integer("step_id").references(() => pipelineSteps.id),
  artifactType: text("artifact_type").notNull(),       // "audio" | "video" | "image" | "document" | "text"
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes"),
  storageUrl: text("storage_url").notNull(),
  isFinal: boolean("is_final").notNull().default(false), // Is this the final deliverable?
  metadata: text("metadata"),                          // JSON additional metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPipelineArtifactSchema = createInsertSchema(pipelineArtifacts).omit({
  id: true,
  createdAt: true,
});
export type InsertPipelineArtifact = z.infer<typeof insertPipelineArtifactSchema>;
export type PipelineArtifact = typeof pipelineArtifacts.$inferSelect;

// ==========================================
// CLAIMS NAVIGATOR - VA/SSDI Claim Wizard
// ==========================================

// Track type enum for claims
export const claimTrackEnum = pgEnum("claim_track", ["va", "ssdi"]);

// Claim type enum
export const claimTypeEnum = pgEnum("claim_type", [
  "new",            // VA: new claim
  "increase",       // VA: increase/worsening
  "appeal",         // VA: appeal/review
  "apply",          // SSDI: applying
  "reconsideration", // SSDI: appeal reconsideration
  "alj",            // SSDI: ALJ hearing prep
]);

// Evidence level enum
export const evidenceLevelEnum = pgEnum("evidence_level", ["none", "some", "a_lot"]);

// Task status enum
export const claimTaskStatusEnum = pgEnum("claim_task_status", ["todo", "doing", "done"]);

// Claim Sessions - Wizard sessions tracking user progress
export const claimSessions = pgTable("claim_sessions", {
  id: serial("id").primaryKey(),
  veteranUserId: varchar("veteran_user_id").references(() => veteranAuthUsers.id),
  track: claimTrackEnum("track").notNull(),
  claimType: claimTypeEnum("claim_type").notNull(),
  evidenceLevel: evidenceLevelEnum("evidence_level").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertClaimSessionSchema = createInsertSchema(claimSessions).omit({
  id: true,
  createdAt: true,
});
export type InsertClaimSession = z.infer<typeof insertClaimSessionSchema>;
export type ClaimSession = typeof claimSessions.$inferSelect;

// Claim Answers - Store wizard question responses
export const claimAnswers = pgTable("claim_answers", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => claimSessions.id).notNull(),
  questionKey: text("question_key").notNull(),
  answerValue: text("answer_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClaimAnswerSchema = createInsertSchema(claimAnswers).omit({
  id: true,
  createdAt: true,
});
export type InsertClaimAnswer = z.infer<typeof insertClaimAnswerSchema>;
export type ClaimAnswer = typeof claimAnswers.$inferSelect;

// Claim Tasks - Personalized checklist items
export const claimTasks = pgTable("claim_tasks", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => claimSessions.id),
  caseId: integer("case_id").references(() => claimCases.id),
  veteranUserId: varchar("veteran_user_id"),
  title: text("title").notNull(),
  description: text("description"),
  status: claimTaskStatusEnum("status").notNull().default("todo"),
  dueDate: timestamp("due_date"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertClaimTaskSchema = createInsertSchema(claimTasks).omit({
  id: true,
  createdAt: true,
});
export type InsertClaimTask = z.infer<typeof insertClaimTaskSchema>;
export type ClaimTask = typeof claimTasks.$inferSelect;

// Claim Files - Document uploads for claims
export const claimFiles = pgTable("claim_files", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => claimSessions.id),
  caseId: integer("case_id").references(() => claimCases.id),
  veteranUserId: varchar("veteran_user_id").references(() => veteranAuthUsers.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes"),
  storageUrl: text("storage_url").notNull(),
  category: text("category"), // medical_records, service_records, statements, etc.
  notes: text("notes"),
  // Evidence fields for completeness and strength scoring
  evidenceType: text("evidence_type"), // medical | lay | nexus | exam
  condition: text("condition"), // The condition this evidence relates to
  strength: integer("strength"), // 1-5 strength score
  // Vendor tracking
  authorType: text("author_type").default("veteran"), // veteran | vendor
  authorId: text("author_id"), // ID of the uploader (vendor email if vendor)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Evidence Requirements - Rules for document completeness
export const evidenceRequirements = pgTable("evidence_requirements", {
  id: serial("id").primaryKey(),
  track: text("track").notNull(), // VA | SSDI
  purpose: text("purpose").notNull(), // new_claim | increase | appeal
  evidenceType: text("evidence_type").notNull(), // medical | lay | nexus | exam
  label: text("label").notNull(),
  description: text("description"),
  required: boolean("required").default(true).notNull(),
  priority: integer("priority").default(1), // For ordering
});

export const insertEvidenceRequirementSchema = createInsertSchema(evidenceRequirements).omit({
  id: true,
});
export type InsertEvidenceRequirement = z.infer<typeof insertEvidenceRequirementSchema>;
export type EvidenceRequirement = typeof evidenceRequirements.$inferSelect;

export const insertClaimFileSchema = createInsertSchema(claimFiles).omit({
  id: true,
  createdAt: true,
});
export type InsertClaimFile = z.infer<typeof insertClaimFileSchema>;
export type ClaimFile = typeof claimFiles.$inferSelect;

// ==========================================
// CLAIM CASES - Veteran-owned case management
// ==========================================

// Case share role enum
export const caseShareRoleEnum = pgEnum("case_share_role", ["view", "comment", "upload"]);

// Deadline status enum
export const deadlineStatusEnum = pgEnum("deadline_status", ["open", "at_risk", "late", "done"]);

// Claim Cases - Veteran-owned cases (the veteran owns the case)
export const claimCases = pgTable("claim_cases", {
  id: serial("id").primaryKey(),
  veteranUserId: varchar("veteran_user_id").notNull(),
  title: text("title").notNull(),
  caseType: claimTrackEnum("case_type").notNull(), // VA or SSDI
  claimType: claimTypeEnum("claim_type"),
  status: text("status").notNull().default("active"), // active, submitted, closed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertClaimCaseSchema = createInsertSchema(claimCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertClaimCase = z.infer<typeof insertClaimCaseSchema>;
export type ClaimCase = typeof claimCases.$inferSelect;

// Case Shares - Vendor access permissions (explicit sharing)
export const caseShares = pgTable("case_shares", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => claimCases.id).notNull(),
  email: text("email").notNull(),
  role: caseShareRoleEnum("role").notNull().default("view"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCaseShareSchema = createInsertSchema(caseShares).omit({
  id: true,
  createdAt: true,
});
export type InsertCaseShare = z.infer<typeof insertCaseShareSchema>;
export type CaseShare = typeof caseShares.$inferSelect;

// Case Notes - Timeline comments
export const caseNotes = pgTable("case_notes", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => claimCases.id).notNull(),
  authorEmail: text("author_email").notNull(),
  authorType: text("author_type").notNull().default("veteran"), // veteran, vendor, system
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCaseNoteSchema = createInsertSchema(caseNotes).omit({
  id: true,
  createdAt: true,
});
export type InsertCaseNote = z.infer<typeof insertCaseNoteSchema>;
export type CaseNote = typeof caseNotes.$inferSelect;

// Case Deadlines - First-class deadline tracking
export const caseDeadlines = pgTable("case_deadlines", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => claimCases.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: deadlineStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCaseDeadlineSchema = createInsertSchema(caseDeadlines).omit({
  id: true,
  createdAt: true,
});
export type InsertCaseDeadline = z.infer<typeof insertCaseDeadlineSchema>;
export type CaseDeadline = typeof caseDeadlines.$inferSelect;

// ==========================================
// VENDOR MAGIC LINK AUTH
// ==========================================

// Vendor Magic Links - Passwordless email authentication for vendors
export const vendorMagicLinks = pgTable("vendor_magic_links", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVendorMagicLinkSchema = createInsertSchema(vendorMagicLinks).omit({
  id: true,
  used: true,
  createdAt: true,
});
export type InsertVendorMagicLink = z.infer<typeof insertVendorMagicLinkSchema>;
export type VendorMagicLink = typeof vendorMagicLinks.$inferSelect;

// Vendor Sessions - Active login sessions for vendors
export const vendorSessions = pgTable("vendor_sessions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVendorSessionSchema = createInsertSchema(vendorSessions).omit({
  id: true,
  createdAt: true,
});
export type InsertVendorSession = z.infer<typeof insertVendorSessionSchema>;
export type VendorSession = typeof vendorSessions.$inferSelect;

// Replit Auth tables (for veteran users)
export * from "./models/auth";
