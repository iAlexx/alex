# Creative Direction V2 — ALEX: The Builder System

**Phase:** 7.3A — Creative Direction Reset (Strategy & Wireframe Only)  
**Date:** July 11, 2026  
**Status:** Documentation only — no source changes  
**Repository baseline:** Post Phase 7.2 (Hero polish, narrative merge, spacing tokens, WebP assets)

---

## 1. Executive Creative Diagnosis

### What is working technically

The portfolio has a **solid engineering foundation**: strict TypeScript, bilingual typed dictionaries, honest project statuses, live previews for Gymura and Restaurant, GSAP scoped to client islands, static generation, and Phase 7.1 localization fixes for case study facts. Individual sections — especially Gymura and Restaurant on desktop — demonstrate real craft.

### What is failing creatively

The homepage does **not feel like one authored experience**. It feels like **eleven competent components placed in sequence**:

| Symptom                          | Evidence in current build                                                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fragmented story                 | Hero → narrative → two flagships → catalog blocks → skills → process → manifesto → contact with no connective tissue                                                              |
| Poor large-screen use            | `max-w-6xl` centered column on every section; wide viewports show empty obsidian margins with no purposeful composition                                                           |
| Excessive black void             | Uniform dark backgrounds between unrelated blocks; negative space is default padding, not narrative pause                                                                         |
| Content disappearing/reappearing | `HomepageSectionMotion` uses `opacity: 0` entrance on six sections; Gymura/Restaurant pins scrub opacity on sub-elements; fast scroll can re-trigger perception of hidden content |
| Motion layered on content        | Identical `opacity + y` reveal on Live, Building, Cyber, Skills, Process, Contact — motion decorates blocks rather than explaining relationships                                  |
| Projects as separate templates   | Gymura (brand pin), Restaurant (ops pin), Texas Funds (card), Building (list), Cyber (timeline) — four visual languages                                                           |
| No project world map             | Visitor cannot see how Gymura, Restaurant, Texas Funds, Alexa AI, Automation, and Cybersecurity connect                                                                           |
| Weak human personality           | Third-person copy dominates; Alex’s thinking voice appears only in narrative lines and manifesto                                                                                  |
| No single soul                   | Technically professional; not yet creatively memorable                                                                                                                            |

### Diagnosis summary

This is **not a polish problem**. Phase 7.2 improved Hero image treatment, CTA hierarchy, spacing tokens, and merged differentiation into Builder Narrative — but the **information architecture and experience model remain a section list**. Phase 7.3A resets creative direction before further implementation.

**Phase 8 (global 3D) must remain delayed.** Adding WebGL now would amplify fragmentation, not solve it.

---

## 2. Central Concept — ALEX: The Builder System

### One sentence

Alex uses **branding, software, AI, automation, systems thinking, and cybersecurity** as connected tools inside one builder system — not as unrelated career lanes.

### What the visitor must understand within 30 seconds

1. Alex is a **product builder** who thinks in systems.
2. His work spans **four connected worlds**, not random projects.
3. **Live proof exists** (Gymura, Restaurant, Texas Funds).
4. The site itself demonstrates how he builds.

### The Builder System model

```
                    ┌─────────────────┐
                    │   ALEX CORE     │
                    │  Product Builder │
                    │  Electric Blue   │
                    └────────┬────────┘
         ┌──────────┬───────┴───────┬──────────┐
         ▼          ▼               ▼          ▼
   BUILD BRANDS  BUILD SYSTEMS  BUILD INTEL  BUILD SECURE
     (Gymura)    (Restaurant,     (Alexa AI,   (Cyber Lab,
                  Texas Funds)    Automation)   ALEX Linux)
```

Every homepage section is a **chapter in this system**, not a standalone portfolio block.

---

## 3. Human Story

### Core narrative arc

| Chapter       | Question answered                      | Emotional register             |
| ------------- | -------------------------------------- | ------------------------------ |
| 1. The Person | Who is Alex and what drives him?       | Curiosity, focus, authenticity |
| 2. The Method | How does he turn ideas into structure? | Clarity, discipline            |
| 3. The Worlds | What does he actually build?           | Proof, ambition                |
| 4. Live Proof | What works in the real world today?    | Credibility                    |
| 5. The Future | What is he building next?              | Momentum                       |
| 6. Connection | Why reach out?                         | Invitation                     |

### Human identity layer — first-person voice

Replace generic third-person marketing copy with **short, honest first-person statements** at strategic moments. Suggested placements:

| Location                      | EN example                                                                                         | AR example                                                                | Replaces                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Hero subline (below headline) | “I do not start with code. I start by understanding how the whole thing should work.”              | «ما ببلّش بالكود؛ ببلّش بفهم كيف لازم المشروع كله يشتغل.»                 | Generic `hero.supporting` paragraph (shorten supporting; move depth to Method) |
| Method section opener         | “I like taking ideas that feel complicated and turning them into systems people can actually use.” | «بحب آخد الأفكار المعقدة وأحوّلها إلى أنظمة يقدر الناس يستخدموها فعلياً.» | Third-person `narrative.conclusion`                                            |
| Gymura bridge                 | “Gymura started as a brand idea — identity, product, store, experience — not just a website.”      | «جيمورا بدأت كفكرة علامة — هوية، منتج، متجر، تجربة — مو بس موقع.»         | Second Gymura description paragraph (first-person variant)                     |
| Restaurant bridge             | “I designed this around how orders actually move through a restaurant — not around screens.”       | «صمّمتها حول كيف الطلبات تتحرك فعلياً في المطعم — مو حول الشاشات.»        | New bridge copy before Restaurant scene                                        |
| Intelligence bridge           | “Once a system works, I ask what should become intelligent and automated.”                         | «لما النظام يشتغل، بسأل شو لازم يصير ذكي ومؤتمت.»                         | New transition copy                                                            |
| Security bridge               | “Complex systems need boundaries, permissions, and legal discipline.”                              | «الأنظمة المعقدة تحتاج حدود وصلاحيات وانضباط قانوني.»                     | Cyber intro opener                                                             |
| Manifesto                     | Keep signature line; supporting stays mission-oriented                                             | Same                                                                      | Current manifesto                                                              |

