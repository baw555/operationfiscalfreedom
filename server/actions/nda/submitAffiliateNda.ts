import { submitAffiliateNdaAction } from "./submitAffiliateNdaAction";
import { isReplay } from "../withIdempotency";
import { notifyDegradedSubmission } from "../../notifications/notifyDegradedSubmission";
import { LEGAL_DOCS, signLegalDocumentCore, hashDocument } from "../../legal-system";
import type { DegradedReport } from "./createNdaCore";

export interface SubmitNdaInput {
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
  userAgent: string;
  idempotencyKey?: string;
}

type ActionResult =
  | { ok: true; ndaId: number; status: "accepted"; degraded: boolean; alreadySigned?: boolean; replay?: boolean }
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
  if (!degradedFeatures || !Array.isArray(degradedFeatures)) return [];
  const validated: DegradedReport[] = [];
  for (const f of degradedFeatures) {
    if (f && typeof f.feature === "string" && typeof f.reason === "string" && typeof f.timestamp === "number") {
      validated.push({
        feature: f.feature.substring(0, 50),
        reason: f.reason.substring(0, 100),
        acknowledgedByUser: true,
        timestamp: f.timestamp,
      });
    }
  }
  return validated;
}

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
  const degradedReports = parseDegradedReports(input.degradedFeatures);
  const idempotencyKey = input.idempotencyKey || crypto.randomUUID();

  try {
    const result = await submitAffiliateNdaAction({
      idempotencyKey,
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
      ndaVersionId: "v1",
      degraded,
      degradedReports,
      degradedCapabilities: input.degradedCapabilities,
      agreedToTerms: input.agreedToTerms,
    });

    if (isReplay(result)) {
      console.log(`[NDA Sign] Idempotency replay: ndaId=${result.entityId}`);
      return { ok: true, ndaId: result.entityId, status: "accepted", degraded, alreadySigned: true, replay: true };
    }

    await mirrorToLegalSystem(input);

    if (degraded && !result.alreadySigned) {
      await notifyDegradedSubmission({
        userId: input.userId,
        entityId: result.entityId,
        entityType: "nda",
        degradedFeatures: degradedReports,
      });
    }

    return {
      ok: true,
      ndaId: result.entityId,
      status: "accepted",
      degraded: result.degraded,
      alreadySigned: result.alreadySigned || undefined,
    };
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

async function mirrorToLegalSystem(input: SubmitNdaInput): Promise<void> {
  try {
    await signLegalDocumentCore({
      userId: input.userId,
      documentType: LEGAL_DOCS.NDA.type,
      documentVersion: LEGAL_DOCS.NDA.version,
      documentHash: hashDocument(JSON.stringify({
        fullName: input.fullName,
        signatureData: input.signatureData,
        address: input.address,
      })),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    console.log(`[NDA Sign] Mirrored to legal_signatures for user ${input.userId}`);
  } catch (mirrorError) {
    console.error("[NDA Sign] Mirror to legal system failed (non-blocking):", mirrorError);
  }
}
