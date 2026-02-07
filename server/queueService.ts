import { db } from "./db";
import { notificationQueue, InsertNotificationQueue, NotificationQueue, idempotencyKeys } from "@shared/schema";
import { eq, lte, and, gte } from "drizzle-orm";
import { sendEmailWithRetry } from "./emailWithRetry";
import { appendAudit } from "./auditService";

const BACKOFF_SECONDS = [0, 60, 300, 900, 3600];
const MASTER_EMAIL = process.env.MASTER_EMAIL || "leads@navigatorusa.org";

export async function enqueueNotification(data: {
  to: string;
  subject: string;
  html: string;
  userId?: number;
  delivery: string;
}) {
  const [job] = await db.insert(notificationQueue).values({
    to: data.to,
    subject: data.subject,
    html: data.html,
    userId: data.userId,
    delivery: data.delivery,
    maxAttempts: 5,
    nextRunAt: new Date(),
  }).returning();
  
  return job;
}

export async function processJob(job: NotificationQueue) {
  let result;
  let provider = "resend";
  
  try {
    result = await sendEmailWithRetry({
      to: job.to,
      subject: job.subject,
      html: job.html
    }, { maxRetries: 1 });
    
    if (!result.success) {
      throw new Error(result.error || "Primary delivery failed");
    }
  } catch (primaryErr) {
    console.log(`[Queue] Primary failed for ${job.to}, trying secondary webhook...`);
    provider = "webhook";
    
    try {
      const webhookUrl = process.env.WEBHOOK_EMAIL_URL;
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: job.to,
            subject: job.subject,
            html: job.html
          })
        });
        result = { success: response.ok, error: response.ok ? undefined : "Webhook failed" };
      } else {
        result = { success: false, error: "No webhook URL configured" };
      }
    } catch (webhookErr) {
      result = { success: false, error: webhookErr instanceof Error ? webhookErr.message : String(webhookErr) };
    }
  }
  
  try {
    await appendAudit({
      eventType: "DELIVERY",
      actorEmail: job.to,
      recipients: [job.to],
      delivery: job.delivery,
      provider,
      success: result.success,
      error: result.error
    });
  } catch (auditErr) {
    console.error(`[Queue] Audit log failed:`, auditErr);
  }
  
  if (result.success) {
    await db.delete(notificationQueue).where(eq(notificationQueue.id, job.id));
    console.log(`[Queue] Successfully delivered to ${job.to}`);
    return;
  }
  
  const attempts = job.attempts + 1;
  
  if (attempts >= job.maxAttempts) {
    await db.update(notificationQueue)
      .set({
        attempts,
        lastError: result.error
      })
      .where(eq(notificationQueue.id, job.id));
    
    console.error(`[Queue] SLA BREACH: Max attempts reached for ${job.to}`);
    
    try {
      await sendEmailWithRetry({
        to: MASTER_EMAIL,
        subject: "🚨 Notification Delivery Failed",
        html: `<h2>SLA Breach - Notification Failed</h2>
          <pre>${JSON.stringify({
            id: job.id,
            to: job.to,
            subject: job.subject,
            attempts,
            lastError: result.error,
            createdAt: job.createdAt
          }, null, 2)}</pre>`
      });
    } catch (alertErr) {
      console.error(`[Queue] Failed to send SLA breach alert:`, alertErr);
    }
    return;
  }
  
  const delay = BACKOFF_SECONDS[Math.min(attempts, BACKOFF_SECONDS.length - 1)];
  const nextRunAt = new Date(Date.now() + delay * 1000);
  
  await db.update(notificationQueue)
    .set({
      attempts,
      nextRunAt,
      lastError: result.error
    })
    .where(eq(notificationQueue.id, job.id));
  
  console.log(`[Queue] Retry ${attempts}/${job.maxAttempts} for ${job.to} scheduled at ${nextRunAt.toISOString()}`);
}

export async function runQueueProcessor() {
  try {
    const jobs = await db.select()
      .from(notificationQueue)
      .where(lte(notificationQueue.nextRunAt, new Date()))
      .orderBy(notificationQueue.createdAt)
      .limit(10);
    
    for (const job of jobs) {
      await processJob(job);
    }
    
    return jobs.length;
  } catch (err) {
    console.error(`[Queue] Processor error:`, err);
    return 0;
  }
}

export async function getQueueStats() {
  const pending = await db.select().from(notificationQueue)
    .where(lte(notificationQueue.nextRunAt, new Date()));
  
  const failing = await db.select().from(notificationQueue)
    .where(gte(notificationQueue.attempts, 3));
  
  return {
    pendingCount: pending.length,
    failingCount: failing.length
  };
}

export async function checkDegradedMode() {
  const { failingCount } = await getQueueStats();
  
  if (failingCount > 20) {
    console.warn(`[Queue] DEGRADED MODE: ${failingCount} failing notifications`);
    
    try {
      await sendEmailWithRetry({
        to: MASTER_EMAIL,
        subject: "⚠️ System Degraded Mode",
        html: `<h2>Notification System Alert</h2>
          <p>The notification system is entering throttled digest mode.</p>
          <p><strong>${failingCount}</strong> notifications have failed 3+ times.</p>
          <p>Time: ${new Date().toISOString()}</p>`
      });
    } catch (err) {
      console.error(`[Queue] Failed to send degraded mode alert:`, err);
    }
    
    return true;
  }
  
  return false;
}

export async function promoteToDigest(userId: number) {
  const { notificationSettings } = await import("@shared/schema");
  
  await db.update(notificationSettings)
    .set({ delivery: "hourly" })
    .where(eq(notificationSettings.userId, userId));
  
  console.log(`[Queue] User ${userId} promoted to hourly digest`);
}

export async function cleanupExpiredIdempotencyKeys(): Promise<number> {
  try {
    const expired = await db.delete(idempotencyKeys)
      .where(lte(idempotencyKeys.expiresAt, new Date()))
      .returning({ key: idempotencyKeys.key });
    if (expired.length > 0) {
      console.log(`[Idempotency] Cleaned up ${expired.length} expired keys`);
    }
    return expired.length;
  } catch (err) {
    console.error("[Idempotency] Cleanup failed:", err);
    return 0;
  }
}

let queueInterval: NodeJS.Timeout | null = null;
let degradedInterval: NodeJS.Timeout | null = null;
let idempotencyCleanupInterval: NodeJS.Timeout | null = null;

export function startQueueRunner() {
  if (queueInterval) return;
  
  console.log("[Queue] Starting queue runner (5s interval)");
  queueInterval = setInterval(async () => {
    const processed = await runQueueProcessor();
    if (processed > 0) {
      console.log(`[Queue] Processed ${processed} jobs`);
    }
  }, 5000);
  
  console.log("[Queue] Starting degraded mode monitor (60s interval)");
  degradedInterval = setInterval(checkDegradedMode, 60000);

  console.log("[Queue] Starting idempotency key cleanup (1h interval)");
  idempotencyCleanupInterval = setInterval(cleanupExpiredIdempotencyKeys, 60 * 60 * 1000);
}

export function stopQueueRunner() {
  if (queueInterval) {
    clearInterval(queueInterval);
    queueInterval = null;
  }
  if (degradedInterval) {
    clearInterval(degradedInterval);
    degradedInterval = null;
  }
  if (idempotencyCleanupInterval) {
    clearInterval(idempotencyCleanupInterval);
    idempotencyCleanupInterval = null;
  }
  console.log("[Queue] Queue runner stopped");
}
