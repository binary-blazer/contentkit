/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from "node:fs";
import path from "node:path";

const __dirname = path.resolve(path.dirname(""));
const packagesDir = path.join(__dirname, "packages");

const truncatePath = (filePath: string, maxLength: number): string => {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  if (!relativePath.startsWith("packages/")) return relativePath;
  if (relativePath.length <= maxLength) return relativePath;
  const halfLength = Math.floor((maxLength - 3) / 2);
  return `${relativePath.slice(0, halfLength)}...${relativePath.slice(-halfLength)}`;
};

const burnNodeModules = (packageDir: string) => {
  const nodeModulesPath = path.join(packageDir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(
      `${truncatePath(packageDir, 60)}: node_modules not found, skipping...`,
    );
    return;
  }

  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log(`${truncatePath(packageDir, 60)}: node_modules burned!`);
};

const burnAllNodeModules = () => {
  burnNodeModules(__dirname);

  const packageDirs = fs
    .readdirSync(packagesDir)
    .map((dir) => path.join(packagesDir, dir))
    .filter((dir) => fs.statSync(dir).isDirectory());

  for (const packageDir of packageDirs) {
    burnNodeModules(packageDir);
  }

  console.log("All node_modules burned!");
};

const main = () => {
  burnAllNodeModules();
};

main();
