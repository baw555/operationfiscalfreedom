import { storage } from "../../storage";
import { createAffiliateUser } from "../../auth";
import { emitEvent } from "../emit-event";
import { badRequest } from "../../platform/errors";
import type { RequestContext } from "../../platform/requestContext";

export type AffiliateSignupInput = {
  name: string;
  companyName?: string;
  phone?: string;
  email: string;
  password: string;
  description?: string;
};

export type AffiliateSignupResult = {
  success: true;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

export async function affiliateSignupAction(
  input: AffiliateSignupInput,
  ctx: RequestContext
): Promise<AffiliateSignupResult> {
  const { name, companyName, phone, email, password, description } = input;

  if (!name || !email || !password) {
    throw badRequest("INVALID_INPUT", "Name, email, and password are required");
  }

  if (password.length < 6) {
    throw badRequest("WEAK_PASSWORD", "Password must be at least 6 characters");
  }

  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    throw badRequest(
      "EMAIL_EXISTS",
      "An account with this email already exists. Please login instead."
    );
  }

  const affiliate = await createAffiliateUser(name, email, password);

  try {
    await storage.createAffiliateApplication({
      name,
      companyName: companyName || "",
      phone: phone || "",
      email,
      description: description || "",
    });
  } catch (appError) {
    console.log("Note: Could not store application details:", appError);
  }

  emitEvent({
    eventType: "AFFILIATE_SIGNUP",
    userId: affiliate.id,
    entityId: affiliate.id,
    entityType: "user",
    payload: {
      email: affiliate.email,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
      requestId: ctx.requestId,
    },
  });

  return {
    success: true,
    user: {
      id: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
      role: affiliate.role,
    },
  };
}
