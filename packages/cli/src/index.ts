#!/usr/bin/env node
import { build } from "@contentkit/core/build";
import { loadConfig } from "@contentkit/utils/load-config";
import process from "node:process";

async function main() {
  const config = await loadConfig();
  await build(config);
  console.log("✅ Content build complete");
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
