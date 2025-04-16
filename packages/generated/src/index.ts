import fs from "node:fs/promises";
import path from "node:path";

const GENERATED_DIR = path.join(".contentkit", "generated");

export async function loadGeneratedData(docType: string): Promise<any[]> {
  const indexFilePath = path.join(GENERATED_DIR, docType, "_index.json");
  try {
    const data = await fs.readFile(indexFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if ((err as any).code === "ENOENT") {
      throw new Error(`Generated data for document type "${docType}" not found.`);
    }
    throw err;
  }
}
