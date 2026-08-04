"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, type RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/**
 * Scans the given scope once on mount and wires up the site-wide
 * gsap entrance / scroll / stagger / split-text animations.
 *
 * Markup hints:
 * - [data-hero-fade]        -> staggered fade-up on page load (hero content)
 * - [data-reveal]           -> fade-up when scrolled into view
 * - [data-stagger]          -> children with [data-stagger-item] fade-up in sequence
 * - [data-split-text]       -> heading words animate up one by one on scroll
 */
export function useRevealAnimations<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          delay: 0.15,
          ease: "power2.out",
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = Array.from(
          group.querySelectorAll("[data-stagger-item]")
        );
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: group, start: "top 82%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-split-text]").forEach((el) => {
        const split = new SplitText(el, {
          type: "words",
          wordsClass: "inline-block",
        });
        gsap.fromTo(
          split.words,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.045,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [ref]);
}
