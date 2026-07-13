import type { Locale } from "@/lib/i18n/config";

/** Primary body copy — 16px minimum, improved contrast. */
export function bodyTextClass(locale: Locale): string {
  return locale === "ar"
    ? "text-base leading-8 text-pretty text-[color-mix(in_srgb,var(--color-mist)_92%,var(--color-soft))] sm:text-[1.0625rem] sm:leading-9"
    : "text-base leading-relaxed text-pretty text-[color-mix(in_srgb,var(--color-mist)_92%,var(--color-soft))]";
}

/** Supporting copy for intros and explanations. */
export function supportingTextClass(locale: Locale): string {
  return locale === "ar"
    ? "text-[1.0625rem] leading-8 text-[color-mix(in_srgb,var(--color-mist)_95%,var(--color-soft))]"
    : "text-[1.0625rem] leading-relaxed text-[color-mix(in_srgb,var(--color-mist)_95%,var(--color-soft))]";
}

/** First-person builder annotations — visible human voice. */
export function humanAnnotationClass(locale: Locale): string {
  return locale === "ar"
    ? "text-[1.0625rem] leading-8 text-soft"
    : "text-[1.0625rem] leading-relaxed text-soft";
}

/** Compact copy for dense UI areas — still at least 16px. */
export function compactBodyClass(locale: Locale): string {
  return locale === "ar"
    ? "text-base leading-7 text-[color-mix(in_srgb,var(--color-mist)_92%,var(--color-soft))]"
    : "text-base leading-relaxed text-[color-mix(in_srgb,var(--color-mist)_92%,var(--color-soft))]";
}

/** Metadata, eyebrows, and status labels. */
export function metadataTextClass(locale: Locale): string {
  return locale === "ar" ? "text-xs leading-6 text-mist" : "text-xs leading-5 text-mist";
}

/** Workflow hints and diagram labels. */
export function hintTextClass(locale: Locale): string {
  return locale === "ar" ? "text-sm leading-6 text-mist" : "text-sm leading-snug text-mist";
}

/** Security stage and framework copy — 15–16px minimum. */
export function securityStageClass(locale: Locale): string {
  return locale === "ar"
    ? "text-[0.9375rem] leading-7 text-[color-mix(in_srgb,var(--color-mist)_95%,var(--color-soft))] sm:text-base sm:leading-8"
    : "text-[0.9375rem] leading-relaxed text-[color-mix(in_srgb,var(--color-mist)_95%,var(--color-soft))] sm:text-base";
}

/** Eyebrow labels: wide tracking in English, natural spacing in Arabic. */
export function eyebrowClass(locale: Locale): string {
  return locale === "ar"
    ? "text-xs font-medium text-electric"
    : "text-xs font-medium tracking-[0.2em] text-electric uppercase";
}

type Accent = "electric" | "amber" | "emerald";

const accentColors: Record<Accent, string> = {
  electric: "text-electric",
  amber: "text-amber-warm",
  emerald: "text-emerald-300",
};

/** Colored section eyebrows (Gymura, Restaurant, Live Products). */
export function accentEyebrowClass(locale: Locale, accent: Accent): string {
  return locale === "ar"
    ? `text-xs font-medium ${accentColors[accent]}`
    : `text-xs font-medium tracking-[0.2em] ${accentColors[accent]} uppercase`;
}

/** Section nav labels (previous/next project) and fact sheet labels. */
export function navLabelClass(locale: Locale): string {
  return locale === "ar"
    ? "text-xs font-medium text-mist"
    : "text-xs font-medium tracking-[0.2em] text-mist uppercase";
}

/** Footer and muted section headings. */
export function mutedLabelClass(locale: Locale): string {
  return navLabelClass(locale);
}

/** Small status badges (e.g. Coming Soon). */
export function badgeClass(locale: Locale): string {
  return locale === "ar"
    ? "rounded-full border border-line px-2 py-0.5 text-[10px]"
    : "rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wide uppercase";
}

/** Long-form case study paragraphs. */
export function caseStudyParagraphClass(locale: Locale): string {
  return locale === "ar"
    ? "mt-4 text-pretty break-words text-mist text-base leading-8 sm:text-[1.0625rem] sm:leading-9"
    : "mt-4 text-pretty break-words text-mist text-base leading-relaxed";
}

/** Case study intro paragraphs (no top margin). */
export function introParagraphClass(locale: Locale): string {
  return locale === "ar"
    ? "text-pretty break-words text-mist text-base leading-8 sm:text-[1.0625rem] sm:leading-9"
    : "text-pretty break-words text-mist text-base leading-relaxed";
}

/** Hero name line above the headline. */
export function heroNameClass(locale: Locale): string {
  return locale === "ar"
    ? "text-sm font-medium text-electric"
    : "text-sm font-medium tracking-[0.25em] text-electric uppercase";
}
