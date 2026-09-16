import Link from "next/link";

import { PRICING_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * "Simple, warm pricing" section — renders the three tiers from the shared
 * `PRICING_TIERS` constant. The featured tier gets the mauve treatment.
 */
export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
      {/* Section header */}
      <div data-reveal className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Simple, warm pricing
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-warm-text">
          Choose a plan that fits your home. No hidden fees, no cold contracts
          — just a companion that speaks your language.
        </p>
      </div>

      {/* Tier cards */}
      <div data-stagger className="grid gap-8 md:grid-cols-3">
        {PRICING_TIERS.map((tier) => {
          const featured = tier.featured === true;
          return (
            <div
              key={tier.name}
              data-stagger-item
              className={cn(
                "rounded-2xl p-8 transition-shadow duration-300",
                featured
                  ? "bg-accent-mauve text-white shadow-[0_20px_50px_-15px_rgba(122,92,107,0.45)]"
                  : "bg-white shadow-sm hover:shadow-lg"
              )}
            >
              <h3
                className={cn(
                  "text-lg font-bold",
                  featured ? "text-white" : "text-accent-mauve"
                )}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <p className="mt-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span
                  className={cn(
                    "ml-2 text-sm",
                    featured ? "text-white/70" : "text-text-muted"
                  )}
                >
                  {tier.period}
                </span>
              </p>

              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  featured ? "text-white/80" : "text-warm-text"
                )}
              >
                {tier.description}
              </p>

              <Link
                href="/voice"
                className={cn(
                  "mt-6 inline-flex rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105",
                  featured
                    ? "bg-soft-pink text-accent-mauve"
                    : "bg-accent-mauve text-white"
                )}
              >
                Choose {tier.name}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}