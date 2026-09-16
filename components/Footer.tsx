import Link from "next/link";

import { FOOTER_LINKS } from "@/lib/constants";

/**
 * Footer — a server component (no interactivity).
 * Site-wide secondary navigation lives in a semantic <nav> for crawlers.
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:items-center lg:px-16">
        {/* Brand */}
        <div>
          <p className="text-lg font-bold text-accent-mauve">Aura AI</p>
          <p className="mt-1 text-xs text-text-muted">
            © {new Date().getFullYear()} Aura AI. Crafted with love.
          </p>
        </div>

        {/* Legal / contact links */}
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-accent-mauve"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}