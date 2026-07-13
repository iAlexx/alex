"use client";

import dynamic from "next/dynamic";
import type { LiveWebsitePreviewProps } from "@/components/projects/LiveWebsitePreview";
import { PreviewLoadShell } from "@/components/projects/PreviewLoadShell";

function createDeferredPreview(variant: LiveWebsitePreviewProps["variant"]) {
  return dynamic(
    () =>
      import("@/components/projects/LiveWebsitePreview").then((mod) => ({
        default: mod.LiveWebsitePreview,
      })),
    {
      ssr: false,
      loading: () => <PreviewLoadShell variant={variant} />,
    },
  );
}

const DefaultPreview = createDeferredPreview("default");
const CompactPreview = createDeferredPreview("compact");
const CompactExpandedPreview = createDeferredPreview("compact-expanded");

/** Deferred live preview — splits interactive bundle from initial homepage JS. */
export function DeferredLiveWebsitePreview(props: LiveWebsitePreviewProps) {
  if (props.variant === "compact-expanded") {
    return <CompactExpandedPreview {...props} />;
  }
  if (props.variant === "compact") {
    return <CompactPreview {...props} />;
  }
  return <DefaultPreview {...props} />;
}
