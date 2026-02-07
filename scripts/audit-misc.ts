import fs from "fs";
import path from "path";

const OUTPUT_PATH = path.resolve("docs/misc-operational-facts.md");

interface TrustProxyInfo {
  locations: { file: string; line: number; value: string }[];
  finalValue: string;
}

interface IpExtractionSite {
  file: string;
  line: number;
  pattern: string;
  category: "req.ip" | "manual-xff" | "resolveClientIp";
}

interface EmailSenderSite {
  file: string;
  line: number;
  function: string;
  usesRetry: boolean;
}

interface AuthGuard {
  name: string;
  file: string;
  line: number;
  roles: string[];
  hasMfa: boolean;
  notes: string;
}

function readFile(p: string): string {
  try { return fs.readFileSync(p, "utf-8"); } catch { return ""; }
}

function findLines(src: string, pattern: RegExp): { line: number; text: string }[] {
  const results: { line: number; text: string }[] = [];
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      results.push({ line: i + 1, text: lines[i].trim() });
    }
  }
  return results;
}

function analyzeEntryPoint(): string[] {
  const lines: string[] = [];
  const indexSrc = readFile(path.resolve("server/index.ts"));

  const appCreate = findLines(indexSrc, /const\s+app\s*=\s*express\(\)/);
  const httpCreate = findLines(indexSrc, /createServer\(app\)/);
  const registerRoutes = findLines(indexSrc, /registerRoutes/);
  const trustProxy = findLines(indexSrc, /trust proxy/);

  lines.push("## 1) Express App Creation & Route Mounting");
  lines.push("");
  lines.push("| What | File | Line | Code |");
  lines.push("|---|---|---|---|");

  for (const m of appCreate) lines.push(`| App created | \`server/index.ts\` | ${m.line} | \`${m.text}\` |`);
  for (const m of httpCreate) lines.push(`| HTTP server | \`server/index.ts\` | ${m.line} | \`${m.text}\` |`);
  for (const m of trustProxy) lines.push(`| Trust proxy (index) | \`server/index.ts\` | ${m.line} | \`${m.text}\` |`);
  for (const m of registerRoutes) lines.push(`| Routes mounted | \`server/index.ts\` | ${m.line} | \`${m.text}\` |`);

  const routesSrc = readFile(path.resolve("server/routes.ts"));
  const registerDef = findLines(routesSrc, /export\s+async\s+function\s+registerRoutes/);
  const trustProxyRoutes = findLines(routesSrc, /trust proxy/);

  for (const m of registerDef) lines.push(`| registerRoutes defined | \`server/routes.ts\` | ${m.line} | \`${m.text}\` |`);
  for (const m of trustProxyRoutes) lines.push(`| Trust proxy (routes) | \`server/routes.ts\` | ${m.line} | \`${m.text}\` |`);

  lines.push("");
  if (trustProxy.length > 0 && trustProxyRoutes.length > 0) {
    lines.push("> **Warning:** `trust proxy` is set twice — once in `index.ts` and once in `routes.ts`. The second call overwrites the first.");
  }

  return lines;
}

function analyzeQueryClient(): string[] {
  const lines: string[] = [];
  const src = readFile(path.resolve("client/src/lib/queryClient.ts"));

  lines.push("## 2) TanStack Query Client");
  lines.push("");
  lines.push("**File:** `client/src/lib/queryClient.ts`");
  lines.push("");

  const defaults: { key: string; value: string }[] = [];
  const staleMatch = src.match(/staleTime:\s*([^,\n]+)/);
  if (staleMatch) defaults.push({ key: "staleTime", value: staleMatch[1].trim() });
  const refetchMatch = src.match(/refetchOnWindowFocus:\s*([^,\n]+)/);
  if (refetchMatch) defaults.push({ key: "refetchOnWindowFocus", value: refetchMatch[1].trim() });
  const retryMatch = src.match(/retry:\s*([^,\n]+)/);
  if (retryMatch) defaults.push({ key: "retry", value: retryMatch[1].trim() });
  const on401Match = src.match(/on401:\s*["']([^"']+)["']/);
  if (on401Match) defaults.push({ key: "on401", value: on401Match[1] });
  const refetchIntervalMatch = src.match(/refetchInterval:\s*([^,\n]+)/);
  if (refetchIntervalMatch) defaults.push({ key: "refetchInterval", value: refetchIntervalMatch[1].trim() });

  lines.push("| Default | Value |");
  lines.push("|---|---|");
  for (const d of defaults) lines.push(`| \`${d.key}\` | \`${d.value}\` |`);

  lines.push("");

  const hasApiRequest = src.includes("export async function apiRequest");
  const hasGetQueryFn = src.includes("export const getQueryFn");
  lines.push("**Exports:**");
  if (hasApiRequest) lines.push("- `apiRequest(method, url, data?)` — shared mutation fetch wrapper (credentials: include, throws on non-OK)");
  if (hasGetQueryFn) lines.push("- `getQueryFn({ on401 })` — shared query function (reads queryKey as URL)");

  return lines;
}

