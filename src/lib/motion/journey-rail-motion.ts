import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { MOTION_MEDIA } from "@/components/motion/motion-config";
import {
  RAIL_MOTION_DURATION,
  RAIL_MOTION_EASE,
  RAIL_MOTION_STAGGER,
  RAIL_MOTION_TRIGGER,
} from "@/lib/motion/rail-motion-tokens";

export const RAIL_MOTION_SELECTORS = {
  root: "[data-rail-motion-root]",
  line: "[data-rail-line]",
  node: "[data-rail-node]",
  marker: "[data-rail-marker]",
  spineLink: "[data-rail-spine-link]",
  spine: "[data-rail-spine]",
  connector: "[data-rail-connector]",
} as const;

export type LineOrientation = "horizontal" | "vertical";

export interface SequentialRailConfig {
  sectionId: string;
  rootSelector?: string;
  triggerStart?: string;
  scrollTriggerId: string;
  /** Semantic node order — animation follows this, not visual RTL position. */
  nodeSelector?: string;
  lineSelector?: string;
  markerSelector?: string;
  /** Draw lines before activating the next node. */
  lineBeforeNode?: boolean;
  /** Skip line prep on mobile — nodes only. */
  mobileNodesOnly?: boolean;
  onComplete?: () => void;
}

function getSectionRoot(sectionId: string, rootSelector?: string): HTMLElement | null {
  const section = document.getElementById(sectionId);
  if (!section) return null;
  if (rootSelector) {
    return section.querySelector<HTMLElement>(rootSelector);
  }
  return section.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.root) ?? section;
}

function lineTransformOrigin(orientation: LineOrientation, isRtl: boolean): string {
  if (orientation === "vertical") return "top center";
  return isRtl ? "right center" : "left center";
}

function inferLineOrientation(line: Element): LineOrientation {
  if (
    line.classList.contains("journey-rail__segment--vertical") ||
    line.classList.contains("intel-connector__line--vertical") ||
    line.classList.contains("hero-origin-rail__stem") ||
    line.classList.contains("contact-resolution__stem")
  ) {
    return "vertical";
  }
  return "horizontal";
}

const MUTED_MARKER = { scale: 0.92, opacity: 0.68 } as const;

/** Mark motion roots ready before decorative prep (useLayoutEffect — avoids hydration flash). */
export function markMotionRootsReady(): void {
  document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.root).forEach((root) => {
    root.dataset.motionReady = "true";
  });
  document.documentElement.dataset.railMotionInit = "true";
}

/** Eager prep so rails start incomplete; playback happens on section enter. */
export function prepareAllRailDecorations(isRtl: boolean, isMobile: boolean): void {
  markMotionRootsReady();

  if (!isMobile) {
    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.line).forEach((line) => {
      const orientation = inferLineOrientation(line);
      prepLinesForDraw([line], orientation, isRtl);
    });

    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.connector).forEach((connector) => {
      gsap.set(connector, {
        scaleX: 0,
        transformOrigin: isRtl ? "right center" : "left center",
      });
    });

    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.spineLink).forEach((link) => {
      prepLinesForDraw([link], "horizontal", isRtl);
    });

    document
      .querySelectorAll<HTMLElement>(".journey-rail--open-vertical .journey-rail__track")
      .forEach((track) => {
        gsap.set(track, { "--future-draw": 0 });
      });

    document
      .querySelectorAll<HTMLElement>(".journey-rail--discipline-vertical .journey-rail__track")
      .forEach((track) => {
        gsap.set(track, { "--rail-track-draw": 0 });
      });

    document.querySelectorAll<HTMLElement>(".manifesto-convergence__line").forEach((line) => {
      gsap.set(line, {
        scaleX: 0.85,
        opacity: 0.35,
        transformOrigin: isRtl ? "right center" : "left center",
      });
    });
  }

  document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.marker).forEach((marker) => {
    gsap.set(marker, MUTED_MARKER);
  });
}

/** Reduced-motion static complete state for all decorative rails. */
export function completeAllRailDecorations(): void {
  markMotionRootsReady();

  document.querySelectorAll(RAIL_MOTION_SELECTORS.line).forEach((line) => {
    gsap.set(line, { scaleX: 1, scaleY: 1, opacity: 1 });
  });
  document.querySelectorAll(RAIL_MOTION_SELECTORS.marker).forEach((marker) => {
    gsap.set(marker, { scale: 1, opacity: 1 });
  });
  document.querySelectorAll(RAIL_MOTION_SELECTORS.connector).forEach((connector) => {
    gsap.set(connector, { scaleX: 1 });
  });
  document.querySelectorAll(RAIL_MOTION_SELECTORS.spineLink).forEach((link) => {
    gsap.set(link, { scaleX: 1, scaleY: 1 });
  });
  document
    .querySelectorAll(".journey-rail--open-vertical .journey-rail__track")
    .forEach((track) => {
      gsap.set(track, { "--future-draw": 1 });
    });
  document
    .querySelectorAll(".journey-rail--discipline-vertical .journey-rail__track")
    .forEach((track) => {
      gsap.set(track, { "--rail-track-draw": 1 });
    });
  document.querySelectorAll(".manifesto-convergence__line").forEach((line) => {
    gsap.set(line, { scaleX: 1, opacity: 0.55 });
  });
}

