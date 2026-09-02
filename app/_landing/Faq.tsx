"use client";

import { useState } from "react";
import { faqs } from "./content";
import { SdpHead, Wrap } from "./sdp";

/**
 * BEAT 10 · FAQ — §5 objection-set, the rotate-to-× ledger.
 *
 * The top objection opens by default: the strongest doubt should never need a
 * click to be answered. Here that is "how is this different from a course",
 * which is the source's own first question, so nothing was reordered.
 *
 * Fail-open: this is a plain button/panel accordion. If the panel's max-height
 * transition is ever unavailable the content is still in the DOM and readable.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="sd-section sd-panel" id="faq">
      <Wrap>
        <SdpHead eyebrow="Questions" title="FAQs" />

        <div className="sdp-faq">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`sdp-q${isOpen ? " open" : ""}`} key={f.q}>
                <button
                  className="sdp-q-head"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="ic" aria-hidden>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <div className="sdp-q-body" id={`faq-panel-${i}`} role="region">
                  <div className="sdp-q-body-inner">
                    {f.a.map((block, bi) =>
                      block.kind === "p" ? (
                        <p key={bi}>{block.text}</p>
                      ) : (
                        <ul className="sdp-q-list" key={bi}>
                          {block.items.map((it) => (
                            <li key={it}>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}
