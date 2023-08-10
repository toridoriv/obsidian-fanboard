import { initFanboardNamespace } from "./globals.ts";
import { afterAll, beforeAll, describe, expect, it } from "./tests/deps.ts";
import {
  setLanguageOnLocalStorage,
  unsetLanguageFromLocalStorage,
} from "./tests/tools.ts";

describe("the function `initFanboardNamespace`", () => {
  it("should create the namespace `FanboardPlugin` in the given object", () => {
    const globalObject = {} as typeof globalThis;

    initFanboardNamespace(globalObject);

    expect(globalObject.FanboardPlugin).to.be.an("object");
  });

  it("should have been called with the global object", () => {
    expect(globalThis.FanboardPlugin).to.be.an("object");
  });
});

describe("the value `Literals` in ObsidianFanboardPlugin", () => {
  describe("when the locale storage has an available language assigned", () => {
    beforeAll(() => {
      setLanguageOnLocalStorage(FanboardPlugin.AvailableLanguage.SPANISH);
    });

    afterAll(() => {
      unsetLanguageFromLocalStorage();
    });

    it("should use that one as the current language", () => {
      const globalObject = {} as typeof globalThis;

      initFanboardNamespace(globalObject);

      expect(globalObject.FanboardPlugin.Literals.$metadata.language.code).to.equal(
        FanboardPlugin.AvailableLanguage.SPANISH,
      );
    });
  });

  describe("when the locale storage has an unavailable language assigned", () => {
    beforeAll(() => {
      setLanguageOnLocalStorage("fr");
    });

    afterAll(() => {
      unsetLanguageFromLocalStorage();
    });

    it("should use the default one as the current language", () => {
      const globalObject = {} as typeof globalThis;

      initFanboardNamespace(globalObject);

      expect(globalObject.FanboardPlugin.Literals.$metadata.language.code).to.equal(
        FanboardPlugin.AvailableLanguage.ENGLISH,
      );
    });
  });
});
