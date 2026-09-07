/**
 * The checkout's own marks. Stroked line glyphs at the same weight as the
 * landing page's (1.9 at 24px), so they read as the same family, and all of
 * them are drawn in currentColor so the house icon bed (.co-ic) can set the
 * glyph colour once.
 *
 * ArrowGlyph and CheckGlyph are NOT redefined here: they already exist in
 * app/_landing/sdp.tsx and are imported from there. Two copies of one arrow is
 * how a system starts drifting.
 */

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Secure payment. */
export function LockGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2.4" {...S} />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" {...S} />
    </svg>
  );
}

/** Refundable: money coming back. */
export function RefundGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2" {...S} />
      <path d="M3.2 4.6v4.6h4.6" {...S} />
    </svg>
  );
}

/** One person, one call. */
export function PersonGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8" r="3.6" {...S} />
      <path d="M4.8 20.2a7.2 7.2 0 0 1 14.4 0" {...S} />
    </svg>
  );
}

/** The reassurance seal. */
export function ShieldGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3.2l7 2.8v5.4c0 4.3-2.9 7.7-7 9.4-4.1-1.7-7-5.1-7-9.4V6z" {...S} />
      <path d="M8.9 12.1l2.2 2.2 4-4.4" {...S} />
    </svg>
  );
}
