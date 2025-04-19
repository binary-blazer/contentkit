import fs from "node:fs";
import path from "node:path";
import { logger } from "@ckjs/utils/logger";

export function determineConfigFileType(): "js" | "ts" | "mjs" | "cjs" {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      if (packageJson.type === "module") {
        return "mjs";
      }

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      if (dependencies.typescript) {
        return "ts";
      }
    } catch (err) {
      logger.warn(
        "Failed to read package.json. Defaulting to 'js'.",
        "contentkit",
      );
    }
  }

  return "js";
}
