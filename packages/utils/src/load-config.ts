/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import path from "node:path";
import process from "node:process";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { transpileModule, ModuleKind } from "typescript";

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
      const content = await fs.readFile(configPath, "utf-8");

      if (name.endsWith(".ts")) {
        const transpiled = transpileModule(content, {
          compilerOptions: { module: ModuleKind.CommonJS },
        }).outputText;
        const module = await importFromString(transpiled, configPath);
        return module.default || module;
      } else {
        const module = await import(pathToFileURL(configPath).href);
        return module.default || module;
      }
    } catch (err) {
      if (
        (err as any).code !== "ENOENT" &&
        (err as any).code !== "ERR_MODULE_NOT_FOUND"
      ) {
        throw err;
      }
      continue;
    }
  }

  throw new Error("CONFIG_NOT_FOUND");
}

async function importFromString(code: string, filename: string): Promise<any> {
  const module = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    code,
  );
  const exports = {};
  const mod = { exports };
  module(exports, require, mod, filename, path.dirname(filename));
  return mod.exports;
}
