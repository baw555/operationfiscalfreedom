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
