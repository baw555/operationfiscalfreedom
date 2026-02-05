import { getResendClient } from './resendClient';

type AlertType = 'CONTRACT_SIGN_FAIL' | 'AUTH_FAIL' | 'CORE_FUNCTION_FAIL' | 'EMERGENCY_MODE';

interface SafeAction {
  id: number;
  code: string;
  label: string;
}

interface ContractSigningAlert {
  type: 'CONTRACT_SIGN_FAIL';
  contractId: string;
  userImpacted: number;
  emergencyMode: boolean;
  whatHappened: string[];
  safeActions: SafeAction[];
}

interface AuthFailAlert {
  type: 'AUTH_FAIL';
  userHash: string;
  provider: string;
  failureType: string;
  impact: string;
  safeActions: SafeAction[];
}

interface CoreFunctionAlert {
  type: 'CORE_FUNCTION_FAIL';
  functionName: string;
  failure: string;
  usersImpacted: number;
  safeActions: SafeAction[];
}

type RepairAlert = ContractSigningAlert | AuthFailAlert | CoreFunctionAlert;

export async function sendRepairAlert(alert: RepairAlert): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.error('[RepairMailer] No admin email configured');
    return false;
  }

  const timestamp = new Date().toISOString();
  let subject: string;
  let body: string;

  switch (alert.type) {
    case 'CONTRACT_SIGN_FAIL':
      subject = `🚨 Contract Signing Blocked — Action Required (${alert.contractId})`;
      body = `CRITICAL PATH ALERT — CONTRACT SIGNING

Contract ID: ${alert.contractId}
User Impacted: ${alert.userImpacted}
Status: ${alert.emergencyMode ? 'EMERGENCY MODE ENABLED' : 'AWAITING ACTION'}
Timestamp (UTC): ${timestamp}

What happened:
${alert.whatHappened.map(w => `• ${w}`).join('\n')}

SAFE ACTIONS AVAILABLE:
${alert.safeActions.map(a => `[${a.id}] ${a.code}`).join('\n')}

Reply with ONE command on its own line:

${alert.safeActions.map(a => `APPROVE ${a.id}`).join('\n')}
STATUS
LOCK ${alert.contractId}
ESCALATE

(Any other text will be ignored.)`;
      break;

    case 'AUTH_FAIL':
      subject = `🚨 User Login Blocked — Auth Repair Available`;
      body = `CRITICAL PATH ALERT — AUTHENTICATION

User: ${alert.userHash}
Provider: ${alert.provider}
Failure Type: ${alert.failureType}
Impact: ${alert.impact}

SAFE ACTIONS:
${alert.safeActions.map(a => `[${a.id}] ${a.code}`).join('\n')}

Reply with:
${alert.safeActions.map(a => `APPROVE ${a.id}`).join('\n')}
STATUS
ESCALATE`;
      break;

    case 'CORE_FUNCTION_FAIL':
      subject = `⚠️ Core Function Blocked — Repair Available`;
      body = `SYSTEM ALERT — CORE FUNCTION FAILURE

Function: ${alert.functionName}
Failure: ${alert.failure}
Users Impacted: ${alert.usersImpacted}

SAFE ACTIONS:
${alert.safeActions.map(a => `[${a.id}] ${a.code}`).join('\n')}

Reply with:
APPROVE <ACTION_NUMBER>
STATUS
ESCALATE`;
      break;
  }

  try {
    const { client, fromEmail } = await getResendClient();
    const result = await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      text: body,
    });

    console.log('[RepairMailer] Alert sent:', result);
    return true;
  } catch (error) {
    console.error('[RepairMailer] Failed to send alert:', error);
    return false;
  }
}

export async function sendStatusUpdate(
  incidentId: string, 
  actionApproved: string,
  result: 'SUCCESS' | 'FAILED',
  details?: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return false;

  const timestamp = new Date().toISOString();
  const emoji = result === 'SUCCESS' ? '✅' : '❌';
  
  const subject = `${emoji} Repair Update — ${incidentId}`;
  
  let body = `REPAIR STATUS UPDATE

Incident ID: ${incidentId}
Action Approved: ${actionApproved}
Result: ${result}
Timestamp (UTC): ${timestamp}

${result === 'SUCCESS' ? `• Contract remains legally intact
• No authority was modified
• Incident record updated` : `• Action failed
• Next Step: ESCALATED TO ADMIN QUEUE`}

${details ? `Details: ${details}` : ''}

Reply with:
STATUS
LOCK ${incidentId}
ESCALATE`;

  try {
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    console.error('[RepairMailer] Status update failed:', error);
    return false;
  }
}

export async function sendEmergencyLockConfirmation(targetId: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return false;

  const subject = `🔒 Emergency Lock Confirmed — ${targetId}`;
  const body = `EMERGENCY MODE ACTIVE

Target: ${targetId}
Status: LOCKED
Authority: UNCHANGED
Next Step: Admin UI required to unlock

Timestamp (UTC): ${new Date().toISOString()}

This lock was triggered via email command.
All auto-repair actions are now disabled for this target.
Manual intervention through the admin dashboard is required to unlock.`;

  try {
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    console.error('[RepairMailer] Emergency lock confirmation failed:', error);
    return false;
  }
}

export async function sendEscalationConfirmation(incidentId: string, reason: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return false;

  const subject = `🚩 Escalation Confirmed — ${incidentId}`;
  const body = `ESCALATION CONFIRMED

Incident ID: ${incidentId}
Status: ESCALATED TO HUMAN REVIEW
Reason: ${reason}
Timestamp (UTC): ${new Date().toISOString()}

This incident has been added to the admin repair queue.
Auto-repair has been disabled pending human review.

Access the Admin Repair Queue to review and resolve.`;

  try {
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    console.error('[RepairMailer] Escalation confirmation failed:', error);
    return false;
  }
}
