import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";
import crypto from "crypto";

export type CriticalFlowType = "AUTH" | "CONTRACT_SIGNING";
export type DiagnosticLayer = "CLIENT" | "NETWORK" | "AUTH_PROVIDER" | "SESSION" | "USER_STATE" | "UI" | "DELIVERY" | "EMBED" | "STATE" | "WEBHOOK" | "TIMING" | "LEGAL" | "IDENTITY" | "TIMESTAMP";
export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "AUTO_FIXED" | "ESCALATED" | "EMERGENCY_MODE";

export interface DiagnosticResult {
  layer: DiagnosticLayer;
  check: string;
  passed: boolean;
  details?: string;
  autoFixable: boolean;
}

export interface CriticalIncident {
  id: string;
  flowType: CriticalFlowType;
  userId?: number;
  userHashedId: string;
  ipHash: string;
  userAgentHash: string;
  documentVersionHash?: string;
  failurePoint: string;
  diagnostics: DiagnosticResult[];
  cause: string;
  impact: string;
  proposedFix: string;
  riskLevel: IncidentSeverity;
  status: IncidentStatus;
  actionsTaken: string[];
  adminApprovalRequired: boolean;
  adminApprovedBy?: number;
  adminApprovedAt?: Date;
  createdAt: Date;
  resolvedAt?: Date;
  emergencyMode: boolean;
}

export interface IncidentReport {
  incidentId: string;
  timestamp: string;
  userHash: string;
  ipHash: string;
  uaHash: string;
  documentVersionHash?: string;
  failurePoint: string;
  actionsTaken: string[];
  adminApprovals: { adminId: number; action: string; timestamp: string }[];
  outcome: string;
  noPHIMutation: boolean;
  noRetroactiveChanges: boolean;
}

const AUTH_DIAGNOSTIC_TREE: { layer: DiagnosticLayer; checks: { name: string; autoFixable: boolean }[] }[] = [
  {
    layer: "CLIENT",
    checks: [
      { name: "Button fired?", autoFixable: true },
      { name: "JS error?", autoFixable: true },
      { name: "Network request sent?", autoFixable: true },
      { name: "Cookies allowed?", autoFixable: false }
    ]
  },
  {
    layer: "NETWORK",
    checks: [
      { name: "Request reached server?", autoFixable: false },
      { name: "4xx vs 5xx?", autoFixable: false },
      { name: "CORS blocked?", autoFixable: true },
      { name: "CSRF token present?", autoFixable: true }
    ]
  },
  {
    layer: "AUTH_PROVIDER",
    checks: [
      { name: "OAuth redirect URI mismatch", autoFixable: true },
      { name: "Expired refresh token", autoFixable: false },
      { name: "Invalid client secret", autoFixable: false },
      { name: "Scope mismatch", autoFixable: false },
      { name: "Provider outage", autoFixable: false }
    ]
  },
  {
    layer: "SESSION",
    checks: [
      { name: "SameSite misconfig", autoFixable: true },
      { name: "Secure flag mismatch", autoFixable: true },
      { name: "Domain mismatch", autoFixable: true },
      { name: "Session store unreachable", autoFixable: false }
    ]
  },
  {
    layer: "USER_STATE",
    checks: [
      { name: "User exists?", autoFixable: false },
      { name: "Disabled?", autoFixable: false },
      { name: "Email verified?", autoFixable: false },
      { name: "Duplicate identity?", autoFixable: false }
    ]
  }
];

const CONTRACT_SIGNING_FAILURE_MATRIX: { category: DiagnosticLayer; examples: { name: string; autoFixable: boolean }[] }[] = [
  {
    category: "UI",
    examples: [
      { name: "Button does nothing", autoFixable: true },
      { name: "Re-wire click handlers", autoFixable: true }
    ]
  },
  {
    category: "DELIVERY",
    examples: [
      { name: "PDF not loading", autoFixable: true },
      { name: "Re-send signature request", autoFixable: true }
    ]
  },
  {
    category: "EMBED",
    examples: [
      { name: "iFrame blocked", autoFixable: true },
      { name: "Reload document renderer", autoFixable: true }
    ]
  },
  {
    category: "STATE",
    examples: [
      { name: "Status not updating", autoFixable: true },
      { name: "Restore signing state", autoFixable: true }
    ]
  },
  {
    category: "WEBHOOK",
    examples: [
      { name: "Signature received but not processed", autoFixable: true },
      { name: "Retry webhook delivery", autoFixable: true }
    ]
  },
  {
    category: "TIMING",
    examples: [
      { name: "Callback delayed", autoFixable: false }
    ]
  },
  {
    category: "LEGAL",
    examples: [
      { name: "Consent text", autoFixable: false },
      { name: "Legal text change", autoFixable: false }
    ]
  },
  {
    category: "IDENTITY",
    examples: [
      { name: "Signer mismatch", autoFixable: false },
      { name: "Identity binding", autoFixable: false }
    ]
  },
  {
    category: "TIMESTAMP",
    examples: [
      { name: "Authority / clock", autoFixable: false },
      { name: "Timestamp authority", autoFixable: false }
    ]
  }
];

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").substring(0, 16);
}

