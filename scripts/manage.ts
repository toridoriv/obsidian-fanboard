#!/usr/bin/env -S deno run --allow-all --unstable

import { Command, packageJson } from "./_deps.ts";
import { build } from "./build.ts";

// deno-lint-ignore ban-types
export type ManageOptions = {};

export const manage = new Command<void, void, ManageOptions>()
  .name("manage")
  .description(
    `Command line utility to handle the scripts of ${packageJson.name}.`,
  )
  .action(runManage)
  .command(build.getName(), build);

function runManage(this: Command<void, void, ManageOptions>) {
  this.showHelp();
}

if (import.meta.main) {
  manage.parse(Deno.args);
}
