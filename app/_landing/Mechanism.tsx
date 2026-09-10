import type { ReactNode } from "react";
import { mechanism } from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";
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

/* One glyph per driver, in the house line style: 24x24, currentColor, 1.9
   stroke, round caps and joins. Each states its driver — people saying yes, a
   rising bar for deal value, a return arrow for deals won back — and the SAME
   glyph marks that driver in both the list and the pyramid, which is what ties
   the two panels together as one argument. */
const DRIVERS = [
  /* 0 · more leads say yes */
  <>
    <path d="M16 20v-1.6a3.4 3.4 0 0 0-3.4-3.4H6.4A3.4 3.4 0 0 0 3 18.4V20" />
    <circle cx="9.5" cy="7.6" r="3.4" />
    <path d="M21 20v-1.6a3.4 3.4 0 0 0-2.6-3.3M15.6 4.4a3.4 3.4 0 0 1 0 6.4" />
  </>,
  /* 1 · higher deal value */
  <>
    <path d="M4 20V13" /><path d="M10 20V8" /><path d="M16 20V4" />
  </>,
  /* 2 · deals recovered after the first call */
  <>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.6 3.6v5h-5" />
  </>,
];

/**
 * The payoff bar's mark. Deliberately NOT the stroked DriverGlyph in a tile:
 * the reference draws it as three SOLID rounded bars with no bed at all, each
 * one filled with its own vertical gradient and the middle bar the lightest of
 * the three. Filled shapes catch light in a way a 2px outline cannot, which is
 * what makes it pop without needing a box around it.
 */
function ResultGlyph({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        {/* Each bar lights from the top, and they do not share a gradient: one
            ramp across all three would read as a single object with a sheen on
            it rather than as three bars each catching the light. */}
        <linearGradient id="rgA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-200)" />
          <stop offset="100%" stopColor="var(--volt-500)" />
        </linearGradient>
        <linearGradient id="rgB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-50)" />
          <stop offset="100%" stopColor="var(--volt-300)" />
        </linearGradient>
        <linearGradient id="rgC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt-300)" />
          <stop offset="100%" stopColor="var(--volt-600)" />
        </linearGradient>
      </defs>
      <rect x="2.6"  y="13" width="5.2" height="8.4"  rx="1.9" fill="url(#rgA)" />
      <rect x="9.4"  y="7.6" width="5.2" height="13.8" rx="1.9" fill="url(#rgB)" />
      <rect x="16.2" y="3"   width="5.2" height="18.4" rx="1.9" fill="url(#rgC)" />
    </svg>
  );
}

function DriverGlyph({ i, size = 21 }: { i: number; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {DRIVERS[i]}
    </svg>
  );
}

/* The three bands, in viewBox units, taken from the reference: apex at
   (300,4), base corners at (4,436) and (596,436), and the two slice lines at
   y=208/220 and y=323/331. Every x below is the point where that y meets the
   pyramid's own edge, which is what keeps the six side edges collinear. */
const TIERS: [number, number][][] = [
  [[300, 4], [439.7, 208], [160.3, 208]],
  [[152.1, 220], [447.9, 220], [518.5, 323], [81.5, 323]],
  [[76, 331], [524, 331], [595.9, 436], [4.1, 436]],
];

/**
 * Rounds every corner of a polygon by r and returns a path string.
 *
 * Each corner becomes: stop r short of it along the incoming edge, curve
 * through the corner, resume r along the outgoing edge. r is clamped to half
 * the shorter adjacent edge so a tight corner (the apex) cannot overshoot and
 * turn the shape inside out.
 */
function roundedPath(pts: [number, number][], r: number): string {
  const n = pts.length;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[(i - 1 + n) % n];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[(i + 1) % n];
    const d1 = Math.hypot(cx - px, cy - py);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, d1 / 2, d2 / 2);
    const ax = cx + ((px - cx) / d1) * rr;
    const ay = cy + ((py - cy) / d1) * rr;
    const bx = cx + ((nx - cx) / d2) * rr;
    const by = cy + ((ny - cy) / d2) * rr;
    out.push(`${i === 0 ? "M" : "L"}${ax.toFixed(2)},${ay.toFixed(2)}`);
    out.push(`Q${cx.toFixed(2)},${cy.toFixed(2)} ${bx.toFixed(2)},${by.toFixed(2)}`);
  }
  return out.join(" ") + " Z";
}

