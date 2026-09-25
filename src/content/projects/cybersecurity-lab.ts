import type { PortfolioProject } from "./types";

export const cybersecurityLab: PortfolioProject = {
  title: "Cybersecurity Lab",
  slug: "cybersecurity-lab",
  shortDescription:
    "A documented learning and experimentation space focused on networking, Linux, web security, and offensive security methodology with Purple Team direction.",
  longDescription:
    "For Alex, cybersecurity is a structured discipline built on methodology, documentation, ethical practice, and understanding both offensive and defensive perspectives. The path moves toward professional penetration testing, Purple Team collaboration, detection-aware security work, and security consulting through legal, lab-first practice. All activities are performed in legal training environments, personally owned systems, or environments with explicit authorization.",
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
    "Offensive Security Methodology",
  ],
  // PLACEHOLDER ASSETS — replace with sanitized lab screenshots and reports.
  // Never publish credentials, IPs, or unresolved vulnerabilities.
  gallery: ["/images/cybersecurity/placeholder-lab.webp"],
  visibility: "public",
};
