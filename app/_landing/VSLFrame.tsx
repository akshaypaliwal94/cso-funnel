"use client";

import { useRef, useState } from "react";

import { r2 } from "./r2";

/**
 * The hero's focal object (§8 focal media, blueprint beat 1).
 *
 * Self-hosted from Cloudflare R2 as a native <video>. It replaced a Loom
 * embed on 2026-09-10: an <iframe> brought Loom's chrome, its branding and
 * its cookies onto the hero, and a file we own brings none of them.
 *
 * ── ONE TAP, NOT TWO (2026-09-10, Atul) ───────────────────────────────────
 * `<video controls>` draws its own large centre play button AND a control bar
 * with a second play button in it. That is the double tap: the browser's big
 * button starts nothing until the element is ready, and the reader ends up
 * hunting for the small one.
 *
 * So `controls` is NOT set until the film is running. Before the click the
 * video is a bare surface with no native affordance on it, and the only thing
 * to press is the skin's own voltage disc. The click does all three jobs at
 * once: flips the state (which hides the disc and turns `controls` on) and
 * calls play() inside the same user gesture, which is what keeps autoplay
 * policy happy with sound on.
 *
 * After that the native bar is the right control and ours is gone: a themed
 * overlay sitting on top of a playing film would cover the scrubber.
 *
 * The button is a real <button>, so Enter and Space work and it takes focus
 * in order. It is the frame's only control, so it fills the frame: the disc
 * is what it looks like, the whole stage is what you can hit.
 */

/** The object key inside the R2 bucket. Client-supplied 2026-09-10.
 *  Kept apart from the origin (now in ./r2, shared with the results wall): the
 *  bucket is infrastructure and the file is content, so a new cut of the film
 *  is one filename to edit. */
const VSL_FILE = "cso-vsl.mp4";

/** The poster frame. Client-supplied 2026-09-13, exported to WebP at q90:
 *  1.6MB of PNG is a bad thing to put in front of the hero's LCP, and 136KB
 *  of WebP is the same picture.
 *
 *  The artwork carries its own play button, so when a poster is set the frame
 *  gets `has-poster` and the skin's voltage disc is hidden. Two play buttons
 *  stacked on one another is worse than either alone. */
const POSTER_SRC: string | null = "/brand/vsl-poster.webp";

export function VSLFrame() {
  const [playing, setPlaying] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);

  const start = () => {
    setPlaying(true);
    /* Called in the gesture, not in an effect after the re-render: a play()
       that lands outside the user gesture is what gets blocked. */
    vid.current?.play();
  };

  return (
    <div className={`sdp-vsl is-file${POSTER_SRC ? " has-poster" : ""}${playing ? " playing" : ""}`} id="vsl">
      <video
        ref={vid}
        src={r2(VSL_FILE)}
        poster={POSTER_SRC ?? undefined}
        controls={playing}
        playsInline
        preload="metadata"
      />

      {!playing && (
        <button className="sdp-vsl-play" type="button" onClick={start} aria-label="Play the video">
          <span className="sdp-vsl-disc" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
