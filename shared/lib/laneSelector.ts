export interface LaneRecommendation {
  lane: "Supplemental Claim" | "Higher-Level Review" | "Board Appeal";
  reason: string;
  confidence: "high" | "medium" | "low";
}

export function recommendLane({
  hasNewEvidence,
  strengthAvg,
  hasNexusLetter,
  completenessPercent,
}: {
  hasNewEvidence: boolean;
  strengthAvg: number;
  hasNexusLetter?: boolean;
  completenessPercent?: number;
}): LaneRecommendation {
  if (hasNewEvidence && strengthAvg >= 3.5) {
    return {
      lane: "Supplemental Claim",
      reason: "New and relevant evidence present with strong evidentiary support",
      confidence: hasNexusLetter ? "high" : "medium",
    };
  }

  if (hasNewEvidence && strengthAvg >= 2.5 && strengthAvg < 3.5) {
    return {
      lane: "Supplemental Claim",
      reason: "New evidence available; consider strengthening medical documentation",
      confidence: "medium",
    };
  }

  if (!hasNewEvidence && strengthAvg >= 3) {
    return {
      lane: "Higher-Level Review",
      reason: "Record appears strong; reviewing for clear and unmistakable error may be appropriate",
      confidence: strengthAvg >= 4 ? "high" : "medium",
    };
  }

  if (!hasNewEvidence && strengthAvg < 3) {
    return {
      lane: "Board Appeal",
      reason: "Consider gathering additional evidence before Board review for strongest position",
      confidence: "low",
    };
  }

  return {
    lane: "Board Appeal",
    reason: "Complex evidentiary posture may benefit from Board-level review",
    confidence: "low",
  };
}

export function getLaneDescription(lane: string): string {
  switch (lane) {
    case "Supplemental Claim":
      return "File a new claim with additional evidence. Best when you have new medical records, nexus letters, or other documentation.";
    case "Higher-Level Review":
      return "Request a senior reviewer examine your existing record for errors. Best when you believe the VA made a mistake with the evidence already on file.";
    case "Board Appeal":
      return "Appeal directly to the Board of Veterans' Appeals. Best for complex cases or when other lanes haven't worked.";
    default:
      return "";
  }
}
