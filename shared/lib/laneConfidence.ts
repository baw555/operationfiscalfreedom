export type VALane = "supplemental" | "hlr" | "board";

export interface ConfidenceFactors {
  strengthAvg: number;
  completenessPct: number;
  hasNewEvidence: boolean;
  hasNexusLetter?: boolean;
  hasMedicalRecords?: boolean;
  hasServiceRecords?: boolean;
  priorDenials?: number;
}

export interface LaneRecommendation {
  lane: VALane;
  confidence: number;
  reasoning: string[];
  alternativeLane?: VALane;
  alternativeConfidence?: number;
}

export function laneConfidence(factors: ConfidenceFactors): number {
  let confidence = 50;

  confidence += (factors.strengthAvg - 3) * 15;
  
  confidence += (factors.completenessPct - 70) * 0.5;
  
  if (factors.hasNewEvidence) confidence += 10;
  
  if (factors.hasNexusLetter) confidence += 8;
  if (factors.hasMedicalRecords) confidence += 5;
  if (factors.hasServiceRecords) confidence += 3;
  
  if (factors.priorDenials && factors.priorDenials > 0) {
    confidence -= factors.priorDenials * 5;
  }

  return Math.max(10, Math.min(95, Math.round(confidence)));
}

export function recommendLane(factors: ConfidenceFactors): LaneRecommendation {
  const reasoning: string[] = [];
  let lane: VALane = "supplemental";
  let alternativeLane: VALane | undefined;

  if (factors.hasNewEvidence && factors.strengthAvg >= 3) {
    lane = "supplemental";
    reasoning.push("New evidence present");
    if (factors.strengthAvg >= 3.5) {
      reasoning.push("Evidence strength above average");
    }
  } else if (factors.strengthAvg >= 3 && !factors.hasNewEvidence) {
    lane = "hlr";
    reasoning.push("Strong existing record");
    reasoning.push("No new evidence required for Higher Level Review");
    alternativeLane = "board";
  } else if (factors.strengthAvg < 3 && factors.completenessPct < 70) {
    lane = "supplemental";
    reasoning.push("Evidence gaps identified - new evidence recommended");
    alternativeLane = "board";
  } else {
    lane = "board";
    reasoning.push("Complex case may benefit from Board review");
    alternativeLane = "supplemental";
  }

  if (factors.hasNexusLetter) {
    reasoning.push("Nexus letter strengthens medical connection");
  }
  if (factors.hasMedicalRecords) {
    reasoning.push("Medical records document current condition");
  }
  if (factors.hasServiceRecords) {
    reasoning.push("Service records establish in-service occurrence");
  }

  if (factors.priorDenials && factors.priorDenials > 1) {
    reasoning.push(`Prior denials (${factors.priorDenials}) suggest Board review may be warranted`);
    if (lane !== "board") {
      alternativeLane = "board";
    }
  }

  const confidence = laneConfidence(factors);
  const alternativeConfidence = alternativeLane 
    ? Math.max(10, confidence - 20) 
    : undefined;

  return {
    lane,
    confidence,
    reasoning,
    alternativeLane,
    alternativeConfidence
  };
}

export function getLaneDisplayName(lane: VALane): string {
  switch (lane) {
    case "supplemental": return "Supplemental Claim";
    case "hlr": return "Higher Level Review";
    case "board": return "Board Appeal";
  }
}

export function getLaneDescription(lane: VALane): string {
  switch (lane) {
    case "supplemental": 
      return "Submit new and relevant evidence not previously considered";
    case "hlr": 
      return "Request a senior reviewer to re-examine existing evidence for clear error";
    case "board": 
      return "Appeal to the Board of Veterans Appeals for a hearing and decision";
  }
}
