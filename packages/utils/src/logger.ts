export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  underline: "\x1b[4m",
};

type LogLevel = "info" | "warn" | "error" | "success";

type KnownError = {
  id: string;
  code: string;
  message: string;
  docsUrl?: string;
};

const knownErrors: Record<string, KnownError> = {
  CONFIG_NOT_FOUND: {
    id: "CONFIG_NOT_FOUND",
    code: "E001",
    message: "No contentkit config file found.",
    docsUrl: "https://docs.contentkit.dev/errors#E001",
  },
};

function log(level: LogLevel, message: string, details?: Partial<KnownError>) {
  const levelColors: Record<LogLevel, string> = {
    info: colors.blue,
    warn: colors.yellow,
    error: colors.red,
    success: colors.green,
  };

  const color = levelColors[level];

  console.log(
    `${color}${colors.bold}${level.toUpperCase()}${colors.reset} ${message}${
      details?.code ? ` [${colors.gray}${details.code}${colors.reset}]` : ""
    }`,
  );

  const levelLength = level.toUpperCase().length - 1;

  if (details?.docsUrl) {
    console.log(
      `${" ".repeat(levelLength)}→ ${colors.underline}${details.docsUrl}${colors.reset}`,
    );
  }
}

export const logger = {
  info: (message: string) => log("info", message),
  warn: (message: string) => log("warn", message),
  error: (message: string, errorId?: string) => {
    const knownError = errorId ? knownErrors[errorId] : undefined;
    log("error", knownError?.message || message, knownError);
  },
  success: (message: string) => log("success", message),
};
