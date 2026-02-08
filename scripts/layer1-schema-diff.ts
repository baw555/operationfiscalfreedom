import pg from "pg";
import * as schema from "../shared/schema";
import fs from "fs";
import path from "path";

const { Client } = pg;

interface ColumnInfo {
  name: string;
  dataType: string;
  nullable: boolean;
  hasDefault: boolean;
}

interface ForeignKey {
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

interface TableInfo {
  columns: Record<string, ColumnInfo>;
  foreignKeys: ForeignKey[];
}

function normalizeType(drizzleType: string): string {
  const map: Record<string, string> = {
    string: "text",
    number: "integer",
    boolean: "boolean",
    date: "timestamp",
    json: "json",
    jsonb: "jsonb",
    buffer: "bytea",
    bigint: "bigint",
    array: "array",
  };
  return map[drizzleType] || drizzleType;
}

const SYM_IS_TABLE = Symbol.for("drizzle:IsDrizzleTable");
const SYM_NAME = Symbol.for("drizzle:Name");
const SYM_COLUMNS = Symbol.for("drizzle:Columns");
const SYM_INLINE_FKS = Symbol.for("drizzle:PgInlineForeignKeys");

function getCodeTables(): Record<string, TableInfo> {
  const tables: Record<string, TableInfo> = {};

  for (const [exportName, value] of Object.entries(schema)) {
    if (!value || typeof value !== "object") continue;
    const v = value as any;
    if (!v[SYM_IS_TABLE]) continue;

    const tableName: string = v[SYM_NAME];
    const columns: Record<string, ColumnInfo> = {};
    const foreignKeys: ForeignKey[] = [];

    const cols = v[SYM_COLUMNS];
    if (!cols) continue;

    for (const [colKey, col] of Object.entries(cols) as [string, any][]) {
      const sqlName: string = col.name;
      const dataType = normalizeType(col.dataType);
      const nullable = !col.notNull;
      const hasDefault = col.hasDefault === true || col.default !== undefined || col.defaultFn !== undefined;

      columns[sqlName] = { name: sqlName, dataType, nullable, hasDefault };
    }

    const inlineFks = v[SYM_INLINE_FKS];
    if (inlineFks && Array.isArray(inlineFks)) {
      for (const fk of inlineFks) {
        try {
          const ref = typeof fk.reference === "function" ? fk.reference() : fk.reference;
          if (ref && ref.foreignColumns && ref.columns) {
            const fkCols = ref.columns;
            const fkRefCols = ref.foreignColumns;
            for (let i = 0; i < fkCols.length; i++) {
              const refTable = fkRefCols[i]?.table?.[SYM_NAME];
              const refColumn = fkRefCols[i]?.name;
              const localColumn = fkCols[i]?.name;
              if (refTable && refColumn && localColumn) {
                foreignKeys.push({ column: localColumn, referencedTable: refTable, referencedColumn: refColumn });
              }
            }
          }
        } catch {}
      }
    }

    tables[tableName] = { columns, foreignKeys };
  }

  return tables;
}

async function getDbTables(client: pg.Client): Promise<Record<string, TableInfo>> {
  const tablesResult = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  const columnsResult = await client.query(`
    SELECT table_name, column_name, data_type, udt_name,
           is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);

  const fkResult = await client.query(`
    SELECT
      kcu.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ORDER BY kcu.table_name, kcu.column_name
  `);

  const tables: Record<string, TableInfo> = {};

  for (const row of tablesResult.rows) {
    tables[row.table_name] = { columns: {}, foreignKeys: [] };
  }

  for (const row of columnsResult.rows) {
    if (!tables[row.table_name]) continue;
    const dt = row.udt_name === "int4" ? "integer"
      : row.udt_name === "int8" ? "bigint"
      : row.udt_name === "int2" ? "smallint"
      : row.udt_name === "float4" ? "real"
      : row.udt_name === "float8" ? "double precision"
      : row.udt_name === "bool" ? "boolean"
      : row.udt_name === "timestamptz" ? "timestamp"
      : row.udt_name === "timestamp" ? "timestamp"
      : row.udt_name === "varchar" ? "text"
      : row.udt_name === "text" ? "text"
      : row.udt_name === "jsonb" ? "jsonb"
      : row.udt_name === "json" ? "json"
      : row.udt_name === "uuid" ? "uuid"
      : row.udt_name === "serial" ? "integer"
      : row.data_type === "character varying" ? "text"
      : row.data_type === "timestamp without time zone" ? "timestamp"
      : row.data_type === "timestamp with time zone" ? "timestamp"
      : row.data_type === "USER-DEFINED" ? row.udt_name
      : row.data_type;

    tables[row.table_name].columns[row.column_name] = {
      name: row.column_name,
      dataType: dt,
      nullable: row.is_nullable === "YES",
      hasDefault: row.column_default !== null,
    };
  }

  for (const row of fkResult.rows) {
    if (!tables[row.table_name]) continue;
    tables[row.table_name].foreignKeys.push({
      column: row.column_name,
      referencedTable: row.foreign_table_name,
      referencedColumn: row.foreign_column_name,
    });
  }

  return tables;
}

function compareTables(codeTables: Record<string, TableInfo>, dbTables: Record<string, TableInfo>): string {
  const lines: string[] = [];
  const codeNames = new Set(Object.keys(codeTables));
  const dbNames = new Set(Object.keys(dbTables));

  const onlyInCode = [...codeNames].filter(n => !dbNames.has(n)).sort();
  const onlyInDb = [...dbNames].filter(n => !codeNames.has(n)).sort();
  const inBoth = [...codeNames].filter(n => dbNames.has(n)).sort();

  let totalIssues = 0;

  lines.push("# Layer 1 Schema Diff Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`- **Tables in code**: ${codeNames.size}`);
  lines.push(`- **Tables in DB**: ${dbNames.size}`);
  lines.push(`- **Tables in both**: ${inBoth.length}`);
  lines.push("");

  lines.push("## Tables Only in Code (not in DB)");
  lines.push("");
  if (onlyInCode.length === 0) {
    lines.push("_None — all code tables exist in the database._");
  } else {
    for (const t of onlyInCode) {
      lines.push(`- \`${t}\``);
      totalIssues++;
    }
  }
  lines.push("");

  lines.push("## Tables Only in DB (not in code)");
  lines.push("");
  if (onlyInDb.length === 0) {
    lines.push("_None — all DB tables are defined in code._");
  } else {
    for (const t of onlyInDb) {
      lines.push(`- \`${t}\``);
      totalIssues++;
    }
  }
  lines.push("");

  lines.push("## Column-Level Comparison");
  lines.push("");

  let tablesWithIssues = 0;

  for (const tableName of inBoth) {
    const codeTable = codeTables[tableName];
    const dbTable = dbTables[tableName];
    const issues: string[] = [];

    const codeColNames = new Set(Object.keys(codeTable.columns));
    const dbColNames = new Set(Object.keys(dbTable.columns));

    const missingInDb = [...codeColNames].filter(c => !dbColNames.has(c)).sort();
    const extraInDb = [...dbColNames].filter(c => !codeColNames.has(c)).sort();
    const commonCols = [...codeColNames].filter(c => dbColNames.has(c)).sort();

    for (const col of missingInDb) {
      issues.push(`  - ❌ Column \`${col}\`: in code but **missing in DB**`);
    }
    for (const col of extraInDb) {
      issues.push(`  - ➕ Column \`${col}\`: in DB but **not in code**`);
    }
    for (const col of commonCols) {
      const cc = codeTable.columns[col];
      const dc = dbTable.columns[col];

      if (cc.dataType !== dc.dataType) {
        const codeIsEnum = !["text", "integer", "boolean", "timestamp", "json", "jsonb", "uuid", "bigint", "bytea", "real", "double precision", "smallint", "date"].includes(cc.dataType);
        const dbIsEnum = !["text", "integer", "boolean", "timestamp", "json", "jsonb", "uuid", "bigint", "bytea", "real", "double precision", "smallint", "date", "array"].includes(dc.dataType);
        if (codeIsEnum && dbIsEnum) {
          // both are likely enum types, skip mismatch
        } else if (cc.dataType === "date" && dc.dataType === "timestamp") {
          // close enough
        } else {
          issues.push(`  - ⚠️ Column \`${col}\`: type mismatch — code=\`${cc.dataType}\` db=\`${dc.dataType}\``);
        }
      }

      if (cc.nullable !== dc.nullable) {
        issues.push(`  - ⚠️ Column \`${col}\`: nullable mismatch — code=\`${cc.nullable}\` db=\`${dc.nullable}\``);
      }
    }

    if (issues.length > 0) {
      tablesWithIssues++;
      totalIssues += issues.length;
      lines.push(`### \`${tableName}\` — ${issues.length} issue(s)`);
      lines.push("");
      lines.push(...issues);
      lines.push("");
    }
  }

  if (tablesWithIssues === 0) {
    lines.push("_All shared tables have matching columns._");
    lines.push("");
  }

  lines.push("## Foreign Key Analysis");
  lines.push("");

  let fkIssueCount = 0;

  for (const tableName of inBoth) {
    const codeFks = codeTables[tableName].foreignKeys;
    const dbFks = dbTables[tableName].foreignKeys;

    const codeFkSet = new Set(codeFks.map(fk => `${fk.column}->${fk.referencedTable}.${fk.referencedColumn}`));
    const dbFkSet = new Set(dbFks.map(fk => `${fk.column}->${fk.referencedTable}.${fk.referencedColumn}`));

    const onlyInCodeFk = [...codeFkSet].filter(fk => !dbFkSet.has(fk)).sort();
    const onlyInDbFk = [...dbFkSet].filter(fk => !codeFkSet.has(fk)).sort();

    if (onlyInCodeFk.length > 0 || onlyInDbFk.length > 0) {
      fkIssueCount++;
      lines.push(`### \`${tableName}\``);
      lines.push("");
      for (const fk of onlyInCodeFk) {
        lines.push(`  - ❌ FK in code but not DB: \`${fk}\``);
        totalIssues++;
      }
      for (const fk of onlyInDbFk) {
        lines.push(`  - ➕ FK in DB but not code: \`${fk}\``);
        totalIssues++;
      }
      lines.push("");
    }
  }

  if (fkIssueCount === 0) {
    lines.push("_All foreign keys match between code and database._");
    lines.push("");
  }

  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Tables only in code | ${onlyInCode.length} |`);
  lines.push(`| Tables only in DB | ${onlyInDb.length} |`);
  lines.push(`| Tables in both | ${inBoth.length} |`);
  lines.push(`| Tables with column issues | ${tablesWithIssues} |`);
  lines.push(`| Tables with FK issues | ${fkIssueCount} |`);
  lines.push(`| Total issues | ${totalIssues} |`);
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  console.log("Extracting tables from Drizzle schema...");
  const codeTables = getCodeTables();
  console.log(`  Found ${Object.keys(codeTables).length} tables in code`);

  console.log("Connecting to database...");
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    console.log("Querying database schema...");
    const dbTables = await getDbTables(client);
    console.log(`  Found ${Object.keys(dbTables).length} tables in DB`);

    console.log("Comparing schemas...");
    const report = compareTables(codeTables, dbTables);

    const outPath = path.join(process.cwd(), "docs", "layer1-schema-diff.md");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, report, "utf-8");
    console.log(`\nReport written to ${outPath}`);

    const codeNames = new Set(Object.keys(codeTables));
    const dbNames = new Set(Object.keys(dbTables));
    const onlyInCode = [...codeNames].filter(n => !dbNames.has(n));
    const onlyInDb = [...dbNames].filter(n => !codeNames.has(n));

    console.log("\n=== SUMMARY ===");
    console.log(`Code tables: ${codeNames.size}`);
    console.log(`DB tables: ${dbNames.size}`);
    console.log(`Tables only in code: ${onlyInCode.length}${onlyInCode.length > 0 ? " — " + onlyInCode.join(", ") : ""}`);
    console.log(`Tables only in DB: ${onlyInDb.length}${onlyInDb.length > 0 ? " — " + onlyInDb.join(", ") : ""}`);
    console.log("Done.");
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
