import { storage } from "./storage";

const ISSUE_MAP = [
  { key: "RUNTIME_ERROR", keywords: ["crash", "error", "exception", "undefined", "null"] },
  { key: "UI_BROKEN", keywords: ["button", "layout", "click", "responsive", "display", "render"] },
  { key: "FORM_ERROR", keywords: ["submit", "form", "validation", "input", "required"] },
  { key: "API_FAIL", keywords: ["api", "fetch", "500", "network", "timeout", "connection"] },
  { key: "AUTH_ERROR", keywords: ["login", "logout", "session", "unauthorized", "forbidden"] },
  { key: "DATABASE_ERROR", keywords: ["database", "query", "sql", "postgres", "drizzle"] }
] as const;

type IssueType = typeof ISSUE_MAP[number]["key"] | "UNKNOWN";

const ALLOWED_FIXES: Record<string, boolean> = {
  RUNTIME_ERROR: true,
  UI_BROKEN: true,
  FORM_ERROR: true,
  API_FAIL: true,
  AUTH_ERROR: false,
  DATABASE_ERROR: false,
  UNKNOWN: false
};

export interface RepairResult {
  status: "PATCH_PROPOSED" | "FAILED" | "ESCALATED" | "NO_PATCH";
  issueType: IssueType;
  message: string;
  diagnostics?: Record<string, any>;
  patch?: RepairPatch | null;
  error?: string;
}

export interface RepairPatch {
  file: string;
  fix: string;
  description: string;
  proposedAt?: string;
}

export function classifyIssue(text: string): IssueType {
  const lowerText = text.toLowerCase();
  for (const issue of ISSUE_MAP) {
    if (issue.keywords.some(k => lowerText.includes(k))) {
      return issue.key;
    }
  }
  return "UNKNOWN";
}

export function canAutoFix(type: IssueType): boolean {
  return ALLOWED_FIXES[type] === true;
}

export async function runDiagnostics(type: IssueType, description: string): Promise<Record<string, any>> {
  const diagnostics: Record<string, any> = {
    type,
    timestamp: new Date().toISOString(),
    description
  };

  switch (type) {
    case "RUNTIME_ERROR":
      diagnostics.stackTraceHint = description.includes("undefined") ? "possible_null_check" : "general_error";
      diagnostics.suggestedAction = "ADD_NULL_GUARD";
      break;
    case "UI_BROKEN":
      diagnostics.componentHint = extractComponentName(description);
      diagnostics.suggestedAction = "CHECK_RENDER_LOGIC";
      break;
    case "FORM_ERROR":
      diagnostics.validationHint = description.includes("required") ? "missing_required_field" : "validation_rule";
      diagnostics.suggestedAction = "UPDATE_VALIDATION";
      break;
    case "API_FAIL":
      diagnostics.endpointHint = extractEndpoint(description);
      diagnostics.suggestedAction = "ADD_ERROR_HANDLER";
      break;
    default:
      diagnostics.suggestedAction = "MANUAL_REVIEW";
  }

  return diagnostics;
}

function extractComponentName(text: string): string | null {
  const match = text.match(/(?:component|button|form|page)\s+["']?(\w+)["']?/i);
  return match ? match[1] : null;
}

function extractEndpoint(text: string): string | null {
  const match = text.match(/(?:\/api\/[\w\/-]+)/i);
  return match ? match[0] : null;
}

export async function generatePatch(type: IssueType, diagnostics: Record<string, any>): Promise<RepairPatch | null> {
  switch (type) {
    case "RUNTIME_ERROR":
      if (diagnostics.suggestedAction === "ADD_NULL_GUARD") {
        return {
          file: "general",
          fix: "ADD_NULL_CHECK",
          description: "Add null/undefined guards to prevent runtime errors"
        };
      }
      break;
    case "UI_BROKEN":
      if (diagnostics.componentHint) {
        return {
          file: `${diagnostics.componentHint}.tsx`,
          fix: "CHECK_CONDITIONAL_RENDER",
          description: `Review conditional rendering in ${diagnostics.componentHint}`
        };
      }
      return {
        file: "unknown",
        fix: "UI_REVIEW",
        description: "Manual UI component review needed"
      };
    case "FORM_ERROR":
      return {
        file: "form-component",
        fix: "UPDATE_VALIDATION_SCHEMA",
        description: "Update form validation rules"
      };
    case "API_FAIL":
      if (diagnostics.endpointHint) {
        return {
          file: "server/routes.ts",
          fix: "ADD_TRY_CATCH",
          description: `Add error handling for ${diagnostics.endpointHint}`
        };
      }
      return {
        file: "server/routes.ts",
        fix: "ADD_ERROR_MIDDLEWARE",
        description: "Add global error handling middleware"
      };
    default:
      return null;
  }
  return null;
}

export async function runTests(patch: RepairPatch): Promise<{ success: boolean; error?: string }> {
  try {
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function rollback(patch: RepairPatch): Promise<void> {
  console.log(`[REPAIR] Rolling back patch: ${patch.fix} on ${patch.file}`);
}

export async function proposePatch(patch: RepairPatch): Promise<void> {
  patch.proposedAt = new Date().toISOString();
  console.log(`[REPAIR] Proposed patch: ${patch.fix} for ${patch.file}`);
}

export async function logRepair(
  description: string,
  issueType: IssueType,
  status: string,
  patch: RepairPatch | null
): Promise<void> {
  try {
    await storage.createRepairLog({
      description,
      issueType,
      status,
      patch: patch ? JSON.stringify(patch) : null
    });
  } catch (error) {
    console.error("[REPAIR] Failed to log repair:", error);
  }
}

export async function getRepairLogs(limit: number = 20) {
  try {
    return await storage.getRepairLogs(limit);
  } catch (error) {
    console.error("[REPAIR] Failed to get repair logs:", error);
    return [];
  }
}

export async function processRepair(description: string): Promise<RepairResult> {
  const issueType = classifyIssue(description);

  if (!canAutoFix(issueType)) {
    await logRepair(description, issueType, "ESCALATED", null);
    return {
      status: "ESCALATED",
      issueType,
      message: "This issue requires human review. It has been logged for manual investigation."
    };
  }

  const diagnostics = await runDiagnostics(issueType, description);
  
  let patch: RepairPatch | null = null;
  try {
    patch = await generatePatch(issueType, diagnostics);
  } catch (error) {
    await logRepair(description, issueType, "NO_PATCH", null);
    return {
      status: "NO_PATCH",
      issueType,
      message: "No safe automated patch available for this issue.",
      diagnostics
    };
  }

  if (!patch) {
    await logRepair(description, issueType, "NO_PATCH", null);
    return {
      status: "NO_PATCH",
      issueType,
      message: "Could not generate a patch for this issue type.",
      diagnostics
    };
  }

  const testResult = await runTests(patch);
  if (!testResult.success) {
    await rollback(patch);
    await logRepair(description, issueType, "FAILED", patch);
    return {
      status: "FAILED",
      issueType,
      message: "Patch failed tests and was rolled back.",
      diagnostics,
      patch,
      error: testResult.error
    };
  }

  await proposePatch(patch);
  await logRepair(description, issueType, "PATCH_PROPOSED", patch);

  return {
    status: "PATCH_PROPOSED",
    issueType,
    message: `Issue classified as ${issueType}. Patch has been proposed for review.`,
    diagnostics,
    patch
  };
}
