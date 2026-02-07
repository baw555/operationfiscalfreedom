import fs from "fs";
import path from "path";

const PAGES_DIR = path.resolve("client/src/pages");
const COMPONENTS_DIR = path.resolve("client/src/components");
const HOOKS_DIR = path.resolve("client/src/hooks");
const LIB_DIR = path.resolve("client/src/lib");
const OUTPUT_PATH = path.resolve("docs/ui-domain-binding-audit.md");

interface FileAnalysis {
  filePath: string;
  fileName: string;
  useQueryCount: number;
  anyTypeCount: number;
  localInterfaces: string[];
  queryKeys: string[];
  authEndpointKeys: string[];
  roleChecks: RoleCheck[];
  statusStringChecks: string[];
  inlineFilters: number;
  schemaImports: number;
  hardcodedConstants: string[];
  staleTimeOverrides: number;
}

interface RoleCheck {
  pattern: string;
  line: number;
  roles: string[];
}

interface QueryKeyConflict {
  endpoint: string;
  keys: string[];
  files: string[];
}

interface DuplicateInterface {
  name: string;
  files: string[];
  fieldDiffs: string;
}

function readFile(p: string): string {
  try { return fs.readFileSync(p, "utf-8"); } catch { return ""; }
}

function walkDir(dir: string, ext: string = ".tsx"): string[] {
  const files: string[] = [];
  function walk(d: string) {
    try {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith(ext) || e.name.endsWith(".ts")) files.push(full);
      }
    } catch {}
  }
  walk(dir);
  return files;
}

