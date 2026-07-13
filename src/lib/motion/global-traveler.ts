/**
 * Global traveler — scrubbed spine progress object (Phase 7.4R).
 */

import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { MOTION_MEDIA } from "@/components/motion/motion-config";

export const TRAVELER_WAYPOINT_ORDER = [
  { sectionId: "hero", waypoint: "core", tint: "var(--color-electric)" },
  { sectionId: "method", waypoint: "method", tint: "var(--color-electric)" },
  { sectionId: "world-brands", waypoint: "brands", tint: "var(--accent-brand)" },
  { sectionId: "world-systems", waypoint: "systems", tint: "var(--accent-system)" },
  { sectionId: "world-intelligence", waypoint: "intelligence", tint: "var(--accent-intel)" },
  { sectionId: "world-security", waypoint: "security", tint: "var(--accent-secure)" },
  { sectionId: "future", waypoint: "future", tint: "var(--color-electric)" },
  { sectionId: "manifesto", waypoint: "manifesto", tint: "var(--color-electric)" },
  { sectionId: "contact", waypoint: "contact", tint: "var(--color-electric)" },
] as const;

export interface TravelerAnchor {
  sectionId: string;
  waypoint: string;
  tint: string;
  y: number;
  x: number;
}

function readWaypointPosition(section: HTMLElement): { x: number; y: number } | null {
  const anchor =
    section.querySelector<HTMLElement>(`[data-spine-waypoint]`) ??
    section.querySelector<HTMLElement>(".builder-spine");
  if (!anchor) return null;
  const rect = anchor.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function measureTravelerAnchors(): TravelerAnchor[] {
  const anchors: TravelerAnchor[] = [];

  for (const entry of TRAVELER_WAYPOINT_ORDER) {
    const section = document.getElementById(entry.sectionId);
    if (!section) continue;
    const pos = readWaypointPosition(section);
    if (!pos) continue;
    anchors.push({
      sectionId: entry.sectionId,
      waypoint: entry.waypoint,
      tint: entry.tint,
      x: pos.x,
      y: pos.y,
    });
  }

  return anchors;
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null;
let activeTrigger: ScrollTrigger | null = null;

export function setupGlobalTraveler(travelerEl: HTMLElement): ScrollTrigger | null {
  if (window.matchMedia(MOTION_MEDIA.reduced).matches) {
    travelerEl.style.display = "none";
    return null;
  }

  const isMobile = window.matchMedia(MOTION_MEDIA.mobile).matches;
  if (isMobile) {
    travelerEl.classList.add("global-traveler--mobile");
  }

  const anchors = measureTravelerAnchors();
  if (anchors.length < 2) return null;

  const refresh = () => {
    const next = measureTravelerAnchors();
    if (next.length < 2) return;
    anchors.splice(0, anchors.length, ...next);
    activeTrigger?.refresh();
  };

  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 120);
  };
  window.addEventListener("resize", onResize);

  gsap.set(travelerEl, {
    position: "fixed",
    top: anchors[0]!.y,
    left: anchors[0]!.x,
    xPercent: -50,
    yPercent: -50,
    opacity: 1,
    zIndex: 5,
    pointerEvents: "none",
  });

  const st = ScrollTrigger.create({
    id: "global-traveler",
    start: 0,
    end: "max",
    scrub: isMobile ? 0.45 : 0.35,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const liveAnchors = measureTravelerAnchors();
      if (liveAnchors.length < 2) return;

      const progress = self.progress;
      const scaled = progress * (liveAnchors.length - 1);
      const index = Math.min(liveAnchors.length - 2, Math.floor(scaled));
      const local = scaled - index;
      const a = liveAnchors[index]!;
      const b = liveAnchors[index + 1]!;
      const y = a.y + (b.y - a.y) * local;
      const x = a.x + (b.x - a.x) * local;
      const tint = local > 0.5 ? b.tint : a.tint;

      gsap.set(travelerEl, { top: y, left: x, "--traveler-tint": tint });

      if (self.direction !== 0) {
        travelerEl.dataset.travelerMoving = local > 0.02 && local < 0.98 ? "1" : "0";
      }

      const activeIndex = Math.round(scaled);
      const active = liveAnchors[Math.min(activeIndex, liveAnchors.length - 1)]!;
      document.documentElement.style.setProperty("--global-spine-tint", active.tint);

      for (const anchor of liveAnchors) {
        const section = document.getElementById(anchor.sectionId);
        if (!section) continue;
        const isActive = anchor.sectionId === active.sectionId;
        section.dataset.travelerActive = isActive ? "1" : "0";
        if (isActive && self.direction !== 0) {
          section.dataset.worldEntered = "1";
        }
      }
    },
    onRefresh: () => {
      const next = measureTravelerAnchors();
      if (next.length >= 2) anchors.splice(0, anchors.length, ...next);
    },
  });

  activeTrigger = st;

  const prevKill = st.kill.bind(st);
  st.kill = (reset?: boolean) => {
    window.removeEventListener("resize", onResize);
    if (resizeTimer) clearTimeout(resizeTimer);
    activeTrigger = null;
    prevKill(reset);
  };

  return st;
}

export function teardownGlobalTraveler(): void {
  ScrollTrigger.getById("global-traveler")?.kill();
  activeTrigger = null;
}
