/**
 * Project data model (roadmap section 15).
 * Intentionally has no date field — project dates are never displayed.
 */
export type ProjectStatus =
  | "live"
  | "active-development"
  | "functional-prototype"
  | "research"
  | "planned"
  | "archived"
  | "private";

/** Every project route and dictionary lookup is keyed by these slugs. */
export type ProjectSlug =
  | "gymura"
  | "restaurant-platform"
  | "alexa-ai"
  | "automation-lab"
  | "cybersecurity-lab"
  | "texas-funds"
  | "alex-linux"
  | "upcoming";

export type ProjectWorld = "brands" | "systems" | "intelligence" | "security";

export interface PortfolioProject {
  title: string;
  slug: ProjectSlug;
  /** Homepage V2 world grouping — optional until all projects are tagged. */
  world?: ProjectWorld;
  shortDescription: string;
  longDescription: string;
  status: ProjectStatus;
  featured: boolean;
  priority: number;
  role: string[];
  website?: string;
  repository?: string;
  technologies: string[];
  capabilities: string[];
  problem?: string;
  solution?: string;
  process?: string[];
  challenges?: string[];
  outcomes?: string[];
  /** Placeholder paths are allowed until real media exists; never fake assets. */
  gallery: string[];
  video?: string;
  mobilePreview?: string;
  desktopPreview?: string;
  nextSteps?: string[];
  visibility: "public" | "private" | "partial";
}
