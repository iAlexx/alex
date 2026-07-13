import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";

const PORTRAIT_DESKTOP = {
  src: "/images/alex/alex-portrait-desktop.webp",
  width: 720,
  height: 900,
} as const;

const PORTRAIT_MOBILE = {
  src: "/images/alex/alex-portrait-mobile.webp",
  width: 480,
  height: 615,
} as const;

interface HeroPortraitPlateProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Face-forward portrait integrated into Builder Frame stack. */
export function HeroPortraitPlate({ dictionary }: HeroPortraitPlateProps) {
  return (
    <div className="hero-portrait-plate" data-hero-portrait>
      <picture>
        <source media="(max-width: 639px)" srcSet={PORTRAIT_MOBILE.src} type="image/webp" />
        <Image
          src={PORTRAIT_DESKTOP.src}
          alt={dictionary.a11y.heroImageAlt}
          width={PORTRAIT_DESKTOP.width}
          height={PORTRAIT_DESKTOP.height}
          priority
          sizes="(max-width: 639px) 88vw, (max-width: 1024px) 72vw, 42vw"
          className="hero-portrait-plate__image"
          draggable={false}
        />
      </picture>
      <div aria-hidden className="hero-portrait-plate__rim" />
      <div aria-hidden className="hero-portrait-plate__depth-shadow" />
    </div>
  );
}
