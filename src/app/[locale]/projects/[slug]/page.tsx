import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/translations";
import { isLocale, locales } from "@/lib/i18n/config";
import { isProjectSlug, projects } from "@/content/projects";
import { buildProjectMetadata } from "@/lib/seo/metadata";
import { ProjectStructuredData } from "@/components/seo/ProjectStructuredData";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectFacts } from "@/components/projects/ProjectFacts";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { ProjectSection } from "@/components/projects/ProjectSection";
import { ProjectCapabilities } from "@/components/projects/ProjectCapabilities";
import { ProjectLivePreview } from "@/components/projects/ProjectLivePreview";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { shouldRenderProjectGallery } from "@/lib/projects/gallery";
import { GymuraCaseStudyMotion } from "@/components/motion/GymuraCaseStudyMotion";
import { RestaurantCaseStudyMotion } from "@/components/motion/RestaurantCaseStudyMotion";

/** Major Gymura case study beats for cinematic motion (Vision, Brand Identity, Store Experience). */
const GYMURA_MOTION_SECTION_INDEXES = new Set([0, 1, 3]);

/** Restaurant case study beats — problem, lifecycle, modules, Arabic-first, role. */
const RESTAURANT_MOTION_SECTION_INDEXES = new Set([0, 3, 4, 7, 8]);

interface ProjectPageParams {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({ params }: ProjectPageParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) {
    return {};
  }
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) {
    return {};
  }
  return buildProjectMetadata(locale, getDictionary(locale), project);
}

export default async function ProjectPage({ params }: ProjectPageParams) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) {
    notFound();
  }
  const copy = dictionary.caseStudies[slug];
  const isGymura = slug === "gymura";
  const isRestaurant = slug === "restaurant-platform";
  const hasCaseStudyMotion = isGymura || isRestaurant;

  const caseStudyBody = (
    <>
      <ProjectHero
        locale={locale}
        project={project}
        copy={copy}
        dictionary={dictionary}
        motion={hasCaseStudyMotion}
      />
      <div className="mx-auto min-w-0 max-w-4xl space-y-14 px-6 py-14 lg:py-20">
        <ProjectFacts
          locale={locale}
          project={project}
          dictionary={dictionary}
          motion={hasCaseStudyMotion}
        />
        <ProjectTechStack projectId={project.slug} locale={locale} dictionary={dictionary} />
        <ProjectLivePreview
          project={project}
          copy={copy}
          dictionary={dictionary}
          motionShell={hasCaseStudyMotion ? "preview-shell" : undefined}
        />
        {copy.sections.map((section, index) => (
          <ProjectSection
            key={section.title}
            section={section}
            locale={locale}
            motionHighlight={
              (isGymura && GYMURA_MOTION_SECTION_INDEXES.has(index)) ||
              (isRestaurant && RESTAURANT_MOTION_SECTION_INDEXES.has(index))
            }
          />
        ))}
        <ProjectCapabilities
          project={project}
          dictionary={dictionary}
          motion={hasCaseStudyMotion}
        />
        {shouldRenderProjectGallery(project, copy) ? (
          <ProjectGallery project={project} dictionary={dictionary} />
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <ProjectStructuredData locale={locale} project={project} copy={copy} />
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="main" className="flex-1">
        {isGymura ? (
          <GymuraCaseStudyMotion locale={locale} enabled>
            {caseStudyBody}
          </GymuraCaseStudyMotion>
        ) : isRestaurant ? (
          <RestaurantCaseStudyMotion locale={locale} enabled>
            {caseStudyBody}
          </RestaurantCaseStudyMotion>
        ) : (
          <article className="min-w-0 overflow-x-hidden">{caseStudyBody}</article>
        )}
        <ProjectNavigation slug={slug} locale={locale} dictionary={dictionary} />
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
