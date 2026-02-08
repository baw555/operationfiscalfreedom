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
app.set("trust proxy", 1);
const httpServer = createServer(app);

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, _res, next) => {
  if (req.path !== "/healthz") {
    console.log(`[req] ${req.method} ${req.path} from ${req.ip}`);
  }
  next();
});

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

const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(
  {
    port,
    host: "0.0.0.0",
  },
  () => {
    log(`listening on port ${port} (healthz ready)`);
  },
);

(async () => {
  try {
    log("Starting route registration...");
    await registerRoutes(httpServer, app);
    log("Routes registered successfully");
    
    try {
      await seedPayziumData();
      log("Seed data loaded");
    } catch (seedErr: any) {
      log(`Seed data warning (non-fatal): ${seedErr.message}`);
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`[error] ${status}: ${message}`, err.stack || err);
      res.status(status).json({ message });
    });

    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    startQueueRunner();
    log("Application fully initialized");
  } catch (err: any) {
    console.error("Fatal startup error:", err);
    log(`Startup error: ${err.message}`);
  }
})();
