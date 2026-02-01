export interface VendorAction {
  type: "upload" | "note" | "share";
  vendorEmail: string;
  timestamp: Date;
  responseTime?: number;
}

export interface VendorScorecard {
  email: string;
  uploads: number;
  notes: number;
  totalActions: number;
  avgResponseTimeHours: number | null;
  score: number;
  rank?: number;
}

export function calculateVendorMetrics(actions: VendorAction[]): {
  uploads: number;
  notes: number;
  avgResponseTimeHours: number | null;
} {
  const uploads = actions.filter(a => a.type === "upload").length;
  const notes = actions.filter(a => a.type === "note").length;
  
  const actionsWithResponse = actions.filter(a => a.responseTime !== undefined);
  const avgResponseTimeHours = actionsWithResponse.length > 0
    ? actionsWithResponse.reduce((sum, a) => sum + (a.responseTime || 0), 0) / actionsWithResponse.length
    : null;

  return { uploads, notes, avgResponseTimeHours };
}

export function buildVendorScorecard(
  email: string,
  uploads: number,
  notes: number,
  avgResponseTimeHours: number | null
): VendorScorecard {
  let score = 0;
  score += uploads * 10;
  score += notes * 5;
  
  if (avgResponseTimeHours !== null) {
    if (avgResponseTimeHours < 24) score += 20;
    else if (avgResponseTimeHours < 48) score += 10;
    else if (avgResponseTimeHours < 72) score += 5;
  }

  return {
    email,
    uploads,
    notes,
    totalActions: uploads + notes,
    avgResponseTimeHours,
    score,
  };
}

export function rankVendors(scorecards: VendorScorecard[]): VendorScorecard[] {
  const sorted = [...scorecards].sort((a, b) => b.score - a.score);
  return sorted.map((sc, idx) => ({ ...sc, rank: idx + 1 }));
}
