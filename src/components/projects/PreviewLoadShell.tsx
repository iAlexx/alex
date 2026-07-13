interface PreviewLoadShellProps {
  variant?: "default" | "compact" | "compact-expanded";
}

/** Reserved preview dimensions while deferred client bundle loads — prevents CLS. */
export function PreviewLoadShell({ variant = "default" }: PreviewLoadShellProps) {
  const shellClass =
    variant === "compact-expanded"
      ? "gymura-preview-shell min-h-[clamp(17.5rem,75vw,22.5rem)] sm:min-h-[clamp(20rem,42vw,28rem)] lg:min-h-[clamp(24rem,36vw,32rem)]"
      : variant === "compact"
        ? "min-h-44"
        : "min-h-56 sm:min-h-64";

  return (
    <div
      className={`${shellClass} w-full rounded-2xl border border-line bg-ink/40`}
      role="status"
      aria-live="polite"
      aria-label="Loading live preview"
    />
  );
}
