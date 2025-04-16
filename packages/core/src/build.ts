import fs from "node:fs/promises";
import matter from "gray-matter";
import path from "node:path";
import process from "node:process";
import { globby } from "globby";
import type { ContentKitConfig, ParsedContent } from "@contentkit/types";
import { FieldType } from "@contentkit/types";

function generateTypeScriptType(docTypeName: string, fields: Record<string, FieldType>): string {
  const fieldsString = Object.entries(fields)
    .map(([fieldName, fieldType]) => {
      const type = fieldType.type;
      const required = fieldType.required ? "" : " | undefined";
      return `  ${fieldName}: ${type === "date" ? "Date" : type}${required};`;
    })
    .join("\n");

  return `export type ${docTypeName} = {\n${fieldsString}\n};`;
}

export async function build(config: ContentKitConfig) {
  const output: ParsedContent[] = [];
  const cacheDir = path.join(".contentkit", ".cache");
  const generatedDir = path.join(".contentkit", "generated");
  const typesDir = path.join(generatedDir, "types");

  await fs.mkdir(cacheDir, { recursive: true });
  await fs.mkdir(generatedDir, { recursive: true });
  await fs.mkdir(typesDir, { recursive: true });

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
      const { data } = matter(raw);
      docTypeOutput.push({ typeName: docType.name, data });
    }

    const cacheFilePath = path.join(cacheDir, `${docType.name}.json`);
    await fs.writeFile(cacheFilePath, JSON.stringify(docTypeOutput, null, 2));

    const docTypeDir = path.join(generatedDir, docType.name);
    await fs.mkdir(docTypeDir, { recursive: true });
    const indexFilePath = path.join(docTypeDir, "_index.json");
    await fs.writeFile(indexFilePath, JSON.stringify(docTypeOutput, null, 2));

    const typeDefinition = generateTypeScriptType(docType.name, docType.fields);
    const typeFilePath = path.join(typesDir, `${docType.name}.d.ts`);
    await fs.writeFile(typeFilePath, typeDefinition);

    output.push(...docTypeOutput);
  }

  const enumContent = `export enum DocumentTypeNames {\n${documentTypeNames
    .map((name) => `  ${name} = "${name}",`)
    .join("\n")}\n}`;
  await fs.writeFile(path.join(typesDir, "DocumentTypeNames.d.ts"), enumContent);
}