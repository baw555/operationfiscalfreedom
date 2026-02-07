import { db } from "../db";
import { affiliateNda, events, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { LEGAL_DOCS, signLegalDocumentAtomic, hashDocument } from "../legal-system";
import type { Request } from "express";

interface DegradedReport {
  feature: string;
  reason: string;
  acknowledgedByUser: true;
  timestamp: number;
}

interface SubmitNdaInput {
  userId: number;
  fullName: string;
  veteranNumber?: string;
  address: string;
  customReferralCode: string;
  signatureData: string;
  facePhoto?: string | null;
  idPhoto?: string | null;
  agreedToTerms: boolean | string;
  degradedCapabilities?: {
    camera?: string;
    upload?: string;
  };
  degradedFeatures?: DegradedReport[];
  ipAddress: string;
  userAgent?: string;
  req: Request;
}

type ActionResult =
  | { ok: true; ndaId: number; status: "accepted"; degraded: boolean; nda: any; alreadySigned?: boolean }
  | { ok: false; code: number; message: string };

export async function submitAffiliateNda(input: SubmitNdaInput): Promise<ActionResult> {
  const {
    userId,
    fullName,
    veteranNumber,
    address,
    customReferralCode,
    signatureData,
    facePhoto,
    idPhoto,
    agreedToTerms,
    degradedCapabilities,
    degradedFeatures,
    ipAddress,
    req,
  } = input;

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return { ok: false, code: 400, message: "Full legal name is required (at least 2 characters)" };
  }

  if (!address || typeof address !== "string" || address.trim().length < 5) {
    return { ok: false, code: 400, message: "Address is required (at least 5 characters)" };
  }

  if (!signatureData || typeof signatureData !== "string" || !signatureData.startsWith("data:image/")) {
    return { ok: false, code: 400, message: "Your signature is required - please sign in the signature box" };
  }

  if (facePhoto && (typeof facePhoto !== "string" || !facePhoto.startsWith("data:image/"))) {
    return { ok: false, code: 400, message: "Face photo must be a valid image if provided" };
  }

  if (idPhoto && (typeof idPhoto !== "string" || !idPhoto.startsWith("data:image/"))) {
    return { ok: false, code: 400, message: "ID document must be a valid image if provided" };
  }

  if (agreedToTerms !== true && agreedToTerms !== "true") {
    return { ok: false, code: 400, message: "You must agree to the terms to proceed" };
  }

  if (!customReferralCode || typeof customReferralCode !== "string" || customReferralCode.trim().length < 3) {
    return { ok: false, code: 400, message: "Custom referral code is required (at least 3 characters)" };
  }

  const codeToCheck = customReferralCode.toUpperCase().trim();

  const degraded = Boolean(
    degradedCapabilities && (
      degradedCapabilities.camera !== "available" ||
      degradedCapabilities.upload !== "available"
    )
  );

  const validatedReports: DegradedReport[] = [];
  if (degradedFeatures && Array.isArray(degradedFeatures)) {
    for (const f of degradedFeatures) {
      if (f && typeof f.feature === "string" && typeof f.reason === "string" && typeof f.timestamp === "number") {
        validatedReports.push({
          feature: f.feature.substring(0, 50),
          reason: f.reason.substring(0, 100),
          acknowledgedByUser: true,
          timestamp: f.timestamp,
        });
      }
    }
  }

  try {
    const txResult = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(affiliateNda).where(eq(affiliateNda.userId, userId));
      if (existing) {
        return { nda: existing, alreadySigned: true as const };
      }

      const existingCode = await tx.select().from(users).where(eq(users.referralCode, codeToCheck));
      if (existingCode.length > 0 && existingCode[0].id !== userId) {
        return { error: true as const, code: 400, message: "This referral code is already taken. Please choose a different code." };
      }

      await tx.update(users).set({ referralCode: codeToCheck }).where(eq(users.id, userId));

      const [created] = await tx.insert(affiliateNda).values({
        userId,
        fullName,
        veteranNumber: veteranNumber || null,
        address,
        customReferralCode: customReferralCode || null,
        signatureData: signatureData || null,
        facePhoto: facePhoto || null,
        idPhoto: idPhoto || null,
        signedIpAddress: ipAddress,
        agreedToTerms: "true",
      }).returning();

      await tx.insert(events).values({
        eventType: "NDA_SUBMITTED",
        userId,
        entityId: created.id,
        entityType: "nda",
        degraded,
        payload: {
          fullName,
          address,
          referralCode: codeToCheck,
          hasFacePhoto: !!facePhoto,
          hasIdPhoto: !!idPhoto,
          ipAddress,
        },
      });

      if (degraded || validatedReports.length > 0) {
        await tx.insert(events).values({
          eventType: "NDA_SUBMITTED_WITH_DEGRADATION",
          userId,
          entityId: created.id,
          entityType: "nda",
          degraded: true,
          payload: {
            page: "affiliate-nda",
            reports: validatedReports,
            capabilities: degradedCapabilities || {},
            hasFacePhoto: !!facePhoto,
            hasIdPhoto: !!idPhoto,
          },
        });
      }

      return { nda: created, alreadySigned: false as const };
    });

    if ("error" in txResult) {
      return { ok: false, code: txResult.code, message: txResult.message };
    }

    try {
      await signLegalDocumentAtomic({
        userId,
        doc: LEGAL_DOCS.NDA,
        docHash: hashDocument(JSON.stringify({ fullName, signatureData, address })),
        req,
      });
      console.log(`[NDA Sign] Mirrored to legal_signatures for user ${userId}`);
    } catch (mirrorError) {
      console.error("[NDA Sign] Mirror to legal system failed (non-blocking):", mirrorError);
    }

    if (txResult.alreadySigned) {
      return { ok: true, ndaId: txResult.nda.id, status: "accepted", degraded, nda: txResult.nda, alreadySigned: true };
    }

    return { ok: true, ndaId: txResult.nda.id, status: "accepted", degraded, nda: txResult.nda };
  } catch (codeError: any) {
    if (codeError?.code === "23505") {
      return { ok: false, code: 400, message: "This referral code was just taken by another user. Please choose a different code." };
    }
    throw codeError;
  }
}
