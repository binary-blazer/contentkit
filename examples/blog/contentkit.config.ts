import type { ContentKitConfig } from "contentkit/types";

const config: ContentKitConfig = {
  contentDirPath: "content",
  documentTypes: [
    {
      name: "Post",
      filePathPattern: "posts/*.md",
      fields: {
        title: { type: "string", required: true },
        date: { type: "date", required: true },
      },
    },
  ],
};

export default config;
