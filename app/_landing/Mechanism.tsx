import type { ReactNode } from "react";
import { mechanism } from "./content";
import { CheckGlyph, CtaLockup, SdpHead, Wrap } from "./sdp";
import { VennDiagram } from "./VennDiagram";

/**
 * BEAT 6 · MECHANISM — the builder-pick.
 *
 * The blueprint offers two empirical renderings: numbered pillars ("the N
 * principles") or an old-way/new-way compare. This section's meaning is
 * NEITHER. It is a MAGNITUDE argument: three multiplying numbers, then a worked
 * calculation from ₹10 lakh to ₹30 lakh. So it renders as
 *   §4 magnitude (the three numbers, each figure lit inside its own sentence)
 *   + §2 contrast / §3 accumulation (the maths: today, then after, then the
 *     computed result as the lit value-moment)
 *   + the interactive diagram the source calls for.
 * Flagged as a deliberate deviation from the two blueprint picks, because the
 * meaning genuinely differs.
 *
 * The two closing paragraphs are narrative prose with no structure inside them,
 * so they stay TEXT. Forcing them into cards would be decoration.
 *
 * NOTHING in the maths is computed or restated by this component: every number
 * on screen is inside a sentence the source wrote.
 */

/** Lights one token inside a verbatim sentence. Emphasis only, never a rewrite. */
function lit(text: string, token: string, className: string): ReactNode {
  const i = text.indexOf(token);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className={className}>{token}</span>
      {text.slice(i + token.length)}
    </>
  );
}

export function Mechanism() {
  return (
    <section className="sd-section sd-dark" id="system">
      <Wrap>
        <SdpHead
          eyebrow="What is the system?"
          title={mechanism.headline}
          sub={mechanism.sub}
        />

        {/* --- the three numbers (§4 magnitude) --- */}
        <div className="cso-three">
          {mechanism.threeNumbers.map((line, i) => (
            <article
              className="sdp-card cso-three-card"
              key={line}
              data-sdp-reveal
              style={{ "--d": `${0.06 * i}s` } as React.CSSProperties}
            >
              <span className="cso-three-ck" aria-hidden>
                <CheckGlyph size={15} />
              </span>
              <p className="cso-three-line">{lit(line, "50%", "pct")}</p>
            </article>
          ))}
        </div>

        <p className="cso-multiply" data-sdp-reveal>
          {lit(mechanism.multiply, "They multiply.", "em-word")}
        </p>

        {/* --- the maths (today → after → the computed result) --- */}
        <span className="cso-maths-cap">{mechanism.mathsCaption}</span>

        <div className="cso-maths" data-sdp-reveal>
          <article className="sdp-card cso-maths-card">
            <p>{lit(mechanism.mathsBefore, "₹10 lakh", "fig")}</p>
          </article>

          <div className="cso-maths-arrow" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12h15M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <article className="sdp-card cso-maths-card after">
            <p>{lit(mechanism.mathsAfter, "₹1.5 lakh", "fig")}</p>
          </article>
        </div>

        <div className="cso-result" data-sdp-reveal style={{ "--d": ".1s" } as React.CSSProperties}>
          <p>{lit(mechanism.mathsResult, "₹30 lakh", "fig")}</p>
        </div>

        {/* --- structureless prose stays prose --- */}
        <div className="cso-prose" data-sdp-reveal>
          {mechanism.closing.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {/* --- the diagram the source specifies --- */}
        <div style={{ marginTop: "48px" }} data-sdp-reveal>
          <VennDiagram />
        </div>

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