### Voice rules

- First-person for **principles, motivation, and method** — not for boasting.
- Third-person acceptable for **factual project descriptions** on case study pages.
- Never invent client quotes, revenue, user counts beyond stated facts, or emotional backstory.
- Arabic voice should feel **Damascus-native professional**, not translated marketing.

### Decision-making principles to surface (not as cards)

Short inline principles, not a five-pillar grid:

- Understand problem before technology
- Decompose into modules and stages
- Use AI as execution multiplier, not replacement for thinking
- Build for real users, not demos
- Consider security and legal boundaries from the start

These replace the current `narrative.pillars` card grid on the homepage. Full pillar descriptions move to About page or case study intros.

---

## 4. Builder World Map

### Four worlds — project assignment

| World                  | Meaning                                                    | Primary projects                 | Maturity signal        |
| ---------------------- | ---------------------------------------------------------- | -------------------------------- | ---------------------- |
| **Build Brands**       | Identity, product direction, commerce, customer experience | Gymura                           | Live flagship          |
| **Build Systems**      | Operational software used by real people                   | Restaurant Platform, Texas Funds | Live / active          |
| **Build Intelligence** | Local AI, memory, tools, automation workflows              | Alexa AI, AI & Automation Lab    | Prototype / active dev |
| **Build Securely**     | Legal security learning, Linux, Red Team path              | Cybersecurity Lab, ALEX Linux    | Continuous / research  |

### How worlds connect (required visitor comprehension)

```
IDEA → METHOD → BRAND (identity + market)
              → SYSTEM (operations + users)
              → INTELLIGENCE (automation + AI layer)
              → SECURITY (boundaries + trust)
              → FUTURE (next builds)
```

**Alex is the central node.** The Builder Map line originates at Alex in the Hero and branches into each world. Projects are **evidence nodes** on branches, not separate homepage templates.

### Anti-pattern to eliminate

Do not present Texas Funds, Alexa AI, and Cybersecurity as **equal cards** after two cinematic flagships. Hierarchy must reflect **priority, maturity, and world membership**.

---

## 5. New Homepage Narrative Architecture

### Proposed section order (V2)

| #   | Section ID           | Title (internal)                             | Visitor question                      | Why it follows                                     |
| --- | -------------------- | -------------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| 0   | `header`             | Global nav + map indicator                   | Where am I?                           | Persistent orientation                             |
| 1   | `hero`               | **The Person**                               | Who is Alex?                          | Entry point; establishes human + system motif      |
| 2   | `method`             | **The Method**                               | How does he think?                    | Moves from person to process before proof          |
| 3   | `map-intro`          | **The Builder Map**                          | What worlds does he build in?         | Sets expectation for four chapters                 |
| 4   | `world-brands`       | **Build Brands → Gymura**                    | Can he build a real brand?            | First proof; highest priority                      |
| 5   | `world-systems`      | **Build Systems → Restaurant + Texas Funds** | Can he ship operational software?     | Natural escalation from brand to operations        |
| 6   | `world-intelligence` | **Build Intelligence → Alexa + Automation**  | How does he add intelligence?         | Systems lead to automation question                |
| 7   | `world-security`     | **Build Securely → Cyber + ALEX Linux**      | How does he handle complexity safely? | Complexity from prior worlds creates security need |
| 8   | `future`             | **What’s Next**                              | Where is he headed?                   | Roadmap after full system picture                  |
| 9   | `manifesto`          | **Conviction**                               | What drives him long-term?            | Emotional beat before action                       |
| 10  | `contact`            | **Connection**                               | How do I reach him?                   | Clear CTA                                          |
| 11  | `footer`             | Compact close                                | —                                     | Wayfinding only                                    |

**Total: 9 content chapters + header/footer** (down from 11 disconnected blocks).

### Timing guide

| Depth type                  | When it appears                                                  |
| --------------------------- | ---------------------------------------------------------------- |
| Human personality           | Hero, Method, Manifesto, transition bridges                      |
| Live projects               | World 1–2 (Gymura, Restaurant, Texas Funds)                      |
| Technical depth             | Inside world scenes (summaries only); full depth on case studies |
| Cybersecurity understanding | World 4 — after intelligence/complexity established              |
| Future projects             | Section 8 — roadmap strip, not card wall                         |
| Skills inventory            | **Removed from homepage** — lives on About / Lab / case studies  |

### Current vs proposed order

| Current (Phase 7.2)         | Proposed (V2)                                 |
| --------------------------- | --------------------------------------------- |
| Hero                        | Hero (recomposed)                             |
| Builder Narrative           | **Method** (human voice + 4-step rail)        |
| —                           | **Map Intro** (new)                           |
| Gymura                      | **World: Brands** (Gymura scene)              |
| Restaurant                  | **World: Systems** (Restaurant + Texas Funds) |
| Currently Building          | **Future** (recomposed)                       |
| Live Products (Texas Funds) | _Merged into World: Systems_                  |
| Cybersecurity               | **World: Security**                           |
| Skills                      | _Removed from homepage_                       |
| Process                     | _Merged into Method_                          |
| Manifesto                   | Manifesto                                     |
| Contact                     | Contact                                       |

---

## 6. Unified Visual Metaphor — The Builder Map

### Selected metaphor: **The Builder Map / System Path**

A **continuous illuminated line** (SVG or CSS) represents Alex’s thinking journey. It is not a dashboard, not a game HUD, not Matrix rain.

