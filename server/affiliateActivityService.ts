import crypto from "crypto";
import { storage } from "./storage";
import { sendEmailWithRetry } from "./emailWithRetry";
import { vltAffiliates, users } from "@shared/schema";
import { db } from "./db";
import { eq, inArray } from "drizzle-orm";

const MASTER_EMAIL = process.env.MASTER_EMAIL || "infoservicesbhi@gmail.com";

export const ACTIVITY_TYPES = [
  "SITE_VISIT",
  "CONTRACT_VIEW",
  "CONTRACT_SIGNED",
  "INFO_REQUEST",
  "AFFILIATE_CLICK",
  "AFFILIATE_SIGNUP"
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number];

interface ActivityEventParams {
  type: ActivityType;
  actorEmail: string;
  actorUserId?: number;
  metadata?: Record<string, any>;
}

function stableStringify(obj: Record<string, any>): string {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return JSON.stringify(sortedObj);
}

function hashEvent(type: string, actorEmail: string, metadata: Record<string, any>, actorUserId?: number): string {
  const normalizedEmail = actorEmail.toLowerCase().trim();
  const dataToHash = type + normalizedEmail + stableStringify(metadata) + (actorUserId || "");
  return crypto
    .createHash("sha256")
    .update(dataToHash)
    .digest("hex");
}

interface RecipientInfo {
  email: string;
  userId?: number;
}

async function getUplineRecipientsFromVlt(affiliateEmail: string, affiliateUserId?: number): Promise<RecipientInfo[]> {
  const normalizedEmail = affiliateEmail.toLowerCase().trim();
  
  let affiliate = await db.select().from(vltAffiliates).where(eq(vltAffiliates.email, normalizedEmail)).then(r => r[0]);
  
  if (!affiliate && affiliateUserId) {
    const user = await storage.getUser(affiliateUserId);
    if (user?.email) {
      affiliate = await db.select().from(vltAffiliates).where(eq(vltAffiliates.email, user.email.toLowerCase())).then(r => r[0]);
    }
  }
  
  if (!affiliate) return [];
  
  const levelIds = [
    affiliate.level1Id,
    affiliate.level2Id,
    affiliate.level3Id,
    affiliate.level4Id,
    affiliate.level5Id,
    affiliate.level6Id
  ].filter((id): id is number => id !== null && id !== undefined);
  
  if (levelIds.length === 0) return [];
  
  const uplines = await db.select({ email: vltAffiliates.email, userId: vltAffiliates.userId })
    .from(vltAffiliates)
    .where(inArray(vltAffiliates.id, levelIds));
  
  return uplines.map(u => ({ email: u.email, userId: u.userId || undefined }));
}

async function shouldNotify(userId: number | undefined, eventType: ActivityType): Promise<{ enabled: boolean; extraEmails: string[] }> {
  if (!userId) return { enabled: true, extraEmails: [] };
  
  const settings = await storage.getNotificationSettings(userId);
  if (!settings) return { enabled: true, extraEmails: [] };
  
  if (!settings.enabled) return { enabled: false, extraEmails: [] };
  
  let eventPrefs: Record<string, boolean> = {};
  try {
    if (settings.events) {
      eventPrefs = JSON.parse(settings.events);
    }
  } catch {
    eventPrefs = {};
  }
  
  const shouldSend = eventPrefs[eventType] !== false;
  
  let extraEmails: string[] = [];
  try {
    if (settings.emails) {
      extraEmails = JSON.parse(settings.emails);
    }
  } catch {
    extraEmails = [];
  }
  
  return { enabled: shouldSend, extraEmails };
}

function buildActivityEmailHtml(type: ActivityType, actorEmail: string, metadata?: Record<string, any>): string {
  const typeLabels: Record<ActivityType, string> = {
    SITE_VISIT: "🌐 Site Visit",
    CONTRACT_VIEW: "📄 Contract Viewed",
    CONTRACT_SIGNED: "✍️ Contract Signed",
    INFO_REQUEST: "ℹ️ Information Request",
    AFFILIATE_CLICK: "🔗 Affiliate Link Click",
    AFFILIATE_SIGNUP: "🎉 New Affiliate Signup"
  };

  const metadataHtml = metadata && Object.keys(metadata).length > 0
    ? `<div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin-top: 16px;">
        <strong>Details:</strong>
        <pre style="margin: 8px 0 0 0; white-space: pre-wrap;">${JSON.stringify(metadata, null, 2)}</pre>
       </div>`
    : "";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1A365D 0%, #2563EB 100%); color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">NavigatorUSA Activity Alert</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #E21C3D; margin-top: 0;">${typeLabels[type]}</h2>
        <p style="font-size: 16px; color: #374151;">
          <strong>User:</strong> ${actorEmail}
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          <strong>Time:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
        </p>
        ${metadataHtml}
      </div>
      <div style="background: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
        NavigatorUSA - Empowering Veteran Families
      </div>
    </div>
  `;
}

export async function recordAffiliateActivity(params: ActivityEventParams): Promise<{ 
  success: boolean; 
  isDuplicate?: boolean;
  notifiedEmails?: string[];
  skippedEmails?: string[];
  error?: string;
}> {
  const { type, actorUserId, metadata = {} } = params;
  const actorEmail = params.actorEmail.toLowerCase().trim();
  
  const hash = hashEvent(type, actorEmail, metadata, actorUserId);
  
  const existing = await storage.getAffiliateActivityByHash(hash);
  if (existing) {
    console.log(`[AffiliateActivity] Duplicate event ignored: ${type} for ${actorEmail}`);
    return { success: true, isDuplicate: true };
  }
  
  const recipientsToNotify: Set<string> = new Set();
  const skippedEmails: string[] = [];
  
  recipientsToNotify.add(MASTER_EMAIL);
  
  const uplineRecipients = await getUplineRecipientsFromVlt(actorEmail, actorUserId);
  
  for (const recipient of uplineRecipients) {
    const { enabled, extraEmails } = await shouldNotify(recipient.userId, type);
    
    if (enabled) {
      recipientsToNotify.add(recipient.email);
      extraEmails.forEach(email => recipientsToNotify.add(email.toLowerCase().trim()));
    } else {
      skippedEmails.push(recipient.email);
      console.log(`[AffiliateActivity] Skipped ${recipient.email} - notifications disabled for ${type}`);
    }
  }
  
  const notifiedEmails: string[] = [];
  const emailHtml = buildActivityEmailHtml(type, actorEmail, metadata);
  const subject = `Activity Alert: ${type.replace(/_/g, " ")}`;
  
  const recipientArray = Array.from(recipientsToNotify);
  for (const email of recipientArray) {
    try {
      const result = await sendEmailWithRetry({
        to: email,
        subject,
        html: emailHtml
      });
      if (result.success) {
        notifiedEmails.push(email);
        console.log(`[AffiliateActivity] Email sent to ${email}`);
      } else {
        console.error(`[AffiliateActivity] Failed to email ${email}: ${result.error}`);
      }
    } catch (err) {
      console.error(`[AffiliateActivity] Email error for ${email}:`, err);
    }
  }
  
  await storage.createAffiliateActivity({
    type,
    actorEmail,
    actorUserId: actorUserId || null,
    metadata: JSON.stringify(metadata),
    hash,
    notifiedEmails: JSON.stringify(notifiedEmails)
  });
  
  console.log(`[AffiliateActivity] Recorded ${type} for ${actorEmail}, notified ${notifiedEmails.length} recipients, skipped ${skippedEmails.length}`);
  
  return {
    success: true,
    notifiedEmails,
    skippedEmails
  };
}
