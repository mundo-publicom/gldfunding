import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PlayIcon, XIcon } from '@phosphor-icons/react'
import { asset } from '../lib/asset'

/**
 * "Watch video" trigger + lightbox.
 *
 * Built on the native <dialog>: showModal() gives focus trapping, Esc to close,
 * an inert page behind it and focus return to the trigger for free. The <video>
 * is only mounted while open, so nothing downloads until someone asks for it,
 * and unmounting on close stops playback.
 *
 * The backdrop is a dark petrol/black wash so the footage stays subtle behind
 * the player and the chrome around it stays legible.
 */
export function VideoModal({
  src,
  poster,
  captions,
  title,
  children = 'Watch video',
  className,
}: {
  src: string
  poster?: string
  captions?: string
  title: string
  children?: ReactNode
  className?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <PlayIcon size={14} weight="fill" aria-hidden="true" />
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-label={title}
        onClose={() => setOpen(false)}
        // Click on the backdrop (the dialog element itself) closes; clicks inside bubble from children.
        onClick={(e) => e.target === dialogRef.current && setOpen(false)}
        className="m-auto h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-white backdrop:bg-[#04100f]/90 backdrop:backdrop-blur-sm"
      >
        <div
          className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(10,46,48,0.55),rgba(3,10,10,0.92))] p-4 sm:p-8"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative w-full max-w-[1080px]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-glow"
            >
              <XIcon size={18} weight="bold" />
            </button>

            <div className="overflow-hidden rounded-[6px] border border-white/10 bg-black shadow-2xl">
              {open && (
                <video
                  className="aspect-video h-full w-full"
                  poster={poster ? asset(poster) : undefined}
                  controls
                  autoPlay
                  playsInline
                >
                  <source src={asset(src)} type="video/mp4" />
                  {captions && (
                    <track kind="captions" src={asset(captions)} srcLang="en" label="English" default />
                  )}
                </video>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
