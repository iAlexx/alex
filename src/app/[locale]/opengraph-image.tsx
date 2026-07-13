import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";
import { OG_IMAGE_SIZE, siteConfig } from "@/config/site";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const english = getDictionary("en");
  const title = english.meta.title.split("—")[0]?.trim() ?? siteConfig.creator;
  const subtitle = "Product Builder · Full-Stack · AI Systems";
  const footer = english.meta.siteName;

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
      <div style={{ fontSize: 28, letterSpacing: "0.35em", color: "#4f8dff" }}>ALEX</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#9aa4bb", lineHeight: 1.35 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: 22, color: "#4f8dff" }}>{footer}</div>
    </div>,
    { ...size },
  );
}
