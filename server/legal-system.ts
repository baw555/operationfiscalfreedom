import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { legalSignatures, legalOverrideAudit, users } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export const LEGAL_DOCS = {
  NDA: {
    type: "NDA",
    version: "nda_v1_2026",
    path: "/affiliate/nda",
    requiredFor: ["affiliate"],
  },
} as const;

export type LegalDocType = keyof typeof LEGAL_DOCS;
export type LegalDoc = typeof LEGAL_DOCS[LegalDocType];

export function hashDocument(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function hasSignedLegalDoc(userId: number, doc: LegalDoc): Promise<boolean> {
  const [existing] = await db.select()
    .from(legalSignatures)
    .where(
      and(
        eq(legalSignatures.userId, userId),
        eq(legalSignatures.documentType, doc.type),
        eq(legalSignatures.documentVersion, doc.version)
      )
    );
  return Boolean(existing);
}

export async function signLegalDocumentAtomic({
  userId,
  doc,
  docHash,
  req,
}: {
  userId: number;
  doc: LegalDoc;
  docHash?: string;
  req: Request;
}): Promise<{ success: boolean; alreadySigned?: boolean }> {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const ua = (req.headers["user-agent"] as string) || "unknown";

  return await db.transaction(async (tx) => {
    const [existing] = await tx.select()
      .from(legalSignatures)
      .where(
        and(
          eq(legalSignatures.userId, userId),
          eq(legalSignatures.documentType, doc.type),
          eq(legalSignatures.documentVersion, doc.version)
        )
      );

    if (existing) {
      return { success: true, alreadySigned: true };
    }

    await tx.insert(legalSignatures).values({
      userId,
      documentType: doc.type,
      documentVersion: doc.version,
      documentHash: docHash || null,
      ipAddress: ip,
      userAgent: ua,
    });

    return { success: true, alreadySigned: false };
  });
}

export function requireLegalClearance() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as any;
    
    if (!session?.userId || !session?.userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    for (const key of Object.keys(LEGAL_DOCS) as LegalDocType[]) {
      const doc = LEGAL_DOCS[key];
      if (!doc.requiredFor.includes(session.userRole)) continue;

      const ok = await hasSignedLegalDoc(session.userId, doc);
      if (!ok) {
        return res.status(403).json({
          required: doc.type,
          redirectTo: doc.path,
        });
      }
    }

    next();
  };
}

export async function getLegalStatus(userId: number, userRole: string): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  
  for (const key of Object.keys(LEGAL_DOCS) as LegalDocType[]) {
    const doc = LEGAL_DOCS[key];
    if (!(doc.requiredFor as readonly string[]).includes(userRole)) {
      result[key] = true;
      continue;
    }
    result[key] = await hasSignedLegalDoc(userId, doc);
  }
  
  return result;
}

export async function healLegalStateOnLogin(userId: number, role: string): Promise<{ ok: true } | { redirectTo: string }> {
  for (const key of Object.keys(LEGAL_DOCS) as LegalDocType[]) {
    const doc = LEGAL_DOCS[key];
    if (!(doc.requiredFor as readonly string[]).includes(role)) continue;

    const signed = await hasSignedLegalDoc(userId, doc);
    if (!signed) {
      return { redirectTo: doc.path };
    }
  }
  return { ok: true };
}

export async function createLegalOverride({
  adminId,
  userId,
  documentType,
  reason,
  req,
}: {
  adminId: number;
  userId: number;
  documentType: string;
  reason: string;
  req: Request;
}): Promise<void> {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";
  const ua = (req.headers["user-agent"] as string) || "unknown";

  await db.transaction(async (tx) => {
    await tx.insert(legalSignatures).values({
      userId,
      documentType,
      documentVersion: "ADMIN_OVERRIDE",
      documentHash: "OVERRIDE",
      ipAddress: ip,
      userAgent: ua,
    });

    await tx.insert(legalOverrideAudit).values({
      adminId,
      userId,
      documentType,
      reason,
    });
  });
}

export async function legalSystemHealthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
  const issues: string[] = [];

  for (const k of Object.keys(LEGAL_DOCS) as LegalDocType[]) {
    if (!LEGAL_DOCS[k].version) {
      issues.push(`Missing version: ${k}`);
    }
    if (!LEGAL_DOCS[k].path) {
      issues.push(`Missing path: ${k}`);
    }
  }

  return { healthy: issues.length === 0, issues };
}
