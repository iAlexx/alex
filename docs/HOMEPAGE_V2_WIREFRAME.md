# Homepage V2 Wireframe

**Phase:** 7.3A — Wireframe only (no implementation)  
**Companion doc:** `docs/CREATIVE_DIRECTION_V2.md`  
**Concept:** ALEX — The Builder System  
**Map metaphor:** Builder Map / System Path (electric spine + world nodes)

---

## Global Constants

| Token                    | Value                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| Max content grid         | `1152px` (`max-w-6xl`) — used inside full-bleed bands                   |
| Gutter (desktop)         | `24px` (`px-6`)                                                         |
| Map spine width          | `2px` (desktop margin), `4px` (mobile inset)                            |
| Header height            | `64px` (`h-16`)                                                         |
| World chapter min-height | `min(85vh, 900px)` desktop; `auto` mobile                               |
| Primary type scale       | H1 `clamp(2.5rem, 4vw, 4rem)`; world title `clamp(2rem, 3.5vw, 3.5rem)` |

### World color states

| Section            | Accent variable    | Active edge               |
| ------------------ | ------------------ | ------------------------- |
| Hero / Method      | `--color-electric` | Right/bottom radial       |
| Build Brands       | `--accent-brand`   | Leading edge silver bleed |
| Build Systems      | `--accent-system`  | Leading edge amber bleed  |
| Build Intelligence | `--accent-intel`   | Leading edge violet bleed |
| Build Securely     | `--accent-secure`  | Leading edge cyan bleed   |
| Future / Finale    | `--color-electric` | Core convergence          |

---

## Desktop Wireframe (1440 × 900 reference)

### §0 — Header (all sections)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ h=64px │ Alex.          ○───○───○───○  Projects Lab Cyber Contact  [EN|AR] │
│          map dots:      B   S   I   Sec                                    │
│          progress line ═══════════░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property       | Value                                             |
| -------------- | ------------------------------------------------- |
| Viewport usage | 100% × 64px + 2px progress                        |
| Columns        | Full width; inner `max-w-6xl` centered            |
| Motion         | L4 — progress line `scaleX` linked to scroll (L1) |
| RTL            | Dots order mirrors; logo stays inline-start       |

---

### §1 — Hero / The Person (`#hero`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                                             │
│  [38% text column]                    [52% image column]      │ spine      │
│                                                                             │
│  ALEX (eyebrow, electric)             ┌────────────────────────┐ │           │
│                                       │                        │ │           │
│  I build brands, software,            │   Workstation photo    │ │    ◉      │
│  and intelligent systems.           │   (environmental,      │ │   core    │
│  (H1, max-w-md)                       │    no card frame)      │ │   node    │
│                                       │                        │ │           │
│  Product Builder · Full-Stack · …     │         glow ──────────┼─┘           │
│  (positioning, mist)                  └────────────────────────┘           │
│                                                                             │
│  “I do not start with code. I start by                              spine  │
│   understanding how the whole thing should work.”                   begins │
│  (first-person, max-w-sm, soft)                                             │
│                                                                             │
│  [Explore the System]  [Enter the Lab]     View CV · coming soon            │
│   primary electric      secondary outline    tertiary quiet                 │
│                                                                             │
│  min-height: 88vh (desktop)                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property  | Value                                                       |
| --------- | ----------------------------------------------------------- |
| Layout    | Asymmetric A — not 50/50; `grid-cols-[38%_52%_10px]`        |
| Image     | `alex-workstation-desktop.webp`; priority LCP               |
| Map motif | Core node `◉` at image lower-inline-start corner            |
| Color     | Electric radial background; no world accent yet             |
| Motion    | L2 text enter once; L3 image scale once; L1 core pulse once |
| → Next    | Spine extends downward into §2                              |

---

