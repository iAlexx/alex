# Codex Hero Lab Phase 1 Report

**Date:** 2026-07-12  
**Status:** Complete — stopped before Phase 2  
**Direction:** The Builder's Threshold  
**Routes:** `/en/codex-hero-lab`, `/ar/codex-hero-lab`

## Executive summary

Phase 1 implements one isolated, bilingual, static Hero proposal using the production Next.js portfolio as its only foundation. The composition presents Alex honestly at the existing workstation and wraps the scene with one continuous architectural threshold made from HTML, CSS, and SVG. It adds no dependency, client component, canvas, WebGL, Three.js, GSAP, motion, pointer interaction, Global Traveler, variant control, or production-homepage integration.

Both routes are statically generated and return `noindex, nofollow`. They remain absent from the explicit sitemap, navigation, structured data, header, and footer. The existing `/[locale]/hero-lab`, production homepage, world chapters, case studies, live previews, and global SEO utilities were not modified.

All required code checks and the production build pass. Eleven new screenshots were captured from the production server with installed Chrome through the project's existing Playwright package. Pixel review includes normal, grayscale, glow-disabled, English, Arabic, desktop, and mobile states.

## Route implementation

- `src/app/[locale]/codex-hero-lab/page.tsx` validates the locale, reads the existing dictionary, exports `dynamic = "force-static"`, emits noindex/nofollow metadata, and renders the Lab.
- Static generation is inherited from the locale layout's `generateStaticParams`; the production build lists `/en/codex-hero-lab` and `/ar/codex-hero-lab` as SSG routes.
- The Lab is a server-rendered component tree. There is no `"use client"` boundary.
- The route is deliberately absent from `src/app/sitemap.ts`; the file was not changed.
- The route emits no structured data and is not linked from production navigation.

## Static art direction

The 1440 × 900 composition uses an approximately 44/56 text-to-scene grid. Copy sits at inline-start; the workstation and threshold occupy inline-end. The hierarchy is:

1. Alex and workstation
2. Full H1 statement
3. Threshold silhouette and junction
4. Supporting copy
5. Actions

The frame is asymmetrical and grounded in the desk/workstation plane. It does not use an orb, central reactor, detached modules, cards, armor, wings, HUD labels, or a sci-fi dashboard.

## Environmental portrait treatment

- Uses only `/images/alex/alex-workstation-desktop.webp` and `/images/alex/alex-workstation-mobile.webp`.
- Uses the existing localized `dictionary.a11y.heroImageAlt` values.
- Preserves Alex's head, glasses/profile, workstation, and defining vertical monitor.
- Uses intersecting horizontal and vertical multi-stop masks, not a circular or uniform oval mask.
- The outer scene perimeter dissolves into the obsidian background while the important interior remains sharp.
- Warm key and cool rim overlays are restrained and do not blur Alex.
- English and Arabic use different object-position values. The photograph itself is never mirrored.

## Threshold construction

`CodexBuilderThreshold` renders one decorative SVG object with:

- a continuous lintel, dominant upright, and lower sill;
- separate front and side polygons;
- a dark internal recess;
- three visible depth planes;
- narrow bevel polygons using a restrained specular gradient;
- soft local drop shadow;
- one foreground base crossing near the desk;
- no crossing over Alex's head or face.

The SVG wrapper is `aria-hidden="true"` and unfocusable. Shape remains readable in the grayscale and glow-disabled captures because its value structure comes from front/side/recess/bevel planes rather than bloom.

## Four-world seams

The four worlds are narrow inlaid seams within the single threshold:

| World        | Treatment                       |
| ------------ | ------------------------------- |
| Brands       | Low-intensity pearl/satin white |
| Systems      | Controlled warm amber           |
| Intelligence | Restrained violet/electric blue |
| Security     | Restrained cyan                 |

They appear along the lintel/upright and converge along the sill. The neutral charcoal structure remains dominant. A small accessible text line outside the decorative SVG names the worlds; on mobile those labels become four short color ticks while content remains available in the dictionary-driven page context.

## Alex Core junction

The junction is a small faceted architectural connection near the threshold base. It consists of a charcoal metal plate, a recessed center, and a short leader line labeled with the dictionary's existing `ALEX CORE` value. It is not a circle, sphere, orb, or reactor.

## Lighting simulation

Static CSS/SVG gradients provide:

- a warm workstation key near the desk;
- a narrow cool rim near the monitor/head area;
- a neutral fill that preserves image detail;
- specular value changes across threshold front and side faces;
- a narrow bevel highlight and dark recess.

