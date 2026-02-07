import { storage } from "../storage";
import { LEGAL_DOCS, signLegalDocumentAtomic, hashDocument } from "../legal-system";
import { emitEvent } from "./emit-event";
import type { Request } from "express";

interface DegradedReport {
  feature: string;
  reason: string;
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
  req: Request;
}

type ActionResult =
  | { ok: true; nda: any; alreadySigned?: boolean }
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
  const existingUser = await storage.getUserByReferralCode(codeToCheck);
  if (existingUser && existingUser.id !== userId) {
    return { ok: false, code: 400, message: "This referral code is already taken. Please choose a different code." };
  }

  const isDegraded = degradedCapabilities && (
    degradedCapabilities.camera !== "available" ||
    degradedCapabilities.upload !== "available"
  );

  const validatedReports: DegradedReport[] = [];
  if (degradedFeatures && Array.isArray(degradedFeatures)) {
    for (const f of degradedFeatures) {
      if (f && typeof f.feature === "string" && typeof f.reason === "string" && typeof f.timestamp === "number") {
        validatedReports.push({
          feature: f.feature.substring(0, 50),
          reason: f.reason.substring(0, 100),
          timestamp: f.timestamp,
        });
      }
    }
  }

  try {
    const result = await storage.signNdaAtomic(userId, codeToCheck, {
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
    });

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

    const ndaId = result.nda?.id;

    if (!result.alreadySigned) {
      emitEvent({
        eventType: "NDA_SIGNED",
        userId,
        entityId: ndaId,
        entityType: "nda",
        payload: {
          fullName,
          address,
          referralCode: codeToCheck,
          hasFacePhoto: !!facePhoto,
          hasIdPhoto: !!idPhoto,
          ipAddress,
        },
        degraded: !!isDegraded,
      });
    }

    if (validatedReports.length > 0) {
      emitEvent({
        eventType: "DEGRADED_SUBMISSION",
        userId,
        entityId: ndaId,
        entityType: "nda",
        payload: {
          page: "affiliate-nda",
          reports: validatedReports,
          capabilities: degradedCapabilities || {},
          hasFacePhoto: !!facePhoto,
          hasIdPhoto: !!idPhoto,
        },
        degraded: true,
      });
    }

    if (result.alreadySigned) {
      return { ok: true, nda: result.nda, alreadySigned: true };
    }

    return { ok: true, nda: result.nda };
  } catch (codeError: any) {
    if (codeError?.code === "23505") {
      return { ok: false, code: 400, message: "This referral code was just taken by another user. Please choose a different code." };
    }
    throw codeError;
  }
}
