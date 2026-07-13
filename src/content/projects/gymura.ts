import type { PortfolioProject } from "./types";

export const gymura: PortfolioProject = {
  title: "Gymura",
  slug: "gymura",
  shortDescription:
    "Gymura is a sportswear brand and digital commerce project built by combining brand strategy, product direction, apparel design, visual identity, and a modern online shopping experience.",
  longDescription:
    "Alex developed Gymura as more than an online store. It is a complete brand ecosystem covering identity, products, presentation, customer experience, content, and the technology supporting the business.",
  status: "live",
  featured: true,
  priority: 1,
  world: "brands",
  role: ["Founder", "Brand Builder", "Digital Product Lead"],
  website: "https://gymura.store",
  technologies: ["E-commerce", "Brand Identity", "Product Design"],
  capabilities: [
    "Brand strategy",
    "Product direction",
    "Apparel design",
    "Visual identity",
    "Online shopping experience",
    "Content and marketing direction",
  ],
  // PLACEHOLDER ASSETS — replace with real Gymura media (logo, clothing images,
  // product mockups, store screenshots) before Phase 6.
  gallery: [
    "/images/gymura/placeholder-logo.webp",
    "/images/gymura/placeholder-store-desktop.webp",
    "/images/gymura/placeholder-store-mobile.webp",
    "/images/gymura/placeholder-apparel.webp",
  ],
  visibility: "public",
};
