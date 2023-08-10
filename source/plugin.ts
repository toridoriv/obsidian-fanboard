import { Plugin } from "obsidian";

export class Fanboard extends Plugin {
  onload(): void {
    console.log("loaded");
  }

  onunload(): void {
    console.log("unloaded");
  }
}
