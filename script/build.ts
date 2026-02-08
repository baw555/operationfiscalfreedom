import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { rm, readFile } from "fs/promises";
import path from "path";

const allowlist = [
  "@google/generative-ai",
  "pg",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  const isReplit = process.env.REPL_ID !== undefined;
  
  if (isReplit) {
    await viteBuild();
  } else {
    const dirname = path.resolve(process.cwd());
    await viteBuild({
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(dirname, "client", "src"),
          "@shared": path.resolve(dirname, "shared"),
          "@assets": path.resolve(dirname, "attached_assets"),
        },
      },
      css: {
        postcss: {
          plugins: [],
        },
      },
      root: path.resolve(dirname, "client"),
      build: {
        outDir: path.resolve(dirname, "dist/public"),
        emptyOutDir: true,
      },
    });
  }

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));
  
  // Always externalize packages that use createRequire or have ESM/CJS compatibility issues
  const forceExternal = ["pdf-parse"];
  externals.push(...forceExternal);

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
