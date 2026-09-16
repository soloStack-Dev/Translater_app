import Image from "next/image";
import Link from "next/link";
import { Mic } from "lucide-react";

import heroImage from "@/asserts/Home-asserts/herosection-image.png";

/**
 * Homepage hero: badge + headline + CTA on the left, floating product image
 * with a "live voice" pill on the right. All interactive parts use `Link` so
 * SEO crawlers can follow them, and the `<h1>` is the page's only H1.
 */
export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:px-16">
      {/* Copy / CTA column */}
      <div className="lg:col-span-7">
        {/* Badge */}
        <p
          data-hero-fade
          className="inline-flex items-center gap-2 rounded-full bg-soft-pink px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-mauve"
        >
          <Mic className="h-3.5 w-3.5" aria-hidden="true" />
          Warmth in Intelligence
        </p>

        {/* Primary headline — single H1 per page (SEO) */}
        <h1
          data-hero-fade
          className="mt-6 text-5xl font-bold leading-tight text-foreground lg:text-6xl"
        >
          Experience <span className="text-accent-mauve">Warmth</span> in
          Intelligence
        </h1>

        <p
          data-hero-fade
          className="mt-6 max-w-md text-lg leading-relaxed text-warm-text"
        >
          Aura AI blends seamless voice interaction with an intuitive, glowing
          interface designed to feel like a natural extension of your home.
        </p>

        {/* Call-to-action buttons */}
        <div data-hero-fade className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/voice"
            className="rounded-full bg-accent-mauve px-8 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-105 hover:shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
          >
            Meet Aura
          </Link>
          <Link
            href="/#journal"
            className="rounded-full border border-line-strong bg-white px-8 py-3 text-sm font-medium text-warm-text transition-transform duration-200 hover:scale-105 hover:shadow-md"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Visual column */}
      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl animate-float">
          <div className="relative aspect-[16/10]">
            <Image
              src={heroImage}
              alt="Aura AI voice assistant glowing softly in a warm living room"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />
          </div>
          {/* Live indicator pill */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-accent-mauve backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-mauve" />
            Live · Voice activity
          </div>
        </div>
      </div>
    </section>
  );
}