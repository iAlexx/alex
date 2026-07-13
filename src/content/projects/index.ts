import type { PortfolioProject, ProjectSlug } from "./types";
import { gymura } from "./gymura";
import { restaurantPlatform } from "./restaurant-platform";
import { alexaAi } from "./alexa-ai";
import { automationLab } from "./automation-lab";
import { cybersecurityLab } from "./cybersecurity-lab";
import { texasFunds } from "./texas-funds";
import { alexLinux } from "./alex-linux";
import { upcoming } from "./upcoming";

export * from "./types";

/** All projects, ordered by roadmap priority. */
export const projects: PortfolioProject[] = [
  gymura,
  restaurantPlatform,
  alexaAi,
  automationLab,
  cybersecurityLab,
  texasFunds,
  alexLinux,
  upcoming,
].sort((a, b) => a.priority - b.priority);

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}

export function isProjectSlug(value: string): value is ProjectSlug {
  return projects.some((project) => project.slug === value);
}

/** Public, ordered neighbors for previous/next case study navigation. */
export function getAdjacentProjects(slug: ProjectSlug): {
  previous: PortfolioProject | undefined;
  next: PortfolioProject | undefined;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}
