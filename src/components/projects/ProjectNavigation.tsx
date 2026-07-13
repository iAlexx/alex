import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { navLabelClass } from "@/lib/i18n/locale-classes";
import type { PortfolioProject, ProjectSlug } from "@/content/projects/types";
import type { Dictionary } from "@/content/translations";
import { getAdjacentProjects } from "@/content/projects";

interface ProjectNavigationProps {
  slug: ProjectSlug;
  locale: Locale;
  dictionary: Dictionary;
}

function NavCard({
  project,
  locale,
  direction,
  label,
  dictionary,
}: {
  project: PortfolioProject;
  locale: Locale;
  direction: "previous" | "next";
  label: string;
  dictionary: Dictionary;
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className={`group flex min-h-24 min-w-0 flex-col justify-center gap-1 rounded-2xl border border-line bg-ink/60 p-5 transition-colors hover:border-electric/50 ${
        isNext ? "items-end text-end" : "items-start text-start"
      }`}
    >
      <span className={navLabelClass(locale)}>{label}</span>
      <span className="break-words font-medium text-soft group-hover:text-electric">
        {dictionary.caseStudies[project.slug].title}
      </span>
    </Link>
  );
}

export function ProjectNavigation({ slug, locale, dictionary }: ProjectNavigationProps) {
  const { previous, next } = getAdjacentProjects(slug);
  const labels = dictionary.projectPages;

  return (
    <nav aria-label={labels.backToProjects} className="border-t border-line">
      <div className="mx-auto max-w-4xl min-w-0 px-6 py-10">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {previous ? (
            <div className="min-w-0 justify-self-start">
              <NavCard
                project={previous}
                locale={locale}
                direction="previous"
                label={labels.previousProject}
                dictionary={dictionary}
              />
            </div>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? (
            <div className="min-w-0 justify-self-end sm:col-start-2">
              <NavCard
                project={next}
                locale={locale}
                direction="next"
                label={labels.nextProject}
                dictionary={dictionary}
              />
            </div>
          ) : null}
        </div>
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex min-h-12 items-center rounded-full border border-line px-5 text-sm text-mist transition-colors hover:border-electric hover:text-soft"
          >
            {labels.backToProjects}
          </Link>
        </div>
      </div>
    </nav>
  );
}
