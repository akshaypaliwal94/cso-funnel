import { asset } from "./asset-version";
import { featured } from "./content";
import { Wrap } from "./sdp";

/**
 * BEAT 0b · TRUST ROW · §12 authority, hairline trust-chip row (light weight).
 *
 * ── LOGOS SUPPLIED 2026-09-10 ─────────────────────────────────────────────
 * This used to render publication NAMES in the display voice, because no
 * artwork existed and a trust row that quietly looks finished while the
 * artwork is missing is how a gap ships unnoticed. The artwork is here, so
 * the row is a logo strip now and the note under it is gone with the gap.
 *
 * ── WHY THEY ARE MONOCHROME ───────────────────────────────────────────────
 * Two of the four were unusable as supplied on this ground: Entrepreneur is
 * pure black (measured luminance 0.00 against an obsidian page) and Business
 * Standard's dark red is close behind it. Sitting them on white tiles would
 * have fixed the contrast and broken the beat: this row is specified as a
 * hairline, light-weight strip, and four white boxes across it is the
 * opposite of that.
 *
 * So all four are treated the same way, in bone: inverted greyscale rather
 * than a flat silhouette. A silhouette is simpler and works for the three
 * wordmarks, but it turns the Google News icon into a solid blob with the G
 * knocked out of it. Inverted greyscale keeps the internal structure of the
 * icon and reads identically on the wordmarks, so one treatment covers all
 * four. Monochrome press marks are the convention publications themselves
 * supply for this exact strip.
 *
 * The dot separators are gone. They were spacing NAMES, which run together
 * without them; logos already carry their own edges.
 *
 * ── SLIDING ON MOBILE (2026-09-10, Atul) ──────────────────────────────────
 * The set is rendered TWICE. One copy is 540px wide against a 360px screen,
 * so on a phone the row cannot show all four at once and a wrapped two-by-two
 * block reads as a grid rather than a press strip. Doubled, it slides, and the
 * -50% translate lands the second copy exactly where the first began.
 *
 * The second copy is `aria-hidden` and `inert`: it exists to fill the loop, so
 * a screen reader must hear each publication once and Tab must never land in
 * it. On desktop it is display:none and the row is the static centred strip it
 * has always been.
 *
 * ── SIZE AND SPACING (2026-09-10, Atul) ───────────────────────────────────
 * The height comes from the data, not the stylesheet, because it has to be
 * per logo: three of these are wordmarks and one is a stacked icon-over-text
 * lockup, and at a single shared height the lockup's type reads half the size
 * of everything else. It is passed as a custom property so the CSS stays one
 * rule and the tuning sits next to the file it tunes.
 */
export function Featured() {
  return (
    <section className="cso-trust">
      <Wrap>
        <span className="cso-trust-cap">Featured in</span>
        <div className="cso-trust-row" data-sdp-reveal>
          <div className="cso-trust-track">
            {[0, 1].map((copy) =>
              featured.map((p) => (
                <img
                  className="cso-trust-logo"
                  key={`${copy}-${p.name}`}
                  data-copy={copy}
                  src={asset(p.src)}
                  alt={copy === 0 ? p.name : ""}
                  aria-hidden={copy === 1 || undefined}
                  inert={copy === 1 || undefined}
                  style={{ "--logo-h": `${p.h}px` } as React.CSSProperties}
                  width={p.w}
                  height={p.nh}
                  /* NOT lazy. The duplicate copy of the marquee starts outside
                     the mask, so a lazy load never fires for it, and an image
                     with width:auto that has not loaded has no width at all:
                     the second half of the track collapsed and the loop showed
                     a hole after the last logo. The whole strip is 60KB and
                     sits near the top of the page, so eager is right anyway. */
                  decoding="async"
                />
              ))
            )}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
