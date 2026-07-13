# Codex Lovable-to-Production Transfer Audit

**Date:** 2026-07-12  
**Scope:** Audit and implementation planning only  
**Production repository:** `C:\Users\Master aLEX\Desktop\portfolio`  
**Visual reference:** `C:\Users\Master aLEX\alex-core-builder`  
**Decision:** Keep the production portfolio as the sole foundation. Reimplement selected visual principles natively; do not merge or copy the Lovable application.

---

## 1. Executive summary

The production portfolio is architecturally much stronger than the Lovable reference. It is a Next.js 16.2.10 / React 19.2.4 App Router application with static locale generation, typed English and Arabic dictionaries, document-level `lang`/`dir`, localized metadata and structured data, static case-study routes, deferred live previews and motion, explicit WebGL capability tiers, reduced-motion branches, lifecycle cleanup, and recorded performance/QA budgets. None of that should be replaced.

Lovable feels visually stronger in the areas that matter to a first impression because it makes fewer, larger compositional decisions. Its fixed right-side spatial field creates continuity; its central object has a readable silhouette; its icosahedron, torus geometry, physical/transmission materials, environment lighting, key/fill/point lights, perspective camera, and slow coordinated motion produce actual form. Its portrait uses a dedicated remote-managed 1.35 MB PNG and dissolves the perimeter with a radial mask, bottom shadow, colored rim pools, grain, and foreground paths. These techniques cause portrait, typography, atmosphere, and 3D to read as one scene.

The production implementation is technically disciplined but visually under-resolved. Its current Builder Frame is made from single-plane quads rendered with `depth: false`; the fragment shader mainly draws translucent bodies and emissive rims. There is no thickness, side face, normal response, shadow, reflection, environment response, or materially differentiated surface. The result is exactly what the evidence suggests: floating rectangles whose shape disappears unless glow carries it. The portrait plate preserves a rectangular aspect box and uses a cropped derivative of the workstation image; CSS rim and depth-shadow overlays soften the card but do not separate the subject. The Global Traveler moves between viewport-relative anchor coordinates using overall page progress, so it is a useful navigation token but not yet a convincing spatial protagonist.

The recommended direction is **The Builder’s Threshold**: a human-centered, cinematic workstation scene in which the existing image remains honest and contextual, while a single thick, asymmetric architectural threshold wraps behind and partially in front of the workstation silhouette. It is not an orb, reactor, armor, wings, or a field of modules. Four worlds appear as four material seams/inlays within one continuous structure. The portrait is treated as a wide environmental image—not falsely presented as a face-forward studio portrait. Text occupies the quieter inline-start side; the workstation and threshold occupy inline-end, mirrored compositionally for Arabic without mirroring the photograph itself.

For Phase 1, build one static composition only in new noindex routes `/en/codex-hero-lab` and `/ar/codex-hero-lab`. Use HTML/CSS/SVG and the existing workstation derivatives first. Do not initialize WebGL or motion. Approval must be based on desktop and true mobile screenshots. Only after static approval should motion and optional 3D be considered.

Dependency recommendation: **do not add Three.js packages in Phase 1.** If the approved static composition demonstrates that volumetric threshold geometry materially improves it, use `three` directly in Phase 2/3 behind a route-scoped dynamic import. Do not add React Three Fiber or Drei initially. Direct Three.js gives physically based materials, geometry thickness, lights, camera, and disposal without paying for an additional React reconciler or broad helper package. R3F/Drei improve iteration speed, but the production scene is deliberately one bounded object and the existing lifecycle policy is already imperative.

---

## 2. Main portfolio architecture

### Runtime and build

| Area          | Production state                                                                                     | Transfer constraint                                             |
| ------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Framework     | Next.js `16.2.10`, App Router                                                                        | Remains the foundation                                          |
| UI runtime    | React / React DOM `19.2.4`                                                                           | No alternate app shell                                          |
| Styling       | Tailwind CSS 4 via PostCSS plus substantial `globals.css`                                            | New Lab styles must be locally owned                            |
| Motion        | GSAP `3.15.0`, `@gsap/react` `2.1.2`, ScrollTrigger                                                  | One owner per timeline; deferred                                |
| 3D            | Zero-dependency native WebGL                                                                         | Existing capability/lifecycle policy is reusable                |
| Static output | Locale and project params generated statically; reports record 42 SSG pages before the Lab additions | New Lab routes must preserve SSG                                |
| Testing       | ESLint, TypeScript, Prettier, Playwright scripts, phase-specific checks                              | Add evidence, not runtime dependencies, in implementation phase |

There is no standalone `tailwind.config.*`; Tailwind 4 is configured through CSS/PostCSS. Design tokens live in `globals.css` and `src/lib/design/tokens.ts`, with layout-specific tokens in `src/lib/layout/*`.

### Routing, locale, and content

- `/` redirects temporarily to `/en`.
- `src/app/[locale]/layout.tsx` statically generates `en` and `ar`, sets `lang`, and maps direction through `directions[locale]`.
- English and Arabic are typed together through `Dictionary` in `src/content/translations/types.ts`; `en.ts` and `ar.ts` must remain structurally identical.
- Homepage composition is server-rendered in `src/app/[locale]/page.tsx`: Hero, Method/Builder Map, Brands/Gymura, Systems/Restaurant/Texas Funds, Intelligence, Security, Future, Manifesto, Contact.
- `/[locale]/projects` and `/[locale]/projects/[slug]` are statically enumerated. Gymura and Restaurant own case-study GSAP wrappers; live previews are preserved.
- The existing `/[locale]/hero-lab` is a noindex three-variant experiment. It is excluded from the hand-written sitemap by omission. The requested next phase should use a new single-direction `/[locale]/codex-hero-lab`, avoiding mutation of old evidence.

### SEO and discoverability

The production system has centralized canonical/alternate metadata, localized homepage/project metadata, dynamic Open Graph images, Person/WebSite/ProfilePage/CreativeWork JSON-LD, a localized sitemap, robots output, manifest, and icons. A Lab route must return `robots: { index: false, follow: false }`, must not emit homepage structured data, and must remain absent from `sitemap.ts`, header, footer, and internal navigation.

### Motion and lifecycle

