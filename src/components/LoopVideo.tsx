import { useEffect, useRef, useState } from 'react'
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from '@phosphor-icons/react'
import { asset } from '../lib/asset'

/**
 * Muted, looping, autoplaying video with hover controls.
 *
 * It starts silent (the only way browsers allow autoplay) and keeps looping.
 * Play/pause, sound and fullscreen sit on a bottom scrim that fades in on
 * hover or keyboard focus; on touch screens, where there is no hover, it stays
 * visible. A visitor's own pause is respected: the scroll-back resume below
 * only runs while they have not paused it themselves.
 */
export function LoopVideo({
  src,
  poster,
  title,
  className = '',
}: {
  src: string
  poster?: string
  title: string
  className?: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [full, setFull] = useState(false)

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Every load starts silent. React only sets `muted` as an attribute, which the
  // element ignores once it has initialised, so set the property directly too.
  useEffect(() => {
    const v = videoRef.current
    if (v) v.muted = true
  }, [])

  // Browsers pause offscreen muted autoplay; resume when it scrolls back in.
  useEffect(() => {
    const v = videoRef.current
    if (!v || reduceMotion || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused.current) void v.play().catch(() => {})
    })
    io.observe(v)
    return () => io.disconnect()
  }, [reduceMotion])

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === boxRef.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      void v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFullscreen = () => {
    const box = boxRef.current
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!box || !v) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (box.requestFullscreen) void box.requestFullscreen()
    else v.webkitEnterFullscreen?.() // iOS Safari only fullscreens the <video> itself
  }

  const btn =
    'flex h-11 w-11 cursor-pointer [@media(hover:hover)]:h-9 [@media(hover:hover)]:w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/75 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-glow'

  return (
    <div
      ref={boxRef}
      className={`group relative overflow-hidden rounded-[6px] border border-white/15 bg-black shadow-panel ${className}`}
    >
      <video
        ref={videoRef}
        className={`h-full w-full ${full ? 'object-contain' : 'aspect-video object-cover'}`}
        src={asset(src)}
        poster={poster ? asset(poster) : undefined}
        aria-label={title}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 opacity-100 transition-opacity duration-200 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
        <button type="button" onClick={togglePlay} className={btn} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? <PauseIcon size={16} weight="fill" /> : <PlayIcon size={16} weight="fill" className="ml-0.5" />}
        </button>
        <button type="button" onClick={toggleMute} className={btn} aria-label={muted ? 'Unmute video' : 'Mute video'}>
          {muted ? <SpeakerSlashIcon size={17} weight="fill" /> : <SpeakerHighIcon size={17} weight="fill" />}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`${btn} ml-auto`}
          aria-label={full ? 'Exit full screen' : 'Full screen'}
        >
          {full ? <ArrowsInIcon size={17} weight="bold" /> : <ArrowsOutIcon size={17} weight="bold" />}
        </button>
      </div>
    </div>
  )
}
