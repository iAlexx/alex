"use client";

import dynamic from "next/dynamic";
import { GlobalTraveler } from "@/components/v2/motion/GlobalTraveler";

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
  return (
    <>
      <GlobalTraveler />
      <WorldCoreLayer />
      <HomepageRailMotion />
    </>
  );
}
