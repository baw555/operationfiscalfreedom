export interface VendorAction {
  type: "upload" | "note" | "view";
  timestamp: Date;
  responseTimeHours?: number;
  evidenceStrengthBefore?: number;
  evidenceStrengthAfter?: number;
}

export interface VendorScorecard {
  vendorEmail: string;
  uploads: number;
  notes: number;
  avgResponseHours: number | null;
  strengthDelta: number;
  score: number;
  rating: "excellent" | "good" | "fair" | "needs_improvement";
}

export function buildVendorScorecard(vendorEmail: string, actions: VendorAction[]): VendorScorecard {
  const uploads = actions.filter(a => a.type === "upload").length;
  const notes = actions.filter(a => a.type === "note").length;
  
  const actionsWithResponse = actions.filter(a => a.responseTimeHours !== undefined);
  const avgResponse = actionsWithResponse.length > 0
    ? Math.round(
        actionsWithResponse.reduce((sum, a) => sum + (a.responseTimeHours || 0), 0) / actionsWithResponse.length
      )
    : null;

  const strengthDeltas = actions.filter(a => 
    a.evidenceStrengthBefore !== undefined && 
    a.evidenceStrengthAfter !== undefined
  );
  const strengthDelta = strengthDeltas.length > 0
    ? strengthDeltas.reduce((sum, a) => 
        sum + ((a.evidenceStrengthAfter || 0) - (a.evidenceStrengthBefore || 0)), 0
      )
    : 0;

  const score = calculateScore(uploads, notes, avgResponse, strengthDelta);

  return {
    vendorEmail,
    uploads,
    notes,
    avgResponseHours: avgResponse,
    strengthDelta,
    score,
    rating: getRating(score)
  };
}

function calculateScore(
  uploads: number, 
  notes: number, 
  avgResponse: number | null, 
  strengthDelta: number
): number {
  let score = 0;
  
  score += uploads * 3;
  score += notes * 1;
  
  if (avgResponse !== null) {
    if (avgResponse <= 4) score += 15;
    else if (avgResponse <= 12) score += 10;
    else if (avgResponse <= 24) score += 5;
    else if (avgResponse <= 48) score += 2;
  }
  
  score += strengthDelta * 5;
  
  return Math.max(0, score);
}

function getRating(score: number): "excellent" | "good" | "fair" | "needs_improvement" {
  if (score >= 30) return "excellent";
  if (score >= 20) return "good";
  if (score >= 10) return "fair";
  return "needs_improvement";
}

export function compareVendors(scorecards: VendorScorecard[]): VendorScorecard[] {
  return [...scorecards].sort((a, b) => b.score - a.score);
}

export function getVendorStats(scorecards: VendorScorecard[]) {
  if (scorecards.length === 0) {
    return { avgScore: 0, topPerformer: null, totalUploads: 0, totalNotes: 0 };
  }

  const avgScore = Math.round(
    scorecards.reduce((sum, s) => sum + s.score, 0) / scorecards.length
  );
  const topPerformer = scorecards.reduce((top, s) => 
    s.score > (top?.score || 0) ? s : top, scorecards[0]
  );
  const totalUploads = scorecards.reduce((sum, s) => sum + s.uploads, 0);
  const totalNotes = scorecards.reduce((sum, s) => sum + s.notes, 0);

  return { avgScore, topPerformer, totalUploads, totalNotes };
}
