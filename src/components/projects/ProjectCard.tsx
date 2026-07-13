import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { compactBodyClass } from "@/lib/i18n/locale-classes";
import type { PortfolioProject } from "@/content/projects/types";
import type { Dictionary } from "@/content/translations";
import { ProjectStatusBadge } from "@/components/ui/ProjectStatusBadge";

interface ProjectCardProps {
  project: PortfolioProject;
  locale: Locale;
  dictionary: Dictionary;
}

/** Index card linking to the project case study. Copy comes from dictionaries. */
export function ProjectCard({ project, locale, dictionary }: ProjectCardProps) {
  const copy = dictionary.caseStudies[project.slug];
  const subtitleClass = compactBodyClass(locale);

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group flex w-full flex-col gap-4 rounded-2xl border border-line bg-ink/60 p-6 transition-colors hover:border-electric/50"
    >
      <div className="flex flex-wrap items-center gap-3">
        <ProjectStatusBadge
          status={project.status}
          label={dictionary.statusLabels[project.status]}
        />
      </div>
      <h2 className="text-lg leading-snug font-semibold group-hover:text-electric">{copy.title}</h2>
      <p className={subtitleClass}>{copy.subtitle}</p>
      <span className="mt-auto text-sm font-medium text-electric">
        {dictionary.projectPages.openCaseStudy}
      </span>
    </Link>
  );
}
