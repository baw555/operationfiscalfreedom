import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { getLegalStatus } from "./legal-system";
import { getRequestContext } from "./platform/requestContext";
import { db } from "./db";
import { claimCases } from "@shared/schema";
import type { ClaimCase } from "@shared/schema";
import { resolveIdentity } from "./identity/resolveIdentity";
import { canAccessAffiliate } from "./identity/policies";
import { logAuthDivergence } from "./identity/logAuthDivergence";

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
  const legacyAllowed =
    !!req.session.userId &&
    req.session.userRole === "affiliate" &&
    !(req.session.mfaPending === true && req.session.mfaVerified !== true);

  try {
    const identity = resolveIdentity(req);
    (req as any).__resolvedIdentity = identity;
    const policyAllowed = canAccessAffiliate(identity);
    logAuthDivergence("affiliate", req, legacyAllowed, policyAllowed);
  } catch (_err) {
  }

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

export function getVeteranUserId(req: Request): string | null {
  const user = (req as any).user;
  if (user && user.claims && user.claims.sub) {
    return user.claims.sub;
  }
  return null;
}

export function requireClaimOwner(paramName = "id") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = getVeteranUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const caseId = parseInt(req.params[paramName]);
    if (isNaN(caseId)) {
      return res.status(400).json({ message: "Invalid case ID" });
    }

    const [claimCase] = await db
      .select()
      .from(claimCases)
      .where(eq(claimCases.id, caseId))
      .limit(1);

    if (!claimCase || claimCase.veteranUserId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    (req as any).claimCase = claimCase;
    (req as any).veteranUserId = userId;
    next();
  };
}
