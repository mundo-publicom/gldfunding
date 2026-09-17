#!/usr/bin/env bash
# Enable Google Maps Platform APIs and mint referrer-restricted keys for
# local development, Vercel preview/staging, and production.
#
# Prerequisites:
#   - gcloud CLI, billed GCP project, and `gcloud auth login`
#   - Optional: Vercel CLI (`npm i -g vercel`) and GitHub CLI (`gh`)
#
# Usage:
#   export GCP_PROJECT=your-gcp-project-id
#   export VERCEL_STAGING_HOST=gldfunding-git-staging-yourteam.vercel.app
#   ./scripts/enable-google-places.sh

set -euo pipefail

PROJECT="${GCP_PROJECT:?Set GCP_PROJECT to your Google Cloud project id}"
PROD_HOST="${PROD_HOST:-www.gldfunding.com}"
APEX_HOST="${APEX_HOST:-gldfunding.com}"
STAGING_HOST="${VERCEL_STAGING_HOST:-}"

echo "Using GCP project: $PROJECT"
gcloud config set project "$PROJECT"

echo "Enabling Maps JavaScript API, Places API (New), and Address Validation API…"
gcloud services enable \
  maps-backend.googleapis.com \
  places.googleapis.com \
  addressvalidation.googleapis.com

create_key() {
  local name="$1"
  shift
  echo "Creating API key: $name"
  gcloud services api-keys create \
    --display-name="$name" \
    --api-target=service=maps-backend.googleapis.com \
    --api-target=service=places.googleapis.com \
    --api-target=service=addressvalidation.googleapis.com \
    --allowed-referrers="$1"
}

# Development — Vite dev server and `vite preview` used by Playwright.
create_key "GLD Funding Maps — development" \
  "http://localhost:5173/*,http://127.0.0.1:5173/*,http://localhost:4173/*,http://127.0.0.1:4173/*"

# Staging / preview — Vercel preview URLs plus an optional named staging host.
STAGING_REFERRERS="https://*.vercel.app/*"
if [[ -n "$STAGING_HOST" ]]; then
  STAGING_REFERRERS="${STAGING_REFERRERS},https://${STAGING_HOST}/*"
fi
create_key "GLD Funding Maps — staging" "$STAGING_REFERRERS"

# Production — canonical site and GitHub Pages fallbacks.
create_key "GLD Funding Maps — production" \
  "https://${PROD_HOST}/*,https://${APEX_HOST}/*,https://*.github.io/*"

echo
echo "List the new keys (string values are shown once):"
gcloud services api-keys list --filter='displayName:GLD Funding Maps'

echo
echo "Put each key string into VITE_GOOGLE_MAPS_API_KEY for that environment."
echo
echo "# Local development"
echo "cp .env.example .env.local"
echo "# then paste the development key into .env.local and run: pnpm dev"
echo
echo "# Vercel — development / preview (staging) / production"
echo "npm i -g vercel"
echo "vercel link"
echo "printf '%s' 'DEV_KEY'      | vercel env add VITE_GOOGLE_MAPS_API_KEY development --yes"
echo "printf '%s' 'STAGING_KEY'  | vercel env add VITE_GOOGLE_MAPS_API_KEY preview --yes"
echo "printf '%s' 'PROD_KEY'     | vercel env add VITE_GOOGLE_MAPS_API_KEY production --yes"
echo "vercel env pull .env.local --yes"
echo
echo "# GitHub Pages production builds (this repo's deploy workflow)"
echo "gh secret set VITE_GOOGLE_MAPS_API_KEY --body 'PROD_KEY'"
echo
echo "Maps JavaScript API keys are public by design. Restrict them to the"
echo "APIs above and to the HTTP referrers for that environment — never ship"
echo "an unrestricted key."
