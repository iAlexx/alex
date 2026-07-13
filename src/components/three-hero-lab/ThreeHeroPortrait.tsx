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

interface ThreeHeroPortraitProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Workstation portrait — soft dissolve, no hard card border. */
export function ThreeHeroPortrait({ locale, dictionary }: ThreeHeroPortraitProps) {
  const isArabic = locale === "ar";

  return (
    <div
      className={`three-hero-portrait${isArabic ? " three-hero-portrait--ar" : ""}`}
      data-three-hero-portrait
    >
      <picture>
        <source media="(max-width: 639px)" srcSet={MOBILE.src} type="image/webp" />
        <Image
          src={DESKTOP.src}
          alt={dictionary.a11y.heroImageAlt}
          width={DESKTOP.width}
          height={DESKTOP.height}
          priority
          sizes="(max-width: 639px) 88vw, (max-width: 1024px) 68vw, 48vw"
          className="three-hero-portrait__image"
          draggable={false}
        />
      </picture>
      <div aria-hidden className="three-hero-portrait__dissolve" />
      <div
        aria-hidden
        className="three-hero-portrait__dissolve three-hero-portrait__dissolve--vertical"
      />
    </div>
  );
}
