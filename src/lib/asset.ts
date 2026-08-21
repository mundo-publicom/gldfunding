/**
 * Resolve a root-relative public asset path against vite's `base`.
 *
 * Files in `public/` are written as `/videos/x.mp4` - correct when the site is
 * served from the root, and a 404 when it is served from a subpath such as a
 * GitHub Pages project URL. `import.meta.env.BASE_URL` always carries a
 * trailing slash ('/' or '/gldfunding/'), so the leading slash is dropped
 * before joining.
 *
 * Only for paths that reach the DOM. Absolute URLs built for JSON-LD already
 * join against `SITE.domain` and must stay unprefixed.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
