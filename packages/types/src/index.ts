/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

export type ContentKitConfig = {
  contentDirPath: string;
  outputFormat: "cjs" | "esm";
  generateTypes: boolean;
  documentTypes: DocumentTypeDefinition[];
};

export type DocumentTypeDefinition = {
  name: string;
  filePathPattern: string;
  fields: Record<string, FieldType>;
};

export type FieldType = {
  type: "string" | "number" | "boolean" | "date" | "array";
  required?: boolean;
};

export type ParsedContent = {
  typeName: string;
  raw: string;
  html: string;
};