### §2 — The Method (`#method`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ spine │                                                                     │
│   │   │  THE METHOD (eyebrow)                                               │
│   │   │                                                                     │
│   │   │  “I like taking ideas that feel complicated and turning them          │
│   │   │   into systems people can actually use.”                            │
│   │   │  (first-person, text-3xl, max-w-2xl)                                │
│   │   │                                                                     │
│   │   │  An idea is only the beginning. → structure → workflow →            │
│   │   │  system → product. (compressed narrative lines, single row          │
│   │   │  or 2-line stack — NOT 5 stacked H2s)                               │
│   │   │                                                                     │
│   │   │  ┌────────┬────────┬────────┬────────┐                              │
│   │   │  │ 01     │ 02     │ 03     │ 04     │  4-step method rail          │
│   │   │  │Under-  │Structure│ Build  │ Refine │  (replaces 7-step Process)  │
│   │   │  │stand   │        │        │        │                              │
│   │   │  └────────┴────────┴────────┴────────┘                              │
│   │   │                                                                     │
│   │   │  Inline principles (no card grid):                                  │
│   │   │  · Problem before technology  · AI as multiplier  · Security early  │
│   │   │                                                                     │
│   │   │  py: 120px │ max-w-3xl prose column │ map spine in left gutter     │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value                                                        |
| -------- | ------------------------------------------------------------ |
| Layout   | B — Reading Rail                                             |
| Motion   | L2 headline once; rail steps L2 stagger once; **no re-hide** |
| Color    | Core electric eyebrows only                                  |
| → Next   | Bridge copy + map widens to §3                               |

---

### §3 — Builder Map Intro (`#map-intro`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ FULL-BLEED BAND (graphite bg shift) — Composition E                         │
│                                                                             │
│     ┌──────────┐    four worlds one system (H2, centered)                   │
│     │    ◉     │    Alex connects every project below.                      │
│     │   ALEX   │                                                            │
│     └─────┬────┘                                                            │
│           │                                                                 │
│     ┌─────┴─────┬─────────┬─────────┐                                       │
│     │  BRANDS   │ SYSTEMS │  INTEL  │  SECURE                               │
│     │  silver   │  amber  │  violet │  cyan                                 │
│     │  Gymura   │ Rest.   │ Alexa   │ Cyber                                 │
│     │           │ Texas   │ Auto    │ Linux                                 │
│     └───────────┴─────────┴─────────┴─────────┘                             │
│                                                                             │
│  height: ~60vh │ SVG map │ scroll fills spine to first world                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value                                                    |
| -------- | -------------------------------------------------------- |
| Layout   | E — Map Panel, full viewport width                       |
| Motion   | L1 — spine draws to each node on scroll (scrub SVG only) |
| → Next   | Silver activates → §4                                    |

**Transition note:** 200px unpinned scroll; silver edge bleed begins.

---

### §4 — World: Build Brands / Gymura (`#world-brands`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░ silver edge bleed (leading 8%) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ spine──●BRANDS                                                              │
│                                                                             │
│  BUILD BRANDS (eyebrow, silver)              ┌─────────────────────────┐  │
│  Gymura (world title, 3.5rem)                │  LiveWebsitePreview       │  │
│  Sportswear Brand & E-commerce               │  compact variant          │  │
│                                              │  (bleeds 80px past grid)  │  │
│  “Gymura started as a brand idea…”           │                           │  │
│  (first-person bridge, max-w-md)             │  [gymura.store toolbar]   │  │
│                                              └─────────────────────────┘  │
│  [Live]  Founder · Brand Builder · …                                        │
│                                                                             │
│  Brand principles:  Identity · Product · Commerce · Experience              │
│  (inline tags, not cards)                                                   │
│                                                                             │
│  Ecosystem (vertical list, 7 items):                                          │
│  │ Brand direction                                                          │
│  │ Visual identity                                                          │
│  │ …                                                                        │
│                                                                             │
│  [Visit Gymura ↗]   [Case Study →]   (max 2 actions)                        │
│                                                                             │
│  min-height: 85vh │ Layout C — Asymmetric 40/60                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property    | Value                                                         |
| ----------- | ------------------------------------------------------------- |
| Color state | `--accent-brand` active                                       |
| Motion      | L3 — pin preview+ecosystem 300px max; text static after enter |
| Media       | No fake apparel; preview only until real assets               |
| → Next      | Quote break → amber transition → §5                           |

**Bridge (narrow quote break):**

```
│ “A brand earns trust. A system earns daily use.” │
│ (Composition F — max-w-xl, centered, 80px py)     │
```

---

