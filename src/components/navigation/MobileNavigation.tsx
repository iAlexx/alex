"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

export interface NavLink {
  href: string;
  label: string;
}

interface MobileNavigationProps {
  links: NavLink[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

export function MobileNavigation({
  links,
  openLabel,
  closeLabel,
  navLabel,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      firstLinkRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  useEffect(() => {
    if (open) {
      return;
    }
    document.body.style.overflow = "";
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => (open ? closeMenu() : openMenu())}
        className="flex size-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-ink"
      >
        <span
          aria-hidden
          className={`block h-0.5 w-5 bg-soft transition-transform ${open ? "translate-y-1 rotate-45" : ""}`}
        />
        <span aria-hidden className={`block h-0.5 w-5 bg-soft ${open ? "hidden" : ""}`} />
        <span
          aria-hidden
          className={`block h-0.5 w-5 bg-soft transition-transform ${open ? "-translate-y-1 -rotate-45" : ""}`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 top-16 z-40 bg-obsidian/40 md:hidden"
            onClick={closeMenu}
          />
          <nav
            ref={panelRef}
            id={panelId}
            aria-label={navLabel}
            className="absolute inset-x-0 top-full z-50 border-b border-line bg-obsidian/95 backdrop-blur"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {links.map((link, index) => (
                <li key={link.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={closeMenu}
                    className="block min-h-11 rounded-lg px-3 py-2.5 text-base text-soft hover:bg-graphite"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}
