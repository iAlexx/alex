const DOMAIN_PATTERN = /^(?:https?:\/\/)?[\w.-]+\.[a-z]{2,}(?:\/[\w./-]*)?$/i;
const TECH_PATTERN =
  /^(?:Next\.js|TypeScript|JavaScript|FastAPI|Ollama|n8n|React|GitHub|SQLite|ChromaDB|Active Directory|Red Team|Alexa AI|ALEX Linux|Texas Funds(?: Bot)?|Gymura)$/i;

const SPLIT_PATTERN =
  /((?:https?:\/\/)?[\w.-]+\.[a-z]{2,}(?:\/[\w./-]*)?|\b(?:Next\.js|TypeScript|JavaScript|FastAPI|Ollama|n8n|React|GitHub|SQLite|ChromaDB|Active Directory|Red Team|Alexa AI|ALEX Linux|Texas Funds(?: Bot)?|Gymura)\b)/i;

function isLtrToken(part: string): boolean {
  return DOMAIN_PATTERN.test(part) || TECH_PATTERN.test(part);
}

interface MixedTextProps {
  children: string;
}

/**
 * Renders Arabic (or mixed) copy with isolated LTR islands for domains, URLs,
 * and dotted tech identifiers so punctuation stays readable in RTL paragraphs.
 */
export function MixedText({ children }: MixedTextProps) {
  const parts = children.split(SPLIT_PATTERN).filter((part) => part.length > 0);

  return (
    <>
      {parts.map((part, index) =>
        isLtrToken(part) ? (
          <bdi key={`${part}-${index}`} dir="ltr" className="inline-block">
            {part}
          </bdi>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}
