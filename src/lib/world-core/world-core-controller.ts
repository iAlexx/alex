import { applyWorldCssVariables, resolveWorldHex } from "@/lib/world-core/world-colors";
import type { WorldCoreControllerHandle, WorldState } from "@/lib/world-core/types";
import type { WorldCoreSceneHandle } from "@/lib/world-core/types";
import {
  isWorldDebugEnabled,
  pickActiveWorldSection,
  syncSectionWorldActive,
} from "@/lib/world-core/section-activation";

type ControllerOptions = {
  host: HTMLElement;
  canvas: HTMLCanvasElement | null;
  getScene: () => WorldCoreSceneHandle | null;
  onWorldChange?: (world: WorldState) => void;
};

let rafId = 0;

/** Central homepage World Core controller — exclusive active world + CSS migration. */
export function createWorldCoreController(options: ControllerOptions): WorldCoreControllerHandle {
  const { host, canvas, getScene, onWorldChange } = options;
  let activeWorld: WorldState = "core";
  let activeSectionId = "hero";
  let resizeObserver: ResizeObserver | null = null;
  let pageVisible = document.visibilityState === "visible";
  let inView = true;
  let removeVis: (() => void) | null = null;
  let removePointer: (() => void) | null = null;
  let removeResize: (() => void) | null = null;
  let removeScroll: (() => void) | null = null;

  const debugLog = (payload: Record<string, unknown>) => {
    if (!isWorldDebugEnabled()) return;
    console.info("[world-core]", payload);
  };

  const applyWorld = (world: WorldState, sectionId: string, immediate = false) => {
    const prev = activeWorld;
    if (world === activeWorld && sectionId === activeSectionId && !immediate) return;

    activeWorld = world;
    activeSectionId = sectionId;

    const atmosphereCount = syncSectionWorldActive(sectionId);
    applyWorldCssVariables(world, immediate);
    getScene()?.setWorldState(world, immediate);
    onWorldChange?.(world);

    debugLog({
      activeWorld: world,
      activeSectionId: sectionId,
      previousWorld: prev,
      threeTargetHex: resolveWorldHex(world),
      accentRgb: getComputedStyle(document.documentElement).getPropertyValue("--world-accent-rgb"),
      atmosphereLayers: atmosphereCount,
    });
  };

  const syncActive = () => {
    getScene()?.setActive(inView && pageVisible);
  };

  const refreshWorld = (immediate = false) => {
    const { world, sectionId, progress } = pickActiveWorldSection();
    applyWorld(world, sectionId, immediate);

    if (isWorldDebugEnabled()) {
      debugLog({ activationProgress: progress });
    }
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      refreshWorld();
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  removeScroll = () => window.removeEventListener("scroll", onScroll);

  const onVis = () => {
    pageVisible = document.visibilityState === "visible";
    syncActive();
  };
  document.addEventListener("visibilitychange", onVis);
  removeVis = () => document.removeEventListener("visibilitychange", onVis);

  const hostIo = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      syncActive();
    },
    { threshold: 0 },
  );
  hostIo.observe(host);

  resizeObserver = new ResizeObserver(() => {
    getScene()?.resize(host.clientWidth, host.clientHeight);
  });
  resizeObserver.observe(host);

  const onWinResize = () => refreshWorld();
  window.addEventListener("resize", onWinResize, { passive: true });
  removeResize = () => window.removeEventListener("resize", onWinResize);

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && canvas) {
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      if (!r.width) return;
      getScene()?.setPointer(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        ((e.clientY - r.top) / r.height) * 2 - 1,
      );
    };
    const onLeave = () => getScene()?.clearPointer();
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });
    removePointer = () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }

  applyWorld("core", "hero", true);
  getScene()?.resize(host.clientWidth, host.clientHeight);
  refreshWorld(true);

  return {
    setActive: (next: boolean) => {
      inView = next;
      syncActive();
    },
    resize: () => {
      getScene()?.resize(host.clientWidth, host.clientHeight);
      refreshWorld();
    },
    dispose: () => {
      if (rafId) cancelAnimationFrame(rafId);
      hostIo.disconnect();
      resizeObserver?.disconnect();
      removeVis?.();
      removePointer?.();
      removeResize?.();
      removeScroll?.();
      for (const el of document.querySelectorAll("[data-world-active]")) {
        delete (el as HTMLElement).dataset.worldActive;
      }
    },
  };
}
