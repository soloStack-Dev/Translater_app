"use client";

import { cn } from "@/lib/utils";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";

type Props = {
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
};

/**
 * Radio-style 2×2 grid of the four supported languages.
 *
 * Accessibility:
 *  - `role="radiogroup"` + `role="radio"` + `aria-checked` so screen readers
 *    announce the group and the active option.
 *  - Each button is keyboard-focusable and responds to Enter/Space.
 */
export function LanguageSelector({ selected, onSelect }: Props) {
  return (
    <div
      data-hero-fade
      className="mt-10 grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Choose your language"
    >
      {LANGUAGES.map((lang) => {
        const isActive = lang.code === selected;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-mauve",
              isActive
                ? "bg-accent-mauve text-white shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
                : "border border-line-strong bg-white/80 text-warm-text hover:border-accent-mauve/40 hover:shadow-md"
            )}
          >
            <span className="block text-sm font-semibold">{lang.name}</span>
            <span
              className={cn(
                "mt-0.5 block text-xs",
                isActive ? "text-white/80" : "text-text-muted"
              )}
            >
              {lang.greeting} · {lang.code}
            </span>
          </button>
        );
      })}
    </div>
  );
}