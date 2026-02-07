import { withIdempotency } from "../withIdempotency";
import { createNdaCore, type CreateNdaCoreInput, type DegradedReport } from "./createNdaCore";

export type SubmitNdaActionInput = CreateNdaCoreInput & {
  idempotencyKey: string;
  agreedToTerms: boolean | string;
};

export const submitAffiliateNdaAction = withIdempotency<
  SubmitNdaActionInput,
  { entityId: number; degraded: boolean; alreadySigned: boolean }
>(
  "submitAffiliateNda",
  async (tx, input) => {
    if (input.agreedToTerms !== true && input.agreedToTerms !== "true") {
      throw Object.assign(new Error("You must agree to the terms to proceed"), { statusCode: 400 });
    }
    if (!input.signatureData?.startsWith("data:image/")) {
      throw Object.assign(new Error("Signature required"), { statusCode: 400 });
    }

    return await createNdaCore(tx, input);
  }
);

export type { DegradedReport };
