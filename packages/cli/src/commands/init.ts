import { Command } from "commander";
import { logger } from "@ckjs/utils/logger";
import fs from "node:fs";
import path from "node:path";
import configTemplate from "../configTemplate";
import { determineConfigFileType } from "../utils/determine-config-file-type";

function createConfigFile(
  configFilePath: string,
  configFileType: "js" | "ts" | "mjs" | "cjs",
  configFileName: string,
) {
  fs.writeFileSync(configFilePath, configTemplate[configFileType], "utf-8");
  logger.success(
    `Default configuration file created: ./${configFileName}`,
    "contentkit",
  );
}

export const initCommand = new Command("init")
  .description("Initialize a new ContentKit configuration")
  .action(() => {
    const configFileType = determineConfigFileType();
    const configFileName = `contentkit.config.${configFileType}`;
    const configFilePath = path.join(process.cwd(), configFileName);

    const configFileExists = fs.existsSync(configFilePath);
    if (configFileExists) {
      logger.error(
        `Configuration file already exists: ./${configFileName}`,
        "contentkit",
      );
      return;
    } else {
      const existingFiles = fs
        .readdirSync(process.cwd())
        .filter(
          (file) =>
            file.startsWith("contentkit.config.") && file !== configFileName,
        );
      if (existingFiles.length > 0) {
        logger.warn(
          `Configuration file already exists with the wrong extension: ${existingFiles.join(", ")}, overwriting...`,
          "contentkit",
        );
        existingFiles.forEach((file) =>
          fs.unlinkSync(path.join(process.cwd(), file)),
        );
        logger.info("Initializing ContentKit configuration...", "contentkit");
        return createConfigFile(configFilePath, configFileType, configFileName);
      } else {
        logger.info("Initializing ContentKit configuration...", "contentkit");
        return createConfigFile(configFilePath, configFileType, configFileName);
      }
    }
  });
