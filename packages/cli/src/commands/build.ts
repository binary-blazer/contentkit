import { Command } from "commander";
import { build } from "@ckjs/core/build";
import { loadConfig } from "@ckjs/utils/load-config";
import { logger, colors } from "@ckjs/utils/logger";
import { formatTime } from "../utils/format-time";
import process from "node:process";

export const buildCommand = new Command("build")
  .description("Build the content using the ContentKit configuration")
  .action(async () => {
    try {
      const config = await loadConfig();
      const now = Date.now();
      await build(config);
      logger.success(
        `Content build completed [${colors.gray}${formatTime(Date.now() - now)}${colors.reset}]`,
        "contentkit",
      );
    } catch (err) {
      logger.error(`Build failed: ${(err as any).message}`, "contentkit");
      process.exit(1);
    }
  });
