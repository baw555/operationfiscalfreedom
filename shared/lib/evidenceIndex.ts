export interface IndexedFile {
  filename: string;
  evidenceType: string;
  condition?: string | null;
  strength?: number | null;
}

export function generateEvidenceIndex(files: IndexedFile[]): string {
  return files.map((f, i) => 
    `${i + 1}. ${f.filename} – ${f.evidenceType.toUpperCase()} – ${f.condition || "General"}${f.strength ? ` (Strength: ${f.strength}/5)` : ""}`
  ).join("\n");
}

export function generateEvidenceIndexHTML(files: IndexedFile[]): string {
  const rows = files.map((f, i) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${i + 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${f.filename}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${f.evidenceType.toUpperCase()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${f.condition || "General"}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${f.strength || "-"}/5</td>
    </tr>
  `).join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background: #1a365d; color: white;">
          <th style="padding: 12px; text-align: left;">#</th>
          <th style="padding: 12px; text-align: left;">Document</th>
          <th style="padding: 12px; text-align: left;">Type</th>
          <th style="padding: 12px; text-align: left;">Condition</th>
          <th style="padding: 12px; text-align: left;">Strength</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
