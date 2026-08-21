import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CaretDownIcon, ListIcon, PhoneIcon, XIcon } from '@phosphor-icons/react'
import { CTA, INDUSTRIES, SITE } from '../data/site'
import { cn } from '../lib/cn'
import { Logo } from './Logo'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; blurb?: string }[]
}

/* Four items. Holds on one line at 1024px - the old nav carried seven
   plus a phone number plus a login and was already crowding at laptop widths. */
const NAV: NavItem[] = [
  {
    label: 'Funding',
    href: '/funding/merchant-cash-advance',
    children: [
      { label: 'What is an MCA?', href: '/funding/merchant-cash-advance', blurb: 'How an advance works, start to finish' },
      { label: 'What it costs', href: '/funding/cost', blurb: 'Factor rates and total cost, with worked examples' },
      { label: 'Do I qualify?', href: '/funding/qualify', blurb: 'The exact thresholds we underwrite to' },
      { label: 'MCA vs. business loan', href: '/funding/mca-vs-business-loan', blurb: 'Side-by-side comparison' },
      { label: 'How it works', href: '/funding/how-it-works', blurb: 'Apply, approve, fund - in three steps' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    children: [
      { label: 'All industries', href: '/industries' },
      ...INDUSTRIES.map((i) => ({ label: i.short, href: `/industries/${i.slug}` })),
    ],
  },
  { label: 'Partners', href: '/partners' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)
  /* Which pointer opened the menu. A hybrid device (touch laptop) reports
     `hover: hover` yet is tapped with a finger, so capability queries lie -
     the live pointerType is the only reliable signal. */
  const lastPointer = useRef<string>('mouse')
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
    setMenu(null)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  /* A dropdown that only responds to hover is unreachable on every touch
     device wide enough to get the desktop nav - iPads, Surfaces, touch
     laptops. The trigger is a button that toggles on click/tap; hover is an
     enhancement for mice, not the only way in. */
  useEffect(() => {
    if (!menu) return

    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const trigger = triggerRefs.current[menu]
      setMenu(null)
      // After the close commits - focusing mid-render can be undone by the
      // re-render that removes the panel.
      requestAnimationFrame(() => trigger?.focus())
    }
    const onFocusIn = (e: FocusEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [menu])

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenu(label)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMenu(null), 120)
  }
  const toggleMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMenu((cur) => (cur === label ? null : label))
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-white/92 backdrop-blur-md transition-[border-color,box-shadow] duration-200',
          scrolled ? 'border-rule shadow-[0_1px_16px_-8px_rgba(4,24,31,0.25)]' : 'border-transparent',
        )}
      >
      {/* Nav height capped at 72px - no agency bar eating the viewport. */}
      <div className="page flex h-[68px] items-center justify-between gap-6 lg:h-[72px]">
        {/* The lockup is one image, so nothing has to drop away on small
            screens - the wordmark stays whole down to 320px. Sized to just
            under the bar's inner height: the stacked lockup needs the vertical
            room a one-line wordmark would not. */}
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-[2px] text-ink transition-opacity duration-150 hover:opacity-80"
          aria-label={`${SITE.name} home`}
        >
          <Logo className="h-[46px] lg:h-[52px]" />
        </Link>

        <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') openMenu(item.label)
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') scheduleClose()
                }}
              >
                <button
                  type="button"
                  ref={(el) => {
                    triggerRefs.current[item.label] = el
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150',
                    menu === item.label ? 'text-leaf-deep' : 'text-ink-2 hover:text-ink',
                  )}
                  aria-expanded={menu === item.label}
                  aria-haspopup="true"
                  aria-controls={`menu-${item.label.toLowerCase()}`}
                  onPointerDown={(e) => {
                    lastPointer.current = e.pointerType || 'mouse'
                  }}
                  onClick={() => {
                    /* Mouse: hover already revealed the menu, so a click means
                       "take me to the section". Touch and keyboard: the click
                       IS how the menu opens, so toggle instead. */
                    if (lastPointer.current === 'mouse' && menu === item.label) {
                      setMenu(null)
                      navigate(item.href)
                      return
                    }
                    toggleMenu(item.label)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      openMenu(item.label)
                    }
                  }}
                >
                  {item.label}
                  <CaretDownIcon
                    size={11}
                    weight="bold"
                    className={cn(
                      'transition-transform duration-200',
                      menu === item.label && 'rotate-180',
                    )}
                  />
                </button>

                {menu === item.label && (
                  <div
                    id={`menu-${item.label.toLowerCase()}`}
                    className={cn(
                      'absolute left-0 top-full z-50 mt-1 min-w-[280px] rounded-[4px] border border-rule bg-white p-1.5 shadow-panel',
                      'origin-top-left motion-safe:animate-[menuIn_160ms_cubic-bezier(0.23,1,0.32,1)]',
                      item.label === 'Industries' && 'grid grid-cols-2 gap-x-1 min-w-[420px]',
                    )}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') openMenu(item.label)
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') scheduleClose()
                    }}
                  >
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        to={c.href}
                        className="block rounded-[3px] px-3 py-2.5 transition-colors duration-150 hover:bg-paper"
                      >
                        <span className="block text-[0.875rem] font-medium text-ink">{c.label}</span>
                        {c.blurb && (
                          <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-3">
                            {c.blurb}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-full px-3 py-2 text-[0.9375rem] font-medium text-ink-2 transition-colors duration-150 hover:text-ink"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Full number where it fits. */}
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[0.8125rem] font-medium tabular-nums text-ink-2 transition-colors duration-150 hover:text-leaf-deep xl:flex"
            >
              <PhoneIcon size={14} weight="fill" />
              {SITE.phone}
            </a>

            {/* Below xl, tap-to-call collapses to an icon but never disappears -
                calling is the highest-intent action a mobile visitor takes. */}
            <a
              href={SITE.phoneHref}
              aria-label={`Call ${SITE.phone}`}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-rule text-ink-2 transition-colors duration-150 hover:border-leaf hover:text-leaf-deep active:scale-[0.97] min-[360px]:flex xl:hidden"
            >
              <PhoneIcon size={17} weight="fill" />
            </a>

            {/* One label per intent - the same words as the hero and the footer.
                Hidden while the menu is open, which carries its own full-width CTA. */}
            <Link
              to={CTA.primaryHref}
              className={cn('btn btn-primary btn-sm', open && 'hidden lg:inline-flex')}
            >
              {CTA.primary}
            </Link>

            <button
              type="button"
              className="-mr-1.5 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper active:scale-[0.97] lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <XIcon size={22} /> : <ListIcon size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/*
        This panel MUST stay outside <header>. The header sets `backdrop-blur`,
        and an element with `backdrop-filter` becomes the containing block for
        `position: fixed` descendants - so nested here, `top-… bottom-0` resolved
        against the 68px header instead of the viewport and the menu collapsed to
        a 1px sliver. Same trap applies to `filter`, `transform` and `will-change`.
      */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto overscroll-contain border-t border-rule bg-white lg:hidden"
        >
          <nav className="page flex flex-col py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-rule-soft py-3 last:border-0">
                <Link to={item.href} className="block py-1 text-[1.0625rem] font-semibold text-ink">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="mt-1.5 grid grid-cols-2 gap-x-4">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        to={c.href}
                        className="py-1.5 text-[0.875rem] text-ink-3 transition-colors hover:text-leaf-deep"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-5 flex flex-col gap-2.5 pb-8">
              <Link to={CTA.primaryHref} className="btn btn-primary btn-lg">
                {CTA.primary}
              </Link>
              <a href={SITE.phoneHref} className="btn btn-secondary btn-lg">
                <PhoneIcon size={16} weight="fill" />
                {SITE.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
