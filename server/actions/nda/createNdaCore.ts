import { affiliateNda, events, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export type DegradedReport = {
  feature: string;
  reason: string;
  acknowledgedByUser: true;
  timestamp: number;
};

export type CreateNdaCoreInput = {
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
  degradedReports: DegradedReport[];
  degradedCapabilities?: { camera?: string; upload?: string };
};

export async function createNdaCore(
  tx: any,
  input: CreateNdaCoreInput
): Promise<{ entityId: number; degraded: boolean; alreadySigned: boolean }> {
  const {
    userId, fullName, veteranNumber, address,
    customReferralCode, signatureData, facePhoto, idPhoto,
    ipAddress, codeToCheck, degraded, degradedReports, degradedCapabilities,
  } = input;

  const [existing] = await tx.select().from(affiliateNda).where(eq(affiliateNda.userId, userId));
  if (existing) {
    return { entityId: existing.id, degraded, alreadySigned: true };
  }

  const existingCode = await tx.select().from(users).where(eq(users.referralCode, codeToCheck));
  if (existingCode.length > 0 && existingCode[0].id !== userId) {
    throw Object.assign(
      new Error("This referral code is already taken. Please choose a different code."),
      { statusCode: 400 }
    );
  }

  await tx.update(users).set({ referralCode: codeToCheck }).where(eq(users.id, userId));

  const [nda] = await tx.insert(affiliateNda).values({
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

  if (degraded || degradedReports.length > 0) {
    await tx.insert(events).values({
      eventType: "NDA_SUBMITTED_WITH_DEGRADATION",
      userId,
      entityId: nda.id,
      entityType: "nda",
      degraded: true,
      payload: {
        page: "affiliate-nda",
        reports: degradedReports,
        capabilities: degradedCapabilities || {},
        hasFacePhoto: !!facePhoto,
        hasIdPhoto: !!idPhoto,
      },
    });
  }

  return { entityId: nda.id, degraded, alreadySigned: false };
}
