// Safety rules for determining what actions can be auto-approved vs require human approval

// Actions that MUST require human approval (authority changes)
const FORBIDDEN_ACTIONS = [
  "CHANGE_IDENTITY",
  "CHANGE_EMAIL", 
  "CHANGE_PASSWORD",
  "CHANGE_SIGNER",
  "CHANGE_TIMESTAMP",
  "CHANGE_CONTRACT_TEXT",
  "CHANGE_REFERRAL_CODE",
  "ADD_USER",
  "REMOVE_USER",
  "ROLE_CHANGE",
  "DELETE_DATA",
  "MODIFY_CONSENT",
  "ALTER_LEGAL_HASH",
];

// Critical path policy by flow type
export const CRITICAL_PATH_POLICY = {
  AUTH: {
    SAFE: ["CSRF_REGEN", "COOKIE_FIX", "UI_WIRING", "SESSION_REFRESH", "CACHE_CLEAR"],
    APPROVAL: ["CHANGE_PASSWORD", "CHANGE_EMAIL", "IDENTITY_MAPPING", "FORCE_LOGOUT_ALL"],
  },
  ACCOUNT: {
    SAFE: ["RATE_LIMIT_RESET", "UI_WIRING", "EMAIL_DELIVERY_RETRY", "NOTIFICATION_RESEND"],
    APPROVAL: ["CHANGE_EMAIL", "CHANGE_PASSWORD", "DELETE_ACCOUNT"],
  },
  REFERRAL: {
    SAFE: ["UI_WIRING", "CACHE_REFRESH", "COMMISSION_RECALC"],
    APPROVAL: ["CHANGE_REFERRAL_CODE", "MODIFY_COMMISSION_RATE"],
  },
  USERS: {
    SAFE: ["UI_WIRING", "ROLE_VIEW_REFRESH", "LIST_REFRESH"],
    APPROVAL: ["ADD_USER", "REMOVE_USER", "ROLE_CHANGE", "PERMISSION_CHANGE"],
  },
  CONTRACT: {
    SAFE: ["RETRY_DB_PERSIST", "RERENDER_PDF", "CACHE_REFRESH", "EMAIL_RESEND"],
    APPROVAL: ["CHANGE_CONTRACT_TEXT", "CHANGE_SIGNER", "MODIFY_CONSENT", "ALTER_LEGAL_HASH"],
  },
  PAYMENT: {
    SAFE: ["RETRY_WEBHOOK", "REFRESH_STATUS", "CACHE_CLEAR"],
    APPROVAL: ["REFUND", "MODIFY_AMOUNT", "CANCEL_SUBSCRIPTION"],
  },
};

export function isSafeAction(action: string): boolean {
  // Check if action contains any forbidden keywords
  const upperAction = action.toUpperCase();
  
  for (const forbidden of FORBIDDEN_ACTIONS) {
    if (upperAction.includes(forbidden)) {
      return false;
    }
  }
  
  return true;
}

export function getFlowPolicy(flowType: string): { safe: string[]; approval: string[] } | null {
  const policy = CRITICAL_PATH_POLICY[flowType as keyof typeof CRITICAL_PATH_POLICY];
  if (!policy) return null;
  
  return {
    safe: policy.SAFE,
    approval: policy.APPROVAL,
  };
}

export function classifyAction(flowType: string, action: string): 'SAFE' | 'APPROVAL_REQUIRED' | 'UNKNOWN' {
  const policy = getFlowPolicy(flowType);
  if (!policy) return 'UNKNOWN';
  
  const upperAction = action.toUpperCase();
  
  if (policy.safe.some(s => upperAction.includes(s))) {
    return 'SAFE';
  }
  
  if (policy.approval.some(a => upperAction.includes(a))) {
    return 'APPROVAL_REQUIRED';
  }
  
  // Default to safe if not explicitly requiring approval
  return isSafeAction(action) ? 'SAFE' : 'APPROVAL_REQUIRED';
}

export function getSafeActionsForFlow(flowType: string): string[] {
  const policy = getFlowPolicy(flowType);
  return policy?.safe || [];
}

export function getApprovalActionsForFlow(flowType: string): string[] {
  const policy = getFlowPolicy(flowType);
  return policy?.approval || [];
}

export function getAllFlowTypes(): string[] {
  return Object.keys(CRITICAL_PATH_POLICY);
}

export function validateBatchApproval(actions: { action: string; flowType: string }[]): {
  safe: { action: string; flowType: string }[];
  requiresApproval: { action: string; flowType: string }[];
} {
  const safe: { action: string; flowType: string }[] = [];
  const requiresApproval: { action: string; flowType: string }[] = [];
  
  for (const item of actions) {
    const classification = classifyAction(item.flowType, item.action);
    
    if (classification === 'SAFE') {
      safe.push(item);
    } else {
      requiresApproval.push(item);
    }
  }
  
  return { safe, requiresApproval };
}
