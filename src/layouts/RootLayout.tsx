import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export default function RootLayout() {
  const { pathname } = useLocation()

  /* The markup ships pre-rendered, so the page is visible and looks clickable
     before React attaches a single handler. This flags the moment it is
     genuinely interactive - used by the E2E suite, and useful for RUM. */
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true'
  }, [])

  // Route changes reset scroll - but never fight a hash target.
  useEffect(() => {
    if (window.location.hash) return
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
