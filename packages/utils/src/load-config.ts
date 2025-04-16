import path from "node:path";
import { pathToFileURL } from "node:url";
import process from "node:process";

export async function loadConfig(): Promise<any> {
  const configNames = [
    "contentkit.config.ts",
    "contentkit.config.js",
    "contentkit.config.mjs",
    "contentkit.config.cjs",
  ];

  const root = process.cwd();

  for (const name of configNames) {
    const configPath = path.join(root, name);
    try {
      const module = await import(pathToFileURL(configPath).href);
      return module.default || module;
    } catch (err) {
      continue;
    }
  }

  throw new Error("No contentkit config found");
}
