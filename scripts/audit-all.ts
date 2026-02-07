import { execSync } from "child_process";
import path from "path";

const scripts = [
  { name: "Schema Audit", file: "scripts/audit-schema.ts" },
  { name: "Domain Model Feasibility", file: "scripts/audit-domain.ts" },
  { name: "UI Binding Audit", file: "scripts/audit-ui-bindings.ts" },
];

console.log("=== NavigatorUSA Audit Suite ===\n");

let passed = 0;
let failed = 0;

for (const script of scripts) {
  try {
    console.log(`Running: ${script.name}...`);
    execSync(`npx tsx ${script.file}`, { stdio: "inherit", cwd: path.resolve(".") });
    passed++;
    console.log("");
  } catch (err) {
    console.error(`FAILED: ${script.name}`);
    console.error(err);
    failed++;
  }
}

console.log(`\n=== Complete: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
