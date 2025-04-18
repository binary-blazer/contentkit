export function parse(content: string): {
  data: Record<string, any>;
  body: string;
} {
  const delimiter = "---";
  const delimiterRegex = new RegExp(
    `^${delimiter}\\s*([\\s\\S]*?)\\s*${delimiter}\\s*`,
  );

  const match = content.match(delimiterRegex);
  if (!match) {
    throw new Error("INVALID_FRONTMATTER_FORMAT");
  }

  const rawData = match[1].trim();
  const body = content.slice(match[0].length).trim();

  try {
    const data = rawData.split("\n").reduce(
      (acc, line) => {
        const [key, ...valueParts] = line.split(":");
        if (!key || valueParts.length === 0) {
          throw new Error("INVALID_FRONTMATTER_FORMAT");
        }
        acc[key.trim()] = valueParts.join(":").trim();
        return acc;
      },
      {} as Record<string, any>,
    );
    return { data, body };
  } catch {
    throw new Error("INVALID_FRONTMATTER_FORMAT");
  }
}
