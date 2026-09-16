"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Sticky navigation bar.
 *
 * - Solid/backdrop-blurred once the page is scrolled past 24px.
 * - Desktop: inline links + "Try Aura" CTA.
 * - Mobile: hamburger that toggles a dropdown panel.
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll position to style the bar after the user scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/voice" -> true on /voice (and /voice/*); "/" -> true only on the home page.
  const isActive = (href: string) => {
    const target = href.split("#")[0];
    return target === "/" ? pathname === "/" : pathname.startsWith(target);
  };

  // Use the softer pink CTA style when already on the voice page.
  const isVoicePage = pathname === "/voice";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/90 shadow-[0_1px_8px_rgba(0,0,0,0.05)] backdrop-blur-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-16">
        {/* Brand / logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-accent-mauve"
        >
          Aura AI
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-accent-mauve after:transition-all after:duration-300 hover:text-accent-mauve hover:after:w-full",
                  isActive(link.href)
                    ? "text-accent-mauve after:w-full"
                    : "text-warm-text after:w-0"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: CTA + mobile burger */}
        <div className="flex items-center gap-3">
          <Link
            href="/voice"
            className={cn(
              "hidden rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md md:inline-flex",
              isVoicePage
                ? "border border-soft-pink bg-soft-pink text-accent-mauve hover:bg-accent-mauve hover:text-white"
                : "bg-accent-mauve text-white hover:shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
            )}
          >
            Try Aura
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-warm-text transition-colors hover:bg-soft-pink/60 hover:text-accent-mauve md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-line bg-cream/95 px-6 py-4 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-soft-pink text-accent-mauve"
                  : "text-warm-text hover:bg-cream hover:text-accent-mauve"
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/voice"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-accent-mauve px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            Try Aura
          </Link>
        </div>
      )}
    </header>
  );
}