The diagnostic `html[data-codex-glow="off"]` state removes the scene fill and portrait key/rim overlays. The threshold remains readable and dimensional in `en-1440x900-glow-disabled.png`.

## Typography and layout

- One semantic H1 is present and fully visible before hydration (there is no hydration boundary).
- The full approved dictionary statement is displayed; it is not truncated to “I build brands.”
- English uses a balanced 2–4-line display depending on viewport, with a maximum measure around 12 characters.
- Supporting content and role line reuse the production dictionary without visible-copy hardcoding.
- The H1 remains the strongest text element in normal and grayscale review.
- Technical/mixed-direction role content uses `dir="auto"`; the Lab's English technical label and ALEX CORE label use `dir="ltr"`.

## English behavior

English keeps the image on inline-end and copy on inline-start. The 1440 and 1280 captures preserve a clear text/scene boundary, while the portrait mask blends through that boundary without covering the headline. All actions use the existing production destinations and dictionary labels.

## Arabic and RTL behavior

- Document `lang="ar"` and `dir="rtl"` come from the existing locale layout.
- Arabic copy occupies the right side while the unmirrored photograph occupies the left.
- The Arabic portrait uses a separate object-position.
- Arabic H1 uses natural line height and no letter spacing or character splitting.
- World labels reverse visual row direction without changing their semantic dictionary mapping.
- Arabic screenshots were reviewed at 1440, 1280, 390, and 320 widths; there is no horizontal overflow.

## Mobile behavior

At widths below 768 px the page becomes a deliberately authored vertical composition:

- H1 and copy lead, rather than shrinking the desktop grid.
- The scene is capped at 44svh and follows the actions.
- The lintel is removed, leaving a simplified L-shaped upright/sill with one side face.
- World labels become four short ticks.
- Alex's head and one defining monitor remain visible.
- Buttons stack and retain a minimum 44 px height.
- The 320 × 568 first viewport contains the complete H1, role, human/supporting copy, and primary action; remaining actions and the environmental scene continue below through normal page scrolling.
- Automated measurement reports zero horizontal overflow at all captured sizes.

## Accessibility

- Exactly one H1 on every audited route/viewport.
- Correct `lang` and `dir` from the locale layout.
- Accurate localized workstation alt text; no duplicate wrapper label.
- Decorative threshold is `aria-hidden="true"` and its SVG is unfocusable.
- Content is complete without decorative SVG/CSS layers.
- Skip link and global `:focus-visible` styling remain available.
- Real actions are links; View CV remains a non-link `aria-disabled="true"` status with Coming Soon.
- No content depends on motion; no animation exists.
- No canvas or hidden focus target exists.
- Forced-colors mode hides the decorative scene and preserves content/action borders.

## Files created

```text
src/app/[locale]/codex-hero-lab/page.tsx
src/components/codex-hero-lab/CodexHeroLab.tsx
src/components/codex-hero-lab/CodexHeroComposition.tsx
src/components/codex-hero-lab/CodexHeroPortrait.tsx
src/components/codex-hero-lab/CodexBuilderThreshold.tsx
src/components/codex-hero-lab/codex-hero-lab.css
docs/evidence/codex-hero-lab/*.png
docs/CODEX_HERO_LAB_PHASE_1_REPORT.md
```

## Files modified

No pre-existing production source, dictionary, sitemap, SEO utility, homepage, existing Hero Lab, world section, case study, live preview, asset, package manifest, or lockfile was modified for Phase 1.

The prior audit document was formatted by the existing repository-wide Prettier command while validating this phase; its recommendations/content were not changed intentionally.

## Production homepage regression result

| Check                                             | Result                            |
| ------------------------------------------------- | --------------------------------- |
| `/en` and `/ar` homepage files                    | Not modified                      |
| `HeroV2Section` and current production Hero files | Not modified                      |
| Existing `/en/hero-lab` and `/ar/hero-lab`        | Not modified; still generated     |
| World sections / Global Traveler / Builder Map    | Not modified                      |
| Case studies / previews                           | Not modified                      |
| `package.json` / lockfile                         | Not modified; no dependency added |
| `sitemap.ts`                                      | Not modified; Codex Lab absent    |
| Production build                                  | Pass, 46 static/generated pages   |

## Validation results