/**
 * Where the shine sits on a tier's outline, as POINTS rather than as positions
 * along the path.
 *
 * The earlier version returned path offsets and drew each highlight as a stack
 * of nested dashes. That can never be smooth: every dash has a hard end, so
 * however many are stacked the boundaries stay visible as bands. Points instead
 * let the whole thing be done with a mask, below, where the falloff is a
 * gradient and there are no steps to see.
 *
 * Corners come first and strongest — light pools where a surface turns. Then a
 * few smaller flares along the runs, placed by a hash of the shape's own
 * coordinates so they scatter but never move: Math.random() would give the
 * server and the client different values, which is a hydration mismatch and a
 * new arrangement on every reload.
 */
function shineSpots(
  pts: [number, number][],
): { x: number; y: number; r: number; k: number }[] {
  const n = pts.length;
  const ys = pts.map((q) => q[1]);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const span = bottom - top || 1;
  const spots: { x: number; y: number; r: number; k: number }[] = [];

  // a pool on every corner, weighted by how low it sits in its own tier: each
  // tier's underside is its lit edge, its top sits in the shadow of the one above
  pts.forEach(([x, y]) => {
    const t = (y - top) / span;
    spots.push({ x, y, r: 46, k: 0.22 + 0.78 * t });
  });

  // flares along the longer runs
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[(i + 1) % n];
    const L = Math.hypot(bx - ax, by - ay);
    if (L < 150) continue;

    const seed = Math.abs(Math.round(ax * 7 + ay * 13)) % 100;
    const mid = (ay + by) / 2;
    const t = (mid - top) / span;
    const isUnderside = t > 0.85;

    /* The underside of a tier is where the light actually is — it is the edge
       facing the tier below, and it is also the longest run on the shape, so a
       single modest flare left it looking unlit between its two corner pools.
       It gets TWO flares, brighter and larger; every other run keeps one. */
    const count = isUnderside ? 2 : 1;
    const boost = isUnderside ? 1.75 : 1;

    for (let j = 0; j < count; j++) {
      const base = count === 1 ? 0.5 : 0.3 + j * 0.4;
      const f = base + ((seed % 17) / 17 - 0.5) * 0.12;   // seeded jitter, never random
      const x = ax + (bx - ax) * f;
      const y = ay + (by - ay) * f;
      spots.push({
        x,
        y,
        r: (isUnderside ? 34 : 24) + (seed % 3) * 7,
        k: Math.min(1, (0.3 + ((seed + j) % 5) * 0.05) * (0.35 + 0.65 * t) * boost),
      });
    }
  }

  return spots;
}

/* Splits a paragraph at its first sentence end, so the opening claim can be set
   as a headline and the rest as its deck. It is a LINE BREAK, not an edit: both
   halves are returned verbatim and nothing is dropped. If no sentence end is
   found the whole string comes back as the headline and the deck is empty, so a
   rewritten paragraph can never lose text here. */
function firstSentence(p: string): string {
  const i = p.indexOf(". ");
  return i === -1 ? p : p.slice(0, i + 1);
}
function afterFirstSentence(p: string): string {
  const i = p.indexOf(". ");
  return i === -1 ? "" : p.slice(i + 2);
}

