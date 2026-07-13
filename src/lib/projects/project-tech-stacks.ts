import type { ProjectSlug, ProjectWorld } from "@/content/projects/types";
import { resolveTechnologies } from "@/lib/projects/tech-catalog";
import type { ProjectTechnology, ProjectTechStack } from "@/lib/projects/tech-types";

export const PROJECT_TECH_STACKS: Record<ProjectSlug, ProjectTechStack> = {
  gymura: {
    projectId: "gymura",
    technologies: resolveTechnologies([
      "nextjs",
      "typescript",
      "react",
      "tailwind-css",
      "supabase",
      "postgresql",
      "vercel",
      "zod",
      "zustand",
      "resend",
    ]),
    homepageIds: [
      "nextjs",
      "typescript",
      "react",
      "tailwind-css",
      "supabase",
      "postgresql",
      "vercel",
      "zod",
    ],
  },
  "restaurant-platform": {
    projectId: "restaurant-platform",
    technologies: resolveTechnologies([
      "nextjs",
      "react",
      "typescript",
      "tailwind-css",
      "rest-apis",
    ]),
    homepageIds: ["nextjs", "react", "typescript", "tailwind-css", "rest-apis"],
  },
  "alexa-ai": {
    projectId: "alexa-ai",
    technologies: resolveTechnologies([
      "ollama",
      "fastapi",
      "nextjs",
      "typescript",
      "sqlite",
      "chromadb",
      "local-llms",
    ]),
    homepageIds: ["ollama", "fastapi", "nextjs", "typescript", "sqlite", "chromadb", "local-llms"],
  },
  "automation-lab": {
    projectId: "automation-lab",
    technologies: resolveTechnologies(["n8n", "api-integrations", "ai-workflows"]),
    homepageIds: ["n8n", "api-integrations", "ai-workflows"],
  },
  "cybersecurity-lab": {
    projectId: "cybersecurity-lab",
    technologies: resolveTechnologies([
      "linux",
      "python",
      "networking",
      "web-technologies",
      "web-security",
      "api-security",
      "vulnerability-assessment",
      "active-directory",
      "red-team",
    ]),
    homepageIds: [
      "linux",
      "python",
      "networking",
      "web-technologies",
      "web-security",
      "active-directory",
      "red-team",
      "vulnerability-assessment",
    ],
  },
  "texas-funds": {
    projectId: "texas-funds",
    technologies: resolveTechnologies([
      "typescript",
      "nextjs",
      "react",
      "tailwind-css",
      "supabase",
      "postgresql",
      "telegram-bot-api",
      "webhooks",
      "gramjs",
      "puppeteer",
      "railway",
      "sentry",
      "zod",
    ]),
    homepageIds: [
      "typescript",
      "nextjs",
      "supabase",
      "postgresql",
      "telegram-bot-api",
      "webhooks",
      "railway",
    ],
  },
  "alex-linux": {
    projectId: "alex-linux",
    technologies: resolveTechnologies(["linux"]),
    homepageIds: ["linux"],
  },
  upcoming: {
    projectId: "upcoming",
    technologies: [],
    homepageIds: [],
  },
};

const PROJECT_WORLD_MAP: Record<ProjectSlug, ProjectWorld | undefined> = {
  gymura: "brands",
  "restaurant-platform": "systems",
  "alexa-ai": "intelligence",
  "automation-lab": "intelligence",
  "cybersecurity-lab": "security",
  "texas-funds": "systems",
  "alex-linux": "security",
  upcoming: undefined,
};

export function getProjectWorld(projectId: ProjectSlug): ProjectWorld | undefined {
  return PROJECT_WORLD_MAP[projectId];
}

export function getProjectTechStack(projectId: ProjectSlug): ProjectTechStack {
  return PROJECT_TECH_STACKS[projectId];
}

export function getProjectTechnologies(
  projectId: ProjectSlug,
  options?: { compact?: boolean; maxItems?: number },
): ProjectTechnology[] {
  const stack = PROJECT_TECH_STACKS[projectId];
  if (stack.technologies.length === 0) {
    return [];
  }

  const ids =
    options?.compact && stack.homepageIds.length > 0
      ? stack.homepageIds
      : stack.technologies.map((t) => t.id);

  const limit = options?.maxItems ?? (options?.compact ? 8 : undefined);
  const selectedIds = limit ? ids.slice(0, limit) : ids;

  return selectedIds
    .map((id) => stack.technologies.find((tech) => tech.id === id))
    .filter((tech): tech is ProjectTechnology => tech !== undefined);
}
