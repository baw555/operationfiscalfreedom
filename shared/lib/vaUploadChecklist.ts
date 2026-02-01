export interface ChecklistFile {
  id: number;
  filename: string;
  evidenceType: string | null;
  condition: string | null;
  strength: number | null;
}

export interface ChecklistItem {
  step: number;
  label: string;
  filename: string;
  documentType: string;
  note: string;
  priority: "required" | "recommended" | "optional";
  completed: boolean;
}

export interface VAUploadChecklist {
  title: string;
  items: ChecklistItem[];
  summary: {
    total: number;
    required: number;
    recommended: number;
    optional: number;
  };
  instructions: string[];
}

const EVIDENCE_TYPE_TO_VA_DOC: Record<string, string> = {
  "medical": "Medical Treatment Records",
  "nexus": "Medical Opinion/Nexus Letter",
  "exam": "Examination Report",
  "lay": "Lay/Buddy Statement",
  "service": "Service Records",
  "disability": "Disability Documentation",
  "other": "Supporting Documentation"
};

function getVADocumentType(evidenceType: string | null): string {
  if (!evidenceType) return "Supporting Documentation";
  return EVIDENCE_TYPE_TO_VA_DOC[evidenceType.toLowerCase()] || "Supporting Documentation";
}

function getPriority(evidenceType: string | null, strength: number | null): "required" | "recommended" | "optional" {
  if (evidenceType === "nexus" || evidenceType === "medical") return "required";
  if (evidenceType === "exam" || evidenceType === "service") return "recommended";
  if (strength && strength >= 4) return "required";
  return "optional";
}

export function buildVAUploadChecklist(files: ChecklistFile[], claimTitle?: string): VAUploadChecklist {
  const sortedFiles = [...files].sort((a, b) => {
    const priorityOrder = { "required": 0, "recommended": 1, "optional": 2 };
    const aPriority = getPriority(a.evidenceType, a.strength);
    const bPriority = getPriority(b.evidenceType, b.strength);
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });

  const items: ChecklistItem[] = sortedFiles.map((f, i) => {
    const priority = getPriority(f.evidenceType, f.strength);
    const docType = getVADocumentType(f.evidenceType);
    
    return {
      step: i + 1,
      label: `Upload: "${f.filename}"`,
      filename: f.filename,
      documentType: docType,
      note: `Select document type: ${docType}${f.condition ? ` (for ${f.condition})` : ""}`,
      priority,
      completed: false
    };
  });

  const summary = {
    total: items.length,
    required: items.filter(i => i.priority === "required").length,
    recommended: items.filter(i => i.priority === "recommended").length,
    optional: items.filter(i => i.priority === "optional").length
  };

  const instructions = [
    "1. Log in to VA.gov and navigate to 'File a claim or appeal'",
    "2. Select your claim type and follow the prompts",
    "3. When prompted to upload evidence, follow this checklist in order",
    "4. For each document, select the correct document type from the dropdown",
    "5. Verify all files uploaded successfully before submission",
    "6. Save your confirmation number for your records"
  ];

  return {
    title: claimTitle ? `VA.gov Upload Checklist: ${claimTitle}` : "VA.gov Upload Checklist",
    items,
    summary,
    instructions
  };
}

export function generateChecklistText(checklist: VAUploadChecklist): string {
  let text = `${checklist.title}\n`;
  text += "=".repeat(checklist.title.length) + "\n\n";

  text += `Summary: ${checklist.summary.total} documents\n`;
  text += `  • ${checklist.summary.required} required\n`;
  text += `  • ${checklist.summary.recommended} recommended\n`;
  text += `  • ${checklist.summary.optional} optional\n\n`;

  text += "DOCUMENTS TO UPLOAD\n";
  text += "-".repeat(40) + "\n\n";

  for (const item of checklist.items) {
    const checkbox = item.completed ? "☑" : "☐";
    const priorityLabel = item.priority === "required" ? " [REQUIRED]" : 
                          item.priority === "recommended" ? " [RECOMMENDED]" : "";
    text += `${checkbox} ${item.step}. ${item.label}${priorityLabel}\n`;
    text += `   Document Type: ${item.documentType}\n`;
    text += `   ${item.note}\n\n`;
  }

  text += "\nINSTRUCTIONS\n";
  text += "-".repeat(40) + "\n\n";
  for (const instruction of checklist.instructions) {
    text += `${instruction}\n`;
  }

  text += "\n☐ Confirm all uploads before submission\n";
  text += "☐ Save confirmation number: _______________\n";

  return text;
}

export function markItemComplete(checklist: VAUploadChecklist, step: number): VAUploadChecklist {
  return {
    ...checklist,
    items: checklist.items.map(item => 
      item.step === step ? { ...item, completed: true } : item
    )
  };
}
