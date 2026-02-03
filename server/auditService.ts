import crypto from "crypto";
import { db } from "./db";
import { notificationAudit } from "@shared/schema";
import { desc } from "drizzle-orm";

interface AuditParams {
  eventType: string;
  actorEmail: string;
  recipients: string[];
  delivery: string;
  provider: string;
  success: boolean;
  error?: string;
}

export async function appendAudit(params: AuditParams): Promise<void> {
  const { eventType, actorEmail, recipients, delivery, provider, success, error } = params;

  const [last] = await db.select({ hash: notificationAudit.hash })
    .from(notificationAudit)
    .orderBy(desc(notificationAudit.createdAt))
    .limit(1);

  const payload = JSON.stringify({
    eventType,
    actorEmail,
    recipients: JSON.stringify(recipients),
    delivery,
    provider,
    success,
    error: error || null,
    prevHash: last?.hash || null
  });

  const hash = crypto.createHash("sha256").update(payload).digest("hex");

  await db.insert(notificationAudit).values({
    eventType,
    actorEmail,
    recipients: JSON.stringify(recipients),
    delivery,
    provider,
    success,
    error: error || null,
    prevHash: last?.hash || null,
    hash
  });

  console.log(`[Audit] Logged ${eventType} for ${actorEmail}, success=${success}, hash=${hash.substring(0, 8)}...`);
}

export async function getAllAuditLogs() {
  return db.select().from(notificationAudit).orderBy(desc(notificationAudit.createdAt));
}

export async function verifyAuditChain(): Promise<{ valid: boolean; brokenAt?: number }> {
  const logs = await db.select().from(notificationAudit).orderBy(notificationAudit.createdAt);
  
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const expectedPrevHash = i === 0 ? null : logs[i - 1].hash;
    
    if (log.prevHash !== expectedPrevHash) {
      return { valid: false, brokenAt: log.id };
    }
    
    const payload = JSON.stringify({
      eventType: log.eventType,
      actorEmail: log.actorEmail,
      recipients: log.recipients,
      delivery: log.delivery,
      provider: log.provider,
      success: log.success,
      error: log.error || null,
      prevHash: log.prevHash
    });
    
    const computedHash = crypto.createHash("sha256").update(payload).digest("hex");
    if (computedHash !== log.hash) {
      return { valid: false, brokenAt: log.id };
    }
  }
  
  return { valid: true };
}
