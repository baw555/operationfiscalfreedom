import { db } from "../db";
import { affiliateNda, events, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { LEGAL_DOCS, signLegalDocumentAtomic, hashDocument } from "../legal-system";
import { notifyDegradedSubmission } from "../notifications/notifyDegradedSubmission";
import { withIdempotency, isReplay } from "./withIdempotency";
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
  idempotencyKey?: string;
  req: Request;
}

type ActionResult =
  | { ok: true; ndaId: number; status: "accepted"; degraded: boolean; nda: any; alreadySigned?: boolean; replay?: boolean }
  | { ok: false; code: number; message: string };

function validateInput(input: SubmitNdaInput): { ok: false; code: number; message: string } | null {
  const { fullName, address, signatureData, facePhoto, idPhoto, agreedToTerms, customReferralCode } = input;

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
  return null;
}

function parseDegradedReports(degradedFeatures?: DegradedReport[]): DegradedReport[] {
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
  return validatedReports;
}

interface CoreInput {
  idempotencyKey: string;
  userId: number;
  fullName: string;
  veteranNumber?: string;
  address: string;
  customReferralCode: string;
  signatureData: string;
  facePhoto?: string | null;
  idPhoto?: string | null;
  ipAddress: string;
  codeToCheck: string;
  degraded: boolean;
  validatedReports: DegradedReport[];
  degradedCapabilities?: { camera?: string; upload?: string };
}

async function createNda(tx: any, input: CoreInput) {
  const { userId, fullName, veteranNumber, address, customReferralCode, signatureData, facePhoto, idPhoto, ipAddress, codeToCheck } = input;

  const [existing] = await tx.select().from(affiliateNda).where(eq(affiliateNda.userId, userId));
  if (existing) {
    return { nda: existing, alreadySigned: true as const, entityId: existing.id };
  }

  const existingCode = await tx.select().from(users).where(eq(users.referralCode, codeToCheck));
  if (existingCode.length > 0 && existingCode[0].id !== userId) {
    throw Object.assign(new Error("This referral code is already taken. Please choose a different code."), { statusCode: 400 });
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

  return { nda: created, alreadySigned: false as const, entityId: created.id };
}

async function emitNdaEvents(tx: any, nda: any, input: CoreInput) {
  const { userId, fullName, address, facePhoto, idPhoto, ipAddress, codeToCheck, degraded, validatedReports, degradedCapabilities } = input;

  await tx.insert(events).values({
    eventType: "NDA_SUBMITTED",
    userId,
    entityId: nda.id,
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
      entityId: nda.id,
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
}

const submitNdaCore = withIdempotency<CoreInput, { nda: any; alreadySigned: boolean; entityId: number }>(
  "submitAffiliateNda",
  async (tx, input) => {
    const result = await createNda(tx, input);

    if (!result.alreadySigned) {
      await emitNdaEvents(tx, result.nda, input);
    }

    return result;
  }
);

export async function submitAffiliateNda(input: SubmitNdaInput): Promise<ActionResult> {
  const validationError = validateInput(input);
  if (validationError) return validationError;

  const codeToCheck = input.customReferralCode.toUpperCase().trim();

  const degraded = Boolean(
    input.degradedCapabilities && (
      input.degradedCapabilities.camera !== "available" ||
      input.degradedCapabilities.upload !== "available"
    )
  );

  const validatedReports = parseDegradedReports(input.degradedFeatures);

  if (!input.idempotencyKey) {
    input.idempotencyKey = crypto.randomUUID();
  }

  try {
    const txResult = await submitNdaCore({
      idempotencyKey: input.idempotencyKey,
      userId: input.userId,
      fullName: input.fullName,
      veteranNumber: input.veteranNumber,
      address: input.address,
      customReferralCode: input.customReferralCode,
      signatureData: input.signatureData,
      facePhoto: input.facePhoto,
      idPhoto: input.idPhoto,
      ipAddress: input.ipAddress,
      codeToCheck,
      degraded,
      validatedReports,
      degradedCapabilities: input.degradedCapabilities,
    });

    if (isReplay(txResult)) {
      const [nda] = await db.select().from(affiliateNda).where(eq(affiliateNda.id, txResult.entityId));
      if (nda) {
        console.log(`[NDA Sign] Idempotency replay: ndaId=${nda.id}`);
        return { ok: true, ndaId: nda.id, status: "accepted", degraded, nda, alreadySigned: true, replay: true };
      }
      return { ok: false, code: 404, message: "Previously submitted NDA not found" };
    }

    const result = txResult as { nda: any; alreadySigned: boolean; entityId: number };

    try {
      await signLegalDocumentAtomic({
        userId: input.userId,
        doc: LEGAL_DOCS.NDA,
        docHash: hashDocument(JSON.stringify({ fullName: input.fullName, signatureData: input.signatureData, address: input.address })),
        req: input.req,
      });
      console.log(`[NDA Sign] Mirrored to legal_signatures for user ${input.userId}`);
    } catch (mirrorError) {
      console.error("[NDA Sign] Mirror to legal system failed (non-blocking):", mirrorError);
    }

    if (degraded && !result.alreadySigned) {
      await notifyDegradedSubmission({
        userId: input.userId,
        entityId: result.entityId,
        entityType: "nda",
        degradedFeatures: validatedReports,
      });
    }

    if (result.alreadySigned) {
      return { ok: true, ndaId: result.nda.id, status: "accepted", degraded, nda: result.nda, alreadySigned: true };
    }

    return { ok: true, ndaId: result.nda.id, status: "accepted", degraded, nda: result.nda };
  } catch (err: any) {
    if (err?.statusCode === 400) {
      return { ok: false, code: 400, message: err.message };
    }
    if (err?.code === "23505") {
      return { ok: false, code: 400, message: "This referral code was just taken by another user. Please choose a different code." };
    }
    throw err;
  }
}
