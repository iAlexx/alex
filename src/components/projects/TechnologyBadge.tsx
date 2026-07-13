import type { ProjectWorld } from "@/content/projects/types";
import type { ProjectTechnology } from "@/lib/projects/tech-types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { TechIcon } from "@/components/projects/tech-icons/TechIcon";

interface TechnologyBadgeProps {
  technology: ProjectTechnology;
  world?: ProjectWorld;
  opensInNewTabLabel?: string;
}

/** Compact glass technology pill with local logo. */
export function TechnologyBadge({
  technology,
  world,
  opensInNewTabLabel = "",
}: TechnologyBadgeProps) {
  const content = (
    <>
      <span className="tech-badge__icon" aria-hidden>
        <TechIcon iconKey={technology.iconKey} />
      </span>
      <span className="tech-badge__label">
        <bdi dir="ltr">{technology.label}</bdi>
      </span>
    </>
  );

  const className = "tech-badge";

  if (technology.url) {
    return (
      <ExternalLink
        href={technology.url}
        opensInNewTabLabel={opensInNewTabLabel}
        className={className}
        data-tech-world={world}
        title={technology.label}
      >
        {content}
      </ExternalLink>
    );
  }

  return (
    <span className={className} data-tech-world={world} title={technology.label}>
      {content}
    </span>
  );
}
