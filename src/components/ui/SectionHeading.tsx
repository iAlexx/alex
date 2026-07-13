import type { Locale } from "@/lib/i18n/config";
import { eyebrowClass, bodyTextClass } from "@/lib/i18n/locale-classes";

interface SectionHeadingProps {
  locale?: Locale;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "start" | "center";
}

export function SectionHeading({
  locale = "en",
  eyebrow,
  title,
  intro,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className={`mb-3 ${eyebrowClass(locale)}`}>{eyebrow}</p> : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight break-words sm:text-4xl">
        {title}
      </h2>
      {intro ? <p className={`mt-4 ${bodyTextClass(locale)}`}>{intro}</p> : null}
    </div>
  );
}
