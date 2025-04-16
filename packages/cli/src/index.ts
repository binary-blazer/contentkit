#!/usr/bin/env node
import { build } from "@contentkit/core/build";
import { loadConfig } from "@contentkit/utils/load-config";
import { logger, colors } from "@contentkit/utils/logger";
import process from "node:process";

async function main() {
  try {
    const config = await loadConfig();
    const now = Date.now();
    await build(config);
    logger.success(
      `Content build completed [${colors.gray}${formatTime(Date.now() - now)}${colors.reset}]`,
    );
  } catch (err) {
    logger.error("No contentkit config found", (err as any).message);
    process.exit(1);
  }
}

main();

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
