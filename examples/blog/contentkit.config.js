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
    },
  ],
};

export default config;
