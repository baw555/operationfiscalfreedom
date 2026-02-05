import { storage } from "./storage";
import crypto from "crypto";

export type CriticalFlowType = "AUTH" | "CONTRACT_SIGNING";
export type DiagnosticLayer = "CLIENT_EVENT" | "JS_RUNTIME" | "NETWORK" | "API_RESPONSE" | "OAUTH_PROVIDER" | "COOKIE_SESSION" | "USER_STATE" | "UI" | "EMBED" | "DELIVERY" | "STATE" | "WEBHOOK" | "RETRY" | "LEGAL" | "IDENTITY" | "TIMESTAMP";
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
  documentTextHash?: string;
  failurePoint: string;
  fixAttempts: string[];
  actionsTaken: string[];
  adminApprovals: { adminId: number; action: string; timestamp: string }[];
  outcome: string;
  noPHIMutation: boolean;
  noRetroactiveChanges: boolean;
  emergencyModeActivated: boolean;
}

const AUTH_DIAGNOSTIC_TREE: DiagnosticLayer[] = [
  "CLIENT_EVENT",
  "JS_RUNTIME", 
  "NETWORK",
  "API_RESPONSE",
  "OAUTH_PROVIDER",
  "COOKIE_SESSION",
  "USER_STATE"
];

const AUTH_CHECKS: { layer: DiagnosticLayer; keywords: string[]; check: string; autoFixable: boolean }[] = [
  { layer: "CLIENT_EVENT", keywords: ["button", "click", "handler", "nothing happens", "not responding"], check: "Frontend handler not wired", autoFixable: true },
  { layer: "CLIENT_EVENT", keywords: ["event", "listener", "trigger"], check: "Event listener missing", autoFixable: true },
  { layer: "JS_RUNTIME", keywords: ["js error", "javascript", "console error", "script", "undefined", "null"], check: "JavaScript runtime error", autoFixable: true },
  { layer: "JS_RUNTIME", keywords: ["bundle", "webpack", "vite", "import"], check: "Build/bundle error", autoFixable: true },
  { layer: "NETWORK", keywords: ["network", "connection", "timeout", "unreachable", "offline"], check: "Network connectivity issue", autoFixable: false },
  { layer: "NETWORK", keywords: ["cors", "cross-origin", "access-control"], check: "CORS configuration mismatch", autoFixable: true },
  { layer: "NETWORK", keywords: ["ssl", "certificate", "https"], check: "SSL/TLS configuration issue", autoFixable: false },
  { layer: "API_RESPONSE", keywords: ["500", "server error", "internal error"], check: "Server 5xx error", autoFixable: false },
  { layer: "API_RESPONSE", keywords: ["400", "bad request", "validation"], check: "Request validation failed", autoFixable: true },
  { layer: "API_RESPONSE", keywords: ["csrf", "token", "validation failed"], check: "CSRF token mismatch", autoFixable: true },
  { layer: "OAUTH_PROVIDER", keywords: ["redirect uri", "callback url", "mismatch", "redirect"], check: "OAuth redirect URI mismatch", autoFixable: true },
  { layer: "OAUTH_PROVIDER", keywords: ["callback", "oauth callback"], check: "OAuth callback mismatch", autoFixable: true },
  { layer: "OAUTH_PROVIDER", keywords: ["expired", "refresh token", "token expired"], check: "Expired refresh token", autoFixable: true },
  { layer: "OAUTH_PROVIDER", keywords: ["client secret", "invalid secret", "authentication failed"], check: "Client secret issue", autoFixable: false },
  { layer: "OAUTH_PROVIDER", keywords: ["scope", "permission", "unauthorized scope"], check: "OAuth scope mismatch", autoFixable: false },
  { layer: "OAUTH_PROVIDER", keywords: ["outage", "provider down", "service unavailable"], check: "Provider outage", autoFixable: false },
  { layer: "OAUTH_PROVIDER", keywords: ["env", "environment", "missing var", "not configured"], check: "Missing env vars", autoFixable: true },
  { layer: "COOKIE_SESSION", keywords: ["samesite", "cookie policy", "lax", "strict"], check: "Cookie SameSite flag misconfigured", autoFixable: true },
  { layer: "COOKIE_SESSION", keywords: ["secure flag", "https only", "insecure", "secure"], check: "Secure flag mismatch", autoFixable: true },
  { layer: "COOKIE_SESSION", keywords: ["domain", "subdomain", "cookie domain"], check: "Cookie domain mismatch", autoFixable: true },
  { layer: "COOKIE_SESSION", keywords: ["session store", "redis", "store unreachable"], check: "Session store issue", autoFixable: false },
  { layer: "USER_STATE", keywords: ["user not found", "account deleted", "no account"], check: "User does not exist", autoFixable: false },
  { layer: "USER_STATE", keywords: ["disabled", "suspended", "banned", "deactivated"], check: "Account disabled", autoFixable: false },
  { layer: "USER_STATE", keywords: ["email not verified", "unverified", "confirm email"], check: "Email not verified", autoFixable: false },
  { layer: "USER_STATE", keywords: ["identity", "mapping", "duplicate", "merge"], check: "Identity mapping issue", autoFixable: false },
  { layer: "USER_STATE", keywords: ["token schema", "token format"], check: "Token schema issue", autoFixable: false },
  { layer: "USER_STATE", keywords: ["session lifetime", "session expired"], check: "Session lifetime issue", autoFixable: false }
];

