/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import chokidar from "chokidar";
import { build } from "@ckjs/core/build";
import { loadConfig } from "@ckjs/utils/load-config";
import { logger, colors } from "@ckjs/utils/logger";
import { type NextConfig } from "next";
import path from "node:path";
import { debounce } from "lodash";
import fs from "node:fs";

let isInitialBuildCompleted = false;
let isWithContentkitInitialized = false;
let isBuildInProgress = false;

export function withContentkit(nextConfig: NextConfig) {
  if (!isWithContentkitInitialized) {
    isWithContentkitInitialized = true;

    (async () => {
      const contentkitConfig = await loadConfig();
      const contentDir = path.join(
        process.cwd(),
        contentkitConfig.contentDirPath,
      );
      const cacheDir = path.join(process.cwd(), ".contentkit", ".cache");
      const cacheFile = path.join(cacheDir, "changed-files.json");

      const waitForNextJsReady = new Promise<void>((resolve) => {
        const originalWrite = process.stdout.write;
        process.stdout.write = (chunk: any, ...args: any[]) => {
          const message = chunk.toString();
          if (message.includes("Ready")) {
            resolve();
            process.stdout.write = originalWrite;
          }
          if (message.includes("Creating an optimized production build")) {
            resolve();
            process.stdout.write = originalWrite;
          }
          return originalWrite.call(process.stdout, chunk, ...args);
        };
      });

      await waitForNextJsReady;

      if (!isInitialBuildCompleted) {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }

        const now = Date.now();
        await build(contentkitConfig);
        logger.success(
          `ContentKit build completed [${colors.gray}${formatTime(Date.now() - now)}${colors.reset}]`,
          "next",
        );

        isInitialBuildCompleted = true;
      }

      const changedFiles = new Set<string>();
      const debouncedRebuild = debounce(async () => {
        if (changedFiles.size > 0 && !isBuildInProgress) {
          isBuildInProgress = true;
          const now = Date.now();
          const filesToBuild = [...changedFiles];
          changedFiles.clear();
          await build(contentkitConfig);
          logger.success(
            `ContentKit build completed [${colors.gray}${formatTime(Date.now() - now)}${colors.reset}]`,
            "next",
          );
          fs.writeFileSync(cacheFile, JSON.stringify(filesToBuild), "utf-8");

          const cachedFiles = new Set(
            JSON.parse(fs.readFileSync(cacheFile, "utf-8")),
          );
          filesToBuild.forEach((file) => cachedFiles.delete(file));
          fs.writeFileSync(
            cacheFile,
            JSON.stringify([...cachedFiles]),
            "utf-8",
          );

          isBuildInProgress = false;
        }
      }, 300);

      chokidar
        .watch(`${contentDir}/**/*`, { ignoreInitial: true })
        .on("all", (event, filePath) => {
          const relativePath = path.relative(contentDir, filePath);
          const cachedFiles = fs.existsSync(cacheFile)
            ? new Set(JSON.parse(fs.readFileSync(cacheFile, "utf-8")))
            : new Set();

          if (
            !cachedFiles.has(relativePath) &&
            !changedFiles.has(relativePath)
          ) {
            changedFiles.add(relativePath);
            debouncedRebuild();
          }
        });
    })();
  }

  return nextConfig;
}

function formatTime(ms: number) {
  const miliseconds = ms % 1000;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s ${miliseconds}ms`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s ${miliseconds}ms`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s ${miliseconds}ms`;
  }
  if (seconds > 0) {
    return `${seconds}s ${miliseconds}ms`;
  }
  if (miliseconds > 0) {
    return `${miliseconds}ms`;
  }
  return "0ms";
}
