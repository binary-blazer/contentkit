import type { ContentKitConfig } from "contentkit/types";

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
        tags: { type: "array", required: true },
      },
    },
  ],
};

export default config;
