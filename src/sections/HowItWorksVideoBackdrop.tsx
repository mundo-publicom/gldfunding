import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/asset";

const SRC = "/videos/description.mp4";
const POSTER = "/videos/description-poster.webp";
const RATE = 0.6;

/** Phones, reduced motion and data saver never get the MP4. */
function canPlayVideo() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !conn?.saveData;
}

/**
 * Silent, decorative footage behind the How It Works steps.
 *
 * The poster is always painted; the video mounts only once the gates pass and
 * the section is within a viewport of the screen, then fades in over it. If the
 * file fails or autoplay is refused the poster simply stays. Sits `-z-10`
 * inside a `relative isolate` section.
 */
export function HowItWorksVideoBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowed] = useState(canPlayVideo);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // One observer: mounts the video within ~1 viewport, pauses it beyond that.
  useEffect(() => {
    const root = rootRef.current;
    if (!allowed || !root || typeof IntersectionObserver === "undefined")
      return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const isNear = entry.isIntersecting;
        setNear(isNear);
        const v = videoRef.current;
        if (!v) return;
        if (isNear) {
          v.muted = true;
          v.playbackRate = RATE;
          v.play().catch(() => setFailed(true));
        } else {
          v.pause();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [allowed]);

  const showVideo = allowed && near && !failed;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-petrol"
    >
      {/* The 1.06 scale would spill past the section; clip it here, not on the section. */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={asset(POSTER)}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center"
        />

        {showVideo && (
          <video
            ref={(v) => {
              videoRef.current = v;
              if (v) {
                v.muted = true;
                v.defaultMuted = true;
                v.playbackRate = RATE;
              }
            }}
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center transition-opacity duration-500 ease-out"
            style={{ opacity: ready ? 1 : 0 }}
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
            tabIndex={-1}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate noremoteplayback"
            src={asset(SRC)}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = RATE;
            }}
            onPlaying={(e) => {
              e.currentTarget.playbackRate = RATE;
              setReady(true);
            }}
            onError={() => setFailed(true)}
          />
        )}
      </div>

      {/* Petrol veil: ~85% overall, heavier on the heading column and the bottom. */}
      <div className="absolute inset-0 bg-petrol/85" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,24,31,0.85) 0%, rgba(4,24,31,0.45) 45%, rgba(4,24,31,0) 100%), " +
            "linear-gradient(180deg, rgba(4,24,31,0.85) 0%, rgba(4,24,31,0.4) 12%, rgba(4,24,31,0) 40%, rgba(4,24,31,0.7) 100%)",
        }}
      />
      {/* Edge vignette. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(4,24,31,0) 55%, rgba(4,24,31,0.7) 100%)",
        }}
      />
    </div>
  );
}