export function logRailMotionDiagnostics(motionDebug = false): void {
  if (process.env.NODE_ENV !== "development") return;

  const reduced = window.matchMedia(MOTION_MEDIA.reduced).matches;
  const counts = {
    roots: document.querySelectorAll(RAIL_MOTION_SELECTORS.root).length,
    lines: document.querySelectorAll(RAIL_MOTION_SELECTORS.line).length,
    nodes: document.querySelectorAll(RAIL_MOTION_SELECTORS.node).length,
    markers: document.querySelectorAll(RAIL_MOTION_SELECTORS.marker).length,
    connectors: document.querySelectorAll(RAIL_MOTION_SELECTORS.connector).length,
  };

  console.info("[rail-motion] ScrollTrigger registered", Boolean(ScrollTrigger));
  console.info("[rail-motion] reduced motion", reduced);
  console.info("[rail-motion] selector counts", counts);
  console.info("[rail-motion] ScrollTrigger count", ScrollTrigger.getAll().length);

  ScrollTrigger.getAll().forEach((trigger) => {
    console.info("[rail-motion] trigger", {
      id: trigger.vars.id,
      start: trigger.start,
      end: trigger.end,
      active: trigger.isActive,
      progress: trigger.progress,
    });
  });

  if (motionDebug) {
    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.root).forEach((root) => {
      root.style.outline = "1px dashed magenta";
    });
    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.line).forEach((line) => {
      line.style.outline = "1px solid cyan";
    });
    document.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.node).forEach((node) => {
      node.style.outline = "1px dotted orange";
    });
  }
}

/** Prepare decorative lines for draw without hiding text. */
export function prepLinesForDraw(
  lines: Element[],
  orientation: LineOrientation,
  isRtl: boolean,
): void {
  const prop = orientation === "vertical" ? "scaleY" : "scaleX";
  const origin = lineTransformOrigin(orientation, isRtl);
  lines.forEach((line) => {
    gsap.set(line, { [prop]: 0, transformOrigin: origin });
  });
}

export function drawLine(
  tl: gsap.core.Timeline,
  line: Element,
  orientation: LineOrientation,
  isRtl: boolean,
  position?: string | number,
  duration: number = RAIL_MOTION_DURATION.connector,
): void {
  const prop = orientation === "vertical" ? "scaleY" : "scaleX";
  const origin = lineTransformOrigin(orientation, isRtl);
  tl.fromTo(
    line,
    { [prop]: 0, transformOrigin: origin },
    { [prop]: 1, duration, ease: RAIL_MOTION_EASE.draw },
    position,
  );
}

export function activateMarker(
  tl: gsap.core.Timeline,
  marker: Element,
  position?: string | number,
  duration: number = RAIL_MOTION_DURATION.node,
): void {
  tl.fromTo(
    marker,
    { scale: 0.92, opacity: 0.68 },
    { scale: 1, opacity: 1, duration, ease: RAIL_MOTION_EASE.node },
    position,
  );
}

export function activateNodeBody(
  tl: gsap.core.Timeline,
  node: Element,
  position?: string | number,
): void {
  const body = node.querySelector(".journey-rail__node-body");
  if (!body) return;
  tl.fromTo(
    body,
    {
      borderColor: "color-mix(in srgb, var(--rail-world-color) 15%, var(--color-line))",
    },
    {
      borderColor: "color-mix(in srgb, var(--rail-world-color) 45%, var(--color-line))",
      duration: RAIL_MOTION_DURATION.node,
      ease: RAIL_MOTION_EASE.node,
    },
    position,
  );
}

/** One-way scroll-triggered timeline — plays once and stays complete. */
export function bindOnceScrollTimeline(
  trigger: Element,
  buildTimeline: () => gsap.core.Timeline,
  options: { start?: string; id: string },
): ScrollTrigger {
  let timeline: gsap.core.Timeline | null = null;

  const ensureComplete = () => {
    if (timeline && timeline.progress() < 1) {
      timeline.progress(1);
    }
  };

  return ScrollTrigger.create({
    trigger,
    start: options.start ?? RAIL_MOTION_TRIGGER.section,
    once: true,
    id: options.id,
    onEnter: (self) => {
      if (!timeline) {
        timeline = buildTimeline();
      }
      if (timeline.progress() >= 1) return;
      // Fast-scroll past end before init — snap complete; otherwise play visibly.
      if (self.progress === 1) {
        timeline.progress(1);
        return;
      }
      timeline.restart(true);
    },
    onEnterBack: ensureComplete,
  });
}

