"use client";

import { useEffect, useRef } from "react";
import type { OrbitRingsSceneHandle } from "@/lib/orbital-hero/orbit-rings-scene";

interface UseOrbitRingsSceneOptions {
  enabled?: boolean;
}

/** Lifecycle for orbital torus rings — dynamic Three.js import. */
export function useOrbitRingsScene(
  hostRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseOrbitRingsSceneOptions = {},
): void {
  const { enabled = true } = options;
  const sceneRef = useRef<OrbitRingsSceneHandle | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !enabled) return;

    let cancelled = false;
    let removePointer: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";
    let removeVis: (() => void) | null = null;

    const sync = () => {
      sceneRef.current?.setActive(inView && pageVisible);
    };

    void (async () => {
      const mod = await import("@/lib/orbital-hero/orbit-rings-scene");
      if (cancelled) return;
      const scene = await mod.createOrbitRingsScene(canvas);
      if (cancelled || !scene) return;

      sceneRef.current = scene;
      scene.resize(host.clientWidth, host.clientHeight);

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !sceneRef.current) return;
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(host);

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (fine) {
        const onMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          if (!r.width) return;
          scene.setPointer(
            ((e.clientX - r.left) / r.width) * 2 - 1,
            ((e.clientY - r.top) / r.height) * 2 - 1,
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

      io = new IntersectionObserver((entries) => {
        inView = entries.some((e) => e.isIntersecting);
        sync();
      });
      io.observe(host);

      const onVis = () => {
        pageVisible = document.visibilityState === "visible";
        sync();
      };
      document.addEventListener("visibilitychange", onVis);
      removeVis = () => document.removeEventListener("visibilitychange", onVis);
      sync();
    })();

    return () => {
      cancelled = true;
      removePointer?.();
      removeVis?.();
      resizeObserver?.disconnect();
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [hostRef, canvasRef, enabled]);
}