- `DeferredHomepageRailMotion` keeps GSAP out of the synchronous homepage graph.
- `HomepageRailMotion` owns homepage ScrollTriggers through `gsap.matchMedia`, prepares decorations, refreshes after layout, and tears down the Global Traveler.
- Rail utilities distinguish semantic order from RTL drawing origin and complete immediately for reduced motion.
- Builder Map and Hero WebGL use dynamic imports, ResizeObserver, IntersectionObserver, page-visibility pause, DPR caps, 30 fps caps, context-loss handling, explicit buffer/program deletion, and `WEBGL_lose_context`.
- Eligibility explicitly prevents WebGL on reduced motion and constrained devices. This policy should be retained.

### Section architecture

| Chapter      | Native implementation                                                    | Important invariant                                    |
| ------------ | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| Hero         | `HeroV2Section` + `HeroVisualStack` + portrait + raw-WebGL Builder Frame | LCP candidate, semantic H1, bilingual CTAs             |
| Method       | `MethodSection`, HTML Builder Map, optional `BuilderMap3D`               | Semantic map must survive without canvas               |
| Gymura       | `WorldBrandsSection` and case-study route                                | Keep real content/live preview                         |
| Restaurant   | `WorldSystemsSection` / proof composition and case study                 | Preserve Arabic-first product story and preview        |
| Texas Funds  | `SystemsTexasFundsBranch` inside Systems                                 | Remains supporting branch, not a fake standalone world |
| Intelligence | `WorldIntelligenceSection` / `IntelligenceArchitecture`                  | Diagram stays readable without motion                  |
| Security     | `WorldSecuritySection`                                                   | Do not convert into generic neon HUD                   |
| Future       | `FutureDirectionSection`                                                 | Roadmap meaning over spectacle                         |
| Manifesto    | `ManifestoV2Section` using workstation imagery                           | Human closing beat                                     |
| Contact      | `ContactV2Section`                                                       | Action and focus clarity first                         |

### Recorded quality baseline

The reports record passing lint/type/build/SEO/accessibility checks, desktop LCP around 0.8–0.9 s, mobile simulated LCP around 4.1–4.6 s, CLS 0, and TBT around 40–60 ms mobile. The Phase 7.3G budget allows at most +80 KB transferred homepage JS, a single 3D async chunk no larger than 150 KB transferred, desktop LCP regression no more than 150 ms, mobile no more than 200 ms, and CLS no more than 0.01. These are ceilings, not targets.

---

## 3. Lovable architecture

Lovable is a Vite 8 / TanStack Start and Router application using React 19.2, Tailwind 4, Three `0.185.1`, React Three Fiber `9.6.1`, Drei `10.7.7`, and GSAP `3.15.0`. The route is English-only and the full portfolio is concentrated in `Portfolio.tsx` (about 1,150 lines), with the visual system split into `Portrait.tsx`, `AlexCore.tsx`, and `Kinetic.tsx`.

Its strength is compositional concentration, not architectural completeness:

- A fixed full-height spatial layer covers the right 55% on large screens.
- Section intersection changes one `world` state, which recolors the 3D core and atmospheric tint.
- `AlexCore` combines an icosahedral metal core, transmission shell, emissive sphere, four torus rings, four directional nodes, connector lines, night environment, fog, two directional lights, ambient light, and a point light.
- Camera is `[0,0,5.5]`, FOV 42. Pointer rotation, color lerp, ring rotation, breathing scale, and Drei `Float` give coordinated idle motion.
- Portrait dissolves via a radial alpha mask, bottom shadow, blue/violet rim pools, overlay grain, foreground SVG paths, and limited rAF scroll parallax.
- Kinetic words reveal once with IntersectionObserver and a consistent cubic-bezier.

Limitations are substantial:

- `frameloop="always"` runs whenever the fixed canvas is mounted; there is no offscreen/visibility pause, DPR adapts up to 1.75, and `Environment preset="night"` may trigger supporting asset/network work.
- Reduced motion is sampled once after mount; it does not subscribe to preference changes. It removes the canvas but CSS `.pulse-ring`, `.float-slow`, smooth scrolling, word transitions, and portrait parallax do not share a comprehensive reduced-motion policy.
- The app is English-only, fixed `lang="en"`, no RTL, no localized routes/dictionaries, and no case-study route architecture.
- Metadata is basic and includes remote Lovable/R2 Open Graph imagery; there is no production sitemap/robots/manifest/structured data equivalent.
- The portrait is a remote-managed Lovable asset descriptor rather than a repository image. Its URL is `/__l5e/assets-v1/...`, size 1,416,512 bytes; it is not safe or portable for production.
- `Portfolio.tsx` couples navigation, all sections, copy, intersection state, and composition. Many installed shadcn/Radix files are unused by the portfolio.
- Accessibility is partial: decorative canvas is hidden correctly and basic labels exist, but a decorative portrait wrapper has `aria-label` while the nested image also has alt text, section motion is not consistently gated, and color/keyboard/landmark behavior lacks the production audit depth.
- GSAP is declared but the inspected custom visual implementation does not use it; the choreography is CSS transitions, IntersectionObserver, rAF, and R3F `useFrame`.

---

## 4. Detailed visual comparison

