import { storage } from './storage';
import { getResendClient } from './resendClient';
import { CRITICAL_PATH_POLICY } from './safety-rules';

interface IncidentSummary {
  flow: string;
  count: number;
  lastIncident: Date;
}

interface DigestData {
  totalIncidents: number;
  byFlow: IncidentSummary[];
  awaitingApproval: number;
  emergencyLocks: number;
  safeActionsAvailable: number;
  topIssues: { description: string; count: number }[];
}

export async function generateDailyDigest(): Promise<DigestData> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const allLogs = await storage.getRepairLogs(500);
  
  const recentLogs = allLogs.filter(log => 
    log.createdAt && new Date(log.createdAt) >= since
  );
  
  const flowCounts: Record<string, { count: number; lastIncident: Date }> = {};
  const issueCounts: Record<string, number> = {};
  
  for (const log of recentLogs) {
    const flow = log.issueType || 'OTHER';
    
    if (!flowCounts[flow]) {
      flowCounts[flow] = { count: 0, lastIncident: new Date(0) };
    }
    flowCounts[flow].count++;
    
    const logDate = log.createdAt ? new Date(log.createdAt) : new Date();
    if (logDate > flowCounts[flow].lastIncident) {
      flowCounts[flow].lastIncident = logDate;
    }
    
    const desc = log.description?.substring(0, 50) || 'Unknown';
    issueCounts[desc] = (issueCounts[desc] || 0) + 1;
  }
  
  const byFlow: IncidentSummary[] = Object.entries(flowCounts)
    .map(([flow, data]) => ({
      flow,
      count: data.count,
      lastIncident: data.lastIncident,
    }))
    .sort((a, b) => b.count - a.count);
  
  const escalatedLogs = allLogs.filter(log => 
    log.status === 'ESCALATED' || log.status === 'pending_approval'
  );
  
  const emergencyLogs = allLogs.filter(log => 
    log.status === 'FAILED' || log.description?.includes('EMERGENCY')
  );
  
  const pendingLogs = allLogs.filter(log => 
    log.status === 'PENDING' || log.status === 'pending'
  );
  
  const topIssues = Object.entries(issueCounts)
    .map(([description, count]) => ({ description, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalIncidents: recentLogs.length,
    byFlow,
    awaitingApproval: escalatedLogs.length,
    emergencyLocks: emergencyLogs.length,
    safeActionsAvailable: pendingLogs.length,
    topIssues,
  };
}

export async function sendDailyDigest(): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  if (!adminEmail) {
    console.error('[DailyDigest] No admin email configured');
    return false;
  }
  
  const data = await generateDailyDigest();
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const flowSummary = data.byFlow.length > 0
    ? data.byFlow.map(f => `• ${f.flow}: ${f.count}`).join('\n')
    : '• No incidents in the last 24 hours';
  
  const topIssuesSummary = data.topIssues.length > 0
    ? data.topIssues.map((i, idx) => `${idx + 1}. ${i.description} (${i.count}x)`).join('\n')
    : 'None';
  
  const subject = `📊 Daily Incident Digest — ${dateStr}`;
  
  const body = `DAILY INCIDENT DIGEST (UTC)
═══════════════════════════════════════════════════

Generated: ${timestamp}

TOTALS (LAST 24 HOURS)
───────────────────────────────────────────────────
Total Incidents: ${data.totalIncidents}
Awaiting Approval: ${data.awaitingApproval}
Emergency Locks Active: ${data.emergencyLocks}
Safe Actions Available: ${data.safeActionsAvailable}

BY FLOW TYPE
───────────────────────────────────────────────────
${flowSummary}

TOP ISSUES
───────────────────────────────────────────────────
${topIssuesSummary}

PROTECTED FLOWS MONITORED
───────────────────────────────────────────────────
${Object.keys(CRITICAL_PATH_POLICY).map(f => `• ${f}`).join('\n')}

BATCH COMMANDS (SAFE SCOPE ONLY)
───────────────────────────────────────────────────
Reply with ONE command on its own line:

APPROVE ALL     (Approve all safe pending actions)
STATUS          (Get current system status)
ESCALATE        (Flag everything for human review)

═══════════════════════════════════════════════════
FACER-C | Friendly Army Corp of Engineers Repair
Daily Digest | ${dateStr}
═══════════════════════════════════════════════════`;

  try {
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      text: body,
    });
    
    console.log('[DailyDigest] Sent successfully');
    return true;
  } catch (error) {
    console.error('[DailyDigest] Failed to send:', error);
    return false;
  }
}

export async function sendBatchApprovalResult(
  approved: number,
  skipped: number,
  details: string[]
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return false;
  
  const timestamp = new Date().toISOString();
  const subject = `✅ Batch Repair Update — APPROVE ALL`;
  
  const body = `BATCH REPAIR STATUS UPDATE
═══════════════════════════════════════════════════

Command: APPROVE ALL
Timestamp (UTC): ${timestamp}

RESULTS
───────────────────────────────────────────────────
Approved (safe): ${approved}
Skipped (approval required): ${skipped}

${details.length > 0 ? `DETAILS
───────────────────────────────────────────────────
${details.slice(0, 20).join('\n')}${details.length > 20 ? `\n... and ${details.length - 20} more` : ''}` : ''}

• All safe actions have been applied
• Authority-requiring actions remain pending
• Full audit trail logged

Reply with:
STATUS
ESCALATE

═══════════════════════════════════════════════════`;

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
    console.error('[BatchApproval] Failed to send result:', error);
    return false;
  }
}
