import { describe, expect, it } from "vitest";

import {
  isLanguageCode,
  LANGUAGES,
  type LanguageCode,
} from "@/lib/languages";

describe("languages metadata", () => {
  it("exposes exactly the four supported languages", () => {
    expect(LANGUAGES).toHaveLength(4);
    expect(LANGUAGES.map((l) => l.code)).toEqual([
      "hi-IN",
      "ta-IN",
      "ml-IN",
      "kn-IN",
    ]);
  });

  it("gives every language a greeting and native script", () => {
    for (const lang of LANGUAGES) {
      expect(lang.name).toBeTruthy();
      expect(lang.script).toBeTruthy();
      expect(lang.greeting).toBeTruthy();
    }
  });
});

describe("isLanguageCode type guard", () => {
  it("accepts every supported language code", () => {
    for (const lang of LANGUAGES) {
      expect(isLanguageCode(lang.code)).toBe(true);
    }
  });

  it("rejects unsupported codes and empty strings", () => {
    expect(isLanguageCode("en-US")).toBe(false);
    expect(isLanguageCode("hi")).toBe(false);
    expect(isLanguageCode("")).toBe(false);
    expect(isLanguageCode("fr-FR")).toBe(false);
  });

  it("ties the type guard to the exported union", () => {
    // Compile-time check: isLanguageCode must narrow to LanguageCode.
    const maybe = "hi-IN" as string;
    if (isLanguageCode(maybe)) {
      const code: LanguageCode = maybe;
      expect(code).toBe("hi-IN");
    }
  });
});