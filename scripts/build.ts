#!/usr/bin/env -S deno run --allow-all --unstable

import {
  Command,
  copySync,
  esbuildPlugin,
  nodeResolve,
  packageJson,
  type PluginManifest,
  RollupModule,
  type SetRequired,
} from "./_deps.ts";
import { formatSourceFile, theme } from "./_utils.ts";

export type BuildOptions = {
  watch: boolean;
};

// #region 📌 Command
export const build = new Command<void, void, BuildOptions>()
  .name("build")
  .description("Generate the distribution files.")
  .option(
    "-w, --watch",
    "Watch for source code changes and restart process automatically.",
    { default: false },
  )
  .action(runBuild)
  .noExit();

if (import.meta.main) {
  build.parse(Deno.args);
}

async function runBuild(options: BuildOptions) {
  const buildOptions = getBuildOptions();

  buildOptions.plugins.push(
    generateLogPlugin(),
    nodeResolve(),
    esbuildTransformPlugin(),
    generateManifestPlugin(),
    copyAssetsPlugin(),
    generateExamplePlugin(),
  );

  if (options.watch) {
    const watcher = RollupModule.watch({
      ...buildOptions,
      watch: getWatchOptions(),
    });
    const onSigInt = async () => {
      console.log("\nSignal received. Closing watcher...");

      await watcher.close();
      Deno.exit(0);
    };

    Deno.addSignalListener("SIGINT", onSigInt);
  } else {
    const bundle = await RollupModule.rollup(buildOptions);

    await bundle.write(buildOptions.output);
  }
}

// #endregion 📌 Command

// #region 📌 Build Settings

function getBuildOptions() {
  interface BuildOptions
    extends SetRequired<RollupModule.RollupOptions, "input" | "plugins"> {
    plugins: RollupModule.Plugin[];
    output: RollupModule.OutputOptions;
  }

  const input = packageJson.config.input.dir + packageJson.config.input.file;
  const outputFile = packageJson.config.output.dir +
    packageJson.config.output.file;

  const options: BuildOptions = {
    input,
    logLevel: "debug",
    output: {
      file: outputFile,
      format: packageJson.config.output.format as RollupModule.ModuleFormat,
    },
    plugins: [],
    external: ["obsidian"],
  };

  return options;
}

function getWatchOptions(): RollupModule.WatcherOptions {
  return {
    buildDelay: 10,
    clearScreen: true,
    skipWrite: false,
  };
}

// #endregion 📌 Build Settings

// #region 📌 Plugins

function generateLogPlugin(): RollupModule.Plugin {
  return {
    name: "log-plugin",
    onLog(_level, log) {
      const plugin = theme.plugin(`(${log.plugin} plugin)`);

      console.debug(`${plugin} ${log.message}`);

      return false;
    },
  };
}

function generateManifestPlugin(): RollupModule.Plugin {
  const manifest: PluginManifest = {
    id: packageJson.name,
    name: packageJson.config.displayName,
    author: packageJson.author.name,
    version: packageJson.version,
    description: packageJson.description,
    minAppVersion: packageJson.config.obsidian.minAppVersion,
    isDesktopOnly: packageJson.config.isDesktopOnly,
    authorUrl: packageJson.author.url,
  };

  const asset: RollupModule.EmittedAsset = {
    type: "asset",
    name: "manifest",
    fileName: packageJson.config.output.assets.manifest,
    source: JSON.stringify(manifest, null, 2),
  };

  return {
    name: "generate-manifest",
    generateBundle() {
      this.debug("Generating manifest...");
      this.emitFile(asset);
    },
  };
}

function copyAssetsPlugin(): RollupModule.Plugin {
  const stylesPath = packageJson.config.input.assets.dir +
    packageJson.config.output.assets.styles;

  const asset: RollupModule.EmittedAsset = {
    type: "asset",
    name: "styles",
    fileName: packageJson.config.output.assets.styles,
    source: Deno.readTextFileSync(stylesPath),
  };

  return {
    name: "copy-assets",
    generateBundle() {
      this.debug("Copying assets");
      this.emitFile(asset);
    },
  };
}

function esbuildTransformPlugin(): RollupModule.Plugin {
  type EsbuildTransform =
    typeof import("npm:rollup-plugin-esbuild-transform").default;

  const esbuild = esbuildPlugin as unknown as EsbuildTransform;
  const rawPlugin = esbuild({
    include: /\.ts?$/,
    legalComments: "inline",
    loader: "ts",
    exclude: ["obsidian"],
  });
  const resolveId = rawPlugin
    .resolveId as unknown as RollupModule.ResolveIdHook;
  const transform = rawPlugin
    .transform as unknown as RollupModule.TransformHook;
  const renderChunk = rawPlugin
    .renderChunk as unknown as RollupModule.RenderChunkHook;

  return {
    name: rawPlugin.name,
    resolveId,
    transform(code, id) {
      if (id.includes(".ts")) {
        this.debug(`Transpiling file ${theme.file(formatSourceFile(id))}`);
      }

      return transform.call(this, code, id);
    },
    renderChunk,
  };
}

function generateExamplePlugin(): RollupModule.Plugin {
  return {
    name: "generate-example",
    writeBundle() {
      this.debug("Copying bundled files to example vault...");

      copySync(packageJson.config.output.dir, packageJson.config.example.dir, {
        overwrite: true,
      });
    },
  };
}

// #endregion 📌 Plugins
