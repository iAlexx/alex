"use client";

import { useEffect, useState, type ReactNode } from "react";

interface DesktopOnlyProps {
  children: ReactNode;
  /** Match Tailwind `lg` — aligns with mobile-compress-hide breakpoint. */
  minWidth?: number;
}

/** Renders children only at desktop widths — avoids hydrating CSS-hidden preview shells on mobile. */
export function DesktopOnly({ children, minWidth = 1024 }: DesktopOnlyProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setVisible(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);

  if (!visible) return null;
  return children;
}
