import { storage } from "./storage";
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

const AUTH_KEYWORDS: { layer: DiagnosticLayer; keywords: string[]; check: string; autoFixable: boolean }[] = [
  { layer: "CLIENT", keywords: ["button", "click", "not working", "nothing happens"], check: "Button/click handler issue", autoFixable: true },
  { layer: "CLIENT", keywords: ["js error", "javascript", "console error", "script"], check: "JavaScript error", autoFixable: true },
  { layer: "CLIENT", keywords: ["cookie", "cookies blocked", "third-party cookie"], check: "Cookie access issue", autoFixable: false },
  { layer: "NETWORK", keywords: ["network", "connection", "timeout", "unreachable"], check: "Network connectivity issue", autoFixable: false },
  { layer: "NETWORK", keywords: ["500", "server error", "internal error"], check: "Server 5xx error", autoFixable: false },
  { layer: "NETWORK", keywords: ["cors", "cross-origin", "access-control"], check: "CORS configuration issue", autoFixable: true },
  { layer: "NETWORK", keywords: ["csrf", "token", "validation failed"], check: "CSRF token issue", autoFixable: true },
  { layer: "AUTH_PROVIDER", keywords: ["redirect uri", "callback url", "mismatch"], check: "OAuth redirect URI mismatch", autoFixable: true },
  { layer: "AUTH_PROVIDER", keywords: ["expired", "refresh token", "token expired"], check: "Token expiration issue", autoFixable: false },
  { layer: "AUTH_PROVIDER", keywords: ["client secret", "invalid secret", "authentication failed"], check: "Client secret issue", autoFixable: false },
  { layer: "AUTH_PROVIDER", keywords: ["scope", "permission", "unauthorized scope"], check: "OAuth scope mismatch", autoFixable: false },
  { layer: "AUTH_PROVIDER", keywords: ["outage", "provider down", "service unavailable"], check: "Provider outage", autoFixable: false },
  { layer: "SESSION", keywords: ["samesite", "cookie policy", "lax", "strict"], check: "SameSite cookie misconfiguration", autoFixable: true },
  { layer: "SESSION", keywords: ["secure flag", "https only", "insecure"], check: "Secure flag mismatch", autoFixable: true },
  { layer: "SESSION", keywords: ["domain", "subdomain", "cookie domain"], check: "Cookie domain mismatch", autoFixable: true },
  { layer: "SESSION", keywords: ["session store", "redis", "store unreachable"], check: "Session store issue", autoFixable: false },
  { layer: "USER_STATE", keywords: ["user not found", "account deleted", "no account"], check: "User does not exist", autoFixable: false },
  { layer: "USER_STATE", keywords: ["disabled", "suspended", "banned", "deactivated"], check: "Account disabled", autoFixable: false },
  { layer: "USER_STATE", keywords: ["email not verified", "unverified", "confirm email"], check: "Email not verified", autoFixable: false },
  { layer: "USER_STATE", keywords: ["duplicate", "already exists", "multiple accounts"], check: "Duplicate identity", autoFixable: false }
];

const CONTRACT_KEYWORDS: { layer: DiagnosticLayer; keywords: string[]; check: string; autoFixable: boolean }[] = [
  { layer: "UI", keywords: ["button", "click", "not responding", "nothing happens"], check: "UI button/handler issue", autoFixable: true },
  { layer: "DELIVERY", keywords: ["pdf", "not loading", "document failed", "blank page"], check: "PDF delivery issue", autoFixable: true },
  { layer: "EMBED", keywords: ["iframe", "blocked", "embed", "frame"], check: "iFrame/embed blocked", autoFixable: true },
  { layer: "STATE", keywords: ["status", "not updating", "stuck", "pending forever"], check: "State sync issue", autoFixable: true },
  { layer: "WEBHOOK", keywords: ["webhook", "callback", "not received", "signature received"], check: "Webhook processing issue", autoFixable: true },
  { layer: "TIMING", keywords: ["delayed", "slow", "timeout", "taking too long"], check: "Timing/delay issue", autoFixable: false },
  { layer: "LEGAL", keywords: ["consent", "terms", "legal text", "agreement text"], check: "Legal text issue", autoFixable: false },
  { layer: "IDENTITY", keywords: ["signer", "wrong person", "identity", "mismatch"], check: "Signer identity mismatch", autoFixable: false },
  { layer: "TIMESTAMP", keywords: ["timestamp", "clock", "time authority", "invalid time"], check: "Timestamp authority issue", autoFixable: false }
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
  const contractKeywords = ["sign contract", "contract", "signature", "document", "pdf", "consent", "agreement", "nda", "signing"];
  
  if (authKeywords.some(k => lower.includes(k))) return "AUTH";
  if (contractKeywords.some(k => lower.includes(k))) return "CONTRACT_SIGNING";
  return null;
}

