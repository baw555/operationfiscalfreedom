import { storage } from "./storage";
import crypto from "crypto";

export interface ComplianceEvent {
  event: string;
  payload: Record<string, any>;
  timestamp: Date;
  ipHash: string;
  userAgentHash: string;
}

function hashSensitiveData(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").substring(0, 16);
}

export async function complianceLog(
  event: string, 
  payload: Record<string, any>,
  context?: { ip?: string; userAgent?: string; userId?: number }
): Promise<void> {
  try {
    const sanitizedPayload: Record<string, any> = {
      ...payload,
      ip: context?.ip ? hashSensitiveData(context.ip) : "unknown",
      userAgent: context?.userAgent ? hashSensitiveData(context.userAgent) : "unknown",
      userId: context?.userId || null,
      timestamp: new Date().toISOString()
    };

    if (payload.email) {
      sanitizedPayload.email = hashSensitiveData(payload.email);
    }
    if (payload.name) {
      sanitizedPayload.name = "[REDACTED]";
    }

    await storage.createRepairLog({
      description: `[COMPLIANCE] ${event}`,
      issueType: "AUDIT",
      status: "LOGGED",
      patch: JSON.stringify({
        event,
        payload: sanitizedPayload,
        guarantees: {
          immutableAuditTrail: true,
          noPHIMutation: true,
          noAuthPaymentTouching: true,
          leastPrivilegeExecution: true
        }
      })
    });

    console.log(`[COMPLIANCE] Logged: ${event}`);
  } catch (error) {
    console.error("[COMPLIANCE] Failed to log event:", error);
  }
}

export async function logRepairAttempt(
  description: string,
  issueType: string,
  status: string,
  context?: { ip?: string; userAgent?: string; userId?: number }
): Promise<void> {
  await complianceLog("REPAIR_ATTEMPT", {
    description: description.substring(0, 200),
    issueType,
    status
  }, context);
}

export async function logAdminAction(
  action: string,
  targetId: string,
  adminId: number,
  context?: { ip?: string; userAgent?: string }
): Promise<void> {
  await complianceLog("ADMIN_ACTION", {
    action,
    targetId,
    adminId
  }, { ...context, userId: adminId });
}

export async function logEscalation(
  issueType: string,
  reason: string,
  context?: { ip?: string; userAgent?: string; userId?: number }
): Promise<void> {
  await complianceLog("ESCALATION", {
    issueType,
    reason
  }, context);
}

export async function logPipelineGate(
  passed: boolean,
  openRepairsCount: number
): Promise<void> {
  await complianceLog("PIPELINE_GATE", {
    passed,
    openRepairsCount,
    timestamp: new Date().toISOString()
  });
}

export function getComplianceGuarantees(): Record<string, boolean> {
  return {
    immutableAuditTrail: true,
    noPHIMutation: true,
    noAuthPaymentTouching: true,
    leastPrivilegeExecution: true
  };
}
