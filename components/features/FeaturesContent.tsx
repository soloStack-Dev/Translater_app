"use client";

import Image from "next/image";
import { useRef } from "react";
import { Armchair, ShieldCheck } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FEATURE_PILLARS } from "@/lib/constants";
import { useRevealAnimations } from "@/lib/reveal";

import featureHero from "@/asserts/Feature-asserts/feature-hero-section-image.png";

/**
 * Features page — this is the "use client" boundary that owns the GSAP scroll
 * effects. `app/features/page.tsx` renders it and adds server-side SEO.
 */
export function FeaturesContent() {
  // One ref for the whole page: gsap reveals every [data-*] element inside it.
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  return (
    <div ref={scopeRef} className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* ---------- 1. Mission hero ---------- */}
        <section className="mx-auto max-w-4xl px-6 pb-12 pt-24 text-center lg:px-16">
          {/* Single H1 per page (SEO) */}
          <h1
            data-hero-fade
            className="text-4xl font-bold tracking-[-0.02em] text-accent-mauve lg:text-5xl"
          >
            Redefining Digital Interaction
          </h1>
          <p
            data-hero-fade
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-warm-text lg:text-lg"
          >
            Our mission is to create a companion that feels less like software
            and more like a gentle presence. Aura AI blends advanced emotional
            intelligence with comforting design to provide a space where you
            can simply be yourself, supported by intuitive and contextual
            empathy.
          </p>
        </section>

        {/* ---------- 2. Cinematic hero image ---------- */}
        <section className="mx-auto max-w-5xl px-6">
          <div
            data-reveal
            className="relative overflow-hidden rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]"
          >
            <div className="relative aspect-[21/9]">
              <Image
                src={featureHero}
                alt="Aura AI voice assistant casting a warm glow over a cosy evening room"
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-text-muted">
            Behind the Voice: Bringing warmth to digital spaces.
          </p>
        </section>

        {/* ---------- 3. The pillars of Aura ---------- */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-16">
          <h2
            data-reveal
            className="mb-12 text-center text-3xl font-bold text-accent-mauve"
          >
            The Pillars of Aura
          </h2>

          <div data-stagger className="grid gap-8 md:grid-cols-3">
            {FEATURE_PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                data-stagger-item
                className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-soft-pink">
                  <pillar.icon
                    className="h-5 w-5 text-accent-mauve"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-xl font-bold text-accent-mauve">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-text">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- 4. Comfort + Privacy cards ---------- */}
        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-16">
          <div data-stagger className="grid gap-8 md:grid-cols-2">
            {/* Comfort card */}
            <article
              data-stagger-item
              className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-soft-pink">
                <Armchair className="h-5 w-5 text-accent-mauve" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-accent-mauve">
                Designed for Comfort
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-warm-text">
                Every interaction is soft, unhurried and human. Gentle voices,
                warm pacing and an interface that never rushes you.
              </p>
            </article>

            {/* Privacy card (beige, with decorative shield watermark) */}
            <article
              data-stagger-item
              className="relative overflow-hidden rounded-3xl bg-soft-beige p-10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-soft-pink">
                <ShieldCheck
                  className="h-5 w-5 text-accent-mauve"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Privacy as a Standard
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-warm-text">
                Your voice stays yours. Conversations are handled with care and
                nothing leaves your home without your say-so.
              </p>
              {/* Decorative watermark — purely visual, hidden from AT/SEO. */}
              <ShieldCheck
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 -right-4 h-32 w-32 animate-float text-accent-mauve/10"
              />
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}