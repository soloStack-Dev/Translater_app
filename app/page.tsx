"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Mic } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRevealAnimations } from "@/lib/reveal";

import heroImage from "@/asserts/Home-asserts/herosection-image.png";
import journalImageOne from "@/asserts/Home-asserts/subsection-image-one.png";
import journalImageTwo from "@/asserts/Home-asserts/subsection-image-two.png";

const journalPosts = [
  {
    title: "Whispering in Your Language",
    excerpt:
      "How Aura AI learned to speak Hindi, Tamil, Malayalam and Kannada — and why your mother tongue makes every conversation feel closer to home.",
    image: journalImageOne,
    alt: "Warm abstract sound wave illustration",
  },
  {
    title: "Designing a Voice You Can Trust",
    excerpt:
      "Inside the soft edges, gentle pacing and honest design choices that make Aura feel less like software and more like a friend.",
    image: journalImageTwo,
    alt: "Calm, softly lit living room scene",
  },
];

const pricingTiers = [
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

export default function HomePage() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  return (
    <div ref={scopeRef} className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="flex-1">
        <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p
              data-hero-fade
              className="inline-flex items-center gap-2 rounded-full bg-[#FCE8F0] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]"
            >
              <Mic className="w-3.5 h-3.5" />
              Warmth in Intelligence
            </p>
            <h1
              data-hero-fade
              className="mt-6 text-5xl lg:text-6xl font-bold leading-tight text-[#1A1A1A]"
            >
              Experience{" "}
              <span className="text-[#7A5C6B]">Warmth</span> in Intelligence
            </h1>
            <p data-hero-fade className="mt-6 text-lg text-[#5C5C5C] max-w-md">
              Aura AI blends seamless voice interaction with an intuitive,
              glowing interface designed to feel like a natural extension of
              your home.
            </p>
            <div data-hero-fade className="flex gap-4 mt-8">
              <Link
                href="/voice"
                className="rounded-full bg-[#7A5C6B] px-8 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-105 hover:shadow-[0_8px_24px_rgba(122,92,107,0.35)]"
              >
                Meet Aura
              </Link>
              <Link
                href="/#journal"
                className="rounded-full border border-[#E5E5E5] bg-white px-8 py-3 text-sm font-medium text-[#5C5C5C] transition-transform duration-200 hover:scale-105 hover:shadow-md"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-float">
              <div className="aspect-[16/10] relative">
                <Image
                  src={heroImage}
                  alt="Aura AI voice assistant glowing softly in a warm living room"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-[#7A5C6B]">
                <span className="w-2 h-2 rounded-full bg-[#7A5C6B] animate-pulse" />
                Live · Voice activity
              </div>
            </div>
          </div>
        </section>

        <section
          id="journal"
          className="py-20 px-6 lg:px-16 max-w-7xl mx-auto"
        >
          <div
            data-reveal
            className="flex justify-between items-end mb-10"
          >
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              Latest Journal
            </h2>
            <Link
              href="/features"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#7A5C6B] transition-colors hover:text-[#6A4C5B]"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div data-stagger className="grid md:grid-cols-2 gap-8">
            {journalPosts.map((post) => (
              <article
                key={post.title}
                data-stagger-item
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7A5C6B]">
                    Journal
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#5C5C5C] line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#7A5C6B] transition-colors hover:text-[#6A4C5B]"
                  >
                    Read story
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="py-20 px-6 lg:px-16 max-w-7xl mx-auto"
        >
          <div data-reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              Simple, warm pricing
            </h2>
            <p className="mt-3 text-base text-[#5C5C5C] max-w-xl mx-auto">
              Choose a plan that fits your home. No hidden fees, no cold
              contracts — just a companion that speaks your language.
            </p>
          </div>

          <div data-stagger className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                data-stagger-item
                className={`rounded-2xl p-8 transition-shadow duration-300 ${
                  tier.featured
                    ? "bg-[#7A5C6B] text-white shadow-[0_20px_50px_-15px_rgba(122,92,107,0.45)]"
                    : "bg-white shadow-sm hover:shadow-lg"
                }`}
              >
                <h3
                  className={`text-lg font-bold ${
                    tier.featured ? "text-white" : "text-[#7A5C6B]"
                  }`}
                >
                  {tier.name}
                </h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span
                    className={`text-sm ml-2 ${
                      tier.featured ? "text-white/70" : "text-[#9CA3AF]"
                    }`}
                  >
                    {tier.period}
                  </span>
                </p>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    tier.featured ? "text-white/80" : "text-[#5C5C5C]"
                  }`}
                >
                  {tier.description}
                </p>
                <Link
                  href="/voice"
                  className={`mt-6 inline-flex rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    tier.featured
                      ? "bg-[#FCE8F0] text-[#7A5C6B]"
                      : "bg-[#7A5C6B] text-white"
                  }`}
                >
                  Choose {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
