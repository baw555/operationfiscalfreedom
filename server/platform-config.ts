export interface PlatformMode {
  enabled: boolean;
  publicAutoFix: boolean;
  affiliateAutoFix: boolean;
  adminApprovalRequiredFor: string[];
  branding: {
    name: string;
    tagline: string;
  };
}

export const PLATFORM_MODE: PlatformMode = {
  enabled: true,
  publicAutoFix: true,
  affiliateAutoFix: true,
  adminApprovalRequiredFor: ["AUTH_ERROR", "DATABASE_ERROR", "PAYMENTS"],
  branding: {
    name: "Self-Healing Platform™",
    tagline: "Describe the problem. We fix it."
  }
};

export function isPlatformEnabled(): boolean {
  return PLATFORM_MODE.enabled;
}

export function canAutoFixForRole(role: string): boolean {
  switch (role) {
    case "PUBLIC":
      return PLATFORM_MODE.publicAutoFix;
    case "AFFILIATE":
      return PLATFORM_MODE.affiliateAutoFix;
    case "ADMIN":
      return true;
    default:
      return false;
  }
}

export function requiresAdminApproval(issueType: string): boolean {
  return PLATFORM_MODE.adminApprovalRequiredFor.includes(issueType);
}

export function getBranding(): { name: string; tagline: string } {
  return PLATFORM_MODE.branding;
}
