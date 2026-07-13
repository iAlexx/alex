"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { OrbitalCornersSvg, OrbitalPathsSvg } from "@/components/three-hero-lab/OrbitalPathsSvg";
import { ThreeHeroPortrait } from "@/components/three-hero-lab/ThreeHeroPortrait";
import { useOrbitHeroMotion } from "@/components/three-hero-lab/use-orbit-hero-motion";

interface ThreeHeroOrbitVisualProps {
  locale: Locale;
  dictionary: Dictionary;
  motionEnabled?: boolean;
}

/** Orbital workstation visual — SVG/CSS layers + HTML portrait (reference-matched). */
export function ThreeHeroOrbitVisual({
  locale,
  dictionary,
  motionEnabled = true,
}: ThreeHeroOrbitVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  useOrbitHeroMotion(rootRef, { enabled: motionEnabled });

  return (
    <div
      ref={rootRef}
      className={`orbit-visual orbit-visual--${isArabic ? "ar" : "en"}`}
      data-orbit-visual
    >
      <div className="orbit-visual__bg" aria-hidden />

      <div className="orbit-visual__layer orbit-visual__layer--rear">
        <OrbitalPathsSvg variant="desktop" layer="grid" />
        <OrbitalPathsSvg variant="desktop" layer="rear" />
      </div>

      <div className="orbit-visual__layer orbit-visual__layer--rear-mobile">
        <OrbitalPathsSvg variant="mobile" layer="grid" />
        <OrbitalPathsSvg variant="mobile" layer="rear" />
      </div>

      <div className="orbit-visual__portrait">
        <ThreeHeroPortrait locale={locale} dictionary={dictionary} />
        <div className="orbit-visual__photo-wash" aria-hidden />
      </div>

      <div className="orbit-visual__layer orbit-visual__layer--front">
        <OrbitalPathsSvg variant="desktop" layer="front" />
      </div>

      <div className="orbit-visual__layer orbit-visual__layer--front-mobile">
        <OrbitalPathsSvg variant="mobile" layer="front" />
      </div>

      <div className="orbit-visual__corners-desktop">
        <OrbitalCornersSvg variant="desktop" />
      </div>
      <div className="orbit-visual__corners-mobile">
        <OrbitalCornersSvg variant="mobile" />
      </div>

      <span
        className="orbit-visual__violet-node"
        data-violet-node
        aria-hidden
        style={{ left: "8%", top: "48%" }}
      />
      <span className="orbit-visual__node-line" aria-hidden />

      <div className="orbit-visual__mobile-labels" aria-hidden>
        <div className="orbit-visual__world-label orbit-visual__world-label--intel">
          <span className="orbit-visual__world-dot orbit-visual__world-dot--violet" />
          <span>INTELLIGENCE</span>
        </div>
        <div className="orbit-visual__world-label orbit-visual__world-label--secure">
          <span className="orbit-visual__world-dot orbit-visual__world-dot--cyan" />
          <span>SECURELY</span>
        </div>
      </div>

      <p className="orbit-visual__scroll-hint" aria-hidden>
        SCROLL
      </p>

      <div className="orbit-visual__system-badge">
        <span className="orbit-visual__system-dot" aria-hidden />
        <span>ALEX • IN THE SYSTEM</span>
      </div>
    </div>
  );
}
