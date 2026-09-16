import { describe, expect, it } from "vitest";

import { absoluteUrl, buildMetadata, SITE_NAME } from "@/lib/config";

describe("absoluteUrl", () => {
  it("resolves paths against the configured site URL", () => {
    expect(absoluteUrl("/voice")).toMatch(/^https?:\/\/.*\/voice$/);
    // Root becomes the plain base.
    expect(absoluteUrl("/")).toMatch(/^https?:\/\/.*\/?$/);
  });

  it("adds a leading slash when missing", () => {
    expect(absoluteUrl("features")).toMatch(/\/features$/);
  });
});

describe("buildMetadata", () => {
  it("produces a full metadata object with canonical + Open Graph", () => {
    const md = buildMetadata({
      title: "Test Page",
      description: "A test description",
      path: "/voice",
    });

    // Title is unique per page.
    expect(md.title).toEqual({
      absolute: `${SITE_NAME} · Voice Assistant — Test Page`,
    });
    expect(md.description).toBe("A test description");
    // Canonical points back to the page path.
    expect(md.alternates?.canonical).toContain("/voice");
    // Open Graph carries an absolute image URL.
    const images = md.openGraph?.images;
    const first = Array.isArray(images) ? images[0] : images;
    expect(first).toEqual(expect.objectContaining({ width: 1200, height: 630 }));
    // Twitter card configured.
    expect(md.twitter).toEqual(expect.objectContaining({ card: "summary_large_image" }));
  });

  it("bundles site keywords with page keywords", () => {
    const md = buildMetadata({
      title: "X",
      description: "Y",
      keywords: ["voice input"],
    });
    expect(md.keywords).toContain("voice input");
    expect(md.keywords?.length).toBeGreaterThan(1);
  });
});