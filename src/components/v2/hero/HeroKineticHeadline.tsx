import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

interface HeroKineticHeadlineProps {
  locale: Locale;
  statement: string;
}

const EN_EMPHASIS = [
  { phrase: "brands", world: "brands" },
  { phrase: "software", world: "systems" },
  { phrase: "intelligent systems", world: "intelligence" },
] as const;

function EnglishKineticStatement({ statement }: { statement: string }) {
  let remaining = statement;
  const parts: ReactNode[] = [];

  for (const { phrase, world } of EN_EMPHASIS) {
    const index = remaining.toLowerCase().indexOf(phrase);
    if (index === -1) continue;
    if (index > 0) {
      parts.push(<span key={`pre-${phrase}`}>{remaining.slice(0, index)}</span>);
    }
    parts.push(
      <span key={phrase} data-kinetic-emphasis={world} className="kinetic-emphasis">
        {remaining.slice(index, index + phrase.length)}
      </span>,
    );
    remaining = remaining.slice(index + phrase.length);
  }
  if (remaining) parts.push(<span key="tail">{remaining}</span>);

  return (
    <span className="kinetic-line" data-kinetic-line>
      {parts}
    </span>
  );
}

/** Semantic headline — full text in HTML; motion applies line masks client-side. */
export function HeroKineticHeadline({ locale, statement }: HeroKineticHeadlineProps) {
  const isArabic = locale === "ar";

  return (
    <h1 className="hero-kinetic-headline mt-4 text-4xl leading-[1.15] font-semibold text-balance break-words sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12] xl:text-6xl">
      {isArabic ? (
        <span className="kinetic-line" data-kinetic-line dir="auto">
          {statement}
        </span>
      ) : (
        <EnglishKineticStatement statement={statement} />
      )}
    </h1>
  );
}
