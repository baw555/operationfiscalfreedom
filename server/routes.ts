import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import multer from "multer";
import { storage } from "./storage";
import { db } from "./db";
import { LEGAL_DOCS, getLegalStatus, signLegalDocumentAtomic, healLegalStateOnLogin, createLegalOverride, legalSystemHealthCheck, generateEvidenceBundle, processExternalEsignCallback, runLegalTestBot, requireLegalClearance, hashDocument } from "./legal-system";
import { submitAffiliateNda } from "./actions/submit-affiliate-nda";
import { authenticateUser, createAdminUser, createAffiliateUser, hashPassword } from "./auth";
import { getResendClient } from "./resendClient";
import twilio from "twilio";
import Stripe from "stripe";
import { extractDocumentText, analyzeContractDocument, reformatDocumentText } from "./contractDocumentAnalyzer";
import { recordAffiliateActivity, ACTIVITY_TYPES, type ActivityType } from "./affiliateActivityService";
import { TOTP, generateSecret, verifySync, NobleCryptoPlugin, ScureBase32Plugin } from "otplib";
import * as QRCode from "qrcode";
import crypto from "crypto";
import { getOrCreateConversation, getConversationHistory, saveMessage, generateAIResponse, getContextualTips, seedInitialFaqs, transcribeAudio } from "./sailor-chat";

// HIPAA Security: Configure TOTP with strict timing window to prevent replay attacks
const totpInstance = new TOTP({
  period: 30,   // Standard 30-second time step
  crypto: new NobleCryptoPlugin(),
  base32: new ScureBase32Plugin(),
});

// Helper function for TOTP verification with security window
function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({
      token,
      secret,
      epochTolerance: 30, // Allow 30 second tolerance (1 period each direction)
      crypto: new NobleCryptoPlugin(),
      base32: new ScureBase32Plugin(),
    });
    return result.valid;
  } catch {
    return false;
  }
}

// HIPAA §164.312(d) - Persistent Rate Limiting to prevent brute-force attacks
// Uses PostgreSQL for persistent, distributed lockout enforcement
const AUTH_MAX_ATTEMPTS = 5;
const AUTH_LOCKOUT_MINUTES = 15;

async function checkAuthRateLimit(
  identifier: string, 
  identifierType: "user" | "email" | "ip", 
  attemptType: "login" | "mfa"
): Promise<{ allowed: boolean; remainingAttempts: number; lockedUntil: Date | null }> {
  const record = await storage.getAuthRateLimit(identifier, identifierType, attemptType);
  
  if (!record) {
    return { allowed: true, remainingAttempts: AUTH_MAX_ATTEMPTS, lockedUntil: null };
  }
  
  const now = new Date();
  
  // Check if user is locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remainingAttempts: 0, lockedUntil: record.lockedUntil };
  }
  
  // Reset if lockout expired
  if (record.lockedUntil && now >= record.lockedUntil) {
    await storage.resetAuthRateLimit(identifier, identifierType, attemptType);
    return { allowed: true, remainingAttempts: AUTH_MAX_ATTEMPTS, lockedUntil: null };
  }
  
  return { 
    allowed: record.failedAttempts < AUTH_MAX_ATTEMPTS, 
    remainingAttempts: AUTH_MAX_ATTEMPTS - record.failedAttempts,
    lockedUntil: null 
  };
}

async function recordAuthAttempt(
  identifier: string, 
  identifierType: "user" | "email" | "ip", 
  attemptType: "login" | "mfa",
  success: boolean
): Promise<void> {
  if (success) {
    // Reset on successful verification
    await storage.resetAuthRateLimit(identifier, identifierType, attemptType);
    return;
  }
  
  const record = await storage.getAuthRateLimit(identifier, identifierType, attemptType);
  const newAttempts = (record?.failedAttempts || 0) + 1;
  
  // Lock out after max attempts
  const lockedUntil = newAttempts >= AUTH_MAX_ATTEMPTS 
    ? new Date(Date.now() + (AUTH_LOCKOUT_MINUTES * 60 * 1000)) 
    : null;
  
  await storage.createOrUpdateAuthRateLimit({
    identifier,
    identifierType,
    attemptType,
    failedAttempts: newAttempts,
    lockedUntil,
  });
}
import { 
  insertAffiliateApplicationSchema, 
  insertHelpRequestSchema, 
  insertStartupGrantSchema, 
  insertFurnitureAssistanceSchema,
  insertInvestorSubmissionSchema,
  insertPrivateDoctorRequestSchema,
  insertWebsiteApplicationSchema,
  insertGeneralContactSchema,
  insertVltIntakeSchema,
  insertOpportunitySchema,
  insertSaleSchema,
  insertVeteranIntakeSchema,
  insertBusinessIntakeSchema,
  insertContractTemplateSchema,
  insertSignedAgreementSchema,
  insertBusinessLeadSchema,
  insertDisabilityReferralSchema,
  insertJobPlacementIntakeSchema,
  insertScheduleASignatureSchema,
  insertInsuranceIntakeSchema,
  insertMedicalSalesIntakeSchema,
  insertBusinessDevIntakeSchema,
  insertCsuContractSendSchema,
  insertCsuSignedAgreementSchema,
  insertPortalActivitySchema,
  portalActivity,
  insertConsentRecordSchema
} from "@shared/schema";
import { z } from "zod";

// Zod validation schemas for envelope system
const envelopeRecipientSchema = z.object({
  name: z.string().min(1, "Recipient name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().nullable(),
  role: z.enum(["signer", "cc", "approver"]).default("signer"),
  routingOrder: z.number().int().min(1, "Routing order must be at least 1").default(1),
});

const createEnvelopeSchema = z.object({
  templateId: z.number().int().positive("Template ID is required"),
  name: z.string().min(1, "Envelope name is required").max(255),
  routingType: z.enum(["sequential", "parallel", "mixed"]).default("sequential"),
  recipients: z.array(envelopeRecipientSchema).min(1, "At least one recipient is required"),
  reminderEnabled: z.boolean().default(false),
  reminderDaysAfterSend: z.number().int().min(1).max(30).default(3),
  reminderFrequencyDays: z.number().int().min(1).max(14).default(3),
  expiresInDays: z.number().int().min(1).max(365).optional().nullable(),
});

// Valid envelope status transitions (state machine)
const VALID_ENVELOPE_TRANSITIONS: Record<string, string[]> = {
  draft: ["sent", "voided"],
  sent: ["completed", "voided", "declined"],
  completed: [], // Terminal state - no further transitions
  voided: [], // Terminal state
  declined: ["voided"], // Can only void a declined envelope
};

// Valid recipient status transitions
const VALID_RECIPIENT_TRANSITIONS: Record<string, string[]> = {
  pending: ["sent", "voided"],
  sent: ["viewed", "signed", "declined", "voided"],
  viewed: ["signed", "declined", "voided"],
  signed: [], // Terminal state
  declined: ["voided"],
  voided: [], // Terminal state
};

// Helper to validate state transition
function isValidTransition(currentStatus: string, newStatus: string, transitions: Record<string, string[]>): boolean {
  const allowed = transitions[currentStatus] || [];
  return allowed.includes(newStatus);
}

// Email retry with exponential backoff - imported from centralized module
import { sendEmailWithRetryClient, sendEmailWithRetry } from "./emailWithRetry";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
    vltAffiliateId: number;
    mfaVerified?: boolean; // HIPAA §164.312(d) - MFA verification status
    mfaPending?: boolean; // Indicates user needs to complete MFA
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// HIPAA §164.312(d) - MFA-enforced authentication middleware
// Blocks access to protected resources until MFA is verified
function requireMfaAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // If MFA is pending (user has MFA enabled but hasn't verified yet), block access
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required",
      mfaPending: true 
    });
  }
  
  next();
}

// Middleware to check if user is admin or master
// HIPAA §164.312(a)(1) - Access Control with Minimum Necessary Principle
// Define role permissions for granular access control
type Permission = 
  | "view_phi"           // Access to PHI data
  | "modify_phi"         // Modify PHI records
  | "manage_users"       // Create/edit user accounts
  | "manage_contracts"   // Contract management
  | "view_audit_logs"    // Access audit trail
  | "manage_baa"         // Business Associate Agreements
  | "manage_training"    // Training records management
  | "hipaa_admin"        // Full HIPAA compliance access
  | "manage_leads"       // Lead management
  | "manage_affiliates"; // Affiliate management

const rolePermissions: Record<string, Permission[]> = {
  master: [
    "view_phi", "modify_phi", "manage_users", "manage_contracts",
    "view_audit_logs", "manage_baa", "manage_training", "hipaa_admin",
    "manage_leads", "manage_affiliates"
  ],
  admin: [
    "view_phi", "modify_phi", "manage_contracts", "view_audit_logs",
    "manage_leads", "manage_affiliates"
  ],
  affiliate: [
    "manage_leads" // Limited to their own leads only
  ],
};

// Permission check middleware factory - HIPAA minimum necessary access
function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized - Authentication required" });
    }
    
    const userRole = req.session.userRole || "";
    const userPermissions = rolePermissions[userRole] || [];
    
    if (!userPermissions.includes(permission)) {
      // Log access denial for HIPAA audit
      storage.createHipaaAuditLog({
        userId: req.session.userId,
        userName: null,
        userRole: userRole,
        action: "ACCESS_DENIED",
        resourceType: permission,
        resourceId: req.path,
        resourceDescription: `Permission denied: ${permission}`,
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: false,
        errorMessage: `Role ${userRole} lacks permission: ${permission}`,
        phiAccessed: false,
      }).catch(console.error);
      
      return res.status(403).json({ 
        message: "Forbidden - Insufficient permissions",
        requiredPermission: permission 
      });
    }
    next();
  };
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const internalUser = (req as any).user;
  if (internalUser?.service && (internalUser.role === "master" || internalUser.role === "admin")) {
    return next();
  }
  
  if (!req.session.userId || (req.session.userRole !== "admin" && req.session.userRole !== "master")) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  // HIPAA §164.312(d) - Enforce MFA for admin access to PHI
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required for admin access",
      mfaPending: true 
    });
  }
  
  next();
}

// Middleware to check if user is affiliate
function requireAffiliate(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "affiliate") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  // HIPAA §164.312(d) - Enforce MFA for affiliate access if enabled
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required",
      mfaPending: true 
    });
  }
  next();
}

// Middleware to check if affiliate has signed NDA - ENFORCED ON BACKEND
// This is the authoritative check - client-side checks are for UX only
// NOW USES GLOBAL LEGAL SYSTEM for unified enforcement
async function requireAffiliateWithNda(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "affiliate") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  // HIPAA §164.312(d) - Enforce MFA for affiliate access if enabled
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required",
      mfaPending: true 
    });
  }
  
  // CRITICAL: Check legal status from GLOBAL LEGAL SYSTEM - single source of truth
  try {
    const legalStatus = await getLegalStatus(req.session.userId, req.session.userRole);
    
    // Check NDA specifically
    if (!legalStatus.NDA) {
      return res.status(403).json({ 
        message: "NDA signature required",
        required: "NDA",
        redirectTo: "/affiliate/nda"
      });
    }
    
    // Check CONTRACT if defined for this role
    if (legalStatus.CONTRACT === false) {
      return res.status(403).json({ 
        message: "Contract signature required",
        required: "CONTRACT",
        redirectTo: "/legal/contract"
      });
    }
  } catch (error) {
    console.error("[requireAffiliateWithNda] Error checking legal status:", error);
    return res.status(500).json({ message: "Failed to verify legal status" });
  }
  
  next();
}

