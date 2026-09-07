import { asset } from "./asset-version";
import {
  brand, founderChapters, founderChips, founderDeck, founderLine, journey, site,
} from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";

/**
 * BEAT 5 · FOUNDER — on the ABYSS band (the client's system names Abyss "deep
 * ambient, hero base, footer"; this is the page's deep authority moment, and
 * the supplied portrait was shot on a blue-lit set that lands in the same
 * family).
 *
 * A deliberate call against the blueprint's default. The blueprint marks the
 * founder "My Story" beat as the one reliably-TEXT beat, because it is usually
 * flowing prose. This one is not: the source supplies it as four ordered,
 * titled chapters with a real chronology inside them (2018, then 2020, then the
 * problem it exposed, then the decision). That is a genuine §1 sequence, so it
 * earns the numbered chapter ledger.
 *
 * The blueprint's underlying rule still holds, and it is why this is a LEDGER
 * and not a card grid: the STRUCTURE is the ordering, the BODIES are prose, so
 * the prose is left as full paragraphs. The credential figures inside it
 * ($2 million, nearly 1,000 businesses, ₹15 crore) stay inside the sentences
 * that earned them. Lifting them out into a pill row would print the same
 * claims twice and strip them of the story that makes them credible.
 *
 * The five journey photographs ship UNCAPTIONED and ungraded, framed as
 * documents. The client supplied images and no captions; writing a line under
 * each would be inventing a story around someone else's photographs, and
 * colour-grading them to fit the palette would be editing evidence.
 */
/* The three credential marks. FILLED and gradient-lit, not hairline strokes:
   a stroked outline at 17px reads as a smudge beside tracked caps, and the same
   change is what made the payoff bar's mark read as lit rather than drawn. Each
   shape carries a top-to-bottom volt ramp and the group takes a tight glow.

   Gradient ids are suffixed per glyph — ids are global in a document, so three
   copies of "grad" would all resolve to whichever rendered last. */
function ChipGlyph({ name }: { name: string }) {
  const g = `cg-${name}`;
  const art: Record<string, React.ReactNode> = {
    bars: (
      <>
        <rect x="2.5" y="13" width="4.6" height="8.5" rx="1.6" fill={`url(#${g}a)`} />
        <rect x="9.7" y="7.5" width="4.6" height="14" rx="1.6" fill={`url(#${g}b)`} />
        <rect x="16.9" y="2.5" width="4.6" height="19" rx="1.6" fill={`url(#${g}c)`} />
      </>
    ),
    rocket: (
      <>
        <path d="M20.8 3.2c-4.8.3-8.6 2.4-11.2 6.2L7.4 13l3.6 3.6 3.6-2.2c3.8-2.6 5.9-6.4 6.2-11.2z"
          fill={`url(#${g}b)`} />
        <path d="M5.2 15.2 2.8 21.6l6.4-2.4-4-4z" fill={`url(#${g}c)`} />
        <circle cx="15.2" cy="8.8" r="1.7" fill="var(--obsidian)" />
      </>
    ),
    target: (
      <>
        <path d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2zm0 3a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2z"
          fill={`url(#${g}a)`} />
        <circle cx="12" cy="12" r="3.4" fill={`url(#${g}c)`} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden
      className="cso-chip-glyph">
      <defs>
        <linearGradient id={`${g}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-200)" />
          <stop offset="100%" stopColor="var(--volt-500)" />
        </linearGradient>
        <linearGradient id={`${g}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-50)" />
          <stop offset="100%" stopColor="var(--volt-300)" />
        </linearGradient>
        <linearGradient id={`${g}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-300)" />
          <stop offset="100%" stopColor="var(--volt-600)" />
        </linearGradient>
      </defs>
      {art[name]}
    </svg>
  );
}

export function Founder() {
  return (
    <section className="sd-section sd-deep" id="about">
      <Wrap>
        <SdpHead eyebrow="The operator" title="Why Should You Listen To Me?" />
        <p className="cso-founder-deck">{founderDeck}</p>

        <div className="cso-founder-head">
          <div className="cso-portrait">
            <img
              src={asset(brand.portrait)}
              width={brand.portraitW}
              height={brand.portraitH}
              alt={`${site.name}, ${site.role}`}
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="cso-founder-name">{site.name}</h3>
            <span className="cso-founder-role">{site.role}</span>
            {/* The rule closes the identity block — name and role are one unit,
                the summary line beneath it is a different one. */}
            <span className="cso-founder-rule" aria-hidden />
            <p className="cso-founder-line">{founderLine}</p>
            {/* Three credential chips. They restate WHAT he is, not what he
                has done — the figures stay inside the chapters that earned
                them, which is why none of these carries a number. */}
            <ul className="cso-founder-chips">
              {founderChips.map((c) => (
                <li key={c.label}>
                  <span className="ic" aria-hidden><ChipGlyph name={c.icon} /></span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cso-chapters">
          {founderChapters.map((c, i) => (
            <article
              className="cso-chapter"
              key={c.n}
              data-sdp-reveal
              style={{ "--d": `${0.05 * i}s` } as React.CSSProperties}
            >
              <div className="cso-chapter-spine" aria-hidden>
                <span className="cso-chapter-n">{c.n}</span>
              </div>

              <div className="cso-chapter-card">
                <h3>{c.title}</h3>
                {c.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

            </article>
          ))}
        </div>

        <div className="cso-journey" data-sdp-reveal>
          <span className="cso-journey-cap">From the journey</span>
          <div className="cso-journey-strip">
            {journey.map((src) => (
              <figure className="cso-journey-frame" key={src}>
                <img src={asset(src)} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
