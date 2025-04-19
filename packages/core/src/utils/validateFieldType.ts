/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { ItemType } from "@ckjs/types";

export function validateFieldType(
  value: any,
  expectedType: string,
  items?: ItemType,
): boolean {
  switch (expectedType) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return value instanceof Date || !isNaN(Date.parse(value));
    case "array":
    case "list":
      if (!Array.isArray(value)) return false;
      if (items) {
        return value.every((item) => validateFieldType(item, items.type));
      }
      return true;
    default:
      return false;
  }
}
