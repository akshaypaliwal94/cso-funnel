"use client";

import { useRef } from "react";
import { useSpine } from "./useSpine";
import { process60 } from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";

/**
 * BEAT 7 · THE 60-DAY INSTALL — §1 SEQUENCE, rendered as the scroll-linked
 * journey spine (the category's `heavy` option, `[EMPIRICAL]`).
 *
 * This is the page's process spine and its ONE heavy motion moment. It earns
 * that: four ordered phases, each with its own week range, its own deliverables
 * and its own pull-quote, and inside phase 3 a seven-row ledger. That is the
 * richest structure on the page, and treatment intensity scales with structural
 * richness, so this is the heaviest treatment on the page. Nothing else gets
 * scroll-linked motion, or the moment stops being a moment.
 *
 * FAIL-OPEN (C7): every phase renders LIT. The script only ever ADDS `armed`,
 * and `armed` is what dims the phases the scroll head has not reached. If JS
 * never runs, or errors, or the visitor prefers reduced motion, the section is
 * simply a fully lit ledger. It can never render as a page of dimmed text.
 *
 * The nested structures inside a phase are the phase's CONTENTS, not a second
 * shape competing with the spine: the ledger is what phase 3 delivers, and the
 * pull-quotes are the client's own voice on each phase.
 */
export function Process60() {
  const ref = useRef<HTMLDivElement>(null);

  /* The scroll spine now lives in useSpine, shared with the founder
     chapters. Behaviour is unchanged: same 0.58 sight line, same rAF-guarded
     scroll read, same fail-open under reduced motion. */
  useSpine(ref, { railClass: "cso-spine-rail", itemClass: "cso-phase", nodeClass: "cso-phase-node" });

  return (
    <section className="sd-section sd-depth" id="process">
      <Wrap>
        <SdpHead
          eyebrow={process60.eyebrow}
          title={process60.headline}
          sub={process60.deck}
        />

        <div className="cso-spine" ref={ref}>
          <div className="cso-spine-rail" aria-hidden>
            <div className="cso-spine-fill" />
          </div>

          {process60.phases.map((ph) => (
            <article className="cso-phase" key={ph.n}>
              <span className="cso-phase-node" aria-hidden>
                {ph.n}
              </span>

              <div className="cso-phase-card">
                <span className="cso-phase-eyebrow">{ph.eyebrow}</span>
                {/* The ordinal lives on the spine node and nowhere else: it is
                    one number, printed once. */}
                <h3>{ph.name}</h3>

                <div className="cso-phase-chips">
                  <span className="cso-chip badge">{ph.badge}</span>
                  <span className="cso-chip weeks">{ph.weeks}</span>
                </div>

                {ph.note ? <p className="cso-phase-note">{ph.note}</p> : null}

                {ph.bullets.length ? (
                  <ul className="cso-phase-list">
                    {ph.bullets.map((b) => (
                      <li key={b.lead}>
                        <span>
                          <b>{b.lead}</b> — {b.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* The seven systems. A numbered ledger with the trigger and
                    the consequence per row, exactly as the source separates
                    them. No column headers: naming the columns would be
                    writing copy the client has not written. */}
                {ph.systems ? (
                  <div className="cso-ledger">
                    {ph.systems.map((s, i) => (
                      <div className="cso-ledger-row" key={s.name}>
                        <span className="cso-ledger-n">{String(i + 1).padStart(2, "0")}</span>
                        <span>
                          <span className="cso-ledger-name">{s.name}</span>
                          <span className="cso-ledger-trigger">{s.trigger}</span>
                        </span>
                        <span className="cso-ledger-kills">{s.kills}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <blockquote className="cso-quote">
                  <p>{ph.quote}</p>
                  <cite>Akshay</cite>
                </blockquote>
              </div>
            </article>
          ))}
        </div>

        {/* Everything that used to sit here was removed on 2026-09-10 (Atul):
            the 50/50/50 number boxes, the "they multiply" line, the DAY 60 bar,
            the footnote and the signature. The section had already made its
            case across the four phases, and all of it restated figures the
            mechanism beat above states first. Their copy is still in
            content.ts, unrendered.

            The CTA lockup is kept: it is the page's repeating atom and every
            other beat closes on one, so dropping it here would be the only
            beat that asks for nothing. Say the word and it goes too. */}

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
