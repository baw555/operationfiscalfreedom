import type { ClaimFile } from "@shared/schema";

export function scoreFile(file: { 
  evidenceType?: string | null; 
  condition?: string | null;
}): number {
  let score = 1;

  if (file.evidenceType === "medical") score += 1;
  if (file.evidenceType === "nexus") score += 2;
  if (file.evidenceType === "exam") score += 2;
  if (file.evidenceType === "lay") score += 0;
  if (file.condition) score += 1;

  return Math.min(score, 5);
}

export interface ConditionStrength {
  condition: string;
  avgStrength: number;
  fileCount: number;
  maxStrength: number;
}

export function conditionStrength(files: ClaimFile[]): ConditionStrength[] {
  const map: Record<string, number[]> = {};

  files.forEach((f) => {
    if (!f.condition) return;
    map[f.condition] ||= [];
    map[f.condition].push(f.strength || 1);
  });

  return Object.entries(map).map(([condition, scores]) => ({
    condition,
    avgStrength: scores.reduce((a, b) => a + b, 0) / scores.length,
    fileCount: scores.length,
    maxStrength: Math.max(...scores),
  }));
}

export function overallStrength(files: ClaimFile[]): number {
  const filesWithStrength = files.filter((f) => f.strength);
  if (filesWithStrength.length === 0) return 0;

  const total = filesWithStrength.reduce((sum, f) => sum + (f.strength || 0), 0);
  return total / filesWithStrength.length;
}