/** Lights one token inside a verbatim sentence. Emphasis only, never a rewrite. */
function lit(
  text: string,
  token: string,
  className: string,
  /* Optional: what the lit token READS as, when it differs from the string it
     was found by. Used to print the driver figures as "+50%" while the source
     sentence still says "50%" — the sign is a display convention, and this way
     it never has to be written into the copy doc. */
  display?: string,
): ReactNode {
  const i = text.indexOf(token);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className={className}>{display ?? token}</span>
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

        {/* --- THE ENGINE ---------------------------------------------------
             ONE panel, from 2026-09-10 (Atul). This was two: the drivers on
             the left and a sliced pyramid on the right carrying a +50% on
             each band. They were the same three drivers twice, and the second
             telling added a shape rather than an argument, so the pyramid is
             gone and its figures moved onto the rows that already named the
             drivers. One statement, with its numbers on it. */}
        <div className="cso-engine">
          <article className="sdp-card cso-engine-card" data-sdp-reveal>
            <span className="cso-engine-eyebrow">{mechanism.engineEyebrow}</span>
            <p className="cso-engine-intro">{mechanism.engineIntro}</p>
            {/* Name, gloss, and the figure. The figure used to live on the
                pyramid beside this, which is why these rows had none: printing
                it in both places would have made the two panels read as two
                versions of one claim. With the pyramid gone it belongs here,
                on the row that names the driver it measures. */}
            <ul className="cso-drivers">
              {mechanism.drivers.map((dr, i) => (
                <li key={dr.title}>
                  <span className="cso-driver-ic" aria-hidden>
                    <DriverGlyph i={i} />
                  </span>
                  <span className="cso-driver-copy">
                    <span className="cso-driver-title">{dr.title}</span>
                    <span className="cso-driver-sub">{dr.sub}</span>
                  </span>
                  {mechanism.drivers[i]?.pct ? (
                    <span className="cso-driver-pct">{mechanism.drivers[i].pct}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <span className="cso-engine-rule" aria-hidden />
            <p className="cso-multiply">
              {lit(mechanism.multiply, "multiply.", "em-word")}
            </p>
          </article>

        </div>

        {/* --- THE MATHS, as the comparison it always was ------------------
             The source states this as prose. A before/after table is what that
             prose already is: two columns of the same five figures. Rendering
             it as a table lets the reader compare a row at a time instead of
             holding six numbers in their head across two paragraphs. */}
        <span className="cso-maths-cap">{mechanism.mathsCaption}</span>

        <div className="cso-mtable-wrap" data-sdp-reveal>
          <div className="cso-mtable-scroll">
          <table className="cso-mtable">
            {/* The columns exist so the vertical rules can be drawn ONCE down
                each one. Drawn on the cells instead, a gradient rule restarts
                and fades at every cell boundary and the line reads as dashes.
                A <col> spans the column's whole height, so one gradient runs
                the full drop. */}
            <colgroup>
              <col />
              <col />
              <col className="after" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{mechanism.mathsTable.head.metric}</th>
                <th scope="col">{mechanism.mathsTable.head.before}</th>
                <th scope="col" className="after">{mechanism.mathsTable.head.after}</th>
              </tr>
            </thead>
            <tbody>
              {mechanism.mathsTable.rows.map((r) => (
                <tr key={r.metric}>
                  <th scope="row">{r.metric}</th>
                  <td>{r.before}</td>
                  <td className="after">{r.after}</td>
                </tr>
              ))}
              <tr className="total">
                <th scope="row">{mechanism.mathsTable.total.metric}</th>
                <td>{mechanism.mathsTable.total.before}</td>
                <td className="after">{mechanism.mathsTable.total.after}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div className="cso-result" data-sdp-reveal style={{ "--d": ".1s" } as React.CSSProperties}>
          <span className="cso-result-ic" aria-hidden>
            <ResultGlyph />
          </span>
          <span className="cso-result-rule" aria-hidden />
          <p>{lit(mechanism.mathsResult, "₹30 lakh", "fig")}</p>
        </div>

        {/* --- THE SYSTEM: the diagram beat, per Atul's reference render ----
             The head is the first closing paragraph split at its own sentence
             break: the opening sentence becomes the headline and what follows
             becomes the deck. Every word is the doc's; only the break is new,
             and it is what lets the claim land before its explanation. The
             second paragraph runs whole underneath. */}
        <div className="cso-system-head" data-sdp-reveal>
          <div className="sdp-eyebrow center">{mechanism.systemEyebrow}</div>
          <h3 className="cso-system-h">{firstSentence(mechanism.closing[0])}</h3>
          <p className="cso-system-deck">{afterFirstSentence(mechanism.closing[0])}</p>
          <p className="cso-system-p">{mechanism.closing[1]}</p>
        </div>

        {/* --- the diagram the source specifies --- */}
        <div className="cso-system-diagram" data-sdp-reveal>
          <VennDiagram />
        </div>

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
