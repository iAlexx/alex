import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/translations";
import { isLocale, locales } from "@/lib/i18n/config";
import { isProjectSlug, projects } from "@/content/projects";
import { OG_IMAGE_SIZE, siteConfig } from "@/config/site";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

const ACCENT: Record<string, string> = {
  brands: "#c8d0dc",
  systems: "#d4a054",
  intelligence: "#9b7ed9",
  security: "#4ec9e0",
};

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) {
    notFound();
  }

  const english = getDictionary("en");
  const seo = english.seo.projectMeta[slug];
  const project = projects.find((entry) => entry.slug === slug);
  const accent = (project?.world && ACCENT[project.world]) ?? "#4f8dff";
  const statusLabel = project ? english.statusLabels[project.status] : "";
  const title = seo.title;
  const subtitle = seo.ogSubtitle;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "linear-gradient(145deg, #06080f 0%, #0a1120 55%, #141b2b 100%)",
        color: "#e9edf6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 28, letterSpacing: "0.35em", color: "#4f8dff" }}>ALEX</div>
        <div
          style={{
            fontSize: 20,
            color: accent,
            border: `1px solid ${accent}`,
            borderRadius: 999,
            padding: "8px 18px",
          }}
        >
          {statusLabel}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#9aa4bb", lineHeight: 1.35 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: 22, color: accent }}>{siteConfig.name}</div>
    </div>,
    { ...size },
  );
}