### Visual elements

| Element          | Description                                                                    | Technology                                               |
| ---------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Core node**    | Small electric-blue pulse at Hero — “Alex”                                     | SVG circle + CSS glow                                    |
| **Spine line**   | 1–2px vertical/horizontal path connecting sections                             | SVG path, `stroke: var(--color-electric)` at 40% opacity |
| **World nodes**  | Labeled junctions: Brands, Systems, Intelligence, Secure                       | SVG nodes + bilingual labels                             |
| **Active state** | Current world node brightens; accent color bleeds into section background edge | CSS custom property `--world-accent`                     |
| **Progress**     | Line “fills” as visitor scrolls (scroll-linked `stroke-dashoffset`)            | GSAP ScrollTrigger scrub on SVG only                     |

### How the metaphor evolves per world

| World               | Line behavior                                        | Background shift                 | Accent activation             |
| ------------------- | ---------------------------------------------------- | -------------------------------- | ----------------------------- |
| Hero / Method       | Line originates from core; faint grid                | Obsidian + electric radial       | Core blue only                |
| Build Brands        | Line branches right/up; softer geometry              | Warm graphite + silver highlight | `--accent-brand: soft silver` |
| Build Systems       | Line becomes structured (right angles); module nodes | Navy + amber edge glow           | `--accent-system: amber`      |
| Build Intelligence  | Line adds forked branches; node pulses               | Deep ink + violet mist           | `--accent-intel: violet`      |
| Build Securely      | Line tightens; nodes become shield shapes            | Obsidian + cyan edge             | `--accent-secure: cyan`       |
| Future              | Line opens outward (dashed extension)                | Neutral navy                     | Core blue returns             |
| Manifesto / Contact | Line converges back to core                          | Dark vignette                    | Core blue                     |

**Rule:** Only **one world accent** visible at a time. Previous world accent fades over 400ms during transition — never all four simultaneously.

### RTL behavior

- Map spine mirrors horizontally in Arabic (`scaleX(-1)` on SVG container only).
- World labels remain readable (do not mirror text).
- Line progression follows scroll direction naturally in both directions.
- In RTL, branching direction mirrors but **reading order of content blocks** follows DOM/logical order, not visual mirror of LTR.

### What this is not

- Not a minimap game UI
- Not interactive click-to-teleport (progress indicator only on homepage)
- Not a fake data visualization
- Not WebGL particles

---

## 7. Color System Reset

### Design intent

One **governed palette** where Electric Blue is the permanent connective tissue and world accents are **temporary chapter colors**.

### Base tokens (unchanged names, refined roles)

| Token              | Hex       | Role                                |
| ------------------ | --------- | ----------------------------------- |
| `--color-obsidian` | `#06080f` | Page canvas, deepest background     |
| `--color-navy`     | `#0a1120` | Section depth layer                 |
| `--color-graphite` | `#141b2b` | Elevated surfaces, map panel        |
| `--color-ink`      | `#0d1322` | Cards, panels (use sparingly in V2) |
| `--color-line`     | `#1e2740` | Borders, map grid lines             |
| `--color-soft`     | `#e9edf6` | Primary text                        |
| `--color-mist`     | `#9aa4bb` | Secondary text                      |

### Alex Core Color

| Token              | Hex       | Role                                                                         |
| ------------------ | --------- | ---------------------------------------------------------------------------- |
| `--color-electric` | `#4f8dff` | **Primary connective color** — map spine, core node, primary CTA, active nav |
| `--color-glow`     | `#35d0e8` | Hover state, line highlight only — never as section fill                     |

**Rule:** Electric blue appears in **every section** at least once (map line, label, or CTA). It is the visual signature.

### World accent tokens (new — consistent saturation family)

All accents at ~70% saturation, ~55% luminance in dark context:

| Token             | Hex       | World              | Usage                                                                       |
| ----------------- | --------- | ------------------ | --------------------------------------------------------------------------- |
| `--accent-brand`  | `#c8d0dc` | Build Brands       | Eyebrows, Gymura scene edge, typography highlights — soft silver/warm white |
| `--accent-system` | `#d4a054` | Build Systems      | Restaurant workflow, Texas Funds live rail — controlled amber               |
| `--accent-intel`  | `#9b7ed9` | Build Intelligence | Lab scene accents — violet (distinct from core cyber purple)                |
| `--accent-secure` | `#4ec9e0` | Build Securely     | Security path nodes — cyan                                                  |

### Semantic status color (reserved)

| Token           | Hex                     | Usage                                                         |
| --------------- | ----------------------- | ------------------------------------------------------------- |
| `--accent-live` | `#6ee7b7` (emerald-300) | **Live status only** — Texas Funds, Gymura, Restaurant badges |

**Green is never a world accent.** It means “verified live” only.

### Gradient ownership

| Gradient               | Owner                | Purpose                                |
| ---------------------- | -------------------- | -------------------------------------- |
| Hero radial (electric) | Hero                 | Environmental depth behind workstation |
| World edge bleed       | Active world section | 8% accent at section leading edge      |
| Manifesto vignette     | Manifesto            | Text readability                       |
| Map glow               | Builder Map SVG      | Active node only                       |

### Prohibited combinations

- Amber + violet + cyan visible simultaneously
- Emerald used for decoration (live status only)
- Purple (`--color-cyber`) as general accent — demote to legacy; replace with `--accent-intel` for intelligence world
- Full-opacity accent fills on large areas
- Neon gradients on body text

### Transition rules between worlds

1. Outgoing world: accent opacity 100% → 0% over scroll distance of 120px
2. Map spine: stroke color cross-fades core blue → world accent → core blue
3. Incoming world: background edge glow fades in over 200px
4. Text colors remain `--color-soft` / `--color-mist` — **never accent-colored paragraphs**

