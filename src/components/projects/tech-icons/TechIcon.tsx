import type { ProjectTechnology } from "@/lib/projects/tech-types";

const iconClass = "tech-badge__icon-svg";

interface TechIconProps {
  iconKey: string;
}

/** Local monochrome technology logos — no remote fetches. */
export function TechIcon({ iconKey }: TechIconProps) {
  switch (iconKey) {
    case "nextjs":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M11.57 2.5a.75.75 0 0 1 .86 0l8.5 4.9a.75.75 0 0 1 .38.65v9.8a.75.75 0 0 1-.38.65l-8.5 4.9a.75.75 0 0 1-.86 0l-8.5-4.9a.75.75 0 0 1-.38-.65v-9.8a.75.75 0 0 1 .38-.65l8.5-4.9ZM12 4.8 5.2 8.7 12 12.6l6.8-3.9L12 4.8Zm7.3 5.2L12 14.1l-7.3-4.1v7.3L12 21.4l7.3-4.1V10Z" />
        </svg>
      );
    case "react":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 10.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm9.6 0c-.2-1.6-.8-3.1-1.7-4.4-1.8-2.6-4.6-4.2-7.9-4.2S4.1 3.2 2.3 5.8C1.4 7.1.8 8.6.6 10.2c-.1.6-.1 1.2 0 1.8.2 1.6.8 3.1 1.7 4.4 1.8 2.6 4.6 4.2 7.9 4.2s6.1-1.6 7.9-4.2c.9-1.3 1.5-2.8 1.7-4.4.1-.6.1-1.2 0-1.8ZM12 18.4c-3.1 0-5.6-2.9-5.6-6.4S8.9 5.6 12 5.6s5.6 2.9 5.6 6.4-2.5 6.4-5.6 6.4Z" />
          <circle cx="12" cy="12" r="1.4" />
        </svg>
      );
    case "typescript":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8.2 9.4h-2.1v6.2H8.1V12.4H6V10.6h6.2v1.8Zm5.4 1.4c.8-.2 1.4-.6 1.8-1.2.4-.6.6-1.3.6-2.1 0-1.1-.4-2-1.1-2.6-.8-.7-1.9-1-3.3-1h-3.1v8.4h2v-3.3h.9c.8 0 1.4.2 1.8.5.4.4.6 1 .6 1.7v1.1h2.1v-1.3c0-.8-.2-1.4-.6-1.9-.4-.5-1-.8-1.8-1Z" />
        </svg>
      );
    case "tailwindcss":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 6.2c2.4 0 3.8 1.2 4.2 3.6 1.6-1.1 3.1-1.2 4.5-.3 1.4.9 2.1 2.5 2.1 4.8 0 3.8-2 6.7-5.1 6.7-1.4 0-2.5-.4-3.4-1.2-.9-.8-1.5-1.9-1.9-3.3-.4 1.4-1 2.5-1.9 3.3-.9.8-2 1.2-3.4 1.2-3.1 0-5.1-2.9-5.1-6.7 0-2.3.7-3.9 2.1-4.8 1.4-.9 2.9-.8 4.5.3.4-2.4 1.8-3.6 4.2-3.6Z" />
        </svg>
      );
    case "fastapi":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M4 4h16v3H4V4Zm0 5h10v3H4V9Zm0 5h14v3H4v-3Zm0 5h8v3H4v-3Z" />
        </svg>
      );
    case "ollama":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M7 5h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Zm1.5 3.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm7 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM9.2 14.8c.8.9 1.8 1.4 2.8 1.4s2-.5 2.8-1.4c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1-1.2 1.3-2.7 2-3.9 2s-2.7-.7-3.9-2c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.2 0Z" />
        </svg>
      );
    case "database":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 11v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
        </svg>
      );
    case "chromadb":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M6 5h12v3H6V5Zm0 5h12v3H6v-3Zm0 5h8v3H6v-3Z" opacity="0.55" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
      );
    case "telegram":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M11.94 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.06 0Zm4.96 7.22c.1-.002.32.023.47.14a.51.51 0 0 1 .17.33c.02.093.04.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.17.9-.5 1.2-.82 1.23-.7.065-1.23-.46-1.9-.902-1.06-.693-1.65-1.124-2.68-1.8-1.19-.78-.42-1.21.26-1.91.18-.184 3.25-2.977 3.31-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.79 1.14-5.06 3.345-.48.33-.91.49-1.3.48-.43-.008-1.25-.241-1.87-.44-.75-.245-1.35-.374-1.3-.789.03-.216.33-.437.89-.663 3.5-1.524 5.83-2.529 7-3.014 3.33-1.386 4.03-1.627 4.48-1.635Z" />
        </svg>
      );
    case "n8n":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path
            d="M6 7.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Zm7 9a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM8.8 9.7l6.4 3.6M15.2 9.7l-6.4 3.6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="6" cy="7.5" r="2" />
          <circle cx="18" cy="16.5" r="2" />
        </svg>
      );
    case "linux":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 2c-2.8 0-5 2-5.4 4.7-.5-.1-1.1 0-1.5.4-.6.6-.7 1.6-.2 2.3.3.4.7.7 1.2.8-.1.8-.2 1.6-.2 2.4 0 2.7 1.2 5.1 3.1 6.7-.3.5-.5 1.1-.5 1.7 0 1.7 1.5 3 3.3 3h1.2c1.8 0 3.3-1.3 3.3-3 0-.6-.2-1.2-.5-1.7 1.9-1.6 3.1-4 3.1-6.7 0-.8-.1-1.6-.2-2.4.5-.1.9-.4 1.2-.8.5-.7.4-1.7-.2-2.3-.4-.4-1-.5-1.5-.4C17 4 14.8 2 12 2Zm-1.2 13.5c-.4.7-1.2 1.1-2 1.1s-1.6-.4-2-1.1c.6.2 1.3.3 2 .3s1.4-.1 2-.3Z" />
        </svg>
      );
    case "python":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M11.9 2C9.6 2 8 3.1 8 5.3v1.4H12c.5 0 .9.4.9.9v3.8H7.1C4.9 11.4 3.8 13 3.8 15.3S4.9 19.2 7.1 19.2h1.4v-2.6c0-1 .8-1.8 1.8-1.8h5.4c1.8 0 3.2-1.4 3.2-3.2V8.1C19.1 4.9 17.5 2 11.9 2ZM9.7 4.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm8.3 12.1c2.2 0 3.3-1.6 3.3-3.9s-1.1-3.9-3.3-3.9h-1.4v2.6c0 1-.8 1.8-1.8 1.8h-5.4c-1.8 0-3.2 1.4-3.2 3.2v1.5c0 3.2 1.6 6.1 7.2 6.1 2.3 0 3.9-1.1 3.9-3.3v-1.4H12c-.5 0-.9-.4-.9-.9v-3.8h5.8c2.2 0 3.3-1.6 3.3-3.9v-.1Z" />
        </svg>
      );
    case "api":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M7 8l-3 4 3 4M17 8l3 4-3 4M14 5l-4 14" />
        </svg>
      );
    case "workflow":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <rect x="3" y="4" width="6" height="5" rx="1" />
          <rect x="15" y="4" width="6" height="5" rx="1" />
          <rect x="9" y="15" width="6" height="5" rx="1" />
          <path d="M6 9v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" />
        </svg>
      );
    case "brain":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M8.5 4.5A3.5 3.5 0 0 0 5 8v1.5A3 3 0 0 0 4 13a3 3 0 0 1 3.5 2.9V17a3 3 0 0 0 6 0v-1.1A3 3 0 0 0 20 13a3 3 0 0 0-1-3.5V8a3.5 3.5 0 0 0-6.8-1.2A3.5 3.5 0 0 0 8.5 4.5Z" />
        </svg>
      );
    case "shield":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M12 3 5 6v6c0 4.4 3 8.5 7 9.8 4-1.3 7-5.4 7-9.8V6l-7-3Z" />
        </svg>
      );
    case "network":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="12" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M12 8v4M8.5 16.5 10.5 13M15.5 16.5 13.5 13" />
        </svg>
      );
    case "web":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4a12.5 12.5 0 0 1 0 16M12 4a12.5 12.5 0 0 0 0 16" />
        </svg>
      );
    case "target":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "scan":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 12h6" />
        </svg>
      );
    case "directory":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case "commerce":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M6 7h15l-1.5 9h-12L6 7Z" />
          <path d="M6 7 5 4H3M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
      );
    case "palette":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M12 3c-4.4 0-8 2.7-8 6.5 0 2.4 1.8 4.5 4.3 5.3.5.2 1 .7 1 1.2V17a1 1 0 0 0 1 1h1.2a3 3 0 0 0 2.8-2h.2c3.5 0 6.5-2.5 6.5-5.8C21 5.7 17.1 3 12 3Z" />
          <circle cx="8.5" cy="9" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "layers":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="m12 3 8 4.5L12 12 4 7.5 12 3Z" />
          <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
        </svg>
      );
    case "compass":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="m14.5 9.5-2 5-5 2 2-5 5-2Z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M11 2 9.5 7.5 4 9l5.5 1.5L11 16l1.5-5.5L18 9l-5.5-1.5L11 2Zm8 10-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3Z" />
        </svg>
      );
    case "shirt":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M8 4 6 7H3v3l3 1v8h12v-8l3-1V7h-3l-2-3H8Z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 10v4h4l6 4V6L8 10H4Zm11.5-.5a3.5 3.5 0 0 1 0 5" />
        </svg>
      );
    case "supabase":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 3 4 6.5v11L12 21l8-3.5V6.5L12 3Zm0 2.2 5.5 2.4v8.8L12 19.8 6.5 16.4V7.6L12 5.2Z" />
          <path d="M12 8.5v7" opacity="0.55" />
        </svg>
      );
    case "postgresql":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 3c-3.5 0-6 1.8-6 4.5v9c0 2.7 2.5 4.5 6 4.5s6-1.8 6-4.5v-9C18 4.8 15.5 3 12 3Zm0 2c2.4 0 4 1 4 2.5S14.4 10 12 10 8 9 8 7.5 9.6 5 12 5Zm-4 11.5V9.8c.9.8 2.4 1.2 4 1.2s3.1-.4 4-1.2v6.7c0 1-1.6 2-4 2s-4-1-4-2Z" />
        </svg>
      );
    case "vercel":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="m12 4 10 16H2L12 4Z" />
        </svg>
      );
    case "railway":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M4 16h16v2H4v-2Zm2-4h3v3H6v-3Zm5 0h3v3h-3v-3Zm5 0h3v3h-3v-3ZM7 8h3v3H7V8Zm5 0h3v3h-3V8Zm5 0h3v3h-3V8Z" />
        </svg>
      );
    case "zod":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M5 5h14v3H9v3h8v3H9v5H5V5Z" />
        </svg>
      );
    case "zustand":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 7h16M4 12h10M4 17h14" />
        </svg>
      );
    case "resend":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 7h16v10H4V7Z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "webhook":
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          aria-hidden
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M8 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M11 12h7M15 9l3 3-3 3" />
        </svg>
      );
    case "gramjs":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 2 4 6v12l8 4 8-4V6l-8-4Zm0 2.5L17.5 7 12 9.5 6.5 7 12 4.5ZM6 8.8l5 2.5v5.4l-5-2.5V8.8Zm12 0v5.4l-5 2.5v-5.4l5-2.5Z" />
        </svg>
      );
    case "puppeteer":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm2 6v2h4v-2h-4Zm0 4v2h4v-2h-4Z" />
        </svg>
      );
    case "sentry":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M12 3 4 7.5v3.2c0 4.2 3.2 7.8 7.5 8.3 4.3-.5 7.5-4.1 7.5-8.3V7.5L12 3Zm0 3.2 5.5 3.1v2.4c0 2.6-2 4.8-5.5 5.2-3.5-.4-5.5-2.6-5.5-5.2V9.3L12 6.2Z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}

export function techIconLabel(technology: ProjectTechnology): string {
  return technology.label;
}
