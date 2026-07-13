import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "./types";
import { en } from "./en";
import { ar } from "./ar";

export type { CaseStudyCopy, CaseStudySectionCopy, Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