function analyzeRuntime(): string[] {
  const lines: string[] = [];
  const pkgSrc = readFile(path.resolve("package.json"));
  const tsconfigSrc = readFile(path.resolve("tsconfig.json"));

  lines.push("## 3) Runtime Configuration");
  lines.push("");

  const moduleType = pkgSrc.match(/"type"\s*:\s*"([^"]+)"/);
  const tsModule = tsconfigSrc.match(/"module"\s*:\s*"([^"]+)"/);
  const tsModuleRes = tsconfigSrc.match(/"moduleResolution"\s*:\s*"([^"]+)"/);
  const tsStrict = tsconfigSrc.includes('"strict": true');
  const tsNoEmit = tsconfigSrc.includes('"noEmit": true');

  let nodeVersion = "unknown";
  try {
    const result = require("child_process").execSync("node --version", { encoding: "utf-8" }).trim();
    nodeVersion = result;
  } catch {}

  const devScript = pkgSrc.match(/"dev"\s*:\s*"([^"]+)"/);

  lines.push("| Setting | Value |");
  lines.push("|---|---|");
  lines.push(`| Node version | ${nodeVersion} |`);
  lines.push(`| Module system | ${moduleType ? moduleType[1] : "unknown"} (\`package.json "type"\`) |`);
  lines.push(`| TS module | ${tsModule ? tsModule[1] : "unknown"} |`);
  lines.push(`| TS moduleResolution | ${tsModuleRes ? tsModuleRes[1] : "unknown"} |`);
  lines.push(`| TS strict | ${tsStrict ? "true" : "false"} |`);
  lines.push(`| TS noEmit | ${tsNoEmit ? "true" : "false"} |`);
  lines.push(`| TS execution | \`tsx\` (dev script: \`${devScript ? devScript[1] : "unknown"}\`) |`);
  lines.push(`| Env vars | Replit runtime-injected (no dotenv) |`);

  return lines;
}

function analyzeHttpClient(): string[] {
  const lines: string[] = [];
  const qcSrc = readFile(path.resolve("client/src/lib/queryClient.ts"));

  lines.push("## 4) HTTP Client Wrapper");
  lines.push("");
  lines.push("**File:** `client/src/lib/queryClient.ts`");
  lines.push("");

  const hasApiRequest = qcSrc.includes("export async function apiRequest");
  const hasGetQueryFn = qcSrc.includes("export const getQueryFn");

  lines.push(`- \`apiRequest()\` exported: **${hasApiRequest ? "YES" : "NO"}**`);
  lines.push(`- \`getQueryFn()\` exported: **${hasGetQueryFn ? "YES" : "NO"}**`);
  lines.push("");

  function walkTsx(dir: string): string[] {
    const files: string[] = [];
    function walk(d: string) {
      try {
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(d, e.name);
          if (e.isDirectory()) walk(full);
          else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) files.push(full);
        }
      } catch {}
    }
    walk(dir);
    return files;
  }

  const pageFiles = walkTsx(path.resolve("client/src/pages"));
  let rawFetchCount = 0;
  let apiRequestImportCount = 0;
  const rawFetchPages: string[] = [];

  for (const f of pageFiles) {
    const src = readFile(f);
    const hasRawFetch = /(?<!function\s)fetch\s*\(/.test(src) && !f.includes("queryClient");
    const importsApiRequest = src.includes("apiRequest");
    if (hasRawFetch) {
      rawFetchCount++;
      rawFetchPages.push(path.basename(f));
    }
    if (importsApiRequest) apiRequestImportCount++;
  }

  lines.push(`- Pages using raw \`fetch()\` directly: **${rawFetchCount}**`);
  lines.push(`- Pages importing \`apiRequest\`: **${apiRequestImportCount}**`);

  if (rawFetchPages.length > 0) {
    lines.push("");
    lines.push("Pages bypassing `apiRequest` with raw `fetch()`:");
    for (const p of rawFetchPages.sort()) lines.push(`  - \`${p}\``);
  }

  return lines;
}

