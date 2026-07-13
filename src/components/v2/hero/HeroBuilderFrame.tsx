"use client";

import { useEffect, useRef } from "react";
import { evaluateWebGLEligibility } from "@/lib/webgl/webgl-eligibility";
import type { BuilderFrameSceneHandle } from "@/lib/builder-frame/builder-frame-scene";

const ACTIVE_ROOT_MARGIN = "80px 0px";

function isDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return new URLSearchParams(window.location.search).get("frameDebug") === "1";
}

/** Decorative Hero Builder Frame — async WebGL with CSS fallback visible underneath. */
export function HeroBuilderFrame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const debug = isDebugEnabled();
    const log = (...args: unknown[]) => {
      if (debug) console.info("[hero-builder-frame]", ...args);
    };

    const eligibility = evaluateWebGLEligibility();
    log("eligibility:", eligibility);
    if (!eligibility.eligible) {
      host.dataset.frameTier = eligibility.tier;
      return;
    }

    let scene: BuilderFrameSceneHandle | null = null;
    let loading = false;
    let cancelled = false;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";
    let resizeObserver: ResizeObserver | null = null;
    let removePointerListeners: (() => void) | null = null;
    const canPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const syncActive = () => {
      scene?.setActive(inView && pageVisible);
    };

    const attachPointer = () => {
      if (!canPointer) return;
      const container = (host.closest(".hero-visual-stack") ?? host) as HTMLElement;
      const onPointerMove = (event: PointerEvent) => {
        if (!scene) return;
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        scene.setPointer(x, y);
        container.style.setProperty("--hero-pointer-x", `${((x + 1) * 0.5 * 100).toFixed(1)}%`);
        container.style.setProperty("--hero-pointer-y", `${((y + 1) * 0.5 * 100).toFixed(1)}%`);
      };
      const onPointerLeave = () => {
        scene?.clearPointer();
        container.style.removeProperty("--hero-pointer-x");
        container.style.removeProperty("--hero-pointer-y");
      };

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
        const mod = await import("@/lib/builder-frame/builder-frame-scene");
        if (cancelled) return;
        const recheck = evaluateWebGLEligibility();
        if (!recheck.eligible) return;

        scene = mod.createBuilderFrameScene(canvas, {
          debug,
          simplified: recheck.tier === "B",
        });
        if (!scene) return;

        host.dataset.frameTier = recheck.tier;
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
        log("chunk load failed", error);
      } finally {
        loading = false;
      }
    };

    void startScene();

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
      activeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      removePointerListeners?.();
      resizeObserver?.disconnect();
      scene?.dispose();
      scene = null;
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className="hero-builder-frame" data-builder-frame-host>
      <canvas ref={canvasRef} className="hero-builder-frame__canvas" tabIndex={-1} />
    </div>
  );
}
