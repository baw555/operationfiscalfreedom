import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface RepairAlertPayload {
  type: 'AUTH_FAIL' | 'CONTRACT_SIGN_FAIL' | 'PAYMENT_FAIL' | 'SAVE_FAIL' | 'EMERGENCY_MODE';
  incidentId: string;
  userImpacted: number;
  contractId?: string;
  rootCause: string[];
  safeActions: { id: number; label: string; actionType: string }[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  emergencyMode?: boolean;
}

export async function sendRepairAlert(payload: RepairAlertPayload): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.error('[RepairMailer] No admin email configured');
    return false;
  }

  const severityEmoji = {
    CRITICAL: '🚨',
    HIGH: '⚠️',
    MEDIUM: '📋'
  };

  const typeLabels: Record<string, string> = {
    AUTH_FAIL: 'Authentication Blocked',
    CONTRACT_SIGN_FAIL: 'Contract Signing Blocked',
    PAYMENT_FAIL: 'Payment Processing Failed',
    SAVE_FAIL: 'Data Save Failed',
    EMERGENCY_MODE: 'Emergency Mode Triggered'
  };

  const subject = `${severityEmoji[payload.severity]} ${typeLabels[payload.type] || payload.type} — Action Required`;

  const actionLines = payload.safeActions.map((a, i) => 
    `${i + 1}) ${a.label}`
  ).join('\n');

  const commandLines = payload.safeActions.map((a, i) => 
    `APPROVE ${i + 1}`
  ).join('\n');

  const textBody = `
═══════════════════════════════════════════════════
FACER-C REPAIR SYSTEM — INCIDENT ALERT
═══════════════════════════════════════════════════

Issue Type: ${payload.type}
Incident ID: ${payload.incidentId}
Users Impacted: ${payload.userImpacted}
${payload.contractId ? `Contract ID: ${payload.contractId}` : ''}
Status: ${payload.emergencyMode ? '🔒 EMERGENCY MODE ENABLED' : 'Awaiting Action'}

───────────────────────────────────────────────────
ROOT CAUSE ANALYSIS
───────────────────────────────────────────────────
${payload.rootCause.map(c => `• ${c}`).join('\n')}

───────────────────────────────────────────────────
SAFE ACTIONS AVAILABLE
───────────────────────────────────────────────────
${actionLines}

───────────────────────────────────────────────────
REPLY COMMANDS
───────────────────────────────────────────────────
Reply with ONE of the following:

${commandLines}
ESCALATE
STATUS

Example: Reply with "APPROVE 1" to execute first action.

═══════════════════════════════════════════════════
FACER-C | Friendly Army Corp of Engineers Repair
Incident: ${payload.incidentId} | ${new Date().toISOString()}
═══════════════════════════════════════════════════
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Courier New', monospace; background: #0A1A0C; color: #00FF88; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #00FF88; padding: 20px; }
    .header { border-bottom: 2px solid #00FF88; padding-bottom: 15px; margin-bottom: 15px; }
    .header h1 { color: #FFD700; margin: 0; font-size: 18px; }
    .header .subtitle { color: #00FF88; opacity: 0.7; font-size: 12px; }
    .section { margin: 15px 0; padding: 10px; background: rgba(0,255,136,0.1); border-left: 3px solid #00FF88; }
    .section-title { color: #FFD700; font-weight: bold; margin-bottom: 10px; }
    .label { color: #00FF88; opacity: 0.6; }
    .value { color: #00FF88; font-weight: bold; }
    .emergency { background: rgba(255,0,0,0.2); border-color: #FF3333; color: #FF3333; }
    .action { padding: 5px 10px; margin: 5px 0; background: rgba(0,255,136,0.2); }
    .command { background: #1A2A1C; padding: 10px; font-family: monospace; margin: 5px 0; }
    .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #00FF88; opacity: 0.6; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⭐ FACER-C REPAIR SYSTEM</h1>
      <div class="subtitle">INCIDENT ALERT — ACTION REQUIRED</div>
    </div>
    
    <div class="section ${payload.emergencyMode ? 'emergency' : ''}">
      <div><span class="label">Issue Type:</span> <span class="value">${payload.type}</span></div>
      <div><span class="label">Incident ID:</span> <span class="value">${payload.incidentId}</span></div>
      <div><span class="label">Users Impacted:</span> <span class="value">${payload.userImpacted}</span></div>
      ${payload.contractId ? `<div><span class="label">Contract ID:</span> <span class="value">${payload.contractId}</span></div>` : ''}
      <div><span class="label">Status:</span> <span class="value">${payload.emergencyMode ? '🔒 EMERGENCY MODE' : 'Awaiting Action'}</span></div>
    </div>

    <div class="section">
      <div class="section-title">ROOT CAUSE ANALYSIS</div>
      ${payload.rootCause.map(c => `<div>• ${c}</div>`).join('')}
    </div>

    <div class="section">
      <div class="section-title">SAFE ACTIONS AVAILABLE</div>
      ${payload.safeActions.map((a, i) => `<div class="action">${i + 1}) ${a.label}</div>`).join('')}
    </div>

    <div class="section">
      <div class="section-title">REPLY COMMANDS</div>
      <p>Reply to this email with one command:</p>
      ${payload.safeActions.map((_, i) => `<div class="command">APPROVE ${i + 1}</div>`).join('')}
      <div class="command">ESCALATE</div>
      <div class="command">STATUS</div>
    </div>

    <div class="footer">
      FACER-C | Friendly Army Corp of Engineers Repair<br>
      Incident: ${payload.incidentId} | ${new Date().toISOString()}
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const result = await resend.emails.send({
      from: 'FACER-C Repair <onboarding@resend.dev>',
      to: adminEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log('[RepairMailer] Alert sent:', result);
    return true;
  } catch (error) {
    console.error('[RepairMailer] Failed to send alert:', error);
    return false;
  }
}

export async function sendStatusUpdate(incidentId: string, status: string, details: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) return false;

  try {
    await resend.emails.send({
      from: 'FACER-C Repair <onboarding@resend.dev>',
      to: adminEmail,
      subject: `📋 Status Update: ${incidentId}`,
      text: `
FACER-C STATUS UPDATE
═════════════════════

Incident: ${incidentId}
Status: ${status}

${details}

─────────────────────
${new Date().toISOString()}
      `.trim(),
    });
    return true;
  } catch (error) {
    console.error('[RepairMailer] Status update failed:', error);
    return false;
  }
}
