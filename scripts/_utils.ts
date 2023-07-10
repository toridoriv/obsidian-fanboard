import { colors, relative } from "./_deps.ts";

export const theme = {
  file: colors.yellow.bold,
  message: colors.white.bold,
  plugin: colors.dim,
};

export function formatSourceFile(fullPath: string) {
  return `${relative("./", fullPath)}`;
}