function analyzeAuthGuards(): string[] {
  const lines: string[] = [];
  const mwSrc = readFile(path.resolve("server/middleware.ts"));

  lines.push("## 5) Auth Guards");
  lines.push("");
  lines.push("**File:** `server/middleware.ts`");
  lines.push("");

  const guards: AuthGuard[] = [];

  const guardRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
  let m: RegExpExecArray | null;
  const mwLines = mwSrc.split("\n");

  while ((m = guardRegex.exec(mwSrc)) !== null) {
    const name = m[1];
    const line = mwSrc.substring(0, m.index).split("\n").length;
    const blockEnd = Math.min(line + 30, mwLines.length);
    const block = mwLines.slice(line - 1, blockEnd).join("\n");

    const roles: string[] = [];
    const roleMatches = block.matchAll(/["'](\w+)["']\s*(?:\)|\|)/g);
    for (const rm of roleMatches) {
      if (["admin", "master", "affiliate", "sub_master"].includes(rm[1])) roles.push(rm[1]);
    }

    const hasMfa = block.includes("mfaPending") || block.includes("mfaVerified");
    let notes = "";
    if (name === "resolveClientIp") notes = "IP resolution utility, not an auth guard";
    if (name === "requireAffiliateWithNda") notes = "Checks NDA + CONTRACT via getLegalStatus()";

    guards.push({ name, file: "server/middleware.ts", line, roles: [...new Set(roles)], hasMfa, notes });
  }

  lines.push("| Guard | Line | Roles | MFA Check | Notes |");
  lines.push("|---|---|---|---|---|");
  for (const g of guards) {
    lines.push(`| \`${g.name}\` | ${g.line} | ${g.roles.length > 0 ? g.roles.map(r => `\`${r}\``).join(", ") : "—"} | ${g.hasMfa ? "YES" : "NO"} | ${g.notes} |`);
  }

  lines.push("");

  const routesSrc = readFile(path.resolve("server/routes.ts"));
  const inlineAuthChecks = findLines(routesSrc, /if\s*\(\s*!req\.session\.userId/);
  lines.push(`**Note:** There is NO generic \`requireAuth\` middleware. Routes that need any-user auth check \`req.session.userId\` inline — **${inlineAuthChecks.length} occurrences** in \`routes.ts\`.`);

  return lines;
}

function analyzeEmailSenders(): string[] {
  const lines: string[] = [];

  lines.push("## 6) Email Sender Helpers");
  lines.push("");

  const files = [
    "server/resendClient.ts",
    "server/emailWithRetry.ts",
    "server/daily-digest.ts",
    "server/repair-mailer.ts",
    "server/routes.ts",
  ];

  const sites: EmailSenderSite[] = [];

  for (const f of files) {
    const src = readFile(path.resolve(f));
    const srcLines = src.split("\n");

    for (let i = 0; i < srcLines.length; i++) {
      const line = srcLines[i];
      if (line.includes("getResendClient()") && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
        const usesRetry = f.includes("emailWithRetry");
        let func = "inline getResendClient()";
        if (f === "server/resendClient.ts") func = "getResendClient() [definition]";
        if (f === "server/emailWithRetry.ts") func = "sendEmailWithRetry / sendEmailWithRetryClient";
        if (f === "server/daily-digest.ts") func = "sendDailyDigest / sendBatchApprovalResult";
        if (f === "server/repair-mailer.ts") func = "sendRepairAlert / sendStatusUpdate";

        sites.push({ file: f, line: i + 1, function: func, usesRetry });
      }
    }
  }

  const helpers: { file: string; function: string; description: string }[] = [
    { file: "server/resendClient.ts", function: "getResendClient()", description: "Returns `{ client: Resend, fromEmail }`. Creates fresh client per call (tokens expire)." },
    { file: "server/emailWithRetry.ts", function: "sendEmailWithRetry()", description: "Convenience wrapper — calls getResendClient() + sendEmailWithRetryClient()." },
    { file: "server/emailWithRetry.ts", function: "sendEmailWithRetryClient()", description: "Wraps Resend with retry + exponential backoff (max 3 attempts)." },
    { file: "server/daily-digest.ts", function: "sendDailyDigest()", description: "Uses getResendClient() directly for admin digest emails." },
    { file: "server/repair-mailer.ts", function: "sendRepairAlert()", description: "Uses getResendClient() directly for repair system alerts." },
  ];

  lines.push("### Defined Helpers");
  lines.push("");
  lines.push("| File | Function | Description |");
  lines.push("|---|---|---|");
  for (const h of helpers) lines.push(`| \`${h.file}\` | \`${h.function}\` | ${h.description} |`);

  lines.push("");

  const routesSrc = readFile(path.resolve("server/routes.ts"));
  const inlineResendCalls = findLines(routesSrc, /getResendClient\(\)/);
  const retryUsage = findLines(routesSrc, /sendEmailWithRetry/);

  lines.push("### Usage in routes.ts");
  lines.push("");
  lines.push(`- Inline \`getResendClient()\` calls (no retry): **${inlineResendCalls.length}** at lines ${inlineResendCalls.map(l => l.line).join(", ")}`);
  lines.push(`- \`sendEmailWithRetry()\` calls (with retry): **${retryUsage.length}** at lines ${retryUsage.map(l => l.line).join(", ") || "none"}`);
  lines.push("");
  if (inlineResendCalls.length > retryUsage.length) {
    lines.push("> **Duplication:** `sendEmailWithRetry` exists but most call sites bypass it with direct `getResendClient()` + `resend.emails.send()` — no retry logic.");
  }

  return lines;
}

function analyzeIpExtraction(): string[] {
  const lines: string[] = [];

  lines.push("## 7) IP Extraction (req.ip / x-forwarded-for)");
  lines.push("");

  const serverFiles = ["server/routes.ts", "server/middleware.ts", "server/legal-system.ts"];
  const sites: IpExtractionSite[] = [];

  for (const f of serverFiles) {
    const src = readFile(path.resolve(f));
    const srcLines = src.split("\n");

    for (let i = 0; i < srcLines.length; i++) {
      const line = srcLines[i];
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

      if (/resolveClientIp/.test(line) && f !== "server/middleware.ts") {
        sites.push({ file: f, line: i + 1, pattern: "resolveClientIp(req)", category: "resolveClientIp" });
      } else if (/req\.ip\b/.test(line)) {
        sites.push({ file: f, line: i + 1, pattern: "req.ip", category: "req.ip" });
      } else if (/x-forwarded-for/.test(line) && !/resolveClientIp/.test(line) && f !== "server/middleware.ts") {
        sites.push({ file: f, line: i + 1, pattern: line.trim().substring(0, 80), category: "manual-xff" });
      }
    }
  }

  const reqIpSites = sites.filter(s => s.category === "req.ip");
  const manualSites = sites.filter(s => s.category === "manual-xff");
  const helperSites = sites.filter(s => s.category === "resolveClientIp");

  lines.push("### Trust Proxy Status");
  lines.push("");

  const indexSrc = readFile(path.resolve("server/index.ts"));
  const routesSrc = readFile(path.resolve("server/routes.ts"));
  const tpIndex = findLines(indexSrc, /trust proxy/);
  const tpRoutes = findLines(routesSrc, /trust proxy/);

  lines.push("| File | Line | Value |");
  lines.push("|---|---|---|");
  for (const t of tpIndex) {
    const valMatch = t.text.match(/["']trust proxy["']\s*,\s*(\S+)/);
    lines.push(`| \`server/index.ts\` | ${t.line} | \`${valMatch ? valMatch[1] : "?"}\` |`);
  }
  for (const t of tpRoutes) {
    const valMatch = t.text.match(/["']trust proxy["']\s*,\s*(\S+)/);
    lines.push(`| \`server/routes.ts\` | ${t.line} | \`${valMatch ? valMatch[1] : "?"}\` |`);
  }

  if (tpIndex.length > 0 && tpRoutes.length > 0) {
    lines.push("");
    lines.push("> **Warning:** `trust proxy` set twice. The `routes.ts` call overwrites `index.ts`. Final effective value is from routes.ts.");
  }

  lines.push("");
  lines.push("### IP Extraction Patterns");
  lines.push("");
  lines.push("| Pattern | Count | Locations |");
  lines.push("|---|---|---|");
  lines.push(`| \`req.ip\` (Express built-in, trust-proxy aware) | ${reqIpSites.length} | ${reqIpSites.map(s => `\`${path.basename(s.file)}:${s.line}\``).join(", ")} |`);
  lines.push(`| Manual \`x-forwarded-for\` header parsing | ${manualSites.length} | ${manualSites.map(s => `\`${path.basename(s.file)}:${s.line}\``).join(", ")} |`);
  lines.push(`| \`resolveClientIp()\` helper | ${helperSites.length} | ${helperSites.length > 0 ? helperSites.map(s => `\`${path.basename(s.file)}:${s.line}\``).join(", ") : "**not used outside middleware.ts**"} |`);

  lines.push("");
  if (manualSites.length > 0) {
    lines.push(`> **Redundancy:** Since \`trust proxy\` is set, \`req.ip\` already parses \`x-forwarded-for\`. The ${manualSites.length} manual extraction sites are redundant and may return different values in edge cases. \`resolveClientIp()\` exists in middleware.ts but is ${helperSites.length === 0 ? "not used anywhere else" : "rarely used"}.`);
  }

  return lines;
}

