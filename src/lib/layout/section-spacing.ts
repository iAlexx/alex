/**
 * Homepage vertical rhythm tokens — deliberate spacing between section types.
 * Flagship cinematic sections (Gymura, Restaurant) keep their internal padding.
 */
export const sectionSpacing = {
  /** Hero → Builder transition */
  hero: "pt-14 pb-12 sm:pb-14 lg:pt-20 lg:pb-16",
  /** Emotional bridge after Hero */
  narrative: "py-14 sm:py-16 lg:py-20",
  /** Catalog clusters — building, live products, skills */
  catalog: "py-14 sm:py-16 lg:py-20",
  /** Mid-page specialty (cybersecurity) */
  specialty: "py-16 lg:py-24",
  /** Clear break before finale */
  preFinale: "mt-4 sm:mt-6 lg:mt-10",
  /** Manifesto emotional statement */
  manifesto: "py-20 sm:py-24 lg:py-32",
  /** Contact CTA */
  contact: "py-14 sm:py-16 lg:py-20",
  /** Compact footer */
  footer: "py-10 sm:py-12",
} as const;

export type SectionSpacingKey = keyof typeof sectionSpacing;
