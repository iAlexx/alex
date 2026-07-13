"use client";

import dynamic from "next/dynamic";
import { HeroPortraitPlate } from "@/components/v2/hero/HeroPortraitPlate";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";

const HeroBuilderFrame = dynamic(
  () =>
    import("@/components/v2/hero/HeroBuilderFrame").then((mod) => ({
      default: mod.HeroBuilderFrame,
    })),
  { ssr: false },
);

const DeferredHeroMotion = dynamic(
  () =>
    import("@/components/v2/hero/DeferredHeroMotion").then((mod) => ({
      default: mod.DeferredHeroMotion,
    })),
  { ssr: false },
);

interface HeroVisualStackProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Portrait + Builder Frame depth stack — WebGL deferred after paint. */
export function HeroVisualStack({ locale, dictionary }: HeroVisualStackProps) {
  return (
    <div className="hero-visual-stack relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none lg:justify-self-end">
      <div aria-hidden className="hero-builder-frame-fallback">
        <span className="hero-builder-frame-fallback__module hero-builder-frame-fallback__module--brands" />
        <span className="hero-builder-frame-fallback__module hero-builder-frame-fallback__module--systems" />
        <span className="hero-builder-frame-fallback__module hero-builder-frame-fallback__module--intelligence" />
        <span className="hero-builder-frame-fallback__module hero-builder-frame-fallback__module--security" />
        <span className="hero-builder-frame-fallback__channel hero-builder-frame-fallback__channel--tl" />
        <span className="hero-builder-frame-fallback__channel hero-builder-frame-fallback__channel--tr" />
        <span className="hero-builder-frame-fallback__occluder hero-builder-frame-fallback__occluder--left" />
        <span className="hero-builder-frame-fallback__occluder hero-builder-frame-fallback__occluder--right" />
      </div>

      <div aria-hidden className="hero-visual-stack__atmosphere" />
      <HeroBuilderFrame />
      <HeroPortraitPlate locale={locale} dictionary={dictionary} />
      <DeferredHeroMotion />
    </div>
  );
}
