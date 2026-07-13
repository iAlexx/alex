import type { BridgeAccent } from "@/lib/layout/color-continuity";
import { bridgeAccentClass } from "@/lib/layout/color-continuity";
import type { Locale } from "@/lib/i18n/config";
import { humanAnnotationClass } from "@/lib/i18n/locale-classes";

interface BridgeAnnotationProps {
  text: string;
  accent?: BridgeAccent;
}

/** Transitional quote at a world entry edge — integrated with color continuity. */
export function BridgeAnnotation({ text, accent }: BridgeAnnotationProps) {
  const accentClass = accent ? bridgeAccentClass[accent] : "bridge-accent-default";

  return (
    <p
      className={`bridge-annotation bridge-annotation--edge mb-5 max-w-lg border-s-2 ps-4 text-base font-medium ${accentClass}`}
    >
      {text}
    </p>
  );
}

interface HumanAnnotationProps {
  locale: Locale;
  text: string;
}

/** First-person builder note — distinct from headings, readable human voice. */
export function HumanAnnotation({ locale, text }: HumanAnnotationProps) {
  return (
    <p
      className={`human-annotation mt-5 max-w-2xl border-s-2 border-[color-mix(in_srgb,var(--color-electric)_30%,transparent)] ps-4 ${humanAnnotationClass(locale)}`}
    >
      {text}
    </p>
  );
}
