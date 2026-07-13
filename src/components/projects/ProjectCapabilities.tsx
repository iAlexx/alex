import type { PortfolioProject } from "@/content/projects/types";
import { factValueDir } from "@/lib/i18n/fact-value-dir";
import type { Dictionary } from "@/content/translations";

interface ProjectCapabilitiesProps {
  project: PortfolioProject;
  dictionary: Dictionary;
  motion?: boolean;
}

/** Capability chips from localized dictionary entries — never from English registry strings. */
export function ProjectCapabilities({ project, dictionary, motion }: ProjectCapabilitiesProps) {
  const capabilities = dictionary.projectFacts[project.slug].capabilities;
  if (capabilities.length === 0) {
    return null;
  }

  return (
    <section data-motion={motion ? "project-capabilities" : undefined}>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {dictionary.projectPages.capabilitiesLabel}
      </h2>
      <ul className="mt-5 flex flex-wrap gap-2">
        {capabilities.map((capability) => (
          <li
            key={capability}
            className="rounded-full border border-line bg-graphite px-3.5 py-1.5 text-sm text-mist"
          >
            <span dir={factValueDir(capability)}>{capability}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
