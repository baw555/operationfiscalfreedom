import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

declare global {
  namespace Express {
    interface Request {
      internalService?: boolean;
    }
  }
}

export function internalServiceAccess(req: Request, res: Response, next: NextFunction) {
  if (process.env.INTERNAL_SERVICE_ENABLED !== "true") {
    return next();
  }

  const token = req.headers["x-internal-service-token"] as string | undefined;

  if (!token || token !== process.env.INTERNAL_SERVICE_TOKEN) {
    return next();
  }

  (req as any).user = {
    id: "internal-service",
    email: "replit-internal@system",
    role: "master",
    service: true
  };
  
  req.internalService = true;

  console.log(
    "[INTERNAL SERVICE ACCESS]",
    req.method,
    req.path,
    new Date().toISOString()
  );

  next();
}

export function verifyHmacSignature(secret: string, payload: string, signature: string): boolean {
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}

export function createHmacSignature(secret: string, payload: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

export function requireHmacAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.HMAC_SECRET;
  
  if (!secret) {
    console.warn("[HMAC] HMAC_SECRET not configured, skipping HMAC verification");
    return next();
  }

  const signature = req.headers["x-hmac-signature"] as string | undefined;
  const timestamp = req.headers["x-hmac-timestamp"] as string | undefined;

  if (!signature || !timestamp) {
    return res.status(401).json({ message: "Missing HMAC signature or timestamp" });
  }

  const timestampAge = Date.now() - parseInt(timestamp, 10);
  if (isNaN(timestampAge) || timestampAge > 300000) {
    return res.status(401).json({ message: "HMAC timestamp expired (5 min window)" });
  }

  const payload = `${timestamp}.${JSON.stringify(req.body)}`;
  
  try {
    if (!verifyHmacSignature(secret, payload, signature)) {
      return res.status(401).json({ message: "Invalid HMAC signature" });
    }
  } catch {
    return res.status(401).json({ message: "HMAC verification failed" });
  }

  console.log(
    "[HMAC AUTH]",
    req.method,
    req.path,
    new Date().toISOString()
  );

  next();
}

export function generateWebhookPayload(data: any): { payload: string; signature: string; timestamp: string } {
  const secret = process.env.HMAC_SECRET;
  
  if (!secret) {
    throw new Error("HMAC_SECRET not configured");
  }

  const timestamp = Date.now().toString();
  const bodyStr = JSON.stringify(data);
  const payload = `${timestamp}.${bodyStr}`;
  const signature = createHmacSignature(secret, payload);

  return {
    payload: bodyStr,
    signature,
    timestamp
  };
}
