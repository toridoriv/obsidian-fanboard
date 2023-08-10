#!/usr/bin/env -S deno run --allow-all --unstable

import { Command, resolve } from "./_deps.ts";
import { transpileCode } from "./_utils.ts";

export type TranspileOptions = {
  input: string;
  output?: string;
};

export const transpile = new Command<void, void, TranspileOptions>()
  .name("transpile")
  .description("Transforms a TypeScript file into JavaScript.")
  .option("-i, --input <input:string>", "The file to transpile.", {
    required: true,
  })
  .option(
    "-o, --output [output]",
    "Output file. Defaults to a file with the same name, but a `.js` extension.",
  )
  .action(runTranspile)
  .noExit();

if (import.meta.main) {
  transpile.parse(Deno.args);
}

async function runTranspile(options: TranspileOptions) {
  options.input = resolve("./", options.input);

  if (!options.output) {
    options.output = options.input.replace(".ts", ".js");
  }

  const transpiled = await transpileCode(options.input);

  return Deno.writeTextFileSync(options.output, transpiled || "");
}
