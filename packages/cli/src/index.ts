#!/usr/bin/env node

import { Command } from "commander";
import { buildCommand } from "./commands/build";
import { initCommand } from "./commands/init";
import { validateCommand } from "./commands/validate";
import { readFileSync } from "fs";
import { join } from "path";

const packageJsonPath = join(__dirname, "../package.json");
const { version } = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const program = new Command();

program
  .name("contentkit")
  .description("ContentKit CLI - Manage and build your content")
  .version(version);

program.addCommand(buildCommand);
program.addCommand(initCommand);
program.addCommand(validateCommand);

program.parse(process.argv);
