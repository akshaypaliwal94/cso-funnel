"use client";

import { useState } from "react";
import { mechanism, venn } from "./content";

/**
 * THE VENN — rebuilt as SVG in the SIGNAL & DEPTH tokens.
 *
 * The client's supplied PNG (`public/brand/venn-reference.png`) is a LIGHT
 * design: white ground, blue/purple/teal/green phase colours. Dropped onto a
 * dark-first page it would be a white hole. So the PNG is used as a reference
 * for GEOMETRY AND LABELS ONLY, and the diagram is rebuilt in the brand.
 *
 * All seven regions are tappable, because all seven now carry supplied content:
 * three named circles (rim label + contents), three pairwise overlaps and the
 * centre. What a tap reveals is the client's own labels plus which circles the
 * region is made of, which is read off the diagram's geometry. Nothing is
 * written here that the client did not supply.
 *
 * VOLTAGE IS A SURFACE, NEVER TYPE. At 2.25:1 on obsidian it is unreadable as
 * text. The centre lens is the one voltage fill in this section, carrying ivory
 * at the client's measured 7.90:1: it is the payoff, so it is where the eye is
 * sent.
 *
 * GEOMETRY: three circles of r=200 on an equilateral triangle of side 236
 * (d/R = 1.18), which is the overlap depth measured off the client's PNG. Every
 * label position below was checked to sit inside its own region and outside the
 * others, and clear of the rim arcs at r=178.
 *
 * Below 640px the diagram is replaced by a seven-row stack with the same labels
 * and the same selection behaviour: a 680px diagram is unreadable on a phone,
 * and shrinking it to fit is worse than restating it.
 */

const D = { cx: 382, cy: 236 };
const C = { cx: 264, cy: 440 };
const A = { cx: 500, cy: 440 };
const R = 200;
/* how far outside the circles the dotted silhouette sits */
const OFF = 22;

/* Where each ring's shine pools. Angles are in degrees clockwise from 3
   o'clock, chosen per circle so no two rings light in the same place and so the
   brightest pool on each falls on the part of its arc that faces OUT of the
   figure, where the eye reads the outline. Fixed, not random: random values
   differ between the server and the client and throw a hydration mismatch. */
const SHINE = [
  /* The FIRST entry on each circle is the arc that bounds the centre lens —
     computed, not eyeballed: the bearing from that circle's centre to the three
     circles' centroid, which is 90 / -35.4 / -144.6 degrees. Those three arcs
     are what encloses "3X REVENUE IN 60 DAYS", so they carry the biggest and
     brightest pool on the diagram. The rest sit on the outward-facing arcs,
     where the eye reads each circle's own outline. */
  { key: "d", c: { cx: 382, cy: 236 }, at: [
      { deg: 90, r: 92, k: 1 },
      { deg: 270, r: 62, k: 0.72 }, { deg: 316, r: 46, k: 0.5 }, { deg: 214, r: 46, k: 0.46 } ] },
  { key: "c", c: { cx: 264, cy: 440 }, at: [
      { deg: -35.4, r: 92, k: 1 },
      { deg: 165, r: 62, k: 0.72 }, { deg: 112, r: 44, k: 0.46 }, { deg: 214, r: 44, k: 0.5 } ] },
  { key: "a", c: { cx: 500, cy: 440 }, at: [
      { deg: -144.6, r: 92, k: 1 },
      { deg: 15, r: 62, k: 0.72 }, { deg: 68, r: 44, k: 0.46 }, { deg: -34, r: 44, k: 0.5 } ] },
];
const W = 764;
const H = 686;

type Sel = string;