### §5 — World: Build Systems / Restaurant + Texas Funds (`#world-systems`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░ amber edge bleed ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ spine──●SYSTEMS                                                             │
│                                                                             │
│  BUILD SYSTEMS (eyebrow, amber)                                             │
│  Restaurant Management Platform (title)                                       │
│                                                                             │
│  “I designed this around how orders actually move…” (bridge)                │
│                                                                             │
│  PROBLEM (1 line): Arabic-first operations platform — one journey.            │
│                                                                             │
│ ═══════════════════ WORKFLOW BAND (full-bleed, Composition D) ═══════════  │
│  [QR]──[Cashier]──[Kitchen]──[Payment]──[Delivery]──[Reports]  (8 stages)   │
│       ○ order card travels on track (pinned diagram, 320px scrub)           │
│ ═══════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  System modules (4 chips only): QR Menu · Cashier · Kitchen · Management    │
│                                                                             │
│  ┌─────────────────────────┐                                                │
│  │ LiveWebsitePreview      │  alnkha.site                                    │
│  └─────────────────────────┘                                                │
│                                                                             │
│  [Visit ↗]  [Case Study →]                                                    │
│                                                                             │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  TEXAS FUNDS LIVE STRIP (horizontal band, Composition D)                    │
│  ● LIVE  │  Telegram product used by real users  │  [Case Study →]          │
│  emerald indicator only                                                     │
│                                                                             │
│  min-height: 90vh (workflow drives height)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property    | Value                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Color state | `--accent-system` active                                                   |
| Motion      | L3 pin on workflow track only; modules static; Texas strip L4 single pulse |
| Removed     | 16-module grid, ops panels, secondary module cards                         |
| → Next      | Violet fork → §6                                                           |

---

### §6 — World: Build Intelligence (`#world-intelligence`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░ violet edge bleed ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ spine──●INTEL──┬── (fork)                                                   │
│                │                                                            │
│  BUILD INTELLIGENCE                                                         │
│  “Once a system works, I ask what should become intelligent.”               │
│                                                                             │
│  ┌────────────────────────────┬────────────────────────────┐                │
│  │ ALEXA AI                   │ AUTOMATION LAB             │                │
│  │ Functional Prototype       │ Active Development         │                │
│  │                            │                            │                │
│  │ Memory diagram (SVG)       │ Workflow nodes (SVG)       │                │
│  │ · Short-term               │ · n8n                      │                │
│  │ · Long-term                │ · API integrations         │                │
│  │ · Tools registry           │ · AI workflows             │                │
│  │                            │                            │                │
│  │ [Case Study →]             │ [Case Study →]             │                │
│  └────────────────────────────┴────────────────────────────┘                │
│                                                                             │
│  Layout: 2-panel lab (NOT equal cards) │ py: 100px                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property    | Value                                    |
| ----------- | ---------------------------------------- |
| Color state | `--accent-intel`                         |
| Motion      | L2 panel enter once; SVG diagrams static |
| → Next      | Cyan shields → §7                        |

---

### §7 — World: Build Securely (`#world-security`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ░ cyan edge bleed ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ spine──●SECURE                                                              │
│                                                                             │
│  BUILD SECURELY                                                             │
│  “Complex systems need boundaries, permissions, and legal discipline.”      │
│                                                                             │
│  Intro (2 short paragraphs, max-w-2xl)                                      │
│                                                                             │
│  SECURITY PATH (vertical timeline — retained from 7.2, refined):            │
│  │ 01 Networking fundamentals                                              │
│  │ 02 Linux                                                                │
│  │ 03 Web & API security                                                    │
│  │ …                                                                       │
│  │ 09 Red Team concepts                                                     │
│                                                                             │
│  ALEX Linux — Research & Concept (one line, honest, no card)                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │ Legal disclaimer (always visible, not motion-gated)        │               │
│  └─────────────────────────────────────────────────────────┘               │
│                                                                             │
│  [Cybersecurity Lab →]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property    | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Color state | `--accent-secure`                                     |
| Motion      | L2 path nodes appear once; legal block never animated |
| → Next      | Dashed extension → §8                                 |

---

