"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Voices", href: "/voice" },
  { label: "Features", href: "/features" },
  { label: "Journal", href: "/#journal" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const target = href.split("#")[0];
    return target === "/" ? pathname === "/" : pathname.startsWith(target);
  };

  const pinkCta = pathname === "/voice";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FDFBF7]/90 backdrop-blur-sm shadow-[0_1px_8px_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      )}
    >
      <nav className="h-[72px] max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#7A5C6B]"
        >
          Aura AI
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#7A5C6B] after:transition-all after:duration-300 hover:text-[#7A5C6B] hover:after:w-full",
                  isActive(link.href)
                    ? "text-[#7A5C6B] after:w-full"
                    : "text-[#5C5C5C] after:w-0"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/voice"
            className={cn(
              "hidden md:inline-flex rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md",
              pinkCta
                ? "bg-[#FCE8F0] text-[#7A5C6B] border border-[#FCE8F0] hover:bg-[#7A5C6B] hover:text-white"
                : "bg-[#7A5C6B] text-white hover:shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
            )}
          >
            Try Aura
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-[#5C5C5C] hover:text-[#7A5C6B] hover:bg-[#FCE8F0]/60 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#F0F0F0] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-[#7A5C6B] bg-[#FCE8F0]/60"
                  : "text-[#5C5C5C] hover:text-[#7A5C6B] hover:bg-[#FDFBF7]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/voice"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#7A5C6B] px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            Try Aura
          </Link>
        </div>
      )}
    </header>
  );
}