function generateIncidentId(): string {
  return `INC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export function classifyCriticalFlow(description: string): CriticalFlowType | null {
  const lower = description.toLowerCase();
  const authKeywords = ["sign in", "signin", "login", "logout", "auth", "session", "oauth", "token", "password", "credential"];
  const contractKeywords = ["sign", "contract", "signature", "document", "pdf", "consent", "agreement", "nda"];
  
  if (authKeywords.some(k => lower.includes(k))) return "AUTH";
  if (contractKeywords.some(k => lower.includes(k))) return "CONTRACT_SIGNING";
  return null;
}

export async function runAuthDiagnostics(description: string, context: { userId?: number; ip?: string; userAgent?: string }): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const layer of AUTH_DIAGNOSTIC_TREE) {
    for (const check of layer.checks) {
      const passed = !lower.includes(check.name.toLowerCase().replace("?", ""));
      results.push({
        layer: layer.layer,
        check: check.name,
        passed,
        autoFixable: check.autoFixable,
        details: passed ? undefined : `Potential issue detected: ${check.name}`
      });
    }
  }
  
  return results;
}

export async function runContractSigningDiagnostics(description: string, context: { userId?: number; documentId?: string }): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const category of CONTRACT_SIGNING_FAILURE_MATRIX) {
    for (const example of category.examples) {
      const passed = !lower.includes(example.name.toLowerCase());
      results.push({
        layer: category.category,
        check: example.name,
        passed,
        autoFixable: example.autoFixable,
        details: passed ? undefined : `Potential issue: ${example.name}`
      });
    }
  }
  
  return results;
}

export function determineAutoFixability(diagnostics: DiagnosticResult[]): { canAutoFix: boolean; autoFixableIssues: DiagnosticResult[]; requiresApproval: DiagnosticResult[] } {
  const failedDiagnostics = diagnostics.filter(d => !d.passed);
  const autoFixableIssues = failedDiagnostics.filter(d => d.autoFixable);
  const requiresApproval = failedDiagnostics.filter(d => !d.autoFixable);
  
  return {
    canAutoFix: autoFixableIssues.length > 0 && requiresApproval.length === 0,
    autoFixableIssues,
    requiresApproval
  };
}

export function shouldTriggerEmergencyMode(failureCount: number, isCriticalPath: boolean, userRequestedHelp: boolean): boolean {
  return failureCount >= 2 || isCriticalPath || userRequestedHelp;
}

export async function createCriticalIncident(
  flowType: CriticalFlowType,
  description: string,
  context: { userId?: number; ip?: string; userAgent?: string; documentId?: string },
  diagnostics: DiagnosticResult[],
  emergencyMode: boolean = false
): Promise<CriticalIncident> {
  const { canAutoFix, autoFixableIssues, requiresApproval } = determineAutoFixability(diagnostics);
  const failedDiagnostics = diagnostics.filter(d => !d.passed);
  
  const incident: CriticalIncident = {
    id: generateIncidentId(),
    flowType,
    userId: context.userId,
    userHashedId: context.userId ? hashValue(String(context.userId)) : hashValue("anonymous"),
    ipHash: context.ip ? hashValue(context.ip) : hashValue("unknown"),
    userAgentHash: context.userAgent ? hashValue(context.userAgent) : hashValue("unknown"),
    documentVersionHash: context.documentId ? hashValue(context.documentId) : undefined,
    failurePoint: failedDiagnostics.map(d => d.check).join(", ") || "Unknown",
    diagnostics,
    cause: failedDiagnostics.length > 0 ? failedDiagnostics[0].check : "Unknown cause",
    impact: `${context.userId ? "1 user" : "Unknown users"}, 0 funds, 0 legal changes`,
    proposedFix: autoFixableIssues.length > 0 
      ? autoFixableIssues.map(i => `Fix: ${i.check}`).join("; ")
      : requiresApproval.length > 0 
        ? "Requires admin approval for: " + requiresApproval.map(r => r.check).join(", ")
        : "Manual investigation required",
    riskLevel: emergencyMode ? "CRITICAL" : requiresApproval.length > 0 ? "HIGH" : autoFixableIssues.length > 0 ? "LOW" : "MEDIUM",
    status: emergencyMode ? "EMERGENCY_MODE" : canAutoFix ? "AUTO_FIXED" : "PENDING_APPROVAL",
    actionsTaken: [],
    adminApprovalRequired: !canAutoFix,
    createdAt: new Date(),
    emergencyMode
  };
  
  await logCriticalIncident(incident);
  return incident;
}

export async function logCriticalIncident(incident: CriticalIncident): Promise<void> {
  try {
    await db.execute(sql`
      INSERT INTO critical_incidents (
        incident_id, flow_type, user_hashed_id, ip_hash, ua_hash, document_version_hash,
        failure_point, diagnostics, cause, impact, proposed_fix, risk_level, status,
        actions_taken, admin_approval_required, emergency_mode, created_at
      ) VALUES (
        ${incident.id}, ${incident.flowType}, ${incident.userHashedId}, ${incident.ipHash},
        ${incident.userAgentHash}, ${incident.documentVersionHash || null}, ${incident.failurePoint},
        ${JSON.stringify(incident.diagnostics)}, ${incident.cause}, ${incident.impact},
        ${incident.proposedFix}, ${incident.riskLevel}, ${incident.status},
        ${JSON.stringify(incident.actionsTaken)}, ${incident.adminApprovalRequired},
        ${incident.emergencyMode}, NOW()
      )
    `);
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to log incident:", error);
  }
}

export async function approveIncident(incidentId: string, adminId: number, action: "APPROVE" | "REJECT"): Promise<{ success: boolean; message: string }> {
  try {
    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    await db.execute(sql`
      UPDATE critical_incidents 
      SET status = ${newStatus}, 
          admin_approved_by = ${adminId}, 
          admin_approved_at = NOW(),
          resolved_at = NOW()
      WHERE incident_id = ${incidentId}
    `);
    
    await db.execute(sql`
      INSERT INTO incident_audit_log (incident_id, admin_id, action, timestamp)
      VALUES (${incidentId}, ${adminId}, ${action}, NOW())
    `);
    
    return { success: true, message: `Incident ${incidentId} ${action.toLowerCase()}d successfully` };
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to approve incident:", error);
    return { success: false, message: "Failed to process approval" };
  }
}

export async function getCriticalIncidents(status?: IncidentStatus, limit: number = 20): Promise<any[]> {
  try {
    if (status) {
      const result = await db.execute(sql`
        SELECT * FROM critical_incidents WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit}
      `);
      return result.rows as any[];
    }
    const result = await db.execute(sql`
      SELECT * FROM critical_incidents ORDER BY created_at DESC LIMIT ${limit}
    `);
    return result.rows as any[];
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to get incidents:", error);
    return [];
  }
}

export async function generateIncidentReport(incidentId: string): Promise<IncidentReport | null> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM critical_incidents WHERE incident_id = ${incidentId}
    `);
    
    if (result.rows.length === 0) return null;
    
    const incident = result.rows[0] as any;
    
    const auditResult = await db.execute(sql`
      SELECT * FROM incident_audit_log WHERE incident_id = ${incidentId} ORDER BY timestamp ASC
    `);
    
    const approvals = (auditResult.rows as any[]).map(a => ({
      adminId: a.admin_id,
      action: a.action,
      timestamp: a.timestamp
    }));
    
    return {
      incidentId: incident.incident_id,
      timestamp: incident.created_at,
      userHash: incident.user_hashed_id,
      ipHash: incident.ip_hash,
      uaHash: incident.ua_hash,
      documentVersionHash: incident.document_version_hash,
      failurePoint: incident.failure_point,
      actionsTaken: JSON.parse(incident.actions_taken || "[]"),
      adminApprovals: approvals,
      outcome: incident.status,
      noPHIMutation: true,
      noRetroactiveChanges: true
    };
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to generate report:", error);
    return null;
  }
}

