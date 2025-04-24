/** @type {import("contentkit/types").ContentKitConfig} */
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
      computedFields: {
        wordCount: {
          type: "number",
          resolve: (doc) => {
            const content = doc.raw;
            const words = content
              .split(/\s+/)
              .filter((word) => word.length > 0);
            return words.length;
          },
        },
        readingTime: {
          type: "string",
          resolve: (doc) => {
            const content = doc.raw;
            const words = content
              .split(/\s+/)
              .filter((word) => word.length > 0);
            const readingTime = Math.ceil(words.length / 200);
            return `${readingTime} min read`;
          },
        },
      },
    },
  ],
};

export default config;