export function VennDiagram() {
  /* Starts with NOTHING selected. It used to open on the centre, which was the
     right call when the panel was the only thing under the diagram — an empty
     panel left a hole there. The summary bar now fills that space and states
     the centre's claim permanently, so opening on the centre printed
     "3X REVENUE IN 60 DAYS" twice, once in the bar and once in the panel
     directly beneath it. The panel is for what a tap reveals; the bar is the
     resting state. */
  const [sel, setSel] = useState<Sel | null>(null);

  const pick = (k: string) => setSel(k);
  const keyPick = (k: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(k);
    }
  };

  const region = (k: string, label: string, cls: string) => ({
    className: `vn-region ${cls}${sel === k ? " sel" : ""}`,
    role: "button" as const,
    tabIndex: 0,
    "aria-pressed": sel === k,
    "aria-label": label,
    onClick: () => pick(k),
    onKeyDown: keyPick(k),
  });

  const detail = sel ? getDetail(sel) : null;

  return (
    <div className="cso-venn-wrap">
      <span className="cso-venn-cap">{mechanism.vennInstruction}</span>

      <div className="cso-venn">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="The three parts of the system and what happens where they overlap">
          <defs>
            <clipPath id="vn-clip-d"><circle cx={D.cx} cy={D.cy} r={R} /></clipPath>
            <clipPath id="vn-clip-c"><circle cx={C.cx} cy={C.cy} r={R} /></clipPath>
            <clipPath id="vn-clip-a"><circle cx={A.cx} cy={A.cy} r={R} /></clipPath>

            <mask id="vn-not-d"><rect x="0" y="0" width={W} height={H} fill="#fff" /><circle cx={D.cx} cy={D.cy} r={R} fill="#000" /></mask>
            <mask id="vn-not-c"><rect x="0" y="0" width={W} height={H} fill="#fff" /><circle cx={C.cx} cy={C.cy} r={R} fill="#000" /></mask>
            <mask id="vn-not-a"><rect x="0" y="0" width={W} height={H} fill="#fff" /><circle cx={A.cx} cy={A.cy} r={R} fill="#000" /></mask>
            <mask id="vn-not-ca">
              <rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={C.cx} cy={C.cy} r={R} fill="#000" />
              <circle cx={A.cx} cy={A.cy} r={R} fill="#000" />
            </mask>
            <mask id="vn-not-da">
              <rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={D.cx} cy={D.cy} r={R} fill="#000" />
              <circle cx={A.cx} cy={A.cy} r={R} fill="#000" />
            </mask>
            <mask id="vn-not-dc">
              <rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={D.cx} cy={D.cy} r={R} fill="#000" />
              <circle cx={C.cx} cy={C.cy} r={R} fill="#000" />
            </mask>

            {/* The dotted enclosure is the OUTER SILHOUETTE of the three
                circles, not a circle around them. Each enlarged arc is masked
                by the other two, so only the parts on the outside of the union
                survive and the interior arcs never draw. */}
            <mask id="vn-out-d"><rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={C.cx} cy={C.cy} r={R + OFF} fill="#000" />
              <circle cx={A.cx} cy={A.cy} r={R + OFF} fill="#000" /></mask>
            <mask id="vn-out-c"><rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={D.cx} cy={D.cy} r={R + OFF} fill="#000" />
              <circle cx={A.cx} cy={A.cy} r={R + OFF} fill="#000" /></mask>
            <mask id="vn-out-a"><rect x="0" y="0" width={W} height={H} fill="#fff" />
              <circle cx={D.cx} cy={D.cy} r={R + OFF} fill="#000" />
              <circle cx={C.cx} cy={C.cy} r={R + OFF} fill="#000" /></mask>

            {/* The pools are a radial with a soft shoulder, exactly as on the
                pyramid. Solid-filled circles, even blurred, keep a flat middle
                and read as discs stuck to the arc. */}
            <radialGradient id="vn-pool" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="var(--volt-600)" stopOpacity=".62" />
              <stop offset="45%"  stopColor="var(--volt-600)" stopOpacity=".26" />
              <stop offset="100%" stopColor="var(--volt-600)" stopOpacity="0" />
            </radialGradient>

            {/* THE LIT EDGE, as on the pyramid. The ring is stroked once at
                full strength and then MASKED down to a few pools, so the
                outline's value changes as it travels instead of being lit
                evenly all the way round. Two masks per circle: a wide soft one
                for the falloff and a tight one for the hot core, which is what
                gives it a sharp centre without banding — a stack of dashes
                cannot, because every dash has a hard end. */}
            <radialGradient id="vn-shine" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
              <stop offset="30%"  stopColor="#fff" stopOpacity=".86" />
              <stop offset="55%"  stopColor="#fff" stopOpacity=".52" />
              <stop offset="78%"  stopColor="#fff" stopOpacity=".20" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="vn-shine-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
              <stop offset="40%"  stopColor="#fff" stopOpacity="1" />
              <stop offset="62%"  stopColor="#fff" stopOpacity=".62" />
              <stop offset="82%"  stopColor="#fff" stopOpacity=".22" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            {SHINE.map((g) => (
              <mask key={g.key} id={`vn-shine-${g.key}`} maskUnits="userSpaceOnUse"
                x="0" y="0" width={W} height={H}>
                <rect x="0" y="0" width={W} height={H} fill="#000" />
                {g.at.map((sp, k) => (
                  <circle key={k} r={sp.r} fill="url(#vn-shine)" opacity={sp.k}
                    cx={g.c.cx + R * Math.cos((sp.deg * Math.PI) / 180)}
                    cy={g.c.cy + R * Math.sin((sp.deg * Math.PI) / 180)} />
                ))}
              </mask>
            ))}
            {SHINE.map((g) => (
              <mask key={g.key} id={`vn-core-${g.key}`} maskUnits="userSpaceOnUse"
                x="0" y="0" width={W} height={H}>
                <rect x="0" y="0" width={W} height={H} fill="#000" />
                {g.at.map((sp, k) => (
                  <circle key={k} r={sp.r * 0.4} fill="url(#vn-shine-core)" opacity={sp.k}
                    cx={g.c.cx + R * Math.cos((sp.deg * Math.PI) / 180)}
                    cy={g.c.cy + R * Math.sin((sp.deg * Math.PI) / 180)} />
                ))}
              </mask>
            ))}

            {/* The dotted silhouette's colour CYCLES: volt-200 at each circle's
                0/90/180/270 point, easing to volt-600 between them and back.
                SVG has no conic gradient, so it is done as two passes — a
                volt-600 dotted circle underneath and a volt-300 one on top,
                the top one masked to four soft blobs sitting on the cardinal
                points. Both passes are the same circle with the same dash
                pattern, so their dashes coincide exactly and what changes
                across the ring is only the colour, never the rhythm. */}
            <radialGradient id="vn-card" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
              <stop offset="38%"  stopColor="#fff" stopOpacity=".82" />
              <stop offset="70%"  stopColor="#fff" stopOpacity=".34" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            {[
              { key: "d", c: D }, { key: "c", c: C }, { key: "a", c: A },
            ].map((g) => (
              <mask key={g.key} id={`vn-card-${g.key}`} maskUnits="userSpaceOnUse"
                x="0" y="0" width={W} height={H}>
                <rect x="0" y="0" width={W} height={H} fill="#000" />
                {[0, 90, 180, 270].map((deg) => (
                  <circle key={deg} r="132" fill="url(#vn-card)"
                    cx={g.c.cx + (R + OFF) * Math.cos((deg * Math.PI) / 180)}
                    cy={g.c.cy + (R + OFF) * Math.sin((deg * Math.PI) / 180)} />
                ))}
              </mask>
            ))}

            {/* One blur for the arc glows below, so their bright patches melt
                into the continuous run rather than reading as blobs.

                stdDeviation carries the SPREAD. Widening the stroke instead
                would push a flat slab of colour further in and start reading as
                fill again — the mistake this section already made once. The
                blur reaches roughly 3x its deviation, so 16 throws light about
                48 units inward and the three arcs around the lens now overlap
                well before its middle. */}
            <filter id="vn-soft" x="-25%" y="-25%" width="150%" height="150%"
              colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="16" />
            </filter>

            {/* Rim arcs at r=166, pulled in from 178. The ordinal badges sit
                ON the ring at r=200 and reach 15 units inward, so at r=178 the
                rim text's cap-line ran to y=48.5 while badge 01's bottom edge
                is at y=51 — the label was passing under the badge. At 166 the
                cap-line sits at 60.5 and clears it by 9.5. All three arcs move
                together: the badges on the other two circles sit at the same
                depth, and only one label pulling inward would show.

                Sweep flags are chosen so every label reads in the same
                direction as the client's own diagram. */}
            <path id="vn-rim-d" d="M278.4 106.3 A166 166 0 0 1 485.6 106.3" fill="none" />
            {/* THE PITCH | THE PRICE runs along the BOTTOM of its circle, not
                the left. At 184.8deg to 120deg it swept the 9-to-7 o'clock arc,
                which is exactly where CLOSING and its three items sit, so the
                label ran into them. 160deg to 88deg puts it at 8-to-6 o'clock,
                clear of the copy, and gives 209 units of arc against the ~178
                the label needs. */}
            <path id="vn-rim-c" d="M108.0 496.8 A166 166 0 0 0 269.8 605.9" fill="none" />
            <path id="vn-rim-a" d="M484.1 605.2 A166 166 0 0 0 625.9 331.8" fill="none" />
          </defs>

          {/* The dotted silhouette. Three enlarged arcs, each masked by the
              other two, so what draws is exactly the outline of the whole
              figure — a single circle around it would sit far off the shape at
              the three notches where the circles meet. */}
          <g className="vn-halo">
            {[
              { key: "d", c: D }, { key: "c", c: C }, { key: "a", c: A },
            ].map((g) => (
              <g key={g.key}>
                <circle cx={g.c.cx} cy={g.c.cy} r={R + OFF} mask={`url(#vn-out-${g.key})`} />
                {/* the warm points. Two masks cannot sit on one element, so the
                    cardinal-point mask goes on a wrapper and the silhouette
                    mask stays on the circle. */}
                <g mask={`url(#vn-card-${g.key})`}>
                  <circle className="hot" cx={g.c.cx} cy={g.c.cy} r={R + OFF}
                    mask={`url(#vn-out-${g.key})`} />
                </g>
              </g>
            ))}
          </g>

          {/* ---- the seven regions, painted in one pass ---- */}
          <g clipPath="url(#vn-clip-d)">
            <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-ca)" {...region("d", "Diagnosis", "vn-only")} />
          </g>
          <g clipPath="url(#vn-clip-c)">
            <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-da)" {...region("c", "Closing", "vn-only")} />
          </g>
          <g clipPath="url(#vn-clip-a)">
            <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-dc)" {...region("a", "AI Systems", "vn-only")} />
          </g>

          <g clipPath="url(#vn-clip-d)">
            <g clipPath="url(#vn-clip-c)">
              <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-a)" {...region("dc", "2X price, where diagnosis meets closing", "vn-pair")} />
            </g>
          </g>
          <g clipPath="url(#vn-clip-d)">
            <g clipPath="url(#vn-clip-a)">
              <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-c)" {...region("da", "No leaks, where diagnosis meets AI systems", "vn-pair")} />
            </g>
          </g>
          <g clipPath="url(#vn-clip-c)">
            <g clipPath="url(#vn-clip-a)">
              <rect x="0" y="0" width={W} height={H} mask="url(#vn-not-d)" {...region("ca", "50% close rate, where closing meets AI systems", "vn-pair")} />
            </g>
          </g>
          <g clipPath="url(#vn-clip-d)">
            <g clipPath="url(#vn-clip-c)">
              <g clipPath="url(#vn-clip-a)">
                <rect x="0" y="0" width={W} height={H} {...region("core", "3X revenue in 60 days, where all three meet", "vn-core")} />
              </g>
            </g>
          </g>

          {/* THE INNER GLOW, painted here — under the rings, the shine and the
              ordinals. It had drifted BELOW the ordinals, so it washed straight
              over them and the circle's colour showed through each badge: an
              opaque fill cannot hide what is drawn after it.

              THE INNER GLOW. The circles are not flat washes of colour: each
              arc lights from its own edge inward, and the level varies as it
              travels — a continuous low run with brighter pools at a few points
              along the arc. Same construction as the pyramid: a stroke clipped
              to the inside of its own shape so the band has identical depth all
              the way round, plus radial blobs, blurred together as one group so
              they read as one varying light.

              The blob angles are FIXED and chosen per circle, not random: a
              random pass would differ between the server and the client and
              throw a hydration mismatch. */}
          {[
            { c: D, clip: "vn-clip-d", at: [255, 300, 200] },
            { c: C, clip: "vn-clip-c", at: [140, 195, 95] },
            { c: A, clip: "vn-clip-a", at: [40, 345, 85] },
          ].map((g, gi) => (
            <g key={gi} clipPath={`url(#${g.clip})`} filter="url(#vn-soft)"
               className="vn-glow">
              <circle cx={g.c.cx} cy={g.c.cy} r={R} className="vn-glow-run" />
              {g.at.map((deg, k) => (
                <circle key={k} r={k === 0 ? 54 : 42}
                  cx={g.c.cx + R * Math.cos((deg * Math.PI) / 180)}
                  cy={g.c.cy + R * Math.sin((deg * Math.PI) / 180)}
                  fill="url(#vn-pool)" opacity={k === 0 ? 1 : 0.65} />
              ))}
            </g>
          ))}

          {/* ---- rings, then the lit edge over them ---- */}
          <circle className={`vn-ring${sel === "d" ? " on" : ""}`} cx={D.cx} cy={D.cy} r={R} />
          <circle className={`vn-ring${sel === "c" ? " on" : ""}`} cx={C.cx} cy={C.cy} r={R} />
          <circle className={`vn-ring${sel === "a" ? " on" : ""}`} cx={A.cx} cy={A.cy} r={R} />

          {/* The shine: the same ring stroked again at the SAME width, once for
              the soft halo and once for the hot core, each masked to its pools.
              Same width is the point — a wider pass reads as a glow around the
              ring rather than as the ring itself going bright. */}
          {SHINE.map((g) => (
            <g key={g.key} className="vn-shine">
              <circle cx={g.c.cx} cy={g.c.cy} r={R} className="vn-shine-halo"
                mask={`url(#vn-shine-${g.key})`} />
              <circle cx={g.c.cx} cy={g.c.cy} r={R} className="vn-shine-core"
                mask={`url(#vn-core-${g.key})`} />
            </g>
          ))}

          {/* Each badge sits exactly ON its ring — at the circle's own top,
              leftmost and rightmost point, which are also the three places
              furthest from any overlap.

              Drawn AFTER the rings and the shine, not before. Painted first,
              the ring's own line ran straight across each badge, because a
              filled disc cannot hide something that is drawn on top of it.
              Last in the order, the fill punches a clean hole in the line. */}
          {[
            { n: "01", x: D.cx, y: D.cy - R },
            { n: "02", x: C.cx - R, y: C.cy },
            { n: "03", x: A.cx + R, y: A.cy },
          ].map((b) => (
            <g className="vn-ord" key={b.n}>
              <circle cx={b.x} cy={b.y} r="15" />
              <text x={b.x} y={b.y + 4}>{b.n}</text>
            </g>
          ))}

          {/* ---- type ---- */}
          <g className="vn-txt">
            <text className="vn-rim">
              <textPath href="#vn-rim-d" startOffset="50%" textAnchor="middle">{venn.circles[0].rim}</textPath>
            </text>
            <text className="vn-rim">
              <textPath href="#vn-rim-c" startOffset="50%" textAnchor="middle">{venn.circles[1].rim}</textPath>
            </text>
            <text className="vn-rim">
              <textPath href="#vn-rim-a" startOffset="50%" textAnchor="middle">{venn.circles[2].rim}</textPath>
            </text>

            {/* DIAGNOSIS. The source's own table gives this circle a clipboard
                and check in place of a list, so that is what is drawn. */}
            <g className="vn-icon" transform="translate(382 152)">
              <rect x="-15" y="-19" width="30" height="38" rx="4" />
              <path d="M-7 -19 v-5 h14 v5" />
              <path d="M-8 -4 l4 4 l9 -10" />
              <path d="M-8 9 h16" />
            </g>
            <text className="vn-name" x={382} y={228}>{venn.circles[0].name}</text>

            {/* CLOSING — the same three-bar mark the payoff bar uses, so the
                circle that raises the numbers carries the numbers glyph. */}
            <g className="vn-icon" transform="translate(198 388)">
              <rect x="-14" y="0" width="7" height="12" rx="2" />
              <rect x="-3.5" y="-7" width="7" height="19" rx="2" />
              <rect x="7" y="-14" width="7" height="26" rx="2" />
            </g>
            {/* Shifted 8 right, with the items below it: the arc runs up the
                lower-left, so moving the block away from it buys clearance the
                type sizes alone could not. Still well inside the circle, and
                still short of the overlap with AI SYSTEMS, which starts at
                x=308 at this height. */}
            <text className="vn-name" x={206} y={436}>{venn.circles[1].name}</text>
            {venn.circles[1].items.map((it, i) => (
              <text className="vn-item" key={it} x={212} y={474 + i * 21}>{it}</text>
            ))}

            {/* AI SYSTEMS — a cog: the only circle whose contents run without
                anyone touching them. */}
            <g className="vn-icon" transform="translate(566 388)">
              <circle cx="0" cy="0" r="6.5" />
              <path d="M0 -15 v5 M0 10 v5 M-15 0 h5 M10 0 h5
                       M-10.6 -10.6 l3.5 3.5 M7.1 7.1 l3.5 3.5
                       M10.6 -10.6 l-3.5 3.5 M-7.1 7.1 l-3.5 3.5" />
            </g>
            <text className="vn-name" x={566} y={436}>{venn.circles[2].name}</text>
            {venn.circles[2].items.map((it, i) => (
              <text className="vn-item" key={it} x={560} y={474 + i * 22}>{it}</text>
            ))}

            <text className="vn-pair-label" x={266} y={330}>{venn.overlaps[0].label}</text>
            <text className="vn-pair-label" x={498} y={330}>{venn.overlaps[1].label}</text>
            <text className="vn-pair-label" x={382} y={487} style={{ fontSize: 24, fontFamily: "var(--fh)", letterSpacing: ".03em" }}>50%</text>
            <text className="vn-pair-label" x={382} y={513}>CLOSE RATE</text>

            {/* The centre repeats the payoff bar's own three-bar mark, so the
                lens and the bar below the diagram read as the same claim. */}
            {/* Shifted down 15 from where it sat. The lens runs y 278.5 to 436
                — its top is the upper crossing of the two lower circles, its
                bottom is the lowest point of the top circle — so its centre is
                357.3. The icon-and-two-lines block was centred on 342.5, which
                left it 15 units high in its own space, tight against the top
                arc and loose against the bottom. */}
            <g className="vn-icon vn-icon-core" transform="translate(382 331)">
              <rect x="-11" y="-1" width="6" height="10" rx="1.8" />
              <rect x="-2.5" y="-7" width="6" height="16" rx="1.8" />
              <rect x="6" y="-13" width="6" height="22" rx="1.8" />
            </g>
            <text className="vn-core-label" x={382} y={367}>3X REVENUE</text>
            <text className="vn-core-label" x={382} y={397}>IN 60 DAYS</text>
          </g>
        </svg>
      </div>

      {/* THE SUMMARY BAR. The diagram's payoff, restated once outside it, so a
          reader who does not tap anything still leaves with the claim. Its
          first line is the three circle names joined and its headline is the
          centre's own label — both already in the copy doc; the closing line
          is from the reference render and is flagged in content.ts. */}
      <div className="cso-venn-sum">
        <span className="cso-venn-sum-eyebrow">
          {venn.circles.map((c) => c.name).join(" + ")}
        </span>
        <p className="cso-venn-sum-h">
          <span className="rule" aria-hidden />
          {venn.core.label}
          <span className="rule" aria-hidden />
        </p>
        <span className="cso-venn-sum-note">{mechanism.vennSummary.note}</span>
      </div>

      {/* ---- phone: the same seven regions as a stack ---- */}
      <div className="cso-venn-stack">
        {venn.circles.map((c) => (
          <button
            key={c.key}
            type="button"
            className={sel === c.key ? "sel" : undefined}
            aria-pressed={sel === c.key}
            onClick={() => pick(c.key)}
          >
            {c.name}
            <span className="sub">{c.rim}</span>
          </button>
        ))}
        {venn.overlaps.map((o) => (
          <button
            key={o.key}
            type="button"
            className={sel === o.key ? "sel" : undefined}
            aria-pressed={sel === o.key}
            onClick={() => pick(o.key)}
          >
            {o.label}
            <span className="sub">{o.of.join(" + ")}</span>
          </button>
        ))}
        <button
          type="button"
          className={`core${sel === "core" ? " sel" : ""}`}
          aria-pressed={sel === "core"}
          onClick={() => pick("core")}
        >
          {venn.core.label}
          <span className="sub">{venn.core.of.join(" + ")}</span>
        </button>
      </div>

      {/* reserves its own height, so selecting a region never jolts the page */}
      <div className="cso-venn-panel" aria-live="polite">
        {detail ? (
          <div className="cso-venn-detail">
            <span className="vd-path">{detail.path}</span>
            <h4>{detail.title}</h4>
            {detail.items.length ? (
              <ul className="vd-items">
                {detail.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Reads the selection back off the client's own spec. Nothing is authored. */
function getDetail(sel: Sel) {
  const circle = venn.circles.find((c) => c.key === sel);
  if (circle) return { path: circle.rim, title: circle.name, items: circle.items };
  const pair = venn.overlaps.find((o) => o.key === sel);
  if (pair) return { path: pair.of.join("  +  "), title: pair.label, items: [] as string[] };
  if (sel === "core") {
    return { path: venn.core.of.join("  +  "), title: venn.core.label, items: [] as string[] };
  }
  return null;
}
