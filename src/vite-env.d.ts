/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Playwright injects this so address suggestions can be tested without a live key. */
interface Window {
  __GLD_PLACES_MOCK__?: import('./lib/googlePlaces').PlacesMock
}
