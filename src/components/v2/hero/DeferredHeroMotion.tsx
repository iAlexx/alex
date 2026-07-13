"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { MOTION_MEDIA } from "@/components/motion/motion-config";

const OPENING_KEY = "hero-opening-played";

/** Hero cinematic opening — once per session; respects reduced motion. */
export function DeferredHeroMotion() {
  const playedRef = useRef(false);

  useGSAP(
    () => {
      if (playedRef.current) return;
      if (window.matchMedia(MOTION_MEDIA.reduced).matches) {
        document.documentElement.dataset.heroMotion = "static";
        return;
      }

      const stack = document.querySelector<HTMLElement>(".hero-visual-stack");
      const section = document.getElementById("hero");
      if (!stack || !section) return;

      const portrait = stack.querySelector<HTMLElement>("[data-hero-portrait]");
      const frameHost = stack.querySelector<HTMLElement>("[data-builder-frame-host]");
      const fallback = stack.querySelector<HTMLElement>(".hero-builder-frame-fallback");
      const kineticLines = section.querySelectorAll<HTMLElement>("[data-kinetic-line]");
      const kineticMeta = section.querySelectorAll<HTMLElement>(
        "[data-hero-meta], .hero-origin-rail, .hero-cta-row",
      );
      const emphasis = section.querySelectorAll<HTMLElement>("[data-kinetic-emphasis]");

      const skipFullOpen = sessionStorage.getItem(OPENING_KEY) === "1";
      playedRef.current = true;

      if (skipFullOpen) {
        gsap.set([portrait, frameHost, fallback, ...kineticLines, ...kineticMeta], {
          clearProps: "all",
        });
        document.documentElement.dataset.heroMotion = "settled";
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          sessionStorage.setItem(OPENING_KEY, "1");
          document.documentElement.dataset.heroMotion = "settled";
        },
      });

      document.documentElement.dataset.heroMotion = "opening";

      if (fallback) {
        gsap.set(fallback, { opacity: 0, scale: 0.94 });
        tl.to(fallback, { opacity: 1, scale: 1, duration: 0.5 }, 0);
      }

      if (portrait) {
        gsap.set(portrait, { opacity: 0, y: 12, filter: "blur(6px)" });
        tl.to(portrait, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, 0.15);
      }

      if (frameHost) {
        gsap.set(frameHost, { opacity: 0 });
        tl.to(frameHost, { opacity: 1, duration: 0.6 }, 0.35);
      }

      kineticLines.forEach((line, index) => {
        gsap.set(line, { clipPath: "inset(0 100% 0 0)", y: 8 });
        tl.to(line, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.55 }, 0.45 + index * 0.08);
      });

      gsap.set(kineticMeta, { opacity: 0, y: 10 });
      tl.to(kineticMeta, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.85);

      emphasis.forEach((word, index) => {
        const world = word.dataset.kineticEmphasis;
        tl.to(
          word,
          {
            color:
              world === "brands"
                ? "var(--accent-brand)"
                : world === "systems"
                  ? "var(--accent-system)"
                  : world === "intelligence"
                    ? "var(--accent-intel)"
                    : "inherit",
            duration: 0.22,
          },
          1.05 + index * 0.12,
        );
        tl.to(word, { color: "inherit", duration: 0.35 }, 1.25 + index * 0.12);
      });

      tl.to(stack, { "--hero-atmosphere-shift": "1", duration: 0.4 }, 1.1);
    },
    { scope: undefined, dependencies: [] },
  );

  return null;
}
