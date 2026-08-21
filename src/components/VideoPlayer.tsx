import { useRef, useState } from 'react'
import { CaretDownIcon, PlayIcon } from '@phosphor-icons/react'
import { cn } from '../lib/cn'
import { asset } from '../lib/asset'

/**
 * Facade video player.
 *
 * The poster is a 20 KB WebP; the 3.4 MB MP4 is `preload="none"` and only
 * fetched when someone actually presses play. Nothing about this section is on
 * the critical path — same discipline as the WebGL hero.
 *
 * Captions ship as a real WebVTT track (WCAG 1.2.2, Level A) and the full
 * transcript renders below in a <details>, which serves 1.2.3, gives people who
 * won't play video the same information, and puts ~220 words of on-topic,
 * crawlable text on the page for answer engines.
 */

export type VideoChapter = { at: number; label: string }

export function VideoPlayer({
  src,
  poster,
  captions,
  title,
  description,
  durationLabel,
  chapters = [],
  transcript = [],
}: {
  src: string
  poster: string
  captions?: string
  title: string
  description?: string
  durationLabel: string
  chapters?: VideoChapter[]
  transcript?: string[]
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  const play = (at = 0) => {
    const v = videoRef.current
    if (!v) return
    setStarted(true)
    // Give React a frame to swap `preload` before asking the element to load.
    requestAnimationFrame(() => {
      if (at > 0) {
        const seek = () => {
          v.currentTime = at
          v.removeEventListener('loadedmetadata', seek)
        }
        v.readyState >= 1 ? (v.currentTime = at) : v.addEventListener('loadedmetadata', seek)
      }
      void v.play().catch(() => {
        /* Autoplay blocked — native controls are visible, user can press play. */
      })
    })
  }

  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-[4px] border border-rule bg-petrol">
        <div className="aspect-video">
          <video
            ref={videoRef}
            className="h-full w-full"
            poster={asset(poster)}
            preload="none"
            controls={started}
            playsInline
            /* No autoplay and no loop: this is narrated, and audio that starts
               itself is hostile. The visitor decides. */
            onEnded={() => setStarted(false)}
          >
            <source src={asset(src)} type="video/mp4" />
            {captions && (
              <track kind="captions" src={asset(captions)} srcLang="en" label="English" default />
            )}
            Your browser cannot play this video.{' '}
            <a href={asset(src)}>Download it instead</a>, or read the transcript below.
          </video>
        </div>

        {!started && (
          <button
            type="button"
            onClick={() => play()}
            aria-label={`Play video: ${title} (${durationLabel})`}
            className="group absolute inset-0 cursor-pointer bg-petrol/35 transition-colors duration-200 hover:bg-petrol/20 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-leaf-glow"
          >
            {/* Play affordance stays centred; the label rides a bottom scrim so it
                never lands on the artwork or fights a light poster frame. */}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-leaf-lift text-petrol shadow-panel transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 group-active:scale-95 sm:h-[72px] sm:w-[72px]">
              <PlayIcon size={26} weight="fill" className="ml-1" />
            </span>

            <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 bg-gradient-to-t from-petrol via-petrol/80 to-transparent px-4 pb-3.5 pt-10 text-left sm:px-5 sm:pb-4">
              <span className="text-[0.9375rem] font-semibold text-white sm:text-[1.0625rem]">
                {title}
              </span>
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-leaf-glow">
                {durationLabel}
              </span>
            </span>
          </button>
        )}
      </div>

      {(description || chapters.length > 0) && (
        <figcaption className="mt-4">
          {description && (
            <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-2">
              {description}
            </p>
          )}

          {chapters.length > 0 && (
            <div className="mt-4">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
                Jump to
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {chapters.map((c) => (
                  <button
                    key={c.at}
                    type="button"
                    onClick={() => play(c.at)}
                    className="rounded-full border border-rule bg-white px-3.5 py-1.5 text-[0.8125rem] text-ink-2 transition-colors duration-150 hover:border-leaf hover:text-leaf-deep active:scale-[0.98]"
                  >
                    <span className="font-mono tabular-nums text-ink-3">
                      {String(Math.floor(c.at / 60)).padStart(1, '0')}:
                      {String(Math.floor(c.at % 60)).padStart(2, '0')}
                    </span>
                    <span className="ml-2">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </figcaption>
      )}

      {transcript.length > 0 && (
        <details className="group mt-5 border-t border-rule pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
            Read the transcript
            <CaretDownIcon
              size={12}
              weight="bold"
              className={cn('text-ink-3 transition-transform duration-200 group-open:rotate-180')}
            />
          </summary>
          <div className="mt-4 flex max-w-[68ch] flex-col gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
            {transcript.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
        </details>
      )}
    </figure>
  )
}
