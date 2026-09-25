"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_MEDIA } from "@/components/motion/motion-config";
import {
  activateMarker,
  bindOnceScrollTimeline,
  buildSequentialRailTimeline,
  completeAllRailDecorations,
  drawLine,
  logRailMotionDiagnostics,
  prepareAllRailDecorations,
  RAIL_MOTION_SELECTORS,
} from "@/lib/motion/journey-rail-motion";
import {
  RAIL_MOTION_DURATION,
  RAIL_MOTION_EASE,
  RAIL_MOTION_STAGGER,
  RAIL_MOTION_TRIGGER,
} from "@/lib/motion/rail-motion-tokens";
import { setupGlobalTraveler, teardownGlobalTraveler } from "@/lib/motion/global-traveler";

const WORLD_ORDER = ["brands", "systems", "intelligence", "security"] as const;

function sectionById(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function queryRoot(section: HTMLElement, anchor?: string): HTMLElement | null {
  if (anchor) {
    const anchorEl = section.querySelector(`[data-spine-anchor="${anchor}"]`);
    return (
      anchorEl?.closest<HTMLElement>(RAIL_MOTION_SELECTORS.root) ??
      anchorEl?.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.root) ??
      (anchorEl as HTMLElement | null)
    );
  }
  return section.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.root);
}

function isMotionDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return new URLSearchParams(window.location.search).get("motionDebug") === "1";
}

function setupWorldSpine(
  sectionId: string,
  triggerId: string,
  start = RAIL_MOTION_TRIGGER.section,
): ScrollTrigger | null {
  const section = sectionById(sectionId);
  if (!section) return null;

  const connector = section.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.connector);
  const spineLinks = section.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.spineLink);
  if (!connector && spineLinks.length === 0) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = gsap.timeline({ paused: true });
      const isRtl = document.documentElement.dir === "rtl";

      if (connector) {
        tl.to(
          connector,
          { scaleX: 1, duration: RAIL_MOTION_DURATION.connector, ease: RAIL_MOTION_EASE.draw },
          0,
        );
      }

      spineLinks.forEach((link, index) => {
        drawLine(tl, link, "horizontal", isRtl, 0.05 + index * 0.04, 0.28);
      });

      return tl;
    },
    { id: triggerId, start },
  );
}

function setupHeroOrigin(isRtl: boolean): ScrollTrigger | null {
  const section = sectionById("hero");
  if (!section) return null;

  const root = section.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.root);
  const marker = root?.querySelector(RAIL_MOTION_SELECTORS.marker);
  const stem = root?.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.line);
  if (!root || !marker || !stem) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = gsap.timeline({ paused: true });
      activateMarker(tl, marker, 0, 0.25);
      drawLine(tl, stem, "vertical", isRtl, 0.12, 0.35);
      return tl;
    },
    { id: "rail-hero", start: RAIL_MOTION_TRIGGER.hero },
  );
}

function setupMethodAndMap(isRtl: boolean, isMobile: boolean): void {
  const methodSection = sectionById("method");
  if (!methodSection) return;

  const processRoot = queryRoot(methodSection, "process");
  if (processRoot) {
    bindOnceScrollTimeline(
      methodSection,
      () =>
        buildSequentialRailTimeline(processRoot, {
          isRtl,
          isMobile,
          lineBeforeNode: true,
        }),
      { id: "rail-method" },
    );
  }

  const mapRoot = queryRoot(methodSection, "map");
  if (!mapRoot) return;

  bindOnceScrollTimeline(
    methodSection,
    () => {
      const mapTl = gsap.timeline({ paused: true });
      const coreMarker = mapRoot.querySelector<HTMLElement>(
        ".journey-rail__core [data-rail-marker]",
      );
      const coreLine = mapRoot.querySelector<HTMLElement>(
        "[data-rail-line].journey-rail__core-connector",
      );
      const branchLine = mapRoot.querySelector<HTMLElement>(
        "[data-rail-line].journey-rail__branch-rail",
      );

      if (coreMarker) {
        activateMarker(mapTl, coreMarker, 0);
      }
      if (coreLine && !isMobile) {
        drawLine(mapTl, coreLine, "horizontal", isRtl, 0.1);
      }
      if (branchLine && !isMobile) {
        drawLine(mapTl, branchLine, "horizontal", isRtl, 0.08, RAIL_MOTION_DURATION.mainLine);
      }

      WORLD_ORDER.forEach((worldKey) => {
        const node = mapRoot.querySelector<HTMLElement>(`[data-world-order="${worldKey}"]`);
        const drop = node?.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.marker);
        if (!node || !drop) return;
        activateMarker(mapTl, drop, `+=${RAIL_MOTION_STAGGER.node}`);
      });

      return mapTl;
    },
    { id: "rail-map", start: "top 75%" },
  );
}

