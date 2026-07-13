"use client";

import { useEffect, useRef } from "react";
import {
  evaluateBuilderMap3DEligibility,
  MAP3D_MIN_VIEWPORT_WIDTH,
} from "@/lib/map3d/builder-map-3d-eligibility";
import type { BuilderMap3DSceneHandle } from "@/lib/map3d/builder-map-3d-scene";
import { USE_PERSISTENT_WORLD_CORE } from "@/lib/world-core/config";

const PRELOAD_ROOT_MARGIN = "480px 0px";
const ACTIVE_ROOT_MARGIN = "120px 0px";

function isDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return new URLSearchParams(window.location.search).get("threeDebug") === "1";
}

/**
 * Decorative Builder Map 3D layer — Phase 7.4.
 *
 * Desktop-only enhancement behind the static semantic map. The WebGL scene
 * module is dynamically imported only when the map nears the viewport on an
 * eligible device. Every failure path leaves the static map untouched.
 */
export function BuilderMap3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (USE_PERSISTENT_WORLD_CORE) return;

    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const debug = isDebugEnabled();
    const log = (...args: unknown[]) => {
      if (debug) console.info("[builder-map-3d]", ...args);
    };

    const eligibility = evaluateBuilderMap3DEligibility();
    log("eligibility:", eligibility);
    if (!eligibility.eligible) {
      return;
    }

    let scene: BuilderMap3DSceneHandle | null = null;
    let loading = false;
    let cancelled = false;
    let inView = false;
    let pageVisible = document.visibilityState === "visible";
    let resizeObserver: ResizeObserver | null = null;
    let removePointerListeners: (() => void) | null = null;

    const syncActive = () => {
      scene?.setActive(inView && pageVisible);
    };

    const attachPointer = () => {
      const container = host.parentElement ?? host;
      const onPointerMove = (event: PointerEvent) => {
        if (!scene) return;
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        scene.setPointer(x, y);
      };
      const onPointerLeave = () => scene?.clearPointer();

      container.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerleave", onPointerLeave, { passive: true });
      removePointerListeners = () => {
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
      };
    };

    const startScene = async () => {
      if (loading || scene || cancelled) return;
      loading = true;
      try {
        const mod = await import("@/lib/map3d/builder-map-3d-scene");
        if (cancelled) return;
        // Re-check width — user may have resized while the chunk loaded.
        if (window.innerWidth < MAP3D_MIN_VIEWPORT_WIDTH) {
          log("viewport shrank below threshold during load — skipping");
          return;
        }
        scene = mod.createBuilderMap3DScene(canvas, { debug });
        if (!scene) {
          log("scene creation failed — static map remains");
          return;
        }

        const rect = host.getBoundingClientRect();
        scene.resize(rect.width, rect.height);

        resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (!entry || !scene) return;
          scene.resize(entry.contentRect.width, entry.contentRect.height);
        });
        resizeObserver.observe(host);

        attachPointer();
        syncActive();
        log("scene started");
      } catch (error) {
        log("3D chunk load failed — static map remains", error);
      } finally {
        loading = false;
      }
    };

    // Generous margin: load the chunk shortly before the map is visible.
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          preloadObserver.disconnect();
          void startScene();
        }
      },
      { rootMargin: PRELOAD_ROOT_MARGIN },
    );
    preloadObserver.observe(host);

    // Tight margin: render only while near/inside the viewport.
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inView = entry.isIntersecting;
        syncActive();
      },
      { rootMargin: ACTIVE_ROOT_MARGIN },
    );
    activeObserver.observe(host);

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      syncActive();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      preloadObserver.disconnect();
      activeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      removePointerListeners?.();
      resizeObserver?.disconnect();
      scene?.dispose();
      scene = null;
    };
  }, []);

  if (USE_PERSISTENT_WORLD_CORE) {
    return null;
  }

  return (
    <div ref={hostRef} aria-hidden className="builder-map-3d" data-map3d-host>
      <canvas ref={canvasRef} className="builder-map-3d__canvas" tabIndex={-1} />
    </div>
  );
}
