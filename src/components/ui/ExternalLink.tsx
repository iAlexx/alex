import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface ExternalLinkProps extends ComponentPropsWithoutRef<"a"> {
  children: ReactNode;
  /** Screen-reader-only label, e.g. “Opens in a new tab”. */
  opensInNewTabLabel: string;
}

/** External anchor with safe rel attributes and an accessible new-tab hint. */
export function ExternalLink({
  children,
  opensInNewTabLabel,
  href,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="strict-origin-when-cross-origin"
      className={className}
      {...rest}
    >
      {children}
      {opensInNewTabLabel ? <span className="sr-only">{opensInNewTabLabel}</span> : null}
    </a>
  );
}
