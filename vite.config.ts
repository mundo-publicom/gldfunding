import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type {} from 'vite-react-ssg'

const REDIRECTS: Record<string, string> = JSON.parse(
  readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8'),
)

// GitHub Pages serves a project site from `https://<user>.github.io/<repo>/`,
// so the build needs `base: '/<repo>/'` there. On a custom domain (or any host
// serving from the root) it stays '/'. vite-react-ssg feeds this straight to
// react-router's basename, so links and prerendered paths follow along.
// `actions/configure-pages` emits '' for a root site and '/repo' (no trailing
// slash) for a project site; Vite wants a leading and trailing slash both.
const rawBase = process.env.BASE_PATH || '/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

// Injects the Google tag (gtag.js) into <head> at build time. With
// VITE_GA_MEASUREMENT_ID unset or malformed the page is left untouched, so dev
// and preview builds send no analytics hits.
function googleAnalytics(): Plugin {
  let id = ''
  return {
    name: 'gld:google-analytics',
    configResolved(config) {
      const value = String(config.env.VITE_GA_MEASUREMENT_ID ?? '').trim()
      id = /^G-[A-Z0-9]+$/.test(value) ? value : ''
    },
    transformIndexHtml() {
      if (!id) return
      return [
        {
          tag: 'script',
          attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` },
          injectTo: 'head',
        },
        {
          tag: 'script',
          children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`,
          injectTo: 'head',
        },
      ]
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), googleAnalytics()],
  server: {
    // Listen on 0.0.0.0 so the dev server is reachable from outside the
    // container. Harmless outside Docker — it also binds localhost.
    host: true,
    port: Number(process.env.PORT) || 5173,
    // Some bind mounts (Docker on macOS/Windows) don't forward filesystem
    // events; set VITE_POLL=1 in that case to fall back to polling.
    watch: process.env.VITE_POLL ? { usePolling: true, interval: 300 } : undefined,
  },
  build: {
    // One stylesheet for the whole site — it is small, and this avoids
    // a render-blocking request per route.
    cssCodeSplit: false,
    // three.js lands in its own chunk automatically via the dynamic import
    // in Hero.tsx, so it never touches the critical path.
    chunkSizeWarningLimit: 700,
    modulePreload: {
      // The hero's WebGL chunk is gated behind reduced-motion, viewport width,
      // CPU count and Save-Data. Preloading it would fetch bytes for users the
      // gates will reject — mobile above all. It loads on demand or not at all.
      resolveDependencies: (_file, deps) => deps.filter((d) => !d.includes('CapitalFlow')),
    },
  },
  ssr: {
    noExternal: ['@phosphor-icons/react', '@intl-tel-input/react', 'intl-tel-input'],
  },
  ssgOptions: {
    // Alias routes are a client-side <Navigate> with nothing to prerender, and
    // `/index` would overwrite the homepage. scripts/postbuild.mjs writes their
    // static redirect pages instead.
    // Static routes arrive as `how-it-works`, expanded ones as `/industries/x`.
    includedRoutes: (paths) =>
      paths.filter((p) => !((p.startsWith('/') ? p : `/${p}`) in REDIRECTS)),
  },
})
