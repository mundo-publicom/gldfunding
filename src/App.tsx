import type { RouteRecord } from 'vite-react-ssg'
import RootLayout from './layouts/RootLayout'
import { INDUSTRIES, STATES } from './data/site'

/**
 * Every route below is pre-rendered to static HTML at build time by
 * vite-react-ssg. That is the hard requirement behind the GEO strategy -
 * most AI crawlers do not execute JavaScript, so every word that matters
 * has to be in the initial HTML response.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    entry: 'src/layouts/RootLayout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },

      /* --- Funding: the answer pages --- */
      {
        path: 'funding/merchant-cash-advance',
        lazy: () => import('./pages/funding/MerchantCashAdvance'),
      },
      { path: 'funding/cost', lazy: () => import('./pages/funding/Cost') },
      { path: 'funding/qualify', lazy: () => import('./pages/funding/Qualify') },
      {
        path: 'funding/mca-vs-business-loan',
        lazy: () => import('./pages/funding/McaVsLoan'),
      },
      { path: 'funding/how-it-works', lazy: () => import('./pages/funding/HowItWorks') },

      /* --- Industries --- */
      { path: 'industries', lazy: () => import('./pages/industries/Index') },
      {
        path: 'industries/:slug',
        lazy: () => import('./pages/industries/Detail'),
        getStaticPaths: () => INDUSTRIES.map((i) => `/industries/${i.slug}`),
      },

      /* --- Geographic surface area --- */
      { path: 'locations', lazy: () => import('./pages/locations/Index') },
      {
        path: 'locations/:slug',
        lazy: () => import('./pages/locations/Detail'),
        getStaticPaths: () => STATES.map((s) => `/locations/${s.slug}`),
      },

      /* --- Resources --- */
      { path: 'resources', lazy: () => import('./pages/resources/Index') },
      { path: 'resources/glossary', lazy: () => import('./pages/resources/Glossary') },

      /* --- Conversion --- */
      { path: 'apply', lazy: () => import('./pages/Apply') },

      /* --- Company --- */
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'partners', lazy: () => import('./pages/Partners') },
      { path: 'contact', lazy: () => import('./pages/Contact') },

      /* --- Legal --- */
      { path: 'legal/privacy', lazy: () => import('./pages/legal/Privacy') },
      { path: 'legal/terms', lazy: () => import('./pages/legal/Terms') },
      { path: 'legal/disclosures', lazy: () => import('./pages/legal/Disclosures') },

      /* --- 404 ---
         Catch-all `*` routes are excluded from prerendering, so the explicit
         `404` path is what emits `dist/404.html` - the file GitHub Pages (and
         most static hosts) serves for an unknown URL. Keep both: the `*` route
         still handles client-side navigation to a dead link. --- */
      { path: '404', lazy: () => import('./pages/NotFound') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
