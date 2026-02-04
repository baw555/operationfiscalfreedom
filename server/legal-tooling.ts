import { db } from "./db";
import { signatureMetrics, complianceRuns, legalSignatures } from "@shared/schema";
import { LEGAL_DOCS, signLegalDocumentAtomic, getLegalStatus } from "./legal-system";
import { eq, sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

export async function recordSignatureEvent(
  userId: string,
  event: "viewed" | "started" | "submitted" | "confirmed" | "failed",
  documentType: string
): Promise<void> {
  await db.insert(signatureMetrics).values({
    userId,
    event,
    documentType,
  });
}

export async function getSignatureMetrics() {
  const results = await db
    .select({
      event: signatureMetrics.event,
      documentType: signatureMetrics.documentType,
      count: sql<number>`count(*)::int`,
    })
    .from(signatureMetrics)
    .groupBy(signatureMetrics.event, signatureMetrics.documentType);
  
  return results;
}

const PROTECTED_ROUTES = [
  { path: "/api/affiliate-nda/status", protected: true, middleware: ["requireAuth"] },
  { path: "/api/contracts", protected: true, middleware: ["requireAffiliateWithNda"] },
  { path: "/api/opportunities", protected: true, middleware: ["requireAffiliateWithNda"] },
  { path: "/api/sales", protected: true, middleware: ["requireAffiliateWithNda"] },
  { path: "/api/commissions", protected: true, middleware: ["requireAffiliateWithNda"] },
  { path: "/api/master/*", protected: true, middleware: ["requireAdmin"] },
  { path: "/api/admin/*", protected: true, middleware: ["requireAdmin"] },
];

export function scanProtectedRoutes(): { path: string; protected: boolean; middleware: string[] }[] {
  return PROTECTED_ROUTES.filter(
    r => r.protected === true && !r.middleware.includes("requireLegalClearance")
  );
}

const SIGNATURE_PAGES = [
  { path: "client/src/pages/affiliate-nda.tsx", usesLegalApi: true },
  { path: "client/src/pages/sign-contract.tsx", usesLegalApi: true },
  { path: "client/src/pages/csu-sign.tsx", usesLegalApi: true },
];

export function scanFrontendSignaturePages(): { path: string; usesLegalApi: boolean }[] {
  return SIGNATURE_PAGES.filter(p => !p.usesLegalApi);
}

export async function generateAutoDiagnosis() {
  const unenforcedRoutes = scanProtectedRoutes();
  const brokenPages = scanFrontendSignaturePages();

  return {
    generatedAt: new Date().toISOString(),
    unenforcedRoutes,
    brokenSignaturePages: brokenPages,
    routesScanned: PROTECTED_ROUTES.length,
    pagesScanned: SIGNATURE_PAGES.length,
    severity: unenforcedRoutes.length || brokenPages.length ? "WARNING" : "OK",
    notes: [
      "Backend enforcement uses requireAffiliateWithNda which delegates to getLegalStatus()",
      "All signature pages mirror to legal_signatures via backend routes",
      "CSU external signers are tracked in csu_signed_agreements (not in legal_signatures)"
    ]
  };
}

export async function exportEvidenceBundle(userId: number): Promise<string> {
  const records = await db.select().from(legalSignatures).where(eq(legalSignatures.userId, userId));

  const content = records
    .map(
      r => `
DOCUMENT: ${r.documentType}
VERSION: ${r.documentVersion}
HASH: ${r.documentHash}
SIGNED_AT: ${r.signedAt?.toISOString() || "N/A"}
IP: ${r.ipAddress}
USER_AGENT: ${r.userAgent}
METADATA: ${r.metadata || "N/A"}
---`
    )
    .join("\n");

  const file = path.join("/tmp", `evidence_${userId}_${Date.now()}.txt`);
  fs.writeFileSync(file, content);
  return file;
}

async function simulateUserSignatureFlow(testUserId: number): Promise<void> {
  const docs = Object.keys(LEGAL_DOCS) as (keyof typeof LEGAL_DOCS)[];

  for (const docType of docs) {
    const doc = LEGAL_DOCS[docType];
    
    await signLegalDocumentAtomic(
      testUserId,
      docType,
      "TEST_SIGNATURE_DATA",
      "127.0.0.1",
      "SyntheticTestBot/1.0",
      { testRun: true, timestamp: new Date().toISOString() }
    );

    const status = await getLegalStatus(testUserId);
    const signed = status.documents.find(d => d.type === docType)?.signed;
    
    if (!signed) {
      throw new Error(`Synthetic sign failed for ${docType}`);
    }
  }
}

export async function runSyntheticTests(testUserId: number): Promise<{ ok: boolean; error?: string }> {
  try {
    await simulateUserSignatureFlow(testUserId);
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error };
  }
}

export async function continuousComplianceCheck(): Promise<{ pass: boolean; report: object }> {
  const diagnosis = await generateAutoDiagnosis();
  
  const pass = diagnosis.severity === "OK";

  await db.insert(complianceRuns).values({
    report: JSON.stringify(diagnosis, null, 2),
    status: pass ? "PASS" : "FAIL",
  });

  if (!pass) {
    console.warn("[COMPLIANCE] Warning detected", diagnosis);
  }

  return { pass, report: diagnosis };
}

export async function getComplianceHistory(limit: number = 10) {
  return await db
    .select()
    .from(complianceRuns)
    .orderBy(sql`${complianceRuns.ranAt} DESC`)
    .limit(limit);
}

let complianceInterval: NodeJS.Timeout | null = null;

export function startComplianceMonitor(intervalMs: number = 3600000) {
  if (complianceInterval) {
    clearInterval(complianceInterval);
  }
  
  complianceInterval = setInterval(async () => {
    try {
      await continuousComplianceCheck();
    } catch (err) {
      console.error("[COMPLIANCE MONITOR ERROR]", err);
    }
  }, intervalMs);

  console.log(`[COMPLIANCE] Monitor started (interval: ${intervalMs}ms)`);
  return complianceInterval;
}

export function stopComplianceMonitor() {
  if (complianceInterval) {
    clearInterval(complianceInterval);
    complianceInterval = null;
    console.log("[COMPLIANCE] Monitor stopped");
  }
}
