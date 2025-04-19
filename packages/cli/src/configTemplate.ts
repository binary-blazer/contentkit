const configTemplate = {
  ts: `import type { ContentKitConfig } from "contentkit/types";

const config: ContentKitConfig = {
contentDirPath: "content",
outputFormat: "esm",
generateTypes: true,
documentTypes: [
  {
    name: "Post",
    filePathPattern: "./*.md",
    fields: {
      title: { type: "string", required: true },
      date: { type: "date", required: true },
      tags: { type: "list", required: true, items: { type: "string" } },
    },
  },
],
};

export default config;
`,
  js: `/** @type {import("contentkit/types").ContentKitConfig} */
const config = {
contentDirPath: "content",
outputFormat: "esm",
generateTypes: true,
documentTypes: [
  {
    name: "Post",
    filePathPattern: "./*.md",
    fields: {
      title: { type: "string", required: true },
      date: { type: "date", required: true },
      tags: { type: "list", required: true, items: { type: "string" } },
    },
  },
],
};

export default config;
`,
  mjs: `/** @type {import("contentkit/types").ContentKitConfig} */
export const config = {
contentDirPath: "content",
outputFormat: "esm",
generateTypes: true,
documentTypes: [
  {
    name: "Post",
    filePathPattern: "./*.md",
    fields: {
      title: { type: "string", required: true },
      date: { type: "date", required: true },
      tags: { type: "list", required: true, items: { type: "string" } },
    },
  },
],
};
`,
  cjs: `/** @type {import("contentkit/types").ContentKitConfig} */
const config = {
contentDirPath: "content",
outputFormat: "esm",
generateTypes: true,
documentTypes: [
  {
    name: "Post",
    filePathPattern: "./*.md",
    fields: {
      title: { type: "string", required: true },
      date: { type: "date", required: true },
      tags: { type: "list", required: true, items: { type: "string" } },
    },
  },
],
};

module.exports = config;
`,
};

export default configTemplate;
