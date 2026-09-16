// =============================================================================
// Shared content/data — keeps pages lean.
//
// All copy that repeats across pages (navigation links, footer links, pricing
// tiers, journal posts, feature pillars) lives here so design updates happen
// in ONE place instead of being scattered inside JSX. Every entry is strongly
// typed so a missing field fails at compile time.
// =============================================================================

import type { LucideIcon } from "lucide-react";
import { HeartHandshake, MessageCircle, Workflow } from "lucide-react";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** Primary links shown in the desktop navbar and the mobile hamburger menu. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Voices", href: "/voice" },
  { label: "Features", href: "/features" },
  { label: "Journal", href: "/#journal" },
  { label: "Pricing", href: "/#pricing" },
];

/** Links in the footer. Placeholder hrefs are used until the real pages exist. */
export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
  { label: "Contact Us", href: "/" },
  { label: "Careers", href: "/" },
];

// ---------------------------------------------------------------------------
// Homepage — pricing tiers
// ---------------------------------------------------------------------------

export type PricingTier = {
  name: string;
  price: string;
  period: string;
  description: string;
  /** Adds the mauve "featured" treatment to the middle card. */
  featured?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For a quiet introduction to your new voice companion.",
  },
  {
    name: "Companion",
    price: "$12",
    period: "per month",
    description: "Everyday conversations across all supported languages.",
    featured: true,
  },
  {
    name: "Family",
    price: "$24",
    period: "per month",
    description: "Personalised voices and shared spaces for the whole home.",
  },
];

// ---------------------------------------------------------------------------
// Features page — the three pillars + two story cards
// ---------------------------------------------------------------------------

export type FeaturePillar = {
  title: string;
  description: string;
  /** Lucide icon rendered inside a soft-pink circle. */
  icon: LucideIcon;
};

export const FEATURE_PILLARS: FeaturePillar[] = [
  {
    title: "Natural Conversations",
    description:
      "Talk to Aura the way you talk to a friend — fluid, code-mixed dialogue that understands context, tone and intent.",
    icon: MessageCircle,
  },
  {
    title: "Emotional Intelligence",
    description:
      "Aura reads the room. It senses when you need calm, a little energy, or simply someone to listen.",
    icon: HeartHandshake,
  },
  {
    title: "Seamless Integration",
    description:
      "From smart-home routines to gentle reminders, Aura weaves quietly into the rhythm of your everyday life.",
    icon: Workflow,
  },
];