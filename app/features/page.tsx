"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  Armchair,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRevealAnimations } from "@/lib/reveal";

import featureHero from "@/asserts/Feature-asserts/feature-hero-section-image.png";

const pillars = [
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

export default function FeaturesPage() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useRevealAnimations(scopeRef);

  return (
    <div ref={scopeRef} className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="pt-24 pb-12 px-6 lg:px-16 max-w-4xl mx-auto text-center">
          <h1
            data-hero-fade
            className="text-4xl lg:text-5xl font-bold text-[#7A5C6B] tracking-[-0.02em]"
          >
            Redefining Digital Interaction
          </h1>
          <p
            data-hero-fade
            className="mt-6 text-base lg:text-lg text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed"
          >
            Our mission is to create a companion that feels less like software
            and more like a gentle presence. Aura AI blends advanced emotional
            intelligence with comforting design to provide a space where you
            can simply be yourself, supported by intuitive and contextual
            empathy.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6">
          <div data-reveal className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]">
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
          <p className="mt-4 text-sm text-[#9CA3AF] text-center">
            Behind the Voice: Bringing warmth to digital spaces.
          </p>
        </section>

        <section className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">
          <h2
            data-reveal
            className="text-3xl font-bold text-center text-[#7A5C6B] mb-12"
          >
            The Pillars of Aura
          </h2>

          <div data-stagger className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                data-stagger-item
                className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-[#FCE8F0] rounded-full flex items-center justify-center mb-5">
                  <pillar.icon className="w-5 h-5 text-[#7A5C6B]" />
                </div>
                <h3 className="text-xl font-bold text-[#7A5C6B] mt-4">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-[#5C5C5C] leading-relaxed">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 lg:px-16 max-w-6xl mx-auto">
          <div data-stagger className="grid md:grid-cols-2 gap-8">
            <article
              data-stagger-item
              className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-[#FCE8F0] rounded-full flex items-center justify-center mb-5">
                <Armchair className="w-5 h-5 text-[#7A5C6B]" />
              </div>
              <h3 className="text-xl font-bold text-[#7A5C6B]">
                Designed for Comfort
              </h3>
              <p className="mt-3 text-sm text-[#5C5C5C] leading-relaxed">
                Every interaction is soft, unhurried and human. Gentle voices,
                warm pacing and an interface that never rushes you.
              </p>
            </article>

            <article
              data-stagger-item
              className="relative bg-[#F5E6C8] rounded-3xl p-10 overflow-hidden"
            >
              <div className="w-12 h-12 bg-[#FCE8F0] rounded-full flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5 text-[#7A5C6B]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                Privacy as a Standard
              </h3>
              <p className="mt-3 text-sm text-[#5C5C5C] leading-relaxed max-w-sm">
                Your voice stays yours. Conversations are handled with care and
                nothing leaves your home without your say-so.
              </p>
              <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-[#7A5C6B]/10 animate-float pointer-events-none" />
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
