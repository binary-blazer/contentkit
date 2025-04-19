/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { type DocumentTypeDefinition } from "./DocumentTypeDefinition";

export type ContentKitConfig = {
  contentDirPath: string;
  outputFormat: "cjs" | "esm";
  generateTypes: boolean;
  documentTypes: DocumentTypeDefinition[];
};
