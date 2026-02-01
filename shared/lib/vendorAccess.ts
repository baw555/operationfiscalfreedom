export type VendorRole = "view" | "comment" | "upload";

export interface VendorAccess {
  caseId: number;
  email: string;
  role: VendorRole;
  canView: boolean;
  canComment: boolean;
  canUpload: boolean;
}

export function parseVendorRole(role: string): VendorRole {
  if (role === "upload") return "upload";
  if (role === "comment") return "comment";
  return "view";
}

export function getPermissionsFromRole(role: VendorRole): {
  canView: boolean;
  canComment: boolean;
  canUpload: boolean;
} {
  switch (role) {
    case "upload":
      return { canView: true, canComment: true, canUpload: true };
    case "comment":
      return { canView: true, canComment: true, canUpload: false };
    case "view":
    default:
      return { canView: true, canComment: false, canUpload: false };
  }
}

export function buildVendorAccess(
  caseId: number,
  email: string,
  role: string
): VendorAccess {
  const parsedRole = parseVendorRole(role);
  const permissions = getPermissionsFromRole(parsedRole);
  
  return {
    caseId,
    email,
    role: parsedRole,
    ...permissions,
  };
}
