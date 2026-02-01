import type { EvidenceRequirement, ClaimFile } from "@shared/schema";

export interface CompletenessResult {
  requirement: EvidenceRequirement;
  status: "present" | "missing";
  matchingFiles: number;
}

export function checkCompleteness({
  requirements,
  files,
}: {
  requirements: EvidenceRequirement[];
  files: ClaimFile[];
}): CompletenessResult[] {
  const filesByType = files.reduce((acc, file) => {
    if (file.evidenceType) {
      acc[file.evidenceType] = (acc[file.evidenceType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return requirements.map((requirement) => ({
    requirement,
    status: filesByType[requirement.evidenceType] ? "present" : "missing",
    matchingFiles: filesByType[requirement.evidenceType] || 0,
  }));
}

export function getCompletionStats(results: CompletenessResult[]) {
  const required = results.filter((r) => r.requirement.required);
  const present = required.filter((r) => r.status === "present");

  return {
    totalRequired: required.length,
    completedRequired: present.length,
    percentComplete: required.length > 0 
      ? Math.round((present.length / required.length) * 100) 
      : 100,
    missingRequired: required.filter((r) => r.status === "missing"),
  };
}
