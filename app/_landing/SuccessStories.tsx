"use client";

import { useState } from "react";
import { asset } from "./asset-version";
import { results } from "./content";
import { Wrap } from "./sdp";

/**
 * BEAT 3/4 · PROOF · §6 proof-set crossed with §4 magnitude.
 *
 * ── REBUILT 2026-09-10 (Atul) ─────────────────────────────────────────────
 * This was three brand cards, most of whose slots were reserved placeholders
 * because the source supplied three names and two figures. It is now the
 * India / International results wall ported from the dfy-new funnel: same
 * roster, same numbers, same two-region split, rebuilt in this funnel's own
 * language rather than pasted in with its.
 *
 * It is the same man's book of work. These are TGO's clients and the founder
 * beat on this page is the story of building TGO, so the roster belongs here
 * as much as it does there.
 *
 * ── WHY A TOGGLE AND NOT ONE LONG WALL ────────────────────────────────────
 * Nineteen faces in one grid is a wall nobody reads, and the split is not
 * cosmetic: a reader in Bengaluru and a reader in Berlin are each checking
 * whether this works for people like them, and the answer is on a different
 * card for each of them. Two buttons rather than a select, because there are
 * exactly two states and both should be readable without opening anything.
 *
 * ── WHAT THE CARD DOES NOT DO ─────────────────────────────────────────────
 * No play control. The dfy build renders an idle one on every card to say
 * "this is a video", but no testimonial URLs are wired here, and a play mark
 * over a still that cannot play is the same promise-with-nothing-behind-it
 * this page refuses everywhere else. Add `video` to an entry and the control
 * can come back with it.
 *
 * Sparse entries render short, not broken: several people have a role and no
 * figure, a few a figure and no role, one has neither, one has no photograph.
 * Inventing any of those on a proof beat is the one thing this section must
 * never do.
 */

type Story = {
  readonly name: string;
  readonly role?: string;
  readonly result?: string;
  readonly roi?: string;
  readonly photo?: string;
};

/** Falls back to initials: an unrelated face is worse than no face. */
const initials = (name: string) =>
  name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export function SuccessStories() {
  const [active, setActive] = useState<"india" | "international">("india");
  const stories: readonly Story[] = results[active];

  return (
    <section className="sd-section sd-panel" id="results">
      <Wrap>
        <div className="sdp-head">
          <div className="sdp-eyebrow center">{results.eyebrow}</div>
          <h2 className="sdp-h2">
            {results.titleLead} <em className="fit-lit">{results.titleLit}</em>
          </h2>
          <p className="sdp-sub">{results.deck}</p>
        </div>

        <div className="cso-reg" role="tablist" aria-label="Where the results are from" data-sdp-reveal>
          {results.tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={`cso-reg-btn${active === t.id ? " is-on" : ""}`}
              onClick={() => setActive(t.id as "india" | "international")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Keyed on the region so React rebuilds the list rather than
            reconciling nineteen cards into eighteen different ones, which is
            what makes the switch read as a change of set instead of a flicker
            of mismatched faces.

            THE CARDS DO NOT USE `data-sdp-reveal`, and that is not an
            oversight. RevealRoot collects those nodes ONCE on mount and
            unobserves each one after it fires. Because this list is keyed, a
            tab switch mounts nine nodes the observer has never seen, so
            nothing ever adds `.vis` to them and `.sd-armed [data-sdp-reveal]`
            leaves them at opacity 0: the second tab renders completely empty.
            It is invisible on the first tab and total on the second, which is
            the worst shape a bug can have.

            So the entry animation is the list's own, in CSS, replayed by the
            remount. That also makes the switch read better than the shared
            reveal would: the set arrives as a set. */}
        <ul className="cso-faces" key={active}>
          {stories.map((s, i) => (
            <li
              className="cso-face"
              key={s.name}
              style={{ "--i": Math.min(i, 11) } as React.CSSProperties}
            >
              <div className="cso-face-art">
                {s.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(s.photo)} alt={s.name} loading="lazy" decoding="async" />
                ) : (
                  <span className="cso-face-initials" aria-hidden>
                    {initials(s.name)}
                  </span>
                )}
                <span className="cso-face-scrim" aria-hidden />

                <div className="cso-face-foot">
                  <p className="cso-face-name">{s.name}</p>
                  {s.role ? <p className="cso-face-role">{s.role}</p> : null}
                  <span className="cso-face-rule" aria-hidden />
                  {s.result ? <p className="cso-face-result">{s.result}</p> : null}
                  {s.roi ? <span className="cso-face-roi">{s.roi}</span> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
