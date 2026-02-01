export interface HeatmapCell {
  condition: string;
  type: string;
  avgStrength: number;
  count: number;
}

export interface ClaimFile {
  condition?: string | null;
  evidenceType?: string | null;
  strength?: number | null;
}

export function buildEvidenceHeatmap(files: ClaimFile[]): HeatmapCell[] {
  const map: Record<string, { total: number; count: number }> = {};

  for (const f of files) {
    const condition = f.condition || "General";
    const evidenceType = f.evidenceType || "other";
    const key = `${condition}:${evidenceType}`;
    
    if (!map[key]) {
      map[key] = { total: 0, count: 0 };
    }
    
    map[key].total += f.strength || 1;
    map[key].count += 1;
  }

  return Object.entries(map).map(([key, v]) => {
    const [condition, type] = key.split(":");
    return {
      condition,
      type,
      avgStrength: Math.round((v.total / v.count) * 10) / 10,
      count: v.count,
    };
  });
}

export function getHeatmapColor(avgStrength: number): string {
  if (avgStrength >= 4) return "green";
  if (avgStrength >= 3) return "yellow";
  return "red";
}
