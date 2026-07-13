import type { PortfolioProject } from "@/content/projects/types";
import type { CaseStudyCopy, Dictionary } from "@/content/translations";
import { LiveWebsitePreview } from "@/components/projects/LiveWebsitePreview";

interface ProjectLivePreviewProps {
  project: PortfolioProject;
  copy: CaseStudyCopy;
  dictionary: Dictionary;
  motionShell?: string;
}

/** Renders a live website preview when the case study defines preview config. */
export function ProjectLivePreview({
  project,
  copy,
  dictionary,
  motionShell,
}: ProjectLivePreviewProps) {
  const preview = copy.livePreview;
  if (!preview || !project.website) {
    return null;
  }

  return (
    <LiveWebsitePreview
      websiteUrl={project.website}
      title={preview.title}
      displayDomain={preview.displayDomain}
      openWebsiteLabel={preview.openWebsiteLabel}
      labels={dictionary.livePreview}
      screenshotFallback={preview.screenshotFallback}
      opensInNewTabLabel={dictionary.a11y.opensInNewTab}
      motionShell={motionShell}
    />
  );
}
