/** Safe JSON-LD serialization — escapes `<` to prevent script-breakout. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Render trusted internal JSON-LD only. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
