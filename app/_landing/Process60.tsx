"use client";

import { useEffect, useRef } from "react";
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
/* The closing sentence of the three-numbers line, lit in the warm accent. Held
   here rather than as a second content field so the line stays ONE string in
   content.ts: if it is ever rewritten and this sentence goes with it, the split
   simply finds nothing and the whole line renders plain. */
const TAIL = "That is where 3X comes from.";

export function Process60() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rail = el.querySelector<HTMLElement>(".cso-spine-rail");
    const phases = Array.from(el.querySelectorAll<HTMLElement>(".cso-phase"));
    if (!rail || !phases.length) return;

    el.classList.add("armed");
    let raf = 0;

    const read = () => {
      const r = rail.getBoundingClientRect();
      const line = window.innerHeight * 0.58;
      const p = Math.min(1, Math.max(0, (line - r.top) / (r.height || 1)));
      el.style.setProperty("--tl-p", String(p));
      phases.forEach((ph) => {
        const node = ph.querySelector(".cso-phase-node");
        if (!node) return;
        const nb = node.getBoundingClientRect();
        ph.classList.toggle("lit", nb.top + nb.height / 2 <= line);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.classList.remove("armed");
    };
  }, []);

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

        {/* The three numbers, restated by the client at the end of the install.
            Deliberately a DIFFERENT render from the mechanism section's cards
            above, so the repeat reads as a summary and not as a duplicate. */}
        <span className="cso-maths-cap" style={{ marginTop: 64 }}>
          {process60.numbersCaption}
        </span>
        <div className="cso-numbers" data-sdp-reveal>
          {process60.numbers.map((x) => (
            <div key={x.t}>
              <span className="n">{x.n}</span>
              <span className="t">{x.t}</span>
            </div>
          ))}
        </div>
        {/* Centred here, unlike the same line in the mechanism card, which is
            left-aligned and pinned to the bottom of its panel. The closing
            sentence takes the warm accent: it is the conclusion the two before
            it are building to, and the page's rule is that a value-moment goes
            warm. Split on the sentence itself, so the copy stays verbatim and
            the highlight cannot drift if the line is rewritten. */}
        <p className="cso-multiply cso-multiply-center" style={{ marginTop: 28, marginBottom: 0 }}>
          {process60.numbersLine.split(TAIL)[0]}
          <span className="tail">{TAIL}</span>
        </p>

        <div className="cso-closing-bar" data-sdp-reveal>
          {/* "DAY 60 →" stays ivory and the outcome takes the warm accent, the
              same split the line above the bar uses: the timestamp is the setup,
              the revenue is the value-moment. Split on the arrow that is already
              in the copy, so nothing is hard-coded twice and a rewrite of either
              half carries through untouched. */}
          <span className="big">
            {/* trimmed: as flex items the spans no longer collapse the copy's
                own spaces, so the gap between them is set in CSS instead */}
            <span>{process60.closingBar.split("→")[0].trim()}</span>
            {/* An SVG, not the "→" character. A glyph is positioned by its
                font's baseline, and Bebas sets caps at ~0.73em inside a 0.9em
                ascent, so the caps ride high in their line box: centring the
                boxes still left the arrow about a quarter of an em low. An
                SVG's box IS its artwork, so flex centring puts it exactly on
                the line's middle, at any size, with no nudging. */}
            <svg className="arrow" viewBox="0 0 24 12" fill="none" aria-hidden
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M1 6h20M16 1l5 5-5 5" />
            </svg>
            <span className="tail">{process60.closingBar.split("→")[1].trim()}</span>
          </span>
          <p>{process60.closingLine}</p>
        </div>

        <p className="cso-footnote">{process60.footnote}</p>
        <span className="cso-signature">{process60.signature}</span>

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
