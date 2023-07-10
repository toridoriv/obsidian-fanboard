import { App, Plugin, PluginSettingTab } from "obsidian";
import { sampleCommand, SampleSetting } from "./sample.ts";

const DEFAULT_SETTINGS: FanboardSettings = {
  sampleSetting: "",
};

export class FanboardSettingTab extends PluginSettingTab {
  plugin!: Fanboard;

  constructor(app: App, plugin: Fanboard) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();
    new SampleSetting(containerEl, this);
  }
}

export class Fanboard extends Plugin {
  settings!: FanboardSettings;

  async onload() {
    // Runs whenever the user starts using the plugin in Obsidian.
    console.log("onload");
    await this.loadSettings();
    this.addSettingTab(new FanboardSettingTab(this.app, this));
    this.addCommand(sampleCommand);
  }
  onunload() {
    // Runs when the plugin is disabled. Any resources that your plugin is using
    // must be released here to avoid affecting the performance of Obsidian
    // after your plugin has been disabled.
    console.log("onunload");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
