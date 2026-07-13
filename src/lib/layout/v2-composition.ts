/**
 * Homepage V2 layout composition utilities (Phase 7.3B).
 */
export const composition = {
  /** Standard inner content grid */
  inner: "mx-auto w-full max-w-[min(100%,72rem)] px-6 lg:px-8",
  /** Wider editorial / world compositions */
  innerWide: "mx-auto w-full max-w-[min(100%,90rem)] px-6 lg:px-10",
  /** Prose / method reading width */
  reading: "max-w-3xl",
  /** Full-bleed outer band */
  bleed: "relative w-full overflow-hidden",
  /** Hero asymmetric grid */
  heroGrid:
    "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16",
  /** Editorial brand showcase — copy narrower, preview dominant */
  editorialGrid:
    "grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-10 xl:gap-14",
  /** Gymura flagship — wider, taller live preview column (Phase 7.3B.7) */
  gymuraEditorialGrid:
    "grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:gap-10",
  /** Systems intro + full-width workflow */
  systemsIntro: "max-w-2xl",
  /** Restaurant proof — preview dominant, details column */
  systemsProofGrid:
    "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:items-start lg:gap-8",
  /** Intelligence open architecture workspace */
  intelArchitecture:
    "rounded-xl bg-[color-mix(in_srgb,var(--accent-intel)_5%,var(--color-ink))] px-4 py-5 sm:px-6 sm:py-6",
  /** Security split architecture */
  securityGrid:
    "grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start lg:gap-12 xl:gap-16",
  /** Live preview shell — stable aspect, no viewport clipping */
  previewShell: "w-full max-w-[min(100%,clamp(18rem,42vw,34rem))] min-w-0 mx-auto lg:mx-0",
} as const;

export const v2Spacing = {
  hero: "pt-14 pb-12 sm:pb-14 lg:pt-20 lg:pb-16",
  method: "py-14 sm:py-16 lg:py-20",
  world: "py-14 sm:py-16 lg:py-20",
  worldSystems: "py-12 sm:py-14 lg:py-16 lg:pb-12",
  worldIntelligence: "pt-9 pb-14 sm:pt-10 sm:pb-16 lg:pt-11",
  future: "py-14 sm:py-16 lg:py-20",
  manifesto: "py-20 sm:py-24 lg:py-28",
  contact: "py-14 sm:py-16 lg:py-20",
} as const;
