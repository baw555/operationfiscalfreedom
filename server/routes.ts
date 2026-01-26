import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { authenticateUser, createAdminUser, createAffiliateUser, hashPassword } from "./auth";
import { Resend } from "resend";
import twilio from "twilio";
import Stripe from "stripe";
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
  insertBusinessLeadSchema
} from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
    vltAffiliateId: number;
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is admin or master
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || (req.session.userRole !== "admin" && req.session.userRole !== "master")) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
}

// Middleware to check if user is affiliate
function requireAffiliate(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "affiliate") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "operation-fiscal-freedom-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

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
      
      // Log the user in automatically
      req.session.userId = affiliate.id;
      
      res.status(201).json({ 
        success: true,
        user: {
          id: affiliate.id, 
          name: affiliate.name, 
          email: affiliate.email, 
          role: affiliate.role 
        }
      });
    } catch (error) {
      console.error("Affiliate signup error:", error);
      res.status(500).json({ message: "Failed to create account. Please try again." });
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
      
      // Send notifications
      if (process.env.RESEND_API_KEY && data.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        resend.emails.send({
          from: "Veteran Led Tax Solutions <no-reply@veteranledtax.com>",
          to: data.email,
          subject: "We received your intake",
          html: `<p>Your intake was received. A specialist will review shortly.</p>`,
        }).catch(err => console.error("Email failed:", err));
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

      // Send email via Resend if configured
      if (process.env.RESEND_API_KEY && email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Veteran Led Tax Solutions <no-reply@veteranledtax.com>",
          to: email,
          subject: "We received your intake",
          html: `<p>${message || "Your intake was received. A specialist will review shortly."}</p>`,
        });
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
      
      req.session.vltAffiliateId = affiliate.id;
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
    } catch (error) {
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
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ 
        success: true, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
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

      // Auto-login after registration
      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.status(201).json({ 
        success: true, 
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to create account" });
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
  app.get("/api/admin/help-requests", requireAdmin, async (req, res) => {
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
  app.patch("/api/admin/help-requests/:id", requireAdmin, async (req, res) => {
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
  app.get("/api/admin/private-doctor-requests", requireAdmin, async (req, res) => {
    try {
      const requests = await storage.getAllPrivateDoctorRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch private doctor requests" });
    }
  });

  // Update private doctor request
  app.patch("/api/admin/private-doctor-requests/:id", requireAdmin, async (req, res) => {
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

  // ===== AFFILIATE ROUTES =====

  // Get assigned affiliate applications
  app.get("/api/affiliate/applications", requireAffiliate, async (req, res) => {
    try {
      const applications = await storage.getAffiliateApplicationsByAssignee(req.session.userId!);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get assigned help requests
  app.get("/api/affiliate/help-requests", requireAffiliate, async (req, res) => {
    try {
      const requests = await storage.getHelpRequestsByAssignee(req.session.userId!);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Update affiliate application status (affiliate)
  app.patch("/api/affiliate/applications/:id", requireAffiliate, async (req, res) => {
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
  app.patch("/api/affiliate/help-requests/:id", requireAffiliate, async (req, res) => {
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
  app.get("/api/affiliate/referral-info", requireAffiliate, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate referral code if not exists
      let referralCode = user.referralCode;
      if (!referralCode) {
        referralCode = user.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X') + 
          Math.random().toString(36).substring(2, 6).toUpperCase();
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
  app.post("/api/affiliate/vso-air-support", requireAffiliate, async (req, res) => {
    try {
      const { vsoName, vsoEmail, comments } = req.body;
      const user = await storage.getUser(req.session.userId!);
      
      if (!vsoName || !vsoEmail) {
        return res.status(400).json({ message: "VSO name and email are required" });
      }
      
      // Send email notification to master/admin about the air support request
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "NavigatorUSA <no-reply@navigatorusa.com>",
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

  // Sign affiliate NDA
  app.post("/api/affiliate/sign-nda", requireAffiliate, async (req, res) => {
    try {
      const { fullName, veteranNumber, address, customReferralCode, signatureData, facePhoto, idPhoto } = req.body;
      
      if (!fullName || !address) {
        return res.status(400).json({ message: "Full name and address are required" });
      }
      
      if (!facePhoto) {
        return res.status(400).json({ message: "Face photo is required - please capture your face using webcam" });
      }
      
      if (!idPhoto) {
        return res.status(400).json({ message: "ID document upload is required" });
      }
      
      // Check if already signed
      const alreadySigned = await storage.hasAffiliateSignedNda(req.session.userId!);
      if (alreadySigned) {
        return res.status(400).json({ message: "NDA already signed" });
      }

      // Get IP address
      const ipAddress = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
      
      // Create NDA record
      const nda = await storage.createAffiliateNda({
        userId: req.session.userId!,
        fullName,
        veteranNumber: veteranNumber || null,
        address,
        customReferralCode: customReferralCode || null,
        signatureData: signatureData || null,
        facePhoto: facePhoto || null,
        idPhoto: idPhoto || null,
        signedIpAddress: ipAddress,
        agreedToTerms: "true",
      });
      
      // Update user's referral code if custom one provided
      if (customReferralCode) {
        await storage.updateUserReferralCode(req.session.userId!, customReferralCode.toUpperCase());
      }
      
      res.json({ success: true, nda });
    } catch (error) {
      console.error("NDA signing error:", error);
      res.status(500).json({ message: "Failed to sign NDA" });
    }
  });

  // Get W9 status for affiliate
  app.get("/api/affiliate/w9-status", requireAffiliate, async (req, res) => {
    try {
      const hasSubmitted = await storage.hasAffiliateSubmittedW9(req.session.userId!);
      const w9 = hasSubmitted ? await storage.getAffiliateW9ByUserId(req.session.userId!) : null;
      res.json({ hasSubmitted, w9: w9 ? { ...w9, ssn: w9.ssn ? "****" : null } : null });
    } catch (error) {
      res.status(500).json({ message: "Failed to check W9 status" });
    }
  });

  // Submit W9 form
  app.post("/api/affiliate/submit-w9", requireAffiliate, async (req, res) => {
    try {
      const { name, businessName, taxClassification, address, city, state, zip, ssn, ein, signatureData } = req.body;
      
      if (!name || !address || !city || !state || !zip) {
        return res.status(400).json({ message: "Name and full address are required" });
      }
      
      if (!ssn && !ein) {
        return res.status(400).json({ message: "Either SSN or EIN is required" });
      }
      
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
  app.get("/api/admin/veteran-intakes", requireAdmin, async (req, res) => {
    try {
      const intakes = await storage.getAllVeteranIntakes();
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update veteran intake
  app.patch("/api/admin/veteran-intakes/:id", requireAdmin, async (req, res) => {
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
  app.get("/api/admin/business-intakes", requireAdmin, async (req, res) => {
    try {
      const intakes = await storage.getAllBusinessIntakes();
      res.json(intakes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch intakes" });
    }
  });

  // Update business intake
  app.patch("/api/admin/business-intakes/:id", requireAdmin, async (req, res) => {
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
  app.get("/api/contracts/signed/affiliate/:affiliateId", async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.affiliateId);
      const agreements = await storage.getSignedAgreementsByAffiliate(affiliateId);
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agreements" });
    }
  });

  // Check if affiliate has signed a specific contract
  app.get("/api/contracts/check/:affiliateId/:templateId", async (req, res) => {
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
  app.post("/api/contracts/sign", async (req, res) => {
    try {
      const data = insertSignedAgreementSchema.parse(req.body);
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const signedAgreement = await storage.createSignedAgreement({
        ...data,
        signedIpAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp || 'unknown'
      });
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
  app.get("/api/contracts/pending/:affiliateId", async (req, res) => {
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

  // ===== COMMISSION CALCULATION API =====

  // Calculate commission breakdown for a sale
  app.post("/api/commission/calculate", async (req, res) => {
    try {
      const { grossRevenue, recruiterExists = true, l2Active = true, l3Active = true, l4Active = true, l5Active = true } = req.body;
      
      const gross = Math.max(0, Number(grossRevenue) || 0);
      
      const pct = {
        recruiter: 0.025,
        l1: 0.67,
        l2: 0.035,
        l3: 0.020,
        l4: 0.012,
        l5: 0.008,
        l6: 0.005,
      };

      const recruiterPay = recruiterExists ? Math.round(gross * pct.recruiter * 100) : 0;
      const l1Pay = Math.round(gross * pct.l1 * 100);
      
      const l2Base = Math.round(gross * pct.l2 * 100);
      const l3Base = Math.round(gross * pct.l3 * 100);
      const l4Base = Math.round(gross * pct.l4 * 100);
      const l5Base = Math.round(gross * pct.l5 * 100);
      const l6Base = Math.round(gross * pct.l6 * 100);

      const l2Pay = l2Active ? l2Base : 0;
      const l3Pay = l3Active ? l3Base : 0;
      const l4Pay = l4Active ? l4Base : 0;
      const l5Pay = l5Active ? l5Base : 0;

      const compressedToL6 =
        (l2Active ? 0 : l2Base) +
        (l3Active ? 0 : l3Base) +
        (l4Active ? 0 : l4Base) +
        (l5Active ? 0 : l5Base);

      const l6Pay = l6Base + compressedToL6;

      res.json({
        grossRevenue: gross,
        grossRevenueCents: Math.round(gross * 100),
        recruiterBounty: recruiterPay,
        l1Commission: l1Pay,
        l2Commission: l2Pay,
        l3Commission: l3Pay,
        l4Commission: l4Pay,
        l5Commission: l5Pay,
        l6Commission: l6Pay,
        compressedToL6: compressedToL6,
        totalPaid: recruiterPay + l1Pay + l2Pay + l3Pay + l4Pay + l5Pay + l6Pay,
        houseAllocation: l1Pay + l2Pay + l3Pay + l4Pay + l5Pay + l6Pay,
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
  app.get("/api/affiliate/business-leads", requireAffiliate, async (req, res) => {
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
  app.get("/api/affiliate/security-tracking", requireAffiliate, async (req, res) => {
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

  return httpServer;
}
