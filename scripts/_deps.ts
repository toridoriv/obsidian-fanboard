export { copySync } from "https://deno.land/std@0.193.0/fs/mod.ts";
export { relative } from "https://deno.land/std@0.193.0/path/mod.ts";
export { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.2/ansi/colors.ts";
export { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";
export { nodeResolve } from "npm:@rollup/plugin-node-resolve";
export { type PluginManifest } from "npm:obsidian";
export * as RollupModule from "npm:rollup";
export { default as esbuildPlugin } from "npm:rollup-plugin-esbuild-transform";
export type { SetRequired } from "npm:type-fest";
export { default as packageJson } from "../package.json" assert { type: "json" };