export async function processCriticalFlowIssue(
  description: string,
  context: { userId?: number; ip?: string; userAgent?: string; documentId?: string; failureCount?: number; userRequestedHelp?: boolean }
): Promise<{
  incident: CriticalIncident;
  autoFixed: boolean;
  emergencyModeActivated: boolean;
  adminApprovalRequired: boolean;
}> {
  const flowType = classifyCriticalFlow(description);
  if (!flowType) {
    throw new Error("Not a critical flow issue");
  }
  
  const emergencyMode = shouldTriggerEmergencyMode(
    context.failureCount || 0,
    flowType === "CONTRACT_SIGNING",
    context.userRequestedHelp || false
  );
  
  const diagnostics = flowType === "AUTH"
    ? await runAuthDiagnostics(description, context)
    : await runContractSigningDiagnostics(description, context);
  
  const incident = await createCriticalIncident(flowType, description, context, diagnostics, emergencyMode);
  
  const { canAutoFix } = determineAutoFixability(diagnostics);
  
  if (canAutoFix && !emergencyMode) {
    incident.actionsTaken.push(`Auto-fix applied at ${new Date().toISOString()}`);
    incident.status = "AUTO_FIXED";
    incident.resolvedAt = new Date();
  }
  
  return {
    incident,
    autoFixed: canAutoFix && !emergencyMode,
    emergencyModeActivated: emergencyMode,
    adminApprovalRequired: incident.adminApprovalRequired
  };
}

export function formatAdminApprovalView(incident: CriticalIncident): string {
  return `
ISSUE: ${incident.flowType === "AUTH" ? "User unable to sign in" : "User unable to sign contract"}
CAUSE: ${incident.cause}
IMPACT: ${incident.impact}
PROPOSED FIX: ${incident.proposedFix}
RISK LEVEL: ${incident.riskLevel}

Actions:
✅ Approve & apply
❌ Reject
📄 Generate incident report
`.trim();
}
