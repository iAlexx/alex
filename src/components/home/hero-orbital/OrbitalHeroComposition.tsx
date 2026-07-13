import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { OrbitalHeroCopy } from "@/components/home/hero-orbital/OrbitalHeroCopy";
import { OrbitalHeroVisual } from "@/components/home/hero-orbital/OrbitalHeroVisual";

interface OrbitalHeroCompositionProps {
  locale: Locale;
  dictionary: Dictionary;
  motionEnabled?: boolean;
  /** Lab-only: pass ThreeHeroCopy for evaluation entrance motion */
  copySlot?: ReactNode;
  /** Lab-only: local WebGL rings on hero visual */
  localWebGLRings?: boolean;
  ariaLabel?: string;
}

/** Approved 40/60 orbital Hero grid — shared by production and lab. */
export function OrbitalHeroComposition({
  locale,
  dictionary,
  motionEnabled = true,
  copySlot,
  ariaLabel,
  localWebGLRings = false,
}: OrbitalHeroCompositionProps) {
  const isArabic = locale === "ar";

  const copyColumn = (
    <div className="orbital-hero-composition__copy">
      {copySlot ?? <OrbitalHeroCopy locale={locale} dictionary={dictionary} />}
    </div>
  );

  const visualColumn = (
    <div className="orbital-hero-composition__visual">
      <OrbitalHeroVisual
        locale={locale}
        dictionary={dictionary}
        motionEnabled={motionEnabled}
        localWebGLRings={localWebGLRings}
      />
    </div>
  );

  return (
    <section
      className={`orbital-hero-composition three-hero-composition${isArabic ? " orbital-hero-composition--ar three-hero-composition--ar" : ""}`}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    >
      {isArabic ? (
        <>
          {visualColumn}
          {copyColumn}
        </>
      ) : (
        <>
          {copyColumn}
          {visualColumn}
        </>
      )}
    </section>
  );
}
