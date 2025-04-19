/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from "node:fs";
import path from "node:path";

const __dirname = path.resolve(path.dirname(""));
const packagesDir = path.join(__dirname, "packages");
const packageJSONPath = path.join(__dirname, "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
const version = packageJSON.version;

const truncatePath = (filePath: string, maxLength: number): string => {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  if (!relativePath.startsWith("packages/")) return relativePath;
  if (relativePath.length <= maxLength) return relativePath;
  const halfLength = Math.floor((maxLength - 3) / 2);
  return `${relativePath.slice(0, halfLength)}...${relativePath.slice(-halfLength)}`;
};

const updateVersionInPackageJSON = (filePath: string) => {
  const packageJSON = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const oldVersion = packageJSON.version;

  const truncatedPath = truncatePath(filePath, 60);

  if (oldVersion === version)
    return console.log(`${truncatedPath}: same version, skipping...`);
  if (oldVersion === undefined)
    return console.log(`${truncatedPath}: version not found, skipping...`);

  packageJSON.version = version;
  fs.writeFileSync(filePath, JSON.stringify(packageJSON, null, 2), "utf-8");

  console.log(`${truncatedPath}: ${oldVersion} -> ${version}`);
};

const updateVersionInAllPackages = () => {
  const packageJSONFiles = fs
    .readdirSync(packagesDir)
    .map((file) => path.join(packagesDir, file, "package.json"));
  packageJSONFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) updateVersionInPackageJSON(filePath);
  });
};

const cliIndexPath = path.join(__dirname, "packages", "cli", "src", "index.ts");

const updateVersionInCLI = () => {
  const cliIndexContent = fs.readFileSync(cliIndexPath, "utf-8");
  const versionRegex = /(program\.version\(\s*['"])([\d.]+)(['"]\s*\))/;
  const match = cliIndexContent.match(versionRegex);

  if (!match) {
    console.log(
      `${truncatePath(cliIndexPath, 60)}: version not found, skipping...`,
    );
    return;
  }

  const oldVersion = match[2];
  if (oldVersion === version) {
    console.log(`${truncatePath(cliIndexPath, 60)}: same version, skipping...`);
    return;
  }

  const updatedContent = cliIndexContent.replace(
    versionRegex,
    `$1${version}$3`,
  );
  fs.writeFileSync(cliIndexPath, updatedContent, "utf-8");

  console.log(`${truncatePath(cliIndexPath, 60)}: ${oldVersion} -> ${version}`);
};

const main = () => {
  updateVersionInAllPackages();
  updateVersionInCLI();
};

main();