### §8 — Future / What's Next (`#future`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ spine - - - - - - - - - - - - - >  (dashed open path)                       │
│                                                                             │
│  WHAT'S NEXT                                                                │
│  Honest statuses. No fake progress bars.                                    │
│                                                                             │
│  │ ● Alexa AI          Functional Prototype    [→]                          │
│  │ ● Automation Lab    Active Development      [→]                          │
│  │ ● ALEX Linux        Research                [→]                          │
│  │ ● Private builds    Private Build           (no link)                    │
│                                                                             │
│  Layout F — priority list, not 3-column cards │ py: 80px                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value                 |
| -------- | --------------------- |
| Color    | Core electric returns |
| Motion   | L2 list items once    |
| → Next   | Convergence → §9      |

---

### §9 — Manifesto (`#manifesto`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ atmospheric manifesto.webp (opacity 40%) + dark gradients                   │
│                                                                             │
│         Building my own empire, one idea at a time.                         │
│         (or AR: أحوّل كل فكرة إلى خطوة نحو شيء أكبر.)                       │
│         text-5xl, max-w-3xl                                                 │
│                                                                             │
│         Supporting mission paragraph                                        │
│                                                                             │
│  map spine converges to ◉ core                                              │
│  min-height: 65vh                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value                                  |
| -------- | -------------------------------------- |
| Motion   | L2 quote once; reduced motion = static |
| Image    | `alex-workstation-manifesto.webp` only |

---

### §10 — Contact (`#contact`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐     │
│   │  Have an ambitious idea?                                          │     │
│   │  Let's turn it into something real.                               │     │
│   │                                                                   │     │
│   │  [Telegram] [LinkedIn] [GitHub] [Instagram]                       │     │
│   └───────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  py: 80px │ gradient card │ email absent (null)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### §11 — Footer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Alex. │ positioning line │ Damascus                                         │
│ Explore links │ Connect links (no signature repeat)                           │
│ py: 48px                                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tablet Wireframe (768 × 1024 reference)

Tablet uses **single-column authored flow** with map spine on inline-start margin. No pin sections.

| Section      | Tablet adaptation                                             |
| ------------ | ------------------------------------------------------------- |
| Hero         | Image top (45vh max), text below; core node between           |
| Method       | Full width prose; 4-step rail becomes 2×2 grid                |
| Map intro    | 2×2 world node grid instead of horizontal                     |
| Gymura       | Stacked: copy → preview → ecosystem list                      |
| Restaurant   | Workflow vertical (like current mobile); no order card travel |
| Texas strip  | Full width, stacked                                           |
| Intelligence | Stacked panels (Alexa then Automation)                        |
| Security     | Timeline single column                                        |
| Future       | List unchanged                                                |
| Manifesto    | Quote centered, image background                              |
| Contact      | Card full width                                               |

```
┌────────────────────────────┐
│ Header + map dots          │
├────────────────────────────┤
│ [Image 45vh]               │
│ Hero text                  │
├────────────────────────────┤
│ Method                     │
├────────────────────────────┤
│ Map 2×2                    │
├────────────────────────────┤
│ Gymura (stacked)           │
├────────────────────────────┤
│ Restaurant (vertical flow) │
│ Texas strip                │
├────────────────────────────┤
│ Intelligence (stacked)     │
├────────────────────────────┤
│ Security path              │
├────────────────────────────┤
│ Future list                │
├────────────────────────────┤
│ Manifesto                  │
├────────────────────────────┤
│ Contact                    │
├────────────────────────────┤
│ Footer                     │
└────────────────────────────┘
```

| Property   | Value                                |
| ---------- | ------------------------------------ |
| Breakpoint | `640px–1023px`                       |
| Motion     | L2 only; no pin; no pointer parallax |
| Map        | Vertical spine, inset 20px           |

---

## Mobile Wireframe

### 320px (iPhone SE)