function analyzeFile(filePath: string): FileAnalysis {
  const src = readFile(filePath);
  const fileName = path.basename(filePath);

  const useQueryMatches = src.match(/useQuery\s*\(\s*\{/g);
  const anyTypeMatches = src.match(/:\s*any\b|as\s+any\b/g);
  const schemaImports = src.match(/from\s+["']@shared|from\s+["']shared\/schema/g);
  const staleTimeMatches = src.match(/staleTime/g);

  const localInterfaces: string[] = [];
  const ifaceRegex = /(?:interface|type)\s+(\w+)\s*(?:=|\{)/g;
  let m: RegExpExecArray | null;
  while ((m = ifaceRegex.exec(src)) !== null) {
    localInterfaces.push(m[1]);
  }

  const queryKeys: string[] = [];
  const qkRegex = /queryKey:\s*\[([^\]]+)\]/g;
  while ((m = qkRegex.exec(src)) !== null) {
    queryKeys.push(m[1].replace(/["']/g, "").trim());
  }

  const authEndpointKeys = queryKeys.filter((k) => k.includes("auth") || k.includes("/api/auth"));

  const roleChecks: RoleCheck[] = [];
  const roleRegex = /\.role\s*(?:===|!==)\s*["'](\w+)["']/g;
  while ((m = roleRegex.exec(src)) !== null) {
    const line = src.substring(0, m.index).split("\n").length;
    roleChecks.push({ pattern: m[0], line, roles: [m[1]] });
  }

  const statusChecks: string[] = [];
  const statusRegex = /\.status\s*===\s*["'](\w+)["']/g;
  while ((m = statusRegex.exec(src)) !== null) {
    statusChecks.push(m[1]);
  }

  const filterMatches = src.match(/\.filter\s*\(/g);

  const hardcoded: string[] = [];
  if (src.match(/0\.69|0\.225|0\.025|producerBase|housePct|recruiterPct/)) {
    hardcoded.push("commission_percentages");
  }
  if (src.match(/["']pending["']|["']new["']|["']closed["']|["']todo["']|["']doing["']|["']done["']/)) {
    hardcoded.push("status_strings");
  }

  return {
    filePath,
    fileName,
    useQueryCount: useQueryMatches ? useQueryMatches.length : 0,
    anyTypeCount: anyTypeMatches ? anyTypeMatches.length : 0,
    localInterfaces,
    queryKeys,
    authEndpointKeys,
    roleChecks,
    statusStringChecks: [...new Set(statusChecks)],
    inlineFilters: filterMatches ? filterMatches.length : 0,
    schemaImports: schemaImports ? schemaImports.length : 0,
    staleTimeOverrides: staleTimeMatches ? staleTimeMatches.length : 0,
    hardcodedConstants: hardcoded,
  };
}

function findQueryKeyConflicts(analyses: FileAnalysis[]): QueryKeyConflict[] {
  const endpointToKeys = new Map<string, { keys: Set<string>; files: Set<string> }>();

  for (const a of analyses) {
    for (const k of a.queryKeys) {
      const endpoint = k.includes("/api/") ? k.split(",")[0].trim() : null;
      if (!endpoint) continue;

      const normalizedEndpoint = endpoint.replace(/\/api\//, "/api/");
      if (!endpointToKeys.has(normalizedEndpoint)) {
        endpointToKeys.set(normalizedEndpoint, { keys: new Set(), files: new Set() });
      }
      endpointToKeys.get(normalizedEndpoint)!.keys.add(k);
      endpointToKeys.get(normalizedEndpoint)!.files.add(a.fileName);
    }
  }

  const authKeys = new Map<string, Set<string>>();
  for (const a of analyses) {
    for (const k of a.queryKeys) {
      if (k.includes("auth") || k.includes("/api/auth/me")) {
        const normalized = "/api/auth/me";
        if (!authKeys.has(normalized)) authKeys.set(normalized, new Set());
        authKeys.get(normalized)!.add(`${k} (${a.fileName})`);
      }
    }
  }

  const conflicts: QueryKeyConflict[] = [];

  const authEntry = authKeys.get("/api/auth/me");
  if (authEntry && authEntry.size > 1) {
    const keyFiles = [...authEntry];
    const uniqueKeyPatterns = new Set(keyFiles.map((kf) => kf.split(" (")[0]));
    if (uniqueKeyPatterns.size > 1) {
      conflicts.push({
        endpoint: "/api/auth/me",
        keys: [...uniqueKeyPatterns],
        files: keyFiles.map((kf) => kf.split(" (")[1]?.replace(")", "") || ""),
      });
    }
  }

  return conflicts;
}

function findDuplicateInterfaces(analyses: FileAnalysis[]): DuplicateInterface[] {
  const ifaceMap = new Map<string, string[]>();

  for (const a of analyses) {
    for (const iface of a.localInterfaces) {
      if (["MainTabType", "RequestSubType", "LeadStatus", "MainTab", "WizardStep", "Track", "PipelineStep", "Tab", "AnalyticsView"].includes(iface)) continue;
      if (!ifaceMap.has(iface)) ifaceMap.set(iface, []);
      ifaceMap.get(iface)!.push(a.fileName);
    }
  }

  const duplicates: DuplicateInterface[] = [];
  for (const [name, files] of ifaceMap) {
    if (files.length > 1) {
      duplicates.push({ name, files, fieldDiffs: "Fields may differ across files — check manually" });
    }
  }

  return duplicates;
}

function classifyBindings(analyses: FileAnalysis[]): { strong: string[]; weak: string[]; fragile: string[] } {
  const strong: string[] = [];
  const weak: string[] = [];
  const fragile: string[] = [];

  for (const a of analyses) {
    if (a.useQueryCount === 0) continue;

    const hasAny = a.anyTypeCount > 5;
    const hasRoleChecks = a.roleChecks.length > 0;
    const hasStatusStrings = a.statusStringChecks.length > 3;
    const hasHardcoded = a.hardcodedConstants.length > 0;
    const noSchemaImport = a.schemaImports === 0;
    const hasLocalTypes = a.localInterfaces.length > 0;

    if (hasAny && noSchemaImport) {
      fragile.push(`\`${a.fileName}\` — ${a.anyTypeCount} uses of \`any\`, ${a.useQueryCount} queries, no shared types`);
    } else if (hasHardcoded && a.hardcodedConstants.includes("commission_percentages")) {
      fragile.push(`\`${a.fileName}\` — Hardcoded commission percentages duplicated from backend`);
    } else if (hasRoleChecks && a.roleChecks.length > 5) {
      fragile.push(`\`${a.fileName}\` — ${a.roleChecks.length} inline role checks with raw string comparison`);
    } else if (hasStatusStrings && hasAny) {
      fragile.push(`\`${a.fileName}\` — ${a.statusStringChecks.length} status string constants + \`any\` typing`);
    } else if (hasLocalTypes && noSchemaImport && a.useQueryCount > 3) {
      weak.push(`\`${a.fileName}\` — ${a.localInterfaces.length} local interfaces, ${a.useQueryCount} queries, not imported from schema`);
    } else if (a.useQueryCount > 0 && hasLocalTypes) {
      weak.push(`\`${a.fileName}\` — ${a.useQueryCount} queries with local types`);
    } else if (a.useQueryCount <= 3 && !hasAny) {
      strong.push(`\`${a.fileName}\` — ${a.useQueryCount} queries, clean binding`);
    }
  }

  return { strong, weak, fragile };
}

function generateReport(analyses: FileAnalysis[], conflicts: QueryKeyConflict[], duplicateIfaces: DuplicateInterface[], bindings: { strong: string[]; weak: string[]; fragile: string[] }): string {
  const now = new Date().toISOString().split("T")[0];
  const totalQueries = analyses.reduce((s, a) => s + a.useQueryCount, 0);
  const totalAny = analyses.reduce((s, a) => s + a.anyTypeCount, 0);
  const totalLocalIfaces = analyses.reduce((s, a) => s + a.localInterfaces.length, 0);
  const totalSchemaImports = analyses.reduce((s, a) => s + a.schemaImports, 0);
  const totalRoleChecks = analyses.reduce((s, a) => s + a.roleChecks.length, 0);
  const totalStatusStrings = new Set(analyses.flatMap((a) => a.statusStringChecks)).size;
  const totalFilters = analyses.reduce((s, a) => s + a.inlineFilters, 0);
  const filesWithQueries = analyses.filter((a) => a.useQueryCount > 0);

  const allRoles = new Set<string>();
  for (const a of analyses) {
    for (const rc of a.roleChecks) {
      for (const r of rc.roles) allRoles.add(r);
    }
  }

  const roleCheckPages = analyses.filter((a) => a.roleChecks.length > 0);
  const adminCheckPages = analyses.filter((a) => a.roleChecks.some((rc) => rc.roles.includes("admin")));
  const masterMissingPages = adminCheckPages.filter((a) => {
    const hasAdmin = a.roleChecks.some((rc) => rc.roles.includes("admin"));
    const hasMaster = a.roleChecks.some((rc) => rc.roles.includes("master"));
    return hasAdmin && !hasMaster;
  });

  let md = `# UI ↔ Domain Binding Audit

**Generated:** ${now} (auto-generated by \`scripts/audit-ui-bindings.ts\`)  
**Scope:** \`client/src/pages/\`, \`client/src/components/\`, \`client/src/hooks/\`, \`client/src/lib/\`

> Run \`npx tsx scripts/audit-ui-bindings.ts\` to regenerate this report.

---

## Binding Classification Key

- **Strong (domain-aligned):** UI consumes well-defined API shape, uses typed interfaces matching backend, delegates domain logic to server
- **Weak (shape-coupled):** UI works correctly but is tightly coupled to exact API response shape — field renames silently break it
- **Fragile (implicit assumptions):** UI assumes facts not enforced by API contract — status strings, boolean coercion, field existence

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Files with useQuery hooks** | ${filesWithQueries.length} |
| **Total useQuery hooks** | ${totalQueries} |
| **Total \`: any\` / \`as any\` uses** | ${totalAny} |
| **Local interface definitions** | ${totalLocalIfaces} |
| **Imports from shared/schema** | ${totalSchemaImports} |
| **Inline role checks** | ${totalRoleChecks} |
| **Pages with role checks** | ${roleCheckPages.length} |
| **Roles checked** | ${[...allRoles].map((r) => `\`${r}\``).join(", ")} |
| **Pages checking "admin" but NOT "master"** | ${masterMissingPages.length} (${masterMissingPages.map((a) => `\`${a.fileName}\``).join(", ") || "none"}) |
| **Unique status string constants** | ${totalStatusStrings} |
| **Inline .filter() calls in pages** | ${totalFilters} |
| **QueryKey conflicts (same endpoint, different keys)** | ${conflicts.length} |
| **Duplicate interface names across files** | ${duplicateIfaces.length} |

---

## QueryKey Conflicts

Same backend endpoint cached under different keys — invalidation from one page misses another.

| Endpoint | Keys Used | Files |
|---|---|---|
`;

  for (const c of conflicts) {
    md += `| \`${c.endpoint}\` | ${c.keys.map((k) => `\`[${k}]\``).join(", ")} | ${c.files.map((f) => `\`${f}\``).join(", ")} |\n`;
  }

  if (conflicts.length === 0) md += `| _No conflicts detected_ | — | — |\n`;

  md += `\n---\n\n## Duplicate Interface Definitions\n\nSame interface name defined in multiple files — fields may differ, creating silent type drift.\n\n| Interface Name | Defined In |\n|---|---|\n`;

  for (const d of duplicateIfaces) {
    md += `| \`${d.name}\` | ${d.files.map((f) => `\`${f}\``).join(", ")} |\n`;
  }

  if (duplicateIfaces.length === 0) md += `| _No duplicates detected_ | — |\n`;

  md += `\n---\n\n## Pages by useQuery Count (descending)\n\n| Page | Queries | \`any\` Uses | Local Interfaces | Role Checks | Status Strings | Schema Imports |\n|---|---|---|---|---|---|---|\n`;

  const sorted = [...filesWithQueries].sort((a, b) => b.useQueryCount - a.useQueryCount);
  for (const a of sorted) {
    md += `| \`${a.fileName}\` | ${a.useQueryCount} | ${a.anyTypeCount} | ${a.localInterfaces.length} | ${a.roleChecks.length} | ${a.statusStringChecks.length} | ${a.schemaImports} |\n`;
  }

  md += `\n---\n\n## Role Check Analysis\n\nPages that gate access using inline \`.role === "..."\` comparisons.\n\n| Page | # Checks | Roles Checked | Pattern |\n|---|---|---|---|\n`;

  for (const a of roleCheckPages.sort((a, b) => b.roleChecks.length - a.roleChecks.length)) {
    const roles = [...new Set(a.roleChecks.flatMap((rc) => rc.roles))];
    md += `| \`${a.fileName}\` | ${a.roleChecks.length} | ${roles.map((r) => `\`${r}\``).join(", ")} | Raw string comparison |\n`;
  }

  md += `\n---\n\n## Binding Classifications\n\n### Strong Bindings (${bindings.strong.length})\n\n`;
  if (bindings.strong.length > 0) {
    for (const s of bindings.strong) md += `- ${s}\n`;
  } else {
    md += `_No strong bindings detected._\n`;
  }

  md += `\n### Weak Bindings (${bindings.weak.length})\n\n`;
  for (const w of bindings.weak) md += `- ${w}\n`;

  md += `\n### Fragile Bindings (${bindings.fragile.length})\n\n`;
  for (const f of bindings.fragile) md += `- ${f}\n`;

  md += `\n---\n\n## Key Risks\n\n`;
  md += `1. **Zero imports from shared/schema** — ${totalSchemaImports === 0 ? "CONFIRMED: No frontend file imports types from the shared schema" : `${totalSchemaImports} imports found`}\n`;
  md += `2. **${totalAny} uses of \`any\` typing** — Backend shape changes produce zero compile errors\n`;
  md += `3. **${conflicts.length} queryKey conflicts** — Same endpoint cached under different keys, invalidation misses\n`;
  md += `4. **${masterMissingPages.length} pages check "admin" but omit "master"** — Latent access control gap\n`;
  md += `5. **${duplicateIfaces.length} duplicate interface definitions** — Same entity name, potentially different fields across files\n`;
  md += `6. **${totalStatusStrings} unique status string constants** — Magic strings with no shared enum contract\n`;

  md += `\n---\n\n*No fixes proposed. Report complete. All findings are structural observations of current UI ↔ backend bindings.*\n`;

  return md;
}

function main() {
  const pageFiles = walkDir(PAGES_DIR);
  const componentFiles = walkDir(COMPONENTS_DIR);
  const hookFiles = walkDir(HOOKS_DIR);
  const libFiles = walkDir(LIB_DIR);

  const allFiles = [...pageFiles, ...componentFiles, ...hookFiles, ...libFiles];
  const analyses = allFiles.map(analyzeFile);
  const pageAnalyses = pageFiles.map(analyzeFile);

  const conflicts = findQueryKeyConflicts(analyses);
  const duplicateIfaces = findDuplicateInterfaces(pageAnalyses);
  const bindings = classifyBindings(pageAnalyses);

  const report = generateReport(analyses, conflicts, duplicateIfaces, bindings);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, report, "utf-8");

  const totalQueries = analyses.reduce((s, a) => s + a.useQueryCount, 0);
  const totalAny = analyses.reduce((s, a) => s + a.anyTypeCount, 0);

  console.log(`[ui-binding-audit] Generated: ${OUTPUT_PATH}`);
  console.log(`  Files analyzed: ${allFiles.length}`);
  console.log(`  Total useQuery hooks: ${totalQueries}`);
  console.log(`  Total any-type uses: ${totalAny}`);
  console.log(`  QueryKey conflicts: ${conflicts.length}`);
  console.log(`  Duplicate interfaces: ${duplicateIfaces.length}`);
}

main();
