import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/Footer";
import { FOOTER_LINKS } from "@/lib/constants";

describe("Footer", () => {
  beforeEach(() => {
    // Freeze the timestamp so the <p> assertion is stable.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    render(<Footer />);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the brand and current copyright year", () => {
    expect(screen.getByText("Aura AI")).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Aura AI/)).toBeInTheDocument();
  });

  it("renders every footer link with the right target", () => {
    for (const link of FOOTER_LINKS) {
      const el = screen.getByRole("link", { name: link.label });
      expect(el).toHaveAttribute("href", link.href);
    }
  });

  it("wraps the links in a semantic footer navigation", () => {
    // <nav aria-label="Footer"> improves SEO/accessibility discovery.
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
  });
});