import fs from "fs";
import path from "path";

const SCHEMA_PATH = path.resolve("shared/schema.ts");
const AUTH_MODEL_PATH = path.resolve("shared/models/auth.ts");
const OUTPUT_PATH = path.resolve("docs/schema-audit.md");

interface TableInfo {
  name: string;
  varName: string;
  pkColumn: string;
  pkType: string;
  uniqueConstraints: string[];
  columns: ColumnInfo[];
  fks: FkInfo[];
  line: number;
}

interface ColumnInfo {
  name: string;
  drizzleType: string;
  nullable: boolean;
  hasDefault: boolean;
}

interface FkInfo {
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

interface MissingFk {
  table: string;
  column: string;
  shouldReference: string;
  reason: string;
}

interface Anomaly {
  table: string;
  column: string;
  issue: string;
  category: string;
}

function readFile(p: string): string {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

function extractTables(src: string, fileName: string): TableInfo[] {
  const tables: TableInfo[] = [];
  const tableRegex = /export\s+const\s+(\w+)\s*=\s*pgTable\(\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(src)) !== null) {
    const varName = match[1];
    const tableName = match[2];
    const startIdx = match.index;
    const line = src.substring(0, startIdx).split("\n").length;

    let braceCount = 0;
    let tableBodyStart = -1;
    let tableBodyEnd = -1;
    for (let i = src.indexOf("{", startIdx); i < src.length; i++) {
      if (src[i] === "{") {
        if (braceCount === 0) tableBodyStart = i;
        braceCount++;
      }
      if (src[i] === "}") {
        braceCount--;
        if (braceCount === 0) {
          tableBodyEnd = i;
          break;
        }
      }
    }

    if (tableBodyStart === -1 || tableBodyEnd === -1) continue;
    const body = src.substring(tableBodyStart, tableBodyEnd + 1);

    const columns = extractColumns(body);
    const fks = extractForeignKeys(body, src);
    const uniqueConstraints = extractUniqueConstraints(body, columns);
    const pk = findPrimaryKey(columns, body);

    tables.push({
      name: tableName,
      varName,
      pkColumn: pk.column,
      pkType: pk.type,
      uniqueConstraints,
      columns,
      fks,
      line,
    });
  }

  return tables;
}

function extractColumns(body: string): ColumnInfo[] {
  const columns: ColumnInfo[] = [];
  const colRegex = /(\w+):\s*(serial|integer|text|varchar|boolean|timestamp|jsonb|real)\s*\(\s*["']([^"']+)["']\s*\)/g;
  let m: RegExpExecArray | null;

  while ((m = colRegex.exec(body)) !== null) {
    const afterCol = body.substring(m.index + m[0].length, Math.min(m.index + m[0].length + 200, body.length));
    columns.push({
      name: m[3],
      drizzleType: m[2],
      nullable: !afterCol.match(/\.notNull\(\)/) || false,
      hasDefault: !!afterCol.match(/\.default\(|\.defaultNow\(\)|\.primaryKey\(\)/),
    });
  }

  return columns;
}

function extractForeignKeys(body: string, fullSrc: string): FkInfo[] {
  const fks: FkInfo[] = [];
  const fkRegex = /\.references\(\s*\(\)\s*=>\s*(\w+)\.(\w+)\)/g;
  let m: RegExpExecArray | null;

  const lines = body.split("\n");
  for (const line of lines) {
    const fkMatch = fkRegex.exec(line);
    if (fkMatch) {
      const colMatch = line.match(/(\w+):\s*(?:serial|integer|text|varchar)\s*\(\s*["']([^"']+)["']\s*\)/);
      if (colMatch) {
        fks.push({
          sourceColumn: colMatch[2],
          targetTable: fkMatch[1],
          targetColumn: fkMatch[2],
        });
      }
    }
    fkRegex.lastIndex = 0;
  }

  return fks;
}

function extractUniqueConstraints(body: string, columns: ColumnInfo[]): string[] {
  const uniques: string[] = [];
  const uniqueRegex = /\.unique\(\)/g;
  const lines = body.split("\n");

  for (const line of lines) {
    if (line.includes(".unique()")) {
      const colMatch = line.match(/(\w+):\s*(?:serial|integer|text|varchar)\s*\(\s*["']([^"']+)["']\s*\)/);
      if (colMatch) {
        uniques.push(colMatch[2]);
      }
    }
  }

  return uniques;
}

function findPrimaryKey(columns: ColumnInfo[], body: string): { column: string; type: string } {
  const pkRegex = /(\w+):\s*(serial|integer|text|varchar)\s*\(\s*["']([^"']+)["']\s*\)[^,\n]*\.primaryKey\(\)/;
  const match = body.match(pkRegex);
  if (match) {
    return { column: match[3], type: match[2] };
  }
  return { column: "id", type: "serial" };
}

function findMissingFks(tables: TableInfo[]): MissingFk[] {
  const missing: MissingFk[] = [];
  const tableMap = new Map(tables.map((t) => [t.varName, t]));

  for (const table of tables) {
    const fkCols = new Set(table.fks.map((fk) => fk.sourceColumn));

    for (const col of table.columns) {
      if (fkCols.has(col.name)) continue;

      if (col.name.match(/level\d+_id/) && table.name === "vlt_affiliates") {
        missing.push({ table: table.name, column: col.name, shouldReference: "vlt_affiliates.id", reason: "Self-referential hierarchy level" });
      } else if (col.name === "recruiter_id" && !fkCols.has("recruiter_id")) {
        missing.push({ table: table.name, column: col.name, shouldReference: "vlt_affiliates.id", reason: "Recruiter reference without FK" });
      } else if (col.name.match(/referred_by_l\d+/) && !fkCols.has(col.name)) {
        missing.push({ table: table.name, column: col.name, shouldReference: "vlt_affiliates.id", reason: "Referral chain without FK" });
      } else if (col.name === "assigned_to" && !fkCols.has("assigned_to")) {
        missing.push({ table: table.name, column: col.name, shouldReference: "users.id", reason: "Assignment field without FK" });
      } else if (col.name === "template_id" && !fkCols.has("template_id") && col.drizzleType === "integer") {
        missing.push({ table: table.name, column: col.name, shouldReference: "related template table", reason: "Template reference without FK" });
      } else if (col.name === "user_id" && !fkCols.has("user_id") && col.drizzleType === "text") {
        missing.push({ table: table.name, column: col.name, shouldReference: "user table (type mismatch: text vs integer)", reason: "User ID stored as text" });
      } else if (col.name === "admin_id" && !fkCols.has("admin_id")) {
        missing.push({ table: table.name, column: col.name, shouldReference: "users.id", reason: "Admin reference without FK" });
      } else if (col.name === "incident_id" && !fkCols.has("incident_id") && col.drizzleType === "text") {
        missing.push({ table: table.name, column: col.name, shouldReference: "critical_incidents", reason: "Incident reference without FK" });
      } else if (col.name === "veteran_user_id" && !fkCols.has("veteran_user_id")) {
        missing.push({ table: table.name, column: col.name, shouldReference: "veteran_auth_users.id", reason: "Veteran user reference without FK" });
      } else if (col.name === "affiliate_id" && !fkCols.has("affiliate_id") && table.name === "signed_agreements") {
        missing.push({ table: table.name, column: col.name, shouldReference: "users.id OR vlt_affiliates.id (polymorphic)", reason: "Polymorphic affiliate reference" });
      }
    }
  }

  return missing;
}

function findAnomalies(tables: TableInfo[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (const table of tables) {
    for (const col of table.columns) {
      if (col.drizzleType === "text") {
        if (col.name.match(/is_|_active|agreed_to/)) {
          anomalies.push({ table: table.name, column: col.name, issue: `Boolean semantics stored as text`, category: "boolean_as_text" });
        }
        if (col.name.match(/metadata|field_values|backup_codes|recipients|attachments|beat_map|execution_plan|input_params|output_data|depends_on|artifact_urls|partners_shared_with|industries_selected|notified_emails/)) {
          anomalies.push({ table: table.name, column: col.name, issue: `JSON data stored as text instead of JSONB`, category: "json_as_text" });
        }
      }
      if (col.name.match(/referred_by_l\d+|level\d+_id/) && col.nullable) {
        anomalies.push({ table: table.name, column: col.name, issue: `Denormalized referral chain column`, category: "denormalized_referral" });
      }
    }
  }

  return anomalies;
}

function findPolymorphicJoins(tables: TableInfo[]): { table: string; columns: string[]; description: string }[] {
  const joins: { table: string; columns: string[]; description: string }[] = [];

  for (const table of tables) {
    const colNames = table.columns.map((c) => c.name);
    if (colNames.includes("entity_id") && colNames.includes("entity_type")) {
      joins.push({ table: table.name, columns: ["entity_id", "entity_type"], description: "Polymorphic reference to any table" });
    }
    if (colNames.includes("submission_id") && colNames.includes("submission_type")) {
      joins.push({ table: table.name, columns: ["submission_id", "submission_type"], description: "Polymorphic submission reference" });
    }
    if (table.name === "signed_agreements" && colNames.includes("affiliate_id")) {
      const fkCols = new Set(table.fks.map((f) => f.sourceColumn));
      if (!fkCols.has("affiliate_id")) {
        joins.push({ table: table.name, columns: ["affiliate_id"], description: "Polymorphic — can reference users.id OR vlt_affiliates.id" });
      }
    }
  }

  return joins;
}

function findIdentitySystems(tables: TableInfo[]): { table: string; pkType: string; referencedBy: string[] }[] {
  const identityTables = ["users", "vlt_affiliates", "veteran_auth_users", "ai_users"];
  const systems: { table: string; pkType: string; referencedBy: string[] }[] = [];

  for (const idTable of identityTables) {
    const tableInfo = tables.find((t) => t.name === idTable);
    if (!tableInfo) continue;

    const referencedBy: string[] = [];
    for (const t of tables) {
      for (const fk of t.fks) {
        if (fk.targetTable === tableInfo.varName) {
          referencedBy.push(t.name);
        }
      }
    }

    systems.push({ table: idTable, pkType: tableInfo.pkType, referencedBy });
  }

  return systems;
}

function generateReport(tables: TableInfo[], missingFks: MissingFk[], anomalies: Anomaly[], polyJoins: any[], identitySystems: any[]): string {
  const now = new Date().toISOString().split("T")[0];
  const tablesWithFks = tables.filter((t) => t.fks.length > 0).length;
  const tablesWithoutFks = tables.filter((t) => t.fks.length === 0).length;
  const boolAsText = anomalies.filter((a) => a.category === "boolean_as_text").length;
  const jsonAsText = anomalies.filter((a) => a.category === "json_as_text").length;
  const denormRefCols = anomalies.filter((a) => a.category === "denormalized_referral").length;
  const totalFks = tables.reduce((sum, t) => sum + t.fks.length, 0);

  let md = `# Relational Database Truth Audit

**Generated:** ${now} (auto-generated by \`scripts/audit-schema.ts\`)  
**Source:** \`shared/schema.ts\`, \`shared/models/auth.ts\`  
**ORM:** Drizzle ORM (PostgreSQL)

> Run \`npx tsx scripts/audit-schema.ts\` to regenerate this report.

---

## Summary Statistics

| Metric | Count |
|---|---|
| **Total tables** | ${tables.length} |
| **Tables with declared FKs** | ${tablesWithFks} |
| **Tables with no FKs at all** | ${tablesWithoutFks} |
| **Total declared FK constraints** | ${totalFks} |
| **Missing FK constraints** | ${missingFks.length} |
| **Polymorphic join patterns** | ${polyJoins.length} |
| **Booleans stored as text** | ${boolAsText} columns |
| **JSON stored in text (not JSONB)** | ${jsonAsText} columns |
| **Denormalized referral chain columns** | ${denormRefCols} |
| **Separate identity systems** | ${identitySystems.length} |

---

## All Tables

| # | Table Name | Primary Key | PK Type | Unique Constraints | FK Count |
|---|---|---|---|---|---|
`;

  tables.forEach((t, i) => {
    const uniques = t.uniqueConstraints.length > 0 ? t.uniqueConstraints.map((u) => `\`${u}\``).join(", ") : "—";
    md += `| ${i + 1} | \`${t.name}\` | \`${t.pkColumn}\` | ${t.pkType} | ${uniques} | ${t.fks.length} |\n`;
  });

  md += `\n---\n\n## All Declared Foreign Keys\n\n| Source Table | Source Column | Target Table | Target Column |\n|---|---|---|---|\n`;

  for (const t of tables) {
    for (const fk of t.fks) {
      md += `| \`${t.name}\` | \`${fk.sourceColumn}\` | \`${fk.targetTable}\` | \`${fk.targetColumn}\` |\n`;
    }
  }

  md += `\n---\n\n## Missing Foreign Keys (${missingFks.length})\n\n| Table | Column | Should Reference | Reason |\n|---|---|---|---|\n`;

  for (const mfk of missingFks) {
    md += `| \`${mfk.table}\` | \`${mfk.column}\` | ${mfk.shouldReference} | ${mfk.reason} |\n`;
  }

  md += `\n---\n\n## Polymorphic Join Patterns\n\n| Table | Columns | Description |\n|---|---|---|\n`;
  for (const pj of polyJoins) {
    md += `| \`${pj.table}\` | ${pj.columns.map((c: string) => `\`${c}\``).join(", ")} | ${pj.description} |\n`;
  }

  md += `\n---\n\n## Booleans Stored as Text\n\n| Table | Column |\n|---|---|\n`;
  for (const a of anomalies.filter((x) => x.category === "boolean_as_text")) {
    md += `| \`${a.table}\` | \`${a.column}\` |\n`;
  }

  md += `\n---\n\n## JSON Stored in Text Columns (not JSONB)\n\n| Table | Column |\n|---|---|\n`;
  for (const a of anomalies.filter((x) => x.category === "json_as_text")) {
    md += `| \`${a.table}\` | \`${a.column}\` |\n`;
  }

  md += `\n---\n\n## Denormalized Referral Chain Columns\n\n| Table | Column |\n|---|---|\n`;
  for (const a of anomalies.filter((x) => x.category === "denormalized_referral")) {
    md += `| \`${a.table}\` | \`${a.column}\` |\n`;
  }

  md += `\n---\n\n## Identity Systems (No Cross-References)\n\n| Identity Table | PK Type | Referenced By |\n|---|---|---|\n`;
  for (const sys of identitySystems) {
    md += `| \`${sys.table}\` | ${sys.pkType} | ${sys.referencedBy.length > 0 ? sys.referencedBy.map((r: string) => `\`${r}\``).join(", ") : "—"} |\n`;
  }

  md += `\n---\n\n*No fixes proposed. Report complete. All findings are structural observations of current schema definition.*\n`;

  return md;
}

function main() {
  const schemaSrc = readFile(SCHEMA_PATH);
  const authSrc = readFile(AUTH_MODEL_PATH);

  if (!schemaSrc) {
    console.error(`Cannot read ${SCHEMA_PATH}`);
    process.exit(1);
  }

  const tables = [...extractTables(schemaSrc, "schema.ts"), ...extractTables(authSrc, "auth.ts")];
  const missingFks = findMissingFks(tables);
  const anomalies = findAnomalies(tables);
  const polyJoins = findPolymorphicJoins(tables);
  const identitySystems = findIdentitySystems(tables);

  const report = generateReport(tables, missingFks, anomalies, polyJoins, identitySystems);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, report, "utf-8");

  console.log(`[schema-audit] Generated: ${OUTPUT_PATH}`);
  console.log(`  Tables: ${tables.length}`);
  console.log(`  FKs declared: ${tables.reduce((s, t) => s + t.fks.length, 0)}`);
  console.log(`  FKs missing: ${missingFks.length}`);
  console.log(`  Anomalies: ${anomalies.length}`);
}

main();
