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

// VLT Affiliates with 6-level hierarchy
export const vltAffiliates = pgTable("vlt_affiliates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  level1Id: integer("level1_id"), // Direct upline
  level2Id: integer("level2_id"), // 2nd level upline
  level3Id: integer("level3_id"), // 3rd level upline
  level4Id: integer("level4_id"), // 4th level upline
  level5Id: integer("level5_id"), // 5th level upline
  level6Id: integer("level6_id"), // 6th level upline (master)
  status: text("status").notNull().default("active"), // active, inactive, suspended
  totalLeads: integer("total_leads").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
