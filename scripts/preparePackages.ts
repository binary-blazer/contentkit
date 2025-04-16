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

const preparePackages = (packageDir: string) => {
  const packageJSONPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJSONPath)) {
    console.log(
      `${truncatePath(packageDir, 60)}: package.json not found, skipping...`,
    );
    return;
  }

  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
  const packageName = packageJSON.name;
  const packageVersion = packageJSON.version;

  const dependencies = packageJSON.dependencies || {};
  const devDependencies = packageJSON.devDependencies || {};

  for (const [depName, depVersion] of Object.entries({
    ...dependencies,
    ...devDependencies,
  })) {
    if (depName.startsWith("@ckjs/") && depVersion === "workspace:*") {
      dependencies[depName] = packageVersion;
      devDependencies[depName] = packageVersion;
    }
  }

  packageJSON.dependencies = dependencies;
  packageJSON.devDependencies = devDependencies;

  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  console.log(
    `${truncatePath(packageDir, 60)}: prepared ${packageName}@${packageVersion}...`,
  );
};

const prepareAllPackages = () => {
  const packageDirs = fs
    .readdirSync(packagesDir)
    .map((dir) => path.join(packagesDir, dir))
    .filter((dir) => fs.statSync(dir).isDirectory());

  for (const packageDir of packageDirs) {
    preparePackages(packageDir);
  }

  console.log("All packages prepared successfully.");
};

const main = () => {
  prepareAllPackages();
};

main();