### Accessibility

- All text on obsidian/navy: minimum 4.5:1 (soft white on obsidian passes)
- Accent eyebrows: paired with `--color-soft` headings, never accent-on-accent
- Live emerald badge: white text on emerald-900 chip background for contrast

---

## 8. Space and Composition System

### Problem with current composition

Every section uses `max-w-6xl` centered grid. On 1440px+ viewports, **~40% of horizontal space is empty black** with no compositional purpose.

### Composition rules

| Pattern                       | When to use                               | Width behavior                                                         |
| ----------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| **A. Environmental Hero**     | Hero only                                 | Full-bleed image right 50–55%; text left 38%; map core overlaps gutter |
| **B. Reading Rail**           | Method, bridges, manifesto quote          | `max-w-3xl` prose column; map spine in margin                          |
| **C. Asymmetric Showcase**    | Gymura, Restaurant                        | Text 40% / media 60%; media may bleed to viewport edge                 |
| **D. Full-bleed System Band** | World transitions, Texas Funds live strip | Edge-to-edge horizontal band, content aligned to grid                  |
| **E. Map Panel**              | Map intro, world headers                  | Full viewport width background shift; content `max-w-6xl`              |
| **F. Compact Catalog Rail**   | Future builds                             | Single column list, no card grid                                       |

### Wide screen strategy (1024–1920px)

- **Use the gutters intentionally:** map spine, world labels, or ambient gradient — never raw empty black
- **Break the grid:** live preview and workstation image may extend 80–120px beyond `max-w-6xl`
- **Oversized type:** world titles at `clamp(3rem, 5vw, 6rem)` — only for world chapter headers
- **Layer overlap:** preview browser shell may overlap map line by 24px (z-index managed)

### Mobile strategy (320–430px)

- **Vertical authored journey** — not stacked desktop
- Map spine becomes **left-edge vertical line** (4px, inset 16px)
- Image first on Hero (current 7.2 pattern retained)
- One world per scroll “chapter”; clear world label before content
- Live preview: collapsed toolbar; full-width below copy
- No pin sections on mobile

### Negative space rules

| Good negative space           | Bad negative space                       |
| ----------------------------- | ---------------------------------------- |
| Pause before world transition | `py-28` between similar catalog sections |
| Manifesto breathing room      | Empty black between Skills and Process   |
| Map node margin               | Uniform padding on every block           |

### Four+ distinct layouts (required variety)

1. **Environmental Hero** — workstation + map core
2. **Full-width Map Intro** — four world nodes horizontal
3. **Asymmetric Brand Showcase** — Gymura text + bleeding preview
4. **Horizontal OS Story** — Restaurant workflow band edge-to-edge
5. **Narrow Human Quote Break** — first-person bridge between worlds
6. **Layered Final Invitation** — manifesto + contact composite closer

---

## 9. Motion Philosophy Reset

### Non-negotiable rule

> **Once meaningful text is visible, scrolling must never hide it again to replay an entrance.**

This directly addresses the current `HomepageSectionMotion` pattern (`opacity: 0` → scroll → visible) which creates a “content disappearing and reappearing” feeling across six sections, compounded by Gymura/Restaurant pin scrub opacity changes.

### Motion hierarchy (four levels)

| Level  | Name                 | What moves                                                  | Examples                                             |
| ------ | -------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **L1** | Global journey       | Builder Map spine, world progress, background accent shifts | SVG `stroke-dashoffset`, `--world-accent` transition |
| **L2** | World transition     | Section bridge elements, world label, accent bleed          | Map node pulse, 400ms cross-fade                     |
| **L3** | Project explanation  | Workflow diagram, preview shell, module highlights          | Restaurant order path, Gymura preview entrance       |
| **L4** | Interaction feedback | Hover, focus, button press                                  | CTA scale 0.98→1, link underline                     |

**Text is L2 maximum.** Body copy never uses L3 pin scrub. Headlines enter once (L2) then remain stable.

### What may animate

- Map spine and nodes (L1)
- World accent backgrounds (L1)
- Interface shells, diagrams, preview chrome (L3)
- Decorative ops panels (L3, `aria-hidden`)
- Status indicators (L4, single pulse on enter — not continuous)

### What must remain stable

- All paragraph text after first reveal
- Navigation and CTAs (no scroll-hide)
- Legal disclaimers (always visible)
- Project titles after world entry completes
- Skills/capability lists (if shown)

### Scroll behavior rules

| Scenario             | Behavior                                                       |
| -------------------- | -------------------------------------------------------------- |
| First enter viewport | One-time reveal (opacity 0→1 or y 24→0)                        |
| Fast scroll down     | No re-hide; elements stay at final state                       |
| Reverse scroll up    | **No entrance replay**; optional subtle parallax on map only   |
| Pin sections         | Max one pin per world; pin animates **diagram only**, not text |
| Before hydration     | All text visible in HTML; motion enhances only                 |

### Reduced motion

- Map line: static, fully drawn
- All text: no animation
- Previews: static
- World accents: fixed per section (no cross-fade)
- Pins: disabled

### Mobile motion

- L1 map: static vertical line with filled progress on scroll (no scrub animation)
- L2: opacity only, 16px max translation
- L3: disabled for Restaurant order card travel
- No pointer parallax

### GSAP refactor direction (future implementation)

| Current component            | V2 target                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `HomepageSectionMotion`      | **Deprecate** — replace with `WorldTransitionMotion` (L2 only, once)                            |
| `HeroCinematicSection`       | Keep — entrance once; remove scroll re-hide                                                     |
| `GymuraCinematicSection`     | Refactor — pin **preview + ecosystem panel only**; text static                                  |
| `RestaurantCinematicSection` | Refactor — pin **workflow track only**; remove module chip stagger; cut 16-module homepage grid |
| `ManifestoCinematicSection`  | Keep — quote reveal once                                                                        |
| New: `BuilderMapSpine`       | L1 global SVG controller                                                                        |

