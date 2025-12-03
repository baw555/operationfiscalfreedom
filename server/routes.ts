import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { authenticateUser, createAdminUser, createAffiliateUser, hashPassword } from "./auth";
import { 
  insertAffiliateApplicationSchema, 
  insertHelpRequestSchema, 
  insertStartupGrantSchema, 
  insertFurnitureAssistanceSchema,
  insertInvestorSubmissionSchema,
  insertPrivateDoctorRequestSchema,
  insertWebsiteApplicationSchema,
  insertGeneralContactSchema
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

// Middleware to check if user is admin
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
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

  return httpServer;
}
