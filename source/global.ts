import { Fanboard, FanboardSettingTab } from "./fanboard.ts";

declare global {
  export type FanboardPlugin = Fanboard;
  export type FanboardSettingsTab = FanboardSettingTab;

  export interface FanboardSettings {}
}