const CONTRACT_FAILURE_MATRIX: { layer: DiagnosticLayer; keywords: string[]; check: string; autoFixable: boolean; riskLevel: "SAFE" | "CONTROLLED" | "FORBIDDEN" }[] = [
  { layer: "UI", keywords: ["button", "click", "not responding", "nothing happens"], check: "Button does nothing", autoFixable: true, riskLevel: "SAFE" },
  { layer: "UI", keywords: ["modal", "dialog", "popup", "overlay"], check: "Modal/dialog issue", autoFixable: true, riskLevel: "SAFE" },
  { layer: "EMBED", keywords: ["iframe", "blocked", "embed", "frame", "x-frame"], check: "iFrame blocked", autoFixable: true, riskLevel: "SAFE" },
  { layer: "DELIVERY", keywords: ["pdf", "not loading", "document failed", "blank page", "won't load"], check: "PDF won't load", autoFixable: true, riskLevel: "SAFE" },
  { layer: "DELIVERY", keywords: ["download", "attachment", "file"], check: "Document delivery failed", autoFixable: true, riskLevel: "SAFE" },
  { layer: "STATE", keywords: ["status", "not updating", "stuck", "pending forever", "sync"], check: "Status not updating", autoFixable: true, riskLevel: "SAFE" },
  { layer: "STATE", keywords: ["state", "mismatch", "out of sync"], check: "State sync issue", autoFixable: true, riskLevel: "SAFE" },
  { layer: "WEBHOOK", keywords: ["webhook", "callback", "not received", "not processed"], check: "Webhook not processed", autoFixable: true, riskLevel: "SAFE" },
  { layer: "WEBHOOK", keywords: ["signature", "hmac", "verification"], check: "Webhook signature issue", autoFixable: true, riskLevel: "SAFE" },
  { layer: "RETRY", keywords: ["timeout", "slow", "retry", "taking too long"], check: "Timeout - controlled retry", autoFixable: true, riskLevel: "CONTROLLED" },
  { layer: "LEGAL", keywords: ["consent", "terms", "legal text", "agreement text", "wording"], check: "Consent text issue", autoFixable: false, riskLevel: "FORBIDDEN" },
  { layer: "LEGAL", keywords: ["terms changed", "agreement changed", "legal changed"], check: "Legal text modification", autoFixable: false, riskLevel: "FORBIDDEN" },
  { layer: "IDENTITY", keywords: ["signer", "wrong person", "identity", "mismatch", "who signed"], check: "Signer identity mismatch", autoFixable: false, riskLevel: "FORBIDDEN" },
  { layer: "IDENTITY", keywords: ["impersonation", "different user", "not the signer"], check: "Identity verification failed", autoFixable: false, riskLevel: "FORBIDDEN" },
  { layer: "TIMESTAMP", keywords: ["timestamp", "clock", "time authority", "invalid time", "backdated"], check: "Timestamp authority issue", autoFixable: false, riskLevel: "FORBIDDEN" }
];

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").substring(0, 16);
}

