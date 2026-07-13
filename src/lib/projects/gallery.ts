import type { PortfolioProject } from "@/content/projects/types";
import type { CaseStudyCopy } from "@/content/translations/types";

const PLACEHOLDER_PATH = /placeholder/i;

/** True when the registry lists at least one non-placeholder gallery asset. */
export function hasPublishableGallery(project: PortfolioProject): boolean {
  return project.gallery.length > 0 && project.gallery.some((path) => !PLACEHOLDER_PATH.test(path));
}

/**
 * Gallery section visibility — omit placeholder fatigue; live preview alone is enough
 * for flagship projects until real media exists.
 */
export function shouldRenderProjectGallery(
  project: PortfolioProject,
  copy: CaseStudyCopy,
): boolean {
  if (hasPublishableGallery(project)) {
    return true;
  }
  if (copy.livePreview) {
    return false;
  }
  return false;
}
