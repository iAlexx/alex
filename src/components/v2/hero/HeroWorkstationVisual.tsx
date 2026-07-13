import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";

const DESKTOP = {
  src: "/images/alex/alex-workstation-desktop.webp",
  width: 960,
  height: 831,
} as const;

const MOBILE = {
  src: "/images/alex/alex-workstation-mobile.webp",
  width: 640,
  height: 517,
} as const;

interface HeroWorkstationVisualProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Workstation centerpiece — soft edge blend, no frame objects (static polish). */
export function HeroWorkstationVisual({ locale, dictionary }: HeroWorkstationVisualProps) {
  const isArabic = locale === "ar";

  return (
    <div
      className={`hero-static__visual${isArabic ? " hero-static__visual--ar" : ""}`}
      data-hero-visual
    >
      <div aria-hidden className="hero-static__visual-bg" />
      <div aria-hidden className="hero-static__visual-warm" />
      <div aria-hidden className="hero-static__visual-rim" />
      <div aria-hidden className="hero-static__visual-vignette" />

      <div className="hero-static__visual-frame">
        <picture>
          <source media="(max-width: 639px)" srcSet={MOBILE.src} type="image/webp" />
          <Image
            src={DESKTOP.src}
            alt={dictionary.a11y.heroImageAlt}
            width={DESKTOP.width}
            height={DESKTOP.height}
            priority
            sizes="(max-width: 639px) 92vw, (max-width: 1024px) 72vw, 56vw"
            className="hero-static__image"
            draggable={false}
          />
        </picture>
        <div aria-hidden className="hero-static__edge-fade" />
        <div aria-hidden className="hero-static__edge-fade hero-static__edge-fade--bottom" />
        <div aria-hidden className="hero-static__floor-shadow" />
        <div aria-hidden className="hero-static__grain" />
      </div>
    </div>
  );
}
