/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import process from "node:process";
import { globby } from "globby";
import { marked } from "marked";
import matter from "gray-matter";
import { loadConfig } from "@ckjs/utils/load-config";
import type { ContentKitConfig, ParsedContent } from "@ckjs/types";

function generateTypeScriptTypesFile(
  config: ContentKitConfig,
  typesDir: string,
): string {
  const documentTypes = config.documentTypes
    .map(
      (docType) =>
        `export type ${docType.name} = {\n  _id: string;\n  _raw: any;\n  type: '${docType.name}';\n  raw: string;\n  html: string;\n  ${Object.entries(
          docType.fields,
        )
          .map(([fieldName, fieldType]) => {
            let type;
            if (fieldType.type === "date") {
              type = "Date";
            } else if (fieldType.type === "array") {
              type = "string[]";
            } else {
              type = fieldType.type;
            }
            const optional = fieldType.required ? "" : " | undefined";
            return `${fieldName}: ${type}${optional};`;
          })
          .join("\n  ")}\n};`,
    )
    .join("\n\n");

  const documentTypeNames = config.documentTypes
    .map((docType) => `'${docType.name}'`)
    .join(" | ");
  const documentTypesUnion = config.documentTypes
    .map((docType) => docType.name)
    .join(" | ");

  return `// NOTE This file is auto-generated by ContentKit

${documentTypes}

export type DocumentTypes = ${documentTypesUnion};
export type DocumentTypeNames = ${documentTypeNames};

export type DataExports = {
  ${config.documentTypes.map((docType) => `all${docType.name}s: ${docType.name}[]`).join(";\n  ")};
  allDocuments: DocumentTypes[];
};
`;
}

function generateIndexTypesFile(config: ContentKitConfig): string {
  const exports = config.documentTypes
    .map(
      (docType) =>
        `export declare const all${docType.name}s: ${docType.name}[];`,
    )
    .join("\n");

  return `// NOTE This file is auto-generated by ContentKit

import { ${config.documentTypes.map((docType) => docType.name).join(", ")}, DocumentTypes } from './types';

export * from './types';

${exports}

export declare const allDocuments: DocumentTypes[];
`;
}

function determineIndexFileExtension(): string {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fsSync.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(
      fsSync.readFileSync(packageJsonPath, "utf-8"),
    );
    if (packageJson.type === "module") return ".mjs";
    if (packageJson.type === "commonjs") return ".cjs";
  }
  return ".js";
}

export async function build(config: ContentKitConfig) {
  const output: ParsedContent[] = [];
  const cacheDir = path.join(".contentkit", ".cache");
  const generatedDir = path.join(".contentkit", "generated");

  await fs.mkdir(cacheDir, { recursive: true });
  await fs.mkdir(generatedDir, { recursive: true });

  const configNames = [
    "contentkit.config.ts",
    "contentkit.config.js",
    "contentkit.config.mjs",
    "contentkit.config.cjs",
  ];

  let configPath: string | undefined;
  for (const name of configNames) {
    const potentialPath = path.join(process.cwd(), name);
    if (fsSync.existsSync(potentialPath)) {
      configPath = potentialPath;
      break;
    }
  }

  if (!configPath) {
    throw new Error("CONFIG_NOT_FOUND");
  }

  const configStat = fsSync.statSync(configPath);
  const cacheConfigPath = path.join(cacheDir, "config.timestamp");
  let shouldReloadConfig = true;

  if (fsSync.existsSync(cacheConfigPath)) {
    const cachedTimestamp = parseInt(
      fsSync.readFileSync(cacheConfigPath, "utf-8"),
      10,
    );
    shouldReloadConfig = configStat.mtimeMs > cachedTimestamp;
  }

  if (shouldReloadConfig) {
    config = await loadConfig();
    fsSync.writeFileSync(cacheConfigPath, configStat.mtimeMs.toString());
  }

  const documentTypeNames: string[] = [];

  for (const docType of config.documentTypes) {
    documentTypeNames.push(docType.name);

    const files = await globby(docType.filePathPattern, {
      cwd: path.join(process.cwd(), config.contentDirPath),
      absolute: true,
    });

    const docTypeOutput: ParsedContent[] = [];
    for (const file of files) {
      const raw = await fs.readFile(file, "utf-8");
      const { content, data } = matter(raw);
      const html = await marked(content);
      docTypeOutput.push({
        typeName: docType.name,
        ...data,
        raw: content,
        html,
      });
    }

    const cacheFilePath = path.join(cacheDir, `${docType.name}.json`);
    await fs.writeFile(cacheFilePath, JSON.stringify(docTypeOutput, null, 2));

    const docTypeDir = path.join(generatedDir, docType.name);
    await fs.mkdir(docTypeDir, { recursive: true });
    const indexFilePath = path.join(docTypeDir, "_index.json");
    await fs.writeFile(indexFilePath, JSON.stringify(docTypeOutput, null, 2));

    output.push(...docTypeOutput);
  }

  const indexFileContent = generateIndexFile(config, cacheDir);
  const indexFileExtension = determineIndexFileExtension();
  const indexFilePath = path.join(generatedDir, `index${indexFileExtension}`);
  await fs.writeFile(indexFilePath, indexFileContent);

  const typesFileContent = generateTypeScriptTypesFile(config, generatedDir);
  const typesFilePath = path.join(generatedDir, "types.d.ts");
  await fs.writeFile(typesFilePath, typesFileContent);

  const indexTypesFileContent = generateIndexTypesFile(config);
  const indexTypesFilePath = path.join(generatedDir, "index.d.ts");
  await fs.writeFile(indexTypesFilePath, indexTypesFileContent);
}

function generateIndexFile(config: ContentKitConfig, cacheDir: string): string {
  const imports = [];
  const exports = [];
  const allDocuments = [];

  for (const docType of config.documentTypes) {
    const variableName = `all${docType.name}s`;
    const importPath = `./${docType.name}/_index.json`;
    imports.push(
      `import ${variableName} from '${importPath}' with { type: 'json' };`,
    );
    exports.push(`export { ${variableName} };`);
    allDocuments.push(`...${variableName}`);
  }

  return `// NOTE: This file is auto-generated by ContentKit

${imports.join("\n")}

${exports.join("\n")}

export const allDocuments = [${allDocuments.join(", ")}];
`;
}