### Avoid list (strict)

- Text fading to zero after being read
- Replaying entrances on reverse scroll
- Two pin sections back-to-back without 600px unpinned breathing room
- `opacity: 0` default on readable content
- Continuous decorative loops
- `requestAnimationFrame` React state for motion
- Identical stagger on six sections

---

## 10. Project Transition Design

### Hero → Method

| Dimension   | Treatment                                                          |
| ----------- | ------------------------------------------------------------------ |
| Visual      | Map core node pulses; spine begins downward from Hero image gutter |
| Narrative   | “You met Alex. Now see how he thinks.”                             |
| Color       | Core electric only                                                 |
| Motion      | L2 — method headline rises once; spine extends 200px               |
| Layout      | Hero full-bleed → Method reading rail                              |
| Copy bridge | First-person method opener (see §3)                                |

### Method → Build Brands

| Dimension   | Treatment                                                  |
| ----------- | ---------------------------------------------------------- |
| Visual      | Map branches; first world node “Brands” illuminates silver |
| Narrative   | “Structure becomes identity and commerce.”                 |
| Color       | `--accent-brand` bleeds into leading edge                  |
| Motion      | L2 world label fade; L3 Gymura preview entrance            |
| Layout      | Map intro band (full width) → asymmetric Gymura            |
| Copy bridge | “The first proof is a brand people can wear and buy from.” |

### Gymura → Build Systems

| Dimension   | Treatment                                                             |
| ----------- | --------------------------------------------------------------------- |
| Visual      | Silver fades; amber enters; line geometry squares (operational)       |
| Narrative   | “A brand earns trust. A system earns daily use.”                      |
| Color       | Brand accent out → system amber in                                    |
| Motion      | L1 accent cross-fade; no pin handoff directly — 400px unpinned bridge |
| Layout      | Narrow quote break → Restaurant horizontal band                       |
| Copy bridge | First-person Restaurant line (see §3)                                 |

### Restaurant / Texas Funds → Build Intelligence

| Dimension   | Treatment                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Visual      | Amber fades; violet fork appears on map                                                        |
| Narrative   | “Working systems reveal what should be automated.”                                             |
| Color       | System amber out → intel violet in                                                             |
| Motion      | Restaurant workflow completes; Texas Funds live strip pulses once (L4)                         |
| Layout      | Texas Funds as **horizontal live proof strip** inside Systems world tail, not separate section |
| Copy bridge | “Once operations run, intelligence becomes the next layer.”                                    |

### Intelligence → Build Securely

| Dimension   | Treatment                                                             |
| ----------- | --------------------------------------------------------------------- |
| Visual      | Violet tightens; cyan shield nodes on map                             |
| Narrative   | “More capability means more responsibility.”                          |
| Color       | Intel violet out → secure cyan in                                     |
| Motion      | L2 — security path draws node by node (not card stagger)              |
| Layout      | Lab atmosphere panel — not chip wall                                  |
| Copy bridge | “Complex systems need boundaries, permissions, and legal discipline.” |

### Security → Future Builds

| Dimension   | Treatment                                                         |
| ----------- | ----------------------------------------------------------------- |
| Visual      | Map line extends dashed into open territory                       |
| Narrative   | “The system keeps growing.”                                       |
| Color       | Cyan fades to core blue                                           |
| Motion      | Minimal — roadmap items slide in as list                          |
| Layout      | Compact future rail                                               |
| Copy bridge | “What Alex is building next — honest statuses, no fake progress.” |

### Future → Contact

| Dimension   | Treatment                                          |
| ----------- | -------------------------------------------------- |
| Visual      | Map converges to core; manifesto atmospheric layer |
| Narrative   | Conviction → invitation                            |
| Color       | Core electric on CTA                               |
| Motion      | Manifesto quote L2; contact card L4 scale          |
| Layout      | Manifesto full-bleed → contact compact             |
| Copy bridge | Signature line → “Have an ambitious idea?”         |

---

## 11. Content Strategy — Keep / Merge / Move / Remove

| Section                | Decision                    | Rationale                                                               | V2 destination                                 |
| ---------------------- | --------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| **Hero**               | **Replace** (creative spec) | Good 7.2 image work; still a photo-next-to-text block, not system entry | Recomposed Hero with map core + human line     |
| **Builder Narrative**  | **Merge**                   | Lines are strong; pillars repeat method                                 | → **Method** section (lines + 4-step rail)     |
| **Gymura**             | **Keep** (restructure)      | Flagship #1; cinematic core reusable                                    | → **World: Brands** scene                      |
| **Restaurant**         | **Keep** (simplify)         | Strongest systems proof; too dense                                      | → **World: Systems** (workflow + preview only) |
| **Live Products**      | **Merge**                   | Texas Funds credibility essential                                       | → Texas Funds strip inside **World: Systems**  |
| **Currently Building** | **Replace**                 | Card/list pattern repeats                                               | → **Future** roadmap rail                      |
| **Cybersecurity**      | **Keep** (restructure)      | Important discipline signal                                             | → **World: Secure** path                       |
| **Skills**             | **Remove** from homepage    | Chip density; repeats method + case studies                             | → About / Lab page                             |
| **Process**            | **Merge**                   | 7 steps too long for homepage                                           | → **Method** 4-step rail; full 7 on About      |
| **Manifesto**          | **Keep**                    | Emotional close; signature placement correct post-7.2                   | Before Contact                                 |
| **Contact**            | **Keep**                    | Clear CTA                                                               | Final action                                   |
| **Footer**             | **Keep** (minor)            | Compact post-7.2                                                        | Wayfinding only                                |
| **narrative.pillars**  | **Remove** from homepage    | Replaced by inline principles in Method                                 | Dictionary keys may remain for About           |
| **Differentiation**    | Already removed (7.2)       | —                                                                       | —                                              |

