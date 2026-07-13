"use client";

import { useEffect, useRef } from "react";
import type { BuilderSystemSceneHandle } from "@/lib/three-hero/builder-system-scene";
import type { BuilderDebugMode } from "@/lib/three-hero/builder-system-materials";
import { assessThreeHeroEligibility } from "@/lib/three-hero/builder-system-eligibility";

export interface UseThreeHeroSceneOptions {
  locale: "en" | "ar";
  debug?: BuilderDebugMode;
  forceFallback?: boolean;
  onReady?: (ready: boolean) => void;
}

function isFinePointer(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** Single rAF owner + lifecycle for Three Hero Lab canvas. */
export function useThreeHeroScene(
  hostRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseThreeHeroSceneOptions,
): void {
  const { locale, debug = null, forceFallback = false, onReady } = options;
  const sceneRef = useRef<BuilderSystemSceneHandle | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const eligibility = assessThreeHeroEligibility();

    if (!host || !canvas || forceFallback || debug === "fallback" || !eligibility.eligible) {
      onReady?.(false);
      return;
    }

    let cancelled = false;
    let removePointer: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let cleanupVisibility: (() => void) | null = null;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";

    const syncActive = () => {
      const shouldRun = inView && pageVisible;
      sceneRef.current?.setActive(shouldRun);
    };

    void (async () => {
      const mod = await import("@/lib/three-hero/builder-system-scene");
      if (cancelled) return;

      const scene = await mod.createBuilderSystemScene(canvas, { locale, debug });
      if (cancelled || !scene) {
        onReady?.(false);
        return;
      }

      sceneRef.current = scene;
      scene.resetAnimation();
      onReady?.(true);

      const rect = host.getBoundingClientRect();
      scene.resize(rect.width, rect.height);

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !sceneRef.current) return;
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(host);

      if (isFinePointer()) {
        const onMove = (event: PointerEvent) => {
          const bounds = host.getBoundingClientRect();
          if (bounds.width === 0) return;
          scene.setPointer(
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
          );
        };
        const onLeave = () => scene.clearPointer();
        host.addEventListener("pointermove", onMove, { passive: true });
        host.addEventListener("pointerleave", onLeave, { passive: true });
        removePointer = () => {
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
        };
      }

      io = new IntersectionObserver(
        (entries) => {
          inView = entries.some((entry) => entry.isIntersecting);
          syncActive();
        },
        { rootMargin: "48px" },
      );
      io.observe(host);

      const onVisibility = () => {
        pageVisible = document.visibilityState === "visible";
        syncActive();
      };
      document.addEventListener("visibilitychange", onVisibility);
      syncActive();

      cleanupVisibility = () => {
        document.removeEventListener("visibilitychange", onVisibility);
      };
    })();

    return () => {
      cancelled = true;
      cleanupVisibility?.();
      removePointer?.();
      resizeObserver?.disconnect();
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
      onReady?.(false);
    };
  }, [hostRef, canvasRef, locale, debug, forceFallback, onReady]);
}
