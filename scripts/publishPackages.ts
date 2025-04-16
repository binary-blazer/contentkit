import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { colors } from "../packages/utils/distribution/logger";

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
      `${colors.gray}${truncatePath(packageDir, 60)}${colors.reset}: ${colors.red}package.json not found${colors.reset}, skipping...`,
    );
    return;
  }

  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
  const packageName = packageJSON.name;
  const packageVersion = packageJSON.version;

  console.log(
    `${colors.gray}${truncatePath(packageDir, 60)}${colors.reset}: ${colors.yellow}publishing ${packageName}@${packageVersion}${colors.reset}...`,
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

    console.log(
      `${colors.gray}${truncatePath(packageDir, 60)}${colors.reset}: ${colors.green}published successfully${colors.reset}`,
    );
  } catch (error) {
    console.error(
      `${colors.gray}${truncatePath(packageDir, 60)}${colors.reset}: ${colors.red}failed to publish${colors.reset}`,
    );
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
    console.error(
      `${colors.red}Error: NPM_TOKEN environment variable is not set.${colors.reset}`,
    );
    process.exit(1);
  }

  publishAllPackages();
};

main();