### Shorter homepage target

| Metric               | Current               | V2 target                                 |
| -------------------- | --------------------- | ----------------------------------------- |
| Top-level sections   | 11                    | 9 chapters                                |
| Card/grid patterns   | 6+                    | 2 maximum (Gymura ecosystem, Future list) |
| Pin sections         | 2                     | 1–2 (diagram only, not full section)      |
| First-person blocks  | 1 (manifesto)         | 6+ bridges                                |
| Scroll height (est.) | ~8–10 screens desktop | ~6–7 screens                              |

---

## 12. Revised Hero Direction

### Creative specification

| Question                        | Answer                                                                     |
| ------------------------------- | -------------------------------------------------------------------------- |
| Who is Alex?                    | Product builder at a real workstation — not a stock portrait               |
| What does he build?             | One system spanning brands, software, intelligence, security               |
| Why continue scrolling?         | “See the system behind the projects” — map entry visible in first viewport |
| Visual entry to Builder System? | Electric core node at image-text junction; spine begins here               |

### Composition (desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│ [Nav]                                              [Map: Core] │
│                                                                  │
│  ALEX                                    ┌──────────────────┐  │
│  I build brands, software,               │   Workstation    │  │
│  and intelligent systems.                │   (environmental │  │
│                                          │    50% width)    │  │
│  [Positioning line]                      │                  │  │
│                                          │    ◉ core node   │  │
│  “I do not start with code…”             └──────────────────┘  │
│                                                                  │
│  [Explore the System]  [Enter the Lab]     CV — coming soon     │
│                                                                  │
│  ─── map spine begins ───                                        │
└──────────────────────────────────────────────────────────────────┘
```

### Hierarchy

1. Name (eyebrow)
2. Statement (H1)
3. Human line (first-person, replaces long supporting paragraph)
4. Positioning line (muted)
5. CTAs: Primary “Explore the System” → `#world-brands`; Secondary “Enter the Lab” → `#future`
6. CV tertiary (unchanged honesty)

### Image

- Keep authentic workstation WebP (7.2 assets)
- No card frame; environmental integration retained
- Core map node overlaps image lower-left (desktop) or below image (mobile)

### Motion

- L2 entrance once: headline group + human line + CTAs
- L3 image scale 1.04→1 once
- L1 map core pulse (single cycle, not loop)
- Desktop: light pointer depth on image only
- No pin

### Arabic RTL

- Text column flips; image on inline-start side
- Map core mirrors with spine
- Human line uses natural Arabic breaks; no `tracking-*` on Arabic
- CTA order: primary first in reading direction

---

## 13. Gymura Direction

### Experience goal

Gymura must feel like **entering a sportswear brand universe**, not reviewing a developer’s e-commerce side project.

### Scene design (V2)

| Layer            | Content                                          | Until real media exists                                        |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| World header     | “Build Brands” + silver accent                   | Typography only                                                |
| Brand statement  | Gymura name, subtitle, 1 paragraph               | Typed copy                                                     |
| Brand principles | 3 inline tags: Identity, Product, Commerce       | Text chips — not fake apparel photos                           |
| Live proof       | Compact `LiveWebsitePreview`                     | Real gymura.store                                              |
| Ecosystem        | 5–7 items as **vertical list**, not card grid    | Typed list                                                     |
| Media slot       | Reserved 16:9 frame labeled “Brand media coming” | **Hidden** until real assets — do not show placeholder fashion |

### When real media arrives

Priority order for integration:

1. Logo (SVG) — world node icon
2. Product photography — replace media slot
3. Store UI screenshots — inside preview fallback
4. Fabric/texture — subtle CSS background only
5. Short video — optional, lazy, click-to-play

### Motion (V2)

- Pin **preview shell + ecosystem list** only (max 300px scrub)
- Brand name static after enter
- No floating fake product frames without assets

### Anti-patterns

- Placeholder clothing images presented as proof
- Duplicate “Visit Gymura” CTAs (keep: preview toolbar + one text link)
- Gymura purple competing with system electric blue — Gymura uses brand silver, not Gymura store colors as page accent

---

## 14. Restaurant Direction

### Homepage goal

Communicate in order: **problem → flow → system → proof**

### What stays on homepage

| Element              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| World header         | “Build Systems” + amber accent                         |
| Problem line         | 1 sentence Arabic-first operations challenge           |
| Workflow diagram     | 8 stages — **the hero of this scene**                  |
| Order journey        | Animated card on track (desktop pin)                   |
| Compact live preview | alnkha.site proof                                      |
| Primary modules      | **4 chips maximum** (QR, Cashier, Kitchen, Management) |
| Case study link      | One CTA                                                |

### What moves to case study page

| Element                     | Reason                                                |
| --------------------------- | ----------------------------------------------------- |
| 16-module inventory         | Too dense for homepage                                |
| Secondary module cards      | Detail layer                                          |
| Extended paragraphs (2+)    | Reading depth                                         |
| Ops panel decorations       | Already `aria-hidden` — remove from homepage entirely |
| Full technical architecture | Case study §6–10                                      |

### Simplified hierarchy

```
Problem (1 line)
    ↓
Flow (workflow — pinned diagram only)
    ↓
System (4 module chips)
    ↓
Proof (live preview)
    ↓
[Case Study →]
```

### Motion budget

- One pin: workflow track, max 320px (reduced from 400)
- Text: static after L2 enter
- Order card: transform-based (7.1 fix retained)
- No module chip stagger on homepage

---

## 15. Secondary Worlds Direction

### Texas Funds — inside Build Systems (not standalone section)

