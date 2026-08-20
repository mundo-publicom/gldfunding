import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves a project site from `https://<user>.github.io/<repo>/`,
// so the build needs `base: '/<repo>/'` there. On a custom domain (or any host
// serving from the root) it stays '/'. vite-react-ssg feeds this straight to
// react-router's basename, so links and prerendered paths follow along.
// `actions/configure-pages` emits '' for a root site and '/repo' (no trailing
// slash) for a project site; Vite wants a leading and trailing slash both.
const rawBase = process.env.BASE_PATH || '/'
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    // Listen on 0.0.0.0 so the dev server is reachable from outside the
    // container. Harmless outside Docker — it also binds localhost.
    host: true,
    port: 5173,
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
    noExternal: ['@phosphor-icons/react'],
  },
})