| Validation                     | Result                                                                |
| ------------------------------ | --------------------------------------------------------------------- |
| `npm run lint`                 | Pass                                                                  |
| `npm run type-check`           | Pass                                                                  |
| `npm run format:check`         | Pass                                                                  |
| `npm run build`                | Pass                                                                  |
| `/en/codex-hero-lab`           | Production HTTP route rendered                                        |
| `/ar/codex-hero-lab`           | Production HTTP route rendered                                        |
| Static generation              | Pass; both routes shown as SSG                                        |
| Robots metadata                | `noindex, nofollow`                                                   |
| Sitemap exclusion              | Verified by explicit sitemap source/output policy; no Lab entry added |
| H1 count                       | 1 at every screenshot viewport                                        |
| Canvas count                   | 0                                                                     |
| Horizontal overflow            | 0 px at every screenshot viewport                                     |
| EN image alt                   | Correct existing localized string                                     |
| AR image alt                   | Correct existing localized string                                     |
| Decorative threshold           | `aria-hidden="true"`                                                  |
| Console/page errors            | None across exact screenshot capture run                              |
| Motion/WebGL/GSAP in new files | None                                                                  |

## Screenshot paths

All evidence is new and was captured from the Phase 1 production build at exact viewport dimensions:

```text
docs/evidence/codex-hero-lab/en-1440x900.png
docs/evidence/codex-hero-lab/ar-1440x900.png
docs/evidence/codex-hero-lab/en-1280x800.png
docs/evidence/codex-hero-lab/ar-1280x800.png
docs/evidence/codex-hero-lab/en-390x844.png
docs/evidence/codex-hero-lab/ar-390x844.png
docs/evidence/codex-hero-lab/en-320x568.png
docs/evidence/codex-hero-lab/ar-320x568.png
docs/evidence/codex-hero-lab/en-1440x900-grayscale.png
docs/evidence/codex-hero-lab/en-1440x900-glow-disabled.png
docs/evidence/codex-hero-lab/en-390x844-grayscale.png
```

## Visual self-review

### Passed

- **Grayscale hierarchy:** Alex/workstation and H1 remain the two dominant anchors. The threshold remains visible as a darker engineered volume with a lighter bevel.
- **Image perimeter:** no hard rectangular border is visible across most of the image boundary; the mask merges the top, bottom, and outside edge into the page.
- **Threshold silhouette:** one lintel/upright/sill object, not floating panels.
- **Thickness and side faces:** side planes are clearly differentiated at the lintel, upright, and base.
- **Bevel:** narrow value highlight survives grayscale and glow-disabled states.
- **Head clearance:** no SVG plane, seam, label, or headline crosses Alex's head/face.
- **Monitor visibility:** the defining vertical monitor and workstation context remain visible.
- **H1:** full statement is immediate, high-contrast, and stronger than supporting copy.
- **Four seams:** present at low intensity and subordinate to the charcoal object.
- **Core junction:** small, architectural, and anchored to the base.
- **CTA visibility:** primary and secondary actions are high contrast on desktop/mobile; no hover-only meaning.
- **RTL:** photograph is not mirrored; Arabic uses the opposite image/text placement and separate crop.
- **320 px:** no overflow; readable first viewport; visual continues below rather than being compressed.
- **Glow-disabled:** threshold value structure remains visible without atmospheric key/rim overlays.

### Rejection-gate result

The implementation does not read as detached UI cards, wings/armor, an orb/reactor, a game HUD, or a scaled desktop mobile layout. The workstation remains present and Alex's head is unobstructed. The static frame looks complete without motion.

## Known weaknesses

1. The source photograph remains a side/back environmental portrait; it cannot supply eye contact or a studio-portrait emotional beat.
2. At 320 px the environmental visual is below the initial viewport after the copy and primary CTA. This is intentional for readability, but Alex is not the first visible element on the smallest screen.
3. Four seam colors are necessarily subtle at mobile size; they read as material ticks rather than named worlds until the viewer reaches the visual.
4. The threshold is an SVG/CSS illusion. It has convincing static planes but cannot exhibit changing physical reflections; that limitation is acceptable for the approved static phase.
5. The desktop visual is purposefully dark. Display calibration may reduce separation between the recess and page background, although front/side/bevel planes remain visible in grayscale review.

## Items requiring Alex's approval

1. Approve or reject this static Builder's Threshold composition based on the supplied EN/AR desktop/mobile screenshots.
2. Confirm the desktop hierarchy and environmental workstation crop are sufficiently human-centered without a new portrait shoot.
3. Confirm that copy-first ordering at 320 px is preferred over forcing the workstation into the initial viewport.
4. Confirm the four seams are appropriately restrained rather than requesting stronger color intensity.
5. Confirm the RTL composition and separate crop feel intentional.
6. Decide whether Phase 2 should begin. No Phase 2 work, motion, WebGL, or dependency work has started.

**Stop point:** Phase 1 only. Await static screenshot approval before any motion or production-homepage integration.
