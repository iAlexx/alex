"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell } from "@/components/v2/JourneyShell";
import { OrbitalHeroComposition } from "@/components/home/hero-orbital/OrbitalHeroComposition";
import "@/components/home/hero-orbital/orbital-hero.css";

interface OrbitalHeroSectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Production orbital portrait Hero — JourneyShell + approved lab visual. */
export function OrbitalHeroSection({ locale, dictionary }: OrbitalHeroSectionProps) {
  const [motionEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  return (
    <JourneyShell
      id="hero"
      spine="origin"
      atmosphere="core"
      spineWaypoint="core"
      className="orbital-hero-shell"
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 orbital-hero-shell__atmosphere${locale === "ar" ? " orbital-hero-shell__atmosphere--ar" : ""}`}
      />

      <div className={`${composition.innerWide} ${v2Spacing.hero}`}>
        <OrbitalHeroComposition
          locale={locale}
          dictionary={dictionary}
          motionEnabled={motionEnabled}
        />
      </div>
    </JourneyShell>
  );
}
