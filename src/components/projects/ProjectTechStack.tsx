"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { ProjectSlug } from "@/content/projects/types";
import type { Dictionary } from "@/content/translations";
import { getProjectTechnologies, getProjectWorld } from "@/lib/projects/project-tech-stacks";
import { TechnologyBadge } from "@/components/projects/TechnologyBadge";
import "@/components/projects/project-tech-stack.css";

export type ProjectTechStackProps = {
  projectId: ProjectSlug;
  locale: Locale;
  dictionary: Dictionary;
  compact?: boolean;
  maxItems?: number;
  showLabel?: boolean;
  className?: string;
  /** Homepage mobile — show subset first with expand control */
  expandable?: boolean;
  mobileInitialCount?: number;
  /** Override expand label (homepage mobile compression) */
  expandLabel?: string;
  collapseLabel?: string;
};

/** Verified project technologies — shared homepage and case-study block. */
export function ProjectTechStack({
  projectId,
  locale,
  dictionary,
  compact = false,
  maxItems,
  showLabel = true,
  className = "",
  expandable = false,
  mobileInitialCount = 4,
  expandLabel,
  collapseLabel,
}: ProjectTechStackProps) {
  const technologies = getProjectTechnologies(projectId, { compact, maxItems });
  const world = getProjectWorld(projectId);
  const isArabic = locale === "ar";
  const [expanded, setExpanded] = useState(false);

  if (technologies.length === 0) {
    return null;
  }

  const canCollapse = expandable && technologies.length > mobileInitialCount;
  const hiddenCount = technologies.length - mobileInitialCount;
  const titleId = `${projectId}-tech-stack-title`;

  return (
    <section
      className={`project-tech-stack ${isArabic ? "project-tech-stack--ar" : ""} ${
        canCollapse ? "project-tech-stack--expandable" : ""
      } ${expanded ? "is-expanded" : ""} ${className}`.trim()}
      data-mobile-initial={canCollapse ? mobileInitialCount : undefined}
      aria-labelledby={showLabel ? titleId : undefined}
    >
      {showLabel ? (
        <h3 id={titleId} className="project-tech-stack__title">
          {dictionary.projectPages.techStackLabel}
        </h3>
      ) : null}

      <ul className="project-tech-stack__list tech-stack-list" dir={isArabic ? "rtl" : "ltr"}>
        {technologies.map((technology) => (
          <li key={technology.id}>
            <TechnologyBadge
              technology={technology}
              world={world}
              opensInNewTabLabel={dictionary.a11y.opensInNewTab}
            />
          </li>
        ))}
      </ul>

      {canCollapse ? (
        <button
          type="button"
          className="project-tech-stack__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? (collapseLabel ?? dictionary.projectPages.techStackShowLess)
            : (expandLabel ?? dictionary.projectPages.techStackShowMore).replace(
                "{count}",
                String(hiddenCount),
              )}
        </button>
      ) : null}
    </section>
  );
}
