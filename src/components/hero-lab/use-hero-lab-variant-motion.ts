"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

interface HeroLabVariantMotionProps {
  variant: "a" | "b" | "c";
  replayKey: number;
  motionPaused: boolean;
  reducedPreview: boolean;
  rootRef: React.RefObject<HTMLElement | null>;
}

/** Variant-specific kinetic motion — lab only. */
export function useHeroLabVariantMotion({
  variant,
  replayKey,
  motionPaused,
  reducedPreview,
  rootRef,
}: HeroLabVariantMotionProps): void {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    tlRef.current?.kill();
    tlRef.current = null;

    if (reducedPreview || motionPaused) {
      gsap.set(
        root.querySelectorAll(
          "[data-hero-lab-kinetic], [data-hero-lab-meta], [data-hero-lab-origin]",
        ),
        {
          clearProps: "all",
          opacity: 1,
          clipPath: "none",
          y: 0,
        },
      );
      gsap.set(root.querySelectorAll(".hero-lab-spatial__rail, .hero-lab-spatial__signal"), {
        clearProps: "all",
        scaleX: 1,
        opacity: 1,
      });
      return;
    }

    const kinetic = root.querySelector<HTMLElement>("[data-hero-lab-kinetic]");
    const meta = root.querySelectorAll<HTMLElement>("[data-hero-lab-meta]");
    const origin = root.querySelector<HTMLElement>("[data-hero-lab-origin]");
    const portrait = root.querySelector<HTMLElement>(".hero-lab-portrait");
    const canvas = root.querySelector<HTMLElement>(".hero-lab-canvas-host");

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tlRef.current = tl;

    if (variant === "a") {
      if (canvas) gsap.set(canvas, { opacity: 0 });
      if (portrait) gsap.set(portrait, { opacity: 0, scale: 0.96 });
      if (canvas) tl.to(canvas, { opacity: 1, duration: 0.5 }, 0);
      if (portrait) tl.to(portrait, { opacity: 1, scale: 1, duration: 0.65 }, 0.2);
      if (kinetic) {
        gsap.set(kinetic, { clipPath: "inset(0 100% 0 0)", y: 10 });
        tl.to(kinetic, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.55 }, 0.45);
      }
    } else if (variant === "b") {
      if (portrait) gsap.set(portrait, { opacity: 0, z: 0, filter: "blur(4px)" });
      if (canvas) gsap.set(canvas, { opacity: 0 });
      if (canvas) tl.to(canvas, { opacity: 1, duration: 0.7 }, 0);
      if (portrait) tl.to(portrait, { opacity: 1, z: 0, filter: "blur(0px)", duration: 0.8 }, 0.25);
      if (kinetic) {
        gsap.set(kinetic, { opacity: 0, y: 16 });
        tl.to(kinetic, { opacity: 1, y: 0, duration: 0.6 }, 0.5);
      }
    } else {
      if (portrait) gsap.set(portrait, { opacity: 0, scale: 1.04 });
      if (portrait) tl.to(portrait, { opacity: 1, scale: 1, duration: 0.75 }, 0);
      const rails = root.querySelectorAll<HTMLElement>(".hero-lab-spatial__rail");
      const signals = root.querySelectorAll<HTMLElement>(".hero-lab-spatial__signal");
      gsap.set(rails, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(signals, { opacity: 0, scale: 0.8 });
      rails.forEach((rail, i) => {
        tl.to(rail, { scaleX: 1, duration: 0.35 }, 0.35 + i * 0.08);
      });
      signals.forEach((sig, i) => {
        tl.to(sig, { opacity: 1, scale: 1, duration: 0.28 }, 0.4 + i * 0.1);
      });
      if (kinetic) {
        gsap.set(kinetic, { clipPath: "inset(100% 0 0 0)", y: 20 });
        tl.to(kinetic, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65 }, 0.55);
      }
    }

    if (meta.length) {
      gsap.set(meta, { opacity: 0, y: 8 });
      tl.to(meta, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.75);
    }
    if (origin) {
      gsap.set(origin, { opacity: 0 });
      tl.to(origin, { opacity: 1, duration: 0.3 }, 0.9);
    }

    return () => {
      tl.kill();
    };
  }, [variant, replayKey, motionPaused, reducedPreview, rootRef]);
}
