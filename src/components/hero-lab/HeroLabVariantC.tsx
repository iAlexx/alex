"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { HeroLabCopy } from "@/components/hero-lab/HeroLabCopy";
import { HeroLabPortrait } from "@/components/hero-lab/HeroLabPortrait";
import { useHeroLabVariantMotion } from "@/components/hero-lab/use-hero-lab-variant-motion";

interface HeroLabVariantCProps {
  locale: Locale;
  dictionary: Dictionary;
  device: "desktop" | "mobile";
  replayKey: number;
  motionPaused: boolean;
  reducedPreview: boolean;
}

const WORLD_SIGNALS = [
  { key: "brands", label: "Brands" },
  { key: "systems", label: "Systems" },
  { key: "intelligence", label: "Intelligence" },
  { key: "security", label: "Security" },
] as const;

/** Portrait-centered spatial identity — CSS/SVG rails, no heavy WebGL. */
export function HeroLabVariantC({
  locale,
  dictionary,
  device,
  replayKey,
  motionPaused,
  reducedPreview,
}: HeroLabVariantCProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useHeroLabVariantMotion({ variant: "c", replayKey, motionPaused, reducedPreview, rootRef });

  return (
    <div
      ref={rootRef}
      className={`hero-lab-variant hero-lab-variant--c hero-lab-variant--${device}`}
    >
      <div className="hero-lab-variant__spatial">
        <div className="hero-lab-spatial__visual" aria-hidden>
          <div className="hero-lab-spatial__glow" />
          <span className="hero-lab-spatial__rail hero-lab-spatial__rail--tl" />
          <span className="hero-lab-spatial__rail hero-lab-spatial__rail--tr" />
          <span className="hero-lab-spatial__rail hero-lab-spatial__rail--bl" />
          <span className="hero-lab-spatial__rail hero-lab-spatial__rail--br" />
          {WORLD_SIGNALS.map((w) => (
            <span
              key={w.key}
              className={`hero-lab-spatial__signal hero-lab-spatial__signal--${w.key}`}
            />
          ))}
        </div>

        <HeroLabPortrait mode="workstation" device={device} variant="c" dictionary={dictionary} />

        <div className="hero-lab-variant__copy-overlay">
          <HeroLabCopy
            locale={locale}
            dictionary={dictionary}
            variant="c"
            device={device}
            reducedPreview={reducedPreview}
          />
        </div>
      </div>
    </div>
  );
}
