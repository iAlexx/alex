import Link from "next/link";

/** Root not-found fallback when locale context is unavailable. */
export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-soft">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 max-w-md text-center text-sm text-mist">
          The page you requested does not exist or may have moved.
        </p>
        <Link
          href="/en"
          className="mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium transition-colors hover:border-electric hover:text-soft"
        >
          Go to homepage
        </Link>
      </body>
    </html>
  );
}
