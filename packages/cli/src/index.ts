#!/usr/bin/env node

import { Command } from "commander";
import { buildCommand } from "./commands/build";
import { initCommand } from "./commands/init";
import { validateCommand } from "./commands/validate";

const program = new Command();

program
  .name("contentkit")
  .description("ContentKit CLI - Manage and build your content")
  .version("0.1.0");

program.addCommand(buildCommand);
program.addCommand(initCommand);
program.addCommand(validateCommand);

program.parse(process.argv);
