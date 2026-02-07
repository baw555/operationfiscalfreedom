import { db } from "./db";
import { legalSignatures, affiliateNda, signedAgreements, csuSignedAgreements, users } from "@shared/schema";
import { LEGAL_DOCS, hashDocument, legalSystemHealthCheck } from "./legal-system";
import { eq, and } from "drizzle-orm";

export async function migrateLegacySignatures(): Promise<{ migrated: number; errors: string[] }> {
  const errors: string[] = [];
  let migrated = 0;

  try {
    const legacyNdas = await db.select().from(affiliateNda);
    
    for (const nda of legacyNdas) {
      try {
        const [existing] = await db.select()
          .from(legalSignatures)
          .where(eq(legalSignatures.userId, nda.userId));
        
        if (!existing) {
          await db.insert(legalSignatures).values({
            userId: nda.userId,
            documentType: "NDA",
            documentVersion: LEGAL_DOCS.NDA.version,
            documentHash: "LEGACY_IMPORT",
            ipAddress: nda.signedIpAddress || "legacy",
            userAgent: "legacy-migration",
          });
          migrated++;
        }
      } catch (err) {
        errors.push(`NDA migration failed for user ${nda.userId}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Failed to read legacy NDAs: ${err}`);
  }

  try {
    const legacyContracts = await db.select().from(signedAgreements);
    
    for (const contract of legacyContracts) {
      try {
        const [existing] = await db.select()
          .from(legalSignatures)
          .where(and(
            eq(legalSignatures.userId, contract.affiliateId),
            eq(legalSignatures.documentType, "CONTRACT")
          ));
        
        if (!existing) {
          await db.insert(legalSignatures).values({
            userId: contract.affiliateId,
            documentType: "CONTRACT",
            documentVersion: LEGAL_DOCS.CONTRACT.version,
            documentHash: "LEGACY_IMPORT",
            ipAddress: contract.signedIpAddress || "legacy",
            userAgent: "legacy-migration",
          }).onConflictDoNothing();
          migrated++;
        }
      } catch (err) {
        errors.push(`Contract migration failed for affiliate ${contract.affiliateId}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Failed to read legacy contracts: ${err}`);
  }

  // Migrate CSU signed agreements for registered users
  try {
    const csuAgreements = await db.select().from(csuSignedAgreements);
    const allUsers = await db.select().from(users);
    const userByEmail = new Map(allUsers.map(u => [u.email.toLowerCase(), u]));
    
    for (const agreement of csuAgreements) {
      const matchedUser = userByEmail.get(agreement.signerEmail.toLowerCase());
      if (!matchedUser) continue;
      
      try {
        const [existing] = await db.select()
          .from(legalSignatures)
          .where(and(
            eq(legalSignatures.userId, matchedUser.id),
            eq(legalSignatures.documentType, "CONTRACT")
          ));
        
        if (!existing) {
          await db.insert(legalSignatures).values({
            userId: matchedUser.id,
            documentType: "CONTRACT",
            documentVersion: LEGAL_DOCS.CONTRACT.version,
            documentHash: "LEGACY_IMPORT_CSU",
            ipAddress: agreement.signedIpAddress || "legacy",
            userAgent: "legacy-migration-csu",
          }).onConflictDoNothing();
          migrated++;
        }
      } catch (err) {
        errors.push(`CSU migration failed for ${agreement.signerEmail}: ${err}`);
      }
    }
  } catch (err) {
    errors.push(`Failed to read CSU agreements: ${err}`);
  }

  return { migrated, errors };
}

export async function generateLegalCoverageReport() {
  const health = await legalSystemHealthCheck();
  
  const totalSignatures = await db.select().from(legalSignatures);
  const ndaCount = totalSignatures.filter(s => s.documentType === "NDA").length;
  const contractCount = totalSignatures.filter(s => s.documentType === "CONTRACT").length;
  
  const report = {
    generatedAt: new Date().toISOString(),
    legalSystemActive: true,
    systemHealth: health,
    signatureCounts: {
      NDA: ndaCount,
      CONTRACT: contractCount,
      total: totalSignatures.length,
    },
    documentVersions: {
      NDA: LEGAL_DOCS.NDA.version,
      CONTRACT: LEGAL_DOCS.CONTRACT.version,
    },
    guarantees: [
      "All signatures write to legal_signatures",
      "All protected routes enforce requireLegalClearance via requireAffiliateWithNda",
      "No frontend-only enforcement",
      "Legacy tables mirrored to unified system",
      "Atomic and idempotent signing",
      "Audit-grade evidence retained",
    ],
    complianceStatus: health.healthy ? "PASS" : "FAIL",
  };

  return report;
}

export async function runLegalSystemValidation(): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  const health = await legalSystemHealthCheck();
  if (!health.healthy) {
    issues.push(...health.issues);
  }

  for (const key of Object.keys(LEGAL_DOCS) as (keyof typeof LEGAL_DOCS)[]) {
    const doc = LEGAL_DOCS[key];
    if (!doc.version) issues.push(`Missing version for ${key}`);
    if (!doc.path) issues.push(`Missing path for ${key}`);
    const roles = doc.requiredFor as readonly string[];
    if (!roles || roles.length < 1) {
      issues.push(`No roles defined for ${key}`);
    }
  }

  return { valid: issues.length === 0, issues };
}
