export interface HeatmapEntry {
  condition: string;
  type: string;
  avgStrength: number;
  count: number;
}

export interface Suggestion {
  condition: string;
  type: string;
  priority: "high" | "medium" | "low";
  text: string;
}

export function suggestImprovements(heatmap: HeatmapEntry[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const h of heatmap) {
    if (h.avgStrength < 2 && h.type === "medical") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "high",
        text: `Obtain current medical records or diagnosis documentation for ${h.condition}. Recent treatment notes are essential.`
      });
    } else if (h.avgStrength < 3 && h.type === "medical") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "medium",
        text: `Consider obtaining updated medical records or treatment notes for ${h.condition}.`
      });
    }

    if (h.avgStrength < 2 && h.type === "nexus") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "high",
        text: `A nexus letter from a qualified medical professional is critical for ${h.condition}. This connects your condition to service.`
      });
    } else if (h.avgStrength < 3 && h.type === "nexus") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "medium",
        text: `A medical opinion connecting ${h.condition} to service could materially strengthen this claim.`
      });
    }

    if (h.avgStrength < 2 && h.type === "exam") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "high",
        text: `Schedule a current examination for ${h.condition}. Independent medical evaluations can provide crucial evidence.`
      });
    } else if (h.avgStrength < 3 && h.type === "exam") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "medium",
        text: `An updated examination for ${h.condition} could strengthen your evidence package.`
      });
    }

    if (h.avgStrength < 3 && h.type === "lay") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "low",
        text: `Additional personal or buddy statements describing functional impact of ${h.condition} may help.`
      });
    }

    if (h.avgStrength < 3 && h.type === "service") {
      suggestions.push({
        condition: h.condition,
        type: h.type,
        priority: "medium",
        text: `Locate service records documenting ${h.condition} during active duty. DD-214, medical records, or unit logs can help.`
      });
    }
  }

  const uniqueSuggestions = suggestions.filter((s, i, arr) => 
    arr.findIndex(x => x.text === s.text) === i
  );

  return uniqueSuggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getTopSuggestions(heatmap: HeatmapEntry[], limit: number = 5): Suggestion[] {
  return suggestImprovements(heatmap).slice(0, limit);
}
