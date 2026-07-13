"use client";

import { useCallback, useState } from "react";
import type { Dictionary } from "@/content/translations";
import { DeferredLiveWebsitePreview } from "@/components/projects/DeferredLiveWebsitePreview";
import { ExternalLink } from "@/components/ui/ExternalLink";
import "@/components/mobile/mobile-preview-teaser.css";

type MobilePreviewTeaserProps = {
  websiteUrl: string;
  title: string;
  displayDomain: string;
  openWebsiteLabel: string;
  openPreviewLabel: string;
  visitLabel: string;
  labels: Dictionary["livePreview"];
  opensInNewTabLabel: string;
  variant?: "compact-expanded" | "compact";
};

/** Mobile-only preview teaser — iframe loads only after explicit expand. */
export function MobilePreviewTeaser({
  websiteUrl,
  title,
  displayDomain,
  openWebsiteLabel,
  openPreviewLabel,
  visitLabel,
  labels,
  opensInNewTabLabel,
  variant = "compact-expanded",
}: MobilePreviewTeaserProps) {
  const [expanded, setExpanded] = useState(false);

  const expand = useCallback(() => {
    setExpanded(true);
    document.documentElement.classList.add("mobile-preview-expanded");
  }, []);

  if (expanded) {
    return (
      <div className="mobile-preview-teaser mobile-preview-teaser--expanded lg:hidden">
        <div className="mobile-preview-teaser__header">
          <p className="mobile-preview-teaser__eyebrow">{title}</p>
          <ExternalLink
            href={websiteUrl}
            opensInNewTabLabel={opensInNewTabLabel}
            className="mobile-preview-teaser__visit"
          >
            {visitLabel}
          </ExternalLink>
        </div>
        <div className="mobile-preview-teaser__frame">
          <DeferredLiveWebsitePreview
            websiteUrl={websiteUrl}
            title={title}
            displayDomain={displayDomain}
            openWebsiteLabel={openWebsiteLabel}
            labels={labels}
            variant={variant}
            opensInNewTabLabel={opensInNewTabLabel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-preview-teaser lg:hidden">
      <div className="mobile-preview-teaser__poster" aria-hidden>
        <span className="mobile-preview-teaser__domain">{displayDomain}</span>
      </div>
      <button type="button" className="mobile-preview-teaser__open" onClick={expand}>
        {openPreviewLabel}
      </button>
    </div>
  );
}
