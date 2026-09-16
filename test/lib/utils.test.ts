import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn (class-name utility)", () => {
  it("merges conditional classes, dropping falsy values", () => {
    // "px-2" is kept, legend is dropped, "px-4" (last) wins the px conflict.
    expect(cn("px-2", false, undefined, null, "px-4")).toBe("px-4");
  });

  it("keeps unique classes from multiple arguments", () => {
    expect(cn("text-sm", "text-warm-text", "mt-4")).toBe(
      "text-sm text-warm-text mt-4"
    );
  });

  it("returns an empty string when nothing is passed", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false)).toBe("");
  });

  it("lets trailing utility classes override earlier ones", () => {
    // tailwind-merge dedupes: the later "rounded-full" wins over "rounded-xl".
    expect(cn("rounded-xl", "rounded-full")).toBe("rounded-full");
  });
});