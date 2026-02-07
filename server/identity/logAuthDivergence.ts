import type { Request } from "express";
import type { ResolvedIdentity } from "./resolveIdentity";

type DivergencePayload = {
  domain: string;
  path: string;
  method: string;
  legacyAllowed: boolean;
  policyAllowed: boolean;
  identity?: {
    kind?: string;
    role?: string;
    mfaVerified?: boolean;
    mfaPending?: boolean;
    hasNda?: boolean;
    hasContract?: boolean;
  };
};

export function logAuthDivergence(
  domain: string,
  req: Request,
  legacyAllowed: boolean,
  policyAllowed: boolean,
  extra?: { hasNda?: boolean; hasContract?: boolean }
): void {
  if (legacyAllowed === policyAllowed) return;

  const identity = (req as any).__resolvedIdentity as ResolvedIdentity | null | undefined;

  const payload: DivergencePayload = {
    domain,
    path: req.path,
    method: req.method,
    legacyAllowed,
    policyAllowed,
    identity: identity
      ? {
          kind: identity.primary.kind,
          role: identity.primary.role,
          mfaVerified: identity.mfa.verified,
          mfaPending: identity.mfa.pending,
          ...extra,
        }
      : undefined,
  };

  console.warn("AUTH_DIVERGENCE", JSON.stringify(payload));
}