function setupGymuraRail(isRtl: boolean, isMobile: boolean): ScrollTrigger | null {
  const section = sectionById("world-brands");
  if (!section) return null;

  const root = queryRoot(section, "brand-evolution");
  if (!root) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = buildSequentialRailTimeline(root, {
        isRtl,
        isMobile,
        lineBeforeNode: true,
      });

      const previewShell = section.querySelector<HTMLElement>(".gymura-preview-shell");
      const wordmark = section.querySelector<HTMLElement>(".editorial-wordmark");
      if (wordmark) {
        gsap.set(wordmark, { clipPath: "inset(0 100% 0 0)" });
        tl.to(
          wordmark,
          { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: RAIL_MOTION_EASE.draw },
          0,
        );
      }
      if (previewShell) {
        tl.to(
          previewShell,
          {
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--accent-brand) 35%, transparent), 0 0 18px color-mix(in srgb, var(--accent-brand) 12%, transparent)",
            duration: 0.35,
            ease: RAIL_MOTION_EASE.soft,
          },
          "-=0.1",
        );
      }

      return tl;
    },
    { id: "rail-gymura" },
  );
}

function setupSystemsRails(isRtl: boolean, isMobile: boolean): void {
  const section = sectionById("world-systems");
  if (!section) return;

  const workflowRoot = queryRoot(section, "workflow");
  if (workflowRoot) {
    bindOnceScrollTimeline(
      section,
      () => {
        const tl = buildSequentialRailTimeline(workflowRoot, {
          isRtl,
          isMobile,
          lineBeforeNode: true,
        });

        const orderToken = workflowRoot.querySelector<HTMLElement>("[data-order-token]");
        const nodes = workflowRoot.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.node);
        if (orderToken && nodes.length > 0 && !isMobile) {
          gsap.set(orderToken, { opacity: 0, x: 0 });
          tl.to(orderToken, { opacity: 1, duration: 0.2 }, 0.05);
          nodes.forEach((node, index) => {
            if (index === 0) return;
            const prev = nodes[index - 1];
            if (!prev) return;
            tl.to(
              orderToken,
              {
                x: () => node.offsetLeft - (nodes[0]?.offsetLeft ?? 0),
                duration: 0.32,
                ease: RAIL_MOTION_EASE.draw,
              },
              `+=${RAIL_MOTION_STAGGER.node}`,
            );
          });
        }

        return tl;
      },
      { id: "rail-restaurant" },
    );
  }

  const texasAside = section.querySelector<HTMLElement>(".systems-texas-branch");
  if (!texasAside) return;

  bindOnceScrollTimeline(
    texasAside,
    () => {
      const texasTl = gsap.timeline({ paused: true });
      const branchConnector = texasAside.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.line);
      const branchNode = texasAside.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.marker);

      if (branchConnector) {
        drawLine(texasTl, branchConnector, "horizontal", isRtl, 0, 0.3);
      }
      if (branchNode) {
        activateMarker(texasTl, branchNode, 0.15);
      }

      const microRoot = texasAside.querySelector<HTMLElement>('[data-spine-anchor="texas-flow"]');
      if (microRoot) {
        const microTl = buildSequentialRailTimeline(microRoot, {
          isRtl,
          isMobile: false,
          lineBeforeNode: true,
          stagger: 0.1,
        });
        texasTl.add(microTl, 0.25);

        const pulse = microRoot.querySelector<HTMLElement>("[data-texas-pulse]");
        const nodes = microRoot.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.node);
        if (pulse && nodes.length > 1 && !isMobile) {
          gsap.set(pulse, { opacity: 0 });
          texasTl.to(pulse, { opacity: 1, duration: 0.15 }, 0.3);
          nodes.forEach((node, index) => {
            if (index === 0) return;
            texasTl.to(
              pulse,
              {
                x: () => node.offsetLeft - (nodes[0]?.offsetLeft ?? 0),
                duration: 0.28,
                ease: RAIL_MOTION_EASE.draw,
              },
              `+=0.08`,
            );
          });
        }
      }

      return texasTl;
    },
    { id: "rail-texas", start: RAIL_MOTION_TRIGGER.sectionTight },
  );
}

