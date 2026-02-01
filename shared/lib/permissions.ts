export type ShareRole = "view" | "comment" | "upload";

interface PermissionCheck {
  userEmail: string;
  ownerEmail: string;
  share?: { role: ShareRole };
}

export function canViewCase({ userEmail, ownerEmail, share }: PermissionCheck): boolean {
  if (userEmail === ownerEmail) return true;
  if (!share) return false;
  return ["view", "comment", "upload"].includes(share.role);
}

export function canUpload(share?: { role: ShareRole }): boolean {
  return share?.role === "upload";
}

export function canComment(share?: { role: ShareRole }): boolean {
  return ["comment", "upload"].includes(share?.role || "");
}

export function isVeteranOwner(userEmail: string, ownerEmail: string): boolean {
  return userEmail === ownerEmail;
}

export function getPermissionLevel(share?: { role: ShareRole }): "none" | "view" | "comment" | "upload" {
  if (!share) return "none";
  return share.role;
}
