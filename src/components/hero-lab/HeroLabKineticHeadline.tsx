"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

interface HeroLabKineticHeadlineProps {
  locale: Locale;
  statement: string;
  variant: "a" | "b" | "c";
  reducedPreview?: boolean;
}

const EN_EMPHASIS = [
  { phrase: "brands", world: "brands" },
  { phrase: "software", world: "systems" },
  { phrase: "intelligent systems", world: "intelligence" },
] as const;

function EnglishStatement({ statement, variant }: { statement: string; variant: "a" | "b" | "c" }) {
  let remaining = statement;
  const parts: ReactNode[] = [];

  for (const { phrase, world } of EN_EMPHASIS) {
    const index = remaining.toLowerCase().indexOf(phrase);
    if (index === -1) continue;
    if (index > 0) parts.push(<span key={`pre-${phrase}`}>{remaining.slice(0, index)}</span>);
    parts.push(
      <span key={phrase} data-kinetic-world={world} className="hero-lab-kinetic__emphasis">
        {remaining.slice(index, index + phrase.length)}
      </span>,
    );
    remaining = remaining.slice(index + phrase.length);
  }
  if (remaining) parts.push(<span key="tail">{remaining}</span>);

  return (
    <span className={`hero-lab-kinetic hero-lab-kinetic--${variant}`} data-hero-lab-kinetic>
      {parts}
    </span>
  );
}

export function HeroLabKineticHeadline({
  locale,
  statement,
  variant,
  reducedPreview = false,
}: HeroLabKineticHeadlineProps) {
  const isArabic = locale === "ar";

  return (
    <h1
      className={`hero-lab-kinetic-headline hero-lab-kinetic-headline--${variant} mt-4 text-4xl leading-[1.15] font-semibold text-balance break-words sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]`}
      data-reduced-preview={reducedPreview ? "1" : "0"}
    >
      {isArabic ? (
        <span
          className={`hero-lab-kinetic hero-lab-kinetic--${variant}`}
          data-hero-lab-kinetic
          dir="auto"
        >
          {statement}
        </span>
      ) : (
        <EnglishStatement statement={statement} variant={variant} />
      )}
    </h1>
  );
}
