import type { PortfolioProject, ProjectSlug } from "@/content/projects/types";

export type ProjectIndexingPolicy = "index" | "noindex";

export interface ProjectIndexingDecision {
  policy: ProjectIndexingPolicy;
  includeInSitemap: boolean;
  reason: string;
}

/** Honest indexing policy for public project routes. */
export function getProjectIndexingDecision(project: PortfolioProject): ProjectIndexingDecision {
  if (project.visibility === "private" || project.slug === "upcoming") {
    return {
      policy: "noindex",
      includeInSitemap: false,
      reason: "Private / upcoming work — thin placeholder page; follow links but do not index.",
    };
  }

  return {
    policy: "index",
    includeInSitemap: true,
    reason: "Public route with useful status-aware case-study content.",
  };
}

export function isSitemapProject(slug: ProjectSlug, project: PortfolioProject): boolean {
  return getProjectIndexingDecision(project).includeInSitemap;
}
