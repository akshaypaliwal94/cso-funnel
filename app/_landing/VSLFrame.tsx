"use client";

import { useRef, useState } from "react";
import { asset } from "./asset-version";
import { missing } from "./content";

/**
 * The hero's focal object (§8 focal media, blueprint beat 1).
 *
 * No VSL asset has been supplied. Rather than fake a play disc that does
 * nothing, the frame renders a labelled placeholder AT THE FINAL 16:9 RATIO, so
 * when the video lands nothing on the page moves.
 *
 * To go live: set VIDEO_SRC (and POSTER_SRC if there is one). The component
 * then renders the real SDP VSL frame, poster plus ripple play disc, swapping
 * to a native <video> on click. Nothing else changes.
 */
const VIDEO_SRC: string | null = null;
const POSTER_SRC: string | null = null;

export function VSLFrame() {
  const [playing, setPlaying] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);

  if (!VIDEO_SRC) {
    return (
      <div className="sdp-vsl" id="vsl" aria-label="Video sales letter, not yet supplied">
        <div className="cso-ph" style={{ position: "absolute", inset: 0, border: 0, borderRadius: 0 }}>
          <div>
            <span className="cso-ph-tag">
              <span
                aria-hidden
                style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }}
              />
              {missing.vslVideo.label}
            </span>
            <p className="cso-ph-what">{missing.vslVideo.what}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sdp-vsl${playing ? " playing" : ""}`} id="vsl">
      <video
        ref={vid}
        className="sdp-vsl-video"
        src={asset(VIDEO_SRC)}
        poster={POSTER_SRC ? asset(POSTER_SRC) : undefined}
        controls={playing}
        playsInline
        preload="metadata"
      />
      <button
        className="sdp-vsl-play"
        type="button"
        aria-label="Play the video"
        onClick={() => {
          setPlaying(true);
          vid.current?.play();
        }}
      >
        <span className="sdp-vsl-disc" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
