import type { Request } from "express";

export type IdentityKind =
  | "internal"
  | "veteran"
  | "user"
  | "vlt_affiliate";

export type PrimaryIdentity = {
  kind: IdentityKind;
  id: string;
  numericId?: number;
  role?: string;
};

export type SecondaryIdentity = {
  kind: "vlt_affiliate";
  id: string;
  numericId: number;
};

export type MfaState = {
  pending: boolean;
  verified: boolean;
};

export type ResolvedIdentity = {
  primary: PrimaryIdentity;
  secondary?: SecondaryIdentity;
  mfa: MfaState;
};

export function resolveIdentity(req: Request): ResolvedIdentity | null {
  const user = (req as any).user;

  if (user?.service === true) {
    return {
      primary: {
        kind: "internal",
        id: String(user.id ?? "internal-service"),
        role: user.role,
      },
      mfa: { pending: false, verified: true },
    };
  }

  if (user?.claims?.sub) {
    return {
      primary: {
        kind: "veteran",
        id: user.claims.sub,
      },
      mfa: { pending: false, verified: true },
    };
  }

  const session = req.session as any;
  if (!session?.userId) {
    return null;
  }

  const mfa: MfaState = {
    pending: session.mfaPending === true,
    verified: session.mfaVerified === true,
  };

  const primary: PrimaryIdentity = {
    kind: "user",
    id: String(session.userId),
    numericId: session.userId,
    role: session.userRole,
  };

  let secondary: SecondaryIdentity | undefined;
  if (session.vltAffiliateId) {
    secondary = {
      kind: "vlt_affiliate",
      id: String(session.vltAffiliateId),
      numericId: session.vltAffiliateId,
    };
  }

  return { primary, secondary, mfa };
}
