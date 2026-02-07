import type { ResolvedIdentity } from "./resolveIdentity";

export function canAccessAdmin(identity: ResolvedIdentity | null): boolean {
  if (!identity) return false;

  if (identity.primary.kind === "internal") {
    const role = identity.primary.role;
    return role === "master" || role === "admin";
  }

  if (identity.primary.kind !== "user") return false;

  const role = identity.primary.role;
  if (role !== "admin" && role !== "master") return false;

  if (identity.mfa.pending && !identity.mfa.verified) return false;

  return true;
}

export function canAccessAffiliate(identity: ResolvedIdentity | null): boolean {
  if (!identity) return false;
  if (identity.primary.kind !== "user") return false;
  if (identity.primary.role !== "affiliate") return false;
  if (identity.mfa.pending && !identity.mfa.verified) return false;

  return true;
}

export function canAccessAffiliateWithNda(
  identity: ResolvedIdentity | null,
  legalStatus: { NDA: boolean; CONTRACT?: boolean } | null
): boolean {
  if (!canAccessAffiliate(identity)) return false;
  if (!legalStatus) return false;
  if (!legalStatus.NDA) return false;
  if (legalStatus.CONTRACT === false) return false;

  return true;
}

export function canAccessClaims(identity: ResolvedIdentity | null): boolean {
  if (!identity) return false;
  return identity.primary.kind === "veteran";
}

export function requiresMfaCompletion(identity: ResolvedIdentity | null): boolean {
  if (!identity) return false;
  return identity.mfa.pending && !identity.mfa.verified;
}

export function isAuthenticated(identity: ResolvedIdentity | null): boolean {
  return identity !== null;
}
