import type { Locale } from "@/lib/i18n/config";
import type { PortfolioProject } from "@/content/projects/types";
import type { CaseStudyCopy, Dictionary } from "@/content/translations";
import { eyebrowClass, introParagraphClass } from "@/lib/i18n/locale-classes";
import { ProjectStatusBadge } from "@/components/ui/ProjectStatusBadge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { MixedText } from "@/components/ui/MixedText";

interface ProjectHeroProps {
  locale: Locale;
  project: PortfolioProject;
  copy: CaseStudyCopy;
  dictionary: Dictionary;
  /** When true, adds data attributes for case study scroll motion (Gymura, Restaurant). */
  motion?: boolean;
}

export function ProjectHero({ locale, project, copy, dictionary, motion }: ProjectHeroProps) {
  const labels = dictionary.projectPages;
  const paragraphClass = introParagraphClass(locale);

  return (
    <header
      data-motion={motion ? "project-hero" : undefined}
      className="border-b border-line bg-navy/30"
    >
      <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        <p className={eyebrowClass(locale)} data-motion-block={motion ? "" : undefined}>
          {labels.eyebrow}
        </p>

        <div
          className="mt-6 flex flex-wrap items-center gap-3"
          data-motion-block={motion ? "" : undefined}
        >
          <p className="text-sm font-medium text-mist">{copy.label}</p>
          <ProjectStatusBadge
            status={project.status}
            label={dictionary.statusLabels[project.status]}
          />
        </div>

        <h1
          className="mt-4 text-4xl font-semibold tracking-tight text-balance break-words sm:text-5xl"
          data-motion-block={motion ? "" : undefined}
        >
          {copy.title}
        </h1>
        <p
          className="mt-3 text-lg text-mist sm:text-xl"
          data-motion-block={motion ? "" : undefined}
        >
          {copy.subtitle}
        </p>

        <div className="mt-8 space-y-4">
          {copy.intro.map((paragraph) => (
            <p
              key={paragraph}
              className={paragraphClass}
              data-motion-block={motion ? "" : undefined}
            >
              {locale === "ar" ? <MixedText>{paragraph}</MixedText> : paragraph}
            </p>
          ))}
        </div>

        {project.website ? (
          <div className="mt-8">
            <ExternalLink
              href={project.website}
              opensInNewTabLabel={dictionary.a11y.opensInNewTab}
              data-motion={motion ? "visit-cta" : undefined}
              className="inline-flex min-h-12 items-center rounded-full bg-soft px-6 text-sm font-medium text-obsidian transition-colors hover:bg-electric"
            >
              {copy.visitLabel ?? labels.visitFallback}
            </ExternalLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
