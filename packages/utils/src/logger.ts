/**
 * Copyright (c) Jonas Franke and the ContentKit Contributors
 * SPDX-License-Identifier: BSD-3-Clause
 */

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
    docsUrl: "https://contentkit.dev/docs/errors#E001",
  },
};

function log(
  level: LogLevel,
  message: string,
  mode: "next" | "contentkit" = "contentkit",
  details?: Partial<KnownError>,
) {
  const levelColors: Record<LogLevel, string> = {
    info: colors.blue,
    warn: colors.yellow,
    error: colors.red,
    success: colors.green,
  };

  const nextEmojis: Record<LogLevel, string> = {
    info: "ℹ️",
    warn: "⚠",
    error: "❌",
    success: "✓",
  };

  const color = levelColors[level];

  if (mode === "contentkit") {
    console.log(
      `${color}${colors.bold}${level.toUpperCase()}${colors.reset} ${message}${
        details?.code ? ` [${colors.gray}${details.code}${colors.reset}]` : ""
      }`,
    );
  }

  if (mode === "next") {
    console.log(
      `${" "}${color}${colors.bold}${nextEmojis[level]}${colors.reset} ${message}`,
    );
  }

  const levelLength = level.toUpperCase().length - 1;

  if (details?.docsUrl) {
    console.log(
      `${" ".repeat(levelLength)}→ ${colors.underline}${details.docsUrl}${colors.reset}`,
    );
  }
}

export const logger = {
  info: (message: string, mode: "next" | "contentkit") =>
    log("info", message, mode),
  warn: (message: string, mode: "next" | "contentkit") =>
    log("warn", message, mode),
  error: (message: string, mode: "next" | "contentkit", errorId?: string) => {
    const knownError = errorId ? knownErrors[errorId] : undefined;
    log("error", knownError?.message || message, mode, knownError);
  },
  success: (message: string, mode: "next" | "contentkit") =>
    log("success", message, mode),
};
