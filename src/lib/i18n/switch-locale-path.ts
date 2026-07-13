import type { Locale } from "./config";

/** Swap the locale segment while preserving the rest of the current route. */
export function switchLocalePath(pathname: string, from: Locale, to: Locale): string {
  if (pathname === `/${from}`) {
    return `/${to}`;
  }
  if (pathname.startsWith(`/${from}/`)) {
    return `/${to}${pathname.slice(from.length + 1)}`;
  }
  return `/${to}`;
}
