import type { ReactNode } from "react";
import { cta, site } from "./content";

/* ------------------------------------------------------------- glyphs --- */

export function ArrowGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h15M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- shells --- */

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`sdp-wrap ${className}`.trim()}>{children}</div>;
}

/** SDP section masthead: dash-eyebrow, display H2 (accent word via <em>), sub. */
export function SdpHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  /* Wrapped, not a fragment. The masthead's separation from the content used to
     live on .sdp-sub's bottom margin, and five of the seven sections pass no
     sub, so in those the body sat directly under the headline with only the
     title-to-deck gap under it. That was the "title and body are too close"
     everywhere except the two sections that happen to have a deck.
     The wrapper owns that space now, so it is there whether a deck exists or
     not. */
  return (
    <div className="sdp-head">
      <div className="sdp-eyebrow center">{eyebrow}</div>
      <h2 className="sdp-h2">{title}</h2>
      {sub ? <p className="sdp-sub">{sub}</p> : null}
    </div>
  );
}

/**
 * THE CTA LOCKUP — one group, repeated verbatim after every proof beat.
 *
 * The button label and the note beneath it are the two pieces of CTA copy the
 * source supplies, and they always travel together (Rush + Reassure: the risk
 * reversal is never separated from the button).
 *
 * There is deliberately no risk-badge row and no countdown here: the source
 * supplies no badge copy and no deadline, and inventing either would be
 * fabricated urgency.
 */
export function CtaLockup({ id }: { id?: string }) {
  return (
    <div className="sdp-lockup" id={id}>
      <a className="sdp-cta" href={site.checkoutUrl}>
        <span className="sdp-cta-main">
          <span className="cta-label">{cta.label}</span>
          <span className="arrow">
            <ArrowGlyph />
          </span>
        </span>
      </a>
      <span className="sdp-cta-note">{cta.note}</span>
    </div>
  );
}
