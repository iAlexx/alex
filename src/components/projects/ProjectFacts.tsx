import type { Locale } from "@/lib/i18n/config";
import type { PortfolioProject } from "@/content/projects/types";
import { navLabelClass } from "@/lib/i18n/locale-classes";
import { factValueDir } from "@/lib/i18n/fact-value-dir";
import type { Dictionary } from "@/content/translations";

interface ProjectFactsProps {
  locale: Locale;
  project: PortfolioProject;
  dictionary: Dictionary;
  motion?: boolean;
}

/** Compact fact sheet — roles, status, type, and technologies from localized dictionaries. */
export function ProjectFacts({ locale, project, dictionary, motion }: ProjectFactsProps) {
  const labels = dictionary.projectPages;
  const labelClass = navLabelClass(locale);
  const factsCopy = dictionary.projectFacts[project.slug];

  const facts: Array<{ label: string; values: string[] }> = [
    { label: labels.roleLabel, values: factsCopy.roles },
    { label: labels.statusLabel, values: [dictionary.statusLabels[project.status]] },
    { label: labels.typeLabel, values: [dictionary.projectTypes[project.slug]] },
  ];
  if (factsCopy.technologies.length > 0) {
    facts.push({ label: labels.technologiesLabel, values: factsCopy.technologies });
  }

  return (
    <dl
      data-motion={motion ? "project-facts" : undefined}
      className="grid min-w-0 gap-6 rounded-2xl border border-line bg-ink/60 p-6 sm:grid-cols-2"
    >
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0">
          <dt className={labelClass}>{fact.label}</dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {fact.values.map((value, index) => (
                <li
                  key={`${fact.label}-${value}`}
                  className="flex min-w-0 items-center gap-2 text-sm text-soft"
                >
                  {index > 0 ? (
                    <span aria-hidden className="shrink-0 text-mist">
                      ·
                    </span>
                  ) : null}
                  <span className="break-words" dir={factValueDir(value)}>
                    {value}
                  </span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
