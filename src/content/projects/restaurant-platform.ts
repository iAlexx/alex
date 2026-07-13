import type { PortfolioProject } from "./types";

export const restaurantPlatform: PortfolioProject = {
  title: "Restaurant Management & QR Ordering Platform",
  slug: "restaurant-platform",
  shortDescription:
    "A completed and live Arabic-first restaurant operations platform that connects digital menus, ordering, cashier operations, kitchen workflows, tables, delivery, payments, and management within one centralized system.",
  longDescription:
    "The platform is deployed at alnkha.site and demonstrates Alex’s ability to design, structure, build, and launch a complete operational product. The system is structured around the real journey of restaurant orders from menu access to preparation, payment, delivery, and reporting.",
  status: "live",
  featured: true,
  priority: 2,
  world: "systems",
  role: ["Product Architect", "Full-Stack Developer", "Workflow Designer"],
  website: "https://alnkha.site",
  technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs"],
  capabilities: [
    "QR menu",
    "Dine-in orders",
    "Takeaway orders",
    "Delivery orders",
    "Cashier dashboard",
    "Management dashboard",
    "Kitchen display system",
    "Table sessions",
    "Shift management",
    "Cash drawer",
    "Expenses",
    "Refunds",
    "Discounts",
    "Reservations",
    "Delivery zones",
    "Delivery representatives",
    "Split billing",
    "Receipt printing",
    "Arabic and English interfaces",
    "Operational reports",
  ],
  problem:
    "Restaurant operations are usually split across disconnected tools for ordering, cashier work, kitchen coordination, delivery, and reporting.",
  solution:
    "One centralized, Arabic-first system structured around the real lifecycle of a restaurant order — from menu access to preparation, payment, delivery, and reporting.",
  // PLACEHOLDER ASSETS — replace with real dashboard, cashier, kitchen, and
  // mobile screenshots when provided.
  gallery: [
    "/images/restaurant/placeholder-dashboard.webp",
    "/images/restaurant/placeholder-cashier.webp",
    "/images/restaurant/placeholder-kitchen.webp",
    "/images/restaurant/placeholder-mobile.webp",
  ],
  visibility: "public",
};
