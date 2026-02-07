import type { Request, Response, NextFunction } from "express";
import { getLegalStatus } from "./legal-system";
import { getRequestContext } from "./platform/requestContext";

/** @deprecated Use getRequestContext(req).ip instead */
export function resolveClientIp(req: Request): string {
  return getRequestContext(req).ip;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const internalUser = (req as any).user;
  if (internalUser?.service && (internalUser.role === "master" || internalUser.role === "admin")) {
    return next();
  }
  
  if (!req.session.userId || (req.session.userRole !== "admin" && req.session.userRole !== "master")) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required for admin access",
      mfaPending: true 
    });
  }
  next();
}

export function requireAffiliate(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "affiliate") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required",
      mfaPending: true 
    });
  }
  next();
}

export async function requireAffiliateWithNda(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.userRole !== "affiliate") {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  if (req.session.mfaPending === true && req.session.mfaVerified !== true) {
    return res.status(403).json({ 
      message: "MFA verification required",
      mfaPending: true 
    });
  }
  
  try {
    const legalStatus = await getLegalStatus(req.session.userId, req.session.userRole);
    
    if (!legalStatus.NDA) {
      return res.status(403).json({ 
        message: "NDA signature required",
        required: "NDA",
        redirectTo: "/affiliate/nda"
      });
    }
    
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
