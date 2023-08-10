import { colors, denoJson, relative, resolve, transpile } from "./_deps.ts";

export const theme = {
  file: colors.yellow.bold,
  message: colors.white.bold,
  plugin: colors.dim,
};

export function formatSourceFile(fullPath: string) {
  return `${relative("./", fullPath)}`;
}

export async function transpileCode(path: string) {
  const url = new URL(path, import.meta.url);
  const result = await transpile(url, {
    importMap: {
      imports: {
        ...denoJson.scopes["source/"],
        // obsidian: "npm:obsidian",
        // dexie: "npm:dexie",
        // zod: "npm:zod",
      },
    },
    async load(specifier: string) {
      if (specifier.includes("npm:")) {
        return { kind: "external", specifier };
      }

      const content = await Deno.readTextFile(
        specifier.replace("file://", ""),
      );

      return { kind: "module", specifier, content };
    },
  });

  return result.get(url.href);
}

export function getInternalPath(path: string) {
  const sourceScopes = denoJson.scopes["source/"];

  return resolve(sourceScopes[path as keyof typeof sourceScopes]) || "";
}

export function getLocaleEntity(path: string) {
  const startString = "/source/";
  const endString = "/lang/";
  const startIndex = path.indexOf(startString) + startString.length;
  const endIndex = path.indexOf(endString);

  return path.slice(startIndex, endIndex);
}

export function getLocaleCode(path: string) {
  const startIndex = path.lastIndexOf("/") + 1;

  return path.slice(startIndex).replace(".json", "");
}

export function getLocaleVariable(path: string) {
  return `${getLocaleCode(path).replaceAll("-", "_").toUpperCase()}_LITERALS`;
}