function setupIntelligenceRail(isRtl: boolean, isMobile: boolean): ScrollTrigger | null {
  const section = sectionById("world-intelligence");
  if (!section) return null;

  const root = queryRoot(section, "architecture");
  if (!root) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = gsap.timeline({ paused: true });
      const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-line]"));

      if (!isMobile) {
        lines.forEach((line, index) => {
          const isHorizontal = line.classList.contains("intel-connector__line--horizontal");
          const orientation = isHorizontal ? "horizontal" : "vertical";
          drawLine(tl, line, orientation, isRtl, index === 0 ? 0 : `+=${0.06}`);
        });
      }

      const nodeOrder = [
        ".intel-diagram__slot--local",
        ".intel-diagram__slot--memory",
        ".intel-diagram__slot--tools",
        ".intel-diagram__slot--local-tools",
        ".intel-diagram__slot--automation",
      ];

      nodeOrder.forEach((selector, index) => {
        const slot = root.querySelector<HTMLElement>(selector);
        const node = slot?.querySelector<HTMLElement>("[data-rail-node]");
        if (!node) return;
        tl.fromTo(
          node,
          {
            borderColor: "color-mix(in srgb, var(--accent-intel) 20%, var(--color-line))",
          },
          {
            borderColor: "color-mix(in srgb, var(--accent-intel) 55%, var(--color-line))",
            duration: RAIL_MOTION_DURATION.node,
            ease: RAIL_MOTION_EASE.node,
          },
          isMobile ? index * 0.1 : 0.35 + index * 0.12,
        );
      });

      return tl;
    },
    { id: "rail-intelligence" },
  );
}

function setupSecurityRails(isRtl: boolean, isMobile: boolean): void {
  const section = sectionById("world-security");
  if (!section) return;

  const disciplineRoot = queryRoot(section, "discipline");
  if (disciplineRoot) {
    bindOnceScrollTimeline(
      section,
      () => {
        const track = disciplineRoot.querySelector<HTMLElement>(".journey-rail__track");
        const tl = buildSequentialRailTimeline(disciplineRoot, {
          isRtl,
          isMobile,
          lineOrientation: "vertical",
          lineBeforeNode: false,
          stagger: isMobile ? 0.08 : 0.1,
        });
        if (track && !isMobile) {
          tl.to(
            track,
            {
              "--rail-track-draw": 1,
              duration: RAIL_MOTION_DURATION.mainLine,
              ease: RAIL_MOTION_EASE.soft,
            },
            0,
          );
        }
        return tl;
      },
      { id: "rail-security-stages" },
    );
  }

  const principlesRoot = section.querySelector<HTMLElement>('[data-spine-anchor="principles"]');
  if (principlesRoot) {
    bindOnceScrollTimeline(
      principlesRoot,
      () => {
        const nodes = Array.from(
          principlesRoot.querySelectorAll<HTMLElement>(RAIL_MOTION_SELECTORS.node),
        );
        const tl = gsap.timeline({ paused: true });
        nodes.forEach((node, index) => {
          const marker = node.querySelector(RAIL_MOTION_SELECTORS.marker);
          if (!marker) return;
          activateMarker(tl, marker, index * 0.1);
        });
        return tl;
      },
      { id: "rail-security-principles", start: RAIL_MOTION_TRIGGER.sectionTight },
    );
  }

  const branch = section.querySelector<HTMLElement>(".security-framework__branch");
  if (branch) {
    bindOnceScrollTimeline(
      branch,
      () => {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(
          branch,
          { borderColor: "color-mix(in srgb, var(--accent-secure) 15%, var(--color-line))" },
          {
            borderColor: "color-mix(in srgb, var(--accent-secure) 40%, var(--color-line))",
            duration: 0.35,
            ease: RAIL_MOTION_EASE.soft,
          },
        );
        return tl;
      },
      { id: "rail-security-branch" },
    );
  }
}

function setupFutureRail(isRtl: boolean, isMobile: boolean): ScrollTrigger | null {
  const section = sectionById("future");
  if (!section) return null;

  const root = queryRoot(section, "future-path");
  if (!root) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = gsap.timeline({ paused: true });
      const originMarker = root.querySelector<HTMLElement>(
        '[data-rail-node="origin"] [data-rail-marker]',
      );
      if (originMarker) {
        activateMarker(tl, originMarker, 0);
      }

      const track = root.querySelector<HTMLElement>(".journey-rail__track");
      if (track && !isMobile) {
        tl.to(track, {
          "--future-draw": 1,
          duration: RAIL_MOTION_DURATION.mainLine,
          ease: RAIL_MOTION_EASE.soft,
        });
      }

      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-node]")).filter(
        (node) => node.dataset.railNode !== "origin",
      );

      nodes.forEach((node) => {
        const marker = node.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.marker);
        const isOpen = node.classList.contains("journey-rail__node--open");
        if (!marker) return;
        activateMarker(tl, marker, `+=${isMobile ? 0.08 : 0.1}`);
        if (isOpen) {
          tl.to(marker, {
            boxShadow: "0 0 10px color-mix(in srgb, var(--color-electric) 35%, transparent)",
            duration: 0.3,
            ease: RAIL_MOTION_EASE.soft,
          });
        }
      });

      return tl;
    },
    { id: "rail-future" },
  );
}