| Visual feature         | Lovable implementation                                                       | Main portfolio implementation                                       | Why Lovable feels stronger or weaker                                                           | Transfer?        | Native reimplementation                                                         | Main risks                | Expected performance cost |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------- | ------------------------- | ------------------------- |
| Hero composition       | Large text left, portrait/spatial field right, fixed depth layer             | Two-column copy plus bounded portrait plate/Builder Frame           | Lovable reads as one field; production reads as content next to an effect                      | Yes              | One asymmetrical threshold scene around workstation image                       | LCP, crowding             | Phase 1: negligible       |
| Portrait integration   | Radial mask, bottom dissolve, rim pools, grain, foreground paths             | Rectangular plate with rim and depth-shadow overlays                | Lovable obscures perimeter and crosses layers; production preserves the card silhouette        | Yes              | Use edge-aware gradients/masks and foreground occlusion suited to workstation   | Overmasking head/monitors | CSS only                  |
| Subject masking        | Elliptical image mask, not true subject cutout                               | No subject alpha matte                                              | Lovable hides the photo edge but may also look hazy; production is honest but boxed            | Yes, restrained  | Multi-stop mask based on actual dark background; no fake cutout claim           | Halo/banding              | Negligible                |
| Fore/background layers | Glow behind, photo, rim overlays, paths in front, canvas behind              | Fallback/WebGL behind, portrait, overlays                           | Lovable has clear crossings; production layers are mostly parallel plates                      | Yes              | Back wall, workstation plane, threshold jamb crossing foreground, light haze    | Obstruction               | Low                       |
| 3D silhouette          | Central icosahedron plus four orbital rings                                  | Six thin rectangular quads and lines                                | Lovable silhouette is recognizable in grayscale; production relies on colored edges            | Principle only   | One asymmetric thick threshold, not Lovable orb                                 | Becoming armor/wings      | Medium if 3D              |
| Geometry thickness     | Volumetric icosahedron, sphere, torus                                        | Zero-thickness planar triangles                                     | Direct technical cause of floating-rectangle look                                              | Yes              | Extruded frame segments with bevels and visible side faces                      | Polygon/bundle complexity | Low–medium GPU            |
| Material definition    | Physical metal, clearcoat, transmission, environment response                | Custom unlit translucent body/rim shader                            | Lovable has changing highlights that explain form; production has no normals/lights            | Yes              | MeshStandard/Physical materials with bounded roughness/metalness                | Black crush               | Medium                    |
| Lighting               | Ambient + two directional + point + environment                              | Shader colors only                                                  | Lovable form remains readable without glow; production has no real key/fill                    | Yes              | Warm workstation key, cool rim, dim fill, environment reflection                | Excess bloom look         | Low–medium                |
| Rim light              | Light-driven plus CSS portrait rims                                          | CSS rim overlay and emissive plate rims                             | Lovable rim follows volume; production rim is screen-space decoration                          | Yes              | Real back/rim light on geometry; CSS only for photo blend                       | Halo                      | Low                       |
| Camera                 | Perspective FOV 42, centered object                                          | FOV 28, nearly orthographic-looking shallow quads                   | Lovable shows depth; production compresses already-flat shapes                                 | Yes              | 32–38° FOV, slightly elevated three-quarter angle                               | Distortion                | None                      |
| Perspective/depth      | Several radii, tilts, z positions, fog                                       | Small z offsets on planes, depth buffer disabled                    | Production z values cannot occlude or shade convincingly                                       | Yes              | Enable depth; use 3–4 meaningful planes, not many micro-layers                  | Z fighting                | Low                       |
| Color                  | World color interpolates through one object/tint                             | Separate colored modules plus CSS atmosphere                        | Lovable has color unity; production resembles labeled swatches                                 | Yes              | Four inlays in one neutral structure; active seam migrates color                | Rainbow clutter           | Negligible                |
| Glow                   | Supports lit geometry                                                        | Defines geometry                                                    | Glow is effective in Lovable because form exists first                                         | Yes, subordinate | Limit glow to contact/rim accents after material readability                    | Generic cyberpunk         | Low                       |
| Type scale             | Large Space Grotesk hierarchy with short statements                          | Semantic, localized but more conservative and text-dense            | Lovable creates a decisive first beat; production is clearer but less dramatic                 | Yes              | Increase statement scale/line breaks without changing meaning                   | Arabic overflow           | None                      |
| Type reveal            | Per-word once-on-view CSS cascade                                            | GSAP line clip plus emphasis color sequence                         | Lovable cadence is visible; production reveal is short and technically neat but less spatial   | Reimplement      | Line/phrase masks; Arabic phrase groups, never characters                       | FOUC/readability          | Existing GSAP             |
| Section transitions    | Fixed core persists and recolors on section entry                            | Gradient continuity, rails, Global Traveler                         | Lovable continuity is obvious; production continuity is semantically richer but visually tiny  | Yes              | Let traveler/inlay state change one scene property per chapter                  | Canvas persistence cost   | Medium                    |
| Scroll choreography    | Section intersection changes world; portrait parallax                        | Many once-only rails plus global scrub                              | Production has more animation but no dominant choreography                                     | Yes, simplify    | One primary transition per section, secondary rail only                         | Trigger density           | Existing GSAP             |
| Motion timing/easing   | Slow Float, color lerp, 0.9 s word reveal                                    | 1.6 s frame reveal, 0.75 s portrait, many 0.22–0.55 s beats         | Lovable feels calmer/coherent; production has many similarly weighted events                   | Yes              | Opening 1.6–2.2 s with three beats; section transitions 0.8–1.2 s               | Sluggishness              | None                      |
| Idle motion            | Object float, ring rotation, breathing scale                                 | Frame pulse and pointer tilt                                        | Lovable motion belongs to silhouette; production pulse cannot rescue flat form                 | Yes, minimal     | Sub-1° drift or light travel; stop offscreen/hidden                             | Motion sickness/GPU       | Low                       |
| Pointer                | Damped core rotation                                                         | Damped frame tilt on fine pointer                                   | Both restrained; Lovable reveals actual volume                                                 | Yes              | 2–3° camera/structure parallax, photo nearly fixed                              | Gimmick                   | Low                       |
| Spatial continuity     | Fixed canvas across many sections                                            | Small fixed traveler plus per-section decorations                   | Lovable stronger at continuity but expensive and dominant                                      | Partial          | Traveler becomes a material light seam, not a roaming orb                       | Persistence complexity    | Low–medium                |
| Global Traveler        | Implicit: the whole Alex Core changes                                        | Fixed dot/glow/trail interpolated by page progress                  | Production idea is promising but too small and page-progress mapping can miss section geometry | Yes later        | Section-scoped waypoints with chapter progress and clamped paths                | Resize/RTL drift          | Existing GSAP             |
| Builder Map            | Same 3D core metaphor continues                                              | Semantic HTML + raw-WebGL glowing quads/nodes                       | Production meaning/accessibility stronger; visual 3D still planar                              | Yes later        | Preserve HTML; use thick diagram junctions only after Hero language is approved | Duplicate metaphor        | Async medium              |
| Gymura                 | Large branded frames and persistent world tint                               | Real project content, rail, preview, brand chapter                  | Production content stronger; Lovable composition more poster-like                              | Selectively      | Add one editorial crop/brand plane and traveler color handoff                   | Overshadowing product     | CSS/GSAP low              |
| Restaurant             | Purpose-built product panels                                                 | Strong semantic proof and live preview                              | Production more credible; Lovable more dramatic in spacing                                     | Selectively      | One order-flow depth transition, no decorative 3D dashboard                     | UI-as-art trap            | Low                       |
| Texas Funds            | Dedicated bot-style visual beat                                              | Supporting Systems branch                                           | Lovable overstates it; production hierarchy is correct                                         | Minimal          | One amber data pulse on existing branch                                         | Fake product claims       | Negligible                |
| Intelligence           | Violet spatial diagrams/cards                                                | Semantic architecture diagram                                       | Production clearer; Lovable atmosphere stronger                                                | Yes              | Depth-separated architecture nodes with a single active path                    | HUD look                  | Low                       |
| Security               | Cyan system panels                                                           | Security rails/stages                                               | Both risk generic cyber visuals                                                                | Limited          | Use structural closure/locking seam, not scanning grids                         | Cliché                    | Low                       |
| Manifesto              | Portrait returns as a human counterweight                                    | Workstation image and convergence                                   | Same intent; production should retain honest source context                                    | Yes              | Reuse visual language at lower intensity, no extra canvas                       | Repetition                | None                      |
| Mobile                 | Stacked Tailwind layouts; canvas still possible unless reduced               | Dedicated responsive rules and WebGL eligibility                    | Production policy stronger; old Lab variants are not proof of final composition                | Reimplement      | No canvas in Phase 1; crop and threshold rebuilt for portrait aspect            | Scaled desktop            | None                      |
| Reduced motion         | Canvas omitted after client preference read; other CSS/rAF motion incomplete | Comprehensive matchMedia/static completion and no-WebGL eligibility | Production clearly stronger                                                                    | No Lovable code  | Keep all content in final state; no parallax, scrub, or canvas                  | Hidden initial state      | None                      |

