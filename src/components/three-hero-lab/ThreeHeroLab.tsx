"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { ThreeHeroComposition } from "@/components/three-hero-lab/ThreeHeroComposition";
import type { Dictionary } from "@/content/translations";
import "@/components/home/hero-orbital/orbital-hero.css";
import "@/components/three-hero-lab/three-hero-lab.css";

interface ThreeHeroLabProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Isolated orbital Hero Lab — reference-matched visual language. */
export function ThreeHeroLab({ locale, dictionary }: ThreeHeroLabProps) {
  const lab = dictionary.threeHeroLab;
  const [motionEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  return (
    <div className="three-hero-lab-page">
      <header className="three-hero-lab-header">
        <div className="three-hero-lab-header__top">
          <span className="three-hero-lab-badge">{lab.badge}</span>
          <Link href={`/${locale}`} className="three-hero-lab-header__back">
            {lab.backHome}
          </Link>
        </div>
        <p className="three-hero-lab-header__eyebrow">{lab.title}</p>
        <p className="three-hero-lab-header__desc">{lab.description}</p>
      </header>

      <div className={`${composition.innerWide} ${v2Spacing.hero}`}>
        <ThreeHeroComposition
          locale={locale}
          dictionary={dictionary}
          motionEnabled={motionEnabled}
        />
      </div>
    </div>
  );
}
