import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Not needed per-file: the reveal hook only adds GSAP motion. Stub it so page
// tests stay cheap and deterministic (no ScrollTrigger machinery in jsdom).
vi.mock("@/lib/reveal", () => ({
  useRevealAnimations: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { HomeContent } from "@/components/home/HomeContent";

describe("HomeContent (home page)", () => {
  it("renders exactly one H1 with the main selling point", () => {
    render(<HomeContent />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Experience Warmth in Intelligence");
  });

  it("contains the primary SEO keyword in the page text", () => {
    render(<HomeContent />);
    // The meta description keyword should appear in visible copy too.
    expect(screen.getByText(/Aura AI blends seamless voice interaction/)).toBeInTheDocument();
  });

  it("shows journal posts and expects single H2s per section", () => {
    render(<HomeContent />);
    expect(screen.getByRole("heading", { name: "Latest Journal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Simple, warm pricing" })).toBeInTheDocument();
    // Journal card titles render as H3s under the H2s.
    expect(
      screen.getByRole("heading", { name: "Whispering in Your Language" })
    ).toBeInTheDocument();
  });

  it("links the primary CTA to the voice page", () => {
    render(<HomeContent />);
    expect(screen.getByRole("link", { name: "Meet Aura" })).toHaveAttribute(
      "href",
      "/voice"
    );
  });
});