| Treatment | Detail                                                   |
| --------- | -------------------------------------------------------- |
| Format    | Horizontal **live proof strip** below Restaurant         |
| Visual    | Emerald live indicator + one paragraph + case study link |
| Hierarchy | Secondary to Restaurant within same world                |
| Motion    | Single L4 pulse on enter — no card reveal                |

### Alexa AI + Automation — Build Intelligence world

| Treatment | Detail                                                                      |
| --------- | --------------------------------------------------------------------------- |
| Format    | **Laboratory panel** — split: Alexa (memory/tools) + Automation (workflows) |
| Visual    | Violet accent; diagram of memory layers (SVG static)                        |
| Hierarchy | Alexa first (priority 3); Automation as connected lab                       |
| Avoid     | Equal cards; status badges row                                              |

### Cybersecurity + ALEX Linux — Build Securely world

| Treatment  | Detail                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Format     | **Structured path** — vertical timeline (current 7.2 cyber timeline is close) |
| Visual     | Cyan accent; legal callout always visible                                     |
| ALEX Linux | One line honest research status — not a card                                  |
| Avoid      | “Hacker” aesthetics; matrix effects                                           |

### Future Builds — roadmap, not card collection

| Treatment | Detail                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Format    | Priority-ordered list with status + one-line description                                              |
| Visual    | Dashed map extension; core blue                                                                       |
| Include   | Alexa, Automation, Cyber, ALEX Linux **only if not fully covered above** — or repeat as compact links |
| Exclude   | 3-column equal cards                                                                                  |

---

## 16. Navigation and Progress Concept

### Proposed system: **Compact Map Nav**

| Element         | Desktop                                                    | Mobile                          |
| --------------- | ---------------------------------------------------------- | ------------------------------- |
| Header          | Sticky; logo + 4 world dots + contact                      | Logo + map menu button          |
| World indicator | 4 dots (Brands, Systems, Intel, Secure) — active brightens | Horizontal scroll chips in menu |
| Progress        | Thin line under header fills with scroll                   | Same line, 2px height           |
| Skip            | Skip to current world via keyboard (arrow keys optional)   | Menu lists worlds as anchors    |
| Active state    | `aria-current="location"` on world anchor                  | Visible chip highlight          |

### Anchor structure

```
#hero #method #world-brands #world-systems #world-intelligence #world-security #future #manifesto #contact
```

### Requirements met

- Accessible: real links, focus visible, `aria-current`
- Not distracting: dots are 8px, no labels in header (tooltips on hover)
- Not game-like: no XP, no achievements
- RTL: dots order mirrors; `#contact` stays at inline-end
- Space: adds 0px height beyond current header (dots inline with nav)

**Not implementing in 7.3A** — specification only.

---

## 17. Desktop Wireframe

See `docs/HOMEPAGE_V2_WIREFRAME.md` for full ASCII wireframes, dimensions, and per-section notes.

---

## 18. Mobile Wireframe

See `docs/HOMEPAGE_V2_WIREFRAME.md` § Mobile (320 / 375 / 430).

---

## 19. Component Impact Assessment

| Component                        | Classification                       | Changes required                                                           | Risk   |
| -------------------------------- | ------------------------------------ | -------------------------------------------------------------------------- | ------ |
| `HeroCinematicSection`           | Reusable — **structural changes**    | Add map core; swap supporting for human line; CTA target update            | Medium |
| `HeroSection`                    | Reusable — minor                     | Wrapper only                                                               | Low    |
| `BuilderNarrative`               | **Replace** → `MethodSection`        | New layout; remove pillars grid; add 4-step rail                           | Medium |
| `GymuraCinematicSection`         | Reusable — **structural changes**    | Reduce pin scope; add world header; remove duplicate CTAs; hide fake media | High   |
| `GymuraSection`                  | Reusable — minor                     | Wrapper + world context                                                    | Low    |
| `RestaurantCinematicSection`     | Reusable — **structural changes**    | Cut modules to 4; remove ops panels; reduce pin; merge Texas Funds tail    | High   |
| `RestaurantSection`              | Reusable — minor                     | Wrapper                                                                    | Low    |
| `RestaurantWorkflow`             | Reusable — minor                     | Simplify stages display                                                    | Medium |
| `RestaurantModuleCard`           | **Remove** from homepage             | Case study only                                                            | Low    |
| `LiveProductsSection`            | **Remove** as standalone             | Logic merges into Systems world                                            | Medium |
| `CurrentlyBuildingSection`       | **Replace** → `FutureRoadmapSection` | List rail, not dashed cards                                                | Medium |
| `CybersecuritySection`           | Reusable — structural                | Wrap in world header; cyan tokens                                          | Medium |
| `SkillsSection`                  | **Remove** from homepage             | Move to About/Lab route (future)                                           | Low    |
| `ProcessSection`                 | **Remove** from homepage             | 4 steps merge into Method                                                  | Low    |
| `ManifestoCinematicSection`      | Reusable — minor                     | Map convergence visual                                                     | Low    |
| `ManifestoSection`               | Reusable — minor                     | Wrapper                                                                    | Low    |
| `ContactSection`                 | Reusable — minor                     | Spacing within finale                                                      | Low    |
| `SiteHeader`                     | Reusable — **structural changes**    | Map dots, world anchors                                                    | Medium |
| `SiteFooter`                     | Reusable — minor                     | Already compact post-7.2                                                   | Low    |
| `HomepageSectionMotion`          | **Deprecate**                        | Replace with `WorldTransitionMotion`                                       | High   |
| `motion-config.ts`               | Reusable — structural                | Add world transition tokens; reduce pin values                             | Medium |
| Typed dictionaries               | Reusable — structural                | New keys: `worlds.*`, `method.*`, `bridges.*`, `humanLines.*`              | Medium |
| Project registry                 | Reusable — minor                     | Add `world: 'brands' \| 'systems' \| ...` field                            | Low    |
| `LiveWebsitePreview`             | Reusable — minor                     | No change                                                                  | Low    |
| **New: `BuilderMapSpine`**       | **New component**                    | SVG + ScrollTrigger L1                                                     | High   |
| **New: `WorldChapterHeader`**    | **New component**                    | Shared world title + accent                                                | Low    |
| **New: `WorldTransitionBridge`** | **New component**                    | First-person quote between worlds                                          | Low    |
| **New: `MethodSection`**         | **New component**                    | Replaces BuilderNarrative                                                  | Medium |
| **New: `FutureRoadmapSection`**  | **New component**                    | Replaces CurrentlyBuilding                                                 | Medium |
| **New: `TexasFundsLiveStrip`**   | **New component**                    | Extracted from LiveProducts                                                | Low    |

