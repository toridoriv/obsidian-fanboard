import { type Command, Modal, Setting } from "obsidian";

export class SampleModal extends Modal {
  onOpen() {
    const { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

export class SampleSetting extends Setting {
  tab: FanboardSettingsTab;
  plugin: FanboardPlugin;

  constructor(container: HTMLElement, tab: FanboardSettingsTab) {
    super(container);
    this.tab = tab;
    this.plugin = tab.plugin;

    this.setName("Sample Setting");
    this.setDesc("A setting to show how settings work.");
    this.addText((text) => {
      const input = text.inputEl;

      text.setPlaceholder(this.plugin.settings.sampleSetting);

      input.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          this.plugin.settings.sampleSetting = input.value;

          await this.plugin.saveSettings();

          input.value = "";

          this.tab.display();
        }
      });
    });
  }
}

export const sampleCommand: Command = {
  name: "Open sample modal",
  id: "open-sample-modal",
  callback() {
    new SampleModal(window.app).open();
  },
};

declare global {
  export interface FanboardSettings {
    sampleSetting: string;
  }
}
