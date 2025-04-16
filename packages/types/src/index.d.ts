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
  data: Record<string, any>;
};