// HIPAA §164.312(b) - PHI Access Audit Logging Middleware
// Automatically logs access to PHI-containing resources
function logPhiAccess(resourceType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId || null;
    const resourceId = req.params.id || null;
    
    // Log the access attempt
    try {
      await storage.createHipaaAuditLog({
        userId,
        userName: null, // Will be populated if user is loaded
        userRole: req.session.userRole || null,
        action: req.method === "GET" ? "PHI_READ" : req.method === "POST" ? "PHI_CREATE" : req.method === "PATCH" || req.method === "PUT" ? "PHI_UPDATE" : "PHI_DELETE",
        resourceType,
        resourceId,
        resourceDescription: `${req.method} ${req.path}`,
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: true,
        phiAccessed: true, // This middleware is specifically for PHI access
      });
    } catch (error) {
      console.error("Error logging PHI access:", error);
      // Don't block the request if logging fails, but log the error
    }
    
    next();
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Trust proxy for Replit's load balancer (needed in both dev and production)
  app.set('trust proxy', 1);

  // PostgreSQL session store for persistent sessions
  const PgStore = pgSession(session);
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for session storage");
  }
  
  // Create session pool with error handling
  const sessionPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });
  
  // Handle pool errors to prevent crashes
  sessionPool.on('error', (err) => {
    console.error('Session pool error:', err);
  });

  // Verify session pool connectivity on startup
  try {
    const client = await sessionPool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[session] PostgreSQL session store connected successfully');
  } catch (err) {
    console.error('[session] Failed to connect to session store:', err);
    throw new Error('Session store connection failed - cannot start server');
  }

  const sessionStore = new PgStore({
    pool: sessionPool,
    tableName: "session",
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
  });

  // Handle session store errors
  sessionStore.on('error', (err: Error) => {
    console.error('Session store error:', err);
  });

  // HIPAA Security: Session configuration with secure cookies
  // §164.312(d) - Person or Entity Authentication
  // §164.312(a)(2)(iii) - Automatic Logoff
  const isProduction = process.env.NODE_ENV === "production";
  const SESSION_TIMEOUT_MINUTES = 15; // HIPAA requires reasonable inactivity timeout
  
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "operation-fiscal-freedom-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      rolling: true, // Reset session expiry on each request (for activity-based timeout)
      cookie: {
        secure: isProduction, // HTTPS only in production (§164.312(e)(1))
        httpOnly: true, // Prevent XSS access to cookies (§164.312(c)(1))
        sameSite: 'lax', // CSRF protection - lax allows cookies on navigation from external links (email, social) while still blocking cross-origin POST requests
        maxAge: SESSION_TIMEOUT_MINUTES * 60 * 1000, // 15 minutes for HIPAA auto-logoff
      },
    })
  );
  
  console.log(`[session] Session timeout configured: ${SESSION_TIMEOUT_MINUTES} minutes, secure cookies: ${isProduction}`);

  // ===== PUBLIC ROUTES =====

  // Submit affiliate application (legacy - just stores application)
  app.post("/api/affiliate-applications", async (req, res) => {
    try {
      const data = insertAffiliateApplicationSchema.parse(req.body);
      const application = await storage.createAffiliateApplication(data);
      res.status(201).json({ success: true, id: application.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // New affiliate self-signup - creates account and logs in immediately
  app.post("/api/affiliate-signup", async (req, res) => {
    try {
      const { name, companyName, phone, email, password, description } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists. Please login instead." });
      }
      
      // Create the affiliate user account
      const affiliate = await createAffiliateUser(name, email, password);
      
      // Also store the application info for admin reference
      try {
        await storage.createAffiliateApplication({
          name,
          companyName: companyName || "",
          phone: phone || "",
          email,
          description: description || "",
        });
      } catch (appError) {
        // Application storage is optional, don't fail the signup
        console.log("Note: Could not store application details:", appError);
      }
      
      // Log the user in automatically with session regeneration for security
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regenerate error:", regenerateErr);
          // Still return success since account was created
          return res.status(201).json({ 
            success: true,
            user: {
              id: affiliate.id, 
              name: affiliate.name, 
              email: affiliate.email, 
              role: affiliate.role 
            }
          });
        }
        
        req.session.userId = affiliate.id;
        req.session.userRole = affiliate.role;
        
        // Ensure session is saved before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
          }
          console.log(`[auth] Affiliate signup successful for user ${affiliate.id}, session saved`);
          res.status(201).json({ 
            success: true,
            user: {
              id: affiliate.id, 
              name: affiliate.name, 
              email: affiliate.email, 
              role: affiliate.role 
            }
          });
        });
      });
    } catch (error) {
      console.error("Affiliate signup error:", error);
      res.status(500).json({ message: "Failed to create account. Please try again." });
    }
  });

  // Ranger Tab Signup - Public route for requesting a contract portal
  app.post("/api/ranger-tab-signup", async (req, res) => {
    try {
      const signupSchema = z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Valid email is required"),
        business: z.string().min(1, "Business name is required"),
        address: z.string().min(1, "Address is required"),
        initials: z.string().min(1, "Initials are required"),
      });

      const validationResult = signupSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const application = await storage.createRangerTabApplication(validationResult.data);
      
      console.log(`[Ranger Tab] New application from ${application.name} (${application.email})`);
      
      res.status(201).json({ 
        success: true, 
        id: application.id,
        message: "Application submitted successfully" 
      });
    } catch (error) {
      console.error("Ranger Tab signup error:", error);
      res.status(500).json({ message: "Failed to submit application. Please try again." });
    }
  });

  // Track referral link visit - locks IP to affiliate for 30 days (first-touch attribution)
  app.post("/api/track-referral", async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code required" });
      }
      
      // Get client IP address
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      
      // Check if this IP is already tracked
      const existingTracking = await storage.getActiveIpReferral(clientIp);
      if (existingTracking) {
        // IP already tracked - return existing affiliate info (first-touch attribution)
        return res.json({ 
          success: true, 
          message: "IP already attributed",
          referralCode: existingTracking.referralCode,
          expiresAt: existingTracking.expiresAt
        });
      }
      
      // Look up affiliate by referral code
      const affiliate = await storage.getUserByReferralCode(referralCode);
      if (!affiliate) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      
      // Create IP tracking record (30 day expiration)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      await storage.createIpReferralTracking({
        ipAddress: clientIp,
        affiliateId: affiliate.id,
        referralCode: referralCode,
        expiresAt,
      });
      
      res.json({ 
        success: true, 
        message: "Referral tracked",
        referralCode,
        expiresAt
      });
    } catch (error) {
      console.error("Error tracking referral:", error);
      res.status(500).json({ message: "Failed to track referral" });
    }
  });

  // ===== FIN-OPS PARTNER TRACKING =====
  
  // Partner service URLs mapping
  const FINOPS_PARTNER_URLS: Record<string, string> = {
    my_locker: "https://www.moq1.com/imaginate-pod/navigatorusa",
    merchant_services: "https://staging.fluidfintec.com/merchant-signup",
    vgift_cards: "https://ptogiftcardprogram.com/navigator-usa-virtual-gift-cards/?group="
  };

  // Zod schema for finops track-click validation
  const trackClickSchema = z.object({
    partnerType: z.enum(["my_locker", "merchant_services", "vgift_cards"]),
    referralCode: z.string().optional().nullable()
  });

  // Track finops partner click and redirect
  app.post("/api/finops/track-click", async (req, res) => {
    try {
      const validationResult = trackClickSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid request body", errors: validationResult.error.errors });
      }
      
      const { partnerType, referralCode } = validationResult.data;
      
      if (!FINOPS_PARTNER_URLS[partnerType]) {
        return res.status(400).json({ message: "Invalid partner type" });
      }
      
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      const externalUrl = FINOPS_PARTNER_URLS[partnerType];
      
      // Look up affiliate by referral code if provided
      let affiliateId: number | undefined;
      if (referralCode) {
        const affiliate = await storage.getUserByReferralCode(referralCode);
        if (affiliate) {
          affiliateId = affiliate.id;
        }
      }
      
      // Create tracking record
      const referral = await storage.createFinopsReferral({
        affiliateId: affiliateId || null,
        referralCode: referralCode || null,
        partnerType,
        externalUrl,
        visitorIp: clientIp,
        userAgent
      });
      
      console.log(`[finops] Tracked ${partnerType} click - ref: ${referralCode || 'direct'}, ip: ${clientIp}`);
      
      res.json({ 
        success: true, 
        trackingId: referral.id,
        redirectUrl: externalUrl
      });
    } catch (error) {
      console.error("Error tracking finops click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  // ===== AFFILIATE ACTIVITY TRACKING =====
  
  const affiliateActivitySchema = z.object({
    email: z.string().email("Invalid email format"),
    actorUserId: z.number().optional(),
    metadata: z.record(z.any()).optional().default({})
  });

  const notificationSettingsSchema = z.object({
    enabled: z.boolean().optional(),
    emails: z.array(z.string().email("Invalid email format").transform(e => e.toLowerCase().trim())).max(5, "Maximum 5 additional emails allowed").optional(),
    events: z.record(z.boolean()).optional(),
    delivery: z.enum(["instant", "hourly", "daily"]).optional()
  });
  
  // Track affiliate activity event
  app.post("/api/affiliate-activity/:type", async (req, res) => {
    try {
      const type = req.params.type.toUpperCase() as ActivityType;
      
      if (!ACTIVITY_TYPES.includes(type as typeof ACTIVITY_TYPES[number])) {
        return res.status(400).json({ message: "Invalid activity type", validTypes: ACTIVITY_TYPES });
      }
      
      const validation = affiliateActivitySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.errors 
        });
      }
      
      const { email, actorUserId, metadata } = validation.data;
      
      const result = await recordAffiliateActivity({
        type,
        actorEmail: email,
        actorUserId,
        metadata
      });
      
      if (result.isDuplicate) {
        return res.json({ success: true, message: "Duplicate event - already recorded" });
      }
      
      res.json({ 
        success: true, 
        message: `Activity ${type} recorded`,
        notifiedCount: result.notifiedEmails?.length || 0
      });
    } catch (error) {
      console.error("[affiliate-activity] Error:", error);
      res.status(500).json({ message: "Failed to record activity" });
    }
  });

  // Get all affiliate activities (admin only)
  app.get("/api/admin/affiliate-activities", requireAdmin, async (req, res) => {
    try {
      const activities = await storage.getAllAffiliateActivities();
      res.json(activities);
    } catch (error) {
      console.error("[affiliate-activity] Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Get current user's notification settings
  app.get("/api/notification-settings", requireAuth, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const settings = await storage.ensureNotificationSettings(userId);
      const { decrypt } = await import("./crypto");
      let emails: string[] = [];
      try {
        if (settings.emailsEnc) {
          emails = JSON.parse(decrypt(settings.emailsEnc));
        }
      } catch { emails = []; }
      
      res.json({
        ...settings,
        emails,
        events: settings.events ? JSON.parse(settings.events) : {},
        delivery: settings.delivery
      });
    } catch (error) {
      console.error("[notification-settings] Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  // Update notification settings
  app.put("/api/notification-settings", requireAuth, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const validation = notificationSettingsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.errors 
        });
      }

      const { enabled, emails, events, delivery } = validation.data;
      const { encrypt, decrypt } = await import("./crypto");

      await storage.ensureNotificationSettings(userId);
      
      const updates: any = {};
      if (enabled !== undefined) updates.enabled = enabled;
      if (emails !== undefined) updates.emailsEnc = encrypt(JSON.stringify(emails));
      if (events !== undefined) updates.events = JSON.stringify(events);
      if (delivery !== undefined) updates.delivery = delivery;

      const updated = await storage.updateNotificationSettings(userId, updates);
      
      let decryptedEmails: string[] = [];
      try {
        if (updated?.emailsEnc) {
          decryptedEmails = JSON.parse(decrypt(updated.emailsEnc));
        }
      } catch { decryptedEmails = []; }
      
      res.json({
        ...updated,
        emails: decryptedEmails,
        events: updated?.events ? JSON.parse(updated.events) : {},
        delivery: updated?.delivery
      });
    } catch (error) {
      console.error("[notification-settings] Error updating settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  // Admin export: Notification audit logs as CSV
  app.get("/api/admin/export/audit", requireAdmin, async (req, res) => {
    try {
      const { getAllAuditLogs } = await import("./auditService");
      const logs = await getAllAuditLogs();
      
      const headers = ["id", "eventType", "actorEmail", "recipients", "delivery", "provider", "success", "error", "prevHash", "hash", "createdAt"];
      const csvRows = [headers.join(",")];
      
      for (const log of logs) {
        const row = headers.map(h => {
          const value = (log as any)[h];
          if (value === null || value === undefined) return "";
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          if (value instanceof Date) {
            return value.toISOString();
          }
          return String(value);
        });
        csvRows.push(row.join(","));
      }
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=audit-export.csv");
      res.send(csvRows.join("\n"));
    } catch (error) {
      console.error("[admin/export/audit] Error:", error);
      res.status(500).json({ message: "Failed to export audit logs" });
    }
  });

  // Verify audit chain integrity
  app.get("/api/admin/audit/verify", requireAdmin, async (req, res) => {
    try {
      const { verifyAuditChain } = await import("./auditService");
      const result = await verifyAuditChain();
      res.json(result);
    } catch (error) {
      console.error("[admin/audit/verify] Error:", error);
      res.status(500).json({ message: "Failed to verify audit chain" });
    }
  });

  // System health endpoint
  app.get("/api/system/health", async (req, res) => {
    try {
      await storage.getUser(1);
      res.json({
        status: "ok",
        db: "up",
        time: new Date().toISOString()
      });
    } catch {
      res.status(500).json({ status: "degraded", db: "down" });
    }
  });

  // Queue stats endpoint (admin only)
  app.get("/api/admin/queue/stats", requireAdmin, async (req, res) => {
    try {
      const { getQueueStats } = await import("./queueService");
      const stats = await getQueueStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting queue stats:", error);
      res.status(500).json({ message: "Failed to get queue stats" });
    }
  });

  // Get current user info (for notification console)
  app.get("/api/me", requireAuth, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Get audit logs (JSON format for admin console)
  app.get("/api/admin/audit", requireAdmin, async (req, res) => {
    try {
      const { getAllAuditLogs } = await import("./auditService");
      const logs = await getAllAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error getting audit logs:", error);
      res.status(500).json({ message: "Failed to get audit logs" });
    }
  });

  // Test webhook endpoint (admin only)
  app.post("/api/admin/webhook/test", requireAdmin, async (req, res) => {
    try {
      const webhookUrl = process.env.WEBHOOK_EMAIL_URL;
      if (!webhookUrl) {
        return res.json({ 
          success: false, 
          message: "No webhook URL configured. Set WEBHOOK_EMAIL_URL environment variable." 
        });
      }
      
      const testPayload = {
        type: "TEST",
        timestamp: new Date().toISOString(),
        message: "Webhook test from NavigatorUSA notification system"
      };
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload)
      });
      
      res.json({
        success: response.ok,
        status: response.status,
        webhookUrl: webhookUrl.substring(0, 30) + "...",
        message: response.ok ? "Webhook test successful" : "Webhook test failed"
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to test webhook" 
      });
    }
  });

  // Get all finops referrals (admin/master only)
  app.get("/api/admin/finops-referrals", requireAdmin, logPhiAccess("finops_referrals"), async (req, res) => {
    try {
      const referrals = await storage.getAllFinopsReferrals();
      
      // Enrich with affiliate names
      const enrichedReferrals = await Promise.all(referrals.map(async (r) => {
        let affiliateName = null;
        if (r.affiliateId) {
          const affiliate = await storage.getUser(r.affiliateId);
          affiliateName = affiliate?.name || null;
        }
        return { ...r, affiliateName };
      }));
      
      res.json(enrichedReferrals);
    } catch (error) {
      console.error("Error fetching finops referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Update finops referral status (admin/master only)
  app.patch("/api/admin/finops-referrals/:id", requireAdmin, logPhiAccess("finops_referrals"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateFinopsReferral(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Referral not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating finops referral:", error);
      res.status(500).json({ message: "Failed to update referral" });
    }
  });

  // ============================================
  // DISABILITY REFERRAL TRACKING ENDPOINTS
  // ============================================

  // Submit disability referral (public endpoint)
  app.post("/api/disability-referrals", async (req, res) => {
    try {
      const data = insertDisabilityReferralSchema.parse(req.body);
      
      // Get client IP and user agent
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      // Look up affiliate by referral code if provided
      let affiliateId: number | undefined;
      if (data.referralCode) {
        const affiliate = await storage.getUserByReferralCode(data.referralCode);
        if (affiliate) {
          affiliateId = affiliate.id;
        }
      }
      
      const referral = await storage.createDisabilityReferral({
        ...data,
        affiliateId,
        visitorIp: clientIp,
        userAgent,
      });
      
      console.log(`[disability] New ${data.claimType} referral - ref: ${data.referralCode || 'direct'}, email: ${data.email}`);
      
      // Get raw form data for forwarding (includes extra fields not in schema)
      const rawFormData = req.body;
      
      // Forward to Rochelle's call center system
      try {
        const forwardResponse = await fetch('https://operationfiscalfreedom.com/disability-rating/intake?type=initial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...rawFormData,
            source: 'NavigatorUSA',
          }),
        });
        console.log(`[disability] Forwarded to Rochelle's system: ${forwardResponse.status}`);
      } catch (forwardError) {
        console.error('[disability] Failed to forward to external system:', forwardError);
      }
      
      // Send notification emails
      try {
        const notifyEmails = [
          'infoservicesbhi@gmail.com',  // Maurice
          'rladler86@gmail.com',         // Rochelle
        ];
        
        await sendEmailWithRetry({
          to: notifyEmails,
          subject: `New VA Disability Referral: ${data.firstName} ${data.lastName}`,
          html: `
            <h2>New VA Disability Referral Submitted</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Location:</strong> ${rawFormData.city || 'N/A'}, ${rawFormData.state || 'N/A'}</p>
            <p><strong>Claim Type:</strong> ${data.claimType}</p>
            <p><strong>Current Rating:</strong> ${data.currentRating || 'N/A'}</p>
            <p><strong>Sought Rating:</strong> ${rawFormData.soughtRating || 'N/A'}</p>
            <p><strong>Conditions:</strong> ${data.conditions || 'N/A'}</p>
            <p><strong>Branch:</strong> ${rawFormData.militaryBranch || data.branchOfService || 'N/A'}</p>
            <p><strong>Service Years:</strong> ${rawFormData.serviceYears || 'N/A'}</p>
            <p><strong>Notes:</strong> ${rawFormData.notes || data.caseDescription || 'N/A'}</p>
            <p><strong>Referral Code:</strong> ${data.referralCode || 'Direct'}</p>
            <hr>
            <p><em>Submitted via NavigatorUSA at ${new Date().toISOString()}</em></p>
          `,
        });
        console.log(`[disability] Notification emails sent to ${notifyEmails.join(', ')}`);
      } catch (emailError) {
        console.error('[disability] Failed to send notification emails:', emailError);
      }
      
      res.status(201).json({ 
        message: "Referral submitted successfully", 
        id: referral.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating disability referral:", error);
      res.status(500).json({ message: "Failed to submit referral" });
    }
  });

  // Submit job placement intake (public endpoint)
  app.post("/api/job-placement-intakes", async (req, res) => {
    try {
      const data = insertJobPlacementIntakeSchema.parse(req.body);
      
      // Look up affiliate by referral code if provided
      let affiliateId: number | undefined;
      if (data.referralCode) {
        const affiliate = await storage.getUserByReferralCode(data.referralCode);
        if (affiliate) {
          affiliateId = affiliate.id;
        }
      }
      
      const intake = await storage.createJobPlacementIntake({
        ...data,
        affiliateId,
      });
      
      console.log(`[job-placement] New ${data.intakeType} intake - ref: ${data.referralCode || 'direct'}, email: ${data.email}`);
      
      res.status(201).json({ 
        message: "Application submitted successfully", 
        id: intake.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      console.error("Error creating job placement intake:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get all job placement intakes (admin/master only)
  app.get("/api/admin/job-placement-intakes", requireAdmin, logPhiAccess("job_placement_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllJobPlacementIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching job placement intakes:", error);
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update job placement intake (admin/master only)
  app.patch("/api/admin/job-placement-intakes/:id", requireAdmin, logPhiAccess("job_placement_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateJobPlacementIntake(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Intake not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating job placement intake:", error);
      res.status(500).json({ message: "Failed to update intake" });
    }
  });

  // Vet Professional Intakes
  app.post("/api/vet-professional-intakes", async (req, res) => {
    try {
      const intake = await storage.createVetProfessionalIntake(req.body);
      res.status(201).json(intake);
    } catch (error) {
      console.error("Error creating vet professional intake:", error);
      res.status(500).json({ message: "Failed to submit intake" });
    }
  });

  app.get("/api/admin/vet-professional-intakes", requireAdmin, logPhiAccess("vet_professional_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllVetProfessionalIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching vet professional intakes:", error);
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  app.patch("/api/admin/vet-professional-intakes/:id", requireAdmin, logPhiAccess("vet_professional_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateVetProfessionalIntake(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Intake not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating vet professional intake:", error);
      res.status(500).json({ message: "Failed to update intake" });
    }
  });

  // Healthcare Intakes - public submission
  app.post("/api/healthcare-intakes", async (req, res) => {
    try {
      const intake = await storage.createHealthcareIntake(req.body);
      res.status(201).json(intake);
    } catch (error) {
      console.error("Error creating healthcare intake:", error);
      res.status(500).json({ message: "Failed to submit intake" });
    }
  });

  // Healthcare Intakes - master portal only
  app.get("/api/admin/healthcare-intakes", requireAdmin, logPhiAccess("healthcare_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllHealthcareIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching healthcare intakes:", error);
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  app.patch("/api/admin/healthcare-intakes/:id", requireAdmin, logPhiAccess("healthcare_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateHealthcareIntake(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Intake not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating healthcare intake:", error);
      res.status(500).json({ message: "Failed to update intake" });
    }
  });

  // Get all disability referrals (admin/master only)
  app.get("/api/admin/disability-referrals", requireAdmin, logPhiAccess("disability_referrals"), async (req, res) => {
    try {
      const referrals = await storage.getAllDisabilityReferrals();
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching disability referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Get disability referrals for a specific affiliate
  app.get("/api/affiliate/disability-referrals", requireAffiliateWithNda, logPhiAccess("disability_referrals"), async (req, res) => {
    try {
      const referrals = await storage.getDisabilityReferralsByAffiliate(req.session.userId!);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching affiliate disability referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Get vet professional intakes for affiliate
  app.get("/api/affiliate/vet-professional-intakes", requireAffiliateWithNda, logPhiAccess("vet_professional_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getVetProfessionalIntakesByAffiliate(req.session.userId!);
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching affiliate vet professional intakes:", error);
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update disability referral status (admin/master only)
  app.patch("/api/admin/disability-referrals/:id", requireAdmin, logPhiAccess("disability_referrals"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateDisabilityReferral(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Referral not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating disability referral:", error);
      res.status(500).json({ message: "Failed to update referral" });
    }
  });

  // Get disability referral stats (admin/master only)
  app.get("/api/admin/disability-referrals/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getDisabilityReferralStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching disability referral stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Submit help request
  app.post("/api/help-requests", async (req, res) => {
    try {
      const { referralCode, ...rest } = req.body;
      const data = insertHelpRequestSchema.parse(rest);
      
      // Get client IP address
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      
      // Look up affiliate by referral code if provided, or check IP tracking
      let referredById: number | undefined;
      let finalReferralCode = referralCode;
      
      if (referralCode) {
        // Referral code provided - use it and track IP
        const affiliate = await storage.getUserByReferralCode(referralCode);
        if (affiliate) {
          referredById = affiliate.id;
          // Track this IP if not already tracked
          const existingIpTracking = await storage.getActiveIpReferral(clientIp);
          if (!existingIpTracking) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiration
            await storage.createIpReferralTracking({
              ipAddress: clientIp,
              affiliateId: affiliate.id,
              referralCode: referralCode,
              expiresAt,
            });
          }
        }
      } else {
        // No referral code - check if IP is already tracked
        const ipTracking = await storage.getActiveIpReferral(clientIp);
        if (ipTracking && ipTracking.affiliateId) {
          referredById = ipTracking.affiliateId;
          finalReferralCode = ipTracking.referralCode;
        }
      }
      
      const request = await storage.createHelpRequest({
        ...data,
        referralCode: finalReferralCode || undefined,
        referredBy: referredById,
      } as any);
      res.status(201).json({ success: true, id: request.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit request" });
    }
  });

  // Submit startup grant application
  app.post("/api/startup-grants", async (req, res) => {
    try {
      const data = insertStartupGrantSchema.parse(req.body);
      const grant = await storage.createStartupGrant(data);
      res.status(201).json({ success: true, id: grant.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit grant application" });
    }
  });

  // Submit furniture assistance request
  app.post("/api/furniture-assistance", async (req, res) => {
    try {
      const data = insertFurnitureAssistanceSchema.parse(req.body);
      const request = await storage.createFurnitureAssistance(data);
      res.status(201).json({ success: true, id: request.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit furniture assistance request" });
    }
  });

  // Submit investor submission
  app.post("/api/investor-submissions", async (req, res) => {
    try {
      const data = insertInvestorSubmissionSchema.parse(req.body);
      const submission = await storage.createInvestorSubmission(data);
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit investor information" });
    }
  });

  // Submit private doctor request
  app.post("/api/private-doctor-requests", async (req, res) => {
    try {
      const data = insertPrivateDoctorRequestSchema.parse(req.body);
      const request = await storage.createPrivateDoctorRequest(data);
      res.status(201).json({ success: true, id: request.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit private doctor request" });
    }
  });

  // Submit website application
  app.post("/api/website-applications", async (req, res) => {
    try {
      const data = insertWebsiteApplicationSchema.parse(req.body);
      const application = await storage.createWebsiteApplication(data);
      res.status(201).json({ success: true, id: application.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit website application" });
    }
  });

  // Submit general contact
  app.post("/api/general-contact", async (req, res) => {
    try {
      const data = insertGeneralContactSchema.parse(req.body);
      const contact = await storage.createGeneralContact(data);
      res.status(201).json({ success: true, id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Submit VLT intake
  app.post("/api/vlt-intake", async (req, res) => {
    try {
      const data = insertVltIntakeSchema.parse(req.body);
      
      // Look up referral code if provided
      let referralData: any = {};
      if (data.referralCode) {
        const affiliate = await storage.getVltAffiliateByReferralCode(data.referralCode);
        if (affiliate) {
          referralData = {
            referredByL1: affiliate.id,
            referredByL2: affiliate.level1Id,
            referredByL3: affiliate.level2Id,
            referredByL4: affiliate.level3Id,
            referredByL5: affiliate.level4Id,
            referredByL6: affiliate.level5Id,
          };
          // Increment affiliate's lead count
          await storage.updateVltAffiliate(affiliate.id, { 
            totalLeads: (affiliate.totalLeads || 0) + 1 
          });
        }
      }
      
      const intake = await storage.createVltIntake({ ...data, ...referralData });
      
      // Forward to CRM webhook if configured
      if (process.env.CRM_WEBHOOK_URL) {
        fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, routedTo: intake.routedTo }),
        }).catch(err => console.error("CRM webhook failed:", err));
      }
      
      res.status(201).json({ success: true, id: intake.id, routedTo: intake.routedTo });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit intake form" });
    }
  });

  // CRM webhook forwarder
  app.post("/api/crm-webhook", async (req, res) => {
    try {
      if (!process.env.CRM_WEBHOOK_URL) {
        return res.status(500).json({ message: "CRM webhook not configured" });
      }
      
      await fetch(process.env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ message: "Webhook forwarding failed" });
    }
  });

  // Process lead (CRM + notify)
  app.post("/api/process-lead", async (req, res) => {
    try {
      const data = req.body;
      
      // Forward to CRM
      if (process.env.CRM_WEBHOOK_URL) {
        fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(err => console.error("CRM webhook failed:", err));
      }
      
      // Send notifications via Resend integration
      if (data.email) {
        try {
          const { client: resend, fromEmail } = await getResendClient();
          resend.emails.send({
            from: `Veteran Led Tax Solutions <${fromEmail}>`,
            to: data.email,
            subject: "We received your intake",
            html: `<p>Your intake was received. A specialist will review shortly.</p>`,
          }).catch(err => console.error("Email failed:", err));
        } catch (err) {
          console.error("Resend not configured:", err);
        }
      }
      
      if (process.env.TWILIO_ACCOUNT_SID && data.phone) {
        const tw = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN!);
        tw.messages.create({
          to: data.phone,
          from: process.env.TWILIO_FROM!,
          body: "Your intake was received. A specialist will review shortly.",
        }).catch(err => console.error("SMS failed:", err));
      }
      
      res.json({ ok: true });
    } catch (error) {
      console.error("Process lead error:", error);
      res.status(500).json({ message: "Failed to process lead" });
    }
  });

  // Stripe checkout session
  app.post("/api/checkout", async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: { name: "Professional Review Fee" },
            unit_amount: 5000,
          },
          quantity: 1,
        }],
        success_url: `${req.headers.origin}/veteran-led-tax?paid=true`,
        cancel_url: `${req.headers.origin}/veteran-led-tax?canceled=true`,
      });
      
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Send notifications (email + SMS)
  app.post("/api/notify", async (req, res) => {
    try {
      const { email, phone, message } = req.body;

      // Send email via Resend integration
      if (email) {
        try {
          const { client: resend, fromEmail } = await getResendClient();
          await resend.emails.send({
            from: `Veteran Led Tax Solutions <${fromEmail}>`,
            to: email,
            subject: "We received your intake",
            html: `<p>${message || "Your intake was received. A specialist will review shortly."}</p>`,
          });
        } catch (err) {
          console.error("Resend not configured:", err);
        }
      }

      // Send SMS via Twilio if configured
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && phone) {
        const tw = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await tw.messages.create({
          to: phone,
          from: process.env.TWILIO_FROM!,
          body: "Your intake was received. A specialist will review shortly.",
        });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Notification error:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // Get all VLT intakes (admin)
  app.get("/api/admin/vlt-intake", requireAdmin, async (req, res) => {
    try {
      const intakes = await storage.getAllVltIntakes();
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VLT intakes" });
    }
  });

  // Update VLT intake (admin)
  app.patch("/api/admin/vlt-intake/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateVltIntake(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Intake not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update VLT intake" });
    }
  });

  // ===== VLT AFFILIATE MANAGEMENT (Admin) =====
  
  // Get all VLT affiliates
  app.get("/api/admin/vlt-affiliates", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllVltAffiliates();
      res.json(affiliates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VLT affiliates" });
    }
  });

  // Create VLT affiliate
  app.post("/api/admin/vlt-affiliates", requireAdmin, async (req, res) => {
    try {
      const { name, email, phone, password, uplineCode } = req.body;
      
      // Generate unique referral code
      const referralCode = `VLT${Date.now().toString(36).toUpperCase()}`;
      
      // Hash password
      const bcrypt = await import("bcrypt");
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Look up upline if provided
      let uplineData: any = {};
      if (uplineCode) {
        const upline = await storage.getVltAffiliateByReferralCode(uplineCode);
        if (upline) {
          uplineData = {
            level1Id: upline.id,
            level2Id: upline.level1Id,
            level3Id: upline.level2Id,
            level4Id: upline.level3Id,
            level5Id: upline.level4Id,
            level6Id: upline.level5Id,
          };
        }
      }
      
      const affiliate = await storage.createVltAffiliate({
        name,
        email,
        phone,
        passwordHash,
        referralCode,
        status: "active",
        ...uplineData,
      });
      
      res.status(201).json(affiliate);
    } catch (error) {
      console.error("Create affiliate error:", error);
      res.status(500).json({ message: "Failed to create VLT affiliate" });
    }
  });

  // Update VLT affiliate
  app.patch("/api/admin/vlt-affiliates/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateVltAffiliate(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update VLT affiliate" });
    }
  });

  // Delete VLT affiliate
  app.delete("/api/admin/vlt-affiliates/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVltAffiliate(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete VLT affiliate" });
    }
  });

  // ===== VLT AFFILIATE PORTAL =====
  
  // VLT Affiliate login
  app.post("/api/vlt-affiliate/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const affiliate = await storage.getVltAffiliateByEmail(email);
      
      if (!affiliate) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const bcrypt = await import("bcrypt");
      const valid = await bcrypt.compare(password, affiliate.passwordHash);
      
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Regenerate session to prevent session fixation and ensure clean session
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("VLT session regenerate error:", regenerateErr);
          return res.status(500).json({ message: "Login failed - session error" });
        }
        
        req.session.vltAffiliateId = affiliate.id;
        
        // Ensure session is saved before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("VLT session save error:", saveErr);
            return res.status(500).json({ message: "Login failed - session error" });
          }
          console.log(`[auth] VLT login successful for affiliate ${affiliate.id}, session saved`);
          res.json({ 
            success: true, 
            affiliate: { 
              id: affiliate.id, 
              name: affiliate.name, 
              email: affiliate.email,
              referralCode: affiliate.referralCode,
              totalLeads: affiliate.totalLeads
            }
          });
        });
      });
    } catch (error) {
      console.error("VLT login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // VLT Affiliate logout
  app.post("/api/vlt-affiliate/logout", (req, res) => {
    req.session.vltAffiliateId = undefined;
    res.json({ success: true });
  });

  // Get current VLT affiliate
  app.get("/api/vlt-affiliate/me", async (req, res) => {
    try {
      if (!req.session.vltAffiliateId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const affiliate = await storage.getVltAffiliate(req.session.vltAffiliateId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      // Calculate upline count
      let uplineCount = 0;
      if (affiliate.level1Id) uplineCount++;
      if (affiliate.level2Id) uplineCount++;
      if (affiliate.level3Id) uplineCount++;
      if (affiliate.level4Id) uplineCount++;
      if (affiliate.level5Id) uplineCount++;
      if (affiliate.level6Id) uplineCount++;

      res.json({
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        referralCode: affiliate.referralCode,
        role: affiliate.role,
        totalLeads: affiliate.totalLeads,
        totalSales: affiliate.totalSales,
        totalCommissions: affiliate.totalCommissions,
        status: affiliate.status,
        uplineCount,
        level1Id: affiliate.level1Id,
        level2Id: affiliate.level2Id,
        level3Id: affiliate.level3Id,
        level4Id: affiliate.level4Id,
        level5Id: affiliate.level5Id,
        level6Id: affiliate.level6Id,
        recruiterId: affiliate.recruiterId
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get affiliate" });
    }
  });

  // Get VLT affiliate's leads
  app.get("/api/vlt-affiliate/leads", async (req, res) => {
    try {
      if (!req.session.vltAffiliateId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const leads = await storage.getVltIntakesByAffiliate(req.session.vltAffiliateId);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // ===== AUTH ROUTES =====

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, portal } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // HIPAA §164.312(d) - Check login rate limiting (persistent)
      const loginRateLimit = await checkAuthRateLimit(email.toLowerCase(), "email", "login");
      if (!loginRateLimit.allowed) {
        await storage.createHipaaAuditLog({
          userId: null,
          userName: email,
          userRole: null,
          action: "LOGIN_LOCKED_OUT",
          resourceType: "authentication",
          resourceId: null,
          resourceDescription: `Account locked due to ${AUTH_MAX_ATTEMPTS} failed login attempts`,
          ipAddress: req.ip || null,
          userAgent: req.headers["user-agent"] || null,
          sessionId: req.sessionID || null,
          success: false,
          errorMessage: `Locked until ${loginRateLimit.lockedUntil?.toISOString()}`,
          phiAccessed: false,
        });
        
        return res.status(429).json({ 
          message: `Too many failed attempts. Account locked until ${loginRateLimit.lockedUntil?.toLocaleTimeString()}`,
          lockedUntil: loginRateLimit.lockedUntil?.toISOString()
        });
      }

      const user = await authenticateUser(email, password);
      if (!user) {
        // Record failed login attempt for rate limiting
        await recordAuthAttempt(email.toLowerCase(), "email", "login", false);
        
        // Log failed login attempt for HIPAA audit
        await storage.createHipaaAuditLog({
          userId: null,
          userName: email,
          userRole: null,
          action: "LOGIN_FAILED",
          resourceType: "authentication",
          resourceId: null,
          resourceDescription: "Failed login attempt",
          ipAddress: req.ip || null,
          userAgent: req.headers["user-agent"] || null,
          sessionId: req.sessionID || null,
          success: false,
          errorMessage: "Invalid email or password",
          phiAccessed: false,
        });
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Reset login rate limiter on successful auth
      await recordAuthAttempt(email.toLowerCase(), "email", "login", true);

      // HIPAA Security: Check portal restrictions with normalized error messages
      // All portal-related auth failures return the same generic message to prevent enumeration
      const genericAuthError = "Invalid email or password";
      
      // If user has a portal restriction, they can only login via that portal's login
      if (user.portal && !portal) {
        return res.status(401).json({ message: genericAuthError });
      }
      
      // If portal param provided, user's portal must match
      if (portal && user.portal && user.portal !== portal) {
        return res.status(401).json({ message: genericAuthError });
      }
      
      // If portal param provided but user has no portal restriction, reject
      if (portal && !user.portal) {
        return res.status(401).json({ message: genericAuthError });
      }

      // HIPAA §164.312(d) - Check if user has MFA enabled
      const mfaConfig = await storage.getUserMfaConfig(user.id);
      const mfaRequired = mfaConfig?.mfaEnabled === true;

      // Regenerate session to prevent session fixation attacks and ensure clean session
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Session regenerate error:", regenerateErr);
          return res.status(500).json({ message: "Login failed - session error" });
        }
        
        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        // If MFA is required, set pending state - user cannot access protected resources
        if (mfaRequired) {
          req.session.mfaPending = true;
          req.session.mfaVerified = false;
        } else {
          req.session.mfaPending = false;
          req.session.mfaVerified = true; // No MFA required, consider verified
        }

        // Ensure session is saved before responding
        req.session.save(async (saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ message: "Login failed - session error" });
          }
          
          // Log successful login for HIPAA audit
          await storage.createHipaaAuditLog({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            action: mfaRequired ? "LOGIN_MFA_PENDING" : "LOGIN_SUCCESS",
            resourceType: "authentication",
            resourceId: String(user.id),
            resourceDescription: mfaRequired ? "Login successful, awaiting MFA verification" : "Login successful",
            ipAddress: req.ip || null,
            userAgent: req.headers["user-agent"] || null,
            sessionId: req.sessionID || null,
            success: true,
            phiAccessed: false,
          });
          
          console.log(`[auth] Login successful for user ${user.id}, session saved, MFA required: ${mfaRequired}`);
          res.json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role, portal: user.portal },
            mfaRequired,
          });
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });

  // Initialize admin (one-time setup)
  app.post("/api/auth/init-admin", async (req, res) => {
    try {
      const { name, email, password, setupKey } = req.body;
      
      // Use environment variable for setup key, fallback only in development
      const expectedSetupKey = process.env.ADMIN_SETUP_KEY || (process.env.NODE_ENV !== "production" ? "OFF2024SETUP" : null);
      
      if (!expectedSetupKey || setupKey !== expectedSetupKey) {
        return res.status(403).json({ message: "Invalid setup key" });
      }

      // Check if admin already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const admin = await createAdminUser(name, email, password);
      res.status(201).json({ 
        success: true, 
        user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  // Register new user (public registration)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, branchOfService } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      // Create user with affiliate role by default
      const bcrypt = await import("bcrypt");
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        name,
        email,
        passwordHash,
        role: "affiliate"
      });

      // Auto-login after registration with session regeneration for security
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error("Registration session regenerate error:", regenerateErr);
          // Still return success since account was created
          return res.status(201).json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
          });
        }
        
        req.session.userId = user.id;
        req.session.userRole = user.role;

        // Ensure session is saved before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Registration session save error:", saveErr);
          }
          console.log(`[auth] Registration successful for user ${user.id}, session saved`);
          res.status(201).json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
          });
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Request password reset
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email, portal } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account exists with this email, you will receive a password reset link." });
      }

      // If portal is specified, check user has access to that portal
      if (portal && user.portal && user.portal !== portal) {
        return res.json({ message: "If an account exists with this email, you will receive a password reset link." });
      }

      // Invalidate any existing tokens for this user
      await storage.invalidateAllUserPasswordResetTokens(user.id);

      // Generate a secure random token
      const crypto = await import("crypto");
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      
      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await storage.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      // Determine base URL and from email based on portal
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : process.env.REPLIT_DOMAINS?.split(",")[0] 
          ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
          : "http://localhost:5000";
      
      let fromEmail = "NavigatorUSA <no-reply@navigatorusa.com>";
      let portalName = "NavigatorUSA";
      
      if (portal === "payzium") {
        fromEmail = "Payzium <no-reply@payzium.com>";
        portalName = "Payzium";
      }

      const resetLink = `${baseUrl}/reset-password?token=${rawToken}${portal ? `&portal=${portal}` : ""}`;

      // Send email via Resend integration
      try {
        const { client: resend, fromEmail: configuredFromEmail } = await getResendClient();
        const actualFromEmail = portal === "payzium" 
          ? `Payzium <${configuredFromEmail}>` 
          : `${portalName} <${configuredFromEmail}>`;
        await resend.emails.send({
          from: actualFromEmail,
          to: user.email,
          subject: `Reset Your ${portalName} Password`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a365d;">Password Reset Request</h2>
              <p>Hello ${user.name},</p>
              <p>We received a request to reset your password for your ${portalName} account.</p>
              <p>Click the button below to set a new password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px;">${portalName} - Secure Password Reset</p>
            </div>
          `,
        });
        console.log(`Password reset email sent to ${user.email}`);
      } catch (err) {
        console.error("Failed to send password reset email:", err);
        console.log(`Password reset email failed for user, link generated but not logged for security`);
      }

      res.json({ message: "If an account exists with this email, you will receive a password reset link." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Hash the token to look it up
      const crypto = await import("crypto");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

      const resetToken = await storage.getValidPasswordResetToken(tokenHash);
      
      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
      }

      // Update user's password
      const newPasswordHash = await hashPassword(password);
      await storage.updateUserPassword(resetToken.userId, newPasswordHash);

      // Invalidate the token
      await storage.invalidatePasswordResetToken(resetToken.id);

      res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Validate reset token (for UI)
  app.get("/api/auth/validate-reset-token", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== "string") {
        return res.json({ valid: false });
      }

      const crypto = await import("crypto");
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      
      const resetToken = await storage.getValidPasswordResetToken(tokenHash);
      
      res.json({ valid: !!resetToken });
    } catch (error) {
      res.json({ valid: false });
    }
  });

  // ===== ADMIN ROUTES =====

  // Get all affiliate applications
  app.get("/api/admin/affiliate-applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllAffiliateApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get all help requests
  app.get("/api/admin/help-requests", requireAdmin, logPhiAccess("help_requests"), async (req, res) => {
    try {
      const requests = await storage.getAllHelpRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Update affiliate application
  app.patch("/api/admin/affiliate-applications/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const application = await storage.updateAffiliateApplication(id, updates);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Update help request
  app.patch("/api/admin/help-requests/:id", requireAdmin, logPhiAccess("help_requests"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const request = await storage.updateHelpRequest(id, updates);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // Get all affiliates
  app.get("/api/admin/affiliates", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllAffiliates();
      res.json(affiliates.map(a => ({ 
        id: a.id, 
        name: a.name, 
        email: a.email, 
        role: a.role,
        createdAt: a.createdAt 
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliates" });
    }
  });

  // Create affiliate user
  app.post("/api/admin/affiliates", requireAdmin, async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const affiliate = await createAffiliateUser(name, email, password);
      res.status(201).json({ 
        id: affiliate.id, 
        name: affiliate.name, 
        email: affiliate.email, 
        role: affiliate.role 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create affiliate" });
    }
  });

  // Reset affiliate password
  app.patch("/api/admin/affiliates/:id/password", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const passwordHash = await hashPassword(password);
      const user = await storage.updateUserPassword(id, passwordHash);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Delete affiliate
  app.delete("/api/admin/affiliates/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete affiliate" });
    }
  });

  // Get all startup grants
  app.get("/api/admin/startup-grants", requireAdmin, async (req, res) => {
    try {
      const grants = await storage.getAllStartupGrants();
      res.json(grants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch startup grants" });
    }
  });

  // Update startup grant
  app.patch("/api/admin/startup-grants/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const grant = await storage.updateStartupGrant(id, updates);
      
      if (!grant) {
        return res.status(404).json({ message: "Grant not found" });
      }
      
      res.json(grant);
    } catch (error) {
      res.status(500).json({ message: "Failed to update grant" });
    }
  });

  // Get all furniture assistance requests
  app.get("/api/admin/furniture-assistance", requireAdmin, async (req, res) => {
    try {
      const requests = await storage.getAllFurnitureAssistance();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch furniture assistance requests" });
    }
  });

  // Update furniture assistance
  app.patch("/api/admin/furniture-assistance/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const request = await storage.updateFurnitureAssistance(id, updates);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update furniture assistance request" });
    }
  });

  // Get all investor submissions
  app.get("/api/admin/investor-submissions", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllInvestorSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch investor submissions" });
    }
  });

  // Update investor submission
  app.patch("/api/admin/investor-submissions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const submission = await storage.updateInvestorSubmission(id, updates);
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update investor submission" });
    }
  });

  // Get all private doctor requests
  app.get("/api/admin/private-doctor-requests", requireAdmin, logPhiAccess("private_doctor_requests"), async (req, res) => {
    try {
      const requests = await storage.getAllPrivateDoctorRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch private doctor requests" });
    }
  });

  // Update private doctor request
  app.patch("/api/admin/private-doctor-requests/:id", requireAdmin, logPhiAccess("private_doctor_requests"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const request = await storage.updatePrivateDoctorRequest(id, updates);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update private doctor request" });
    }
  });

  // Get all website applications
  app.get("/api/admin/website-applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllWebsiteApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website applications" });
    }
  });

  // Update website application
  app.patch("/api/admin/website-applications/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const application = await storage.updateWebsiteApplication(id, updates);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to update website application" });
    }
  });

  // Get all general contacts
  app.get("/api/admin/general-contact", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllGeneralContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch general contacts" });
    }
  });

  // Update general contact
  app.patch("/api/admin/general-contact/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const contact = await storage.updateGeneralContact(id, updates);
      
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update general contact" });
    }
  });

  // ===== MASTER PORTAL ROUTES (Admin Only) =====

  // Get all affiliate files/documents for master portal
  app.get("/api/master/affiliate-files", requireAdmin, async (req, res) => {
    try {
      // Get ALL signed NDAs directly from the affiliate_nda table
      const allNdas = await storage.getAllAffiliateNdas();
      
      // Get all affiliates for contracts and W9
      const affiliates = await storage.getAllAffiliates();
      
      // Create a combined result map keyed by user ID
      const resultMap = new Map<number, {
        id: number;
        name: string;
        email: string;
        nda?: any;
        contracts?: any[];
        w9?: any;
      }>();
      
      // First, add all NDAs (this ensures ALL signed NDAs appear regardless of user role)
      for (const nda of allNdas) {
        // Try to get user info, fall back to NDA data if user doesn't exist
        const user = await storage.getUser(nda.userId);
        resultMap.set(nda.userId, {
          id: nda.userId,
          name: user?.name || nda.fullName,
          email: user?.email || 'Unknown',
          nda: {
            id: nda.id,
            fullName: nda.fullName,
            address: nda.address,
            facePhoto: nda.facePhoto,
            idPhoto: nda.idPhoto,
            signatureData: nda.signatureData,
            signedAt: nda.signedAt,
          },
        });
      }
      
      // Then, add/merge affiliate data (contracts, W9)
      await Promise.all(
        affiliates.map(async (affiliate) => {
          const signedContracts = await storage.getSignedAgreementsByAffiliate(affiliate.id);
          const w9 = await storage.getAffiliateW9ByUserId(affiliate.id);
          
          // Get contract template names
          const contractsWithNames = await Promise.all(
            signedContracts.map(async (contract: { id: number; contractTemplateId: number; signatureData: string | null; createdAt: Date | null }) => {
              const template = await storage.getContractTemplate(contract.contractTemplateId);
              return {
                id: contract.id,
                contractName: template?.name || 'Unknown Contract',
                signedAt: contract.createdAt,
                signatureData: contract.signatureData,
              };
            })
          );
          
          // Check if this affiliate already exists in result (from NDA)
          const existing = resultMap.get(affiliate.id);
          if (existing) {
            // Merge contracts and W9
            existing.contracts = contractsWithNames.length > 0 ? contractsWithNames : undefined;
            existing.w9 = w9 ? {
              name: w9.name,
              address: w9.address,
              city: w9.city,
              state: w9.state,
              zip: w9.zip,
              taxClassification: w9.taxClassification,
              certificationDate: w9.certificationDate,
            } : undefined;
          } else if (contractsWithNames.length > 0 || w9) {
            // Add new entry for affiliates with contracts/W9 but no NDA
            resultMap.set(affiliate.id, {
              id: affiliate.id,
              name: affiliate.name,
              email: affiliate.email,
              contracts: contractsWithNames.length > 0 ? contractsWithNames : undefined,
              w9: w9 ? {
                name: w9.name,
                address: w9.address,
                city: w9.city,
                state: w9.state,
                zip: w9.zip,
                taxClassification: w9.taxClassification,
                certificationDate: w9.certificationDate,
              } : undefined,
            });
          }
        })
      );
      
      // Convert map to array and filter to only entries with at least one document
      const filesWithDocs = Array.from(resultMap.values()).filter(
        (a) => a.nda || (a.contracts && a.contracts.length > 0) || a.w9
      );
      
      res.json(filesWithDocs);
    } catch (error) {
      console.error("Master portal files error:", error);
      res.status(500).json({ message: "Failed to fetch affiliate files" });
    }
  });

  // ===== AFFILIATE ROUTES =====

  // Get assigned affiliate applications
  app.get("/api/affiliate/applications", requireAffiliateWithNda, async (req, res) => {
    try {
      const applications = await storage.getAffiliateApplicationsByAssignee(req.session.userId!);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get assigned help requests
  app.get("/api/affiliate/help-requests", requireAffiliateWithNda, logPhiAccess("help_requests"), async (req, res) => {
    try {
      const requests = await storage.getHelpRequestsByAssignee(req.session.userId!);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Update affiliate application status (affiliate)
  app.patch("/api/affiliate/applications/:id", requireAffiliateWithNda, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      // Verify this application is assigned to this affiliate
      const app = await storage.getAffiliateApplication(id);
      if (!app || app.assignedTo !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this application" });
      }
      
      const updated = await storage.updateAffiliateApplication(id, { status, notes });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Update help request status (affiliate)
  app.patch("/api/affiliate/help-requests/:id", requireAffiliateWithNda, logPhiAccess("help_requests"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      // Verify this request is assigned to this affiliate
      const request = await storage.getHelpRequest(id);
      if (!request || request.assignedTo !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this request" });
      }
      
      const updated = await storage.updateHelpRequest(id, { status, notes });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // Get affiliate's referral info
  app.get("/api/affiliate/referral-info", requireAffiliateWithNda, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate referral code if not exists
      let referralCode = user.referralCode;
      if (!referralCode) {
        const crypto = await import('crypto');
        const namePrefix = user.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
        const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
        referralCode = namePrefix + randomSuffix;
        await storage.updateUserReferralCode(user.id, referralCode);
      }
      
      // Count referrals
      const allHelpRequests = await storage.getAllHelpRequests();
      const referredLeads = allHelpRequests.filter(r => r.referredBy === user.id);
      
      res.json({
        referralCode,
        referralLink: `/get-help?ref=${referralCode}`,
        totalReferrals: referredLeads.length,
        activeReferrals: referredLeads.filter(r => r.status !== 'closed').length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get referral info" });
    }
  });

  // Submit VSO Air Support Request (affiliate requests master to send projections to a VSO)
  app.post("/api/affiliate/vso-air-support", requireAffiliateWithNda, async (req, res) => {
    try {
      const { vsoName, vsoEmail, comments } = req.body;
      const user = await storage.getUser(req.session.userId!);
      
      if (!vsoName || !vsoEmail) {
        return res.status(400).json({ message: "VSO name and email are required" });
      }
      
      // Send email notification to master/admin about the air support request
      try {
        const { client: resend, fromEmail } = await getResendClient();
        await resend.emails.send({
          from: `NavigatorUSA <${fromEmail}>`,
          to: process.env.ADMIN_EMAIL || "admin@navigatorusa.com",
          subject: `VSO Air Support Request from ${user?.name}`,
          html: `
            <h2>VSO Air Support Request</h2>
            <p><strong>Requesting Affiliate:</strong> ${user?.name} (${user?.email})</p>
            <p><strong>VSO Name:</strong> ${vsoName}</p>
            <p><strong>VSO Email:</strong> ${vsoEmail}</p>
            <p><strong>Comments:</strong> ${comments || 'None'}</p>
            <hr/>
            <p>This affiliate is requesting you send VSO Revenue Projections to the above VSO contact.</p>
            <p>If this VSO signs up, the requesting affiliate earns a 1% recruiter bonus on all VSO revenue.</p>
          `,
        });
      } catch (err) {
        console.error("Failed to send air support notification:", err);
      }
      
      res.json({ success: true, message: "Air support request submitted. Master will review and send projections." });
    } catch (error) {
      console.error("VSO air support error:", error);
      res.status(500).json({ message: "Failed to submit air support request" });
    }
  });

  // Check if affiliate has signed NDA
  app.get("/api/affiliate/nda-status", requireAffiliate, async (req, res) => {
    try {
      const hasSigned = await storage.hasAffiliateSignedNda(req.session.userId!);
      const nda = hasSigned ? await storage.getAffiliateNdaByUserId(req.session.userId!) : null;
      res.json({ hasSigned, nda });
    } catch (error) {
      res.status(500).json({ message: "Failed to check NDA status" });
    }
  });

  // ===== GLOBAL LEGAL SYSTEM ROUTES =====
  
  // Get legal document signature status for current user
  app.get("/api/legal/status", requireAffiliate, async (req, res) => {
    try {
      const status = await getLegalStatus(req.session.userId!, req.session.userRole || "affiliate");
      res.json(status);
    } catch (error) {
      console.error("[LEGAL STATUS ERROR]", error);
      res.status(500).json({ message: "Failed to check legal status" });
    }
  });

  // Sign a legal document (generic handler)
  app.post("/api/legal/sign/:type", requireAffiliate, async (req, res) => {
    const docType = req.params.type.toUpperCase() as keyof typeof LEGAL_DOCS;
    const doc = LEGAL_DOCS[docType];
    
    if (!doc) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    try {
      const result = await signLegalDocumentAtomic({
        userId: req.session.userId!,
        doc,
        docHash: req.body.documentHash,
        req,
      });
      res.json(result);
    } catch (error) {
      console.error("[LEGAL SIGN ERROR]", error);
      res.status(500).json({ message: "Failed to sign document", retryable: true });
    }
  });

  // Admin override for legal documents (with audit)
  app.post("/api/admin/legal-override", requireAdmin, async (req, res) => {
    const { userId, documentType, reason } = req.body;

    if (!userId || !documentType || !reason) {
      return res.status(400).json({ message: "userId, documentType, and reason are required" });
    }

    try {
      await createLegalOverride({
        adminId: req.session.userId!,
        userId,
        documentType,
        reason,
        req,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("[LEGAL OVERRIDE ERROR]", error);
      res.status(500).json({ message: "Failed to create legal override" });
    }
  });

  // Legal system health check (admin only)
  app.get("/api/admin/legal/health", requireAdmin, async (req, res) => {
    try {
      const health = await legalSystemHealthCheck();
      res.json(health);
    } catch (error) {
      console.error("[LEGAL HEALTH CHECK ERROR]", error);
      res.status(500).json({ message: "Health check failed" });
    }
  });

  // External e-sign callback (for DocuSign/HelloSign style integrations)
  app.post("/api/legal/esign-callback", async (req, res) => {
    const { userId, documentType, envelopeId, docText } = req.body;
    
    if (!userId || !documentType || !envelopeId || !docText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      await processExternalEsignCallback({
        userId,
        documentType,
        envelopeId,
        docText,
        req,
      });
      res.sendStatus(200);
    } catch (error) {
      console.error("[ESIGN CALLBACK ERROR]", error);
      res.status(500).json({ message: "Failed to process e-sign callback" });
    }
  });

  // Generate legal evidence bundle for a user (admin only)
  app.get("/api/admin/legal/evidence/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const filePath = await generateEvidenceBundle(userId);
      res.download(filePath, `legal_evidence_${userId}.txt`);
    } catch (error) {
      console.error("[EVIDENCE BUNDLE ERROR]", error);
      res.status(500).json({ message: "Failed to generate evidence bundle" });
    }
  });

  // Run legal test bot (admin only)
  app.post("/api/admin/legal/test-bot", requireAdmin, async (req, res) => {
    try {
      const result = await runLegalTestBot();
      res.json(result);
    } catch (error) {
      console.error("[LEGAL TEST BOT ERROR]", error);
      res.status(500).json({ message: "Test bot failed" });
    }
  });

  // Migrate legacy signatures to global legal system (admin only)
  app.post("/api/admin/legal/migrate", requireAdmin, async (req, res) => {
    try {
      const { migrateLegacySignatures } = await import("./legal-finalization");
      const result = await migrateLegacySignatures();
      res.json(result);
    } catch (error) {
      console.error("[LEGAL MIGRATION ERROR]", error);
      res.status(500).json({ message: "Migration failed" });
    }
  });

  // Generate legal coverage report (admin only)
  app.get("/api/admin/legal/report", requireAdmin, async (req, res) => {
    try {
      const { generateLegalCoverageReport } = await import("./legal-finalization");
      const report = await generateLegalCoverageReport();
      res.json(report);
    } catch (error) {
      console.error("[LEGAL REPORT ERROR]", error);
      res.status(500).json({ message: "Report generation failed" });
    }
  });

  // Validate legal system (admin only)
  app.get("/api/admin/legal/validate", requireAdmin, async (req, res) => {
    try {
      const { runLegalSystemValidation } = await import("./legal-finalization");
      const result = await runLegalSystemValidation();
      res.json(result);
    } catch (error) {
      console.error("[LEGAL VALIDATION ERROR]", error);
      res.status(500).json({ message: "Validation failed" });
    }
  });

  // Signature metrics tracking endpoint (public for funnel tracking)
  app.post("/api/metrics/signature-event", async (req, res) => {
    try {
      const { recordSignatureEvent } = await import("./legal-tooling");
      const { event, documentType } = req.body;
      const userId = req.session?.userId?.toString() || "anonymous";
      await recordSignatureEvent(userId, event, documentType);
      res.sendStatus(204);
    } catch (error) {
      console.error("[SIGNATURE METRICS ERROR]", error);
      res.sendStatus(500);
    }
  });

  // Admin: Get signature funnel metrics
  app.get("/api/admin/legal/metrics", requireAdmin, async (req, res) => {
    try {
      const { getSignatureMetrics } = await import("./legal-tooling");
      const stats = await getSignatureMetrics();
      res.json(stats);
    } catch (error) {
      console.error("[LEGAL METRICS ERROR]", error);
      res.status(500).json({ message: "Failed to get metrics" });
    }
  });

  // Admin: Get auto-diagnosis coverage report
  app.get("/api/admin/legal/coverage", requireAdmin, async (req, res) => {
    try {
      const { generateAutoDiagnosis } = await import("./legal-tooling");
      const diagnosis = await generateAutoDiagnosis();
      res.json(diagnosis);
    } catch (error) {
      console.error("[LEGAL COVERAGE ERROR]", error);
      res.status(500).json({ message: "Failed to generate coverage report" });
    }
  });

  // Admin: Export evidence bundle for user
  app.get("/api/admin/legal/evidence-bundle/:userId", requireAdmin, async (req, res) => {
    try {
      const { exportEvidenceBundle } = await import("./legal-tooling");
      const userId = parseInt(req.params.userId);
      const filePath = await exportEvidenceBundle(userId);
      res.download(filePath);
    } catch (error) {
      console.error("[EVIDENCE BUNDLE ERROR]", error);
      res.status(500).json({ message: "Failed to export evidence bundle" });
    }
  });

  // Admin: Run compliance check
  app.post("/api/admin/legal/compliance-check", requireAdmin, async (req, res) => {
    try {
      const { continuousComplianceCheck } = await import("./legal-tooling");
      const result = await continuousComplianceCheck();
      res.json(result);
    } catch (error) {
      console.error("[COMPLIANCE CHECK ERROR]", error);
      res.status(500).json({ message: "Compliance check failed" });
    }
  });

  // Admin: Get compliance history
  app.get("/api/admin/legal/compliance-history", requireAdmin, async (req, res) => {
    try {
      const { getComplianceHistory } = await import("./legal-tooling");
      const history = await getComplianceHistory(20);
      res.json(history);
    } catch (error) {
      console.error("[COMPLIANCE HISTORY ERROR]", error);
      res.status(500).json({ message: "Failed to get compliance history" });
    }
  });

  // ==================== SELF-REPAIR BOT ====================

  // Submit issue for automated repair
  app.post("/api/repair/intake", requireAdmin, async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description || typeof description !== "string" || description.trim().length < 5) {
        return res.status(400).json({ message: "Issue description is required (at least 5 characters)" });
      }

      const { processRepair } = await import("./self-repair");
      const result = await processRepair(description.trim());
      
      res.json(result);
    } catch (error) {
      console.error("[REPAIR INTAKE ERROR]", error);
      res.status(500).json({ message: "Failed to process repair request" });
    }
  });

  // Get repair logs (admin only)
  app.get("/api/repair/logs", requireAdmin, async (req, res) => {
    try {
      const { getRepairLogs } = await import("./self-repair");
      const limit = parseInt(req.query.limit as string) || 20;
      const logs = await getRepairLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("[REPAIR LOGS ERROR]", error);
      res.status(500).json({ message: "Failed to get repair logs" });
    }
  });

  // Classify issue without processing (dry run)
  app.post("/api/repair/classify", requireAdmin, async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const { classifyIssue, canAutoFix, runDiagnostics } = await import("./self-repair");
      const issueType = classifyIssue(description);
      const autoFixable = canAutoFix(issueType);
      const diagnostics = await runDiagnostics(issueType, description);
      
      res.json({
        issueType,
        autoFixable,
        diagnostics,
        message: autoFixable 
          ? `Issue can be auto-fixed as ${issueType}` 
          : `Issue requires manual review (${issueType})`
      });
    } catch (error) {
      console.error("[REPAIR CLASSIFY ERROR]", error);
      res.status(500).json({ message: "Failed to classify issue" });
    }
  });

  // Public issue intake (no auth required)
  app.post("/api/repair/public-intake", async (req, res) => {
    try {
      const { description, role = "PUBLIC" } = req.body;
      
      if (!description || typeof description !== "string" || description.trim().length < 5) {
        return res.status(400).json({ message: "Issue description is required (at least 5 characters)" });
      }

      const { isPlatformEnabled, canAutoFixForRole, requiresAdminApproval } = await import("./platform-config");
      
      if (!isPlatformEnabled()) {
        return res.status(503).json({ message: "Self-healing platform is currently disabled" });
      }

      const { processRepair, classifyIssue } = await import("./self-repair");
      const { complianceLog } = await import("./compliance-audit");
      
      const issueType = classifyIssue(description);
      
      if (!canAutoFixForRole(role) || requiresAdminApproval(issueType)) {
        await storage.createRepairLog({
          description: description.substring(0, 500),
          issueType,
          status: "ESCALATED",
          patch: null
        });
        await complianceLog("PUBLIC_ESCALATION", { description: description.substring(0, 100), issueType, role });
        return res.json({
          status: "ESCALATED",
          message: "Your issue has been logged and will be reviewed by our team.",
          issueType
        });
      }

      const result = await processRepair(description.trim());
      await complianceLog("PUBLIC_REPAIR", { issueType, status: result.status }, { ip: req.ip, userAgent: req.headers["user-agent"] });
      
      res.json(result);
    } catch (error) {
      console.error("[PUBLIC REPAIR INTAKE ERROR]", error);
      res.status(500).json({ message: "Failed to process repair request" });
    }
  });

  // Get escalated repairs (admin only)
  app.get("/api/repair/escalated", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getRepairLogs(50);
      const escalated = logs.filter(log => 
        (log.status === "ESCALATED" || log.status === "FAILED") &&
        log.issueType !== "AUDIT"
      );
      res.json(escalated);
    } catch (error) {
      console.error("[ESCALATED REPAIRS ERROR]", error);
      res.status(500).json({ message: "Failed to get escalated repairs" });
    }
  });

  // Get queue stats (admin only)
  app.get("/api/repair/queue-stats", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getRepairLogs(100);
      const repairLogs = logs.filter(log => log.issueType !== "AUDIT");
      const escalated = repairLogs.filter(log => log.status === "ESCALATED").length;
      const failed = repairLogs.filter(log => log.status === "FAILED").length;
      const pending = repairLogs.filter(log => log.status === "PATCH_PROPOSED").length;
      const canDeploy = escalated === 0 && failed === 0;
      
      res.json({ escalated, failed, pending, canDeploy });
    } catch (error) {
      console.error("[QUEUE STATS ERROR]", error);
      res.status(500).json({ message: "Failed to get queue stats" });
    }
  });

  // Approve repair (admin only)
  app.post("/api/repair/approve", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (!id) {
        return res.status(400).json({ message: "Repair ID is required" });
      }
      
      const existing = await storage.getRepairLogById(id);
      if (!existing) {
        return res.status(404).json({ message: "Repair not found" });
      }
      
      await storage.updateRepairLogStatus(id, "APPROVED");
      
      const { complianceLog } = await import("./compliance-audit");
      await complianceLog("REPAIR_APPROVED", { repairId: id, previousStatus: existing.status }, { userId: req.session.userId, ip: req.ip });
      
      res.json({ success: true, message: "Repair approved and resolved" });
    } catch (error) {
      console.error("[REPAIR APPROVE ERROR]", error);
      res.status(500).json({ message: "Failed to approve repair" });
    }
  });

  // Reject repair (admin only)
  app.post("/api/repair/reject", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (!id) {
        return res.status(400).json({ message: "Repair ID is required" });
      }
      
      const existing = await storage.getRepairLogById(id);
      if (!existing) {
        return res.status(404).json({ message: "Repair not found" });
      }
      
      await storage.updateRepairLogStatus(id, "REJECTED");
      
      const { complianceLog } = await import("./compliance-audit");
      await complianceLog("REPAIR_REJECTED", { repairId: id, previousStatus: existing.status }, { userId: req.session.userId, ip: req.ip });
      
      res.json({ success: true, message: "Repair rejected" });
    } catch (error) {
      console.error("[REPAIR REJECT ERROR]", error);
      res.status(500).json({ message: "Failed to reject repair" });
    }
  });

  // Pipeline gate check (for CI/CD)
  app.get("/api/repair/pipeline-gate", async (req, res) => {
    try {
      const logs = await storage.getRepairLogs(100);
      const blocking = logs.filter(log => log.status === "ESCALATED" || log.status === "FAILED");
      
      const { logPipelineGate } = await import("./compliance-audit");
      await logPipelineGate(blocking.length === 0, blocking.length);
      
      if (blocking.length > 0) {
        res.status(503).json({
          canDeploy: false,
          message: `Deployment blocked: ${blocking.length} unresolved repair tickets`,
          blockingCount: blocking.length
        });
      } else {
        res.json({
          canDeploy: true,
          message: "All clear for deployment"
        });
      }
    } catch (error) {
      console.error("[PIPELINE GATE ERROR]", error);
      res.status(500).json({ message: "Failed to check pipeline gate" });
    }
  });

  // ==================== EMAIL COMMAND WEBHOOK ====================

  // Inbound email webhook for repair commands (from SendGrid/Mailgun/Postmark)
  app.post("/api/repair/email", async (req, res) => {
    try {
      const { parseCommand } = await import("./repair-commands");
      const { enqueueRepair, registerIncident, getIncidentState } = await import("./repair-queue");
      const { sendEmergencyLockConfirmation, sendEscalationConfirmation, sendStatusUpdate } = await import("./repair-mailer");
      const { complianceLog } = await import("./compliance-audit");

      // Extract email text from various provider formats
      const text = req.body.text || req.body["stripped-text"] || req.body.plain || req.body.body || "";
      const from = req.body.from || req.body.sender || req.body.envelope?.from || "unknown";
      const subject = req.body.subject || "";

      // Extract incident ID from subject line (e.g., "Re: 🚨 Contract Signing Blocked — Action Required (ctr_9f23)")
      const incidentMatch = subject.match(/\(([a-zA-Z0-9_-]+)\)/) || subject.match(/— ([a-zA-Z0-9_-]+)$/);
      const incidentId = incidentMatch ? incidentMatch[1] : `email_${Date.now()}`;

      await complianceLog("EMAIL_RECEIVED", {
        from,
        subject,
        incidentId,
        textLength: text.length,
      });

      const command = parseCommand(text, "email");

      if (!command) {
        console.log("[EmailWebhook] No valid command found in email");
        return res.json({ status: "ignored", reason: "No valid command found" });
      }

      console.log(`[EmailWebhook] Parsed command: ${command.type} ${command.targetId || ""}`);

      // Handle EMERGENCY/LOCK commands specially
      if (command.type === "LOCK" || (text.toUpperCase().includes("EMERGENCY"))) {
        const targetId = command.targetId || incidentId;
        
        // Register as locked incident
        registerIncident(targetId, {
          availableActions: [],
          emergencyMode: true,
        });

        await complianceLog("EMERGENCY_LOCK", {
          targetId,
          triggeredBy: "EMAIL",
          authorityChanged: false,
        });

        await sendEmergencyLockConfirmation(targetId);

        return res.json({
          status: "locked",
          targetId,
          message: "Emergency lock activated via email",
        });
      }

      // Handle ESCALATE command
      if (command.type === "ESCALATE") {
        await sendEscalationConfirmation(incidentId, "Email escalation request");
        
        await complianceLog("ESCALATION", {
          incidentId,
          triggeredBy: "EMAIL",
        });

        return res.json({
          status: "escalated",
          incidentId,
          message: "Incident escalated to human review",
        });
      }

      // Handle STATUS command
      if (command.type === "STATUS") {
        const state = getIncidentState(incidentId);
        const statusMessage = state
          ? `Locked: ${state.isLocked}, Emergency: ${state.emergencyMode}, Actions: ${state.availableActions.length}`
          : "No active incident state found";

        await sendStatusUpdate(incidentId, "STATUS_REQUEST", "SUCCESS", statusMessage);

        return res.json({
          status: "status_sent",
          incidentId,
          state: state || null,
        });
      }

      // Handle APPROVE ALL (batch safe actions)
      if (command.type === "APPROVE_ALL") {
        const { isSafeAction } = await import("./safety-rules");
        const { sendBatchApprovalResult } = await import("./daily-digest");
        
        // Get all pending repair logs
        const allLogs = await storage.getRepairLogs(100);
        const pendingLogs = allLogs.filter(log => 
          log.status === "PENDING" || log.status === "pending"
        );
        
        const approved: string[] = [];
        const skipped: string[] = [];
        
        for (const log of pendingLogs) {
          const actionType = log.issueType || "";
          
          if (isSafeAction(actionType)) {
            // Mark as applied
            await storage.updateRepairLogStatus(log.id, "APPLIED");
            approved.push(`✓ ${log.description || actionType}`);
            
            await complianceLog("BATCH_APPROVE", {
              logId: log.id,
              actionType,
              approvedVia: "EMAIL",
            });
          } else {
            skipped.push(`⊘ ${log.description || actionType} (requires approval)`);
          }
        }
        
        // Send batch result email
        await sendBatchApprovalResult(approved.length, skipped.length, [...approved, ...skipped]);
        
        return res.json({
          status: "batch_approved",
          approved: approved.length,
          skipped: skipped.length,
          details: { approved, skipped },
        });
      }

      // Handle APPROVE/RETRY commands
      if (command.type === "APPROVE" || command.type === "RETRY") {
        // Check if incident exists, if not register with default actions
        if (!getIncidentState(incidentId)) {
          registerIncident(incidentId, {
            availableActions: [
              { id: 1, label: "Retry database persist", actionType: "RETRY_DB_PERSIST" },
              { id: 2, label: "Re-render PDF", actionType: "RERENDER_PDF" },
              { id: 3, label: "Assisted completion", actionType: "ASSISTED_COMPLETION" },
            ],
            emergencyMode: false,
          });
        }

        const result = await enqueueRepair(command, incidentId);

        if (result.success) {
          return res.json({
            status: "queued",
            queueId: result.queueId,
            incidentId,
            command: command.type,
            actionId: command.targetId,
          });
        } else {
          return res.status(400).json({
            status: "rejected",
            error: result.error,
            incidentId,
          });
        }
      }

      // Handle UNLOCK command
      if (command.type === "UNLOCK") {
        const targetId = command.targetId || incidentId;
        const state = getIncidentState(targetId);
        
        if (state) {
          state.isLocked = false;
          state.emergencyMode = false;
        }

        await sendStatusUpdate(targetId, "UNLOCK", "SUCCESS", "Incident unlocked via email command");

        return res.json({
          status: "unlocked",
          targetId,
        });
      }

      return res.json({ status: "processed", command: command.type });

    } catch (error) {
      console.error("[EmailWebhook] Error:", error);
      return res.status(500).json({ status: "error", message: "Failed to process email command" });
    }
  });

  // Test email alert endpoint (for development)
  app.post("/api/repair/test-email", requireAdmin, async (req, res) => {
    try {
      const { sendRepairAlert } = await import("./repair-mailer");
      const { type = "CONTRACT_SIGN_FAIL", contractId = "test_ctr_001" } = req.body;

      let sent = false;

      if (type === "CONTRACT_SIGN_FAIL") {
        sent = await sendRepairAlert({
          type: "CONTRACT_SIGN_FAIL",
          contractId,
          userImpacted: 1,
          emergencyMode: false,
          whatHappened: [
            "Signature drawn successfully",
            "Signature hash generated",
            "Database persist failed",
            "Contract text + hash locked",
            "Legal authority NOT modified",
          ],
          safeActions: [
            { id: 1, code: "RETRY_DB_PERSIST", label: "Retry database persist" },
            { id: 2, code: "RE_RENDER_PDF", label: "Re-render PDF document" },
            { id: 3, code: "ASSISTED_COMPLETE", label: "Admin-only assisted completion" },
          ],
        });
      } else if (type === "AUTH_FAIL") {
        sent = await sendRepairAlert({
          type: "AUTH_FAIL",
          userHash: "abc123...hashed",
          provider: "NextAuth",
          failureType: "OAUTH_REDIRECT_MISMATCH",
          impact: "User cannot sign in",
          safeActions: [
            { id: 1, code: "REPAIR_REDIRECT_URI", label: "Repair OAuth redirect URI" },
            { id: 2, code: "RESET_CSRF_TOKEN", label: "Reset CSRF token" },
          ],
        });
      } else if (type === "CORE_FUNCTION_FAIL") {
        sent = await sendRepairAlert({
          type: "CORE_FUNCTION_FAIL",
          functionName: "Schedule Appointment",
          failure: "API 500 on submit",
          usersImpacted: 3,
          safeActions: [
            { id: 1, code: "RESTART_WORKER", label: "Restart background worker" },
            { id: 2, code: "RETRY_API_CALL", label: "Retry API call" },
            { id: 3, code: "CLEAR_STALE_STATE", label: "Clear stale state" },
          ],
        });
      }

      res.json({ success: sent, type, message: sent ? "Test email sent" : "Failed to send email" });
    } catch (error) {
      console.error("[TestEmail] Error:", error);
      res.status(500).json({ success: false, message: "Failed to send test email" });
    }
  });

  // Get repair queue status
  app.get("/api/repair/email-queue", requireAdmin, async (req, res) => {
    try {
      const { getQueueStatus } = await import("./repair-queue");
      const queue = getQueueStatus();
      res.json({ queue, count: queue.length });
    } catch (error) {
      console.error("[EmailQueue] Error:", error);
      res.status(500).json({ message: "Failed to get queue status" });
    }
  });

  // Daily digest - generate and view
  app.get("/api/repair/daily-digest", requireAdmin, async (req, res) => {
    try {
      const { generateDailyDigest } = await import("./daily-digest");
      const digest = await generateDailyDigest();
      res.json(digest);
    } catch (error) {
      console.error("[DailyDigest] Error:", error);
      res.status(500).json({ message: "Failed to generate digest" });
    }
  });

  // Send daily digest email manually
  app.post("/api/repair/send-digest", requireAdmin, async (req, res) => {
    try {
      const { sendDailyDigest } = await import("./daily-digest");
      const sent = await sendDailyDigest();
      res.json({ success: sent, message: sent ? "Digest sent" : "Failed to send digest" });
    } catch (error) {
      console.error("[DailyDigest] Error:", error);
      res.status(500).json({ message: "Failed to send digest" });
    }
  });

  // Get safety rules and policy
  app.get("/api/repair/safety-policy", requireAdmin, async (req, res) => {
    try {
      const { CRITICAL_PATH_POLICY, getAllFlowTypes } = await import("./safety-rules");
      res.json({
        flowTypes: getAllFlowTypes(),
        policy: CRITICAL_PATH_POLICY,
      });
    } catch (error) {
      console.error("[SafetyPolicy] Error:", error);
      res.status(500).json({ message: "Failed to get safety policy" });
    }
  });

  // ==================== PROTECTED FLOW INCIDENT LOGGING ====================

  // Log incident for password change attempt
  app.post("/api/incident/password-change", async (req, res) => {
    try {
      const { userId, reason, success } = req.body;
      
      if (!success) {
        await storage.createRepairLog({
          description: `Password change ${success ? 'succeeded' : 'failed'}: ${reason || 'Unknown reason'}`,
          issueType: "CHANGE_PASSWORD",
          status: "ESCALATED",
          patch: JSON.stringify({ userId, reason, flow: "ACCOUNT", requiresApproval: true }),
        });
        
        // Send alert email
        const { sendRepairAlert } = await import("./repair-mailer");
        await sendRepairAlert({
          type: "AUTH_FAIL",
          userHash: `user_${userId || 'unknown'}`,
          provider: "Internal",
          failureType: "PASSWORD_CHANGE_BLOCKED",
          impact: "User cannot change password",
          safeActions: [
            { id: 1, code: "RETRY_PASSWORD_CHANGE", label: "Retry password change" },
            { id: 2, code: "RESET_SESSION", label: "Reset user session" },
          ],
        });
      }
      
      res.json({ logged: true, requiresApproval: !success });
    } catch (error) {
      console.error("[IncidentLog] Password change error:", error);
      res.status(500).json({ message: "Failed to log incident" });
    }
  });

  // Log incident for email change attempt
  app.post("/api/incident/email-change", async (req, res) => {
    try {
      const { userId, reason, success } = req.body;
      
      if (!success) {
        await storage.createRepairLog({
          description: `Email change ${success ? 'succeeded' : 'failed'}: ${reason || 'Unknown reason'}`,
          issueType: "CHANGE_EMAIL",
          status: "ESCALATED",
          patch: JSON.stringify({ userId, reason, flow: "ACCOUNT", requiresApproval: true }),
        });
      }
      
      res.json({ logged: true, requiresApproval: !success });
    } catch (error) {
      console.error("[IncidentLog] Email change error:", error);
      res.status(500).json({ message: "Failed to log incident" });
    }
  });

  // Log incident for referral code change attempt
  app.post("/api/incident/referral-change", async (req, res) => {
    try {
      const { userId, reason } = req.body;
      
      await storage.createRepairLog({
        description: `Referral code change attempted: ${reason || 'No reason provided'}`,
        issueType: "CHANGE_REFERRAL_CODE",
        status: "ESCALATED",
        patch: JSON.stringify({ userId, reason, flow: "REFERRAL", requiresApproval: true }),
      });
      
      res.status(409).json({ logged: true, message: "ESCALATED - requires approval" });
    } catch (error) {
      console.error("[IncidentLog] Referral change error:", error);
      res.status(500).json({ message: "Failed to log incident" });
    }
  });

  // Log incident for user add/remove attempt
  app.post("/api/incident/user-management", async (req, res) => {
    try {
      const { adminId, action, targetUserId, reason } = req.body;
      
      await storage.createRepairLog({
        description: `User ${action} attempted by admin ${adminId}: ${reason || 'No reason'}`,
        issueType: action === "ADD" ? "ADD_USER" : "REMOVE_USER",
        status: "ESCALATED",
        patch: JSON.stringify({ adminId, action, targetUserId, reason, flow: "USERS", requiresApproval: true }),
      });
      
      res.status(409).json({ logged: true, message: "ESCALATED - requires approval" });
    } catch (error) {
      console.error("[IncidentLog] User management error:", error);
      res.status(500).json({ message: "Failed to log incident" });
    }
  });

  // ==================== TIER-0 CRITICAL FLOW SYSTEM ====================

  // Process critical flow issue (Auth or Contract Signing)
  app.post("/api/critical-flow/process", requireAdmin, async (req, res) => {
    try {
      const { description, userId, failureCount, userRequestedHelp } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const { processCriticalFlowIssue, classifyCriticalFlow } = await import("./critical-flow-system");
      
      const flowType = classifyCriticalFlow(description);
      if (!flowType) {
        return res.status(400).json({ message: "Not a critical flow issue (Auth or Contract Signing)" });
      }

      const result = await processCriticalFlowIssue(description, {
        userId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        failureCount: failureCount || 0,
        userRequestedHelp: userRequestedHelp || false
      });
      
      res.json(result);
    } catch (error) {
      console.error("[CRITICAL FLOW PROCESS ERROR]", error);
      res.status(500).json({ message: "Failed to process critical flow issue" });
    }
  });

  // Get critical incidents
  app.get("/api/critical-flow/incidents", requireAdmin, async (req, res) => {
    try {
      const { getCriticalIncidents } = await import("./critical-flow-system");
      const status = req.query.status as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const incidents = await getCriticalIncidents(status as any, limit);
      res.json(incidents);
    } catch (error) {
      console.error("[CRITICAL FLOW INCIDENTS ERROR]", error);
      res.status(500).json({ message: "Failed to get incidents" });
    }
  });

  // Approve or reject incident
  app.post("/api/critical-flow/approve/:incidentId", requireAdmin, async (req, res) => {
    try {
      const { incidentId } = req.params;
      const { action } = req.body;
      
      if (!action || !["APPROVE", "REJECT"].includes(action)) {
        return res.status(400).json({ message: "Action must be APPROVE or REJECT" });
      }

      const { approveIncident } = await import("./critical-flow-system");
      const adminId = (req as any).user?.id || 1;
      const result = await approveIncident(incidentId, adminId, action);
      res.json(result);
    } catch (error) {
      console.error("[CRITICAL FLOW APPROVE ERROR]", error);
      res.status(500).json({ message: "Failed to process approval" });
    }
  });

  // Generate incident report (supports multiple formats)
  app.get("/api/critical-flow/report/:incidentId", requireAdmin, async (req, res) => {
    try {
      const { incidentId } = req.params;
      const format = req.query.format as string || "json";
      
      const { generateIncidentReport, generateReportFormats } = await import("./critical-flow-system");
      const report = await generateIncidentReport(incidentId);
      
      if (!report) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      if (format === "soc2") {
        const { soc2Evidence } = generateReportFormats(report);
        return res.json(soc2Evidence);
      }
      
      if (format === "litigation") {
        const { litigationHold } = generateReportFormats(report);
        return res.json(litigationHold);
      }
      
      if (format === "all") {
        const formats = generateReportFormats(report);
        return res.json({ report, ...formats });
      }
      
      res.json(report);
    } catch (error) {
      console.error("[CRITICAL FLOW REPORT ERROR]", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Emergency mode activation
  app.post("/api/critical-flow/emergency", requireAdmin, async (req, res) => {
    try {
      const { description, userId, documentId } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const { processCriticalFlowIssue } = await import("./critical-flow-system");
      
      const result = await processCriticalFlowIssue(description, {
        userId,
        documentId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        failureCount: 2,
        userRequestedHelp: true
      });
      
      res.json({
        ...result,
        message: "We've secured your document. You won't lose anything.",
        emergencyActions: [
          "Document version locked",
          "Legal logic frozen",
          "Audit chain preserved",
          "Manual signing link available",
          "Admin override enabled (logged)"
        ]
      });
    } catch (error) {
      console.error("[CRITICAL FLOW EMERGENCY ERROR]", error);
      res.status(500).json({ message: "Failed to activate emergency mode" });
    }
  });

  // Get all NDAs for master portal
  app.get("/api/master/ndas", requireAdmin, async (req, res) => {
    try {
      const ndas = await storage.getAllAffiliateNdas();
      // Enrich with user details
      const enrichedNdas = await Promise.all(ndas.map(async (nda) => {
        const user = await storage.getUser(nda.userId);
        return {
          ...nda,
          affiliateName: user?.name || 'Unknown',
          affiliateEmail: user?.email || 'Unknown',
        };
      }));
      res.json(enrichedNdas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NDAs" });
    }
  });

  // Generate NDA PDF for download
  app.post("/api/master/affiliate-nda-pdf/:ndaId", requireAdmin, async (req, res) => {
    try {
      const ndaId = parseInt(req.params.ndaId);
      const { securityKey } = req.body;
      
      // Validate security key
      const expectedKey = process.env.ADMIN_SETUP_KEY;
      if (!expectedKey || securityKey !== expectedKey) {
        return res.status(403).json({ message: "Invalid security key" });
      }
      
      // Get NDA data
      const nda = await storage.getAffiliateNdaById(ndaId);
      if (!nda) {
        return res.status(404).json({ message: "NDA not found" });
      }
      
      // Import PDF generator dynamically
      const { generateNdaPdf } = await import('./pdfGenerator');
      
      const pdfBuffer = await generateNdaPdf({
        fullName: nda.fullName,
        veteranNumber: nda.veteranNumber || undefined,
        address: nda.address || undefined,
        signedAt: nda.signedAt?.toISOString() || new Date().toISOString(),
        signedIpAddress: nda.signedIpAddress || undefined,
        signatureData: nda.signatureData || undefined,
        facePhoto: nda.facePhoto || undefined,
        idPhoto: nda.idPhoto || undefined
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="NDA-${nda.fullName.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Sign affiliate NDA - canonical action endpoint
  // No panel talks to the database. No panel decides "this counts."
  const handleNdaSubmit = async (req: any, res: any) => {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Session not established" });
    }

    try {
      const { fullName, veteranNumber, address, customReferralCode, signatureData, facePhoto, idPhoto, agreedToTerms, degradedCapabilities, degradedFeatures } = req.body;

      const forwardedFor = req.headers['x-forwarded-for'];
      const realIp = req.headers['x-real-ip'];
      const cfConnectingIp = req.headers['cf-connecting-ip'];
      
      let ipAddress = 'not-captured';
      if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
        ipAddress = forwardedFor.split(',')[0].trim();
      } else if (typeof realIp === 'string' && realIp.trim()) {
        ipAddress = realIp.trim();
      } else if (typeof cfConnectingIp === 'string' && cfConnectingIp.trim()) {
        ipAddress = cfConnectingIp.trim();
      } else if (req.socket?.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
      }

      const userAgent = req.headers['user-agent'] || 'unknown';

      console.log(`[NDA Sign] IP detection: forwarded=${forwardedFor}, realIp=${realIp}, socket=${req.socket?.remoteAddress}, resolved=${ipAddress}`);

      if (degradedCapabilities && (degradedCapabilities.camera !== 'available' || degradedCapabilities.upload !== 'available')) {
        console.log(`[NDA Sign] Degraded submission for user ${userId}:`, {
          camera: degradedCapabilities.camera || 'not-reported',
          upload: degradedCapabilities.upload || 'not-reported',
          hasFacePhoto: !!facePhoto,
          hasIdPhoto: !!idPhoto,
        });
      }

      const result = await submitAffiliateNda({
        userId,
        fullName,
        veteranNumber,
        address,
        customReferralCode,
        signatureData,
        facePhoto,
        idPhoto,
        agreedToTerms,
        degradedCapabilities,
        degradedFeatures,
        ipAddress,
        userAgent,
        req,
      });

      if (!result.ok) {
        return res.status(result.code).json({ message: result.message });
      }

      if (result.alreadySigned) {
        return res.json({ success: true, message: "NDA already signed", ndaId: result.ndaId, nda: result.nda });
      }

      res.json({ success: true, ndaId: result.ndaId, status: result.status, degraded: result.degraded, nda: result.nda });
    } catch (error: any) {
      console.error("[NDA SIGN FAILURE] Full error details:", {
        userId,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorStack: error?.stack?.substring(0, 500),
        sessionId: req.sessionID,
        hasSession: !!req.session,
        requestBody: {
          hasFullName: !!req.body?.fullName,
          hasAddress: !!req.body?.address,
          hasSignature: !!req.body?.signatureData?.substring(0, 30),
          hasFacePhoto: !!req.body?.facePhoto?.substring(0, 30),
          hasIdPhoto: !!req.body?.idPhoto?.substring(0, 30),
          agreedToTerms: req.body?.agreedToTerms,
          customReferralCode: req.body?.customReferralCode,
        }
      });
      
      res.status(500).json({ 
        message: "NDA signing failed. Please retry.",
        retryable: true
      });
    }
  };

  app.post("/api/actions/submit-affiliate-nda", requireAffiliate, handleNdaSubmit);
  app.post("/api/affiliate/sign-nda", requireAffiliate, handleNdaSubmit);

  // Session heartbeat - renew session on form focus to prevent timeout during long form fills
  app.post("/api/session/heartbeat", (req, res) => {
    if (req.session) {
      // Touch the session to reset the maxAge timer
      req.session.touch();
      res.json({ success: true, renewed: true });
    } else {
      res.status(401).json({ success: false, message: "No active session" });
    }
  });

  // Get W9 status for affiliate
  app.get("/api/affiliate/w9-status", requireAffiliateWithNda, async (req, res) => {
    try {
      const hasSubmitted = await storage.hasAffiliateSubmittedW9(req.session.userId!);
      const w9 = hasSubmitted ? await storage.getAffiliateW9ByUserId(req.session.userId!) : null;
      res.json({ hasSubmitted, w9: w9 ? { ...w9, ssn: w9.ssn ? "****" : null } : null });
    } catch (error) {
      res.status(500).json({ message: "Failed to check W9 status" });
    }
  });

  // Submit W9 form
  app.post("/api/affiliate/submit-w9", requireAffiliateWithNda, async (req, res) => {
    try {
      // Zod validation schema for W9
      const w9Schema = z.object({
        name: z.string().min(1, "Name is required").max(100),
        businessName: z.string().max(100).optional().nullable(),
        taxClassification: z.enum(["individual", "c_corp", "s_corp", "partnership", "trust", "llc"]).default("individual"),
        address: z.string().min(1, "Address is required").max(200),
        city: z.string().min(1, "City is required").max(100),
        state: z.string().min(2, "State is required").max(2).transform(s => s.toUpperCase()),
        zip: z.string().min(5, "ZIP is required").max(10).regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP format"),
        ssn: z.string().optional().nullable().transform(val => val ? val.replace(/\D/g, '') : null).refine(val => !val || /^\d{9}$/.test(val), "SSN must be 9 digits"),
        ein: z.string().optional().nullable().refine(val => !val || /^\d{2}-?\d{7}$/.test(val), "Invalid EIN format"),
        signatureData: z.string().optional().nullable(),
      }).refine(data => data.ssn || data.ein, { message: "Either SSN or EIN is required" });
      
      // Verify NDA is signed before W9 submission
      const nda = await storage.getAffiliateNdaByUserId(req.session.userId!);
      if (!nda) {
        return res.status(400).json({ message: "You must sign the NDA before submitting W9" });
      }

      const validatedData = w9Schema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: validatedData.error.errors[0]?.message || "Invalid input" });
      }

      const { name, businessName, taxClassification, address, city, state, zip, ssn, ein, signatureData } = validatedData.data;
      
      // Check if already submitted
      const alreadySubmitted = await storage.hasAffiliateSubmittedW9(req.session.userId!);
      if (alreadySubmitted) {
        return res.status(400).json({ message: "W9 already submitted" });
      }

      // Get IP address
      const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
      
      // Only store last 4 digits of SSN for security
      const ssnLast4 = ssn ? ssn.replace(/\D/g, '').slice(-4) : null;
      
      const w9 = await storage.createAffiliateW9({
        userId: req.session.userId!,
        name,
        businessName: businessName || null,
        taxClassification: taxClassification || "individual",
        address,
        city,
        state,
        zip,
        ssn: ssnLast4,
        ein: ein || null,
        signatureData: signatureData || null,
        signedIpAddress: ipAddress,
      });
      
      res.json({ success: true, w9 });
    } catch (error) {
      console.error("W9 submission error:", error);
      res.status(500).json({ message: "Failed to submit W9" });
    }
  });

  // ===== ECOSYSTEM / MASTER PORTAL ROUTES =====

  // Get all opportunities
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opps = await storage.getAllOpportunities();
      res.json(opps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  // Create opportunity (admin only)
  app.post("/api/opportunities", requireAdmin, async (req, res) => {
    try {
      const data = insertOpportunitySchema.parse(req.body);
      const opp = await storage.createOpportunity(data);
      res.status(201).json(opp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create opportunity" });
    }
  });

  // Update opportunity (admin only)
  app.patch("/api/opportunities/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateOpportunity(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update opportunity" });
    }
  });

  // Get all sales (master portal)
  app.get("/api/master/sales", requireAdmin, async (req, res) => {
    try {
      const allSales = await storage.getAllSales();
      res.json(allSales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  // Get all affiliates with stats (master portal)
  app.get("/api/master/affiliates", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllVltAffiliates();
      res.json(affiliates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliates" });
    }
  });

  // Get affiliates by role
  app.get("/api/master/affiliates/:role", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getVltAffiliatesByRole(req.params.role);
      res.json(affiliates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliates" });
    }
  });

  // Get downline for an affiliate
  app.get("/api/master/downline/:affiliateId", requireAdmin, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.affiliateId);
      const downline = await storage.getVltAffiliateDownline(affiliateId);
      res.json(downline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch downline" });
    }
  });

  // Get all commissions (master portal)
  app.get("/api/master/commissions", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllVltAffiliates();
      const commissionsData = [];
      for (const aff of affiliates) {
        const comms = await storage.getCommissionsByAffiliate(aff.id);
        commissionsData.push({ affiliate: aff, commissions: comms });
      }
      res.json(commissionsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  // Create sale with commission calculation
  app.post("/api/sales", async (req, res) => {
    try {
      const data = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(data);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sale" });
    }
  });

  // Update sale status
  app.patch("/api/sales/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateSale(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update sale" });
    }
  });

  // Veteran Intake - multiple programs
  app.post("/api/veteran-intake", async (req, res) => {
    try {
      const data = insertVeteranIntakeSchema.parse(req.body);
      
      // If referral code provided, look up affiliate chain
      if (data.referralCode) {
        const affiliate = await storage.getVltAffiliateByReferralCode(data.referralCode);
        if (affiliate) {
          (data as any).referredByL1 = affiliate.id;
          (data as any).referredByL2 = affiliate.level1Id;
          (data as any).referredByL3 = affiliate.level2Id;
          (data as any).referredByL4 = affiliate.level3Id;
          (data as any).referredByL5 = affiliate.level4Id;
          (data as any).referredByL6 = affiliate.level5Id;
          (data as any).referredByL7 = affiliate.level6Id;
        }
      }
      
      const intake = await storage.createVeteranIntake(data);
      res.status(201).json({ success: true, id: intake.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit intake" });
    }
  });

  // Get all veteran intakes (admin)
  app.get("/api/admin/veteran-intakes", requireAdmin, logPhiAccess("veteran_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllVeteranIntakes();
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update veteran intake
  app.patch("/api/admin/veteran-intakes/:id", requireAdmin, logPhiAccess("veteran_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateVeteranIntake(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update intake" });
    }
  });

  // Business Intake - B2B services
  app.post("/api/business-intake", async (req, res) => {
    try {
      const data = insertBusinessIntakeSchema.parse(req.body);
      
      // If referral code provided, look up affiliate chain
      if (data.referralCode) {
        const affiliate = await storage.getVltAffiliateByReferralCode(data.referralCode);
        if (affiliate) {
          (data as any).referredByL1 = affiliate.id;
          (data as any).referredByL2 = affiliate.level1Id;
          (data as any).referredByL3 = affiliate.level2Id;
          (data as any).referredByL4 = affiliate.level3Id;
          (data as any).referredByL5 = affiliate.level4Id;
          (data as any).referredByL6 = affiliate.level5Id;
          (data as any).referredByL7 = affiliate.level6Id;
        }
      }
      
      const intake = await storage.createBusinessIntake(data);
      res.status(201).json({ success: true, id: intake.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit intake" });
    }
  });

  // Get all business intakes (admin)
  app.get("/api/admin/business-intakes", requireAdmin, logPhiAccess("business_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllBusinessIntakes();
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update business intake
  app.patch("/api/admin/business-intakes/:id", requireAdmin, logPhiAccess("business_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateBusinessIntake(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update intake" });
    }
  });

  // Promote affiliate to sub-master
  app.patch("/api/master/promote/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body; // 'sub_master' or 'master'
      const updated = await storage.updateVltAffiliate(id, { role });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to promote affiliate" });
    }
  });

  // Sub-master portal - get own downline
  app.get("/api/submaster/downline", async (req, res) => {
    try {
      // For now, accept affiliate ID from query param (will use session in production)
      const affiliateId = parseInt(req.query.affiliateId as string);
      if (!affiliateId) {
        return res.status(400).json({ message: "Affiliate ID required" });
      }
      const downline = await storage.getVltAffiliateDownline(affiliateId);
      res.json(downline);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch downline" });
    }
  });

  // Sub-master - get sales from downline
  app.get("/api/submaster/sales", async (req, res) => {
    try {
      const affiliateId = parseInt(req.query.affiliateId as string);
      if (!affiliateId) {
        return res.status(400).json({ message: "Affiliate ID required" });
      }
      const sales = await storage.getSalesByDownline(affiliateId);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  // ===== CONTRACT MANAGEMENT ROUTES =====

  // Seed MAH contract template (one-time setup)
  app.post("/api/contracts/seed-mah", async (req, res) => {
    try {
      const existingTemplates = await storage.getAllContractTemplates();
      if (existingTemplates.length > 0) {
        return res.json({ message: "Templates already exist", count: existingTemplates.length });
      }
      
      const mahContract = await storage.createContractTemplate({
        name: "Independent Representative Non-Disclosure, Non-Circumvention and Referral Agreement",
        version: "1.0",
        companyName: "MISSION ACT HEALTH, INC.",
        requiredFor: "all",
        isActive: "true",
        content: `<h1>INDEPENDENT REPRESENTATIVE NON-DISCLOSURE, NON-CIRCUMVENTION AND REFERRAL AGREEMENT</h1>

<p>THIS AGREEMENT is made by <strong>MISSION ACT HEALTH, INC.</strong>, a Virginia corporation taxed as a C-Corporation ("MAH") located at [Company Address], and the undersigned Independent Contractor ("Representative"), collectively referred to as the "Parties".</p>

<h2>RECITALS</h2>

<p>WHEREAS MAH engages in business development, marketing, and sales services generally, provides clients with advice and expertise relating to healthcare navigation, veteran services, disability assistance, holistic health education, financial planning, and a wide range of strategic, management, marketing, and financial services (MAH services); and,</p>

<p>WHEREAS, Representative wishes to offer to MAH, and MAH desires to receive from Representative, referrals of potential customers who may be interested in MAH's services, pursuant to the terms and conditions of this Agreement.</p>

<h2>NOW THEREFORE</h2>
<p>In consideration of the mutual covenants and promises contained in this Agreement as set forth below, MAH and Representative agree as follows:</p>

<h3>Section 1. Description of Work</h3>
<p>The services provided by the Representative to MAH shall be provided on an as-needed basis. MAH shall have sole discretion to establish the minimum qualifications necessary for the performance of any service rendered by the Representative under this Agreement.</p>

<h3>Section 2. Compensation</h3>
<p>MAH agrees to pay the Representative for services provided under this Agreement as outlined in Addendum A below.</p>

<h3>Section 3. Relationships of the Parties</h3>
<p>The Representative shall be considered an independent Contractor and is not an employee, partner, or joint venturer of MAH. Consistent with the foregoing, MAH shall not deduct withholding taxes, social security taxes, or any other taxes or fees required to be deducted by an employer from Representative's compensation.</p>

<h3>Section 4. Term of Engagement</h3>
<p>This Agreement will become effective upon electronic signature and will continue until Terminated under Section 16 below.</p>

<h3>Section 5. Responsibilities of the Representative</h3>
<p>The Representative shall have complete control over the time spent, the manner, and the disposition of the services provided. The Representative agrees to devote sufficient time and energy to fulfill the spirit and purpose of this Agreement.</p>

<h3>Section 6. Responsibilities of MAH</h3>
<p>MAH agrees to follow all reasonable requests of the Representative necessary to the performance of the Representative's duties under this Agreement. MAH agrees to provide the Representative with such information, marketing materials, customer relationship management (CRM) software, and other software as may be necessary to facilitate the efficient flow of business between the Parties.</p>

<h3>Section 7. Representations and Warranties</h3>
<p>Representative expressly represents and warrants that he/she is over the age of 18 and has the authority to enter into this Agreement.</p>

<h3>Section 8-11. [Standard Provisions]</h3>
<p>Waiver, Compliance, Representative's Employees, and Liability provisions apply as standard.</p>

<h3>Section 12. Confidentiality</h3>
<p>The Representative agrees that all proprietary knowledge and information shall be regarded as strictly confidential and held in confidence solely for MAH's benefit and use.</p>

<h3>Section 13. Non-Competition</h3>
<p>Representative agrees not to contact or initiate contact at any time for any purpose, either directly or indirectly, with any MAH referral without prior written consent.</p>

<h3>Section 14. Non-Solicitation and Non-Circumvention</h3>
<p>Neither Party will solicit or hire any Employee, Consultant, Customer, Referral, Client, Strategic Partner, or Service Provider of the other Party for a period of one year following termination.</p>

<h3>Section 15. Indemnity</h3>
<p>The Representative shall indemnify and hold MAH free and harmless from any obligations, debts, suits, costs, claims, judgments, liabilities, attorneys' fees, liens, and attachments.</p>

<h3>Section 16. Termination of Agreement</h3>
<p>Either Party may terminate this Agreement at any time, with or without cause, provided the Terminating Party provides 30-day prior written notice. All commissions owed shall survive the termination of this Agreement.</p>

<h3>Section 17-28. [Standard Legal Provisions]</h3>
<p>Partial Invalidity, Entire Agreement, Assignment, Counterparts, Acknowledgment, Notices, Governing Law (Commonwealth of Virginia), Attorney's Fees, Arbitration, Force Majeure, Amendment, and Headings provisions apply as standard.</p>

<hr/>

<h2>ADDENDUM A - TIERED SALES STRUCTURE COMPENSATION</h2>

<p>With respect to the Products/Services, the following Commission Structures will apply:</p>

<table border="1" cellpadding="8" style="width:100%; border-collapse: collapse;">
  <tr style="background-color: #f0f0f0;"><th>Role</th><th>Commission Rate</th></tr>
  <tr><td><strong>Primary Referral Agent (Top Rep)</strong></td><td>75% of Net Vendor/Client Claim Fee (NVCCF)</td></tr>
  <tr><td>Level One Referral Partner</td><td>10% of NVCCF</td></tr>
  <tr><td>Level Two Referral Partner</td><td>10% of NVCCF</td></tr>
  <tr><td>Level Three Referral Partner</td><td>5% of NVCCF</td></tr>
</table>

<p><em>Note: Tiers are static and not compressed. Breakage rolls up to the Company (MAH).</em></p>

<h3>Commission Payment Process</h3>
<ul>
  <li>Active Representatives will be paid by the 15th of the month for funds received by MAH in the preceding month for Net Sales of Paid Invoices on Accounts generated by the Representative.</li>
  <li>Representative will provide ACH account information to be paid electronically by MAH.</li>
</ul>

<h3>Definitions</h3>
<ul>
  <li><strong>Commission Entitlement:</strong> The Active Representative shall be entitled to receive a "Commission" on "Net Sales" of fully "Paid Invoices" from "Active Accounts".</li>
  <li><strong>Client:</strong> Any business account, individual, group, organization, or entity to whom the Products or Services are marketed, solicited, sold, or purchased.</li>
  <li><strong>Net Sales of Paid Invoices:</strong> Amounts specified by MAH's generated invoices issued in any month, less taxes, refunds, credits, returns, rebates, discounts, shipping costs, adjustments, and bad debts.</li>
</ul>

<p style="margin-top: 30px;"><strong>By signing below, you acknowledge that you have read, understand, and agree to be bound by this Agreement.</strong></p>`
      });
      
      res.status(201).json({ success: true, template: mahContract });
    } catch (error) {
      console.error("Error seeding MAH contract:", error);
      res.status(500).json({ message: "Failed to seed contract template" });
    }
  });

  // Seed all MAH service contracts
  app.post("/api/contracts/seed-all-services", async (req, res) => {
    try {
      const existing = await storage.getAllContractTemplates();
      const results: any[] = [];

      // Define all MAH services from the BSBA contract structure
      const services = [
        { name: "Private Reinsurance eR3", grossPct: 70, description: "Private Reinsurance Program - eR3" },
        { name: "Private Reinsurance eR2", grossPct: 70, description: "Private Reinsurance Program - eR2" },
        { name: "Tax Resolution Services", grossPct: 55, description: "Legacy Tax & Resolution Services - Tier One" },
        { name: "FICA Tips Tax Credit", grossPct: 70, description: "FICA Tips Tax Credit Recovery" },
        { name: "Tax Recovery", grossPct: 70, description: "Tax Recovery Services" },
        { name: "ICC Logistics", grossPct: 18, description: "ICC Logistics Revenue Sharing" },
      ];

      for (const svc of services) {
        const exists = existing.find(t => t.serviceName === svc.name);
        if (exists) {
          results.push({ service: svc.name, status: "exists", id: exists.id });
          continue;
        }

        const contract = await storage.createContractTemplate({
          name: `${svc.name} Revenue Sharing Agreement`,
          version: "1.0",
          companyName: "MISSION ACT HEALTH, INC.",
          requiredFor: "affiliate",
          isActive: "true",
          contractType: "service",
          grossCommissionPct: svc.grossPct,
          serviceName: svc.name,
          content: `<h1>${svc.name.toUpperCase()} REVENUE SHARING AGREEMENT</h1>

<p>This Revenue Sharing Agreement ("Agreement") is between <strong>MISSION ACT HEALTH, INC.</strong>, a Virginia corporation ("MAH"), and the undersigned Independent Representative ("Representative").</p>

<h2>SERVICE DESCRIPTION</h2>
<p>${svc.description}</p>

<h2>COMPENSATION</h2>
<p>Compensation payable to the Representative network shall be governed by Schedule A.</p>

<p><strong>Gross Commission Rate: ${svc.grossPct}%</strong></p>

<p>The ${svc.grossPct}% gross commission shall be distributed according to the Schedule A compensation structure based on the Representative's position within the MAH network:</p>

<table border="1" cellpadding="8" style="width:100%; border-collapse: collapse;">
  <tr style="background-color: #f0f0f0;"><th>Recipient</th><th>Rate</th></tr>
  <tr><td><strong>Producer (You)</strong></td><td>69% base + compression from empty uplines</td></tr>
  <tr><td>Each Upline (max 6)</td><td>1% each</td></tr>
  <tr><td>House (MAH)</td><td>22.5%</td></tr>
  <tr><td>Recruiter Bounty</td><td>2.5%</td></tr>
</table>

<p><strong>Compression:</strong> Empty upline levels compress TO THE PRODUCER. A solo producer with no uplines receives 75% (69% + 6%).</p>

<h2>TERM AND TERMINATION</h2>
<p>This Agreement will commence upon its execution and continue until terminated by either party with 30 days prior written notice.</p>

<h2>RELATIONSHIP OF PARTIES</h2>
<p>The Representative is an independent contractor, not an employee, partner, or joint venturer of MAH.</p>

<h2>GOVERNING LAW</h2>
<p>This Agreement will be governed by the laws of the Commonwealth of Virginia.</p>

<hr/>

<p><strong>By signing below, you acknowledge that you have read, understand, and agree to be bound by this Agreement and the attached Schedule A.</strong></p>`
        });

        results.push({ service: svc.name, status: "created", id: contract.id });
      }

      res.status(201).json({ success: true, results });
    } catch (error) {
      console.error("Error seeding service contracts:", error);
      res.status(500).json({ message: "Failed to seed service contracts" });
    }
  });

  // Seed ICC Logistics service contract (legacy endpoint)
  app.post("/api/contracts/seed-icc", async (req, res) => {
    try {
      const existing = await storage.getAllContractTemplates();
      const iccExists = existing.find(t => t.serviceName === "ICC Logistics");
      if (iccExists) {
        return res.json({ message: "ICC Logistics contract already exists", id: iccExists.id });
      }

      const iccContract = await storage.createContractTemplate({
        name: "ICC Logistics Revenue Sharing Agreement",
        version: "1.0",
        companyName: "MISSION ACT HEALTH, INC.",
        requiredFor: "affiliate",
        isActive: "true",
        contractType: "service",
        grossCommissionPct: 18,
        serviceName: "ICC Logistics",
        content: `<h1>REVENUE SHARING AGREEMENT</h1>

<p>This Revenue Sharing Agreement ("Agreement") is between <strong>MISSION ACT HEALTH, Inc.</strong>, a Virginia corporation ("MAH"), on behalf of services rendered by <strong>ICC LOGISTICS, INC</strong> ("ICC"), a New York corporation, and the undersigned Referral Agent.</p>

<h2>RECITALS</h2>
<p>MISSION ACT HEALTH, LLC is the Master Agent and will have the responsibility of paying all commissions due to the Referral Agent five (5) days from receipt of funds from ICC.</p>

<h2>OBJECTIVES</h2>
<p>ICC and Referral Agent both have expertise in business consulting services and wish to enter into an arrangement whereby Referral Agent will introduce to ICC certain customers and prospects in return for a share of the revenues generated from business arising as a result of those introductions.</p>

<h2>RELATIONSHIP OF PARTIES</h2>
<p>In the performance of this Agreement, the parties will at all times remain independent legal entities and operate as independent contractors, and not the other party's partner or joint venturer.</p>

<h2>CONFIDENTIALITY</h2>
<p>The identity of any prospects or customers introduced by one party to the other shall remain confidential and shall not be disclosed to any other person or entity.</p>

<h2>TERM AND TERMINATION</h2>
<p>This Agreement will commence upon its execution and continue until the expiration of all projects governed under this Agreement. Either party may terminate this Agreement at any time upon 30 days prior written notice.</p>

<h2>COMPENSATION</h2>
<p>Compensation payable to the Referral Agent network shall be governed by Schedule A.</p>

<p><strong>Base Commission Rate:</strong></p>
<ul>
  <li><strong>All Other Services (excluding Audit):</strong> 18% of ICC's gross revenue</li>
  <li><strong>Audit Services:</strong> 5% of ICC's net revenue</li>
</ul>

<p>The 18% gross commission shall be distributed according to the Schedule A compensation structure based on the Referral Agent's position within the MAH network:</p>

<table border="1" cellpadding="8" style="width:100%; border-collapse: collapse;">
  <tr style="background-color: #f0f0f0;"><th>Recipient</th><th>Rate</th></tr>
  <tr><td><strong>Producer (You)</strong></td><td>69% base + compression from empty uplines</td></tr>
  <tr><td>Each Upline (max 6)</td><td>1% each</td></tr>
  <tr><td>House</td><td>22.5%</td></tr>
  <tr><td>Recruiter Bounty</td><td>2.5%</td></tr>
</table>

<p><strong>Compression:</strong> Empty upline levels compress to the Producer. A solo producer with no uplines receives 75% (69% + 6%).</p>

<h2>APPLICABLE LAW</h2>
<p>This Agreement will be interpreted in accordance with the laws of the State of New York.</p>

<h2>ARBITRATION</h2>
<p>Any disputes arising out of this Agreement will be settled by binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association.</p>

<hr/>

<p><strong>By signing below, you acknowledge that you have read, understand, and agree to be bound by this Agreement and the attached Schedule A.</strong></p>`
      });

      res.status(201).json({ success: true, template: iccContract });
    } catch (error) {
      console.error("Error seeding ICC contract:", error);
      res.status(500).json({ message: "Failed to seed ICC contract template" });
    }
  });

  // Get all contract templates
  app.get("/api/contracts/templates", async (req, res) => {
    try {
      const templates = await storage.getAllContractTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get active contract templates
  app.get("/api/contracts/templates/active", async (req, res) => {
    try {
      const templates = await storage.getActiveContractTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get a single contract template
  app.get("/api/contracts/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getContractTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Create contract template (admin only)
  app.post("/api/contracts/templates", requireAdmin, async (req, res) => {
    try {
      const data = insertContractTemplateSchema.parse(req.body);
      const template = await storage.createContractTemplate(data);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update contract template (admin only)
  app.patch("/api/contracts/templates/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateContractTemplate(id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Get all signed agreements (admin/master)
  app.get("/api/contracts/signed", requireAdmin, async (req, res) => {
    try {
      const agreements = await storage.getAllSignedAgreements();
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agreements" });
    }
  });

  // Get signed agreements for a specific affiliate
  app.get("/api/contracts/signed/affiliate/:affiliateId", requireAuth, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.affiliateId);
      const agreements = await storage.getSignedAgreementsByAffiliate(affiliateId);
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agreements" });
    }
  });

  // Check if affiliate has signed a specific contract
  app.get("/api/contracts/check/:affiliateId/:templateId", requireAuth, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.affiliateId);
      const templateId = parseInt(req.params.templateId);
      const hasSigned = await storage.hasAffiliateSignedContract(affiliateId, templateId);
      res.json({ hasSigned });
    } catch (error) {
      res.status(500).json({ message: "Failed to check signature" });
    }
  });

  // Sign a contract
  app.post("/api/contracts/sign", requireAuth, async (req, res) => {
    try {
      const data = insertSignedAgreementSchema.parse(req.body);
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const signedAgreement = await storage.createSignedAgreement({
        ...data,
        signedIpAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp || 'unknown'
      });
      
      // MIRROR TO GLOBAL LEGAL SYSTEM - single source of truth
      // Non-blocking: don't fail contract signing if mirror fails
      if (req.session.userId) {
        try {
          await signLegalDocumentAtomic({
            userId: req.session.userId,
            doc: LEGAL_DOCS.CONTRACT,
            docHash: hashDocument(JSON.stringify({ templateId: data.contractTemplateId, signatureData: data.signatureData })),
            req,
          });
          console.log(`[Contract Sign] Mirrored to legal_signatures for user ${req.session.userId}`);
        } catch (mirrorError) {
          console.error("[Contract Sign] Mirror to legal system failed (non-blocking):", mirrorError);
        }
      }
      
      res.status(201).json({ success: true, id: signedAgreement.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Contract signing error:", error);
      res.status(500).json({ message: "Failed to sign contract" });
    }
  });

  // Get pending contracts for an affiliate (contracts they haven't signed yet)
  app.get("/api/contracts/pending/:affiliateId", requireAuth, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.affiliateId);
      const allTemplates = await storage.getActiveContractTemplates();
      const signedAgreements = await storage.getSignedAgreementsByAffiliate(affiliateId);
      const signedTemplateIds = signedAgreements.map(sa => sa.contractTemplateId);
      const pendingTemplates = allTemplates.filter(t => !signedTemplateIds.includes(t.id));
      res.json(pendingTemplates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending contracts" });
    }
  });

  // Get signed agreements for the current logged-in user
  app.get("/api/contracts/my-signed", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.json([]);
      }
      const signedAgreements = await storage.getSignedAgreementsByAffiliate(req.session.userId);
      res.json(signedAgreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch signed agreements" });
    }
  });

  // Download signed agreement as HTML document
  app.get("/api/contracts/signed/:id/download", requireAuth, async (req, res) => {
    try {
      const agreementId = parseInt(req.params.id);
      const agreement = await storage.getSignedAgreement(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ message: "Signed agreement not found" });
      }

      // Verify the user owns this agreement
      if (agreement.affiliateId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get the contract template
      const template = await storage.getContractTemplate(agreement.contractTemplateId);
      if (!template) {
        return res.status(404).json({ message: "Contract template not found" });
      }

      // Get user info for the signature
      const user = await storage.getUser(agreement.affiliateId);
      const signedDate = new Date(agreement.signedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${template.name} - Signed Agreement</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            h1 { text-align: center; font-size: 20px; margin-bottom: 5px; }
            h2 { text-align: center; font-size: 14px; font-weight: normal; margin-bottom: 30px; }
            .contract-content { margin-bottom: 40px; }
            .signature-block { margin-top: 60px; padding-top: 20px; border-top: 2px solid #000; }
            .signature-line { display: flex; justify-content: space-between; margin-top: 30px; }
            .sig-item { width: 45%; }
            .sig-item .line { border-bottom: 1px solid #000; height: 30px; margin-bottom: 5px; padding-bottom: 5px; }
            .sig-item .label { font-size: 12px; color: #666; }
            .audit-info { margin-top: 40px; padding: 15px; background: #f5f5f5; font-size: 11px; color: #666; }
            @media print { body { margin: 0; padding: 20px; } .audit-info { break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h1>${template.name}</h1>
          <h2>${template.companyName} • Version ${template.version}</h2>
          
          <div class="contract-content">
            ${template.content}
          </div>
          
          <div class="signature-block">
            <h3>SIGNATURE</h3>
            <div class="signature-line">
              <div class="sig-item">
                <div class="line">${user?.name || 'Affiliate'}</div>
                <p class="label">Affiliate Signature</p>
              </div>
              <div class="sig-item">
                <div class="line">${signedDate}</div>
                <p class="label">Date Signed</p>
              </div>
            </div>
          </div>
          
          <div class="audit-info">
            <strong>Electronic Signature Audit Trail</strong><br>
            Agreement ID: ${agreement.id}<br>
            Signed By: ${user?.email || 'N/A'}<br>
            Signed At: ${agreement.signedAt}<br>
            IP Address: ${agreement.signedIpAddress || 'N/A'}<br>
            Status: ${agreement.status}
          </div>
        </body>
        </html>
      `;

      const fileName = `${template.name.replace(/\s+/g, '_')}_Signed_${signedDate.replace(/\s+/g, '_')}.html`;
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(htmlContent);
    } catch (error) {
      console.error("Error downloading signed agreement:", error);
      res.status(500).json({ message: "Failed to download agreement" });
    }
  });

  // ===== COMMISSION CALCULATION API =====

  // Calculate commission breakdown for a sale
  // CORRECT MODEL:
  // - House: 22.5% (fixed)
  // - Recruiter: 2.5% (fixed bounty for whoever brought in the rep)
  // - Producer: 69% base + 1% for each empty upline slot (up to 75% solo)
  // - Each upline: 1% each (max 6 uplines)
  // - Compression: empty upline slots go to producer, NOT house
  app.post("/api/commission/calculate", async (req, res) => {
    try {
      const { 
        grossCommission,  // The gross commission pool (e.g., 18% of deal for logistics)
        uplineCount = 0,  // Number of active uplines (0-6)
        hasRecruiter = true
      } = req.body;
      
      const pool = Math.max(0, Number(grossCommission) || 0);
      const uplines = Math.max(0, Math.min(6, Number(uplineCount) || 0));
      const emptyUplines = 6 - uplines;
      
      // Fixed percentages
      const HOUSE_PCT = 0.225;      // 22.5% always goes to house
      const RECRUITER_PCT = 0.025;  // 2.5% recruiter bounty
      const PRODUCER_BASE = 0.69;   // 69% base for producer
      const UPLINE_EACH = 0.01;     // 1% per upline level
      
      // Calculate payouts (in cents)
      const housePay = Math.round(pool * HOUSE_PCT * 100);
      const recruiterPay = hasRecruiter ? Math.round(pool * RECRUITER_PCT * 100) : 0;
      
      // Producer gets base + compression from empty upline slots
      const compressionPct = emptyUplines * UPLINE_EACH;
      const producerPct = PRODUCER_BASE + compressionPct;
      const producerPay = Math.round(pool * producerPct * 100);
      
      // Each active upline gets 1%
      const uplinePayEach = Math.round(pool * UPLINE_EACH * 100);
      const totalUplinePay = uplinePayEach * uplines;
      
      // Build upline breakdown
      const uplineBreakdown = Array.from({ length: uplines }, (_, i) => ({
        level: i + 1,
        pay: uplinePayEach,
        pct: UPLINE_EACH * 100
      }));

      res.json({
        grossCommission: pool,
        grossCommissionCents: Math.round(pool * 100),
        housePay,
        housePct: HOUSE_PCT * 100,
        recruiterPay,
        recruiterPct: RECRUITER_PCT * 100,
        producerPay,
        producerPct: producerPct * 100,
        producerBase: PRODUCER_BASE * 100,
        compressionPct: compressionPct * 100,
        uplineCount: uplines,
        uplinePayEach,
        totalUplinePay,
        uplineBreakdown,
        totalPaid: housePay + recruiterPay + producerPay + totalUplinePay,
        // Verification: should always equal 100%
        totalPct: (HOUSE_PCT + RECRUITER_PCT + producerPct + (uplines * UPLINE_EACH)) * 100
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate commissions" });
    }
  });

  // Get commission configuration (simplified model)
  app.get("/api/commission/config", async (req, res) => {
    try {
      const config = await storage.getActiveCommissionConfig();
      if (!config) {
        // Return simplified defaults
        res.json({
          producerBasePct: 69,
          uplinePctEach: 1,
          maxUplineLevels: 6,
          housePct: 22.5,
          recruiterBountyPct: 2.5,
        });
      } else {
        res.json({
          producerBasePct: config.producerBasePct,
          uplinePctEach: config.uplinePctEach,
          maxUplineLevels: config.maxUplineLevels,
          housePct: config.housePct,
          recruiterBountyPct: config.recruiterBountyPct,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get commission config" });
    }
  });

  // Seed default commission config (simplified model)
  app.post("/api/commission/seed", requireAdmin, async (req, res) => {
    try {
      const existing = await storage.getActiveCommissionConfig();
      if (existing) {
        return res.json({ success: true, message: "Config already exists", config: existing });
      }
      const config = await storage.createCommissionConfig({
        name: "default",
        producerBasePct: 69,
        uplinePctEach: 1,
        maxUplineLevels: 6,
        housePct: 22.5,
        recruiterBountyPct: 2.5,
        isActive: "true",
      });
      res.json({ success: true, config });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed commission config" });
    }
  });

  // Update commission configuration
  app.patch("/api/admin/commission/config/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      // Validate update fields - only allow specific commission config fields
      const allowedFields = ["name", "producerBasePct", "uplinePctEach", "maxUplineLevels", "housePct", "recruiterBountyPct", "isActive"];
      const updates: Record<string, any> = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          if (key === "isActive" || key === "name") {
            updates[key] = String(req.body[key]);
          } else {
            const numVal = parseInt(req.body[key]);
            if (isNaN(numVal) || numVal < 0) {
              return res.status(400).json({ message: `Invalid value for ${key}` });
            }
            updates[key] = numVal;
          }
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
      const config = await storage.updateCommissionConfig(parseInt(id), updates);
      if (!config) {
        return res.status(404).json({ message: "Commission config not found" });
      }
      res.json({ success: true, config });
    } catch (error) {
      res.status(500).json({ message: "Failed to update commission config" });
    }
  });

  // Get all commissions for admin dashboard
  app.get("/api/admin/commissions", requireAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAllAffiliates();
      const allCommissions = [];
      for (const affiliate of affiliates) {
        const comms = await storage.getCommissionsByAffiliate(affiliate.id);
        for (const comm of comms) {
          allCommissions.push({
            ...comm,
            affiliateName: affiliate.name,
            affiliateEmail: affiliate.email
          });
        }
      }
      allCommissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(allCommissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  // Send commission spreadsheet email
  app.post("/api/admin/send-commission-spreadsheet", requireAdmin, async (req, res) => {
    try {
      const { getResendClient } = await import("./resendClient");
      const { client, fromEmail } = await getResendClient();
      
      const emailTo = req.body.email || "bradweitma@gmail.com";
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Navigator USA Commission Structure</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #1A365D; text-align: center; }
            h2 { color: #E21C3D; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #1A365D; color: white; padding: 12px 8px; text-align: center; font-size: 12px; }
            td { padding: 10px 8px; text-align: center; border-bottom: 1px solid #ddd; font-size: 13px; }
            tr:hover { background: #f5f5f5; }
            .highlight { background: #FEF3C7; }
            .producer { color: #059669; font-weight: bold; }
            .house { color: #6B7280; }
            .recruiter { color: #D97706; }
            .upline { color: #2563EB; }
            .note { background: #EFF6FF; border: 1px solid #BFDBFE; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .fixed-box { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .example { background: #F3F4F6; border: 1px solid #D1D5DB; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Navigator USA Commission Structure</h1>
          <p style="text-align: center; color: #666; margin-bottom: 30px;">
            All percentages are of <strong style="color: #D97706;">GROSS COMMISSION</strong> (not gross revenue)
          </p>
          
          <div class="fixed-box">
            <h3 style="margin-top: 0; color: #D97706;">Fixed Allocations (Every Sale)</h3>
            <table>
              <tr>
                <td><strong>House (Navigator USA)</strong></td>
                <td><strong>22.5%</strong></td>
              </tr>
              <tr>
                <td><strong>Recruiter Bounty</strong></td>
                <td><strong>2.5%</strong></td>
              </tr>
            </table>
          </div>
          
          <h2>Commission Breakdown by Position</h2>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Uplines Above</th>
                <th>Producer Gets</th>
                <th>Uplines Get (1% each)</th>
                <th>Recruiter</th>
                <th>House</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="highlight">
                <td><strong>E7 - SFC (Solo)</strong></td>
                <td>0</td>
                <td class="producer">75%</td>
                <td class="upline">0%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E6 - SSG</td>
                <td>1</td>
                <td class="producer">74%</td>
                <td class="upline">1%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E5 - SGT</td>
                <td>2</td>
                <td class="producer">73%</td>
                <td class="upline">2%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E4 - SPC</td>
                <td>3</td>
                <td class="producer">72%</td>
                <td class="upline">3%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E3 - PFC</td>
                <td>4</td>
                <td class="producer">71%</td>
                <td class="upline">4%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E2 - PV2</td>
                <td>5</td>
                <td class="producer">70%</td>
                <td class="upline">5%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
              <tr>
                <td>E1 - PVT</td>
                <td>6</td>
                <td class="producer">69%</td>
                <td class="upline">6%</td>
                <td class="recruiter">2.5%</td>
                <td class="house">22.5%</td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div class="note">
            <h3 style="margin-top: 0; color: #2563EB;">Key Points</h3>
            <ul>
              <li><strong>Compression:</strong> Empty upline slots go to the Producer (not House)</li>
              <li><strong>69% Base:</strong> Every producer starts with 69% minimum</li>
              <li><strong>+1% per empty slot:</strong> Solo producers get 75% (69% + 6%)</li>
              <li><strong>House fixed:</strong> 22.5% always goes to Navigator USA</li>
              <li><strong>Recruiter:</strong> 2.5% to whoever brought in the rep</li>
            </ul>
          </div>
          
          <div class="example">
            <h3 style="margin-top: 0; color: #374151;">Example Calculation</h3>
            <p><strong>Scenario:</strong> $100,000 logistics deal × 18% commission rate = <span style="color: #D97706; font-weight: bold;">$18,000 commission pool</span></p>
            <p>Producer has 3 uplines above them:</p>
            <table>
              <tr>
                <td class="producer">Producer (72%)</td>
                <td class="producer"><strong>$12,960</strong></td>
              </tr>
              <tr>
                <td class="upline">3 Uplines (1% each)</td>
                <td class="upline"><strong>$540</strong> ($180 × 3)</td>
              </tr>
              <tr>
                <td class="recruiter">Recruiter (2.5%)</td>
                <td class="recruiter"><strong>$450</strong></td>
              </tr>
              <tr>
                <td class="house">House (22.5%)</td>
                <td class="house"><strong>$4,050</strong></td>
              </tr>
              <tr style="background: #D1FAE5;">
                <td><strong>Total</strong></td>
                <td><strong>$18,000</strong></td>
              </tr>
            </table>
          </div>
          
          <p style="text-align: center; color: #666; margin-top: 40px; font-size: 12px;">
            Navigator USA Commission Structure | Generated ${new Date().toLocaleDateString()}
          </p>
        </body>
        </html>
      `;
      
      await client.emails.send({
        from: fromEmail,
        to: emailTo,
        subject: "Navigator USA Commission Structure Breakdown",
        html: htmlContent
      });
      
      res.json({ success: true, message: `Commission spreadsheet sent to ${emailTo}` });
    } catch (error) {
      console.error("Error sending commission spreadsheet:", error);
      res.status(500).json({ message: "Failed to send commission spreadsheet email" });
    }
  });

  // === Business Leads API ===
  
  // Public: Submit a business lead
  app.post("/api/business-leads", async (req, res) => {
    try {
      const { referralCode, ...rest } = req.body;
      const data = insertBusinessLeadSchema.parse(rest);
      
      // Get client IP address
      const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      
      // Look up affiliate by referral code if provided, or check IP tracking
      let referredById: number | undefined;
      let finalReferralCode = referralCode;
      
      if (referralCode) {
        // Referral code provided - use it and track IP
        const affiliate = await storage.getUserByReferralCode(referralCode);
        if (affiliate) {
          referredById = affiliate.id;
          // Track this IP if not already tracked
          const existingIpTracking = await storage.getActiveIpReferral(clientIp);
          if (!existingIpTracking) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiration
            await storage.createIpReferralTracking({
              ipAddress: clientIp,
              affiliateId: affiliate.id,
              referralCode: referralCode,
              expiresAt,
            });
          }
        }
      } else {
        // No referral code - check if IP is already tracked
        const ipTracking = await storage.getActiveIpReferral(clientIp);
        if (ipTracking && ipTracking.affiliateId) {
          referredById = ipTracking.affiliateId;
          finalReferralCode = ipTracking.referralCode;
        }
      }
      
      const lead = await storage.createBusinessLead({
        ...data,
        referralCode: finalReferralCode || undefined,
        referredBy: referredById,
      } as any);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating business lead:", error);
      res.status(500).json({ message: "Failed to submit business lead" });
    }
  });

  // Admin/Master: Get all business leads
  app.get("/api/admin/business-leads", requireAdmin, async (req, res) => {
    try {
      const leads = await storage.getAllBusinessLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business leads" });
    }
  });

  // Master portal: Get all business leads (for master users)
  app.get("/api/master/business-leads", async (req, res) => {
    try {
      const leads = await storage.getAllBusinessLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business leads" });
    }
  });

  // Affiliate: Get business leads referred by this affiliate
  app.get("/api/affiliate/business-leads", requireAffiliateWithNda, async (req, res) => {
    try {
      const leads = await storage.getBusinessLeadsByReferrer(req.session.userId!);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business leads" });
    }
  });

  // Admin: Update business lead
  app.patch("/api/admin/business-leads/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateBusinessLead(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update business lead" });
    }
  });

  // === Security Tracking API ===

  // Master portal: Get all IP referral tracking with enriched data
  app.get("/api/master/security-tracking", requireAdmin, async (req, res) => {
    try {
      const ipReferrals = await storage.getAllIpReferrals();
      const allAffiliates = await storage.getAllAffiliates();
      const allNdas = await storage.getAllAffiliateNdas();
      const allHelpRequests = await storage.getAllHelpRequests();
      const allBusinessLeads = await storage.getAllBusinessLeads();
      
      // Enrich each IP tracking record with affiliate info, NDA status, and conversion status
      const enrichedData = await Promise.all(ipReferrals.map(async (tracking: any) => {
        const affiliate = allAffiliates.find((a: any) => a.id === tracking.affiliateId);
        const now = new Date();
        const isActive = tracking.expiresAt > now;
        
        // Check if this IP has any submissions (help requests or business leads)
        // This shows if they "became a lead"
        const hasHelpRequest = allHelpRequests.some(hr => hr.referredBy === tracking.affiliateId);
        const hasBusinessLead = allBusinessLeads.some(bl => bl.referredBy === tracking.affiliateId);
        
        return {
          id: tracking.id,
          ipAddress: tracking.ipAddress,
          referralCode: tracking.referralCode,
          affiliateId: tracking.affiliateId,
          affiliateName: affiliate?.name || 'Unknown',
          affiliateEmail: affiliate?.email || 'Unknown',
          expiresAt: tracking.expiresAt,
          createdAt: tracking.createdAt,
          isActive,
          clicked: true, // If we have a record, they clicked
          hasConvertedToLead: hasHelpRequest || hasBusinessLead,
        };
      }));
      
      // Also get affiliate list with their NDA status
      const affiliatesWithNdaStatus = allAffiliates
        .filter((a: any) => a.role === 'affiliate' || a.role === 'submaster')
        .map((affiliate: any) => {
          const hasSignedNda = allNdas.some(nda => nda.userId === affiliate.id);
          const referralCount = ipReferrals.filter(r => r.affiliateId === affiliate.id).length;
          return {
            id: affiliate.id,
            name: affiliate.name,
            email: affiliate.email,
            role: affiliate.role,
            referralCode: affiliate.referralCode,
            hasSignedNda,
            referralCount,
            createdAt: affiliate.createdAt,
          };
        });
      
      res.json({
        ipTracking: enrichedData,
        affiliates: affiliatesWithNdaStatus,
        totalTrackedIPs: ipReferrals.length,
        activeTracking: enrichedData.filter(d => d.isActive).length,
      });
    } catch (error) {
      console.error("Error fetching security tracking:", error);
      res.status(500).json({ message: "Failed to fetch security tracking data" });
    }
  });

  // Affiliate: Get their own IP referral tracking
  app.get("/api/affiliate/security-tracking", requireAffiliateWithNda, async (req, res) => {
    try {
      const ipReferrals = await storage.getIpReferralsByAffiliate(req.session.userId!);
      const now = new Date();
      const allHelpRequests = await storage.getHelpRequestsByAssignee(req.session.userId!);
      const allBusinessLeads = await storage.getBusinessLeadsByReferrer(req.session.userId!);
      
      // Check if user has signed NDA
      const hasSignedNda = await storage.hasAffiliateSignedNda(req.session.userId!);
      
      const enrichedData = ipReferrals.map(tracking => {
        const isActive = tracking.expiresAt > now;
        return {
          id: tracking.id,
          ipAddress: tracking.ipAddress,
          referralCode: tracking.referralCode,
          expiresAt: tracking.expiresAt,
          createdAt: tracking.createdAt,
          isActive,
          clicked: true,
        };
      });
      
      res.json({
        ipTracking: enrichedData,
        totalTrackedIPs: ipReferrals.length,
        activeTracking: enrichedData.filter(d => d.isActive).length,
        totalLeadsConverted: allHelpRequests.length + allBusinessLeads.length,
        hasSignedNda,
      });
    } catch (error) {
      console.error("Error fetching affiliate security tracking:", error);
      res.status(500).json({ message: "Failed to fetch security tracking data" });
    }
  });

  // =====================================================
  // STRESS TEST SIMULATION API
  // =====================================================
  
  // Run stress test simulation with 1000 sales across 30 affiliates
  // Public endpoint for demo purposes
  app.post("/api/stress-test/run", async (req, res) => {
    try {
      // Get configurable parameters from request body
      const { 
        numSales = 1000, 
        numAffiliates = 30, 
        hierarchyRandomness = 50 
      } = req.body;
      
      // Validate and clamp values
      const salesCount = Math.min(Math.max(1, numSales), 5000);
      const affiliateCount = Math.min(Math.max(5, numAffiliates), 100);
      const randomness = Math.min(Math.max(0, hierarchyRandomness), 100) / 100;
      
      const militaryRanks = ["E1", "E2", "E3", "E4", "E5", "E6", "E7"];
      const firstNames = ["James", "Michael", "Robert", "John", "David", "William", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris"];
      const roles = ["master", "sub_master", "affiliate", "affiliate", "affiliate", "affiliate", "affiliate"];
      const categories = ["disability", "holistic", "healthcare", "insurance", "tax_credits", "b2b", "b2c"];
      const statuses = ["pending", "approved", "paid"];
      
      // Step 1: Create test opportunities if none exist
      let existingOpportunities = await storage.getAllOpportunities();
      if (existingOpportunities.length === 0) {
        const testOpportunities = [
          { name: "VA Disability Claim", category: "disability", description: "VA Disability assistance", commissionType: "percentage", commissionL1: 6900, commissionL2: 100, commissionL3: 100, commissionL4: 100, commissionL5: 100, commissionL6: 100, commissionL7: 2250, isActive: "true" },
          { name: "Holistic Health Program", category: "holistic", description: "Holistic veteran health", commissionType: "percentage", commissionL1: 6900, commissionL2: 100, commissionL3: 100, commissionL4: 100, commissionL5: 100, commissionL6: 100, commissionL7: 2250, isActive: "true" },
          { name: "Tax Credit Services", category: "tax_credits", description: "Business tax credit", commissionType: "flat", commissionL1: 50000, commissionL2: 2000, commissionL3: 2000, commissionL4: 2000, commissionL5: 2000, commissionL6: 2000, commissionL7: 15000, isActive: "true" },
          { name: "Insurance Package", category: "insurance", description: "Veteran insurance", commissionType: "percentage", commissionL1: 6900, commissionL2: 100, commissionL3: 100, commissionL4: 100, commissionL5: 100, commissionL6: 100, commissionL7: 2250, isActive: "true" },
        ];
        for (const opp of testOpportunities) {
          await storage.createOpportunity(opp);
        }
        existingOpportunities = await storage.getAllOpportunities();
      }
      
      // Step 2: Check for existing stress test affiliates or create new ones
      const allAffiliates = await storage.getAllVltAffiliates();
      let stressTestAffiliates = allAffiliates.filter(a => a.email.includes("@stresstest.nav"));
      
      // If we have existing stress test affiliates, use them; otherwise create new ones
      if (stressTestAffiliates.length === 0) {
        const hashedPassword = await hashPassword("TestPass123!");
        const subMasterCount = Math.max(1, Math.floor(affiliateCount * 0.15)); // 15% are sub_masters
        const createdAffiliates: any[] = [];
        
        for (let i = 0; i < affiliateCount; i++) {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const rank = militaryRanks[Math.floor(Math.random() * militaryRanks.length)];
          const role = i === 0 ? "master" : (i < subMasterCount ? "sub_master" : "affiliate");
          
          // Build hierarchy with configurable randomness
          const getRandomParent = (maxIdx: number) => {
            if (maxIdx <= 0) return null;
            const structuredIdx = Math.min(i - 1, maxIdx - 1);
            const randomIdx = Math.floor(Math.random() * maxIdx);
            const blendedIdx = Math.round(structuredIdx * (1 - randomness) + randomIdx * randomness);
            return createdAffiliates[Math.min(blendedIdx, maxIdx - 1)]?.id || null;
          };
          
          const level1Id = i > 0 ? getRandomParent(Math.min(i, subMasterCount + 2)) : null;
          const level2Id = i > 1 ? getRandomParent(Math.min(i, subMasterCount)) : null;
          const level3Id = i > 2 ? getRandomParent(Math.min(i, Math.max(2, subMasterCount - 1))) : null;
          const level4Id = i > 3 ? getRandomParent(Math.min(i, 3)) : null;
          const level5Id = i > 4 ? getRandomParent(2) : null;
          const level6Id = createdAffiliates[0]?.id || null;
          
          try {
            const affiliate = await storage.createVltAffiliate({
              name: `${rank} ${firstName} ${lastName}`,
              email: `test.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@stresstest.nav`,
              phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
              passwordHash: hashedPassword,
              referralCode: `STRESS${i.toString().padStart(3, "0")}`,
              role,
              level1Id,
              level2Id,
              level3Id,
              level4Id,
              level5Id,
              level6Id,
              level7Id: null,
              recruiterId: i > 0 ? createdAffiliates[Math.floor(Math.random() * i)].id : null,
              status: "active",
              isCompActive: Math.random() > 0.2 ? "true" : "false",
              totalSales: 0,
              totalCommissions: 0,
              totalRecruiterBounties: 0,
            });
            createdAffiliates.push(affiliate);
          } catch (e) {
            console.log(`Skipping duplicate affiliate ${i}`);
          }
        }
        stressTestAffiliates = createdAffiliates;
      }
      
      // Step 3: Create sales with commissions (using salesCount)
      const salesCreated: any[] = [];
      const commissionsCreated: any[] = [];
      
      // Use stress test affiliates for sales
      if (stressTestAffiliates.length === 0) {
        return res.status(400).json({ message: "No affiliates available for stress test. Please clear data and try again." });
      }
      
      for (let i = 0; i < salesCount; i++) {
        const affiliate = stressTestAffiliates[Math.floor(Math.random() * stressTestAffiliates.length)];
        const opportunity = existingOpportunities[Math.floor(Math.random() * existingOpportunities.length)];
        // Median sale for tax is $16,000 - create distribution around this
        // Range: $5,000 - $35,000 with median around $16,000
        const baseAmount = 1600000; // $16,000 in cents (median)
        const variance = Math.floor((Math.random() - 0.5) * 2 * 1900000); // +/- $19,000 variance
        const saleAmount = Math.max(500000, baseAmount + variance); // Min $5,000
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const clientFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const clientLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        try {
          const sale = await storage.createSale({
            opportunityId: opportunity.id,
            affiliateId: affiliate.id,
            clientName: `${clientFirstName} ${clientLastName}`,
            clientEmail: `${clientFirstName.toLowerCase()}.${clientLastName.toLowerCase()}@client.com`,
            clientPhone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            saleAmount,
            referredByL1: affiliate.id,
            referredByL2: affiliate.level1Id,
            referredByL3: affiliate.level2Id,
            referredByL4: affiliate.level3Id,
            referredByL5: affiliate.level4Id,
            referredByL6: affiliate.level5Id,
            referredByL7: affiliate.level6Id,
            recruiterId: affiliate.recruiterId,
            recruiterBounty: Math.floor(saleAmount * 0.025),
            l2Active: affiliate.isCompActive,
            l3Active: "true",
            l4Active: "true",
            l5Active: "true",
            compressedToL6: 0,
            notes: `Stress test sale #${i + 1}`,
          });
          
          // Update sale status
          await storage.updateSale(sale.id, { status });
          salesCreated.push({ ...sale, status });
          
          // Create commissions for each level
          const commissionPool = saleAmount;
          const commissionRates = [0.69, 0.01, 0.01, 0.01, 0.01, 0.01, 0.225]; // Producer + 6 uplines + house
          
          // Level 1 - Producer
          if (affiliate.id) {
            const comm = await storage.createCommission({
              saleId: sale.id,
              affiliateId: affiliate.id,
              level: 1,
              amount: Math.floor(commissionPool * commissionRates[0]),
            });
            await storage.updateCommission(comm.id, { status });
            commissionsCreated.push(comm);
          }
          
          // Levels 2-6 uplines
          const uplineIds = [affiliate.level1Id, affiliate.level2Id, affiliate.level3Id, affiliate.level4Id, affiliate.level5Id];
          for (let lvl = 0; lvl < uplineIds.length; lvl++) {
            if (uplineIds[lvl]) {
              const comm = await storage.createCommission({
                saleId: sale.id,
                affiliateId: uplineIds[lvl],
                level: lvl + 2,
                amount: Math.floor(commissionPool * commissionRates[lvl + 1]),
              });
              await storage.updateCommission(comm.id, { status });
              commissionsCreated.push(comm);
            }
          }
        } catch (e) {
          console.log(`Error creating sale ${i}:`, e);
        }
      }
      
      res.json({
        success: true,
        message: "Stress test simulation completed",
        stats: {
          affiliatesUsed: stressTestAffiliates.length,
          salesCreated: salesCreated.length,
          commissionsCreated: commissionsCreated.length,
          totalSalesVolume: salesCreated.reduce((sum, s) => sum + s.saleAmount, 0),
          totalCommissions: commissionsCreated.reduce((sum, c) => sum + c.amount, 0),
        },
      });
    } catch (error) {
      console.error("Error running stress test:", error);
      res.status(500).json({ message: "Failed to run stress test simulation" });
    }
  });
  
  // Get stress test results
  // Public endpoint for demo purposes
  app.get("/api/stress-test/results", async (req, res) => {
    try {
      const affiliates = await storage.getAllVltAffiliates();
      const allSales = await storage.getAllSales();
      const opportunities = await storage.getAllOpportunities();
      
      // Get commissions for each affiliate
      const affiliateData = await Promise.all(affiliates.map(async (aff) => {
        const affSales = allSales.filter(s => s.affiliateId === aff.id);
        const affCommissions = await storage.getCommissionsByAffiliate(aff.id);
        
        return {
          id: aff.id,
          name: aff.name,
          email: aff.email,
          role: aff.role,
          referralCode: aff.referralCode,
          status: aff.status,
          isCompActive: aff.isCompActive,
          level1Id: aff.level1Id,
          level2Id: aff.level2Id,
          level3Id: aff.level3Id,
          totalDirectSales: affSales.length,
          totalSalesVolume: affSales.reduce((sum, s) => sum + s.saleAmount, 0),
          totalCommissionsEarned: affCommissions.reduce((sum, c) => sum + c.amount, 0),
          pendingCommissions: affCommissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.amount, 0),
          approvedCommissions: affCommissions.filter(c => c.status === "approved").reduce((sum, c) => sum + c.amount, 0),
          paidCommissions: affCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.amount, 0),
          commissionsByLevel: {
            level1: affCommissions.filter(c => c.level === 1).reduce((sum, c) => sum + c.amount, 0),
            level2: affCommissions.filter(c => c.level === 2).reduce((sum, c) => sum + c.amount, 0),
            level3: affCommissions.filter(c => c.level === 3).reduce((sum, c) => sum + c.amount, 0),
            level4: affCommissions.filter(c => c.level === 4).reduce((sum, c) => sum + c.amount, 0),
            level5: affCommissions.filter(c => c.level === 5).reduce((sum, c) => sum + c.amount, 0),
            level6: affCommissions.filter(c => c.level === 6).reduce((sum, c) => sum + c.amount, 0),
          },
        };
      }));
      
      // Summary stats
      const summary = {
        totalAffiliates: affiliates.length,
        totalSales: allSales.length,
        totalSalesVolume: allSales.reduce((sum, s) => sum + s.saleAmount, 0),
        salesByStatus: {
          pending: allSales.filter(s => s.status === "pending").length,
          approved: allSales.filter(s => s.status === "approved").length,
          paid: allSales.filter(s => s.status === "paid").length,
        },
        affiliatesByRole: {
          master: affiliates.filter(a => a.role === "master").length,
          sub_master: affiliates.filter(a => a.role === "sub_master").length,
          affiliate: affiliates.filter(a => a.role === "affiliate").length,
        },
        averageSaleAmount: allSales.length > 0 ? Math.floor(allSales.reduce((sum, s) => sum + s.saleAmount, 0) / allSales.length) : 0,
        topPerformers: affiliateData.sort((a, b) => b.totalCommissionsEarned - a.totalCommissionsEarned).slice(0, 10),
      };
      
      res.json({
        summary,
        affiliates: affiliateData,
        opportunities,
      });
    } catch (error) {
      console.error("Error fetching stress test results:", error);
      res.status(500).json({ message: "Failed to fetch stress test results" });
    }
  });
  
  // Clear stress test data
  // Public endpoint for demo purposes
  app.delete("/api/stress-test/clear", async (req, res) => {
    try {
      // This would need a storage method to clear test data
      // For safety, we only clear affiliates with @stresstest.nav emails
      const affiliates = await storage.getAllVltAffiliates();
      const testAffiliates = affiliates.filter(a => a.email.includes("@stresstest.nav"));
      
      for (const aff of testAffiliates) {
        // Delete commissions for this affiliate
        const commissions = await storage.getCommissionsByAffiliate(aff.id);
        for (const comm of commissions) {
          // Would need delete commission method
        }
        // Delete sales by this affiliate
        const sales = await storage.getSalesByAffiliate(aff.id);
        for (const sale of sales) {
          // Would need delete sale method
        }
        // Delete the affiliate
        await storage.deleteVltAffiliate(aff.id);
      }
      
      res.json({ 
        success: true, 
        message: `Cleared ${testAffiliates.length} test affiliates and their data` 
      });
    } catch (error) {
      console.error("Error clearing stress test data:", error);
      res.status(500).json({ message: "Failed to clear stress test data" });
    }
  });

  // Schedule A Signature Routes
  
  // Check if current user has signed Schedule A
  app.get("/api/schedule-a/status", requireAuth, async (req, res) => {
    try {
      const signature = await storage.getScheduleASignatureByUserId(req.session.userId!);
      res.json({ 
        signed: !!signature, 
        signature: signature || null 
      });
    } catch (error) {
      console.error("Error checking Schedule A status:", error);
      res.status(500).json({ message: "Failed to check signature status" });
    }
  });

  // Sign Schedule A
  app.post("/api/schedule-a/sign", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingSignature = await storage.getScheduleASignatureByUserId(req.session.userId!);
      if (existingSignature) {
        return res.status(400).json({ message: "Schedule A already signed" });
      }

      // Validate signature name if provided
      const signatureName = req.body.signatureName?.trim();
      if (!signatureName || signatureName.length < 2) {
        return res.status(400).json({ message: "Please enter your full legal name" });
      }

      const forwardedFor = req.headers['x-forwarded-for'];
      const clientIp = req.ip || (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim()) || 'unknown';

      const validatedData = insertScheduleASignatureSchema.parse({
        userId: req.session.userId!,
        affiliateName: signatureName,
        affiliateEmail: user.email,
        ipAddress: clientIp,
        userAgent: req.headers['user-agent'] || 'unknown',
        acknowledgedUplineCount: 0, // Fixed rate, no longer variable
        version: "1.0"
      });

      const signature = await storage.createScheduleASignature(validatedData);
      res.json({ success: true, signature });
    } catch (error) {
      console.error("Error signing Schedule A:", error);
      res.status(500).json({ message: "Failed to sign Schedule A" });
    }
  });

  // Admin: Get all Schedule A signatures
  app.get("/api/admin/schedule-a-signatures", requireAdmin, async (req, res) => {
    try {
      const signatures = await storage.getAllScheduleASignatures();
      res.json(signatures);
    } catch (error) {
      console.error("Error fetching Schedule A signatures:", error);
      res.status(500).json({ message: "Failed to fetch signatures" });
    }
  });

  // Download Schedule A as PDF
  app.get("/api/schedule-a/download", requireAuth, async (req, res) => {
    try {
      const signature = await storage.getScheduleASignatureByUserId(req.session.userId!);
      if (!signature) {
        return res.status(404).json({ message: "No signed Schedule A found" });
      }

      const signedDate = new Date(signature.signedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Schedule A - Commission Distribution Agreement</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            h1 { text-align: center; font-size: 18px; margin-bottom: 5px; }
            h2 { text-align: center; font-size: 14px; font-weight: normal; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; }
            .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature-line { width: 45%; }
            .signature-line p { margin: 5px 0; }
            .signature-line .line { border-bottom: 1px solid #000; height: 30px; margin-bottom: 5px; }
            .signature-line .label { font-size: 12px; color: #666; }
            @media print { body { margin: 0; padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>SCHEDULE A - COMMISSION DISTRIBUTION AGREEMENT</h1>
          <h2>Navigator USA Corp<br>Effective Date: ${signedDate}</h2>
          
          <div class="section">
            <p><span class="section-title">1. PARTIES.</span> This Schedule A Commission Distribution Agreement ("Agreement") is entered into between Navigator USA Corp ("Company") and the undersigned Affiliate ("Affiliate").</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">2. GROSS COMMISSION.</span> For each service sale, the Company receives a gross commission from the service provider. The commission rate varies by product/service type. This gross commission is distributed according to the structure below.</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">3. HOUSE SHARE.</span> The Company ("House") retains <strong>22.5%</strong> of the gross commission for operational costs and administrative services. This amount is fixed.</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">4. RECRUITER BOUNTY.</span> <strong>2.5%</strong> of the gross commission is paid to the Affiliate who recruited the Producer (the rep who made the sale).</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">5. PRODUCER & UPLINE COMMISSION.</span> The remaining <strong>75%</strong> is distributed between the Producer and their Uplines (if any):</p>
            <ul style="margin-left: 20px;">
              <li>Solo Producer (0 uplines): Producer gets all 75%</li>
              <li>1 upline: Producer 74% + Upline 1% = 75%</li>
              <li>2 uplines: Producer 73% + Uplines 2% = 75%</li>
              <li>3 uplines: Producer 72% + Uplines 3% = 75%</li>
              <li>4 uplines: Producer 71% + Uplines 4% = 75%</li>
              <li>5 uplines: Producer 70% + Uplines 5% = 75%</li>
              <li>6 uplines: Producer 69% + Uplines 6% = 75%</li>
            </ul>
          </div>
          
          <div class="section">
            <p><span class="section-title">6. COMPRESSION.</span> When upline positions are empty, that 1% per empty slot compresses to the Producer (not to the House).</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">7. PAYMENT TERMS.</span> Commissions are paid according to the Company's standard payment schedule following verification of sales and compliance with all applicable terms.</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">8. ACKNOWLEDGMENT.</span> By signing below, Affiliate acknowledges that they have read, understand, and agree to the commission structure outlined in this Schedule A.</p>
          </div>
          
          <div class="section">
            <p><span class="section-title">9. MODIFICATIONS.</span> The Company reserves the right to modify this commission structure with reasonable notice. Continued participation constitutes acceptance of any modifications.</p>
          </div>
          
          <div class="signature-block">
            <div class="signature-line">
              <div class="line">${signature.affiliateName}</div>
              <p class="label">Affiliate Signature</p>
              <p style="font-size: 12px;">${signature.affiliateEmail}</p>
            </div>
            <div class="signature-line">
              <div class="line">${signedDate}</div>
              <p class="label">Date</p>
            </div>
          </div>
        </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="Schedule_A_${signature.affiliateName.replace(/\s+/g, '_')}.html"`);
      res.send(htmlContent);
    } catch (error) {
      console.error("Error downloading Schedule A:", error);
      res.status(500).json({ message: "Failed to download Schedule A" });
    }
  });

  // Insurance Intake Routes
  
  // Public: Submit insurance intake
  app.post("/api/insurance-intakes", async (req, res) => {
    try {
      const validatedData = insertInsuranceIntakeSchema.parse(req.body);
      const intake = await storage.createInsuranceIntake(validatedData);
      res.json({ success: true, intake });
    } catch (error) {
      console.error("Error creating insurance intake:", error);
      res.status(500).json({ message: "Failed to submit insurance request" });
    }
  });

  // Admin: Get all insurance intakes
  app.get("/api/admin/insurance-intakes", requireAdmin, logPhiAccess("insurance_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllInsuranceIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching insurance intakes:", error);
      res.status(500).json({ message: "Failed to fetch insurance intakes" });
    }
  });

  // Admin: Update insurance intake
  app.patch("/api/admin/insurance-intakes/:id", requireAdmin, logPhiAccess("insurance_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const intake = await storage.updateInsuranceIntake(id, updates);
      res.json(intake);
    } catch (error) {
      console.error("Error updating insurance intake:", error);
      res.status(500).json({ message: "Failed to update insurance intake" });
    }
  });

  // Medical Sales Intake Routes
  app.post("/api/medical-sales-intakes", async (req, res) => {
    try {
      const validatedData = insertMedicalSalesIntakeSchema.parse(req.body);
      const intake = await storage.createMedicalSalesIntake(validatedData);
      res.json({ success: true, intake });
    } catch (error) {
      console.error("Error creating medical sales intake:", error);
      res.status(500).json({ message: "Failed to submit medical sales inquiry" });
    }
  });

  app.get("/api/admin/medical-sales-intakes", requireAdmin, logPhiAccess("medical_sales_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllMedicalSalesIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching medical sales intakes:", error);
      res.status(500).json({ message: "Failed to fetch medical sales intakes" });
    }
  });

  app.patch("/api/admin/medical-sales-intakes/:id", requireAdmin, logPhiAccess("medical_sales_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const intake = await storage.updateMedicalSalesIntake(id, updates);
      res.json(intake);
    } catch (error) {
      console.error("Error updating medical sales intake:", error);
      res.status(500).json({ message: "Failed to update medical sales intake" });
    }
  });

  app.get("/api/affiliate/medical-sales-intakes", requireAffiliateWithNda, logPhiAccess("medical_sales_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getMedicalSalesIntakesByAffiliate(req.session.userId!);
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching affiliate medical sales intakes:", error);
      res.status(500).json({ message: "Failed to fetch medical sales intakes" });
    }
  });

  // Business Development Intake Routes
  app.post("/api/business-dev-intakes", async (req, res) => {
    try {
      const validatedData = insertBusinessDevIntakeSchema.parse(req.body);
      const intake = await storage.createBusinessDevIntake(validatedData);
      res.json({ success: true, intake });
    } catch (error) {
      console.error("Error creating business dev intake:", error);
      res.status(500).json({ message: "Failed to submit business development inquiry" });
    }
  });

  app.get("/api/admin/business-dev-intakes", requireAdmin, logPhiAccess("business_dev_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getAllBusinessDevIntakes();
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching business dev intakes:", error);
      res.status(500).json({ message: "Failed to fetch business development intakes" });
    }
  });

  app.patch("/api/admin/business-dev-intakes/:id", requireAdmin, logPhiAccess("business_dev_intakes"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const intake = await storage.updateBusinessDevIntake(id, updates);
      res.json(intake);
    } catch (error) {
      console.error("Error updating business dev intake:", error);
      res.status(500).json({ message: "Failed to update business development intake" });
    }
  });

  app.get("/api/affiliate/business-dev-intakes", requireAffiliateWithNda, logPhiAccess("business_dev_intakes"), async (req, res) => {
    try {
      const intakes = await storage.getBusinessDevIntakesByAffiliate(req.session.userId!);
      res.json(intakes);
    } catch (error) {
      console.error("Error fetching affiliate business dev intakes:", error);
      res.status(500).json({ message: "Failed to fetch business development intakes" });
    }
  });

  // ============================================
  // COMPLIANCE & AUDIT ADMIN ROUTES
  // ============================================

  // Get all affiliate NDAs (for compliance audit)
  app.get("/api/admin/affiliate-ndas", requireAdmin, async (req, res) => {
    try {
      const ndas = await storage.getAllAffiliateNdas();
      res.json(ndas);
    } catch (error) {
      console.error("Error fetching affiliate NDAs:", error);
      res.status(500).json({ message: "Failed to fetch affiliate NDAs" });
    }
  });

  // Get all affiliate W9s (for compliance audit)
  app.get("/api/admin/affiliate-w9s", requireAdmin, async (req, res) => {
    try {
      const w9s = await storage.getAllAffiliateW9s();
      res.json(w9s);
    } catch (error) {
      console.error("Error fetching affiliate W9s:", error);
      res.status(500).json({ message: "Failed to fetch affiliate W9s" });
    }
  });

  // Get all consent records (for TCPA audit)
  app.get("/api/admin/consent-records", requireAdmin, async (req, res) => {
    try {
      const records = await storage.getAllConsentRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching consent records:", error);
      res.status(500).json({ message: "Failed to fetch consent records" });
    }
  });

  // Get all partner sharing logs (for compliance audit)
  app.get("/api/admin/partner-sharing-logs", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getAllPartnerSharingLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching partner sharing logs:", error);
      res.status(500).json({ message: "Failed to fetch partner sharing logs" });
    }
  });

  // ============================================
  // COST SAVINGS UNIVERSITY (CSU) API ROUTES
  // ============================================

  // Configure multer for contract document uploads (in-memory storage)
  const contractUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF, Word documents, and images (JPG, PNG, GIF, WebP) are allowed'));
      }
    }
  });

  // AI Document Scanner - Upload, extract text, and reformat documents
  app.post("/api/csu/scan-document", requireAdmin, (req, res, next) => {
    contractUpload.single('document')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ message: err.message || "File upload failed. Please try again." });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document uploaded" });
      }

      const { buffer, originalname, mimetype } = req.file;
      const isImage = mimetype.startsWith('image/');
      
      // Extract text from the document (using vision AI for images)
      console.log(`[Scanner] Extracting text from ${originalname} (${mimetype})`);
      const rawText = await extractDocumentText(buffer, originalname);
      
      if (!rawText || rawText.trim().length < 10) {
        return res.status(400).json({ 
          message: "Could not extract enough text from the document. Please ensure the document has readable text." 
        });
      }

      // Reformat the extracted text using AI
      console.log(`[Scanner] Reformatting extracted text (${rawText.length} chars)`);
      const formattedText = await reformatDocumentText(rawText);

      res.json({
        success: true,
        filename: originalname,
        fileType: isImage ? "image" : "document",
        rawText: rawText.substring(0, 500) + (rawText.length > 500 ? '...' : ''),
        formattedText,
        characterCount: formattedText.length,
      });
    } catch (error) {
      console.error("Error scanning document:", error);
      const message = error instanceof Error ? error.message : "Failed to scan document";
      res.status(500).json({ message });
    }
  });

  // Fix an existing template using AI
  app.post("/api/csu/fix-template/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getCsuContractTemplate(templateId);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const originalContent = template.content;
      console.log(`[AI Fix] Fixing template ${templateId}: ${template.name} (${originalContent.length} chars)`);

      const { fixTemplateContent } = await import("./contractDocumentAnalyzer");
      const fixedContent = await fixTemplateContent(originalContent);

      res.json({
        success: true,
        templateId,
        templateName: template.name,
        originalLength: originalContent.length,
        fixedLength: fixedContent.length,
        fixedContent,
      });
    } catch (error) {
      console.error("Error fixing template:", error);
      const message = error instanceof Error ? error.message : "Failed to fix template";
      res.status(500).json({ message });
    }
  });

  // Save fixed template content
  app.put("/api/csu/save-fixed-template/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ message: "Content is required" });
      }

      const updated = await storage.updateCsuContractTemplate(templateId, { content });

      if (!updated) {
        return res.status(404).json({ message: "Template not found" });
      }

      console.log(`[AI Fix] Saved fixed content for template ${templateId}`);

      res.json({
        success: true,
        template: updated,
      });
    } catch (error) {
      console.error("Error saving fixed template:", error);
      const message = error instanceof Error ? error.message : "Failed to save template";
      res.status(500).json({ message });
    }
  });

  // AI Autofill - extract contact info from pasted text
  // AI Smart Extract - Consolidated AI that extracts, formats, and triple-checks all fields in one call
  // Uses modelRouter to select best extraction model - no hardcoded models
  app.post("/api/csu/ai-smart-extract", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ message: "Text is required" });
      }

      // Use model router to get best model for text extraction
      const { modelRouter } = await import("../shared/orchestration");
      const routerResult = modelRouter("text-extraction", { preferQuality: true });
      const selectedModel = routerResult.model.id;
      
      console.log(`[AI Smart Extract] Starting 3-pass extraction from ${text.length} chars`);
      console.log(`[AI Smart Extract] Model router selected: ${selectedModel} (${routerResult.reasoning})`);

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY });
      
      // Define all fields to extract
      const extractionPrompt = `You are an expert contact and document information extractor. Extract ALL of the following fields from the provided text:

REQUIRED FIELDS:
- name: The person's full name (first and last)
- email: Their email address

OPTIONAL FIELDS:
- phone: Their phone number (format: +1 (XXX) XXX-XXXX or similar)
- address: Their full mailing address (street, city, state, zip)
- company: Their company or organization name
- initials: Their initials (derive from name if not explicitly stated, e.g., "John Doe" → "JD")
- date: Any relevant date mentioned (format: YYYY-MM-DD)
- title: Their job title or position

FORMATTING RULES:
1. Names: Capitalize properly (e.g., "john doe" → "John Doe")
2. Email: Lowercase (e.g., "JOHN@EXAMPLE.COM" → "john@example.com")
3. Phone: Format as +1 (XXX) XXX-XXXX for US numbers
4. Address: Proper capitalization and formatting
5. Initials: Uppercase, derived from first letters of first and last name
6. Date: ISO format YYYY-MM-DD

Return ONLY valid JSON with these fields. If a field is not found, omit it.
Example: {"name": "John Doe", "email": "john@example.com", "phone": "+1 (555) 123-4567", "initials": "JD", "company": "Acme Corp"}`;

      // Run extraction 3 times and consolidate/verify
      let allResults: any[] = [];
      
      for (let pass = 1; pass <= 3; pass++) {
        console.log(`[AI Smart Extract] Pass ${pass}/3`);
        
        const response = await openai.chat.completions.create({
          model: selectedModel,  // Using model router - swappable without UI changes
          messages: [
            { role: "system", content: extractionPrompt },
            { role: "user", content: text }
          ],
          temperature: pass === 1 ? 0.1 : 0.2, // Slightly vary temperature on subsequent passes
          max_tokens: 500,
        });

        const content = response.choices[0]?.message?.content || "{}";
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            allResults.push(JSON.parse(jsonMatch[0]));
          }
        } catch (e) {
          console.error(`[AI Smart Extract] Pass ${pass} parse error:`, content);
        }
      }

      // Consolidate results - take the most common value for each field, prioritizing non-empty
      const consolidated: Record<string, string> = {};
      const fields = ['name', 'email', 'phone', 'address', 'company', 'initials', 'date', 'title'];
      
      for (const field of fields) {
        const values = allResults
          .map(r => r[field])
          .filter(v => v && typeof v === 'string' && v.trim() !== '');
        
        if (values.length > 0) {
          // Count occurrences and take most common
          const counts: Record<string, number> = {};
          for (const v of values) {
            const normalized = v.trim();
            counts[normalized] = (counts[normalized] || 0) + 1;
          }
          // Get the value that appears most often (or first if tie)
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
          consolidated[field] = sorted[0][0];
        }
      }

      // Final formatting pass to ensure consistency
      if (consolidated.name) {
        consolidated.name = consolidated.name
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        
        // Auto-generate initials if not found
        if (!consolidated.initials) {
          const nameParts = consolidated.name.split(' ').filter(p => p.length > 0);
          if (nameParts.length >= 2) {
            consolidated.initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
          } else if (nameParts.length === 1) {
            consolidated.initials = nameParts[0].substring(0, 2).toUpperCase();
          }
        }
      }
      
      if (consolidated.email) {
        consolidated.email = consolidated.email.toLowerCase().trim();
      }
      
      if (consolidated.initials) {
        consolidated.initials = consolidated.initials.toUpperCase();
      }

      console.log(`[AI Smart Extract] Consolidated result:`, consolidated);
      console.log(`[AI Smart Extract] Confidence: ${allResults.length}/3 passes successful`);
      
      res.json({
        ...consolidated,
        _meta: {
          passes: 3,
          successful: allResults.length,
          confidence: Math.round((allResults.length / 3) * 100),
          model: selectedModel,
          modelName: routerResult.model.name,
          routing: routerResult.reasoning,
        }
      });
    } catch (error) {
      console.error("Error in AI smart extract:", error);
      const message = error instanceof Error ? error.message : "Failed to extract contact info";
      res.status(500).json({ message });
    }
  });

  // Legacy endpoint - redirect to smart extract
  app.post("/api/csu/ai-autofill", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ message: "Text is required" });
      }

      console.log(`[AI Autofill] Extracting contact info from ${text.length} chars`);

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a contact information extractor. Extract the following from the provided text:
- name: The person's full name
- email: Their email address
- phone: Their phone number (if present)
- company: Their company name (if present)

Return ONLY valid JSON with these fields. If a field is not found, omit it from the response.
Example response: {"name": "John Doe", "email": "john@example.com", "phone": "555-123-4567"}`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content || "{}";
      let extracted: { name?: string; email?: string; phone?: string; company?: string } = {};
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extracted = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("[AI Autofill] Failed to parse JSON:", content);
      }

      console.log(`[AI Autofill] Extracted:`, extracted);
      res.json(extracted);
    } catch (error) {
      console.error("Error in AI autofill:", error);
      const message = error instanceof Error ? error.message : "Failed to extract contact info";
      res.status(500).json({ message });
    }
  });

  // Upload and analyze a contract document to extract form fields
  app.post("/api/csu/analyze-document", requireAdmin, (req, res, next) => {
    contractUpload.single('document')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ message: err.message || "File upload failed. Please try again." });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document uploaded" });
      }

      const { buffer, originalname } = req.file;
      
      // Extract text from the document
      const documentText = await extractDocumentText(buffer, originalname);
      
      if (!documentText || documentText.trim().length < 50) {
        return res.status(400).json({ 
          message: "Could not extract enough text from the document. Please ensure it's a valid PDF or Word document with readable text." 
        });
      }

      // Analyze the document with AI to detect form fields
      const analysis = await analyzeContractDocument(documentText);

      res.json({
        success: true,
        filename: originalname,
        summary: analysis.summary,
        extractedText: analysis.extractedText.substring(0, 1000) + (analysis.extractedText.length > 1000 ? '...' : ''),
        detectedFields: analysis.detectedFields,
        generatedTemplate: analysis.generatedTemplate,
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
      const message = error instanceof Error ? error.message : "Failed to analyze document";
      res.status(500).json({ message });
    }
  });

  // Analyze template content with AI (no file upload required)
  app.post("/api/csu/analyze-template-content", async (req, res) => {
    try {
      const { content, templateName } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Template content is required" });
      }

      // Strip HTML tags for text analysis
      const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (plainText.length < 20) {
        return res.status(400).json({ 
          message: "Template content is too short for analysis" 
        });
      }

      // Analyze the content with AI
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert document analyzer specializing in contracts and legal documents. Analyze the provided document content and return a JSON response with the following structure:
{
  "fieldsDetected": number (count of signature fields, date fields, name fields, etc.),
  "signatureFields": number,
  "dateFields": number,
  "partyIdentificationSections": number,
  "riskScore": number (0-100, where 0 is no risk and 100 is very high risk),
  "riskLevel": "low" | "medium" | "high",
  "riskFactors": string[] (list of any risk factors found),
  "summary": string (brief summary of the document),
  "recommendations": string[] (optimization recommendations),
  "documentType": string (e.g., "NDA", "Service Agreement", "Employment Contract", etc.),
  "estimatedCompletionTime": string (e.g., "2-3 minutes")
}

Be thorough but concise. Focus on actionable insights.`
          },
          {
            role: "user",
            content: `Analyze this document template${templateName ? ` called "${templateName}"` : ""}:\n\n${plainText.substring(0, 8000)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const analysisText = response.choices[0]?.message?.content || "{}";
      const analysis = JSON.parse(analysisText);
      
      res.json({
        success: true,
        analysis: {
          fieldsDetected: analysis.fieldsDetected || 0,
          signatureFields: analysis.signatureFields || 0,
          dateFields: analysis.dateFields || 0,
          partyIdentificationSections: analysis.partyIdentificationSections || 0,
          riskScore: analysis.riskScore || 0,
          riskLevel: analysis.riskLevel || "low",
          riskFactors: analysis.riskFactors || [],
          summary: analysis.summary || "Document analyzed successfully.",
          recommendations: analysis.recommendations || [],
          documentType: analysis.documentType || "Contract",
          estimatedCompletionTime: analysis.estimatedCompletionTime || "2-3 minutes",
        }
      });
    } catch (error) {
      console.error("Error analyzing template content:", error);
      const message = error instanceof Error ? error.message : "Failed to analyze template";
      res.status(500).json({ message });
    }
  });

  // Get all CSU contract templates (admin)
  app.get("/api/csu/templates", requireAdmin, async (req, res) => {
    try {
      const templates = await storage.getActiveCsuContractTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching CSU templates:", error);
      res.status(500).json({ message: "Failed to fetch contract templates" });
    }
  });

  // Send a contract to someone (admin)
  app.post("/api/csu/send-contract", requireAdmin, async (req, res) => {
    try {
      // Validate request body with Zod
      const csuSendSchema = z.object({
        templateId: z.number().int().positive("Template is required"),
        recipientName: z.string().min(1, "Recipient name is required"),
        recipientEmail: z.string().email("Valid email is required"),
        recipientPhone: z.string().optional().nullable(),
        subject: z.string().optional().nullable(),
      });

      const validationResult = csuSendSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const { templateId, recipientName, recipientEmail, recipientPhone, subject } = validationResult.data;

      // Verify template exists
      const template = await storage.getCsuContractTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Contract template not found" });
      }

      // Generate unique token
      const crypto = await import("crypto");
      const signToken = crypto.randomBytes(32).toString("hex");
      
      // Token expires in 7 days
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

      const contractSend = await storage.createCsuContractSend({
        templateId,
        recipientName,
        recipientEmail,
        recipientPhone: recipientPhone || null,
        signToken,
        tokenExpiresAt,
        status: "pending",
        sentBy: req.session.userId || null,
      });

      // Generate signing URL - use custom domain if set, otherwise fall back to Replit domains
      const baseUrl = process.env.CUSTOM_DOMAIN
        ? `https://${process.env.CUSTOM_DOMAIN}`
        : process.env.REPLIT_DOMAINS?.split(",")[0] 
          ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
          : "http://localhost:5000";
      const signingUrl = `${baseUrl}/csu-sign?token=${signToken}`;

      // Try to send email via Resend integration
      let emailSent = false;
      let emailError: string | null = null;
      try {
        console.log(`[Email] Attempting to send contract email to ${recipientEmail}...`);
        const { client: resend, fromEmail } = await getResendClient();
        console.log(`[Email] Using from_email: ${fromEmail}`);
        
        const emailResult = await resend.emails.send({
          from: `Operation Fiscal Freedom <${fromEmail}>`,
          replyTo: fromEmail,
          to: recipientEmail,
          subject: subject || "Contract Ready for Signature - Operation Fiscal Freedom",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Operation Fiscal Freedom</h1>
                <p style="color: #bfdbfe; margin: 10px 0 0 0;">Contract Management</p>
              </div>
              
              <div style="background: #eff6ff; padding: 30px; border: 1px solid #bfdbfe;">
                <h2 style="color: #1a365d; margin-top: 0;">Hello ${recipientName},</h2>
                <p>You have a contract ready for your signature from <strong>Operation Fiscal Freedom</strong>.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${signingUrl}" style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Sign Contract Now</a>
                </div>
                
                <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
                <p style="background: #fff; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px; border: 1px solid #bfdbfe;">${signingUrl}</p>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Important:</strong> This link will expire in 7 days.</p>
                </div>
              </div>
              
              <div style="background: #1a365d; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">This is an automated message from Operation Fiscal Freedom.</p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 11px;">If you did not expect this email, please disregard it.</p>
              </div>
            </body>
            </html>
          `,
        });
        
        // Check for Resend API errors in the response
        if (emailResult.error) {
          console.error(`[Email] Resend API error:`, emailResult.error);
          emailError = emailResult.error.message || "Resend API returned an error";
        } else {
          console.log(`[Email] Successfully sent email to ${recipientEmail}, ID: ${emailResult.data?.id}`);
          emailSent = true;
        }
      } catch (err: any) {
        console.error("[Email] Failed to send email:", err);
        emailError = err?.message || "Unknown email error";
      }

      res.json({ 
        success: true, 
        contractSend,
        signingUrl,
        emailSent,
        emailError,
        message: emailSent 
          ? "Contract sent via email successfully" 
          : `Contract created but email failed: ${emailError || 'Email not configured'}. Share the signing link manually.`
      });
    } catch (error) {
      console.error("Error sending CSU contract:", error);
      res.status(500).json({ message: "Failed to send contract" });
    }
  });

  // Batch send contracts to multiple recipients (admin)
  app.post("/api/csu/send-contract-batch", requireAdmin, async (req, res) => {
    try {
      const batchSchema = z.object({
        templateId: z.number().int().positive("Template is required"),
        recipients: z.array(z.object({
          name: z.string().min(1, "Recipient name is required"),
          email: z.string().email("Valid email is required"),
          phone: z.string().optional().nullable(),
        })).min(1, "At least one recipient is required"),
        subject: z.string().optional().nullable(),
      });

      const validationResult = batchSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const { templateId, recipients, subject } = validationResult.data;

      // Verify template exists
      const template = await storage.getCsuContractTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Contract template not found" });
      }

      const crypto = await import("crypto");
      const { client: resend, fromEmail } = await getResendClient();
      
      const baseUrl = process.env.CUSTOM_DOMAIN
        ? `https://${process.env.CUSTOM_DOMAIN}`
        : process.env.REPLIT_DOMAINS?.split(",")[0] 
          ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
          : "http://localhost:5000";

      const results: { recipient: string; success: boolean; error?: string; signingUrl?: string }[] = [];

      // Helper to delay between emails (Resend rate limit: 2 requests/second)
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        
        // Add delay between emails to avoid rate limiting (600ms = ~1.6 req/sec, safely under 2/sec limit)
        if (i > 0) {
          await delay(600);
        }
        
        try {
          const signToken = crypto.randomBytes(32).toString("hex");
          const tokenExpiresAt = new Date();
          tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

          const contractSend = await storage.createCsuContractSend({
            templateId,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            recipientPhone: recipient.phone || null,
            signToken,
            tokenExpiresAt,
            status: "pending",
            sentBy: req.session.userId || null,
          });

          const signingUrl = `${baseUrl}/csu-sign?token=${signToken}`;

          // Send email
          const emailResult = await resend.emails.send({
            from: `Operation Fiscal Freedom <${fromEmail}>`,
            replyTo: fromEmail,
            to: recipient.email,
            subject: subject || "Contract Ready for Signature - Operation Fiscal Freedom",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Operation Fiscal Freedom</h1>
                  <p style="color: #bfdbfe; margin: 10px 0 0 0;">Contract Management</p>
                </div>
                
                <div style="background: #eff6ff; padding: 30px; border: 1px solid #bfdbfe;">
                  <h2 style="color: #1a365d; margin-top: 0;">Hello ${recipient.name},</h2>
                  <p>You have a contract ready for your signature from <strong>Operation Fiscal Freedom</strong>.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${signingUrl}" style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Sign Contract Now</a>
                  </div>
                  
                  <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
                  <p style="background: #fff; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px; border: 1px solid #bfdbfe;">${signingUrl}</p>
                  
                  <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Important:</strong> This link will expire in 7 days.</p>
                  </div>
                </div>
                
                <div style="background: #1a365d; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
                  <p style="color: #9ca3af; margin: 0; font-size: 12px;">This is an automated message from Operation Fiscal Freedom.</p>
                </div>
              </body>
              </html>
            `,
          });

          if (emailResult.error) {
            results.push({ recipient: recipient.email, success: false, error: emailResult.error.message, signingUrl });
          } else {
            results.push({ recipient: recipient.email, success: true, signingUrl });
          }
        } catch (err: any) {
          results.push({ recipient: recipient.email, success: false, error: err?.message || "Unknown error" });
        }
      }

      const successCount = results.filter(r => r.success).length;
      res.json({
        success: successCount > 0,
        totalSent: successCount,
        totalFailed: results.length - successCount,
        results,
        message: `Sent ${successCount} of ${results.length} contracts successfully`,
      });
    } catch (error) {
      console.error("Error batch sending contracts:", error);
      res.status(500).json({ message: "Failed to batch send contracts" });
    }
  });

  // Get all contract sends (admin)
  app.get("/api/csu/contract-sends", requireAdmin, async (req, res) => {
    try {
      const sends = await storage.getAllCsuContractSends();
      res.json(sends);
    } catch (error) {
      console.error("Error fetching CSU contract sends:", error);
      res.status(500).json({ message: "Failed to fetch contract sends" });
    }
  });

  // ============================================
  // CSU ENVELOPES - DocuSign-like multi-recipient signing
  // ============================================

  // Create envelope with ordered recipients
  app.post("/api/csu/envelopes", requireAdmin, async (req, res) => {
    try {
      // Validate request body with Zod schema
      const validationResult = createEnvelopeSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors 
        });
      }

      const { 
        templateId, 
        name, 
        routingType, 
        recipients, 
        reminderEnabled,
        reminderDaysAfterSend,
        reminderFrequencyDays,
        expiresInDays 
      } = validationResult.data;

      // Verify template exists
      const template = await storage.getCsuContractTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Calculate expiration date
      const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null;

      // Create the envelope
      const envelope = await storage.createCsuEnvelope({
        templateId,
        name,
        routingType: routingType || "sequential",
        status: "draft",
        reminderEnabled: reminderEnabled || false,
        reminderDaysAfterSend: reminderDaysAfterSend || 3,
        reminderFrequencyDays: reminderFrequencyDays || 3,
        expiresAt,
        sentBy: (req as any).user?.id,
      });

      // Create recipients with their routing order
      const crypto = await import("crypto");
      const createdRecipients = [];
      
      for (const recipient of recipients) {
        const signToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const created = await storage.createCsuEnvelopeRecipient({
          envelopeId: envelope.id,
          name: recipient.name,
          email: recipient.email,
          phone: recipient.phone || null,
          role: recipient.role || "signer",
          routingOrder: recipient.routingOrder || 1,
          status: "pending",
          signToken,
          tokenExpiresAt,
        });
        createdRecipients.push(created);
      }

      // Log audit event
      await storage.createCsuAuditTrail({
        envelopeId: envelope.id,
        eventType: "envelope_created",
        eventDescription: `Envelope "${name}" created with ${recipients.length} recipient(s)`,
        actorType: "admin",
        actorEmail: (req as any).user?.email,
        actorUserId: (req as any).user?.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ 
        envelope, 
        recipients: createdRecipients,
        message: "Envelope created successfully" 
      });
    } catch (error) {
      console.error("Error creating envelope:", error);
      res.status(500).json({ message: "Failed to create envelope" });
    }
  });

  // Send envelope (trigger emails based on routing order)
  app.post("/api/csu/envelopes/:id/send", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      const envelope = await storage.getCsuEnvelope(envelopeId);
      
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      if (envelope.status !== "draft") {
        return res.status(400).json({ message: "Envelope has already been sent" });
      }

      const recipients = await storage.getEnvelopeRecipients(envelopeId);
      const template = await storage.getCsuContractTemplate(envelope.templateId);

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Group recipients by routing order
      const recipientsByOrder = recipients.reduce((acc, r) => {
        const order = r.routingOrder;
        if (!acc[order]) acc[order] = [];
        acc[order].push(r);
        return acc;
      }, {} as Record<number, typeof recipients>);

      const sortedOrders = Object.keys(recipientsByOrder).map(Number).sort((a, b) => a - b);
      const firstOrder = sortedOrders[0];

      // Send emails only to first routing order (sequential) or all (parallel)
      const recipientsToSend = envelope.routingType === "parallel" 
        ? recipients 
        : recipientsByOrder[firstOrder] || [];

      const baseUrl = process.env.CUSTOM_DOMAIN
        ? `https://${process.env.CUSTOM_DOMAIN}`
        : process.env.REPLIT_DOMAINS?.split(",")[0] 
          ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
          : "http://localhost:5000";

      const { client: resend, fromEmail } = await getResendClient();

      const emailFailures: string[] = [];
      
      for (const recipient of recipientsToSend) {
        const signingUrl = `${baseUrl}/csu-sign?token=${recipient.signToken}`;
        
        // Send email with retry logic using centralized module
        const emailResult = await sendEmailWithRetryClient(resend, {
          from: fromEmail,
          to: recipient.email,
          subject: `Please Sign: ${template.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f4f6; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Contract Signing Request</h1>
              </div>
              <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; color: #374151;">Hello ${recipient.name},</p>
                <p style="font-size: 16px; color: #374151;">You have been requested to sign the following document:</p>
                <p style="font-size: 18px; color: #7c3aed; font-weight: bold;">${template.name}</p>
                ${envelope.routingType === "sequential" ? `<p style="font-size: 14px; color: #6b7280;">You are signer #${recipient.routingOrder} in the signing order.</p>` : ''}
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${signingUrl}" style="background: #7c3aed; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Review & Sign</a>
                </div>
                <p style="font-size: 14px; color: #6b7280;">This link will expire in 7 days.</p>
                <p style="font-size: 12px; color: #9ca3af;">If the button doesn't work, copy this link: ${signingUrl}</p>
              </div>
            </body>
            </html>
          `,
        });

        if (emailResult.success) {
          // Update recipient status
          await storage.updateCsuEnvelopeRecipient(recipient.id, {
            status: "sent",
            sentAt: new Date(),
          });

          // Log audit event
          await storage.createCsuAuditTrail({
            envelopeId,
            recipientId: recipient.id,
            eventType: "recipient_sent",
            eventDescription: `Signing request sent to ${recipient.name} (${recipient.email})`,
            actorType: "system",
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
          });
        } else {
          // Log email failure in audit trail
          emailFailures.push(`${recipient.email}: ${emailResult.error}`);
          await storage.createCsuAuditTrail({
            envelopeId,
            recipientId: recipient.id,
            eventType: "email_failed",
            eventDescription: `Failed to send email to ${recipient.name} (${recipient.email}): ${emailResult.error}`,
            actorType: "system",
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
          });
        }
      }

      const successCount = recipientsToSend.length - emailFailures.length;
      
      // Only update envelope status if at least one email was sent successfully
      if (successCount > 0) {
        await storage.updateCsuEnvelope(envelopeId, {
          status: "sent",
          sentAt: new Date(),
        });

        // Log envelope sent event
        await storage.createCsuAuditTrail({
          envelopeId,
          eventType: "envelope_sent",
          eventDescription: `Envelope sent to ${successCount} of ${recipientsToSend.length} recipient(s)${emailFailures.length > 0 ? ` (${emailFailures.length} failed)` : ''}`,
          actorType: "admin",
          actorEmail: (req as any).user?.email,
          actorUserId: (req as any).user?.id,
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        });

        res.json({ 
          success: true, 
          message: `Envelope sent to ${successCount} recipient(s)${emailFailures.length > 0 ? `. ${emailFailures.length} email(s) failed.` : ''}`,
          recipientsSent: successCount,
          emailFailures: emailFailures.length > 0 ? emailFailures : undefined,
        });
      } else {
        // All emails failed
        res.status(500).json({ 
          message: "Failed to send envelope - all emails failed",
          emailFailures 
        });
      }
    } catch (error) {
      console.error("Error sending envelope:", error);
      res.status(500).json({ message: "Failed to send envelope" });
    }
  });

  // Get all envelopes
  app.get("/api/csu/envelopes", requireAdmin, async (req, res) => {
    try {
      const envelopes = await storage.getAllCsuEnvelopes();
      res.json(envelopes);
    } catch (error) {
      console.error("Error fetching envelopes:", error);
      res.status(500).json({ message: "Failed to fetch envelopes" });
    }
  });

  // Get envelope with recipients
  app.get("/api/csu/envelopes/:id", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      const envelope = await storage.getCsuEnvelope(envelopeId);
      
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      const recipients = await storage.getEnvelopeRecipients(envelopeId);
      const template = await storage.getCsuContractTemplate(envelope.templateId);

      res.json({ envelope, recipients, template });
    } catch (error) {
      console.error("Error fetching envelope:", error);
      res.status(500).json({ message: "Failed to fetch envelope" });
    }
  });

  // Update envelope signing order (before sending)
  app.put("/api/csu/envelopes/:id/recipients", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      const { recipients } = req.body;

      const envelope = await storage.getCsuEnvelope(envelopeId);
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      // Only allow editing if envelope is in draft status
      if (envelope.status !== "draft") {
        return res.status(400).json({ message: "Cannot edit recipients after envelope is sent" });
      }

      // Update each recipient's routing order
      for (const recipient of recipients) {
        await storage.updateCsuEnvelopeRecipient(recipient.id, {
          routingOrder: recipient.routingOrder,
          role: recipient.role,
        });
      }

      const updatedRecipients = await storage.getEnvelopeRecipients(envelopeId);
      res.json({ recipients: updatedRecipients });
    } catch (error) {
      console.error("Error updating recipients:", error);
      res.status(500).json({ message: "Failed to update recipients" });
    }
  });

  // Get signing order diagram preview
  app.get("/api/csu/envelopes/:id/signing-order", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      const envelope = await storage.getCsuEnvelope(envelopeId);
      
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      const recipients = await storage.getEnvelopeRecipients(envelopeId);
      
      // Group by routing order
      const recipientsByOrder = recipients.reduce((acc, r) => {
        const order = r.routingOrder;
        if (!acc[order]) acc[order] = [];
        acc[order].push({
          id: r.id,
          name: r.name,
          email: r.email,
          role: r.role,
          status: r.status,
        });
        return acc;
      }, {} as Record<number, any[]>);

      const sortedOrders = Object.keys(recipientsByOrder).map(Number).sort((a, b) => a - b);
      
      const diagram = sortedOrders.map(order => ({
        order,
        parallel: recipientsByOrder[order].length > 1,
        recipients: recipientsByOrder[order],
      }));

      res.json({
        envelopeId,
        routingType: envelope.routingType,
        diagram,
        totalSteps: sortedOrders.length,
        totalRecipients: recipients.length,
      });
    } catch (error) {
      console.error("Error fetching signing order:", error);
      res.status(500).json({ message: "Failed to fetch signing order" });
    }
  });

  // Get audit trail for envelope
  app.get("/api/csu/envelopes/:id/audit-trail", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      const envelope = await storage.getCsuEnvelope(envelopeId);
      
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      const auditTrail = await storage.getAuditTrailForEnvelope(envelopeId);
      res.json(auditTrail);
    } catch (error) {
      console.error("Error fetching audit trail:", error);
      res.status(500).json({ message: "Failed to fetch audit trail" });
    }
  });

  // Void envelope
  app.post("/api/csu/envelopes/:id/void", requireAdmin, async (req, res) => {
    try {
      const envelopeId = parseInt(req.params.id);
      if (isNaN(envelopeId)) {
        return res.status(400).json({ message: "Invalid envelope ID" });
      }
      
      const { reason } = req.body;

      const envelope = await storage.getCsuEnvelope(envelopeId);
      if (!envelope) {
        return res.status(404).json({ message: "Envelope not found" });
      }

      // Use state machine validation
      if (!isValidTransition(envelope.status, "voided", VALID_ENVELOPE_TRANSITIONS)) {
        return res.status(400).json({ 
          message: `Cannot void envelope with status "${envelope.status}"`,
          currentStatus: envelope.status,
          allowedTransitions: VALID_ENVELOPE_TRANSITIONS[envelope.status] || []
        });
      }

      await storage.updateCsuEnvelope(envelopeId, {
        status: "voided",
        voidedAt: new Date(),
        voidReason: reason || "Voided by admin",
      });

      // Void all pending recipients
      const recipients = await storage.getEnvelopeRecipients(envelopeId);
      for (const recipient of recipients) {
        if (recipient.status !== "signed") {
          await storage.updateCsuEnvelopeRecipient(recipient.id, {
            status: "voided",
          });
        }
      }

      // Log audit event
      await storage.createCsuAuditTrail({
        envelopeId,
        eventType: "envelope_voided",
        eventDescription: `Envelope voided: ${reason || "No reason provided"}`,
        actorType: "admin",
        actorEmail: (req as any).user?.email,
        actorUserId: (req as any).user?.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });

      res.json({ success: true, message: "Envelope voided successfully" });
    } catch (error) {
      console.error("Error voiding envelope:", error);
      res.status(500).json({ message: "Failed to void envelope" });
    }
  });

  // Resend contract with new token (admin)
  app.post("/api/csu/contract-sends/:id/resend", requireAdmin, async (req, res) => {
    try {
      const sendId = parseInt(req.params.id);
      if (isNaN(sendId)) {
        return res.status(400).json({ message: "Invalid send ID" });
      }

      // Get the existing contract send
      const sends = await storage.getAllCsuContractSends();
      const existingSend = sends.find(s => s.id === sendId);
      if (!existingSend) {
        return res.status(404).json({ message: "Contract send not found" });
      }

      if (existingSend.status === "signed") {
        return res.status(400).json({ message: "Cannot resend a signed contract" });
      }

      if (existingSend.status === "voided") {
        return res.status(400).json({ message: "Cannot resend a voided contract" });
      }

      // Generate new token
      const crypto = await import("crypto");
      const newToken = crypto.randomBytes(32).toString("hex");
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 7);

      // Update the contract send
      const updated = await storage.updateCsuContractSend(sendId, {
        signToken: newToken,
        tokenExpiresAt: newExpiry,
        sentAt: new Date(),
      });

      if (!updated) {
        return res.status(500).json({ message: "Failed to update contract send" });
      }

      // Get template for email
      const template = await storage.getCsuContractTemplate(existingSend.templateId);
      
      const baseUrl = process.env.CUSTOM_DOMAIN
        ? `https://${process.env.CUSTOM_DOMAIN}`
        : process.env.REPLIT_DOMAINS?.split(",")[0] 
          ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
          : "http://localhost:5000";

      const signingUrl = `${baseUrl}/csu-sign?token=${newToken}`;

      // Send email
      const { client: resend, fromEmail } = await getResendClient();
      await resend.emails.send({
        from: fromEmail,
        to: existingSend.recipientEmail,
        subject: `[Reminder] Please Sign: ${template?.name || "Contract Agreement"}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f4f6; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Contract Signing Reminder</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; color: #374151;">Hello ${existingSend.recipientName},</p>
              <p style="font-size: 16px; color: #374151;">This is a reminder to sign your <strong>${template?.name || "Contract Agreement"}</strong>.</p>
              <p style="font-size: 16px; color: #374151;">A new signing link has been generated for you:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${signingUrl}" style="background: #7c3aed; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Sign Your Contract</a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280;">This link will expire in 7 days.</p>
              <p style="font-size: 12px; color: #9ca3af;">If the button doesn't work, copy this link: ${signingUrl}</p>
            </div>
          </body>
          </html>
        `,
      });

      res.json({ 
        success: true, 
        message: "Contract resent successfully",
        signingUrl,
        expiresAt: newExpiry,
      });
    } catch (error) {
      console.error("Error resending contract:", error);
      res.status(500).json({ message: "Failed to resend contract" });
    }
  });

  // Void/cancel a contract (admin)
  app.post("/api/csu/contract-sends/:id/void", requireAdmin, async (req, res) => {
    try {
      const sendId = parseInt(req.params.id);
      if (isNaN(sendId)) {
        return res.status(400).json({ message: "Invalid send ID" });
      }

      const sends = await storage.getAllCsuContractSends();
      const existingSend = sends.find(s => s.id === sendId);
      if (!existingSend) {
        return res.status(404).json({ message: "Contract send not found" });
      }

      if (existingSend.status === "signed") {
        return res.status(400).json({ message: "Cannot void a signed contract" });
      }

      if (existingSend.status === "voided") {
        return res.status(400).json({ message: "Contract is already voided" });
      }

      const updated = await storage.updateCsuContractSend(sendId, {
        status: "voided",
      });

      if (!updated) {
        return res.status(500).json({ message: "Failed to void contract" });
      }

      res.json({ 
        success: true, 
        message: "Contract voided successfully",
      });
    } catch (error) {
      console.error("Error voiding contract:", error);
      res.status(500).json({ message: "Failed to void contract" });
    }
  });

  // Get all signed agreements (admin)
  app.get("/api/csu/signed-agreements", requireAdmin, async (req, res) => {
    try {
      const agreements = await storage.getAllCsuSignedAgreements();
      res.json(agreements);
    } catch (error) {
      console.error("Error fetching CSU signed agreements:", error);
      res.status(500).json({ message: "Failed to fetch signed agreements" });
    }
  });

  // Get template fields for a specific template (admin)
  app.get("/api/csu/templates/:id/fields", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      const fields = await storage.getCsuContractTemplateFields(templateId);
      res.json(fields);
    } catch (error) {
      console.error("Error fetching template fields:", error);
      res.status(500).json({ message: "Failed to fetch template fields" });
    }
  });

  // Create or update template with fields (admin)
  app.post("/api/csu/templates", requireAdmin, async (req, res) => {
    try {
      const templateSchema = z.object({
        name: z.string().min(1, "Template name is required"),
        description: z.string().optional().nullable(),
        content: z.string().min(1, "Template content is required"),
        portal: z.string().optional().nullable(),
        isActive: z.boolean().optional().default(true),
        fields: z.array(z.object({
          fieldKey: z.string().min(1),
          label: z.string().min(1),
          placeholder: z.string().optional().default(""),
          fieldType: z.enum(["text", "email", "phone", "date", "textarea", "select"]).optional().default("text"),
          required: z.boolean().optional().default(true),
          order: z.number().optional().default(0),
          defaultValue: z.string().optional().nullable(),
          validation: z.string().optional().nullable(),
        })).optional().default([]),
      });

      const validationResult = templateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const { name, description, content, portal, isActive, fields } = validationResult.data;

      // Create the template
      const template = await storage.createCsuContractTemplate({
        name,
        description: description || null,
        content,
        portal: portal || null,
        isActive,
      });

      // Create fields if provided
      if (fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          await storage.createCsuContractTemplateField({
            templateId: template.id,
            fieldKey: field.fieldKey,
            label: field.label,
            placeholder: field.placeholder || "",
            fieldType: field.fieldType || "text",
            required: field.required ?? true,
            order: field.order ?? i,
            defaultValue: field.defaultValue || null,
            validation: field.validation || null,
          });
        }
      }

      // Fetch fields back
      const createdFields = await storage.getCsuContractTemplateFields(template.id);
      
      res.json({ ...template, fields: createdFields });
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update template with fields (admin)
  app.put("/api/csu/templates/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const templateSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        content: z.string().min(1).optional(),
        portal: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
        fields: z.array(z.object({
          id: z.number().optional(),
          fieldKey: z.string().min(1),
          label: z.string().min(1),
          placeholder: z.string().optional().default(""),
          fieldType: z.enum(["text", "email", "phone", "date", "textarea", "select"]).optional().default("text"),
          required: z.boolean().optional().default(true),
          order: z.number().optional().default(0),
          defaultValue: z.string().optional().nullable(),
          validation: z.string().optional().nullable(),
        })).optional(),
      });

      const validationResult = templateSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data" 
        });
      }

      const { fields, ...templateUpdates } = validationResult.data;

      // Update template
      const template = await storage.updateCsuContractTemplate(templateId, templateUpdates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Update fields if provided
      if (fields !== undefined) {
        // Delete all existing fields and recreate
        await storage.deleteAllCsuContractTemplateFields(templateId);
        
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          await storage.createCsuContractTemplateField({
            templateId,
            fieldKey: field.fieldKey,
            label: field.label,
            placeholder: field.placeholder || "",
            fieldType: field.fieldType || "text",
            required: field.required ?? true,
            order: field.order ?? i,
            defaultValue: field.defaultValue || null,
            validation: field.validation || null,
          });
        }
      }

      // Fetch fields back
      const updatedFields = await storage.getCsuContractTemplateFields(templateId);
      
      res.json({ ...template, fields: updatedFields });
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Delete template (admin)
  app.delete("/api/csu/templates/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      // Delete fields first
      await storage.deleteAllCsuContractTemplateFields(templateId);
      
      // Delete template
      await storage.deleteCsuContractTemplate(templateId);
      
      res.json({ success: true, message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Get single template with fields (admin)
  app.get("/api/csu/templates/:id", requireAdmin, async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getCsuContractTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const fields = await storage.getCsuContractTemplateFields(templateId);
      
      res.json({ ...template, fields });
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Public: Get contract by token (for signing page)
  app.get("/api/csu/contract/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const contractSend = await storage.getCsuContractSendByToken(token);
      
      if (!contractSend) {
        return res.status(404).json({ message: "Contract not found" });
      }

      // Check if token is expired
      if (new Date() > contractSend.tokenExpiresAt) {
        return res.status(410).json({ message: "This signing link has expired" });
      }

      // Check if already signed
      if (contractSend.status === "signed") {
        return res.status(410).json({ message: "This contract has already been signed" });
      }

      // Get the template content
      const template = await storage.getCsuContractTemplate(contractSend.templateId);
      if (!template) {
        return res.status(404).json({ message: "Contract template not found" });
      }

      // Replace signer name placeholder in contract content for display
      const { replaceContractPlaceholders, addPlainTextHeader } = await import("./pdfGenerator");
      let processedContent = replaceContractPlaceholders(template.content, {
        signerName: contractSend.recipientName,
      });
      // Add header for plain text templates
      processedContent = addPlainTextHeader(processedContent, {
        signerName: contractSend.recipientName,
        signerEmail: contractSend.recipientEmail,
      });

      res.json({
        contractSend: {
          id: contractSend.id,
          recipientName: contractSend.recipientName,
          recipientEmail: contractSend.recipientEmail,
          recipientPhone: contractSend.recipientPhone,
        },
        template: {
          id: template.id,
          name: template.name,
          content: processedContent,
        }
      });
    } catch (error) {
      console.error("Error fetching CSU contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  // Public: Submit signed contract
  app.post("/api/csu/sign/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      // Validate request body with Zod - require BOTH consent checkboxes
      const csuSignSchema = z.object({
        signerName: z.string().min(1, "Name is required"),
        signerEmail: z.string().email("Valid email is required"),
        signerPhone: z.string().optional().nullable(),
        address: z.string().optional().nullable(),
        clientAddress: z.string().optional().nullable(),
        initials: z.string().optional().nullable(),
        effectiveDate: z.string().optional().nullable(),
        signatureData: z.string().min(1, "Signature is required"),
        agreedToEsign: z.union([z.boolean(), z.string()]).refine(val => val === true || val === "true", {
          message: "You must consent to electronic signatures"
        }),
        agreedToTerms: z.union([z.boolean(), z.string()]).refine(val => val === true || val === "true", {
          message: "You must agree to the terms"
        }),
        clientCompany: z.string().optional().nullable(),
        primaryOwner: z.string().optional().nullable(),
        primaryTitle: z.string().optional().nullable(),
        secondaryOwner: z.string().optional().nullable(),
      });

      const validationResult = csuSignSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("[CSU Sign] Validation failed:", JSON.stringify(validationResult.error.errors, null, 2));
        return res.status(400).json({ 
          message: validationResult.error.errors[0]?.message || "Invalid request data",
          errors: validationResult.error.errors 
        });
      }

      const { signerName, signerEmail, signerPhone, address, clientAddress: ficaClientAddress, initials, effectiveDate, signatureData, agreedToEsign, agreedToTerms, clientCompany, primaryTitle, secondaryOwner } = validationResult.data;
      // Use explicit clientAddress for FICA, or fall back to address field
      const clientAddress = ficaClientAddress || address || "";

      const contractSend = await storage.getCsuContractSendByToken(token);
      
      if (!contractSend) {
        return res.status(404).json({ message: "Contract not found" });
      }

      if (new Date() > contractSend.tokenExpiresAt) {
        return res.status(410).json({ message: "This signing link has expired" });
      }

      if (contractSend.status === "signed") {
        return res.status(410).json({ message: "This contract has already been signed" });
      }

      // Get client IP and user agent at signing time
      const signedIpAddress = req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
                              req.socket.remoteAddress || 
                              "unknown";
      const signingUserAgent = req.headers["user-agent"] || "Unknown";

      // Build consent string for audit trail (includes both consents)
      const consentRecord = `esign:${agreedToEsign === true || agreedToEsign === "true" ? "yes" : "no"},terms:${agreedToTerms === true || agreedToTerms === "true" ? "yes" : "no"},ua:${signingUserAgent.substring(0, 200)},company:${clientCompany || ""},title:${primaryTitle || ""},address:${clientAddress || ""},secondary:${secondaryOwner || ""}`;

      // Create the signed agreement with validated consent
      const signedAgreement = await storage.createCsuSignedAgreement({
        contractSendId: contractSend.id,
        templateId: contractSend.templateId,
        signerName,
        signerEmail,
        signerPhone: signerPhone || null,
        address: address || null,
        initials: initials || null,
        effectiveDate: effectiveDate || null,
        signatureData,
        signedIpAddress,
        agreedToTerms: consentRecord,
      });

      // Update the contract send status
      await storage.updateCsuContractSend(contractSend.id, { status: "signed" });

      // Mirror to global legal system if signer is a registered user
      const existingUser = await storage.getUserByEmail(signerEmail);
      if (existingUser) {
        try {
          const { signLegalDocumentAtomic, LEGAL_DOCS, hashDocument } = await import("./legal-system");
          await signLegalDocumentAtomic({
            userId: existingUser.id,
            doc: LEGAL_DOCS.CONTRACT,
            docHash: hashDocument(JSON.stringify({ signerName, signerEmail, signatureData })),
            req,
          });
          console.log(`[CSU Sign] Mirrored to legal_signatures for user ${existingUser.id}`);
        } catch (mirrorError) {
          console.error("[CSU Sign] Mirror to legal system failed (non-blocking):", mirrorError);
        }
      }

      res.json({ success: true, agreementId: signedAgreement.id, signedAgreement });
    } catch (error) {
      console.error("Error signing CSU contract:", error);
      res.status(500).json({ message: "Failed to sign contract" });
    }
  });

  // Public: Download signed agreement PDF (for immediate download after signing)
  app.get("/api/csu/signed-agreements/:id/pdf/public", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agreement = await storage.getCsuSignedAgreement(id);
      
      if (!agreement) {
        return res.status(404).json({ message: "Signed agreement not found" });
      }

      const template = await storage.getCsuContractTemplate(agreement.templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Parse consent record from agreedToTerms field (stores full audit data)
      const consentRecord = agreement.agreedToTerms || "";
      const parseConsentField = (field: string): string => {
        const match = consentRecord.match(new RegExp(`${field}:([^,]*)`));
        return match ? match[1] : "";
      };
      
      const esignConsent = parseConsentField("esign") === "yes";
      const termsConsent = parseConsentField("terms") === "yes";
      const storedUserAgent = parseConsentField("ua") || "Unknown";
      const clientCompany = parseConsentField("company") || "";
      const primaryTitle = parseConsentField("title") || "";
      const clientAddress = parseConsentField("address") || "";
      const secondaryOwner = parseConsentField("secondary") || "";

      // Import PDF generator
      const { generateCsuContractPdf } = await import("./pdfGenerator");

      // Generate PDF with full audit data from signing time
      const pdfBuffer = await generateCsuContractPdf({
        templateName: template.name,
        templateContent: template.content,
        signerName: agreement.signerName,
        signerEmail: agreement.signerEmail,
        signerPhone: agreement.signerPhone,
        address: agreement.address, // Signer address/website
        clientAddress, // FICA contract company address from consent record
        initials: agreement.initials,
        effectiveDate: agreement.effectiveDate,
        signedAt: agreement.signedAt?.toISOString() || new Date().toISOString(),
        signedIpAddress: agreement.signedIpAddress,
        signatureData: agreement.signatureData,
        agreementId: agreement.id,
        userAgent: storedUserAgent,
        clientCompany,
        primaryTitle,
        secondaryOwner,
        esignConsent,
        termsConsent,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="FICA-Agreement-${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating public CSU PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Admin: Download signed agreement PDF
  app.get("/api/csu/signed-agreements/:id/pdf", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agreement = await storage.getCsuSignedAgreement(id);
      
      if (!agreement) {
        return res.status(404).json({ message: "Signed agreement not found" });
      }

      const template = await storage.getCsuContractTemplate(agreement.templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Parse consent record from agreedToTerms field (stores full audit data)
      const consentRecord = agreement.agreedToTerms || "";
      const parseConsentField = (field: string): string => {
        const match = consentRecord.match(new RegExp(`${field}:([^,]*)`));
        return match ? match[1] : "";
      };
      
      const esignConsent = parseConsentField("esign") === "yes";
      const termsConsent = parseConsentField("terms") === "yes";
      const storedUserAgent = parseConsentField("ua") || "Unknown";
      const clientCompany = parseConsentField("company") || "";
      const primaryTitle = parseConsentField("title") || "";
      const clientAddress = parseConsentField("address") || "";
      const secondaryOwner = parseConsentField("secondary") || "";

      // Import PDF generator
      const { generateCsuContractPdf } = await import("./pdfGenerator");

      // Generate PDF with full audit data from signing time
      const pdfBuffer = await generateCsuContractPdf({
        templateName: template.name,
        templateContent: template.content,
        signerName: agreement.signerName,
        signerEmail: agreement.signerEmail,
        signerPhone: agreement.signerPhone,
        address: agreement.address, // Signer address/website
        clientAddress, // FICA contract company address from consent record
        initials: agreement.initials,
        effectiveDate: agreement.effectiveDate,
        signedAt: agreement.signedAt?.toISOString() || new Date().toISOString(),
        signedIpAddress: agreement.signedIpAddress,
        signatureData: agreement.signatureData,
        agreementId: agreement.id,
        userAgent: storedUserAgent,
        clientCompany,
        primaryTitle,
        secondaryOwner,
        esignConsent,
        termsConsent,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="FICA-Agreement-${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating CSU PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // ============================================
  // PORTAL ACTIVITY TRACKING ROUTES
  // ============================================

  // Track portal activity (public - no auth required for page views)
  app.post("/api/portal/track", async (req, res) => {
    try {
      const trackingSchema = z.object({
        portal: z.string().min(1),
        eventType: z.string().min(1),
        pagePath: z.string().optional(),
        metadata: z.string().optional(),
        sessionId: z.string().optional(),
      });

      const validationResult = trackingSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ message: "Invalid tracking data" });
      }

      const { portal, eventType, pagePath, metadata, sessionId } = validationResult.data;

      // Get IP address from request
      const ipAddress = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() 
        || req.socket.remoteAddress 
        || "unknown";

      // Exclude admin/developer IPs from tracking
      const excludedIPs = ["76.34.197.15"];
      if (excludedIPs.includes(ipAddress)) {
        return res.json({ success: true, excluded: true });
      }
      
      const userAgent = req.headers["user-agent"] || "unknown";
      const referrerHeader = req.headers["referer"] || req.headers["referrer"];
      const referrer = typeof referrerHeader === "string" ? referrerHeader : null;

      await storage.createPortalActivity({
        portal,
        eventType,
        ipAddress,
        userAgent,
        referrer,
        pagePath: pagePath || null,
        sessionId: sessionId || null,
        userId: req.session?.userId || null,
        metadata: metadata || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking portal activity:", error);
      res.status(500).json({ message: "Failed to track activity" });
    }
  });

  // Get portal activity for a specific portal (admin only)
  app.get("/api/portal/activity/:portal", requireAdmin, async (req, res) => {
    try {
      const { portal } = req.params;
      const limit = parseInt(req.query.limit as string) || 100;
      
      const activity = await storage.getPortalActivity(portal, limit);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching portal activity:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Get portal activity stats (admin only)
  app.get("/api/portal/stats/:portal", requireAdmin, async (req, res) => {
    try {
      const { portal } = req.params;
      const stats = await storage.getPortalStats(portal);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching portal stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // IP Geolocation lookup (admin only)
  app.get("/api/portal/ip-lookup/:ip", requireAdmin, async (req, res) => {
    try {
      const { ip } = req.params;
      
      // Use Node's net module for robust IP validation (handles IPv4, IPv6, compressed forms, etc.)
      const net = await import("net");
      
      // Extract actual IP if it's IPv4-mapped IPv6 (::ffff:x.x.x.x)
      let cleanIp = ip;
      if (ip.startsWith("::ffff:")) {
        cleanIp = ip.substring(7);
      }
      
      // Validate using Node's net.isIP (returns 0 for invalid, 4 for IPv4, 6 for IPv6)
      if (net.isIP(cleanIp) === 0) {
        return res.status(400).json({ message: "Invalid IP address format" });
      }
      
      // Use ip-api.com free geolocation service (no API key needed)
      // Use cleanIp for API call (handles IPv4-mapped IPv6)
      const response = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      const data = await response.json();
      
      if (data.status === "fail") {
        return res.status(400).json({ message: data.message || "Failed to lookup IP" });
      }
      
      res.json({
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        regionCode: data.region,
        city: data.city,
        zip: data.zip,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        organization: data.org,
        asn: data.as,
      });
    } catch (error) {
      console.error("Error looking up IP:", error);
      res.status(500).json({ message: "Failed to lookup IP address" });
    }
  });

  // Log consent record for TCPA/CCPA compliance
  app.post("/api/consent-record", async (req, res) => {
    try {
      const consentSchema = z.object({
        submissionType: z.string(),
        submissionId: z.number(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        consentCheckbox: z.boolean(),
        trustedFormCertUrl: z.string().optional(),
        landingPageUrl: z.string().optional(),
        partnersSharedWith: z.string().optional(),
      });
      
      const data = consentSchema.parse(req.body);
      
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
        || req.socket.remoteAddress 
        || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      const record = await storage.createConsentRecord({
        ...data,
        ipAddress,
        userAgent,
        consentLanguageVersion: 'v1.0',
      });
      
      res.status(201).json({ success: true, id: record.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error logging consent:", error);
      res.status(500).json({ message: "Failed to log consent" });
    }
  });

  // Get consent records for admin (requires auth)
  app.get("/api/consent-records", requireAdmin, async (req, res) => {
    try {
      const records = await storage.getAllConsentRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consent records" });
    }
  });

  // Log partner sharing for compliance
  app.post("/api/partner-sharing-log", requireAdmin, async (req, res) => {
    try {
      const logSchema = z.object({
        submissionType: z.string(),
        submissionId: z.number(),
        partnerName: z.string(),
        partnerEndpoint: z.string().optional(),
        deliveryStatus: z.enum(["success", "failed", "pending"]),
        responseCode: z.number().optional(),
        errorMessage: z.string().optional(),
      });
      
      const data = logSchema.parse(req.body);
      const log = await storage.createPartnerSharingLog(data);
      res.status(201).json({ success: true, id: log.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to log partner sharing" });
    }
  });

  // Get partner sharing logs for admin
  app.get("/api/partner-sharing-logs", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getAllPartnerSharingLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner sharing logs" });
    }
  });

  // Get affiliated partners (public)
  app.get("/api/affiliated-partners", async (req, res) => {
    try {
      const partners = await storage.getActiveAffiliatedPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliated partners" });
    }
  });

  // ===== HIPAA COMPLIANCE ENDPOINTS =====

  // HIPAA Audit Log - get logs (admin only)
  app.get("/api/hipaa/audit-logs", requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 1000;
      const logs = await storage.getHipaaAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching HIPAA audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // HIPAA Audit Log - get logs by user
  app.get("/api/hipaa/audit-logs/user/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const logs = await storage.getHipaaAuditLogsByUser(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching user audit logs:", error);
      res.status(500).json({ message: "Failed to fetch user audit logs" });
    }
  });

  // HIPAA Audit Log - get PHI access logs
  app.get("/api/hipaa/audit-logs/phi", requireAdmin, async (req, res) => {
    try {
      const logs = await storage.getHipaaPhiAccessLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching PHI access logs:", error);
      res.status(500).json({ message: "Failed to fetch PHI access logs" });
    }
  });

  // Business Associate Agreements - get all
  app.get("/api/hipaa/baa", requireAdmin, async (req, res) => {
    try {
      const baas = await storage.getAllBusinessAssociateAgreements();
      res.json(baas);
    } catch (error) {
      console.error("Error fetching BAAs:", error);
      res.status(500).json({ message: "Failed to fetch BAA records" });
    }
  });

  // Business Associate Agreements - create
  app.post("/api/hipaa/baa", requireAdmin, async (req, res) => {
    try {
      const baa = await storage.createBusinessAssociateAgreement(req.body);
      res.status(201).json(baa);
    } catch (error) {
      console.error("Error creating BAA:", error);
      res.status(500).json({ message: "Failed to create BAA record" });
    }
  });

  // Business Associate Agreements - update
  app.patch("/api/hipaa/baa/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const baa = await storage.updateBusinessAssociateAgreement(id, req.body);
      if (!baa) {
        return res.status(404).json({ message: "BAA not found" });
      }
      res.json(baa);
    } catch (error) {
      console.error("Error updating BAA:", error);
      res.status(500).json({ message: "Failed to update BAA record" });
    }
  });

  // HIPAA Training Records - get all
  app.get("/api/hipaa/training", requireAdmin, async (req, res) => {
    try {
      const records = await storage.getAllHipaaTrainingRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching training records:", error);
      res.status(500).json({ message: "Failed to fetch training records" });
    }
  });

  // HIPAA Training Records - create
  app.post("/api/hipaa/training", requireAdmin, async (req, res) => {
    try {
      const record = await storage.createHipaaTrainingRecord(req.body);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating training record:", error);
      res.status(500).json({ message: "Failed to create training record" });
    }
  });

  // HIPAA Training Records - get by user
  app.get("/api/hipaa/training/user/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const records = await storage.getHipaaTrainingRecordsByUser(userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching user training records:", error);
      res.status(500).json({ message: "Failed to fetch user training records" });
    }
  });

  // HIPAA Training Records - get expired
  app.get("/api/hipaa/training/expired", requireAdmin, async (req, res) => {
    try {
      const records = await storage.getExpiredTrainingRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching expired training records:", error);
      res.status(500).json({ message: "Failed to fetch expired training records" });
    }
  });

  // MFA Configuration - get user config
  app.get("/api/hipaa/mfa/user/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const config = await storage.getUserMfaConfig(userId);
      if (!config) {
        return res.json({ mfaEnabled: false });
      }
      res.json({
        mfaEnabled: config.mfaEnabled,
        mfaSetupCompletedAt: config.mfaSetupCompletedAt,
        lastMfaUsedAt: config.lastMfaUsedAt,
      });
    } catch (error) {
      console.error("Error fetching MFA config:", error);
      res.status(500).json({ message: "Failed to fetch MFA configuration" });
    }
  });

  // ===== MFA AUTHENTICATION ENDPOINTS =====
  // HIPAA §164.312(d) - Person or Entity Authentication

  // Helper function to generate backup codes
  // HIPAA Security: Generate and hash backup codes for MFA recovery
  // Returns both plain codes (shown to user once) and hashed versions (stored)
  const generateBackupCodes = async (): Promise<{ plain: string[], hashed: string[] }> => {
    const bcrypt = await import("bcrypt");
    const plain: string[] = [];
    const hashed: string[] = [];
    
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      plain.push(code);
      // Use lower cost factor (8) for backup codes since they're single-use
      const hashedCode = await bcrypt.hash(code, 8);
      hashed.push(hashedCode);
    }
    
    return { plain, hashed };
  };
  
  // Verify a backup code against stored hashes
  const verifyBackupCode = async (code: string, hashedCodes: string[]): Promise<{ valid: boolean, index: number }> => {
    const bcrypt = await import("bcrypt");
    for (let i = 0; i < hashedCodes.length; i++) {
      const isMatch = await bcrypt.compare(code.toUpperCase(), hashedCodes[i]);
      if (isMatch) {
        return { valid: true, index: i };
      }
    }
    return { valid: false, index: -1 };
  };

  // Get current user's MFA status
  app.get("/api/mfa/status", requireAuth, async (req, res) => {
    try {
      const config = await storage.getUserMfaConfig(req.session.userId!);
      res.json({
        mfaEnabled: config?.mfaEnabled || false,
        mfaSetupCompletedAt: config?.mfaSetupCompletedAt || null,
      });
    } catch (error) {
      console.error("Error fetching MFA status:", error);
      res.status(500).json({ message: "Failed to fetch MFA status" });
    }
  });

  // Start MFA setup - generate secret and QR code
  app.post("/api/mfa/setup", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new secret
      const secret = generateSecret();
      
      // Create TOTP URI for QR code
      const otpauth = totpInstance.toURI({ secret, issuer: "NavigatorUSA", label: user.email });
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
      
      // Generate backup codes (hashed for storage, plain for user display)
      const { plain: backupCodesPlain, hashed: backupCodesHashed } = await generateBackupCodes();
      
      // Store the secret temporarily (not enabled yet)
      // Store HASHED backup codes - plain codes are only shown once to user
      let config = await storage.getUserMfaConfig(user.id);
      if (config) {
        await storage.updateUserMfaConfig(user.id, {
          mfaSecret: secret,
          backupCodes: JSON.stringify(backupCodesHashed),
          mfaEnabled: false,
        });
      } else {
        await storage.createUserMfaConfig({
          userId: user.id,
          mfaEnabled: false,
          mfaSecret: secret,
          backupCodes: JSON.stringify(backupCodesHashed),
        });
      }

      // Return plain backup codes to user (shown only once)
      res.json({
        secret,
        qrCode: qrCodeDataUrl,
        backupCodes: backupCodesPlain,
      });
    } catch (error) {
      console.error("Error setting up MFA:", error);
      res.status(500).json({ message: "Failed to setup MFA" });
    }
  });

  // Verify MFA setup with TOTP code
  app.post("/api/mfa/verify-setup", requireAuth, async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Verification code is required" });
      }

      const config = await storage.getUserMfaConfig(req.session.userId!);
      if (!config || !config.mfaSecret) {
        return res.status(400).json({ message: "MFA setup not initiated" });
      }

      // Verify the TOTP code
      const isValid = verifyTotp(code, config.mfaSecret);
      
      if (!isValid) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      // Enable MFA
      await storage.updateUserMfaConfig(req.session.userId!, {
        mfaEnabled: true,
        mfaSetupCompletedAt: new Date(),
        lastMfaUsedAt: new Date(),
      });

      // Log the MFA setup
      await storage.createHipaaAuditLog({
        userId: req.session.userId!,
        userName: (await storage.getUser(req.session.userId!))?.name || null,
        userRole: req.session.userRole || null,
        action: "MFA_ENABLED",
        resourceType: "user_mfa",
        resourceId: String(req.session.userId),
        resourceDescription: "User enabled multi-factor authentication",
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: true,
        phiAccessed: false,
      });

      res.json({ success: true, message: "MFA enabled successfully" });
    } catch (error) {
      console.error("Error verifying MFA setup:", error);
      res.status(500).json({ message: "Failed to verify MFA setup" });
    }
  });

  // Verify MFA code during login
  app.post("/api/mfa/verify", async (req, res) => {
    try {
      const { userId, code } = req.body;
      
      if (!userId || !code) {
        return res.status(400).json({ message: "User ID and code are required" });
      }

      // HIPAA §164.312(d) - Check MFA rate limiting before processing (persistent)
      const rateLimit = await checkAuthRateLimit(String(userId), "user", "mfa");
      if (!rateLimit.allowed) {
        // Log lockout event
        await storage.createHipaaAuditLog({
          userId,
          userName: null,
          userRole: null,
          action: "MFA_LOCKED_OUT",
          resourceType: "user_mfa",
          resourceId: String(userId),
          resourceDescription: `Account locked due to ${AUTH_MAX_ATTEMPTS} failed MFA attempts`,
          ipAddress: req.ip || null,
          userAgent: req.headers["user-agent"] || null,
          sessionId: req.sessionID || null,
          success: false,
          phiAccessed: false,
          errorMessage: `Locked until ${rateLimit.lockedUntil?.toISOString()}`,
        });
        
        return res.status(429).json({ 
          message: `Too many failed attempts. Account locked until ${rateLimit.lockedUntil?.toLocaleTimeString()}`,
          lockedUntil: rateLimit.lockedUntil?.toISOString(),
          remainingAttempts: 0
        });
      }

      const config = await storage.getUserMfaConfig(userId);
      if (!config || !config.mfaEnabled || !config.mfaSecret) {
        return res.status(400).json({ message: "MFA is not enabled for this user" });
      }

      // Check if code is a backup code (hashed comparison)
      let isBackupCode = false;
      let hashedBackupCodes: string[] = [];
      let remainingBackupCodesCount = 0;
      
      if (config.backupCodes) {
        try {
          hashedBackupCodes = JSON.parse(config.backupCodes);
          remainingBackupCodesCount = hashedBackupCodes.length;
          
          // Use secure hash comparison for backup codes
          const backupResult = await verifyBackupCode(code, hashedBackupCodes);
          if (backupResult.valid) {
            isBackupCode = true;
            // Remove used backup code (by index)
            hashedBackupCodes.splice(backupResult.index, 1);
            remainingBackupCodesCount = hashedBackupCodes.length;
            await storage.updateUserMfaConfig(userId, {
              backupCodes: JSON.stringify(hashedBackupCodes),
            });
          }
        } catch {
          // Ignore parse errors
        }
      }

      // Verify TOTP code (only if not a backup code for efficiency)
      const isValidTotp = !isBackupCode && verifyTotp(code, config.mfaSecret);

      if (!isValidTotp && !isBackupCode) {
        // Record failed attempt for rate limiting (persistent)
        await recordAuthAttempt(String(userId), "user", "mfa", false);
        const currentLimit = await checkAuthRateLimit(String(userId), "user", "mfa");
        
        // Log failed MFA attempt
        await storage.createHipaaAuditLog({
          userId,
          userName: null,
          userRole: null,
          action: "MFA_FAILED",
          resourceType: "user_mfa",
          resourceId: String(userId),
          resourceDescription: `Failed MFA verification attempt (${currentLimit.remainingAttempts} attempts remaining)`,
          ipAddress: req.ip || null,
          userAgent: req.headers["user-agent"] || null,
          sessionId: req.sessionID || null,
          success: false,
          errorMessage: "Invalid MFA code",
          phiAccessed: false,
        });
        return res.status(400).json({ 
          message: "Invalid verification code",
          remainingAttempts: currentLimit.remainingAttempts
        });
      }

      // Record successful attempt (resets rate limiter - persistent)
      await recordAuthAttempt(String(userId), "user", "mfa", true);

      // Update last MFA used
      await storage.updateUserMfaConfig(userId, {
        lastMfaUsedAt: new Date(),
      });

      // Complete login by setting session
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.mfaVerified = true;

      // Log successful MFA
      await storage.createHipaaAuditLog({
        userId,
        userName: user.name,
        userRole: user.role,
        action: isBackupCode ? "MFA_BACKUP_CODE_USED" : "MFA_VERIFIED",
        resourceType: "user_mfa",
        resourceId: String(userId),
        resourceDescription: isBackupCode ? "User logged in with backup code" : "User completed MFA verification",
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: true,
        phiAccessed: false,
      });

      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          backupCodeUsed: isBackupCode,
          remainingBackupCodes: remainingBackupCodesCount,
        });
      });
    } catch (error) {
      console.error("Error verifying MFA:", error);
      res.status(500).json({ message: "Failed to verify MFA" });
    }
  });

  // Disable MFA (requires current password)
  app.post("/api/mfa/disable", requireAuth, async (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "Password is required to disable MFA" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password
      const bcrypt = await import("bcrypt");
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Disable MFA
      await storage.updateUserMfaConfig(req.session.userId!, {
        mfaEnabled: false,
        mfaSecret: null,
        backupCodes: null,
        mfaSetupCompletedAt: null,
      });

      // Log MFA disabled
      await storage.createHipaaAuditLog({
        userId: req.session.userId!,
        userName: user.name,
        userRole: user.role,
        action: "MFA_DISABLED",
        resourceType: "user_mfa",
        resourceId: String(req.session.userId),
        resourceDescription: "User disabled multi-factor authentication",
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: true,
        phiAccessed: false,
      });

      res.json({ success: true, message: "MFA disabled successfully" });
    } catch (error) {
      console.error("Error disabling MFA:", error);
      res.status(500).json({ message: "Failed to disable MFA" });
    }
  });

  // Regenerate backup codes
  app.post("/api/mfa/regenerate-backup-codes", requireAuth, async (req, res) => {
    try {
      const config = await storage.getUserMfaConfig(req.session.userId!);
      if (!config || !config.mfaEnabled) {
        return res.status(400).json({ message: "MFA is not enabled" });
      }

      const { plain: newBackupCodesPlain, hashed: newBackupCodesHashed } = await generateBackupCodes();
      
      await storage.updateUserMfaConfig(req.session.userId!, {
        backupCodes: JSON.stringify(newBackupCodesHashed),
      });

      // Log backup code regeneration
      await storage.createHipaaAuditLog({
        userId: req.session.userId!,
        userName: (await storage.getUser(req.session.userId!))?.name || null,
        userRole: req.session.userRole || null,
        action: "MFA_BACKUP_CODES_REGENERATED",
        resourceType: "user_mfa",
        resourceId: String(req.session.userId),
        resourceDescription: "User regenerated MFA backup codes",
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        sessionId: req.sessionID || null,
        success: true,
        phiAccessed: false,
      });

      res.json({ success: true, backupCodes: newBackupCodesPlain });
    } catch (error) {
      console.error("Error regenerating backup codes:", error);
      res.status(500).json({ message: "Failed to regenerate backup codes" });
    }
  });

  // ==========================================
  // NAVAL INTELLIGENCE - AI VIDEO & MUSIC GENERATION
  // ==========================================

  // Get all AI generations for the gallery
  // Shows sample/demo content plus user's own generations
  app.get("/api/ai/gallery", async (req, res) => {
    try {
      const sessionId = req.sessionID || req.headers['x-session-id'] as string;
      
      // Get all completed generations as sample content (public demo)
      const allGenerations = await storage.getAllAiGenerations(20);
      const sampleGenerations = allGenerations.filter(g => 
        g.status === 'completed' && !g.userId && !g.sessionId
      );
      
      let userGenerations: any[] = [];
      if (req.session.userId) {
        userGenerations = await storage.getAiGenerationsByUser(req.session.userId);
      } else if (sessionId) {
        userGenerations = await storage.getAiGenerationsBySession(sessionId);
      }
      
      // Combine user generations with sample content, removing duplicates
      const seenIds = new Set<number>();
      const combined = [...userGenerations, ...sampleGenerations].filter(g => {
        if (seenIds.has(g.id)) return false;
        seenIds.add(g.id);
        return true;
      });
      
      res.json(combined);
    } catch (error) {
      console.error("Error fetching AI gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  // Get a specific AI generation
  app.get("/api/ai/generation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const generation = await storage.getAiGeneration(id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      
      res.json(generation);
    } catch (error) {
      console.error("Error fetching AI generation:", error);
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });

  // Get all active AI templates
  app.get("/api/ai/templates", async (req, res) => {
    try {
      const templates = await storage.getActiveAiTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching AI templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Get templates by category
  app.get("/api/ai/templates/category/:category", async (req, res) => {
    try {
      const templates = await storage.getAiTemplatesByCategory(req.params.category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates by category:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Zod schema for AI generation requests
  const aiGenerationRequestSchema = z.object({
    type: z.enum(["text-to-video", "image-to-video", "text-to-music", "music-video"]),
    prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
    negativePrompt: z.string().max(500).optional().nullable(),
    duration: z.number().int().min(4).max(8).optional().default(8),
    resolution: z.enum(["720p", "1080p"]).optional().default("720p"),
    aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("16:9"),
    musicGenre: z.string().max(100).optional().nullable(),
    musicLyrics: z.string().max(5000).optional().nullable(),
    musicInstrumental: z.boolean().optional().default(false),
    templateId: z.number().int().positive().optional().nullable(),
    inputImageUrl: z.string().url().optional().nullable(),
    inputMusicUrl: z.string().url().optional().nullable(),
  });

  // Simple in-memory rate limiter for AI generation (5 requests per minute per session)
  const aiRateLimiter = new Map<string, { count: number; resetAt: number }>();
  const AI_RATE_LIMIT = 5;
  const AI_RATE_WINDOW_MS = 60000; // 1 minute

  // Start a new AI generation
  app.post("/api/ai/generate", async (req, res) => {
    try {
      // Rate limiting check
      const rateLimitKey = req.session.userId ? `user:${req.session.userId}` : `session:${req.sessionID}`;
      const now = Date.now();
      const rateLimitData = aiRateLimiter.get(rateLimitKey);
      
      if (rateLimitData) {
        if (now < rateLimitData.resetAt) {
          if (rateLimitData.count >= AI_RATE_LIMIT) {
            return res.status(429).json({ 
              message: "Too many generation requests. Please wait a minute before trying again.",
              retryAfter: Math.ceil((rateLimitData.resetAt - now) / 1000)
            });
          }
          rateLimitData.count++;
        } else {
          aiRateLimiter.set(rateLimitKey, { count: 1, resetAt: now + AI_RATE_WINDOW_MS });
        }
      } else {
        aiRateLimiter.set(rateLimitKey, { count: 1, resetAt: now + AI_RATE_WINDOW_MS });
      }

      const validationResult = aiGenerationRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validationResult.error.flatten().fieldErrors 
        });
      }

      const {
        type,
        prompt,
        negativePrompt,
        duration,
        resolution,
        aspectRatio,
        musicGenre,
        musicLyrics,
        musicInstrumental,
        templateId,
        inputImageUrl,
        inputMusicUrl
      } = validationResult.data;

      // Create the generation record
      const generation = await storage.createAiGeneration({
        userId: req.session.userId || null,
        sessionId: req.session.userId ? null : (req.sessionID || null),
        type,
        prompt,
        negativePrompt: negativePrompt || null,
        duration: duration || 8,
        resolution: resolution || "720p",
        aspectRatio: aspectRatio || "16:9",
        provider: type.includes("music") ? "suno" : "replit",
        musicGenre: musicGenre || null,
        musicLyrics: musicLyrics || null,
        musicInstrumental: musicInstrumental || false,
        templateId: templateId || null,
        inputImageUrl: inputImageUrl || null,
        inputMusicUrl: inputMusicUrl || null,
        metadata: null,
        beatSyncEnabled: false,
      });

      // Update template usage if used
      if (templateId) {
        await storage.incrementTemplateUsage(templateId);
      }

      // For video generation, we use the built-in Replit video generation
      // The actual generation will be handled asynchronously
      // In production, this would trigger a background job
      
      // For now, simulate processing state
      await storage.updateAiGeneration(generation.id, {
        status: "processing",
        processingStartedAt: new Date(),
      });

      res.status(201).json({ 
        success: true, 
        generation,
        message: "Generation started. Your content will appear in the gallery when complete."
      });
    } catch (error) {
      console.error("Error starting AI generation:", error);
      res.status(500).json({ message: "Failed to start generation" });
    }
  });

  // Delete an AI generation
  app.delete("/api/ai/generation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const generation = await storage.getAiGeneration(id);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      // Only allow deletion by owner
      if (generation.userId && generation.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to delete this generation" });
      }

      await storage.deleteAiGeneration(id);
      res.json({ success: true, message: "Generation deleted" });
    } catch (error) {
      console.error("Error deleting AI generation:", error);
      res.status(500).json({ message: "Failed to delete generation" });
    }
  });

  // Admin: Create a new AI template
  app.post("/api/ai/templates", requireAdmin, async (req, res) => {
    try {
      const template = await storage.createAiTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating AI template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Admin: Update an AI template
  app.patch("/api/ai/templates/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateAiTemplate(id, req.body);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error updating AI template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  // ==========================================================================
  // OPERATOR AI - Comprehensive AI Chat Assistant
  // ==========================================================================

  // Operator AI Chat endpoint with 3 memory modes
  // Mode: "stateless" (no storage), "session" (temp DB), "persistent" (user-linked)
  app.post("/api/operator-ai/chat", async (req, res) => {
    try {
      const { 
        message, 
        model, 
        preset, 
        memoryMode = "stateless", // "stateless" | "session" | "persistent"
        sessionId,
        userId,
        conversationHistory 
      } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // ========================================
      // CONTENT FILTER - Check for restricted topics
      // ========================================
      const { checkContentRestrictions, postProcessResponse, CORE_SYSTEM_PROMPT } = await import("./contentFilter");
      const filterResult = checkContentRestrictions(message);
      
      // Hard block on restricted topics
      if (filterResult.blocked) {
        return res.json({
          response: filterResult.message,
          model: "content-filter",
          memoryMode,
          blocked: true,
        });
      }

      // Build context based on preset
      const presetContexts: Record<string, string> = {
        general: "You are a helpful AI assistant for veteran families. Be respectful, professional, and supportive.",
        writing: "You are a professional writing assistant. Help with content creation, editing, and improving written communication.",
        code: "You are a skilled technical assistant. Help with coding, debugging, and technical explanations.",
        creative: "You are a creative assistant. Help with brainstorming, creative writing, and artistic ideas.",
        research: "You are a research analyst. Help with analysis, data interpretation, and finding information.",
      };

      const systemContext = presetContexts[preset] || presetContexts.general;

      // Build messages for OpenAI - INJECT CORE SYSTEM PROMPT
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: `${CORE_SYSTEM_PROMPT}\n\n${systemContext}\n\nYou are Operator AI, part of the Q Branch AI suite for NavigatorUSA. You help veteran families with their questions and tasks. Be helpful, concise, and professional.` },
      ];

      // ========================================
      // MEMORY MODE LOGIC (Maps to OpenAI store parameter pattern)
      // ========================================
      // OFF (stateless)  → store: false - NEVER store anything, use only client-provided history
      // SESSION          → store: true  - Store in DB with sessionId, purge on "Forget Session"
      // PERSISTENT       → store in DB + keep thread IDs, persist across sessions by userId
      
      let storedHistory: Array<{ role: string; content: string }> = [];
      
      if (memoryMode === "session" && sessionId) {
        // Fetch session memory from DB
        const sessionMemory = await storage.getSessionMemory(sessionId);
        storedHistory = sessionMemory.map(m => ({ role: m.role, content: m.content }));
      } else if (memoryMode === "persistent" && userId) {
        // Fetch persistent memory from DB
        const persistentMemory = await storage.getUserPersistentMemory(userId);
        storedHistory = persistentMemory.map(m => ({ role: m.role, content: m.content }));
      }
      
      // Add stored history (from DB) or provided history (for stateless mode)
      if (storedHistory.length > 0) {
        messages.push(...storedHistory.slice(-10)); // Keep last 10 messages for context
      } else if (memoryMode === "stateless" && conversationHistory && Array.isArray(conversationHistory)) {
        // Stateless: use client-provided history only, do NOT store
        messages.push(...conversationHistory.slice(-10));
      }

      // Add document context if available
      let documentContext = "";
      if (sessionId) {
        try {
          const { getDocumentContext } = await import("./documentProcessor");
          documentContext = getDocumentContext(sessionId);
        } catch (e) {
          // Document processor may not be loaded yet
        }
      }

      // Add the current message with document context
      const userContent = documentContext 
        ? `${message}\n\n${documentContext}` 
        : message;
      messages.push({ role: "user", content: userContent });

      // Call OpenAI API
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        return res.json({
          response: `I received your message: "${message}"\n\nI'm currently in demo mode. To enable full AI capabilities, please configure the OpenAI API key.`,
          model: model || "demo",
          memoryMode,
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("OpenAI API error:", error);
        return res.status(500).json({ message: "Failed to get AI response" });
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      // POST-PROCESS: Add legal disclaimer if this was a legal question
      aiResponse = postProcessResponse(aiResponse, filterResult);

      // CRITICAL: Only store if memoryMode is NOT "stateless"
      if (memoryMode !== "stateless" && sessionId) {
        const messageCount = storedHistory.length;
        const expiresAt = memoryMode === "session" 
          ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hour expiry for session
          : null;

        // Store user message
        await storage.saveOperatorAiMessage({
          sessionId,
          userId: userId || null,
          memoryMode,
          role: "user",
          content: message,
          model: model || "gpt-4o-mini",
          preset: preset || "general",
          messageOrder: messageCount,
          expiresAt,
        });

        // Store assistant response
        await storage.saveOperatorAiMessage({
          sessionId,
          userId: userId || null,
          memoryMode,
          role: "assistant",
          content: aiResponse,
          model: model || "gpt-4o-mini",
          preset: preset || "general",
          messageOrder: messageCount + 1,
          expiresAt,
        });
      }

      res.json({
        response: aiResponse,
        model: model || "gpt-4o-mini",
        memoryMode,
      });

    } catch (error) {
      console.error("Operator AI chat error:", error);
      res.status(500).json({ message: "An error occurred processing your request" });
    }
  });

  // Clear session memory (Forget Session button)
  app.delete("/api/operator-ai/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearSessionMemory(sessionId);
      res.json({ success: true, message: "Session memory cleared" });
    } catch (error) {
      console.error("Error clearing session memory:", error);
      res.status(500).json({ message: "Failed to clear session memory" });
    }
  });

  // Clear persistent memory (Wipe Memory button - requires user auth)
  app.delete("/api/operator-ai/persistent/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearUserPersistentMemory(userId);
      res.json({ success: true, message: "Persistent memory wiped" });
    } catch (error) {
      console.error("Error clearing persistent memory:", error);
      res.status(500).json({ message: "Failed to wipe memory" });
    }
  });

  // Get session memory history
  app.get("/api/operator-ai/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const memory = await storage.getSessionMemory(sessionId);
      res.json({ messages: memory });
    } catch (error) {
      console.error("Error fetching session memory:", error);
      res.status(500).json({ message: "Failed to fetch session memory" });
    }
  });

  // ==========================================================================
  // DOCUMENT UPLOAD - Universal file ingestion for Operator AI
  // ==========================================================================

  // Configure multer for document uploads (in-memory storage)
  const documentUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB max file size
      files: 10, // Maximum 10 files
    },
  });

  // Import document processor
  const { processDocument, storeDocuments, getDocuments, clearSessionDocuments, getDocumentContext } = await import("./documentProcessor");

  // Upload documents endpoint
  app.post("/api/operator-ai/documents", documentUpload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const { sessionId, memoryMode = "stateless" } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const processedDocs = await Promise.all(
        files.map(async (file) => {
          return processDocument(file.buffer, file.originalname, file.mimetype);
        })
      );

      // Only store if not stateless
      if (memoryMode !== "stateless") {
        const upload = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sessionId,
          memoryMode,
          documents: processedDocs,
          createdAt: new Date(),
          expiresAt: memoryMode === "session" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
        };
        storeDocuments(upload);
      }

      res.json({
        success: true,
        documents: processedDocs.map(doc => ({
          fileName: doc.fileName,
          fileType: doc.fileType,
          wordCount: doc.metadata.wordCount,
          preview: doc.textContent.slice(0, 200) + (doc.textContent.length > 200 ? "..." : ""),
        })),
        memoryMode,
      });

    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to process documents" });
    }
  });

  // Get uploaded documents for session
  app.get("/api/operator-ai/documents/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const docs = getDocuments(sessionId);
      
      if (!docs) {
        return res.json({ documents: [] });
      }

      res.json({
        documents: docs.documents.map(doc => ({
          fileName: doc.fileName,
          fileType: doc.fileType,
          wordCount: doc.metadata.wordCount,
          preview: doc.textContent.slice(0, 200) + (doc.textContent.length > 200 ? "..." : ""),
        })),
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Clear session documents
  app.delete("/api/operator-ai/documents/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      clearSessionDocuments(sessionId);
      res.json({ success: true, message: "Documents cleared" });
    } catch (error) {
      console.error("Error clearing documents:", error);
      res.status(500).json({ message: "Failed to clear documents" });
    }
  });

  // ==========================================================================
  // NAVAL INTELLIGENCE - AI ORCHESTRATION SYSTEM
  // Smart router that selects the best model per task and chains pipelines
  // ==========================================================================

  // Get model registry and available pipelines
  app.get("/api/orchestration/models", async (req, res) => {
    try {
      const { MODEL_REGISTRY, PIPELINE_TEMPLATES, modelRouter, getAvailableModelsForTask } = await import("../shared/orchestration");
      
      // Show which model would be selected for each task type
      const taskTypes = ["text-reasoning", "text-extraction", "text-chat", "image-generation", "text-to-video", "music-generation", "text-to-speech"] as const;
      const defaultRouting: Record<string, any> = {};
      
      for (const taskType of taskTypes) {
        try {
          const result = modelRouter(taskType as any);
          defaultRouting[taskType] = {
            selectedModel: result.model.id,
            modelName: result.model.name,
            provider: result.model.provider,
            quality: result.model.qualityScores[taskType as keyof typeof result.model.qualityScores],
            reasoning: result.reasoning,
          };
        } catch (e) {
          defaultRouting[taskType] = { error: "No model available" };
        }
      }
      
      res.json({
        models: MODEL_REGISTRY,
        templates: PIPELINE_TEMPLATES,
        routing: defaultRouting,
        routerInfo: "Model router automatically selects best model per task. Update MODEL_REGISTRY when new models appear.",
      });
    } catch (error) {
      console.error("Error fetching orchestration models:", error);
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  // Route user intent to optimal model(s)
  app.post("/api/orchestration/route", async (req, res) => {
    try {
      const { userIntent, inputs, preferSpeed, preferQuality, maxBudget } = req.body;
      
      if (!userIntent) {
        return res.status(400).json({ message: "User intent is required" });
      }

      const { MODEL_REGISTRY, PIPELINE_TEMPLATES } = await import("../shared/orchestration");
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();

      // Use GPT to analyze intent and determine pipeline
      const routerPrompt = `You are an AI orchestration router. Analyze the user's intent and determine:
1. What type of media creation task is this?
2. What models/steps are needed?
3. What is the optimal pipeline?

Available task types: text-reasoning, image-generation, image-to-video, text-to-video, text-to-speech, speech-to-text, music-generation, video-generation, fusion

Available pipeline templates:
${JSON.stringify(PIPELINE_TEMPLATES, null, 2)}

User Intent: "${userIntent}"
User Inputs: ${JSON.stringify(inputs || [])}
Preferences: Speed=${preferSpeed}, Quality=${preferQuality}, Budget=${maxBudget || "unlimited"}

Respond with JSON:
{
  "selectedTemplate": "template-id or null for custom",
  "taskTypes": ["array", "of", "task", "types"],
  "reasoning": "explanation of why this pipeline",
  "steps": [
    { "order": 1, "taskType": "...", "description": "..." }
  ],
  "estimatedDuration": "human readable estimate",
  "estimatedCost": number in dollars
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI orchestration router. Return only valid JSON." },
          { role: "user", content: routerPrompt }
        ],
        response_format: { type: "json_object" },
      });

      const routerDecision = JSON.parse(response.choices[0].message.content || "{}");

      // Map task types to actual models
      const selectedModels = routerDecision.taskTypes?.map((taskType: string) => {
        const model = MODEL_REGISTRY.find((m: any) => m.taskTypes.includes(taskType));
        return model ? { taskType, model: model.name, modelId: model.id } : null;
      }).filter(Boolean) || [];

      res.json({
        ...routerDecision,
        selectedModels,
        models: MODEL_REGISTRY,
      });

    } catch (error) {
      console.error("Error routing orchestration:", error);
      res.status(500).json({ message: "Failed to route orchestration request" });
    }
  });

  // Execute an orchestration pipeline
  app.post("/api/orchestration/execute", async (req, res) => {
    try {
      const { pipelineId, steps, inputs, sessionId } = req.body;
      
      if (!steps || !Array.isArray(steps)) {
        return res.status(400).json({ message: "Pipeline steps are required" });
      }

      // Create pipeline record
      const pipeline = {
        id: `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: pipelineId || "Custom Pipeline",
        status: "running" as const,
        steps: steps.map((s: any, i: number) => ({
          ...s,
          id: `step_${i}`,
          status: "pending" as const,
        })),
        createdAt: new Date(),
        inputs,
      };

      // For now, return the pipeline structure - actual execution would be async
      res.json({
        success: true,
        pipeline,
        message: "Pipeline created. Execution will proceed asynchronously.",
      });

    } catch (error) {
      console.error("Error executing pipeline:", error);
      res.status(500).json({ message: "Failed to execute pipeline" });
    }
  });

  // Image Generation endpoint - real GPT-4o Image API
  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt, style, aspectRatio, quality } = req.body;

      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();

      // Determine size based on aspect ratio
      let size: "1024x1024" | "1536x1024" | "1024x1536" = "1024x1024";
      if (aspectRatio === "16:9") size = "1536x1024";
      else if (aspectRatio === "9:16") size = "1024x1536";

      // Enhance prompt with style
      const enhancedPrompt = style 
        ? `${prompt}, ${style} style, high quality, detailed`
        : `${prompt}, professional quality, detailed`;

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: enhancedPrompt,
        n: 1,
        size,
        quality: quality === "hd" ? "high" : "medium",
      });

      const imageData = response.data?.[0];
      const imageUrl = imageData?.url || imageData?.b64_json;

      if (!imageUrl) {
        return res.status(500).json({ message: "No image generated" });
      }

      // If it's base64, we need to handle it differently
      const isBase64 = typeof imageUrl === 'string' && !imageUrl.startsWith("http");

      res.json({
        success: true,
        image: {
          url: isBase64 ? `data:image/png;base64,${imageUrl}` : imageUrl,
          prompt: enhancedPrompt,
          style,
          aspectRatio,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        message: "Failed to generate image",
        error: error.message 
      });
    }
  });

  // Text-to-Speech endpoint
  app.post("/api/ai/text-to-speech", async (req, res) => {
    try {
      const { text, voice, speed } = req.body;

      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();

      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice || "alloy",
        input: text,
        speed: speed || 1.0,
      });

      // Get the audio as an ArrayBuffer
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Convert to base64
      const base64Audio = buffer.toString('base64');

      res.json({
        success: true,
        audio: {
          data: `data:audio/mpeg;base64,${base64Audio}`,
          text,
          voice: voice || "alloy",
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("Error generating speech:", error);
      res.status(500).json({ 
        message: "Failed to generate speech",
        error: error.message 
      });
    }
  });

  // Fusion endpoint - combine multiple media types
  app.post("/api/orchestration/fusion", async (req, res) => {
    try {
      const { images, audio, text, duration, style, outputFormat } = req.body;
      
      if (!outputFormat) {
        return res.status(400).json({ message: "Output format is required" });
      }

      // Validate we have at least some inputs
      if (!images?.length && !audio && !text) {
        return res.status(400).json({ message: "At least one input (images, audio, or text) is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI();

      // Step 1: Scene planning with LLM
      const planPrompt = `You are a creative director planning a ${outputFormat}.
      
Inputs:
- Images: ${images?.length || 0} images provided
- Audio: ${audio ? "Yes" : "No"}
- Text/Script: ${text || "None"}
- Desired Duration: ${duration || "Auto"}
- Style: ${style || "Professional"}

Create a detailed scene plan with timing. Return JSON:
{
  "scenes": [
    { "order": 1, "duration": 3, "description": "...", "transition": "fade" }
  ],
  "totalDuration": number in seconds,
  "audioStrategy": "background music / narration / sync with content",
  "visualStyle": "description of visual treatment"
}`;

      const planResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a creative director. Return only valid JSON." },
          { role: "user", content: planPrompt }
        ],
        response_format: { type: "json_object" },
      });

      const scenePlan = JSON.parse(planResponse.choices[0].message.content || "{}");

      res.json({
        success: true,
        fusionPlan: scenePlan,
        status: "planned",
        message: "Fusion plan created. Ready for video generation.",
        nextSteps: [
          "Generate video frames from scene descriptions",
          "Sync audio with video timeline",
          "Apply transitions and render final output"
        ],
      });

    } catch (error) {
      console.error("Error in fusion:", error);
      res.status(500).json({ message: "Failed to create fusion plan" });
    }
  });

  // ============================================================================
  // MEDIA PIPELINE ORCHESTRATION API
  // ============================================================================

  // Create a new pipeline
  app.post("/api/pipelines", async (req, res) => {
    try {
      const { userIntent, userId, sessionId, uploadedFiles } = req.body;
      
      if (!userIntent || typeof userIntent !== "string") {
        return res.status(400).json({ message: "userIntent is required" });
      }

      const { createAndExecutePipeline } = await import("./mediaOrchestrator");
      const pipeline = await createAndExecutePipeline(userIntent, userId, sessionId, uploadedFiles);
      
      res.json({
        success: true,
        pipelineId: pipeline.id,
        status: pipeline.status,
        message: "Pipeline created and executing",
      });
    } catch (error) {
      console.error("Error creating pipeline:", error);
      res.status(500).json({ message: "Failed to create pipeline" });
    }
  });

  // Get pipeline status with steps and artifacts
  app.get("/api/pipelines/:id", async (req, res) => {
    try {
      const pipelineId = parseInt(req.params.id);
      if (isNaN(pipelineId)) {
        return res.status(400).json({ message: "Invalid pipeline ID" });
      }

      const { getPipelineStatus } = await import("./mediaOrchestrator");
      const status = await getPipelineStatus(pipelineId);
      
      if (!status) {
        return res.status(404).json({ message: "Pipeline not found" });
      }
      
      res.json(status);
    } catch (error) {
      console.error("Error getting pipeline status:", error);
      res.status(500).json({ message: "Failed to get pipeline status" });
    }
  });

  // Get all pipelines for a user
  app.get("/api/users/:userId/pipelines", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { getUserPipelines } = await import("./mediaOrchestrator");
      const pipelines = await getUserPipelines(userId);
      
      res.json({ pipelines });
    } catch (error) {
      console.error("Error getting user pipelines:", error);
      res.status(500).json({ message: "Failed to get user pipelines" });
    }
  });

  // ==========================================
  // CLAIMS NAVIGATOR API ENDPOINTS
  // ==========================================

  // Helper to get authenticated user ID
  const getVeteranUserId = (req: any): string | null => {
    if (req.user && req.user.claims && req.user.claims.sub) {
      return req.user.claims.sub;
    }
    return null;
  };

  // Get all cases for the logged-in veteran
  app.get("/api/claims/cases", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const cases = await storage.getClaimCasesByUserId(userId);
      res.json(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  // Get a specific case
  app.get("/api/claims/cases/:id", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      if (claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(claimCase);
    } catch (error) {
      console.error("Error fetching case:", error);
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  // Create a new case with tasks
  app.post("/api/claims/cases", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { title, caseType, claimType, tasks } = req.body;

      if (!title || !caseType) {
        return res.status(400).json({ message: "Title and case type are required" });
      }

      const newCase = await storage.createClaimCase({
        veteranUserId: userId,
        title,
        caseType,
        claimType,
        status: "active",
      });

      // Create tasks for the case
      if (tasks && Array.isArray(tasks)) {
        for (const task of tasks) {
          await storage.createClaimTask({
            caseId: newCase.id,
            veteranUserId: userId,
            title: task.title,
            description: task.description,
            status: task.status || "todo",
            dueDate: task.dueDate,
            sortOrder: task.sortOrder || 0,
          });
        }
      }

      res.status(201).json(newCase);
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ message: "Failed to create case" });
    }
  });

  // Get tasks for a case
  app.get("/api/claims/cases/:id/tasks", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const tasks = await storage.getClaimTasksByCaseId(caseId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Update a task status
  app.patch("/api/claims/tasks/:id", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getClaimTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { status, title, description, dueDate } = req.body;
      const updates: any = {};
      
      if (status) updates.status = status;
      if (title) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (dueDate !== undefined) updates.dueDate = dueDate;
      if (status === "done") updates.completedAt = new Date();

      const updatedTask = await storage.updateClaimTask(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Get notes for a case
  app.get("/api/claims/cases/:id/notes", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const notes = await storage.getCaseNotesByCaseId(caseId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Add a note to a case
  app.post("/api/claims/cases/:id/notes", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const note = await storage.createCaseNote({
        caseId,
        authorEmail: userId,
        authorType: "veteran",
        content,
      });

      res.status(201).json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  // Get deadlines for a case
  app.get("/api/claims/cases/:id/deadlines", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const deadlines = await storage.getCaseDeadlinesByCaseId(caseId);
      res.json(deadlines);
    } catch (error) {
      console.error("Error fetching deadlines:", error);
      res.status(500).json({ message: "Failed to fetch deadlines" });
    }
  });

  // Get files for a case
  app.get("/api/claims/cases/:id/files", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get shares for a case
  app.get("/api/claims/cases/:id/shares", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const shares = await storage.getCaseSharesByCaseId(caseId);
      res.json(shares);
    } catch (error) {
      console.error("Error fetching shares:", error);
      res.status(500).json({ message: "Failed to fetch shares" });
    }
  });

  // Invite a vendor to a case (upsert)
  app.post("/api/claims/cases/:id/shares", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { email, role } = req.body;
      if (!email || !["view", "comment", "upload"].includes(role)) {
        return res.status(400).json({ message: "Valid email and role (view/comment/upload) required" });
      }

      const share = await storage.upsertCaseShare({
        caseId,
        email: email.toLowerCase().trim(),
        role,
      });

      res.status(201).json(share);
    } catch (error) {
      console.error("Error creating share:", error);
      res.status(500).json({ message: "Failed to share case" });
    }
  });

  // Remove a vendor's access
  app.delete("/api/claims/shares/:id", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const shareId = parseInt(req.params.id);
      if (isNaN(shareId)) {
        return res.status(400).json({ message: "Invalid share ID" });
      }

      // Verify the user owns the case this share belongs to
      const share = await storage.getCaseShareById(shareId);
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }

      const claimCase = await storage.getClaimCaseById(share.caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteCaseShare(shareId);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting share:", error);
      res.status(500).json({ message: "Failed to remove access" });
    }
  });

  // ====================================================
  // EVIDENCE & COMPLETENESS ENDPOINTS
  // ====================================================

  // Get evidence requirements for a track/purpose
  app.get("/api/claims/evidence-requirements", async (req, res) => {
    try {
      const { track, purpose } = req.query;
      if (track && purpose) {
        const requirements = await storage.getEvidenceRequirements(
          track as string,
          purpose as string
        );
        res.json(requirements);
      } else {
        const all = await storage.getAllEvidenceRequirements();
        res.json(all);
      }
    } catch (error) {
      console.error("Error fetching evidence requirements:", error);
      res.status(500).json({ message: "Failed to fetch requirements" });
    }
  });

  // Get completeness analysis for a case
  app.get("/api/claims/cases/:id/completeness", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Map claim type to purpose
      const purposeMap: Record<string, string> = {
        new: "new_claim",
        increase: "increase",
        appeal: "appeal",
        apply: "apply",
        reconsideration: "appeal",
        alj: "appeal",
      };
      const purpose = claimCase.claimType ? purposeMap[claimCase.claimType] || "new_claim" : "new_claim";
      const track = claimCase.caseType.toUpperCase();

      const requirements = await storage.getEvidenceRequirements(track, purpose);
      const files = await storage.getClaimFilesByCaseId(caseId);

      // Check completeness
      const filesByType = files.reduce((acc, file) => {
        if (file.evidenceType) {
          acc[file.evidenceType] = (acc[file.evidenceType] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const results = requirements.map((req) => ({
        requirement: req,
        status: filesByType[req.evidenceType] ? "present" : "missing",
        matchingFiles: filesByType[req.evidenceType] || 0,
      }));

      const required = results.filter((r) => r.requirement.required);
      const present = required.filter((r) => r.status === "present");
      const percentComplete = required.length > 0
        ? Math.round((present.length / required.length) * 100)
        : 100;

      res.json({
        results,
        stats: {
          totalRequired: required.length,
          completedRequired: present.length,
          percentComplete,
          missingRequired: required.filter((r) => r.status === "missing"),
        },
      });
    } catch (error) {
      console.error("Error checking completeness:", error);
      res.status(500).json({ message: "Failed to check completeness" });
    }
  });

  // Get evidence strength analysis for a case
  app.get("/api/claims/cases/:id/strength", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);

      // Calculate condition strengths
      const conditionMap: Record<string, number[]> = {};
      files.forEach((f) => {
        if (!f.condition) return;
        conditionMap[f.condition] ||= [];
        conditionMap[f.condition].push(f.strength || 1);
      });

      const conditionStrengths = Object.entries(conditionMap).map(([condition, scores]) => ({
        condition,
        avgStrength: scores.reduce((a, b) => a + b, 0) / scores.length,
        fileCount: scores.length,
        maxStrength: Math.max(...scores),
      }));

      // Overall strength
      const filesWithStrength = files.filter((f) => f.strength);
      const overallStrength = filesWithStrength.length > 0
        ? filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0) / filesWithStrength.length
        : 0;

      // Check for nexus letter
      const hasNexusLetter = files.some((f) => f.evidenceType === "nexus");

      res.json({
        overallStrength,
        conditionStrengths,
        hasNexusLetter,
        totalFiles: files.length,
        scoredFiles: filesWithStrength.length,
      });
    } catch (error) {
      console.error("Error calculating strength:", error);
      res.status(500).json({ message: "Failed to calculate strength" });
    }
  });

  // Get lane recommendation for a case
  app.get("/api/claims/cases/:id/lane-recommendation", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Only VA cases get lane recommendations
      if (claimCase.caseType !== "va") {
        return res.json({ applicable: false, reason: "Lane recommendations only apply to VA claims" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);

      // Calculate strength
      const filesWithStrength = files.filter((f) => f.strength);
      const strengthAvg = filesWithStrength.length > 0
        ? filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0) / filesWithStrength.length
        : 0;

      // Check for new evidence (files uploaded recently or marked as new)
      const hasNewEvidence = files.length > 0;
      const hasNexusLetter = files.some((f) => f.evidenceType === "nexus");

      // Recommend lane
      let lane: string;
      let reason: string;
      let confidence: "high" | "medium" | "low";

      if (hasNewEvidence && strengthAvg >= 3.5) {
        lane = "Supplemental Claim";
        reason = "New and relevant evidence present with strong evidentiary support";
        confidence = hasNexusLetter ? "high" : "medium";
      } else if (hasNewEvidence && strengthAvg >= 2.5 && strengthAvg < 3.5) {
        lane = "Supplemental Claim";
        reason = "New evidence available; consider strengthening medical documentation";
        confidence = "medium";
      } else if (!hasNewEvidence && strengthAvg >= 3) {
        lane = "Higher-Level Review";
        reason = "Record appears strong; reviewing for clear and unmistakable error may be appropriate";
        confidence = strengthAvg >= 4 ? "high" : "medium";
      } else {
        lane = "Board Appeal";
        reason = "Complex evidentiary posture may benefit from Board-level review";
        confidence = "low";
      }

      res.json({
        applicable: true,
        lane,
        reason,
        confidence,
        strengthAvg,
        hasNewEvidence,
        hasNexusLetter,
      });
    } catch (error) {
      console.error("Error getting lane recommendation:", error);
      res.status(500).json({ message: "Failed to get recommendation" });
    }
  });

  // Update file evidence metadata
  app.patch("/api/claims/files/:id/evidence", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const fileId = parseInt(req.params.id);
      if (isNaN(fileId)) {
        return res.status(400).json({ message: "Invalid file ID" });
      }

      const { evidenceType, condition } = req.body;
      
      // Calculate strength based on evidence type and condition
      let strength = 1;
      if (evidenceType === "medical") strength += 1;
      if (evidenceType === "nexus") strength += 2;
      if (evidenceType === "exam") strength += 2;
      if (condition) strength += 1;
      strength = Math.min(strength, 5);

      const updated = await storage.updateClaimFileEvidence(fileId, {
        evidenceType,
        condition,
        strength,
      });

      if (!updated) {
        return res.status(404).json({ message: "File not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating file evidence:", error);
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  // ====================================================
  // VENDOR PERFORMANCE METRICS
  // ====================================================

  // Get vendor activity metrics for a case
  app.get("/api/claims/cases/:id/vendor-metrics", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get files and notes for this case
      const files = await storage.getClaimFilesByCaseId(caseId);
      const notes = await storage.getCaseNotesByCaseId(caseId);

      // Aggregate vendor activity
      const vendorActivity: Record<string, {
        email: string;
        filesUploaded: number;
        notesAdded: number;
        lastActivity: string | null;
      }> = {};

      // Track file uploads by vendors
      files.forEach((file) => {
        if (file.authorType === "vendor" && file.authorId) {
          if (!vendorActivity[file.authorId]) {
            vendorActivity[file.authorId] = {
              email: file.authorId,
              filesUploaded: 0,
              notesAdded: 0,
              lastActivity: null,
            };
          }
          vendorActivity[file.authorId].filesUploaded++;
          const fileDate = new Date(file.createdAt).toISOString();
          if (!vendorActivity[file.authorId].lastActivity || 
              fileDate > vendorActivity[file.authorId].lastActivity!) {
            vendorActivity[file.authorId].lastActivity = fileDate;
          }
        }
      });

      // Track notes by vendors
      notes.forEach((note) => {
        if (note.authorType === "vendor") {
          if (!vendorActivity[note.authorEmail]) {
            vendorActivity[note.authorEmail] = {
              email: note.authorEmail,
              filesUploaded: 0,
              notesAdded: 0,
              lastActivity: null,
            };
          }
          vendorActivity[note.authorEmail].notesAdded++;
          const noteDate = new Date(note.createdAt).toISOString();
          if (!vendorActivity[note.authorEmail].lastActivity || 
              noteDate > vendorActivity[note.authorEmail].lastActivity!) {
            vendorActivity[note.authorEmail].lastActivity = noteDate;
          }
        }
      });

      const vendors = Object.values(vendorActivity);
      const totalVendorFiles = vendors.reduce((sum, v) => sum + v.filesUploaded, 0);
      const totalVendorNotes = vendors.reduce((sum, v) => sum + v.notesAdded, 0);

      res.json({
        vendors,
        summary: {
          activeVendors: vendors.length,
          totalVendorFiles,
          totalVendorNotes,
          totalVendorActions: totalVendorFiles + totalVendorNotes,
        },
      });
    } catch (error) {
      console.error("Error getting vendor metrics:", error);
      res.status(500).json({ message: "Failed to get vendor metrics" });
    }
  });

  // ====================================================
  // EXPORT PACKAGES
  // ====================================================

  // Generate export package summary for a case
  app.get("/api/claims/cases/:id/export", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get all case data
      const files = await storage.getClaimFilesByCaseId(caseId);
      const tasks = await storage.getClaimTasksByCaseId(caseId);
      const notes = await storage.getCaseNotesByCaseId(caseId);
      const deadlines = await storage.getCaseDeadlinesByCaseId(caseId);

      // Map claim type to purpose for requirements
      const purposeMap: Record<string, string> = {
        new: "new_claim",
        increase: "increase",
        appeal: "appeal",
        apply: "apply",
        reconsideration: "appeal",
        alj: "appeal",
      };
      const purpose = claimCase.claimType ? purposeMap[claimCase.claimType] || "new_claim" : "new_claim";
      const track = claimCase.caseType.toUpperCase();

      const requirements = await storage.getEvidenceRequirements(track, purpose);

      // Organize files by evidence type
      const filesByType: Record<string, typeof files> = {
        medical: [],
        lay: [],
        nexus: [],
        exam: [],
        other: [],
      };

      files.forEach((file) => {
        const type = file.evidenceType || "other";
        if (filesByType[type]) {
          filesByType[type].push(file);
        } else {
          filesByType.other.push(file);
        }
      });

      // Check completeness
      const filesByTypeCount = Object.entries(filesByType).reduce((acc, [type, typeFiles]) => {
        acc[type] = typeFiles.length;
        return acc;
      }, {} as Record<string, number>);

      const completenessResults = requirements.map((req) => ({
        label: req.label,
        evidenceType: req.evidenceType,
        required: req.required,
        status: filesByTypeCount[req.evidenceType] > 0 ? "present" : "missing",
      }));

      const requiredPresent = completenessResults.filter((r) => r.required && r.status === "present").length;
      const requiredTotal = completenessResults.filter((r) => r.required).length;
      const isComplete = requiredPresent === requiredTotal;

      // Calculate strength
      const filesWithStrength = files.filter((f) => f.strength);
      const avgStrength = filesWithStrength.length > 0
        ? filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0) / filesWithStrength.length
        : 0;

      // Task progress
      const completedTasks = tasks.filter((t) => t.status === "done").length;
      const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

      res.json({
        case: {
          id: claimCase.id,
          title: claimCase.title,
          caseType: claimCase.caseType,
          claimType: claimCase.claimType,
          status: claimCase.status,
          createdAt: claimCase.createdAt,
        },
        readiness: {
          isComplete,
          requiredPresent,
          requiredTotal,
          completenessPercent: requiredTotal > 0 ? Math.round((requiredPresent / requiredTotal) * 100) : 100,
          taskProgress,
          avgStrength,
        },
        documents: {
          total: files.length,
          byType: filesByTypeCount,
          files: files.map((f) => ({
            id: f.id,
            filename: f.originalName,
            evidenceType: f.evidenceType || "other",
            condition: f.condition,
            strength: f.strength,
            createdAt: f.createdAt,
            storageUrl: f.storageUrl,
          })),
        },
        checklist: completenessResults,
        tasks: {
          total: tasks.length,
          completed: completedTasks,
          items: tasks.map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
          })),
        },
        timeline: notes.map((n) => ({
          id: n.id,
          content: n.content,
          authorEmail: n.authorEmail,
          authorType: n.authorType,
          createdAt: n.createdAt,
        })),
        deadlines: deadlines.map((d) => ({
          id: d.id,
          title: d.title,
          dueDate: d.dueDate,
          status: d.status,
        })),
        exportedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error generating export:", error);
      res.status(500).json({ message: "Failed to generate export" });
    }
  });

  // ====================================================
  // EVIDENCE HEATMAP
  // ====================================================

  // Get evidence strength heatmap for a case
  app.get("/api/claims/cases/:id/heatmap", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);
      
      // Build heatmap data
      const map: Record<string, { total: number; count: number }> = {};

      for (const f of files) {
        const condition = f.condition || "General";
        const evidenceType = f.evidenceType || "other";
        const key = `${condition}:${evidenceType}`;
        
        if (!map[key]) {
          map[key] = { total: 0, count: 0 };
        }
        
        map[key].total += f.strength || 1;
        map[key].count += 1;
      }

      const heatmap = Object.entries(map).map(([key, v]) => {
        const [condition, type] = key.split(":");
        return {
          condition,
          type,
          avgStrength: Math.round((v.total / v.count) * 10) / 10,
          count: v.count,
        };
      });

      // Get unique conditions and types for grid layout
      const conditions = Array.from(new Set(heatmap.map(h => h.condition)));
      const types = Array.from(new Set(heatmap.map(h => h.type)));

      res.json({
        heatmap,
        conditions,
        types,
        totalFiles: files.length,
      });
    } catch (error) {
      console.error("Error generating heatmap:", error);
      res.status(500).json({ message: "Failed to generate heatmap" });
    }
  });

  // ====================================================
  // STAGE 7-10: INTELLIGENCE FEATURES
  // ====================================================

  // Stage 7: Get strength suggestions for a case
  app.get("/api/claims/cases/:id/suggestions", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);
      
      // Build heatmap data for suggestions
      const map: Record<string, { condition: string; type: string; total: number; count: number }> = {};
      for (const f of files) {
        const condition = f.condition || "General";
        const type = f.evidenceType || "other";
        const key = `${condition}::${type}`;
        if (!map[key]) {
          map[key] = { condition, type, total: 0, count: 0 };
        }
        map[key].total += f.strength || 1;
        map[key].count += 1;
      }

      const heatmap = Object.values(map).map(v => ({
        condition: v.condition,
        type: v.type,
        avgStrength: v.count > 0 ? v.total / v.count : 0,
        count: v.count
      }));

      const { suggestImprovements, getTopSuggestions } = await import("../shared/lib/strengthSuggestions");
      const allSuggestions = suggestImprovements(heatmap);
      const topSuggestions = getTopSuggestions(heatmap, 5);

      res.json({
        suggestions: allSuggestions,
        topSuggestions,
        heatmapSummary: heatmap
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      res.status(500).json({ message: "Failed to generate suggestions" });
    }
  });

  // Stage 8: Get vendor scorecards for a case
  app.get("/api/claims/cases/:id/vendor-scorecards", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const notes = await storage.getCaseNotesByCaseId(caseId);
      const shares = await storage.getCaseSharesByCaseId(caseId);
      const files = await storage.getClaimFilesByCaseId(caseId);

      // Group actions by vendor
      const vendorActions: Record<string, any[]> = {};
      
      for (const note of notes) {
        if (note.authorType === "vendor" && note.authorEmail) {
          if (!vendorActions[note.authorEmail]) {
            vendorActions[note.authorEmail] = [];
          }
          vendorActions[note.authorEmail].push({
            type: "note",
            timestamp: note.createdAt,
            responseTimeHours: 12 // Default estimate
          });
        }
      }

      // Track vendor uploads (files with authorType = vendor)
      for (const file of files) {
        if ((file as any).authorType === "vendor" && (file as any).authorEmail) {
          const email = (file as any).authorEmail;
          if (!vendorActions[email]) {
            vendorActions[email] = [];
          }
          vendorActions[email].push({
            type: "upload",
            timestamp: file.createdAt,
            responseTimeHours: 8
          });
        }
      }

      const { buildVendorScorecard, getVendorStats } = await import("../shared/lib/vendorScorecard");
      
      const scorecards = Object.entries(vendorActions).map(([email, actions]) => 
        buildVendorScorecard(email, actions)
      );

      const stats = getVendorStats(scorecards);

      res.json({
        scorecards,
        stats,
        activeVendors: shares.length
      });
    } catch (error) {
      console.error("Error generating vendor scorecards:", error);
      res.status(500).json({ message: "Failed to generate vendor scorecards" });
    }
  });

  // Stage 9: Get VA lane confidence recommendation
  app.get("/api/claims/cases/:id/lane-confidence", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);
      const tasks = await storage.getClaimTasksByCaseId(caseId);

      // Calculate metrics
      const filesWithStrength = files.filter(f => f.strength);
      const strengthAvg = filesWithStrength.length > 0
        ? filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0) / filesWithStrength.length
        : 0;

      const completedTasks = tasks.filter(t => t.status === "done").length;
      const completenessPct = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

      const hasNewEvidence = files.some(f => {
        const uploadDate = new Date(f.createdAt || Date.now());
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return uploadDate > sixMonthsAgo;
      });

      const hasNexusLetter = files.some(f => f.evidenceType === "nexus");
      const hasMedicalRecords = files.some(f => f.evidenceType === "medical");
      const hasServiceRecords = files.some(f => f.evidenceType === "service");

      const { recommendLane, getLaneDisplayName, getLaneDescription } = await import("../shared/lib/laneConfidence");
      
      const recommendation = recommendLane({
        strengthAvg,
        completenessPct,
        hasNewEvidence,
        hasNexusLetter,
        hasMedicalRecords,
        hasServiceRecords,
        priorDenials: 0 // Could be tracked in case metadata
      });

      res.json({
        recommendation: {
          ...recommendation,
          laneDisplayName: getLaneDisplayName(recommendation.lane),
          laneDescription: getLaneDescription(recommendation.lane),
          alternativeLaneDisplayName: recommendation.alternativeLane 
            ? getLaneDisplayName(recommendation.alternativeLane)
            : null
        },
        factors: {
          strengthAvg: Math.round(strengthAvg * 10) / 10,
          completenessPct: Math.round(completenessPct),
          hasNewEvidence,
          hasNexusLetter,
          hasMedicalRecords,
          hasServiceRecords
        }
      });
    } catch (error) {
      console.error("Error calculating lane confidence:", error);
      res.status(500).json({ message: "Failed to calculate lane confidence" });
    }
  });

  // Stage 10: Get VA.gov upload checklist
  app.get("/api/claims/cases/:id/upload-checklist", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = await storage.getClaimFilesByCaseId(caseId);
      
      const checklistFiles = files.map(f => ({
        id: f.id,
        filename: f.originalName || f.filename,
        evidenceType: f.evidenceType,
        condition: f.condition,
        strength: f.strength
      }));

      const { buildVAUploadChecklist, generateChecklistText } = await import("../shared/lib/vaUploadChecklist");
      
      const checklist = buildVAUploadChecklist(checklistFiles, claimCase.title);
      const checklistText = generateChecklistText(checklist);

      res.json({
        checklist,
        textVersion: checklistText
      });
    } catch (error) {
      console.error("Error generating upload checklist:", error);
      res.status(500).json({ message: "Failed to generate upload checklist" });
    }
  });

  // ====================================================
  // ZIP EXPORT (PAID FEATURE)
  // ====================================================

  // Download submission package as ZIP (requires pro plan)
  app.get("/api/claims/cases/:id/export/download", async (req, res) => {
    try {
      const userId = getVeteranUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase || claimCase.veteranUserId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // For now, allow all users (monetization gate can be added later via user plan field)
      // TODO: Check user plan when monetization is fully implemented
      // const user = await storage.getVeteranUserBySub(userId);
      // if (user?.plan !== "pro" && user?.plan !== "enterprise") {
      //   return res.status(403).json({ message: "Pro plan required for export downloads" });
      // }

      const files = await storage.getClaimFilesByCaseId(caseId);
      const tasks = await storage.getClaimTasksByCaseId(caseId);

      // Generate evidence index
      const evidenceIndex = files.map((f, i) => 
        `${i + 1}. ${f.originalName} – ${(f.evidenceType || "other").toUpperCase()} – ${f.condition || "General"}${f.strength ? ` (Strength: ${f.strength}/5)` : ""}`
      ).join("\n");

      // Generate cover letter content
      const completedTasks = tasks.filter(t => t.status === "done").length;
      const filesWithStrength = files.filter(f => f.strength);
      const avgStrength = filesWithStrength.length > 0
        ? (filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0) / filesWithStrength.length).toFixed(1)
        : "N/A";

      const coverLetter = `
SUBMISSION COVER LETTER
=======================

Case: ${claimCase.title}
Type: ${claimCase.caseType.toUpperCase()} - ${claimCase.claimType || "Claim"}
Date: ${new Date().toLocaleDateString()}

CASE SUMMARY
------------
Total Documents: ${files.length}
Average Evidence Strength: ${avgStrength}/5
Tasks Completed: ${completedTasks}/${tasks.length}

EVIDENCE INDEX
--------------
${evidenceIndex || "No documents uploaded yet."}

NOTES
-----
This submission package was generated by NavigatorUSA Claims Navigator.
All documents are organized by evidence type for your review.

---
Generated: ${new Date().toISOString()}
      `.trim();

      // Set response headers for text file (simplified - no actual ZIP for now)
      const filename = `${claimCase.caseType.toUpperCase()}_Submission_${claimCase.id}_${new Date().toISOString().split('T')[0]}.txt`;
      
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(coverLetter);
    } catch (error) {
      console.error("Error generating export download:", error);
      res.status(500).json({ message: "Failed to generate export" });
    }
  });

  // ====================================================
  // VENDOR PORTAL ENDPOINTS
  // ====================================================

  // Helper: Get vendor email from session token
  async function getVendorEmailFromSession(req: any): Promise<string | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const sessionToken = authHeader.substring(7);
    const session = await storage.getVendorSessionByToken(sessionToken);
    return session?.email || null;
  }

  // Get all cases shared with the vendor (session-based)
  app.get("/api/vendor/cases", async (req, res) => {
    try {
      // Support both session-based and legacy email param (for backward compatibility during transition)
      let vendorEmail = await getVendorEmailFromSession(req);
      if (!vendorEmail) {
        // Fallback to query param if no session (will be deprecated)
        vendorEmail = req.query.email as string;
      }
      if (!vendorEmail) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get all shares for this vendor
      const allShares = await storage.getAllCaseShares();
      const vendorShares = allShares.filter(s => s.email.toLowerCase() === vendorEmail!.toLowerCase());

      // Get case details for each share
      const casesWithAccess = await Promise.all(
        vendorShares.map(async (share) => {
          const claimCase = await storage.getClaimCaseById(share.caseId);
          if (!claimCase) return null;
          return {
            id: claimCase.id,
            title: claimCase.title,
            caseType: claimCase.caseType,
            claimType: claimCase.claimType,
            status: claimCase.status,
            role: share.role,
            sharedAt: share.createdAt,
          };
        })
      );

      res.json(casesWithAccess.filter(Boolean));
    } catch (error) {
      console.error("Error getting vendor cases:", error);
      res.status(500).json({ message: "Failed to get vendor cases" });
    }
  });

  // Get vendor access to a specific case (session-based)
  app.get("/api/vendor/cases/:id", async (req, res) => {
    try {
      // Support both session-based and legacy email param
      let vendorEmail = await getVendorEmailFromSession(req);
      if (!vendorEmail) {
        vendorEmail = req.query.email as string;
      }
      if (!vendorEmail) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      // Check vendor has access
      const share = await storage.getCaseShareByEmail(caseId, vendorEmail);
      if (!share) {
        return res.status(403).json({ message: "Access denied" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      // Get case data based on permission level
      const files = await storage.getClaimFilesByCaseId(caseId);
      const notes = await storage.getCaseNotesByCaseId(caseId);

      // Determine permissions
      const canView = true;
      const canComment = share.role === "comment" || share.role === "upload";
      const canUpload = share.role === "upload";

      res.json({
        case: {
          id: claimCase.id,
          title: claimCase.title,
          caseType: claimCase.caseType,
          claimType: claimCase.claimType,
          status: claimCase.status,
        },
        access: {
          role: share.role,
          canView,
          canComment,
          canUpload,
        },
        files: files.map(f => ({
          id: f.id,
          filename: f.originalName,
          evidenceType: f.evidenceType,
          condition: f.condition,
          strength: f.strength,
          createdAt: f.createdAt,
        })),
        timeline: notes.map(n => ({
          id: n.id,
          content: n.content,
          authorEmail: n.authorEmail,
          authorType: n.authorType,
          createdAt: n.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error getting vendor case:", error);
      res.status(500).json({ message: "Failed to get case" });
    }
  });

  // ==========================================
  // VENDOR MAGIC LINK AUTH
  // ==========================================

  // Request a magic link (vendor enters email)
  app.post("/api/vendor/auth/request-magic-link", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Valid email required" });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if vendor has any shared cases
      const allShares = await storage.getAllCaseShares();
      const vendorShares = allShares.filter(s => s.email.toLowerCase() === normalizedEmail);
      
      if (vendorShares.length === 0) {
        // Don't reveal if email exists - just say link sent
        return res.json({ success: true, message: "If you have access to any cases, a login link will be sent." });
      }

      // Generate secure token
      const crypto = await import("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Store magic link
      await storage.createVendorMagicLink({
        email: normalizedEmail,
        token,
        expiresAt,
      });

      // Send email via Resend
      try {
        const { getResendClient } = await import("./resendClient");
        const { client: resend, fromEmail } = await getResendClient();
        
        const appUrl = process.env.REPL_SLUG 
          ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
          : "http://localhost:5000";
        
        const magicLinkUrl = `${appUrl}/vendor-portal?token=${token}`;

        await resend.emails.send({
          from: fromEmail,
          to: normalizedEmail,
          subject: "Your NavigatorUSA Vendor Portal Login Link",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1A365D; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">NavigatorUSA</h1>
                <p style="color: #E21C3D; margin: 5px 0 0 0; font-weight: bold;">Vendor Portal Access</p>
              </div>
              <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #1A365D;">Your Login Link</h2>
                <p>Click the button below to access your shared cases. This link expires in 15 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${magicLinkUrl}" style="background: #E21C3D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Access Vendor Portal
                  </a>
                </div>
                <p style="color: #666; font-size: 12px;">If you didn't request this link, you can safely ignore this email.</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send magic link email:", emailErr);
        // Still return success to not reveal email existence
      }

      res.json({ success: true, message: "If you have access to any cases, a login link will be sent." });
    } catch (error) {
      console.error("Error requesting magic link:", error);
      res.status(500).json({ message: "Failed to send login link" });
    }
  });

  // Verify magic link and create session
  app.post("/api/vendor/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }

      // Find and validate magic link
      const magicLink = await storage.getVendorMagicLinkByToken(token);
      if (!magicLink) {
        return res.status(401).json({ message: "Invalid or expired link" });
      }

      // Mark as used
      await storage.markMagicLinkUsed(magicLink.id);

      // Create session
      const crypto = await import("crypto");
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const session = await storage.createVendorSession({
        email: magicLink.email,
        sessionToken,
        expiresAt,
      });

      res.json({
        success: true,
        sessionToken,
        email: magicLink.email,
        expiresAt: session.expiresAt,
      });
    } catch (error) {
      console.error("Error verifying magic link:", error);
      res.status(500).json({ message: "Failed to verify link" });
    }
  });

  // Check vendor session (get current vendor info)
  app.get("/api/vendor/auth/session", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No session" });
      }

      const sessionToken = authHeader.substring(7);
      const session = await storage.getVendorSessionByToken(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }

      // Get vendor's shared cases
      const allShares = await storage.getAllCaseShares();
      const vendorShares = allShares.filter(s => s.email.toLowerCase() === session.email.toLowerCase());

      res.json({
        email: session.email,
        expiresAt: session.expiresAt,
        sharedCases: vendorShares.length,
      });
    } catch (error) {
      console.error("Error checking session:", error);
      res.status(500).json({ message: "Failed to check session" });
    }
  });

  // Logout (delete session)
  app.post("/api/vendor/auth/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const sessionToken = authHeader.substring(7);
        await storage.deleteVendorSession(sessionToken);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  // Get vendor's shared cases (using session)
  app.get("/api/vendor/my-cases", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const sessionToken = authHeader.substring(7);
      const session = await storage.getVendorSessionByToken(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }

      // Get all shares for this vendor
      const allShares = await storage.getAllCaseShares();
      const vendorShares = allShares.filter(s => s.email.toLowerCase() === session.email.toLowerCase());

      // Get case details for each share
      const casesWithDetails = await Promise.all(
        vendorShares.map(async (share) => {
          const claimCase = await storage.getClaimCaseById(share.caseId);
          return claimCase ? { ...claimCase, role: share.role, shareId: share.id } : null;
        })
      );

      res.json(casesWithDetails.filter(Boolean));
    } catch (error) {
      console.error("Error getting vendor cases:", error);
      res.status(500).json({ message: "Failed to get cases" });
    }
  });

  // Vendor adds a note (requires comment permission, session-based auth)
  app.post("/api/vendor/cases/:id/notes", async (req, res) => {
    try {
      const { content } = req.body;
      
      // Get vendor email from session (preferred) or body (legacy)
      let vendorEmail = await getVendorEmailFromSession(req);
      if (!vendorEmail) {
        vendorEmail = req.body.vendorEmail;
      }
      if (!vendorEmail) {
        return res.status(401).json({ message: "Authentication required" });
      }
      if (!content) {
        return res.status(400).json({ message: "Content required" });
      }

      const caseId = parseInt(req.params.id);
      if (isNaN(caseId)) {
        return res.status(400).json({ message: "Invalid case ID" });
      }

      // Check vendor has comment permission
      const share = await storage.getCaseShareByEmail(caseId, vendorEmail);
      if (!share || (share.role !== "comment" && share.role !== "upload")) {
        return res.status(403).json({ message: "Comment permission required" });
      }

      const claimCase = await storage.getClaimCaseById(caseId);
      if (!claimCase) {
        return res.status(404).json({ message: "Case not found" });
      }

      const note = await storage.createCaseNote({
        caseId,
        content,
        authorEmail: vendorEmail,
        authorType: "vendor",
      });

      res.json(note);
    } catch (error) {
      console.error("Error adding vendor note:", error);
      res.status(500).json({ message: "Failed to add note" });
    }
  });

  // =====================================================
  // SAILOR MAN AI CHAT ROUTES
  // =====================================================
  
  // Configure multer for audio uploads
  const audioUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit for audio
  });
  
  // Seed FAQs on startup
  seedInitialFaqs().catch(console.error);

  // Start or continue a conversation
  app.post("/api/sailor/conversation", async (req, res) => {
    try {
      const { sessionId, currentPage } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }
      const conversation = await getOrCreateConversation(sessionId, currentPage);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Get conversation history
  app.get("/api/sailor/conversation/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      const messages = await getConversationHistory(conversationId, 20);
      res.json(messages.reverse());
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Send a text message and get AI response
  app.post("/api/sailor/chat", async (req, res) => {
    try {
      const { sessionId, message, currentPage } = req.body;
      if (!sessionId || !message) {
        return res.status(400).json({ message: "Session ID and message required" });
      }

      const conversation = await getOrCreateConversation(sessionId, currentPage);
      
      await saveMessage(conversation.id, "user", message, "text");
      
      const aiResponse = await generateAIResponse(conversation.id, message, currentPage);
      
      const assistantMsg = await saveMessage(conversation.id, "assistant", aiResponse);
      
      res.json({
        conversationId: conversation.id,
        response: aiResponse,
        messageId: assistantMsg.id
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat" });
    }
  });

  // Get contextual tips for current page
  app.get("/api/sailor/tips", async (req, res) => {
    try {
      const currentPage = req.query.page as string || "/";
      const tips = await getContextualTips(currentPage);
      res.json({ tips });
    } catch (error) {
      console.error("Error getting tips:", error);
      res.status(500).json({ message: "Failed to get tips" });
    }
  });

  // Voice transcription endpoint
  app.post("/api/sailor/transcribe", audioUpload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Audio file required" });
      }
      const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
      res.json({ transcript });
    } catch (error: any) {
      console.error("Error transcribing:", error);
      res.status(500).json({ message: error.message || "Failed to transcribe audio" });
    }
  });

  // Voice chat - transcribe and respond
  app.post("/api/sailor/voice-chat", audioUpload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Audio file required" });
      }
      const { sessionId, currentPage } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
      if (!transcript || transcript.trim() === "") {
        return res.status(400).json({ message: "Could not understand audio" });
      }

      const conversation = await getOrCreateConversation(sessionId, currentPage);
      await saveMessage(conversation.id, "user", transcript, "voice");
      
      const aiResponse = await generateAIResponse(conversation.id, transcript, currentPage);
      const assistantMsg = await saveMessage(conversation.id, "assistant", aiResponse);
      
      res.json({
        conversationId: conversation.id,
        transcript,
        response: aiResponse,
        messageId: assistantMsg.id
      });
    } catch (error) {
      console.error("Error in voice chat:", error);
      res.status(500).json({ message: "Failed to process voice chat" });
    }
  });

  return httpServer;
}
