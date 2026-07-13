import Image from "next/image";
import type { PortfolioProject } from "@/content/projects/types";
import type { Dictionary } from "@/content/translations";
import { hasPublishableGallery } from "@/lib/projects/gallery";

interface ProjectGalleryProps {
  project: PortfolioProject;
  dictionary: Dictionary;
}

const PLACEHOLDER_PATH = /placeholder/i;

/**
 * Renders project media when publishable assets exist.
 * Omitted entirely when only placeholders or live preview covers the need.
 */
export function ProjectGallery({ project, dictionary }: ProjectGalleryProps) {
  if (!hasPublishableGallery(project)) {
    return null;
  }

  const images = project.gallery.filter((path) => !PLACEHOLDER_PATH.test(path));

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {dictionary.projectPages.galleryTitle}
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {images.map((src) => (
          <li
            key={src}
            className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink/60"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
