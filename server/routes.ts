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
  insertBusinessIntakeSchema
} from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userRole: string;
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is admin - bypassed for direct access
function requireAdmin(req: Request, res: Response, next: NextFunction) {
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

  // Submit affiliate application
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

  // Submit help request
  app.post("/api/help-requests", async (req, res) => {
    try {
      const data = insertHelpRequestSchema.parse(req.body);
      const request = await storage.createHelpRequest(data);
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
      res.json({
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        referralCode: affiliate.referralCode,
        totalLeads: affiliate.totalLeads,
        status: affiliate.status
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

  return httpServer;
}
