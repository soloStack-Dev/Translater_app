import { describe, expect, it } from "vitest";

import { generateMetadata as getHomeMetadata } from "@/app/page";
import { generateMetadata as getFeaturesMetadata } from "@/app/features/page";
import { generateMetadata as getVoiceMetadata } from "@/app/voice/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("SEO — per-page metadata", () => {
  it("every page ships a unique title, description and canonical", () => {
    const pages = [getHomeMetadata(), getFeaturesMetadata(), getVoiceMetadata()];
    const titles = new Set(pages.map((p) => JSON.stringify(p.title)));
    expect(titles.size).toBe(pages.length);

    for (const md of pages) {
      expect(typeof md.description).toBe("string");
      expect((md.description as string).length).toBeGreaterThan(50);
      expect(md.alternates?.canonical).toBeTruthy();
    }
  });

  it("the voice page mentions all four supported languages", () => {
    const md = getVoiceMetadata();
    expect(md.description).toContain("Hindi");
    expect(md.description).toContain("Tamil");
    expect(md.description).toContain("Malayalam");
    expect(md.description).toContain("Kannada");
  });
});

describe("SEO — robots.txt", () => {
  it("allows crawling and points to the sitemap", () => {
    const rules = robots();
    expect(rules.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
    expect(rules.sitemap).toContain("/sitemap.xml");
  });
});

describe("SEO — sitemap.xml", () => {
  it("lists the three public pages with priorities", () => {
    const urls = sitemap();
    expect(urls.map((u) => u.url)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/\/$/),
        expect.stringMatching(/\/features$/),
        expect.stringMatching(/\/voice$/),
      ])
    );
    // Home should be the highest priority page.
    const home = urls.find((u) => u.url.endsWith("/"))!;
    expect(home.priority).toBe(1);
    // URLs must be absolute for the sitemap spec.
    for (const entry of urls) {
      expect(entry.url.startsWith("http")).toBe(true);
    }
  });
});