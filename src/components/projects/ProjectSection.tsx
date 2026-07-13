import type { Locale } from "@/lib/i18n/config";
import { caseStudyParagraphClass } from "@/lib/i18n/locale-classes";
import type { CaseStudySectionCopy } from "@/content/translations";
import { MixedText } from "@/components/ui/MixedText";

interface ProjectSectionProps {
  section: CaseStudySectionCopy;
  locale: Locale;
  /** Marks major Gymura case study beats for cinematic motion. */
  motionHighlight?: boolean;
}

/** Generic long-form case study section: title plus paragraphs and/or bullets. */
export function ProjectSection({ section, locale, motionHighlight }: ProjectSectionProps) {
  const paragraphClass = caseStudyParagraphClass(locale);

  return (
    <section className="min-w-0" data-motion={motionHighlight ? "key-section" : undefined}>
      <h2 className="text-balance text-2xl font-semibold tracking-tight break-words sm:text-3xl">
        {section.title}
      </h2>
      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className={paragraphClass}
          data-motion-block={motionHighlight ? "" : undefined}
        >
          {locale === "ar" ? <MixedText>{paragraph}</MixedText> : paragraph}
        </p>
      ))}
      {section.bullets ? (
        <ul className="mt-5 grid min-w-0 gap-2 sm:grid-cols-2">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex min-w-0 items-start gap-2 text-sm text-mist">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-electric" />
              <span className="break-words">
                {locale === "ar" ? <MixedText>{bullet}</MixedText> : bullet}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
