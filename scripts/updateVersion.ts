import fs from "node:fs";
import path from "node:path";
import { colors } from "../packages/utils/distribution/logger";

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
    return console.log(
      `${colors.gray}${truncatedPath}${colors.reset}: ${colors.yellow}same version${colors.reset}, skipping...`,
    );
  if (oldVersion === undefined)
    return console.log(
      `${colors.gray}${truncatedPath}${colors.reset}: ${colors.red}version not found${colors.reset}, skipping...`,
    );

  packageJSON.version = version;
  fs.writeFileSync(filePath, JSON.stringify(packageJSON, null, 2), "utf-8");

  console.log(
    `${colors.gray}${truncatedPath}${colors.reset}: ${colors.green}${oldVersion}${colors.reset} -> ${colors.cyan}${version}${colors.reset}`,
  );
};

const updateVersionInAllPackages = () => {
  const packageJSONFiles = fs
    .readdirSync(packagesDir)
    .map((file) => path.join(packagesDir, file, "package.json"));
  packageJSONFiles.forEach((filePath) => {
    if (fs.existsSync(filePath)) updateVersionInPackageJSON(filePath);
  });
};

const main = () => {
  updateVersionInAllPackages();
};

main();
