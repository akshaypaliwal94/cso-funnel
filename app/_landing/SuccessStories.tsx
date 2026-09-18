"use client";

import { useRef, useState } from "react";
import { asset } from "./asset-version";
import { results } from "./content";
import { r2 } from "./r2";
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
 * ── THE PLAY CONTROL (revised 2026-09-18, Atul) ───────────────────────────
 * This section carried no play mark for a long time, on the rule that a play
 * mark over a still that cannot play is the same promise-with-nothing-behind
 * -it the page refuses everywhere else. The dfy build renders an idle one on
 * every card; this one deliberately did not.
 *
 * It is back, on ONE card, because that card's artwork is now a 16:9 video
 * thumbnail of a testimonial that exists. The rule is honoured by making the
 * mark a real <button> only when the entry has a `video`, and a plain inert
 * <span> otherwise: no tab stop, no pointer, no click that does nothing.
 *
 * The lead is wired: its film is an object in the same R2 bucket the hero VSL
 * plays from, and it opens in place rather than in a modal.
 *
 * Sparse entries render short, not broken: several people have a role and no
 * figure, a few a figure and no role, one has neither, one has no photograph.
 * Inventing any of those on a proof beat is the one thing this section must
 * never do.
 */

/**
 * ── COMPOSED CARDS vs CUTOUTS (2026-09-18, Atul) ──────────────────────────
 * `card: true` means the artwork is already a FINISHED card: both regions were
 * replaced with 1:1 artwork that has the name, the role, the figure and the
 * multiple typeset into the image itself.
 *
 * Two things follow from that, and both are why this is a flag rather than a
 * straight file swap. The footer below would print all four a second time, an
 * inch under where the artwork already says them. And the box is `9/16` with
 * `object-fit:cover`, so a square would be cropped to its middle 56% and the
 * stat block, which lives down the LEFT edge of every one of these, would be
 * the first thing cut off. A composed entry therefore renders as a bare 1:1
 * image with no scrim and no footer.
 *
 * The name/role/result/roi fields stay populated for those entries even though
 * nothing prints them: they are the card's alt text and the only machine
 * readable copy of a figure that is otherwise locked inside a picture.
 *
 * The flag is per entry rather than per region because it tracks a fact about
 * the FILE, not about where the person lives. Every entry carries it today, so
 * the initials fallback and the footer below are currently unreached: they are
 * the path for a name added before its artwork exists, and deleting them would
 * mean the next such entry renders an empty box instead of a short card.
 */
type Story = {
  readonly name: string;
  readonly role?: string;
  readonly result?: string;
  readonly roi?: string;
  readonly photo?: string;
  /** Artwork is a finished card: suppress the footer, render 1:1. */
  readonly card?: boolean;
  /**
   * Takes the full width of the wall on its own row, at 16:9.
   *
   * This is a different PICTURE, not the same one stretched: a 16:9 cut of the
   * card with the artwork re-laid out for the wider frame. Stretching the
   * square to fill the row would soften it to nothing at that size, which is
   * why this is a flag on an entry that has its own file rather than a CSS
   * span applied to the existing one.
   *
   * It has to come first in the list to lead, because the row is the grid's
   * own first row: this flag sets the span, not the order.
   */
  readonly lead?: boolean;
  /**
   * The film's object key in the R2 bucket (a bare file name, NOT a /public
   * path and NOT a full URL: ./r2 owns the origin).
   *
   * Presence of this is what makes the play mark a real BUTTON rather than an
   * inert one, so it is the field that keeps the section's promise honest: see
   * the header note. An entry with a `lead` thumbnail but no `video` still
   * draws the mark, because that artwork is a video thumbnail and reads as
   * broken without one, but nothing about it will answer a click.
   */
  readonly video?: string;
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

/**
 * The play mark. A triangle on a disc, with two halo rings that pulse outward
 * behind it so the card reads as a film rather than a poster.
 *
 * It is white-on-voltage rather than YouTube's red: the artwork behind it is
 * blue, and red here would be the only warm mass on the wall AND would collide
 * with the accent this page reserves for things you press.
 */
function PlayMark() {
  return (
    <span className="cso-play-mark" aria-hidden>
      <span className="cso-play-ring" />
      <span className="cso-play-ring" />
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M9 7.5v9l7.5-4.5L9 7.5z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function SuccessStories() {
  const [active, setActive] = useState<"india" | "international">("india");
  /** Which card is running. At most one: starting a film is a deliberate act
   *  and two testimonials talking over each other is nobody's intent. */
  const [playing, setPlaying] = useState<string | null>(null);
  const films = useRef<Record<string, HTMLVideoElement | null>>({});
  const stories: readonly Story[] = results[active];

  /* THE SAME ONE-TAP RULE AS THE HERO VSL, and for the same reason: see the
     note in VSLFrame.tsx. `controls` stays off until the film is running, so
     the browser's own big centre button never stacks on top of ours, and
     play() is called INSIDE the click rather than from an effect after the
     re-render. A play() that lands outside the user gesture is the one that
     gets blocked, and with sound on it is blocked reliably. */
  const start = (name: string) => {
    setPlaying(name);
    films.current[name]?.play();
  };

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
              onClick={() => {
                setActive(t.id as "india" | "international");
                /* Or a film left open on one tab is still playing, unseen and
                   audible, after the reader has switched to the other. */
                setPlaying(null);
              }}
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
              className={`cso-face${s.lead ? " is-lead" : ""}`}
              key={s.name}
              style={{ "--i": Math.min(i, 11) } as React.CSSProperties}
            >
              <div className={`cso-face-art${s.card ? " is-card" : ""}`}>
                {s.video ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    ref={(el) => {
                      films.current[s.name] = el;
                    }}
                    className="cso-face-video"
                    src={r2(s.video)}
                    poster={s.photo ? asset(s.photo) : undefined}
                    controls={playing === s.name}
                    playsInline
                    preload="metadata"
                  />
                ) : s.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(s.photo)}
                    alt={
                      s.card
                        ? [s.name, s.role, s.result, s.roi].filter(Boolean).join(". ")
                        : s.name
                    }
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="cso-face-initials" aria-hidden>
                    {initials(s.name)}
                  </span>
                )}

                {/* The mark draws on any entry that is a film OR a lead, but it
                    is only a BUTTON when there is something to play. The
                    non-interactive branch is a span, not a disabled button, so
                    a keyboard never lands on a control that does nothing. */}
                {playing !== s.name && (s.video || s.lead) ? (
                  s.video ? (
                    <button
                      type="button"
                      className="cso-play"
                      onClick={() => start(s.name)}
                      aria-label={`Play ${s.name}'s testimonial`}
                    >
                      <PlayMark />
                    </button>
                  ) : (
                    <span className="cso-play is-inert">
                      <PlayMark />
                    </span>
                  )
                ) : null}

                {s.card ? null : (
                  <>
                    <span className="cso-face-scrim" aria-hidden />

                    <div className="cso-face-foot">
                      <p className="cso-face-name">{s.name}</p>
                      {s.role ? <p className="cso-face-role">{s.role}</p> : null}
                      <span className="cso-face-rule" aria-hidden />
                      {s.result ? <p className="cso-face-result">{s.result}</p> : null}
                      {s.roi ? <span className="cso-face-roi">{s.roi}</span> : null}
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
