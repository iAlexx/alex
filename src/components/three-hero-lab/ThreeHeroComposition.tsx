import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { OrbitalHeroComposition } from "@/components/home/hero-orbital/OrbitalHeroComposition";
import { ThreeHeroCopy } from "@/components/three-hero-lab/ThreeHeroCopy";

interface ThreeHeroCompositionProps {
  locale: Locale;
  dictionary: Dictionary;
  motionEnabled?: boolean;
}

/** Lab wrapper — shared orbital composition + lab copy motion. */
export function ThreeHeroComposition({
  locale,
  dictionary,
  motionEnabled = true,
}: ThreeHeroCompositionProps) {
  return (
    <OrbitalHeroComposition
      locale={locale}
      dictionary={dictionary}
      motionEnabled={motionEnabled}
      ariaLabel={dictionary.threeHeroLab.heroAria}
      localWebGLRings
      copySlot={
        <ThreeHeroCopy locale={locale} dictionary={dictionary} motionEnabled={motionEnabled} />
      }
    />
  );
}
