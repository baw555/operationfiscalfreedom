export type UserPlan = "free" | "pro" | "enterprise";

export interface MonetizationFeatures {
  uploadAndTag: boolean;
  evidenceIndex: boolean;
  completenessWarnings: boolean;
  laneRecommendation: boolean;
  exportPackage: boolean;
  vendorPrioritySharing: boolean;
  deadlineEscalationAlerts: boolean;
}

export function getFeatureAccess(plan: UserPlan): MonetizationFeatures {
  const freeFeatures: MonetizationFeatures = {
    uploadAndTag: true,
    evidenceIndex: true,
    completenessWarnings: true,
    laneRecommendation: true,
    exportPackage: false,
    vendorPrioritySharing: false,
    deadlineEscalationAlerts: false,
  };

  const proFeatures: MonetizationFeatures = {
    ...freeFeatures,
    exportPackage: true,
    vendorPrioritySharing: true,
    deadlineEscalationAlerts: true,
  };

  const enterpriseFeatures: MonetizationFeatures = {
    ...proFeatures,
  };

  switch (plan) {
    case "enterprise":
      return enterpriseFeatures;
    case "pro":
      return proFeatures;
    default:
      return freeFeatures;
  }
}

export function canExport(userPlan: UserPlan): boolean {
  return userPlan === "pro" || userPlan === "enterprise";
}

export function canUseVendorPriority(userPlan: UserPlan): boolean {
  return userPlan === "pro" || userPlan === "enterprise";
}

export function canUseDeadlineAlerts(userPlan: UserPlan): boolean {
  return userPlan === "pro" || userPlan === "enterprise";
}
