import type { Locale } from "@/lib/i18n/config";

interface HeroStatementProps {
  locale: Locale;
  statement: string;
  titleClassName?: string;
  lineClassName?: string;
}

/** Semantic H1 — EN uses comma breaks; AR wraps naturally. */
export function HeroStatement({
  locale,
  statement,
  titleClassName = "hero-static__title",
  lineClassName = "hero-static__title-line",
}: HeroStatementProps) {
  const isArabic = locale === "ar";

  if (isArabic) {
    return (
      <h1 className={titleClassName} dir="auto">
        {statement}
      </h1>
    );
  }

  const parts = statement.split(/,\s*/);
  if (parts.length <= 1) {
    return <h1 className={titleClassName}>{statement}</h1>;
  }

  return (
    <h1 className={titleClassName}>
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const suffix = isLast ? "" : ",";
        return (
          <span key={part} className={lineClassName}>
            {part}
            {suffix}
          </span>
        );
      })}
    </h1>
  );
}
