import { Command } from "commander";
import { loadConfig } from "@ckjs/utils/load-config";
import { logger } from "@ckjs/utils/logger";
import process from "node:process";

export const validateCommand = new Command("validate")
  .description("Validate the ContentKit configuration")
  .action(async () => {
    try {
      await loadConfig();
      logger.success("Configuration is valid!", "contentkit");
    } catch (err) {
      logger.error(`Validation failed: ${(err as any).message}`, "contentkit");
      process.exit(1);
    }
  });
