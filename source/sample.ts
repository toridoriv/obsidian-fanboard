import { type Command, Modal } from "obsidian";

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

export const sampleCommand: Command = {
  name: "Open sample modal",
  id: "open-sample-modal",
  callback() {
    new SampleModal(window.app).open();
  },
};