---

## 5. Why previous implementations failed

1. **The implementation used 2D primitives to promise 3D.** `builder-frame-scene.ts` generates two triangles per plate, no extrusion, and creates WebGL with `depth: false`. A perspective matrix and z coordinates do not create visible volume when the object has no side faces, normals, depth testing, or light response.
2. **The material model is edge glow, not material.** The fragment shader derives body/rim from UV distance to the quad edge. It cannot produce a key highlight, roughness gradient, reflection, bevel, cast shadow, or occlusion. Near-black translucent bodies disappear in a still image.
3. **The portrait asset was mislabeled conceptually.** `optimize-portrait-images.mjs` says “face-forward crop,” but every `alex-portrait-*.webp` is extracted from `alex-workstation-original.png`. Cropping cannot change the recorded camera angle or reveal a face that is not in the source.
4. **The CSS plate keeps the rectangle legible.** `HeroPortraitPlate` reserves a rectangular image, while the rim and bottom shadow are overlays inside it. Without an alpha matte or scene-matched edge dissolve, the perimeter still reads first.
5. **Too many variants prevented art-direction commitment.** A, B, and C explore different metaphors, typography, assets, and rendering approaches. The evidence documents technical completion, but selection was deferred; no one direction received the iterative lighting, crop, and negative-space work required for finish.
6. **Checklist parity substituted for screenshot hierarchy.** WebGL, pointer, glow, fallback, and motion can all pass independently while the first frame remains weak. A cinematic Hero must pass as a still before any runtime feature matters.
7. **Motion had no strong subject.** Revealing/pulsing flat plates makes their weakness more visible. Lovable’s motion works because it changes specular highlights and the silhouette of actual volumes.
8. **World representation became four colored rectangles.** This is literal but visually generic. Four worlds should be encoded as material behavior, seams, or paths inside one authored object.
9. **The Traveler is disconnected from photographic space.** It is a small fixed UI token with a trail, not a light or object that appears to inhabit the Hero/section surfaces.
10. **The first frame depends on effects arriving.** If geometry is weak or invisible before animation/WebGL activation, a screenshot, slow device, reduced-motion view, or failed context exposes an unfinished composition.

---

## 6. Portrait asset limitations

### What the existing workstation source can do

- Support a cinematic environmental portrait: Alex at work, side/back view, screens and workstation as evidence of practice.
- Carry a wide or diagonal composition in which the environment, not facial expression, is the narrative subject.
- Accept dark-edge blending where source background is already compatible.
- Support contextual foreground occlusion around desk/screen edges and a light seam that traces the working space.
- Produce desktop/mobile/manifesto crops; existing WebP derivatives are small (about 21–58 KB).

### What it cannot do

- Become a face-forward studio portrait.
- Create direct eye contact, symmetrical head-and-shoulders framing, or a clean isolated torso.
- Provide missing body/face pixels outside the crop.
- Sustain a composition whose emotional premise depends on facial expression.
- Produce a reliable subject cutout without manual masking; dark hair/clothing/background edges may be ambiguous.

### Best composition with the current image

Use it as an **environmental workstation portrait**, larger and wider than the current portrait card. Keep Alex and the primary workstation readable, allow the dark perimeter to dissolve into the page, and place the architectural threshold behind the head/upper body with only one safe foreground crossing near the desk or outer shoulder. Never cross the head/face. Text belongs in the image’s quiet negative-space counterpart, not on top of busy monitors.

Compositions likely to fail: centered studio bust, face-led editorial cover, tight oval portrait, symmetrical reactor/core behind the torso, wings/armor around shoulders, multiple floating cards in front of screens, and any crop that removes the workstation while retaining only an indistinct back/side head.

### Difference from Lovable

Lovable references a separate `alex-portrait-cinematic.png` through an asset descriptor. It is remote/Lovable-managed (`/__l5e/assets-v1/...`), 1,416,512 bytes, and absent as a normal repository image. It is not the same production file path or optimization pipeline. It must not be copied or treated as a deployable production asset. Its visual suitability should be judged as reference only.

### Dedicated new image specification (requires Alex approval)

A major improvement would require a real new photograph, not generation:

- Camera: 20–35° three-quarter angle toward camera; eyes visible, optionally looking just off lens.
- Framing: vertical three-quarter body or waist-up, with generous negative space on both inline sides; do not crop hands/shoulders tightly.
- Lighting: soft neutral key at 45°, subtle cool rim from the workstation side, controlled warm practical light, visible shadow detail in dark clothing.
- Background: matte charcoal/black studio or a clean real workstation at least 2–3 stops darker than the face; no baked neon effects.
- Body visibility: head, both shoulders, torso to waist, and optionally one hand interacting with the desk.
- Capture: RAW plus 16-bit TIFF/PNG master; minimum 4000 × 5000 px vertical, or 6000 × 4000 px horizontal if workstation context is required. Also capture a clean background plate from the locked camera.

