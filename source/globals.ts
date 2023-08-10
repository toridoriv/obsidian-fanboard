/**
 * @file Global types and values that will be stored in the global namespace.
 */

import type { Dexie } from "./deps.ts";

import en from "../lang/en.json" assert { type: "json" };
import es from "../lang/es.json" assert { type: "json" };
import pt from "../lang/pt-BR.json" assert { type: "json" };

const AvailableLanguage = Object.freeze({
  ENGLISH: "en",
  SPANISH: "es",
  PORTUGUESE_BR: "pt-BR",
});

const Dictionary = Object.freeze({
  [AvailableLanguage.ENGLISH]: en,
  [AvailableLanguage.SPANISH]: es,
  [AvailableLanguage.PORTUGUESE_BR]: pt,
});

export function initFanboardNamespace<T extends typeof globalThis>(global: T) {
  const appLocale = localStorage.getItem("language");
  const languages = Object.values(AvailableLanguage);
  const isLanguageAvailable = languages.includes(appLocale as FanboardLanguage);
  const currentLang = isLanguageAvailable ? appLocale as FanboardLanguage : "en";

  global.FanboardPlugin = {
    AvailableLanguage,
    Literals: Dictionary[currentLang],
  };
}

initFanboardNamespace(globalThis);

declare global {
  /**
   * Instead of adding a `deno-lint-ignore` directive, use this value
   * to indicate that an any type is expected that way purposely.
   */
  // deno-lint-ignore no-explicit-any
  export type SafeAny = any;

  /**
   * Any possible object. Use only if necessary.
   */
  export type AnyObject = Record<PropertyKey, SafeAny>;

  /**
   * Add here the tables for each entity.
   */
  export interface Database extends Dexie {}

  /**
   * Utility type.
   */
  export type Extends<T, U> = T extends U ? T : never;

  export type FanboardLanguage = typeof AvailableLanguage[keyof typeof AvailableLanguage];

  /**
   * String literals used across the plugin.
   */
  export type FanboardLiterals = typeof en;

  /**
   * Main plugin namespace. All global values should be stored here.
   */
  export interface FanboardPlugin {
    AvailableLanguage: typeof AvailableLanguage;
    /**
     * @see {@link FanboardLiterals}
     */
    Literals: FanboardLiterals;
  }

  /**
   * Generic database table.
   */
  export type Table<T> = Dexie.Table<T, string>;

  /**
   * @namespace
   */
  var FanboardPlugin: FanboardPlugin;

  /**
   * Add here events not tied to specific DOM elements.
   */
  export interface WindowEventMap {}
}
