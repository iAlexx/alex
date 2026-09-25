"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { scheduleDeferredMount } from "@/lib/deferred-mount";

const GlobalTraveler = dynamic(
  () =>
    import("@/components/v2/motion/GlobalTraveler").then((mod) => ({
      default: mod.GlobalTraveler,
    })),
  { ssr: false },
);

const WorldCoreLayer = dynamic(
  () =>
    import("@/components/world-core/WorldCoreLayer").then((mod) => ({
      default: mod.WorldCoreLayer,
    })),
  { ssr: false },
);

const HomepageRailMotion = dynamic(
  () =>
    import("@/components/v2/motion/HomepageRailMotion").then((mod) => ({
      default: mod.HomepageRailMotion,
    })),
  { ssr: false },
);

/** Defers GSAP + ScrollTrigger + persistent World Core until after initial homepage paint. */
export function DeferredHomepageRailMotion() {
  const [ready, setReady] = useState(false);

  useEffect(() => scheduleDeferredMount(() => setReady(true), 1500), []);

  if (!ready) return null;

  return (
    <>
      <GlobalTraveler />
      <WorldCoreLayer />
      <HomepageRailMotion />
    </>
  );
}