```
┌──────────────────────┐  viewport 320px
│ Alex.    [≡] [EN]    │  h=64
│ ═════░░░░░░░░░░░░░░  │  progress 2px
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ workstation img  │ │  h=max 42vh
│ │ (mobile webp)    │ │  object-position center 22%
│ └──────────────────┘ │
│ ◉ core               │
│ ALEX                 │
│ I build brands…      │  H1 ~28px, 3-4 lines
│ (positioning)        │  12px, wraps 3 lines
│ “I do not start…”    │  14px, max 5 lines
│ [Explore System]     │  full width, h=48
│ [Enter Lab]          │  full width, h=48
│ CV · coming soon     │  inline, 12px
├──────────────────────┤
│ │ METHOD             │  spine 4px left
│ │ “I like taking…”   │
│ │ idea→structure…    │  2 lines compressed
│ │ [01][02]           │  2×2 step grid
│ │ [03][04]           │
│ │ principles (3)     │  bullet inline
├──────────────────────┤
│ │ MAP (stacked)      │
│ │ ◉ Alex             │
│ │ ┌────┐ ┌────┐      │  2×2 nodes
│ │ │Brnd│ │Sys │      │  140px cells
│ │ └────┘ └────┘      │
│ │ ┌────┐ ┌────┐      │
│ │ │Intl│ │Sec │      │
│ │ └────┘ └────┘      │
├──────────────────────┤
│ │ ● BRANDS           │
│ │ Gymura             │
│ │ bridge 3 lines     │
│ │ [Live]             │
│ │ principles tags    │  wrap
│ │ ecosystem list     │
│ │ [preview compact]  │  w=100%, h=220
│ │ [Visit] [Study]    │  stacked
├──────────────────────┤
│ bridge quote 2 lines │
├──────────────────────┤
│ │ ● SYSTEMS          │
│ │ Restaurant         │
│ │ problem 2 lines    │
│ │ workflow VERTICAL  │  8 stages stack
│ │ (no pin)           │
│ │ 4 module chips     │  wrap 2×2
│ │ [preview]          │  h=200
│ │ ● LIVE Texas Funds │  strip
│ │ 2 lines + link     │
├──────────────────────┤
│ │ ● INTELLIGENCE     │
│ │ Alexa panel        │
│ │ diagram simplified │
│ │ Automation panel   │
├──────────────────────┤
│ │ ● SECURE           │
│ │ 2 intro lines      │
│ │ path 5 visible     │  show 5, link for rest
│ │ legal box          │
├──────────────────────┤
│ │ FUTURE list (4)    │
├──────────────────────┤
│ │ MANIFESTO          │
│ │ quote 3-4 lines    │  text-2xl
│ │ supporting 3 lines │
├──────────────────────┤
│ │ CONTACT card       │
│ │ buttons wrap 2×2   │  min-h=48 each
├──────────────────────┤
│ Footer compact       │
└──────────────────────┘
```

| 320px notes | Detail                                             |
| ----------- | -------------------------------------------------- |
| Overflow    | `overflow-x: hidden` on main; no horizontal scroll |
| Headline    | `text-balance`; test AR at 3 lines minimum         |
| Touch       | All CTAs min 48px height                           |
| Preview     | Toolbar collapses to icon menu                     |
| Motion      | Opacity only, 16px y max                           |
| Est. scroll | ~9–10 screens                                      |

---

### 375px (iPhone standard)

Same structure as 320px with:

| Adjustment      | Value                                       |
| --------------- | ------------------------------------------- |
| H1 size         | +4px (`text-3xl`)                           |
| Hero image      | max 44vh                                    |
| Map nodes       | 150px cells, 2×2                            |
| Workflow        | Vertical, labels single line where possible |
| Contact buttons | 2×2 grid with 8px gap                       |
| Manifesto quote | `text-3xl`                                  |

---

### 430px (iPhone Pro Max / large mobile)

Same structure with:

| Adjustment     | Value                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| Hero           | Image and text may use `sm:` side-by-side if ≥640 — at 430 stays stacked |
| Method rail    | 4 steps single row (horizontal scroll if needed, `scroll-snap`)          |
| Intelligence   | Side-by-side panels if ≥640 only; at 430 stays stacked                   |
| Preview height | 240px                                                                    |
| Est. scroll    | ~8–9 screens                                                             |

---

## Section Order Summary

