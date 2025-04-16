/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const __dirname = path.resolve(path.dirname(""));
const packagesDir = path.join(__dirname, "packages");

const truncatePath = (filePath: string, maxLength: number): string => {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, "/");
  if (!relativePath.startsWith("packages/")) return relativePath;
  if (relativePath.length <= maxLength) return relativePath;
  const halfLength = Math.floor((maxLength - 3) / 2);
  return `${relativePath.slice(0, halfLength)}...${relativePath.slice(-halfLength)}`;
};

const publishPackage = (packageDir: string) => {
  const packageJSONPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJSONPath)) {
    console.log(
      `${truncatePath(packageDir, 60)}: package.json not found, skipping...`,
    );
    return;
  }

  if (!process.env.NPM_TOKEN) {
    console.error(
      `${truncatePath(packageDir, 60)}: NPM_TOKEN is not set, skipping...`,
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
    `${truncatePath(packageDir, 60)}: publishing ${packageName}@${packageVersion}...`,
  );

  try {
    execSync("npm publish --provenance --access public --tag latest", {
      cwd: packageDir,
      env: {
        ...process.env,
        NODE_AUTH_TOKEN: process.env.NPM_TOKEN,
      },
      stdio: "inherit",
    });

    console.log(`${truncatePath(packageDir, 60)}: published successfully`);
  } catch (error) {
    console.error(`${truncatePath(packageDir, 60)}: failed to publish`);
  }
};

const publishAllPackages = () => {
  const packageDirs = fs
    .readdirSync(packagesDir)
    .map((dir) => path.join(packagesDir, dir))
    .filter((dir) => fs.statSync(dir).isDirectory());

  for (const packageDir of packageDirs) {
    publishPackage(packageDir);
  }
};

const main = () => {
  if (!process.env.NPM_TOKEN) {
    console.error(`Error: NPM_TOKEN environment variable is not set.`);
    process.exit(1);
  }

  publishAllPackages();
};

main();
