/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from "node:fs";
import path from "node:path";

let canaryVersion = "";
const __dirname = path.resolve(path.dirname(""));
const packagesDir = path.join(__dirname, "packages");

const truncatePath = (filePath: string, maxLength: number): string => {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  if (!relativePath.startsWith("packages/")) return relativePath;
  if (relativePath.length <= maxLength) return relativePath;
  const halfLength = Math.floor((maxLength - 3) / 2);
  return `${relativePath.slice(0, halfLength)}...${relativePath.slice(-halfLength)}`;
};

const updateRootPackageVersion = (isCanary: boolean) => {
  const rootPackageJSONPath = path.join(__dirname, "package.json");
  if (!fs.existsSync(rootPackageJSONPath)) {
    console.log("Root package.json not found, skipping...");
    return;
  }

  const rootPackageJSON = JSON.parse(
    fs.readFileSync(rootPackageJSONPath, "utf-8"),
  );
  if (isCanary) {
    rootPackageJSON.version = canaryVersion;
    fs.writeFileSync(
      rootPackageJSONPath,
      JSON.stringify(rootPackageJSON, null, 2),
    );
    console.log(`Root package.json updated to version ${canaryVersion}`);
  }
};

const preparePackages = (packageDir: string, isCanary: boolean) => {
  const packageJSONPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJSONPath)) {
    console.log(
      `${truncatePath(packageDir, 60)}: package.json not found, skipping...`,
    );
    return;
  }

  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
  const packageName = packageJSON.name;
  let packageVersion = packageJSON.version;

  if (isCanary) {
    packageVersion = canaryVersion;
    packageJSON.version = packageVersion;
  }

  const dependencies = packageJSON.dependencies || {};
  const devDependencies = packageJSON.devDependencies || {};

  for (const [depName, depVersion] of Object.entries(dependencies)) {
    if (depName.startsWith("@ckjs/") && depVersion === "workspace:*") {
      dependencies[depName] = `^${packageVersion}`;
    }
  }

  for (const [depName, depVersion] of Object.entries(devDependencies)) {
    if (depName.startsWith("@ckjs/") && depVersion === "workspace:*") {
      devDependencies[depName] = `^${packageVersion}`;
    }
  }

  packageJSON.dependencies = dependencies;
  packageJSON.devDependencies = devDependencies;

  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  const assetsFolder = path.join(__dirname, "assets");
  const assetsDest = path.join(packageDir, "assets");

  if (!fs.existsSync(assetsDest)) {
    fs.mkdirSync(assetsDest, { recursive: true });
  }
  const assetFiles = fs.readdirSync(assetsFolder);
  for (const file of assetFiles) {
    const srcPath = path.join(assetsFolder, file);
    const destPath = path.join(assetsDest, file);
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(
    `${truncatePath(packageDir, 60)}: prepared ${packageName}@${packageVersion}...`,
  );
};

const prepareAllPackages = (isCanary: boolean) => {
  if (isCanary) {
    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
    canaryVersion = `0.1.1-canary.${randomSuffix}`; // Generate the canary version once
  }

  const packageDirs = fs
    .readdirSync(packagesDir)
    .map((dir) => path.join(packagesDir, dir))
    .filter((dir) => fs.statSync(dir).isDirectory());

  for (const packageDir of packageDirs) {
    preparePackages(packageDir, isCanary);
  }

  if (isCanary) {
    updateRootPackageVersion(isCanary);
  }

  console.log("All packages prepared successfully.");
};

const main = () => {
  const isCanary = process.argv.includes("--canary");
  prepareAllPackages(isCanary);
};

main();
