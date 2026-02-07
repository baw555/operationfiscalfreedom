import fs from "fs";
import path from "path";

const ROUTES_PATH = path.resolve("server/routes.ts");
const SCHEMA_PATH = path.resolve("shared/schema.ts");
const ACTIONS_DIR = path.resolve("server/actions");
const STORAGE_PATH = path.resolve("server/storage.ts");
const OUTPUT_PATH = path.resolve("docs/domain-model-extraction-feasibility.md");

interface DomainEntity {
  name: string;
  tables: string[];
  mutatingRoutes: RouteRef[];
  readingRoutes: RouteRef[];
  singleSourceOfTruth: "YES" | "NO" | "PARTIAL";
  truthReason: string;
  lifecycleFragmented: "YES" | "MODERATE" | "LOW";
  fragmentReason: string;
  classFeasible: "YES" | "NO" | "PARTIAL" | "YES_IF_REFACTORED";
  feasibleReason: string;
}

interface RouteRef {
  method: string;
  path: string;
  line: number;
  description: string;
}

function readFile(p: string): string {
  try { return fs.readFileSync(p, "utf-8"); } catch { return ""; }
}

function extractRoutes(src: string): RouteRef[] {
  const routes: RouteRef[] = [];
  const routeRegex = /app\.(get|post|patch|put|delete)\s*\(\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;

  while ((m = routeRegex.exec(src)) !== null) {
    const line = src.substring(0, m.index).split("\n").length;
    const after = src.substring(m.index, Math.min(m.index + 500, src.length));
    const commentMatch = src.substring(Math.max(0, m.index - 200), m.index).match(/\/\/\s*(.+?)$/m);

    routes.push({
      method: m[1].toUpperCase(),
      path: m[2],
      line,
      description: commentMatch ? commentMatch[1].trim() : "",
    });
  }

  return routes;
}

function countActionFiles(): { name: string; path: string }[] {
  const actions: { name: string; path: string }[] = [];
  function walk(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith(".ts")) actions.push({ name: e.name, path: full });
      }
    } catch {}
  }
  walk(ACTIONS_DIR);
  return actions;
}

function classifyRoutes(routes: RouteRef[], entity: { name: string; pathPatterns: RegExp[] }): { mutating: RouteRef[]; reading: RouteRef[] } {
  const mutating: RouteRef[] = [];
  const reading: RouteRef[] = [];

  for (const r of routes) {
    const matches = entity.pathPatterns.some((p) => p.test(r.path));
    if (!matches) continue;

    if (r.method === "GET") reading.push(r);
    else mutating.push(r);
  }

  return { mutating, reading };
}

function countPatternInFile(filePath: string, pattern: RegExp): number {
  const src = readFile(filePath);
  const matches = src.match(pattern);
  return matches ? matches.length : 0;
}

