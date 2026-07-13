# Live Website Preview

Phase 4.1 adds an optional embedded preview for public project websites inside case study pages. The component lives at `src/components/projects/LiveWebsitePreview.tsx` and is wired through `ProjectLivePreview` when a case study defines `livePreview` in the typed dictionaries.

Phase 6.1 adds `variant="compact"` for homepage column embeds (Gymura homepage). Same iframe, scaling, loading, reload, and fallback logic — no duplicate implementation.

## Behavior

- The iframe is **not** loaded on initial page paint.
- The visitor clicks **Launch Live Preview**, or (if enabled) the section may auto-load when it nears the viewport via a native `IntersectionObserver`.
- Desktop, Tablet, and Mobile viewport modes scale inside the page container — they never force horizontal page overflow.
- **Open Full Website** remains visible at all times.

### Compact variant (homepage)

- `variant="compact"` hides the case-study section heading and uses a shorter iframe height.
- An **open website** link stays above the browser shell.
- Pass `motionShell` to target GSAP at the LTR browser chrome only.
- Default: click-to-load; no auto-load on homepage mount.

## Embedding limitations

Many production sites block iframe embedding through:

- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'none'` or an allowlist that excludes the portfolio domain

Browsers enforce these headers. JavaScript in the portfolio **cannot**:

- Detect every blocked embed reliably (cross-origin `onerror` is inconsistent)
- Inspect or manipulate iframe document content
- Bypass headers through a proxy (do not add one)

The component therefore:

- Shows a loading state, then the iframe after `onload` (which does not guarantee visible content)
- Keeps **Open Full Website** / **Open in a new tab** always available
- Times out to **Preview Unavailable** if loading does not complete
- Allows the visitor to manually mark the preview unavailable
- Preserves an optional `screenshotFallback` path for a future static image fallback

Do not claim embedding success before the visitor can see the page.

## Server header changes for gymura.store and alnkha.site

To allow the portfolio to embed the **public entry point** once the portfolio has a production domain, each site owner must explicitly allow that domain in CSP.

Example (adjust the portfolio origin to your real domain):

```http
Content-Security-Policy: frame-ancestors 'self' https://alexportfolio.com https://www.alexportfolio.com;
```

Or remove `X-Frame-Options` if CSP `frame-ancestors` is used instead.

**Only allow the public storefront / marketing entry URL** — never expose admin dashboards, internal routes, or authenticated areas to `frame-ancestors`.

### gymura.store

- Allow: `https://gymura.store` (storefront root)
- Do not embed private admin or checkout-only paths unless they are intentionally public.

### alnkha.site

- Allow: `https://alnkha.site` (public site entry)
- Do not embed cashier, kitchen, management, or authenticated operational dashboards.

## Security notes

- `referrerPolicy="strict-origin-when-cross-origin"` on iframe and external links
- `rel="noopener noreferrer"` on external links
- No `sandbox` attribute (would break legitimate storefront rendering)
- No extra `allow` permissions on the iframe

## Projects with live preview (Phase 4.1)

| Project             | URL                  | Display domain |
| ------------------- | -------------------- | -------------- |
| Gymura              | https://gymura.store | gymura.store   |
| Restaurant Platform | https://alnkha.site  | alnkha.site    |
