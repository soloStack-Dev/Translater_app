import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/reveal", () => ({
  useRevealAnimations: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/voice",
}));

import { VoiceContent } from "@/components/voice/VoiceContent";

describe("VoiceContent (voice page)", () => {
  it("renders one H1 and the four language choices", () => {
    render(<VoiceContent />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Speak in Your Language");

    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByRole("radio", { name: /Hindi/ })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("defaults to the Type-to-Speak panel and only mounts one panel at a time", () => {
    render(<VoiceContent />);
    // Type panel heading visible.
    expect(screen.getByRole("heading", { name: "Type to Speak" })).toBeInTheDocument();
    // Speak panel must NOT be mounted (single input block at a time).
    expect(
      screen.queryByRole("heading", { name: "Speak to Aura" })
    ).not.toBeInTheDocument();
  });

  it("switches to the Speak panel via the segmented toggle", async () => {
    const user = userEvent.setup();
    render(<VoiceContent />);

    await user.click(
      screen.getByRole("button", { name: "Speak to Aura" })
    );

    expect(
      screen.getByRole("heading", { name: "Speak to Aura" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Type to Speak" })
    ).not.toBeInTheDocument();
  });
});