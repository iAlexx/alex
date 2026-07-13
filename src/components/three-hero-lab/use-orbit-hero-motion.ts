"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface UseOrbitHeroMotionOptions {
  enabled?: boolean;
}

/** Subtle orbital drift + pointer parallax + violet node pulse. */
export function useOrbitHeroMotion(
  rootRef: React.RefObject<HTMLElement | null>,
  options: UseOrbitHeroMotionOptions = {},
): void {
  const { enabled = true } = options;
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const rear = root.querySelector<SVGElement>("[data-orbit-layer='rear']");
    const front = root.querySelector<SVGElement>("[data-orbit-layer='front']");
    const node = root.querySelector<HTMLElement>("[data-violet-node]");

    if (rear) {
      gsap.to(rear, {
        rotation: 1.2,
        duration: 28,
        ease: "none",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    }

    if (front) {
      gsap.to(front, {
        rotation: -0.8,
        duration: 22,
        ease: "none",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    }

    if (node) {
      gsap.to(node, {
        opacity: 0.45,
        scale: 1.15,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    }

    const onMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      if (bounds.width === 0) return;
      const nx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const ny = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      tweenRef.current?.kill();
      tweenRef.current = gsap.to(root, {
        "--orbit-parallax-x": `${nx * 3}px`,
        "--orbit-parallax-y": `${ny * 2}px`,
        "--orbit-parallax-front-x": `${nx * 5}px`,
        "--orbit-parallax-front-y": `${ny * 3}px`,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(root, {
        "--orbit-parallax-x": "0px",
        "--orbit-parallax-y": "0px",
        "--orbit-parallax-front-x": "0px",
        "--orbit-parallax-front-y": "0px",
        duration: 0.9,
        ease: "power2.out",
      });
    };

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) {
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave, { passive: true });
    }

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      tweenRef.current?.kill();
      gsap.killTweensOf([rear, front, node, root]);
    };
  }, [rootRef, enabled]);
}
