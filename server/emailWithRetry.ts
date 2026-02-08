import { getResendClient } from "./resendClient";
import { Resend } from "resend";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): number {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  const jitter = Math.random() * 0.3 * delay;
  return delay + jitter;
}

function isPermanentError(error: any): boolean {
  return error.statusCode === 400 || error.statusCode === 422;
}

export async function sendEmailWithRetryClient(
  resend: Resend,
  emailParams: { from: string; to: string | string[]; subject: string; html: string; text?: string },
  maxRetries: number = 3
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resend.emails.send(emailParams);
      console.log(`[Email] Successfully sent email on attempt ${attempt}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[Email] Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (isPermanentError(error)) {
        return { success: false, error: `Invalid request: ${error.message}` };
      }
      
      if (attempt < maxRetries) {
        const delay = calculateBackoff(attempt - 1, 1000, 10000);
        console.log(`[Email] Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      } else {
        return { success: false, error: `Failed after ${maxRetries} attempts: ${error.message}` };
      }
    }
  }
  return { success: false, error: "Unknown error" };
}

export async function sendEmailWithRetry(
  emailOptions: EmailOptions,
  retryOptions: RetryOptions = {}
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 10000 } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { client, fromEmail } = await getResendClient();

      let resolvedFrom = fromEmail;
      if (emailOptions.from) {
        resolvedFrom = emailOptions.from.includes("<")
          ? emailOptions.from
          : `${emailOptions.from} <${fromEmail}>`;
      }

      const result = await client.emails.send({
        from: resolvedFrom,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send email");
      }

      console.log(`[Email] Successfully sent email on attempt ${attempt + 1}`);
      return { success: true, messageId: result.data?.id };
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `[Email] Attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        lastError.message
      );

      if (isPermanentError(error)) {
        return { success: false, error: `Invalid request: ${error.message}` };
      }

      if (attempt < maxRetries) {
        const delay = calculateBackoff(attempt, baseDelayMs, maxDelayMs);
        console.log(`[Email] Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error(`[Email] All ${maxRetries + 1} attempts failed`);
  return {
    success: false,
    error: lastError?.message || "Failed to send email after retries",
  };
}

export async function sendContractSigningEmail(
  recipientEmail: string,
  recipientName: string,
  contractName: string,
  signingUrl: string,
  senderName?: string
): Promise<{ success: boolean; error?: string }> {
  const subject = `${senderName ? `${senderName} has sent you: ` : ""}${contractName} - Signature Required`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a365d;">Document Ready for Signature</h2>
      <p>Hello ${recipientName},</p>
      <p>You have a document waiting for your signature: <strong>${contractName}</strong></p>
      ${senderName ? `<p>Sent by: ${senderName}</p>` : ""}
      <div style="margin: 30px 0;">
        <a href="${signingUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Review & Sign Document
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 7 days. If you have questions, please contact the sender.
      </p>
      <p style="color: #999; font-size: 12px;">
        If the button doesn't work, copy and paste this URL into your browser:<br/>
        ${signingUrl}
      </p>
    </div>
  `;

  const text = `
Hello ${recipientName},

You have a document waiting for your signature: ${contractName}
${senderName ? `Sent by: ${senderName}` : ""}

Click here to review and sign: ${signingUrl}

This link will expire in 7 days.
  `.trim();

  return sendEmailWithRetry({ to: recipientEmail, subject, html, text });
}
