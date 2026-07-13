import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";
import { buildProjectsIndexMetadata } from "@/lib/seo/metadata";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import { projects } from "@/content/projects";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProjectCard } from "@/components/projects/ProjectCard";

interface ProjectsPageParams {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const dictionary = getDictionary(locale);
  return buildProjectsIndexMetadata(locale, dictionary);
}

export default async function ProjectsPage({ params }: ProjectsPageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dictionary = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="main" className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {dictionary.projectPages.indexTitle}
          </h1>
          <p className={`mt-4 max-w-2xl ${bodyTextClass(locale)}`}>
            {dictionary.projectPages.indexIntro}
          </p>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard project={project} locale={locale} dictionary={dictionary} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