function setupManifestoConvergence(): ScrollTrigger | null {
  const section = sectionById("manifesto");
  if (!section) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const lines = Array.from(
        section.querySelectorAll<HTMLElement>(".manifesto-convergence__line"),
      );
      const core = section.querySelector<HTMLElement>("[data-rail-marker]");
      const tl = gsap.timeline({ paused: true });

      lines.forEach((line, index) => {
        tl.to(
          line,
          { scaleX: 1, opacity: 0.55, duration: 0.4, ease: RAIL_MOTION_EASE.soft },
          index * 0.08,
        );
      });

      if (core) {
        tl.to(
          core,
          {
            scale: 1,
            opacity: 1,
            duration: 0.28,
            ease: RAIL_MOTION_EASE.node,
          },
          0.35,
        );
      }

      return tl;
    },
    {
      id: "rail-manifesto",
      start: RAIL_MOTION_TRIGGER.sectionTight,
    },
  );
}

function setupContactResolution(): ScrollTrigger | null {
  const section = sectionById("contact");
  if (!section) return null;

  const root = section.querySelector<HTMLElement>(RAIL_MOTION_SELECTORS.root);
  if (!root) return null;

  return bindOnceScrollTimeline(
    section,
    () => {
      const tl = gsap.timeline({ paused: true });
      const stem = root.querySelector<HTMLElement>(".contact-resolution__stem");
      const isRtl = document.documentElement.dir === "rtl";

      if (stem) {
        drawLine(tl, stem, "vertical", isRtl, 0, RAIL_MOTION_DURATION.connector);
      }

      const socialGroup = root.querySelector<HTMLElement>('[data-rail-node="social-group"]');
      if (socialGroup) {
        const links = socialGroup.querySelectorAll("a");
        tl.fromTo(
          socialGroup,
          { y: 4 },
          { y: 0, duration: 0.28, ease: RAIL_MOTION_EASE.node },
          0.22,
        );
        tl.to(
          links,
          {
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--color-electric) 35%, transparent)",
            duration: 0.22,
            stagger: 0.04,
            ease: RAIL_MOTION_EASE.soft,
          },
          0.35,
        );
        tl.to(
          links,
          { boxShadow: "none", duration: 0.35, stagger: 0.03, ease: RAIL_MOTION_EASE.soft },
          0.65,
        );
      }

      return tl;
    },
    { id: "rail-contact", start: RAIL_MOTION_TRIGGER.sectionTight },
  );
}

function setupHomepageRailMotion(isRtl: boolean, isMobile: boolean): void {
  setupHeroOrigin(isRtl);
  setupMethodAndMap(isRtl, isMobile);

  (
    ["world-brands", "world-systems", "world-intelligence", "world-security", "future"] as const
  ).forEach((id) => {
    setupWorldSpine(id, `rail-spine-${id}`);
  });

  setupGymuraRail(isRtl, isMobile);
  setupSystemsRails(isRtl, isMobile);
  setupIntelligenceRail(isRtl, isMobile);
  setupSecurityRails(isRtl, isMobile);
  setupFutureRail(isRtl, isMobile);
  setupManifestoConvergence();
  setupContactResolution();
}

/** Client-only homepage rail motion orchestrator (Phase 7.3D). */
export function HomepageRailMotion() {
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (process.env.NODE_ENV === "development") {
        console.info("[rail-motion] mounted");
      }

      const motionDebug = isMotionDebugEnabled();
      if (motionDebug) {
        ScrollTrigger.defaults({ markers: true });
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_MEDIA.reduced, () => {
        completeAllRailDecorations();
        if (process.env.NODE_ENV === "development") {
          console.info("[rail-motion] reduced-motion branch — static complete rails");
        }
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isMobile = window.matchMedia(MOTION_MEDIA.mobile).matches;
        const isRtl = document.documentElement.dir === "rtl";

        if (isMobile) {
          completeAllRailDecorations();
          if (process.env.NODE_ENV === "development") {
            console.info("[rail-motion] mobile branch — static complete rails");
          }
          return () => undefined;
        }

        prepareAllRailDecorations(isRtl, isMobile);
        setupHomepageRailMotion(isRtl, isMobile);

        const traveler = document.querySelector<HTMLElement>("[data-global-traveler]");
        if (traveler) {
          setupGlobalTraveler(traveler);
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            logRailMotionDiagnostics(motionDebug);
          });
        });
      });

      return () => {
        teardownGlobalTraveler();
        mm.revert();
      };
    },
    { dependencies: [] },
  );

  return <div ref={hostRef} className="sr-only" aria-hidden data-rail-motion-host />;
}
