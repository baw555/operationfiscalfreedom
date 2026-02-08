import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { seedPayziumData } from "./seeds/payziumSeed";
import { createServer } from "http";
import path from "path";
import { startQueueRunner } from "./queueService";
import { internalServiceAccess } from "./internalAccess";

const app = express();
app.set("trust proxy", 1); // trust first proxy hop only (Replit load balancer)
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// HIPAA Security: Helmet.js for security headers including HSTS
app.use(
  helmet({
    // HSTS - Force HTTPS connections (HIPAA §164.312(e)(1))
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    // Content Security Policy for XSS protection
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "wss:", "ws:"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // X-Frame-Options to prevent clickjacking
    frameguard: { action: "deny" },
    // X-Content-Type-Options to prevent MIME sniffing
    noSniff: true,
    // Referrer Policy for privacy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // X-XSS-Protection (legacy but still useful)
    xssFilter: true,
  })
);

app.use(
  express.json({
    limit: '50mb', // Increased limit for base64 images (face photo, ID photo, signature)
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Request timeout middleware - prevents hung requests (2 minutes for most, 5 minutes for file uploads)
app.use((req, res, next) => {
  const timeout = req.path.includes('/upload') || req.path.includes('/sign') ? 300000 : 120000;
  req.setTimeout(timeout);
  res.setTimeout(timeout);
  next();
});

// Serve attached_assets folder for uploaded images/files
app.use('/attached_assets', express.static(path.resolve(process.cwd(), 'attached_assets')));

// Internal service access middleware (Replit/CI/Test Agent)
app.use(internalServiceAccess);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);
  
  // Run seed data for Payzium (Maurice Verrelli account and templates)
  await seedPayziumData();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`[error] ${status}: ${message}`, err.stack || err);
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
      
      startQueueRunner();
      log("Notification queue runner started");
    },
  );
})();