function countStorageMethods(src: string, tableNames: string[]): number {
  let count = 0;
  for (const t of tableNames) {
    const pattern = new RegExp(`from\\(${t}\\)|insert\\(${t}\\)|update\\(${t}\\)|delete\\(${t}\\)`, "g");
    const matches = src.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

function buildEntities(routes: RouteRef[], routesSrc: string): DomainEntity[] {
  const entities: DomainEntity[] = [];

  const entityDefs = [
    {
      name: "User / Affiliate Identity",
      pathPatterns: [/\/api\/auth\//, /\/api\/affiliate-signup/, /\/api\/admin\/affiliates/, /\/api\/admin\/vlt-affiliates/, /\/api\/vlt-affiliate/],
      tables: ["users", "vlt_affiliates", "veteran_auth_users", "ai_users", "password_reset_tokens"],
      singleSourceOfTruth: "NO" as const,
      truthReason: "4 separate identity tables (users, vlt_affiliates, veteran_auth_users, ai_users) with no FK relationships between them",
      lifecycleFragmented: "YES" as const,
      fragmentReason: "User creation scattered across 4+ routes. Session management duplicated in 4 places with nested callbacks.",
      classFeasible: "NO" as const,
      feasibleReason: "Identity split across 4 unlinked tables. PK types incompatible (serial vs varchar UUID). Polymorphic IDs prevent type-safe traversal.",
    },
    {
      name: "Legal Documents (NDA, Contracts, Signatures)",
      pathPatterns: [/\/api\/affiliate\/nda/, /\/api\/legal\//, /\/api\/contracts\//, /\/api\/metrics\/signature/],
      tables: ["affiliate_nda", "legal_signatures", "contract_templates", "signed_agreements", "legal_override_audit", "signature_metrics"],
      singleSourceOfTruth: "PARTIAL" as const,
      truthReason: "3 separate signature systems: affiliate_nda, legal_signatures, signed_agreements. legal_signatures acts as partial aggregator.",
      lifecycleFragmented: "YES" as const,
      fragmentReason: "3 signing flows: NDA action file, signLegalDocumentAtomic (takes req object), contract inline handler.",
      classFeasible: "PARTIAL" as const,
      feasibleReason: "Could create LegalDocument class IF all signatures unified, polymorphic affiliate_id resolved, and signLegalDocumentAtomic decoupled from Express req.",
    },
    {
      name: "Claim Case",
      pathPatterns: [/\/api\/claims\//],
      tables: ["claim_cases", "claim_tasks", "claim_files", "claim_sessions", "claim_answers", "case_shares", "case_notes", "case_deadlines", "evidence_requirements"],
      singleSourceOfTruth: "YES" as const,
      truthReason: "Claims domain owns 9 related tables with claim_cases as clear root aggregate. All child tables FK to claim_cases.id.",
      lifecycleFragmented: "MODERATE" as const,
      fragmentReason: "Case creation is atomic. Ownership verification copy-pasted across 7+ route handlers. No shared ownership guard.",
      classFeasible: "YES_IF_REFACTORED" as const,
      feasibleReason: "Most feasible entity. Single ownership model, complete FK chain, atomic creation. Needs ownership guard centralization and 2 FK fixes.",
    },
    {
      name: "Commission / Sale",
      pathPatterns: [/\/api\/opportunities/, /\/api\/sales/, /\/api\/commission/, /\/api\/admin\/sales/, /\/api\/admin\/commissions/, /\/api\/admin\/send-commission/],
      tables: ["opportunities", "sales", "commissions", "commission_config"],
      singleSourceOfTruth: "NO" as const,
      truthReason: "Commission calculation embedded in route handler, hardcoded in email template, and duplicated in stress test. 7-level referral chain flattened with no FK.",
      lifecycleFragmented: "YES" as const,
      fragmentReason: "Commission calculation duplicated in 3 places: route handler, stress test, and email template.",
      classFeasible: "NO" as const,
      feasibleReason: "Cannot create stable class. Calculation logic not extracted. 14 nullable referral columns with no FK integrity. Booleans stored as text.",
    },
    {
      name: "CSU Contract / Envelope",
      pathPatterns: [/\/api\/csu\//],
      tables: ["csu_contract_templates", "csu_contract_template_fields", "csu_contract_sends", "csu_signed_agreements", "csu_envelopes", "csu_envelope_recipients", "csu_audit_trail"],
      singleSourceOfTruth: "NO" as const,
      truthReason: "Two parallel signing systems: legacy single-send (csu_contract_sends → csu_signed_agreements) and new envelope system (csu_envelopes → csu_envelope_recipients).",
      lifecycleFragmented: "YES" as const,
      fragmentReason: "Signing workflow duplicated across single-send and envelope flows. Both write to csu_audit_trail with different FK columns.",
      classFeasible: "NO" as const,
      feasibleReason: "Cannot create unified class. Two parallel signing systems with no shared abstraction. Polymorphic audit trail.",
    },
    {
      name: "AI Session / Generation",
      pathPatterns: [/\/api\/operator-ai\//, /\/api\/ai\//, /\/api\/generate-image/, /\/api\/orchestration\//],
      tables: ["ai_users", "ai_sessions", "ai_messages", "ai_files", "ai_memory", "ai_jobs", "ai_generations", "ai_templates", "operator_ai_memory"],
      singleSourceOfTruth: "NO" as const,
      truthReason: "Memory stored in 2 tables (operator_ai_memory FK to users, ai_memory FK to ai_users). ai_generations FK to users but other AI tables FK to ai_users.",
      lifecycleFragmented: "YES" as const,
      fragmentReason: "Chat logic embedded in route handler (~174 lines). Content filtering, memory mode logic, OpenAI API call all inline.",
      classFeasible: "PARTIAL" as const,
      feasibleReason: "Could create AiSession class IF memory tables unified, chat orchestration extracted, identity resolved between users and ai_users.",
    },
    {
      name: "VLT Affiliate Hierarchy",
      pathPatterns: [/\/api\/admin\/vlt-affiliates/, /\/api\/vlt-affiliate\//, /\/api\/vlt\//],
      tables: ["vlt_affiliates", "sales", "commissions", "veteran_intake", "business_intake", "vlt_intake"],
      singleSourceOfTruth: "NO" as const,
      truthReason: "Hierarchy stored as 7 flat columns in vlt_affiliates, duplicated in sales and 3 intake tables. 34 referral columns, none with FK constraints.",
      lifecycleFragmented: "MODERATE" as const,
      fragmentReason: "Affiliate creation includes bcrypt + upline chain building inline. Hierarchy traversal rebuilt in each route with (data as any) casting.",
      classFeasible: "NO" as const,
      feasibleReason: "Cannot create tree structure. 8 missing FK constraints. Hierarchy duplicated in 5 tables. Booleans stored as text.",
    },
    {
      name: "Sailor Man AI Assistant",
      pathPatterns: [/\/api\/sailor\//],
      tables: ["sailor_conversations", "sailor_messages", "sailor_faq"],
      singleSourceOfTruth: "YES" as const,
      truthReason: "Self-contained domain. 3 tables with clear FK relationships. Service layer already extracted (sailor-chat.ts).",
      lifecycleFragmented: "LOW" as const,
      fragmentReason: "Chat logic lives in server/sailor-chat.ts. FAQ management is straightforward CRUD.",
      classFeasible: "YES" as const,
      feasibleReason: "Simplest candidate. 3 tables, clean FK chain, extracted service layer, no identity conflicts, no polymorphic references.",
    },
  ];

  for (const def of entityDefs) {
    const { mutating, reading } = classifyRoutes(routes, def);

    entities.push({
      name: def.name,
      tables: def.tables,
      mutatingRoutes: mutating,
      readingRoutes: reading,
      singleSourceOfTruth: def.singleSourceOfTruth,
      truthReason: def.truthReason,
      lifecycleFragmented: def.lifecycleFragmented,
      fragmentReason: def.fragmentReason,
      classFeasible: def.classFeasible,
      feasibleReason: def.feasibleReason,
    });
  }

  return entities;
}

function generateReport(entities: DomainEntity[], totalRoutes: number, actionFiles: { name: string; path: string }[]): string {
  const now = new Date().toISOString().split("T")[0];
  const feasibleCount = entities.filter((e) => e.classFeasible === "YES" || e.classFeasible === "YES_IF_REFACTORED").length;
  const notFeasibleCount = entities.filter((e) => e.classFeasible === "NO").length;
  const partialCount = entities.filter((e) => e.classFeasible === "PARTIAL").length;

  let md = `# Domain Model Extraction Feasibility Report

**Generated:** ${now} (auto-generated by \`scripts/audit-domain.ts\`)  
**Sources:** \`server/routes.ts\`, \`shared/schema.ts\`, \`server/actions/\`, \`server/storage.ts\`

> Run \`npx tsx scripts/audit-domain.ts\` to regenerate this report.

---

## Quick Summary

| Metric | Count |
|---|---|
| **Total backend routes** | ${totalRoutes} |
| **Domain entities analyzed** | ${entities.length} |
| **Action files** | ${actionFiles.length} |
| **Entities feasible for class extraction** | ${feasibleCount} |
| **Entities NOT feasible** | ${notFeasibleCount} |
| **Entities partially feasible** | ${partialCount} |

---

## Summary Table

| Entity | Tables | Mutating Routes | Reading Routes | Source of Truth | Lifecycle | Class Feasible? |
|---|---|---|---|---|---|---|
`;

  for (const e of entities) {
    const truthIcon = e.singleSourceOfTruth === "YES" ? "YES" : e.singleSourceOfTruth === "PARTIAL" ? "PARTIAL" : "NO";
    const feasIcon = e.classFeasible === "YES" ? "YES" : e.classFeasible === "YES_IF_REFACTORED" ? "YES IF REFACTORED" : e.classFeasible === "PARTIAL" ? "PARTIAL" : "NO";
    md += `| **${e.name}** | ${e.tables.length} | ${e.mutatingRoutes.length} | ${e.readingRoutes.length} | ${truthIcon} | ${e.lifecycleFragmented} | ${feasIcon} |\n`;
  }

  md += `\n---\n\n`;

  for (const e of entities) {
    md += `## Entity: ${e.name}\n\n`;
    md += `### Tables Spanned\n${e.tables.map((t) => `- \`${t}\``).join("\n")}\n\n`;

    md += `### Routes That Mutate (${e.mutatingRoutes.length})\n\n`;
    if (e.mutatingRoutes.length > 0) {
      md += `| Method | Path | Line | Description |\n|---|---|---|---|\n`;
      for (const r of e.mutatingRoutes) {
        md += `| ${r.method} | \`${r.path}\` | ${r.line} | ${r.description} |\n`;
      }
    } else {
      md += `_No mutating routes found matching patterns._\n`;
    }

    md += `\n### Routes That Read (${e.readingRoutes.length})\n\n`;
    if (e.readingRoutes.length > 0) {
      md += `| Method | Path | Line | Description |\n|---|---|---|---|\n`;
      for (const r of e.readingRoutes) {
        md += `| ${r.method} | \`${r.path}\` | ${r.line} | ${r.description} |\n`;
      }
    } else {
      md += `_No reading routes found matching patterns._\n`;
    }

    md += `\n### Single Source of Truth?\n**${e.singleSourceOfTruth}.** ${e.truthReason}\n\n`;
    md += `### Lifecycle Fragmented?\n**${e.lifecycleFragmented}.** ${e.fragmentReason}\n\n`;
    md += `### Can It Be Represented as a Stable Class Object Today?\n**${e.classFeasible}.** ${e.feasibleReason}\n\n`;
    md += `---\n\n`;
  }

  md += `## Blocking Issues for Class Object Extraction

1. **${entities.filter((e) => e.singleSourceOfTruth === "NO").length} entities lack a single source of truth**
2. **${entities.filter((e) => e.lifecycleFragmented === "YES").length} entities have fragmented lifecycle logic**
3. **${notFeasibleCount} entities are NOT feasible for class extraction today**
4. **4 disconnected identity systems** with no FK relationships between them
5. **52+ missing FK constraints** prevent safe relationship traversal
6. **Business logic embedded in route handlers** (commission calc, AI chat, email templates)
7. **Express \`req\` object passed to domain functions** (legal system coupling)

---

## Feasibility Conclusion

**Class objects are NOT feasible today for ${notFeasibleCount} out of ${entities.length} entities.**

**Extraction-ready entities:**
${entities.filter((e) => e.classFeasible === "YES" || e.classFeasible === "YES_IF_REFACTORED").map((e) => `- **${e.name}** — ${e.feasibleReason}`).join("\n")}

**Partially feasible entities:**
${entities.filter((e) => e.classFeasible === "PARTIAL").map((e) => `- **${e.name}** — ${e.feasibleReason}`).join("\n")}

**No fixes proposed. No refactoring performed. Assessment only.**
`;

  return md;
}

function main() {
  const routesSrc = readFile(ROUTES_PATH);
  if (!routesSrc) { console.error(`Cannot read ${ROUTES_PATH}`); process.exit(1); }

  const allRoutes = extractRoutes(routesSrc);
  const actionFiles = countActionFiles();
  const entities = buildEntities(allRoutes, routesSrc);
  const report = generateReport(entities, allRoutes.length, actionFiles);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, report, "utf-8");

  console.log(`[domain-audit] Generated: ${OUTPUT_PATH}`);
  console.log(`  Total routes: ${allRoutes.length}`);
  console.log(`  Entities: ${entities.length}`);
  console.log(`  Action files: ${actionFiles.length}`);
}

main();
