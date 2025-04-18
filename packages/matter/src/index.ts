import { parse as yamlParse } from "yaml";
import { parse as tomlParse } from "@iarna/toml";

export function parse(content: string): {
  data: Record<string, any>;
  body: string;
} {
  const delimiter = "---";
  const tomlDelimiter = "\\+\\+\\+";
  const delimiterRegex = new RegExp(
    `^(?:${delimiter}|${tomlDelimiter})\\s*([\\s\\S]*?)\\s*(?:${delimiter}|${tomlDelimiter})\\s*`,
  );

  const match = content.match(delimiterRegex);
  if (!match) {
    throw new Error("INVALID_FRONTMATTER_FORMAT");
  }

  const rawData = match[1].trim();
  const body = content.slice(match[0].length).trim();

  try {
    let data;
    if (content.startsWith(delimiter)) {
      if (rawData.startsWith("{") && rawData.endsWith("}")) {
        data = JSON.parse(rawData); // JSON frontmatter
      } else {
        data = yamlParse(rawData); // YAML frontmatter
      }
    } else if (content.startsWith("+++")) {
      data = tomlParse(rawData); // TOML frontmatter
    } else {
      throw new Error("INVALID_FRONTMATTER_FORMAT");
    }
    return { data, body };
  } catch {
    throw new Error("INVALID_FRONTMATTER_FORMAT");
  }
}