---

## 7. Lovable file classification

### A. Safe to reuse directly (after verification and attribution review)

No whole visual component is safe to copy directly. Only small, generic implementation ideas qualify: clamp/damping math from `Portrait.tsx`/`AlexCore.tsx`, world color interpolation, simple IntersectionObserver-once logic from `Kinetic.tsx`, and numeric camera/easing experiments. Even these should normally be rewritten to the production utilities and reduced-motion policy.

### B. Reimplement, do not copy

| Lovable file                   | Classification and reason                                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/Portfolio.tsx` | **B.** Valuable composition, section pacing, persistent-world state, color migration, and hierarchy; monolithic architecture/copy must not transfer. |
| `src/components/Portrait.tsx`  | **B.** Reimplement edge dissolve, rim pools, grain, foreground crossings, and parallax using approved local assets and Next Image.                   |
| `src/components/AlexCore.tsx`  | **B.** Study geometry/material/light/camera coordination; do not copy the orb/reactor form or R3F ownership.                                         |
| `src/components/Kinetic.tsx`   | **B/A fragments.** Reimplement semantic phrase reveals in existing GSAP ownership; the tiny observer pattern is generic.                             |
| `src/styles.css`               | **B.** Tokens, grain, hierarchy, and mask ideas are reference; production tokens/Arabic/fonts/reduced motion own the result.                         |

### C. Do not transfer

| Lovable file or family                                                                                                                             | Classification and reason                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/start.ts`, `src/server.ts`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/README.md` | **C.** TanStack/Vite/Lovable routing and SSR infrastructure conflicts with Next App Router. Remote OG/font references are not acceptable transfer. |
| `src/assets/alex-portrait-cinematic.png.asset.json`                                                                                                | **C.** Remote asset pointer, not a portable local production asset.                                                                                |
| `src/lib/lovable-error-reporting.ts`, `error-page.ts`, `error-capture.ts`                                                                          | **C.** Lovable-specific runtime/error integration.                                                                                                 |
| `src/components/ui/*` (all generated shadcn/Radix files)                                                                                           | **C.** Unused by the custom portfolio composition and would duplicate the production UI system.                                                    |
| `src/hooks/use-mobile.tsx`                                                                                                                         | **C.** Production uses CSS, capability checks, and motion media; boolean viewport branching is insufficient.                                       |
| `src/lib/utils.ts`                                                                                                                                 | **C unless an exact missing utility is identified.** Generic class merging does not justify transfer.                                              |
| `routeTree.gen.ts`, `.lovable/*`, `components.json`, `bunfig.toml`, `bun.lock`, `vite.config.ts`, `eslint.config.js`, `tsconfig.json`              | **C.** Toolchain/generated/config files belong to the reference stack.                                                                             |
| `public/favicon.ico`                                                                                                                               | **C.** Production already owns manifest/icons.                                                                                                     |

### D. Requires Alex approval

| Item                                                    | Approval required                            |
| ------------------------------------------------------- | -------------------------------------------- |
| `package.json` dependency concepts (`three`, R3F, Drei) | Any new runtime dependency and budget change |
| Dedicated portrait capture or asset replacement         | Identity, crop, licensing, art direction     |
| Major Hero copy/CTA restructuring                       | Content and hierarchy                        |
| Persistent canvas beyond Hero                           | Performance and experience budget            |
| Raising +80 KB / 150 KB chunk / LCP budgets             | Explicit exception                           |
| Removing or replacing current `/hero-lab`               | Evidence/history decision                    |

---

## 8. Features to transfer

Transfer principles, not files:

1. One dominant silhouette visible in a static frame.
2. Actual thickness, bevel, lighting, and material response where 3D is used.
3. Portrait edges dissolved into a scene through multiple depth layers.
4. One persistent color/material logic for the four worlds.
5. A restrained perspective camera and slow coherent motion.
6. Foreground paths/occluders that cross the portrait only at safe locations.
7. Larger, shorter typography beats with phrase-level reveal.
8. Section transitions that mutate one continuing system rather than launching unrelated effects.
9. Environmental lighting before glow.
10. Human context first; technology supports it.

## 9. Features not to transfer

- Orb/icosahedral reactor as Alex’s identity.
- Always-running fixed canvas and global render loop.
- Drei environment preset as an implicit network/runtime dependency.
- Remote Lovable/R2 image and font URLs.
- English-only strings, fixed `lang="en"`, and physical left/right layout assumptions.
- Monolithic `Portfolio.tsx` or Vite/TanStack runtime structure.
- Per-word English animation applied blindly to Arabic.
- Generic project cards/panels that replace real content/live previews.
- CSS animation without a global reduced-motion override.
- Installed UI component inventory unrelated to the production design system.

---

## 10. Dependency recommendation

### Comparison

| Criterion                     | Existing native WebGL                       | `three` direct                                                                               | `three` + R3F + Drei                                                                                       |
| ----------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Material quality              | Must implement normals/PBR/shadows manually | Strong built-in standard/physical materials, lights, loaders                                 | Same Three quality plus React abstractions/helpers                                                         |
| Complexity for authored scene | High once thickness/PBR is required         | Moderate                                                                                     | Low–moderate for iteration                                                                                 |
| Maintainability               | Small but specialist shader/math code       | Familiar imperative scene graph                                                              | Declarative but adds reconciler/lifecycle layer                                                            |
| Bundle                        | Current scene tiny                          | Typical carefully tree-shaken async scene roughly 120–170 KB compressed; measure exact build | Common Three + Fiber + helpers often roughly 170–260+ KB compressed depending imports; measure exact build |
| Async loading                 | Already implemented                         | Straightforward dynamic import                                                               | Straightforward client dynamic import                                                                      |
| Lifecycle                     | Fully manual and already disciplined        | Manual renderer/geometry/material/texture disposal                                           | R3F helps mount lifecycle; custom resources still need disposal care                                       |
| Accessibility                 | Decorative only; HTML fallback              | Same                                                                                         | Same                                                                                                       |
| Mobile fallback               | Existing eligibility strong                 | Reuse it                                                                                     | Reuse it                                                                                                   |
| SSR safety                    | Existing client boundary                    | Client-only dynamic import                                                                   | Client-only Canvas boundary                                                                                |
| Iteration speed               | Slow for PBR/art direction                  | Good with dev controls                                                                       | Fastest                                                                                                    |

### Clear recommendation

1. **Phase 1:** add nothing. Static HTML/CSS/SVG composition only.
2. **If static approval proves 3D is necessary:** request approval for exact package `three` at the then-current locked version compatible with the project. Use direct Three.js only.
3. Do **not** add `@react-three/fiber` or `@react-three/drei` for the first production scene. The scene is a single owned architectural threshold; Fiber/Drei’s iteration benefit does not yet justify their bundle and reconciler surface.
4. Reconsider R3F/Drei only if approved scope expands to multiple materially distinct scenes, GLTF assets, complex postprocessing, or shared scene composition.

### Proposed dependency behavior if approved

- Package: `three` — BufferGeometry, Extrude/Box geometry, MeshStandard/PhysicalMaterial, lights, camera, renderer, optional PMREM with a local environment only.
- Expected async impact: budget **≤150 KB compressed for the complete Lab scene chunk**; if measured output exceeds it, reject or reduce features. Do not rely on an estimate as acceptance evidence.
- Routes affected initially: `/en/codex-hero-lab`, `/ar/codex-hero-lab` only. Homepage receives no chunk before Phase 3 approval.
- Fallback: identical approved CSS/SVG still composition; canvas `aria-hidden`, non-blocking, reserved aspect ratio.
- Tree shaking: import named modules from `three`; no `three/examples` unless a specific reviewed loader is required; no Drei; no postprocessing/bloom in first pass.
- Disposal: cancel rAF; disconnect observers; remove pointer/visibility/context listeners; dispose every geometry/material/texture/render target; dispose renderer; force context loss only on final teardown; clear canvas references.

---

## 11. One selected Hero direction — The Builder’s Threshold

The existing workstation image establishes Alex as someone building real systems. The scene should embrace that evidence.

- **Composition:** a wide environmental portrait occupies roughly 52–58% of desktop width at inline-end. The image perimeter dissolves into obsidian. A single asymmetric architectural threshold begins behind the workstation, rises beside Alex, crosses behind the head, and returns as one short foreground sill near the desk. It frames activity without framing the body as a card.
- **Text:** inline-start, max 9–11 words per display line, vertically centered slightly above the visual’s center. Keep the current semantic statement and CTAs in Phase 1; art direction may alter line breaks, not meaning.
- **3D structure:** one continuous thick frame with bevels and three depth planes. No separate floating modules. Its void is irregular and follows safe negative space.
- **Four worlds:** four restrained material seams within the same structure: pearl/satin Brands, warm anodized Systems, violet glass Intelligence, cyan brushed Security. At rest all are visible at low intensity; no rainbow glow.
- **Alex Core origin:** not a sphere. It is the small physical junction where the four inlays meet at the desk/threshold base—the origin point of the system path.
- **Lighting:** warm screen/workstation key from below/inline-end, cool narrow rim from behind, dim neutral fill to retain clothing/head detail. Geometry must remain readable with emissive/glow disabled.
- **Materials:** charcoal metal body, satin roughness 0.35–0.5, subtle bevel response, no mirror chrome. Intelligence may use one narrow translucent insert, not a glass slab field.
- **Foreground:** one sill/cable path and sparse dust/grain. No brackets, coordinates, HUD labels, or floating cards.
- **Background:** broad charcoal falloff, low-contrast architectural shadow, no starfield.

---

## 12. Static composition specification (Phase 1)

Desktop reference at 1440 × 900:

- Hero minimum height 760–860 px, accounting for header.
- Content grid approximately 44/56, with generous central negative space.
- Workstation image displayed as environmental landscape/portrait hybrid; crop must preserve Alex’s head and primary monitors.
- CSS mask should retain full opacity around Alex/workstation and fade the outer 12–20% into background; avoid a uniform oval.
- Static threshold constructed with CSS/SVG polygons and gradients sufficient to prove silhouette, thickness, light, and occlusion before WebGL.
- At least one side face and one bevel highlight visible in the screenshot.
- Four seams readable at normal brightness but subordinate to Alex and H1.
- No motion controls or variant selector; the page represents one decision.
- Capture `/en` and `/ar` desktop at 1440 × 900 and 1280 × 800, plus mobile at 390 × 844 and 320 × 568.

Approval question for Phase 1: **Does this still frame look like a finished human-centered portfolio Hero with an integrated environmental portrait?** If no, iterate static art direction only.

---

## 13. Motion specification (Phase 2 only after approval)

Opening sequence, total 1.8–2.2 seconds:

1. Background exposure settles from 92% to 100% (0–0.45 s).
2. Threshold side face/key highlight resolves; no flying assembly (0.18–0.9 s).
3. Workstation portrait resolves from 4 px blur/0.94 contrast and 12 px depth offset (0.35–1.15 s).
4. H1 reveals by semantic phrase (0.55–1.35 s); supporting copy and CTAs follow (0.95–1.65 s).
5. Four seams illuminate sequentially toward the Alex Core junction (1.1–1.9 s), then settle below peak.

Use `power3.out` or a custom ease near `[0.22, 0.75, 0.22, 1]`. Avoid simultaneous unrelated staggers. Pointer interaction moves threshold/camera no more than 2–3°, background 4–6 px, portrait 1–2 px; it must reveal depth rather than make the photo float. Idle motion is optional and limited to a 6–10 second light drift. Pause on IntersectionObserver exit and `visibilitychange`; no motion on coarse pointers. Opening plays once per session, but the settled first frame must be complete without it.

Capture one short recording per locale/desktop direction and stills at start, midpoint, and settled state. Stop for approval.

---

## 14. Mobile specification

Mobile is a new composition, not scaled desktop:

- Visual first only if its reserved height remains ≤46vh; otherwise lead with name/H1 then visual.
- Crop keeps Alex’s head and one defining workstation screen; do not squeeze the entire desktop environment.
- Threshold becomes an L-shaped side/sill with one visible side face; four seams become four short ticks along the sill.
- Copy occupies full width below/above without overlaying the head or monitors.
- CTAs remain at least 44 px high and stack naturally at 320 px.
- No WebGL by default below 1024 px in initial production integration. Use the approved CSS/SVG fallback.
- Remove fine grain and large blur radii if paint cost or banding is visible.
- Test Arabic at 320, 375, 390, and 430 px with natural line wrapping.

---

## 15. RTL specification

- Layout uses logical `inline-start/end`, `margin-inline`, `inset-inline`, and logical transform-origin utilities.
- Arabic text and CTA order follow the current dictionary and document `dir="rtl"`.
- Composition may place text inline-start and visual inline-end, which naturally swaps columns. **Do not mirror the photograph**; doing so falsifies the workstation and any readable screen content. Instead, author a separate crop/object position for Arabic.
- Geometry can mirror at the scene/group level only if the four semantic seam order is explicitly mapped; never reverse Brands → Systems → Intelligence → Security accidentally.
- Arabic reveal uses phrase/line units. No per-character splitting, forced letter spacing, or Latin font substitution.
- Mixed tokens such as ALEX CORE, URLs, and technical product names use isolated `dir="ltr"` spans where required.
- Screenshots must verify head clearance, H1 wrap, logical CTA order, threshold crossing, and traveler direction separately for Arabic.

---

## 16. Performance strategy

- Preserve the static Hero as the LCP path. Do not block image/text paint on canvas or GSAP.
- Keep Phase 1 zero-JS beyond existing Lab control needs; preferably the static Lab route is a server component with no controls.
- Reserve visual dimensions to preserve CLS 0.
- Continue responsive WebP/Next Image with honest `sizes`; do not use the 2 MB PNG directly in the browser.
- If Three is approved, load after first paint and only when the Lab/Hero is near viewport, with DPR max 1.5 and 30 fps cap. Stop completely offscreen/hidden.
- Require build-measured route chunks. Complete scene ≤150 KB transferred and homepage incremental JS ≤80 KB; lower is preferred.
- No remote environment maps, fonts, textures, or Lovable assets. A tiny local neutral environment is optional only after measurement.
- No bloom/postprocessing first pass. Lighting/materials must carry shape.
- Mobile and reduced motion create no WebGL context.
- Re-run EN/AR desktop and EN mobile Lighthouse. Reject regressions beyond: desktop LCP +150 ms, mobile +200 ms, CLS +0.01, or long tasks/TBT materially above baseline.

---

## 17. Accessibility strategy

- Keep all meaningful content in semantic HTML; decorative threshold/canvas is `aria-hidden="true"`, `pointer-events: none`, and unfocusable.
- The workstation image has one localized, accurate alt description. Do not label a decorative wrapper and image redundantly.
- H1 exists and is readable before hydration; motion never splits the accessible name.
- Contrast must pass in the settled and initial static states; do not use glow as the only boundary.
- Reduced-motion branch renders the approved final still immediately, creates no canvas, executes no parallax/scrub, and disables smooth auto movement.
- Maintain focus visibility, skip link, CTA target sizes, and logical source order.
- Do not encode the four worlds only by color; include hidden/visible labels or structural association in the Lab explanation, while the decorative seams remain hidden.
- Test forced colors/high contrast for content legibility; decorative layers may disappear without loss.

---

## 18. Proposed files and architecture

### Create in Phase 1

```text
src/app/[locale]/codex-hero-lab/page.tsx
src/components/codex-hero-lab/CodexHeroLab.tsx
src/components/codex-hero-lab/CodexHeroComposition.tsx
src/components/codex-hero-lab/CodexHeroPortrait.tsx
src/components/codex-hero-lab/CodexBuilderThreshold.tsx
src/components/codex-hero-lab/codex-hero-lab.css
docs/evidence/codex-hero-lab/              # screenshots only after implementation
```

### Modify in Phase 1

```text
src/content/translations/types.ts           # minimal Lab title/back-label only if needed
src/content/translations/en.ts
src/content/translations/ar.ts
```

Do not modify homepage components, existing Hero Lab, sitemap, SEO core, project routes, or production assets in Phase 1. Prefer existing Hero copy so no new dictionary surface is necessary.

### Optional Phase 2 files after approval

```text
src/components/codex-hero-lab/CodexHeroMotion.tsx
src/components/codex-hero-lab/CodexHeroScene.tsx
src/lib/codex-hero/codex-hero-scene.ts       # only if Three/native WebGL approved
src/lib/codex-hero/codex-hero-eligibility.ts # preferably wrap existing policy
scripts/codex-hero-lab-screenshots.mjs
```

### Ownership

- `page.tsx`: locale validation, static metadata/noindex, dictionary lookup.
- `CodexHeroComposition`: semantic layout and source order.
- `CodexHeroPortrait`: Next Image/picture, crops, mask, alt text.
- `CodexBuilderThreshold`: static SVG/CSS fallback; always present.
- `CodexHeroMotion`: sole GSAP owner for opening/pointer DOM motion; `gsap.context`/`useGSAP` cleanup.
- `codex-hero-scene.ts`: sole renderer/camera/geometry/material/rAF owner; returns a small handle matching existing `resize/setActive/setPointer/clearPointer/dispose` convention.
- Dynamic boundary: client-only scene component imports renderer module after eligibility and near-viewport check. The static composition is outside the boundary.
- Asset pipeline: existing workstation original remains the master; derivatives are generated intentionally with `sharp`, documented crop coordinates, WebP/AVIF only if verified. No new portrait is synthesized.
- Fallback: the approved CSS/SVG threshold and image are the canonical design, not a degraded placeholder.
- Noindex: route metadata `robots.index=false`, `follow=false`; no structured data.
- Sitemap: no change required because sitemap entries are explicit; add a regression assertion that `codex-hero-lab` is absent.

---

## 19. Implementation phases

### Phase 1 — static isolated Hero

Create `/en/codex-hero-lab` and `/ar/codex-hero-lab`. Implement one Builder’s Threshold still. No WebGL, motion, Traveler, or section changes. Capture required desktop/mobile screenshots. Review against the gates below. **Stop for Alex approval.**

### Phase 2 — Hero motion only

Add the approved opening, phrase reveal, fine-pointer depth, observer/visibility pause, and reduced-motion final state. If static CSS cannot sustain the approved depth, present measured direct-Three dependency impact for approval before installation. Capture screenshots and a short recording. **Stop for Alex approval.**

### Phase 3 — homepage integration

Move the approved composition behind a single feature/component boundary in `HeroV2Section`; keep the old Hero available as a rollback component until post-release verification. Preserve dictionary content, metadata, H1, CTAs, static output, mobile fallback, and SEO. Run full QA, SSG, EN/AR screenshots, Lighthouse, reduced motion, WebGL failure, and case-study/live-preview regressions.

### Phase 4 — Global Traveler and worlds, one approval at a time

1. Method / Builder Map
2. Gymura
3. Restaurant
4. Texas Funds
5. Intelligence
6. Security
7. Future
8. Manifesto
9. Contact

For each: define one state change in the shared material/seam language, implement only that section, capture EN/AR desktop/mobile evidence, verify reduced motion/performance/accessibility, and stop for visual approval. Do not begin the next section automatically.

---

## 20. Visual quality gates

### Automatic rejection criteria

Reject if any of the following is true:

- Image reads as a basic rectangular card at first glance.
- 3D reads as random floating rectangles or separate UI panels.
- Geometry is not clearly visible in a static screenshot with glow reduced/disabled.
- Materials crush to near-black or have no readable face/side/bevel separation.
- Glow substitutes for thickness, light, or material response.
- Text hierarchy is weaker or less legible than the original production Hero.
- First frame before animation appears incomplete.
- Head/face is obstructed by geometry, copy, traveler, or effects.
- Hero resembles a game HUD, sci-fi dashboard, generic cyberpunk scene, wings, armor, reactor, or AI orb.
- Mobile is a scaled desktop composition.
- Work is declared complete without fresh screenshots for EN/AR desktop/mobile.

### Acceptance criteria

| Area                 | Objective gate                                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composition          | At 1440 × 900, a grayscale thumbnail still has three unambiguous levels: Alex/workstation first, H1 second, threshold/world detail third. Negative space remains intentional. |
| Portrait integration | Outer image boundary is not perceivable across most of its perimeter; Alex/head and workstation remain sharp/readable; no false claim of face-forward portrait.               |
| Geometry             | One continuous silhouette; at least front, side, and bevel planes are visible; no isolated decorative slabs.                                                                  |
| Materials            | Form remains readable with emissive/glow at zero; roughness/metalness differences are subtle and plausible.                                                                   |
| Lighting             | Clear key, fill, and rim roles; no clipped neon; head and important screens retain detail.                                                                                    |
| Typography           | H1 remains semantic, wraps intentionally in EN/AR, meets contrast, and dominates supporting copy; CTAs remain obvious.                                                        |
| Motion               | Every movement reveals hierarchy/depth, settles within the stated sequence, pauses offscreen/hidden, and never blocks reading.                                                |
| Mobile               | Separate crop/layout at 320–430 px, no head obstruction, no horizontal scroll, tap targets ≥44 px, static fallback looks authored.                                            |
| RTL                  | Logical layout, non-mirrored photo, correct semantic world order, Arabic phrase reveal, no broken mixed-direction tokens.                                                     |
| Performance          | Reserved geometry gives CLS ≤0.01 regression; LCP and JS stay within recorded budgets; mobile/reduced motion initialize no WebGL.                                             |
| Accessibility        | Content complete without canvas/motion/color; accurate localized alt; no duplicate labels; keyboard/focus/contrast checks pass.                                               |

The screenshot review should include: full color, grayscale, glow-disabled development capture, WebGL-disabled/fallback capture, 320 px EN/AR, and reduced-motion EN/AR. A composition that passes only while moving fails.

---

## 21. Risks

| Risk                                                       | Likelihood | Impact | Mitigation                                                                                |
| ---------------------------------------------------------- | ---------: | -----: | ----------------------------------------------------------------------------------------- |
| Workstation source cannot deliver desired human connection |       High |   High | Embrace environmental portrait; approve new photography if face-led direction is required |
| Static mask still looks like a soft rectangle              |     Medium |   High | Art-direct perimeter and foreground crossing before motion                                |
| Threshold becomes wings/armor                              |     Medium |   High | Keep structure anchored to workstation/architecture, asymmetric, and away from shoulders  |
| Three chunk exceeds budget                                 |     Medium |   High | Phase 1 without dependency; direct Three only; measure route chunk; reject scope          |
| Hero worsens mobile LCP                                    |     Medium |   High | Existing small WebPs, correct sizes, no mobile canvas, no extra priority assets           |
| Arabic composition treated as mirror                       |     Medium |   High | Separate object position/crop and screenshot approval                                     |
| Persistent Traveler produces coordinate drift              |     Medium | Medium | Section progress/waypoint measurement, ResizeObserver/refresh, section-by-section rollout |
| Too many simultaneous GSAP owners                          |     Medium | Medium | One Hero owner and one homepage rail owner with explicit boundary                         |
| Old dirty worktree obscures changes                        |       High | Medium | Implementation commits/scopes must include only reviewed files; do not reset user work    |
| Visual approval repeats checklist failure                  |     Medium |   High | Still-first gates, grayscale/glow-off captures, mandatory stop points                     |
| Remote/reference asset accidentally enters production      |        Low |   High | Prohibit `/__l5e`, R2, and Google font runtime references in review checks                |

---

## 22. Questions requiring Alex’s approval

1. Approve **The Builder’s Threshold** as the single Phase 1 direction.
2. Approve using the workstation image honestly as an environmental portrait, accepting that it will not create face-forward eye contact.
3. Decide whether to commission/capture the dedicated photograph specified above before production integration.
4. Approve the new isolated route names `/en/codex-hero-lab` and `/ar/codex-hero-lab` while retaining the old `/hero-lab` evidence.
5. Confirm that Phase 1 may adjust Hero line breaks and visual scale but not rewrite core copy or CTA meaning.
6. After static approval only: approve or reject adding direct `three` if measured scene quality requires it.
7. Confirm the existing performance ceilings (+80 KB homepage JS, ≤150 KB single 3D chunk, +150 ms desktop LCP, +200 ms mobile LCP, +0.01 CLS) remain hard gates.
8. Confirm mobile remains static/no-WebGL by default for the initial production release.
9. Approve the rule that each Phase 4 section stops for screenshot review before the next begins.
10. Decide whether Playwright screenshot tooling remains a dev dependency after evidence capture; it must never enter runtime bundles.

---

## Final recommendation

Do not port Lovable’s code or its Alex Core object. Port the discipline behind its strongest frame: one silhouette, real form, coherent light, portrait-edge integration, persistent color logic, and calm timing. Prove the Builder’s Threshold as a static bilingual still with the workstation image first. If that still is not excellent, do not add motion or 3D. If it is approved and CSS/SVG cannot maintain the required volume, add direct Three.js only after an explicit dependency/budget approval, keeping the static composition as the canonical fallback. The production portfolio remains the native Next.js system throughout.