export async function runAuthDiagnostics(description: string): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const item of AUTH_KEYWORDS) {
    const matches = item.keywords.some(k => lower.includes(k));
    results.push({
      layer: item.layer,
      check: item.check,
      passed: !matches,
      autoFixable: item.autoFixable,
      details: matches ? `Detected issue: ${item.check}` : undefined
    });
  }
  
  return results;
}

export async function runContractSigningDiagnostics(description: string): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const item of CONTRACT_KEYWORDS) {
    const matches = item.keywords.some(k => lower.includes(k));
    results.push({
      layer: item.layer,
      check: item.check,
      passed: !matches,
      autoFixable: item.autoFixable,
      details: matches ? `Detected issue: ${item.check}` : undefined
    });
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

export function shouldTriggerEmergencyMode(failureCount: number, userRequestedHelp: boolean): boolean {
  return failureCount >= 2 || userRequestedHelp;
}

export async function logCriticalIncident(incident: {
  incidentId: string;
  flowType: CriticalFlowType;
  userHashedId: string;
  ipHash: string;
  uaHash: string;
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
  emergencyMode: boolean;
}): Promise<void> {
  try {
    await storage.createCriticalIncident({
      incidentId: incident.incidentId,
      flowType: incident.flowType,
      userHashedId: incident.userHashedId,
      ipHash: incident.ipHash,
      uaHash: incident.uaHash,
      documentVersionHash: incident.documentVersionHash || null,
      failurePoint: incident.failurePoint,
      diagnostics: JSON.stringify(incident.diagnostics),
      cause: incident.cause,
      impact: incident.impact,
      proposedFix: incident.proposedFix,
      riskLevel: incident.riskLevel,
      status: incident.status,
      actionsTaken: JSON.stringify(incident.actionsTaken),
      adminApprovalRequired: incident.adminApprovalRequired,
      emergencyMode: incident.emergencyMode
    });
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to log incident:", error);
  }
}

export async function approveIncident(incidentId: string, adminId: number, action: "APPROVE" | "REJECT"): Promise<{ success: boolean; message: string }> {
  try {
    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";
    
    const incident = await storage.getCriticalIncidentByIncidentId(incidentId);
    if (!incident) {
      return { success: false, message: "Incident not found" };
    }
    
    const actionsTaken = JSON.parse(incident.actionsTaken || "[]");
    actionsTaken.push(`Admin ${action.toLowerCase()}d at ${new Date().toISOString()}`);
    
    await storage.updateCriticalIncident(incidentId, {
      status: newStatus,
      adminApprovedBy: adminId,
      adminApprovedAt: new Date(),
      resolvedAt: new Date(),
      actionsTaken: JSON.stringify(actionsTaken)
    });
    
    await storage.createIncidentAuditLog({
      incidentId,
      adminId,
      action
    });
    
    return { success: true, message: `Incident ${incidentId} ${action.toLowerCase()}d successfully` };
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to approve incident:", error);
    return { success: false, message: "Failed to process approval" };
  }
}

export async function getCriticalIncidents(status?: IncidentStatus, limit: number = 20): Promise<any[]> {
  try {
    return await storage.getCriticalIncidents(status, limit);
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to get incidents:", error);
    return [];
  }
}

export async function generateIncidentReport(incidentId: string): Promise<IncidentReport | null> {
  try {
    const incident = await storage.getCriticalIncidentByIncidentId(incidentId);
    if (!incident) return null;
    
    const auditLogs = await storage.getIncidentAuditLogs(incidentId);
    
    const approvals = auditLogs.map(a => ({
      adminId: a.adminId,
      action: a.action,
      timestamp: a.timestamp.toISOString()
    }));
    
    return {
      incidentId: incident.incidentId,
      timestamp: incident.createdAt.toISOString(),
      userHash: incident.userHashedId,
      ipHash: incident.ipHash,
      uaHash: incident.uaHash,
      documentVersionHash: incident.documentVersionHash || undefined,
      failurePoint: incident.failurePoint,
      actionsTaken: JSON.parse(incident.actionsTaken || "[]"),
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
  incident: {
    id: string;
    flowType: CriticalFlowType;
    cause: string;
    impact: string;
    proposedFix: string;
    riskLevel: IncidentSeverity;
    status: IncidentStatus;
    adminApprovalRequired: boolean;
    emergencyMode: boolean;
  };
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
    context.userRequestedHelp || false
  );
  
  const diagnostics = flowType === "AUTH"
    ? await runAuthDiagnostics(description)
    : await runContractSigningDiagnostics(description);
  
  const { canAutoFix, autoFixableIssues, requiresApproval } = determineAutoFixability(diagnostics);
  const failedDiagnostics = diagnostics.filter(d => !d.passed);
  
  const incidentId = generateIncidentId();
  const userHashedId = context.userId ? hashValue(String(context.userId)) : hashValue("anonymous");
  const ipHash = context.ip ? hashValue(context.ip) : hashValue("unknown");
  const uaHash = context.userAgent ? hashValue(context.userAgent) : hashValue("unknown");
  
  const cause = failedDiagnostics.length > 0 ? failedDiagnostics[0].check : "Unknown cause";
  const impact = `${context.userId ? "1 user" : "Unknown users"}, 0 funds, 0 legal changes`;
  const proposedFix = autoFixableIssues.length > 0 
    ? autoFixableIssues.map(i => `Fix: ${i.check}`).join("; ")
    : requiresApproval.length > 0 
      ? "Requires admin approval for: " + requiresApproval.map(r => r.check).join(", ")
      : "Manual investigation required";
  const riskLevel: IncidentSeverity = emergencyMode ? "CRITICAL" : requiresApproval.length > 0 ? "HIGH" : autoFixableIssues.length > 0 ? "LOW" : "MEDIUM";
  let status: IncidentStatus = emergencyMode ? "EMERGENCY_MODE" : canAutoFix ? "AUTO_FIXED" : "PENDING_APPROVAL";
  
  const actionsTaken: string[] = [];
  
  if (canAutoFix && !emergencyMode) {
    actionsTaken.push(`Auto-fix applied at ${new Date().toISOString()}`);
    status = "AUTO_FIXED";
  }
  
  await logCriticalIncident({
    incidentId,
    flowType,
    userHashedId,
    ipHash,
    uaHash,
    documentVersionHash: context.documentId ? hashValue(context.documentId) : undefined,
    failurePoint: failedDiagnostics.map(d => d.check).join(", ") || "Unknown",
    diagnostics,
    cause,
    impact,
    proposedFix,
    riskLevel,
    status,
    actionsTaken,
    adminApprovalRequired: !canAutoFix,
    emergencyMode
  });
  
  return {
    incident: {
      id: incidentId,
      flowType,
      cause,
      impact,
      proposedFix,
      riskLevel,
      status,
      adminApprovalRequired: !canAutoFix,
      emergencyMode
    },
    autoFixed: canAutoFix && !emergencyMode,
    emergencyModeActivated: emergencyMode,
    adminApprovalRequired: !canAutoFix
  };
}