function analyzeDrizzleDb(): string[] {
  const lines: string[] = [];

  lines.push("## 8) Drizzle DB Init & Migrations");
  lines.push("");

  const dbSrc = readFile(path.resolve("server/db.ts"));
  const dbLines = dbSrc.split("\n");

  lines.push("**File:** `server/db.ts`");
  lines.push("");

  const poolLine = findLines(dbSrc, /new Pool/);
  const drizzleLine = findLines(dbSrc, /drizzle\(/);
  const schemaImport = findLines(dbSrc, /import.*schema/);

  lines.push("| What | Line | Detail |");
  lines.push("|---|---|---|");
  for (const s of schemaImport) lines.push(`| Schema import | ${s.line} | \`${s.text}\` |`);
  for (const p of poolLine) lines.push(`| Pool created | ${p.line} | \`${p.text}\` |`);
  for (const d of drizzleLine) lines.push(`| Drizzle init | ${d.line} | \`${d.text}\` |`);

  lines.push("");
  lines.push("**Exports:** `pool` (raw Neon Pool), `db` (Drizzle client with schema)");
  lines.push("");

  const pkgSrc = readFile(path.resolve("package.json"));
  const hasDbPush = pkgSrc.includes("db:push");
  const hasMigrateCmd = pkgSrc.includes("db:migrate") || pkgSrc.includes("drizzle-kit migrate");
  const migrationsExist = fs.existsSync(path.resolve("drizzle")) || fs.existsSync(path.resolve("migrations"));

  lines.push("**Migration strategy:**");
  lines.push(`- \`db:push\` script: **${hasDbPush ? "YES" : "NO"}** (drizzle-kit push — schema sync without migration files)`);
  lines.push(`- \`db:migrate\` script: **${hasMigrateCmd ? "YES" : "NO"}**`);
  lines.push(`- Migration files directory: **${migrationsExist ? "EXISTS" : "NONE"}** (no versioned migration history)`);

  return lines;
}

function analyzeTestRunner(): string[] {
  const lines: string[] = [];

  lines.push("## 9) Test Runner");
  lines.push("");

  const pkgSrc = readFile(path.resolve("package.json"));
  const hasVitest = pkgSrc.includes('"vitest"');
  const hasJest = pkgSrc.includes('"jest"');
  const vitestBin = fs.existsSync(path.resolve("node_modules/.bin/vitest"));
  const jestBin = fs.existsSync(path.resolve("node_modules/.bin/jest"));

  if (!hasVitest && !hasJest && !vitestBin && !jestBin) {
    lines.push("**None.** No vitest, no jest. Neither is installed in `node_modules` or listed in `package.json`.");
  } else {
    if (hasVitest || vitestBin) lines.push(`- Vitest: **INSTALLED** (in package.json: ${hasVitest}, binary: ${vitestBin})`);
    if (hasJest || jestBin) lines.push(`- Jest: **INSTALLED** (in package.json: ${hasJest}, binary: ${jestBin})`);
  }

  return lines;
}

function generateReport(): string {
  const now = new Date().toISOString().split("T")[0];

  const sections = [
    analyzeEntryPoint(),
    analyzeQueryClient(),
    analyzeRuntime(),
    analyzeHttpClient(),
    analyzeAuthGuards(),
    analyzeEmailSenders(),
    analyzeIpExtraction(),
    analyzeDrizzleDb(),
    analyzeTestRunner(),
  ];

  let md = `# Miscellaneous Operational Facts

**Generated:** ${now} (auto-generated by \`scripts/audit-misc.ts\`)  
**Purpose:** Phase 0 operational questions — file paths, line numbers, runtime facts

> Run \`npx tsx scripts/audit-misc.ts\` to regenerate this report.

---

`;

  for (const section of sections) {
    md += section.join("\n") + "\n\n---\n\n";
  }

  md += `*No fixes proposed. Report complete. All findings are operational observations.*\n`;

  return md;
}

function main() {
  const report = generateReport();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, report, "utf-8");
  console.log(`[misc-audit] Generated: ${OUTPUT_PATH}`);
}

main();
