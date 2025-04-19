/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { type ItemType } from "./ItemType";

export type FieldType =
  | {
      type: "string" | "number" | "boolean" | "date";
      required?: boolean;
    }
  | {
      type: "array" | "list";
      required?: boolean;
      items: ItemType;
    };
