import type { WorldAccent } from "@/lib/design/tokens";
import { worldEyebrowClass } from "@/lib/design/tokens";

interface WorldChapterHeaderProps {
  accent: WorldAccent;
  eyebrow: string;
  title?: string;
  subtitle?: string;
}

export function WorldChapterHeader({ accent, eyebrow, title, subtitle }: WorldChapterHeaderProps) {
  return (
    <header className="world-chapter-header max-w-3xl">
      <p
        className={`journey-chapter-eyebrow text-xs font-semibold tracking-tight ${worldEyebrowClass[accent]}`}
      >
        {eyebrow}
      </p>
      {title ? (
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {subtitle ? <p className="mt-3 text-lg text-mist">{subtitle}</p> : null}
    </header>
  );
}
