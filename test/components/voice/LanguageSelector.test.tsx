import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LanguageSelector } from "@/components/voice/LanguageSelector";
import { LANGUAGES } from "@/lib/languages";

describe("LanguageSelector", () => {
  it("renders all four languages as radios", () => {
    render(<LanguageSelector selected="hi-IN" onSelect={() => {}} />);

    const group = screen.getByRole("radiogroup", { name: "Choose your language" });
    expect(group).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(4);
    // Deviates from default export surface: each label includes the greeting.
    expect(radios[0]).toHaveTextContent("Hindi");
    expect(radios[0]).toHaveTextContent("hi-IN");
  });

  it("marks the selected language as checked", () => {
    render(<LanguageSelector selected="ta-IN" onSelect={() => {}} />);
    expect(screen.getByRole("radio", { name: /Tamil/ })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: /Hindi/ })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("calls onSelect when a language is chosen", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<LanguageSelector selected="hi-IN" onSelect={onSelect} />);

    await user.click(screen.getByRole("radio", { name: /Malayalam/ }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(LANGUAGES[2].code);
  });
});