import crypto from "crypto";
import fs from "fs";
import path from "path";
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
  CONTRACT: {
    type: "CONTRACT",
    version: "contract_v1_2026",
    path: "/legal/contract",
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

export async function signLegalDocumentCore({
  userId,
  documentType,
  documentVersion,
  documentHash,
  ipAddress,
  userAgent,
}: {
  userId: number;
  documentType: string;
  documentVersion: string;
  documentHash?: string | null;
  ipAddress: string;
  userAgent: string;
}): Promise<{ success: boolean; alreadySigned?: boolean }> {
  return await db.transaction(async (tx) => {
    const [existing] = await tx.select()
      .from(legalSignatures)
      .where(
        and(
          eq(legalSignatures.userId, userId),
          eq(legalSignatures.documentType, documentType),
          eq(legalSignatures.documentVersion, documentVersion)
        )
      );

    if (existing) {
      return { success: true, alreadySigned: true };
    }

    await tx.insert(legalSignatures).values({
      userId,
      documentType,
      documentVersion,
      documentHash: documentHash || null,
      ipAddress,
      userAgent,
    });

    return { success: true, alreadySigned: false };
  });
}

export async function signLegalDocumentAtomic({
  userId,
  doc,
  docHash,
  req,
  provider = null,
  envelopeId = null,
}: {
  userId: number;
  doc: LegalDoc;
  docHash?: string;
  req: Request;
  provider?: string | null;
  envelopeId?: string | null;
}): Promise<{ success: boolean; alreadySigned?: boolean }> {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const ua = (req.headers["user-agent"] as string) || "unknown";

  return signLegalDocumentCore({
    userId,
    documentType: doc.type,
    documentVersion: doc.version,
    documentHash: docHash,
    ipAddress: ip,
    userAgent: ua,
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
      if (!(doc.requiredFor as readonly string[]).includes(session.userRole)) continue;

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

export async function generateEvidenceBundle(userId: number): Promise<string> {
  const records = await db.select().from(legalSignatures).where(eq(legalSignatures.userId, userId));

  const content = records
    .map(
      (r) =>
        `DOC: ${r.documentType}
VERSION: ${r.documentVersion}
HASH: ${r.documentHash || "N/A"}
SIGNED AT: ${r.signedAt}
IP: ${r.ipAddress}
AGENT: ${r.userAgent || "N/A"}
----`
    )
    .join("\n\n");

  const filePath = path.join("/tmp", `legal_evidence_${userId}_${Date.now()}.txt`);
  fs.writeFileSync(filePath, content);
  return filePath;
}

export async function processExternalEsignCallback({
  userId,
  documentType,
  envelopeId,
  docText,
  req,
}: {
  userId: number;
  documentType: string;
  envelopeId: string;
  docText: string;
  req: Request;
}): Promise<{ success: boolean }> {
  const doc = LEGAL_DOCS[documentType as LegalDocType];
  if (!doc) {
    throw new Error("Invalid document type");
  }

  await signLegalDocumentAtomic({
    userId,
    doc,
    docHash: hashDocument(docText),
    req,
    provider: "external",
    envelopeId,
  });

  return { success: true };
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

export async function runLegalTestBot(): Promise<{ healthy: boolean; issues: string[] }> {
  const issues: string[] = [];

  for (const k of Object.keys(LEGAL_DOCS) as LegalDocType[]) {
    if (!LEGAL_DOCS[k].version) issues.push(`Missing version: ${k}`);
  }

  return { healthy: issues.length === 0, issues };
}
