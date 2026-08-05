"use client";

import { cn } from "@/lib/utils";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";

type Props = {
  selected: LanguageCode;
  onSelect: (code: LanguageCode) => void;
};

// Radio-style grid of the four supported languages.
// Selecting a language updates the panel that shares it.
export function LanguageSelector({ selected, onSelect }: Props) {
  return (
    <div
      data-hero-fade
      className="mt-10 grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Choose your language"
    >
      {LANGUAGES.map((lang) => {
        const active = lang.code === selected;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5C6B]",
              active
                ? "bg-[#7A5C6B] text-white shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
                : "bg-white/80 border border-[#E5E5E5] text-[#5C5C5C] hover:border-[#7A5C6B]/40 hover:shadow-md"
            )}
          >
            <span className="block text-sm font-semibold">{lang.name}</span>
            <span
              className={cn(
                "mt-0.5 block text-xs",
                active ? "text-white/80" : "text-[#9CA3AF]"
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
