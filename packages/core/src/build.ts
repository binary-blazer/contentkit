import fs from "node:fs/promises";
import matter from "gray-matter";
import path from "node:path";
import process from "node:process";
import { globby } from "globby";
import type { ContentKitConfig, ParsedContent } from "@contentkit/types";

export async function build(config: ContentKitConfig) {
  const output: ParsedContent[] = [];

  for (const docType of config.documentTypes) {
    const files = await globby(docType.filePathPattern, {
      cwd: path.join(process.cwd(), config.contentDirPath),
      absolute: true,
    });

    for (const file of files) {
      const raw = await fs.readFile(file, "utf-8");
      const { data } = matter(raw);
      output.push({ typeName: docType.name, data });
    }
  }

  await fs.mkdir(".contentkit", { recursive: true });
  await fs.writeFile(
    ".contentkit/output.json",
    JSON.stringify(output, null, 2),
  );
}
