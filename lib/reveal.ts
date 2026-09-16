"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect, type RefObject } from "react";

// Register the GSAP plugins once (guard for SSR where `window` is undefined).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** True when the user prefers reduced motion (or the API is unavailable). */
function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scans the given scope once on mount and wires up the site-wide GSAP
 * entrance / scroll / stagger / split-text animations.
 *
 * Markup hints:
 * - `data-hero-fade`        → staggered fade-up on page load (hero content)
 * - `data-reveal`           → fade-up when scrolled into view
 * - `data-stagger`          → children with `data-stagger-item` fade-up in sequence
 * - `data-split-text`       → heading words animate up one by one on scroll
 *
 * Respects `prefers-reduced-motion` and reverts all tween state on unmount.
 */
export function useRevealAnimations<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    // Accessibility: skip animation entirely for reduced-motion users.
    if (prefersReducedMotion()) return;

    // All tweens + ScrollTriggers live inside one context scoped to `scope`,
    // so `ctx.revert()` cleanly kills everything on cleanup.
    const ctx = gsap.context(() => {
      // 1. Hero load-in: fade up staggered children on mount.
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

      // 2. Scroll reveal: fade each [data-reveal] block up as it enters 85%.
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

      // 3. Staggered grids: children of [data-stagger] appear one by one.
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

      // 4. Split-text headlines: words rise into place one by one on scroll.
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