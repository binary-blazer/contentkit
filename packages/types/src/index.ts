/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

export type ContentKitConfig = {
  contentDirPath: string;
  documentTypes: DocumentTypeDefinition[];
};

export type DocumentTypeDefinition = {
  name: string;
  filePathPattern: string;
  fields: Record<string, FieldType>;
};

export type FieldType = {
  type: "string" | "number" | "boolean" | "date";
  required?: boolean;
};

export type ParsedContent = {
  typeName: string;
  raw: string;
  html: string;
};
