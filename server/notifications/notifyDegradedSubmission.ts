import { enqueueNotification } from "../queueService";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

interface DegradedReport {
  feature: string;
  reason: string;
  acknowledgedByUser: true;
  timestamp: number;
}

interface NotifyDegradedInput {
  userId: number;
  entityId: number;
  entityType: string;
  degradedFeatures: DegradedReport[];
}

export async function notifyDegradedSubmission(input: NotifyDegradedInput): Promise<void> {
  const { userId, entityId, entityType, degradedFeatures } = input;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  if (!adminEmail) {
    console.warn("[DegradedNotify] No admin email configured — skipping notification");
    return;
  }

  let userName = `User #${userId}`;
  try {
    const [user] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, userId));
    if (user) {
      userName = user.name || user.email || userName;
    }
  } catch {
    // non-blocking — use fallback name
  }

  const subject = `⚠️ Degraded Submission — ${entityType.toUpperCase()} #${entityId}`;

  const html = `
<h2>Degraded Feature Submission</h2>
<p><strong>User:</strong> ${userName} (ID: ${userId})</p>
<p><strong>Entity:</strong> ${entityType} #${entityId}</p>
<p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
<h3>Degraded Features (${degradedFeatures.length})</h3>
<ul>
${degradedFeatures.map((f) => `<li><strong>${f.feature}</strong>: ${f.reason}<br/><small>Acknowledged: ${new Date(f.timestamp).toISOString()}</small></li>`).join("\n")}
</ul>
<p><em>The user explicitly acknowledged these degraded features and chose to proceed.</em></p>
`.trim();

  try {
    await enqueueNotification({
      to: adminEmail,
      subject,
      html,
      userId,
      delivery: "email",
    });
    console.log(`[DegradedNotify] Queued degraded submission alert for ${entityType} #${entityId}`);
  } catch (err) {
    console.error(`[DegradedNotify] Failed to queue notification for ${entityType} #${entityId}:`, err);
  }
}
