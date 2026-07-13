"use client";

import { useCallback, useId, useState, type ReactNode } from "react";
import "@/components/mobile/mobile-disclosure.css";

export type MobileDisclosureProps = {
  label: string;
  labelExpanded?: string;
  children: ReactNode;
  className?: string;
};

function syncDisclosureDocumentState() {
  if (typeof document === "undefined") return;
  const anyOpen = document.querySelectorAll(".mobile-disclosure.is-open").length > 0;
  document.documentElement.classList.toggle("mobile-disclosure-active", anyOpen);
}

/** Accessible mobile-only progressive disclosure — hidden on desktop (lg+). */
export function MobileDisclosure({
  label,
  labelExpanded,
  children,
  className = "",
}: MobileDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      queueMicrotask(syncDisclosureDocumentState);
      return next;
    });
  }, []);

  return (
    <div className={`mobile-disclosure ${open ? "is-open" : ""} ${className}`.trim()}>
      <button
        type="button"
        className="mobile-disclosure__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        {open && labelExpanded ? labelExpanded : label}
      </button>
      <div id={panelId} className="mobile-disclosure__panel" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
