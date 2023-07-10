import { Plugin } from "obsidian";
import { sampleCommand } from "./sample.ts";

export class Fanboard extends Plugin {
  onload() {
    // Runs whenever the user starts using the plugin in Obsidian.
    console.log("onload");
    this.addCommand(sampleCommand);
  }
  onunload() {
    // Runs when the plugin is disabled. Any resources that your plugin is using
    // must be released here to avoid affecting the performance of Obsidian
    // after your plugin has been disabled.
    console.log("onunload");
  }
}