| Order | ID                   | Section            | Desktop height | Mobile height |
| ----- | -------------------- | ------------------ | -------------- | ------------- |
| 0     | —                    | Header             | 64px           | 64px          |
| 1     | `hero`               | The Person         | ~88vh          | ~55vh         |
| 2     | `method`             | The Method         | ~500px         | ~480px        |
| 3     | `map-intro`          | Builder Map        | ~60vh          | ~400px        |
| 4     | `world-brands`       | Gymura             | ~85vh          | ~700px        |
| —     | —                    | Bridge quote       | 120px          | 80px          |
| 5     | `world-systems`      | Restaurant + Texas | ~90vh          | ~900px        |
| 6     | `world-intelligence` | Alexa + Automation | ~600px         | ~550px        |
| 7     | `world-security`     | Cyber + Linux      | ~650px         | ~500px        |
| 8     | `future`             | Roadmap            | ~400px         | ~350px        |
| 9     | `manifesto`          | Conviction         | ~65vh          | ~45vh         |
| 10    | `contact`            | Invitation         | ~350px         | ~320px        |
| 11    | —                    | Footer             | ~120px         | ~140px        |

---

## Transition Notes (all viewports)

| From → To           | Visual        | Copy bridge                    | Motion                     |
| ------------------- | ------------- | ------------------------------ | -------------------------- |
| Hero → Method       | Spine extends | —                              | L1 spine draw 200px        |
| Method → Map        | Band bg shift | “Four worlds, one system.”     | L1 nodes illuminate        |
| Map → Brands        | Silver bleed  | “First proof: a brand.”        | L2 world header            |
| Brands → Systems    | Silver→amber  | “A brand earns trust…”         | L1 accent cross-fade 400ms |
| Systems → Intel     | Amber→violet  | “Operations → intelligence.”   | L1 fork appears            |
| Intel → Secure      | Violet→cyan   | “Complexity → responsibility.” | L2 path draw               |
| Secure → Future     | Cyan→electric | “The system keeps growing.”    | L1 dashed extension        |
| Future → Manifesto  | Converge      | —                              | L1 spine merge             |
| Manifesto → Contact | —             | —                              | L2 quote (manifesto only)  |

**Universal rule:** No text re-hide on reverse scroll. Fast scroll down keeps all revealed text at `opacity: 1`.

---

## Motion Notes (by viewport)

| Viewport        | L1 Map        | L2 Text        | L3 Diagram                | L4 UI | Pin          |
| --------------- | ------------- | -------------- | ------------------------- | ----- | ------------ |
| Desktop ≥1024   | Full scrub    | Once on enter  | Restaurant workflow 320px | Hover | 1 max active |
| Tablet 640–1023 | Static filled | Once           | Disabled                  | Touch | None         |
| Mobile ≤639     | Static line   | Opacity 16px y | Disabled                  | Touch | None         |
| Reduced motion  | All static    | None           | None                      | None  | None         |

---

## RTL Notes (Arabic `/ar`)

| Element       | RTL behavior                                                       |
| ------------- | ------------------------------------------------------------------ |
| Map spine     | Mirrors to inline-end margin                                       |
| World nodes   | Order: Secure, Intel, Systems, Brands (visual) — labels unmirrored |
| Hero image    | Inline-start (right in RTL)                                        |
| Text columns  | `text-align: start`                                                |
| Workflow      | Stays `dir="ltr"` for diagram; labels `dir="auto"`                 |
| Live preview  | LTR shell (unchanged)                                              |
| Progress line | Fills from inline-start                                            |
| Bridge quotes | Arabic punctuation outer                                           |
| CTA row       | Primary button inline-start first                                  |
| Footer links  | Grid columns mirror                                                |

**Do not mirror:** preview toolbar order, technical diagrams, status badges.

---

## Content Order (final)

1. Hero — person + human line + CTAs
2. Method — first-person + narrative compression + 4-step rail + principles
3. Map intro — four worlds diagram
4. Build Brands — Gymura scene
5. Bridge quote
6. Build Systems — Restaurant (problem/flow/system/proof) + Texas Funds strip
7. Build Intelligence — Alexa + Automation panels
8. Build Securely — Cyber path + ALEX Linux line + legal
9. Future — roadmap list
10. Manifesto — signature
11. Contact — channels
12. Footer — compact

**Removed from homepage:** Skills, Process (7-step), Live Products (standalone), narrative.pillars grid, 16 Restaurant modules, ops panels.

---

_End of wireframe. No implementation in Phase 7.3A._
