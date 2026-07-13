import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { USE_ORBITAL_HERO } from "@/lib/orbital-hero/config";
import { OrbitalHeroSection } from "@/components/home/hero-orbital/OrbitalHeroSection";
import { HeroV2SectionLegacy } from "@/components/v2/HeroV2SectionLegacy";

interface HeroV2SectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Production Hero — orbital portrait (default) or legacy workstation rollback. */
export function HeroV2Section({ locale, dictionary }: HeroV2SectionProps) {
  if (USE_ORBITAL_HERO) {
    return <OrbitalHeroSection locale={locale} dictionary={dictionary} />;
  }
  return <HeroV2SectionLegacy locale={locale} dictionary={dictionary} />;
}
