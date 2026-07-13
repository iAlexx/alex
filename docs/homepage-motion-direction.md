# Homepage Motion Direction

Phase 6.1 documents intended scroll motion for homepage sections **not yet animated**.
Gymura is implemented via `GymuraCinematicSection` with a bespoke GSAP timeline and compact live preview.

Future sections should use `HomepageSectionMotion` and mark reveal targets with `data-homepage-reveal`, or adopt a section-specific timeline when the story needs pinning or scrub.

## Shared rules (all sections)

- Use `gsap.matchMedia()` for desktop / tablet / mobile / reduced motion
- No pinning on mobile or reduced motion
- `immediateRender: false` — content readable before JS
- Prefer `transform` and `opacity` only
- Scope all selectors with `useGSAP({ scope })`
- Do not auto-load live previews; animate browser shells only
- Arabic: block/group reveals, never letter-split

## Restaurant Platform

**Intent:** Operational systems thinking — order flow clarity, not decorative motion.

| Breakpoint | Direction                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| Desktop    | Section label + title reveal; flow diagram steps stagger in sequence (amber accent); module chips fade in as a batch |
| Tablet     | Same reveals, no horizontal scrub                                                                                    |
| Mobile     | Lightweight opacity + 16px vertical stagger on flow steps and module chips                                           |
| Reduced    | Subtle opacity only                                                                                                  |

**Avoid:** Pinning, fake dashboard imagery, animating every module chip individually on mobile.

## Live Products (Texas Funds)

**Intent:** Credibility and calm confidence — a live product, not hype.

| Breakpoint | Direction                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- |
| Desktop    | Card border glow on enter; title + description blocks stagger; status badge appears first |
| Mobile     | Single card reveal, short duration                                                        |
| Reduced    | Opacity fade on card container                                                            |

**Avoid:** Metrics counters, fake usage animations, looping pulses.

## Currently Building

**Intent:** Laboratory energy — multiple parallel experiments, organized not chaotic.

| Breakpoint | Direction                                                                     |
| ---------- | ----------------------------------------------------------------------------- |
| Desktop    | `ScrollTrigger.batch` on project cards as they enter viewport; subtle stagger |
| Mobile     | Cards reveal one-by-one with 12px lift                                        |
| Reduced    | Batch opacity fade                                                            |

**Avoid:** Card hover-dependent motion, pinning the grid.

## Cybersecurity

**Intent:** Structured professional path — disciplined, not “hacker” theatrics.

| Breakpoint | Direction                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Desktop    | Intro paragraphs reveal; focus areas grid staggers in two columns; legal callout fades in last |
| Mobile     | Single-column stagger on focus chips                                                           |
| Reduced    | Legal block always visible; optional soft fade on section                                      |

**Avoid:** Glitch, matrix, scan-line effects, red flashing.

## Skills

**Intent:** Capability map — grouped domains, not percentage bars.

| Breakpoint | Direction                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------- |
| Desktop    | Skill group cards reveal in pairs (2-column grid); highlights appear before secondary chips |
| Mobile     | One card at a time, short stagger                                                           |
| Reduced    | Opacity on grid container                                                                   |

**Avoid:** Proficiency animations, counting numbers, bar fills.

## Work Process

**Intent:** Methodical pipeline — seven steps, clear sequence.

| Breakpoint | Direction                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| Desktop    | Steps reveal in order along the border-start rail; numbers appear with title |
| Mobile     | Vertical stack stagger, no horizontal timeline scrub                         |
| Reduced    | All steps visible; optional opacity on section                               |

**Avoid:** Infinite step looping, pinning the full process section.

## Manifesto

**Intent:** Personal conviction — one strong quote, quiet supporting line.

| Breakpoint | Direction                                                                         |
| ---------- | --------------------------------------------------------------------------------- |
| Desktop    | Quote block fade + slight rise; supporting paragraph delayed; no overlay redesign |
| Mobile     | Shorter quote reveal only                                                         |
| Reduced    | No motion on photo; text static                                                   |

**Avoid:** Parallax on workstation photo, text over image animation changes (overlay redesign is a separate phase).

## Contact

**Intent:** Clear invitation — channels ready, no friction.

| Breakpoint | Direction                                                           |
| ---------- | ------------------------------------------------------------------- |
| Desktop    | CTA card scales from 0.98 to 1 with opacity; social buttons stagger |
| Mobile     | Card reveal + button row stagger                                    |
| Reduced    | Card opacity fade                                                   |

**Avoid:** Auto-focus on links, motion that delays access to Telegram/LinkedIn/GitHub.

## Live preview embed pattern (homepage columns)

Use `LiveWebsitePreview` with `variant="compact"`:

- `click-to-load` (default) — iframe mounts only after Launch
- `openWebsiteLabel` link always visible above shell
- `motionShell` prop targets GSAP at browser chrome only
- LTR-isolated shell inside RTL pages
- Mobile defaults to Mobile viewport mode via `defaultViewport()`

Gymura homepage reference: `GymuraCinematicSection` + `dictionary.gymura.livePreview`.
