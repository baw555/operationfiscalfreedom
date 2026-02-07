import type { Request, Response, NextFunction } from "express";
import { resolveIdentity } from "./resolveIdentity";
import { canAccessAdmin, canAccessAffiliate, isAuthenticated } from "./policies";

export function authDivergenceLog(req: Request, _res: Response, next: NextFunction): void {
  try {
    const identity = resolveIdentity(req);
    const session = req.session as any;

    const legacyAuth = !!session?.userId;
    const policyAuth = isAuthenticated(identity);

    if (legacyAuth !== policyAuth) {
      console.warn("AUTH_DIVERGENCE", JSON.stringify({
        type: "auth",
        path: req.path,
        method: req.method,
        legacyAllowed: legacyAuth,
        policyAllowed: policyAuth,
        identity: identity ? {
          kind: identity.primary.kind,
          role: identity.primary.role,
        } : null,
      }));
    }

    const legacyAdmin = !!(session?.userId && (session?.userRole === "admin" || session?.userRole === "master"));
    const policyAdmin = canAccessAdmin(identity);

    if (legacyAdmin !== policyAdmin) {
      console.warn("AUTH_DIVERGENCE", JSON.stringify({
        type: "admin",
        path: req.path,
        method: req.method,
        legacyAllowed: legacyAdmin,
        policyAllowed: policyAdmin,
        identity: identity ? {
          kind: identity.primary.kind,
          role: identity.primary.role,
          mfaVerified: identity.mfa.verified,
          mfaPending: identity.mfa.pending,
        } : null,
        session: {
          userId: !!session?.userId,
          role: session?.userRole || null,
          mfaPending: session?.mfaPending || false,
          mfaVerified: session?.mfaVerified || false,
        },
      }));
    }

    const legacyAffiliate = !!(session?.userId && session?.userRole === "affiliate");
    const policyAffiliate = canAccessAffiliate(identity);

    if (legacyAffiliate !== policyAffiliate) {
      console.warn("AUTH_DIVERGENCE", JSON.stringify({
        type: "affiliate",
        path: req.path,
        method: req.method,
        legacyAllowed: legacyAffiliate,
        policyAllowed: policyAffiliate,
        identity: identity ? {
          kind: identity.primary.kind,
          role: identity.primary.role,
        } : null,
        session: {
          userId: !!session?.userId,
          role: session?.userRole || null,
        },
      }));
    }
  } catch (_err) {
  }

  next();
}
