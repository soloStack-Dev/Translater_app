import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Next/navigation is used by Navbar's active-link detection. Stub
 * `usePathname` to simulate being on a specific route.
 */
vi.mock("next/navigation", () => ({
  usePathname: () => "/voice",
}));

import { Navbar } from "@/components/Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it("shows the brand and all primary links", () => {
    expect(screen.getByRole("link", { name: "Aura AI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voices" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Journal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pricing" })).toBeInTheDocument();
  });

  it("marks the current page for screen readers on /voice", () => {
    const voiceLink = screen.getByRole("link", { name: "Voices" });
    expect(voiceLink).toHaveAttribute("aria-current", "page");
  });

  it("renders a prominent CTA to the voice page", () => {
    expect(screen.getByRole("link", { name: "Try Aura" })).toHaveAttribute(
      "href",
      "/voice"
    );
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    const toggle = screen.getByRole("button", {
      name: "Open navigation menu",
    });

    await user.click(toggle);
    // Expanding sets the correct aria state.
    expect(
      screen.getByRole("button", { name: "Close navigation menu" })
    ).toBeInTheDocument();
    // The dropdown links appear once open.
    expect(screen.getAllByRole("link", { name: "Try Aura" })).toHaveLength(2);

    await user.click(
      screen.getByRole("button", { name: "Close navigation menu" })
    );
    expect(
      screen.getByRole("button", { name: "Open navigation menu" })
    ).toBeInTheDocument();
  });
});