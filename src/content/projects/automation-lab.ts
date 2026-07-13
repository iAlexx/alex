import type { PortfolioProject } from "./types";

export const automationLab: PortfolioProject = {
  title: "AI & Automation Lab",
  slug: "automation-lab",
  shortDescription: "A growing collection of intelligent workflows and automation systems.",
  longDescription:
    "The lab combines n8n, API integrations, and AI workflows to automate notifications, data processing, business processes, and AI-assisted operations, including tool-enabled agents and information routing.",
  status: "active-development",
  featured: false,
  priority: 4,
  world: "intelligence",
  role: ["Automation Engineer", "AI Workflow Designer"],
  technologies: ["n8n", "API integrations", "AI workflows"],
  capabilities: [
    "Automated notifications",
    "Data processing",
    "Business process automation",
    "AI-assisted operations",
    "Tool-enabled agents",
    "Information routing",
  ],
  // No media assets yet — add sanitized workflow screenshots when available.
  gallery: [],
  visibility: "public",
};
