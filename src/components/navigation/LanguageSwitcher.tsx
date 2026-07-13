"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/switch-locale-path";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  ariaLabel: string;
}

export function LanguageSwitcher({ locale, label, ariaLabel }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const target: Locale = locale === "en" ? "ar" : "en";
  const href = switchLocalePath(pathname, locale, target);

  const handleSwitch = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.push(`${href}${hash}`);
  };

  return (
    <Link
      href={href}
      onClick={handleSwitch}
      aria-label={ariaLabel}
      className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-4 text-sm text-mist transition-colors hover:border-electric hover:text-soft"
    >
      {label}
    </Link>
  );
}