/** Sequential node + line activation inside a scoped root. */
export function buildSequentialRailTimeline(
  root: HTMLElement,
  config: {
    isRtl: boolean;
    isMobile: boolean;
    nodeSelector?: string;
    lineSelector?: string;
    markerSelector?: string;
    lineOrientation?: LineOrientation;
    lineBeforeNode?: boolean;
    stagger?: number;
  },
): gsap.core.Timeline {
  const nodeSelector = config.nodeSelector ?? RAIL_MOTION_SELECTORS.node;
  const lineSelector = config.lineSelector ?? RAIL_MOTION_SELECTORS.line;
  const markerSelector = config.markerSelector ?? RAIL_MOTION_SELECTORS.marker;
  const orientation = config.lineOrientation ?? "horizontal";
  const stagger = config.stagger ?? RAIL_MOTION_STAGGER.node;

  const nodes = Array.from(root.querySelectorAll<HTMLElement>(nodeSelector));
  const lines = Array.from(root.querySelectorAll<HTMLElement>(lineSelector));

  const tl = gsap.timeline({ paused: true });

  nodes.forEach((node, index) => {
    const marker = node.querySelector(markerSelector);
    const line = lines[index];
    const at = index === 0 ? 0 : `+=${stagger}`;

    if (config.lineBeforeNode && line && !config.isMobile) {
      drawLine(tl, line, orientation, config.isRtl, at);
    }

    if (marker) {
      activateMarker(tl, marker, config.lineBeforeNode && line ? `+=${0.04}` : at);
    } else if (node.classList.contains("journey-rail__node")) {
      activateNodeBody(tl, node, at);
    }

    if (!config.lineBeforeNode && line && !config.isMobile) {
      drawLine(tl, line, orientation, config.isRtl, `+=${0.04}`);
    }
  });

  return tl;
}

/** Run motion with matchMedia — reduced motion gets final state immediately. */
export function runScopedRailMotion(
  scope: HTMLElement | null,
  setup: (context: {
    isReduced: boolean;
    isMobile: boolean;
    isRtl: boolean;
  }) => (() => void) | void,
): () => void {
  if (!scope) return () => undefined;

  const mm = gsap.matchMedia(scope);
  let cleanup: (() => void) | undefined;

  mm.add(
    {
      reduce: MOTION_MEDIA.reduced,
      mobile: MOTION_MEDIA.mobile,
    },
    (context) => {
      const isReduced = Boolean(context.conditions?.reduce);
      const isMobile = Boolean(context.conditions?.mobile);
      const isRtl = document.documentElement.dir === "rtl";

      if (isReduced) {
        scope.querySelectorAll(RAIL_MOTION_SELECTORS.line).forEach((line) => {
          gsap.set(line, { scaleX: 1, scaleY: 1, opacity: 1 });
        });
        scope.querySelectorAll(RAIL_MOTION_SELECTORS.marker).forEach((marker) => {
          gsap.set(marker, { scale: 1, opacity: 1 });
        });
        scope.querySelectorAll(RAIL_MOTION_SELECTORS.spine).forEach((spine) => {
          gsap.set(spine, { "--spine-draw": 1 });
        });
        return;
      }

      cleanup = setup({ isReduced, isMobile, isRtl }) ?? undefined;
    },
  );

  return () => {
    cleanup?.();
    mm.revert();
  };
}

export function setupSequentialSectionRail(config: SequentialRailConfig): () => void {
  const section = document.getElementById(config.sectionId);
  if (!section) return () => undefined;

  return runScopedRailMotion(section, ({ isMobile, isRtl }) => {
    bindOnceScrollTimeline(
      section,
      () => {
        const root = getSectionRoot(config.sectionId, config.rootSelector);
        if (!root) return gsap.timeline();

        const tl = buildSequentialRailTimeline(root, {
          isRtl,
          isMobile: isMobile || Boolean(config.mobileNodesOnly),
          nodeSelector: config.nodeSelector,
          lineSelector: config.lineSelector,
          markerSelector: config.markerSelector,
          lineBeforeNode: config.lineBeforeNode ?? true,
          stagger: isMobile ? RAIL_MOTION_STAGGER.nodeMobile : RAIL_MOTION_STAGGER.node,
        });

        if (config.onComplete) {
          tl.eventCallback("onComplete", config.onComplete);
        }

        return tl;
      },
      {
        id: config.scrollTriggerId,
        start: config.triggerStart,
      },
    );

    return () => {
      ScrollTrigger.getById(config.scrollTriggerId)?.kill();
    };
  });
}
