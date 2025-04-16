/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fs from "fs";
import * as path from "path";
import { colors } from "../packages/utils/distribution/logger";

const __dirname = path.resolve(path.dirname(""));

const COPYRIGHT_NOTICE = `/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

`;

const IGNORED_DIRS = [
  "node_modules",
  ".git",
  "examples",
  "distribution",
  "cli",
];
const VALID_EXTENSIONS = [".ts"];

function addCopyrightToFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  if (content.startsWith(COPYRIGHT_NOTICE)) {
    console.log(
      `${colors.yellow}Skipping${colors.reset} ${colors.gray}${filePath}${colors.reset}, copyright notice already present.`,
    );
    return;
  }

  const updatedContent = COPYRIGHT_NOTICE + content;
  fs.writeFileSync(filePath, updatedContent, "utf-8");
  console.log(
    `${colors.green}Added${colors.reset} copyright notice to ${colors.gray}${filePath}${colors.reset}`,
  );
}

function processDirectory(directory: string) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (VALID_EXTENSIONS.includes(ext)) {
        addCopyrightToFile(fullPath);
      }
    }
  }
}

function main() {
  const projectRoot = path.resolve(__dirname);
  processDirectory(projectRoot);
}

main();