---

## 20. Proposed Repair Phases (Post-Approval)

### Phase 7.3B — Design System and Homepage Skeleton

- Add color tokens (`--accent-brand/system/intel/secure`, `--accent-live`)
- Add `world` field to project registry
- Create `BuilderMapSpine` (static SVG, no motion)
- Create `WorldChapterHeader`, `MethodSection` shell
- Recompose `page.tsx` section order (static layout only)
- **No GSAP changes**

### Phase 7.3C — Narrative and Content Restructure

- Add dictionary keys for worlds, human lines, bridges
- Rewrite homepage copy to first-person bridges
- Merge Texas Funds into Systems world
- Remove Skills + Process from homepage
- Simplify Restaurant homepage content (4 modules)
- Arabic QA for all new strings

### Phase 7.3D — Motion Refactor

- Deprecate `HomepageSectionMotion`
- Implement L1 map spine scroll progress
- Refactor Gymura/Restaurant pins (diagram only)
- Enforce no re-hide text rule
- `WorldTransitionMotion` (L2 once)
- Reduced motion audit

### Phase 7.3E — Project Art Direction

- Gymura world scene (brand principles, media slot gating)
- Restaurant simplified scene
- Intelligence lab panel (Alexa + Automation)
- Security path (Cyber + ALEX Linux line)
- Future roadmap rail

### Phase 7.3F — Final Responsive and Accessibility QA

- 320–1920px matrix
- RTL map mirror QA
- Pin handoff QA
- Keyboard nav + map dots
- Performance: LCP, CLS, bundle check

### Phase 8 — Targeted 3D (only if justified after 7.3F)

See §21 below.

---

## 21. Phase 8 Recommendation

### Does this redesigned direction need 3D?

**No global 3D canvas.** The Builder Map metaphor works better in **SVG + CSS + GSAP** than WebGL for this portfolio.

### Where 3D could add meaning (optional, targeted)

| Location             | Value                                         | Priority                         |
| -------------------- | --------------------------------------------- | -------------------------------- |
| Gymura product frame | Real apparel rotation when photography exists | Low — only with assets           |
| Hero ambient depth   | Subtle parallax field behind workstation      | Low — CSS suffices               |
| Manifesto atmosphere | Light field                                   | Very low — CSS gradient suffices |

### Where 3D must never be used

- Global always-on canvas
- Restaurant workflow (clarity > decoration)
- Cybersecurity section (trust > theatrics)
- Navigation / map spine
- Mobile first paint
- Text backgrounds

### Should global 3D canvas be permanently canceled?

**Recommend: yes, cancel as a default architecture.** Replace Phase 8 roadmap item with **“Targeted ambient depth only if metrics justify.”** The original roadmap Phase 8 assumed a global R3F layer — V2 direction supersedes that.

### Can Builder Map work with HTML, CSS, SVG, GSAP?

**Yes — this is the recommended stack.** Lowest cost, highest narrative clarity, full RTL control, respects reduced motion, no WebGL fallback needed.

### Lowest-cost, highest-impact use of 3D

If any 3D is approved post-7.3F: **one optional Gymura product pedestal** on desktop only, lazy-loaded, static fallback image, triggered only when real product GLB exists. Estimated impact: medium visual lift, high maintenance cost. **Defer until real assets exist.**

---

## 22. Final Creative Statement

Alex’s portfolio should not read as a list of projects. It should read as **one builder’s system** — a continuous journey from person to method to four worlds of proof, ending in conviction and invitation.

The workstation photo grounds the story in reality. The Builder Map gives wide screens purpose. World accents give chapters identity without fragmenting the palette. Motion explains connections — it never withholds words.

Technical strength is already proven. The next work is **creative unity**: one soul, one path, one reason to scroll from Alex to Gymura to Restaurant to the future.

**Do not implement until this direction is approved.**

---

## Appendix: Files referenced (read-only inspection)

| File                                                   | Relevance                         |
| ------------------------------------------------------ | --------------------------------- |
| `src/app/[locale]/page.tsx`                            | Current 11-section order          |
| `src/components/motion/HeroCinematicSection.tsx`       | Phase 7.2 Hero                    |
| `src/components/motion/GymuraCinematicSection.tsx`     | Flagship pin timeline             |
| `src/components/motion/RestaurantCinematicSection.tsx` | Dense systems section             |
| `src/components/motion/HomepageSectionMotion.tsx`      | Repeated reveal pattern           |
| `src/components/sections/BuilderNarrative.tsx`         | Narrative + pillars               |
| `src/lib/layout/section-spacing.ts`                    | Phase 7.2 spacing tokens          |
| `src/content/projects/index.ts`                        | Priority order                    |
| `docs/PHASE_0_7_AUDIT.md`                              | Confirmed fragmentation diagnosis |
| `docs/homepage-motion-direction.md`                    | Motion intent (partially drifted) |