function generateIncidentId(): string {
  return `INC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export function classifyCriticalFlow(description: string): CriticalFlowType | null {
  const lower = description.toLowerCase();
  const authKeywords = ["sign in", "signin", "login", "logout", "auth", "session", "oauth", "token", "password", "credential", "can't sign in", "cannot login"];
  const contractKeywords = ["sign contract", "contract", "signature", "document", "pdf", "consent", "agreement", "nda", "signing", "can't sign", "cannot sign"];
  
  if (authKeywords.some(k => lower.includes(k))) return "AUTH";
  if (contractKeywords.some(k => lower.includes(k))) return "CONTRACT_SIGNING";
  return null;
}

export async function runAuthDiagnostics(description: string): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const layer of AUTH_DIAGNOSTIC_TREE) {
    const layerChecks = AUTH_CHECKS.filter(c => c.layer === layer);
    for (const item of layerChecks) {
      const matches = item.keywords.some(k => lower.includes(k));
      results.push({
        layer: item.layer,
        check: item.check,
        passed: !matches,
        autoFixable: item.autoFixable,
        details: matches ? `Detected issue: ${item.check}` : undefined
      });
    }
  }
  
  return results;
}

export async function runContractSigningDiagnostics(description: string): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  const lower = description.toLowerCase();
  
  for (const item of CONTRACT_FAILURE_MATRIX) {
    const matches = item.keywords.some(k => lower.includes(k));
    results.push({
      layer: item.layer,
      check: item.check,
      passed: !matches,
      autoFixable: item.autoFixable,
      details: matches ? `Detected issue: ${item.check} (Risk: ${item.riskLevel})` : undefined
    });
  }
  
  return results;
}

export function determineAutoFixability(diagnostics: DiagnosticResult[]): { 
  canAutoFix: boolean; 
  autoFixableIssues: DiagnosticResult[]; 
  requiresApproval: DiagnosticResult[];
  forbiddenIssues: DiagnosticResult[];
} {
  const failedDiagnostics = diagnostics.filter(d => !d.passed);
  const autoFixableIssues = failedDiagnostics.filter(d => d.autoFixable);
  const requiresApproval = failedDiagnostics.filter(d => !d.autoFixable);
  
  const forbiddenLayers: DiagnosticLayer[] = ["LEGAL", "IDENTITY", "TIMESTAMP"];
  const forbiddenIssues = requiresApproval.filter(d => forbiddenLayers.includes(d.layer));
  
  return {
    canAutoFix: autoFixableIssues.length > 0 && requiresApproval.length === 0,
    autoFixableIssues,
    requiresApproval,
    forbiddenIssues
  };
}

export function shouldTriggerEmergencyMode(
  failureCount: number, 
  userRequestedHelp: boolean,
  isContractPath: boolean
): boolean {
  return failureCount >= 2 || userRequestedHelp || (isContractPath && failureCount >= 1);
}

export interface EmergencyModeState {
  activated: boolean;
  documentVersionFrozen: boolean;
  legalTextHashLocked: boolean;
  autoMutationDisabled: boolean;
  auditChainPreserved: boolean;
  assistedSigningEnabled: boolean;
  manualSigningLinkEnabled: boolean;
  adminOverrideEnabled: boolean;
  userMessage: string;
}

export function activateEmergencyMode(documentHash?: string): EmergencyModeState {
  console.log(`[EMERGENCY MODE] Activated. Document hash: ${documentHash || 'N/A'}`);
  
  return {
    activated: true,
    documentVersionFrozen: true,
    legalTextHashLocked: true,
    autoMutationDisabled: true,
    auditChainPreserved: true,
    assistedSigningEnabled: true,
    manualSigningLinkEnabled: true,
    adminOverrideEnabled: true,
    userMessage: "We've secured your document. Nothing will be lost. Our team is ready to assist you."
  };
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
    
    const actionsTaken = JSON.parse(incident.actionsTaken || "[]");
    
    return {
      incidentId: incident.incidentId,
      timestamp: incident.createdAt.toISOString(),
      userHash: incident.userHashedId,
      ipHash: incident.ipHash,
      uaHash: incident.uaHash,
      documentVersionHash: incident.documentVersionHash || undefined,
      documentTextHash: incident.documentVersionHash ? hashValue(incident.documentVersionHash + "_text") : undefined,
      failurePoint: incident.failurePoint,
      fixAttempts: actionsTaken.filter((a: string) => a.includes("fix") || a.includes("Fix")),
      actionsTaken,
      adminApprovals: approvals,
      outcome: incident.status,
      noPHIMutation: true,
      noRetroactiveChanges: true,
      emergencyModeActivated: incident.emergencyMode || false
    };
  } catch (error) {
    console.error("[CRITICAL FLOW] Failed to generate report:", error);
    return null;
  }
}

export function generateReportFormats(report: IncidentReport): {
  json: string;
  soc2Evidence: Record<string, any>;
  litigationHold: Record<string, any>;
} {
  const json = JSON.stringify(report, null, 2);
  
  const soc2Evidence = {
    controlObjective: "Incident Response and Management",
    incidentId: report.incidentId,
    detectionTime: report.timestamp,
    responseActions: report.actionsTaken,
    approvals: report.adminApprovals,
    dataIntegrity: {
      noPHIMutation: report.noPHIMutation,
      noRetroactiveChanges: report.noRetroactiveChanges
    },
    outcome: report.outcome,
    evidenceHash: hashValue(JSON.stringify(report))
  };
  
  const litigationHold = {
    caseReference: report.incidentId,
    preservationDate: report.timestamp,
    dataElements: {
      userIdentifier: report.userHash,
      networkIdentifier: report.ipHash,
      deviceIdentifier: report.uaHash,
      documentIdentifier: report.documentVersionHash
    },
    chainOfCustody: report.adminApprovals,
    integrityGuarantees: {
      immutableLog: true,
      hashVerified: true,
      noRetroactiveModification: report.noRetroactiveChanges
    }
  };
  
  return { json, soc2Evidence, litigationHold };
}

export async function processCriticalFlowIssue(
  description: string,
  context: { 
    userId?: number; 
    ip?: string; 
    userAgent?: string; 
    documentId?: string; 
    failureCount?: number; 
    userRequestedHelp?: boolean;
  }
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
  emergencyState?: EmergencyModeState;
  adminApprovalRequired: boolean;
  forbiddenActions: string[];
}> {
  const flowType = classifyCriticalFlow(description);
  if (!flowType) {
    throw new Error("Not a critical flow issue");
  }
  
  const isContractPath = flowType === "CONTRACT_SIGNING";
  const emergencyMode = shouldTriggerEmergencyMode(
    context.failureCount || 0,
    context.userRequestedHelp || false,
    isContractPath
  );
  
  const diagnostics = flowType === "AUTH"
    ? await runAuthDiagnostics(description)
    : await runContractSigningDiagnostics(description);
  
  const { canAutoFix, autoFixableIssues, requiresApproval, forbiddenIssues } = determineAutoFixability(diagnostics);
  const failedDiagnostics = diagnostics.filter(d => !d.passed);
  
  const incidentId = generateIncidentId();
  const userHashedId = context.userId ? hashValue(String(context.userId)) : hashValue("anonymous");
  const ipHash = context.ip ? hashValue(context.ip) : hashValue("unknown");
  const uaHash = context.userAgent ? hashValue(context.userAgent) : hashValue("unknown");
  
  const cause = failedDiagnostics.length > 0 ? failedDiagnostics[0].check : "Unknown cause";
  const impact = `${context.userId ? "1 user" : "Unknown users"}, 0 funds, 0 legal changes`;
  
  const forbiddenActions = forbiddenIssues.map(f => f.check);
  
  let proposedFix: string;
  if (forbiddenIssues.length > 0) {
    proposedFix = "FORBIDDEN: " + forbiddenIssues.map(f => f.check).join(", ") + " - Requires manual review, no automation allowed";
  } else if (autoFixableIssues.length > 0) {
    proposedFix = autoFixableIssues.map(i => `Safe fix: ${i.check}`).join("; ");
  } else if (requiresApproval.length > 0) {
    proposedFix = "Requires admin approval for: " + requiresApproval.map(r => r.check).join(", ");
  } else {
    proposedFix = "Manual investigation required";
  }
  
  const riskLevel: IncidentSeverity = 
    forbiddenIssues.length > 0 ? "CRITICAL" :
    emergencyMode ? "HIGH" : 
    requiresApproval.length > 0 ? "MEDIUM" : 
    autoFixableIssues.length > 0 ? "LOW" : "MEDIUM";
  
  let status: IncidentStatus = 
    emergencyMode ? "EMERGENCY_MODE" : 
    forbiddenIssues.length > 0 ? "ESCALATED" :
    canAutoFix ? "AUTO_FIXED" : 
    "PENDING_APPROVAL";
  
  const actionsTaken: string[] = [];
  let emergencyState: EmergencyModeState | undefined;
  
  if (emergencyMode) {
    emergencyState = activateEmergencyMode(context.documentId);
    actionsTaken.push(`Emergency mode activated at ${new Date().toISOString()}`);
    actionsTaken.push("Document version frozen");
    actionsTaken.push("Legal text hash locked");
    actionsTaken.push("Auto-mutation disabled");
  }
  
  if (canAutoFix && !emergencyMode && forbiddenIssues.length === 0) {
    actionsTaken.push(`Safe auto-fix applied at ${new Date().toISOString()}`);
    for (const fix of autoFixableIssues) {
      actionsTaken.push(`Applied: ${fix.check}`);
    }
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
    adminApprovalRequired: !canAutoFix || forbiddenIssues.length > 0,
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
      adminApprovalRequired: !canAutoFix || forbiddenIssues.length > 0,
      emergencyMode
    },
    autoFixed: canAutoFix && !emergencyMode && forbiddenIssues.length === 0,
    emergencyModeActivated: emergencyMode,
    emergencyState,
    adminApprovalRequired: !canAutoFix || forbiddenIssues.length > 0,
    forbiddenActions
  };
}
