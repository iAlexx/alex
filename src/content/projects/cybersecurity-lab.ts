import type { PortfolioProject } from "./types";

export const cybersecurityLab: PortfolioProject = {
  title: "Cybersecurity Lab",
  slug: "cybersecurity-lab",
  shortDescription:
    "A documented learning and experimentation space focused on networking, Linux, web security, and Red Team methodology.",
  longDescription:
    "For Alex, cybersecurity is built on understanding networks, operating systems, web technologies, methodology, documentation, and ethical practice. He is following a structured path toward professional penetration testing, Red Team operations, and security consulting. All activities are performed in legal training environments, personally owned systems, or environments with explicit authorization.",
  status: "active-development",
  featured: false,
  priority: 5,
  world: "security",
  role: ["Security Practitioner", "Researcher"],
  technologies: ["Linux", "Python", "Networking", "Web technologies"],
  capabilities: [
    "Networking",
    "Linux",
    "Web technologies",
    "Python",
    "Web security",
    "API security fundamentals",
    "Vulnerability assessment",
    "Authorized penetration-testing labs",
    "Security documentation",
    "Active Directory",
    "Red Team methodology",
  ],
  // PLACEHOLDER ASSETS — replace with sanitized lab screenshots and reports.
  // Never publish credentials, IPs, or unresolved vulnerabilities.
  gallery: ["/images/cybersecurity/placeholder-lab.webp"],
  visibility: "public",
};
