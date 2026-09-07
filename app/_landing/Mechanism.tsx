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

        {/* --- THE ENGINE: the drivers stated, then shown stacking ---------
             Two panels reading left to right: the argument, then the picture
             of it. The pyramid is the same three drivers as the list beside
             it, which is the point — one is the claim, the other is why the
             claim compounds instead of adding. */}
        <div className="cso-engine">
          <article className="sdp-card cso-engine-card" data-sdp-reveal>
            <span className="cso-engine-eyebrow">{mechanism.engineEyebrow}</span>
            <p className="cso-engine-intro">{mechanism.engineIntro}</p>
            {/* Name, then a plain-English gloss. No figure here: the +50%s
                belong to the pyramid beside this, and printing them twice
                would make the panels read as two versions of one claim rather
                than as the claim and the picture of it. */}
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
                </li>
              ))}
            </ul>
            <span className="cso-engine-rule" aria-hidden />
            <p className="cso-multiply">
              {lit(mechanism.multiply, "multiply.", "em-word")}
            </p>
          </article>

          {/* THE PYRAMID — geometry measured off Atul's reference render.
              It is ONE triangle sliced into three bands: every side edge lies
              on the same two lines (slope 0.685 in the reference), which is
              what makes it read as a single pyramid rather than three separate
              trapezoids. Drawn in SVG because the corners are ROUNDED, and a
              clip-path polygon can only give sharp ones — that mismatch is why
              the first attempt did not look like the reference. */}
          <article className="sdp-card cso-pyramid-card" data-sdp-reveal
            style={{ "--d": ".08s" } as React.CSSProperties}>
            <div className="cso-pyramid">
              <svg className="cso-pyr-svg" viewBox="0 0 600 440" aria-hidden
                preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* THE TIER EDGE — the house LIT EDGE, in the volt family.
                      Same language as --rim-edge on every card: near-white
                      volt-100 where the light lands, fading as it descends.

                      It fades by OPACITY, not by hue. Walking the ramp down
                      into volt-600/700 made the top half of every outline
                      silver and the bottom half saturated blue, which reads as
                      two different borders rather than one falling off. The
                      colour now holds in the pale end (50 → 100 → 200 → 300)
                      and only the level drops, which is what light actually
                      does. The shine is brought up throughout: it opens on
                      volt-50, the same near-white the lit edge uses for its
                      nucleus, and the floor at the bottom of each tier lifts
                      from .34 to .58 so the underside stays lit rather than
                      trailing away.

                      It falls DOWNWARD because the reference does too: each
                      tier's top edge measures far brighter than its bottom
                      (tier 2 runs luma 215 to 128, tier 3 168 to 41). In
                      objectBoundingBox units every tier gets its own copy of
                      the ramp instead of sharing one down the whole pyramid. */}
                  <linearGradient id="pyrEdge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="var(--volt-50)"  stopOpacity="1" />
                    <stop offset="22%"  stopColor="var(--volt-100)" stopOpacity=".96" />
                    <stop offset="55%"  stopColor="var(--volt-200)" stopOpacity=".82" />
                    <stop offset="100%" stopColor="var(--volt-300)" stopOpacity=".58" />
                  </linearGradient>

                  {/* THE INNER GLOW — on the edges, but MODULATED, exactly the
                      way the lit edge's own shine is: strong where the edges
                      meet, low along the straight runs between them, never a
                      flat even band. Built from two things blurred together:
                      a faint continuous stroke just inside the outline, and a
                      bloom pooled at each corner point. One colour, volt-600,
                      so only the LEVEL changes as it travels round, never the
                      hue. Alphas are set against that colour's luminance (34,
                      against volt-700's 28), so they come down slightly from
                      the volt-700 values to hold the glow at the same strength
                      rather than brightening it as a side effect. */}
                  <radialGradient id="pyrCorner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="var(--volt-600)" stopOpacity=".74" />
                    <stop offset="45%"  stopColor="var(--volt-600)" stopOpacity=".30" />
                    <stop offset="100%" stopColor="var(--volt-600)" stopOpacity="0" />
                  </radialGradient>
                  {/* The inner run is WEIGHTED DOWNWARD. Each tier sits on the
                      one below it, so its underside is the lit edge and its top
                      edge is in the shadow of the tier above. It still leans
                      downward, but only about half as hard as it did: the
                      bottom stop comes from .52 to .26. The undersides already
                      carry the outline's two brightest flares plus both corner
                      pools, and a strong continuous run underneath them was
                      pooling into a bar rather than reading as glow. The
                      corners are untouched. In objectBoundingBox units each
                      tier gets its own copy of this ramp. */}
                  <linearGradient id="pyrInner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="var(--volt-600)" stopOpacity=".06" />
                    <stop offset="40%"  stopColor="var(--volt-600)" stopOpacity=".13" />
                    <stop offset="100%" stopColor="var(--volt-600)" stopOpacity=".26" />
                  </linearGradient>

                  {/* One blur over the whole glow group, so the low run along
                      the straight edges and the bright pools in the corners
                      melt into a single band whose value rises and falls,
                      rather than reading as a stroke with discs on it. */}
                  <filter id="pyrSoft" x="-25%" y="-25%" width="150%" height="150%"
                    colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="9" />
                  </filter>
                  {TIERS.map((pts, i) => (
                    <clipPath id={`pyrClip${i}`} key={i}>
                      <path d={roundedPath(pts, 13)} />
                    </clipPath>
                  ))}

                  {/* THE SHINE MASK. A single stroke of the outline is
                      painted at full strength and then masked, so the highlight
                      is shaped entirely by a GRADIENT and there is nothing
                      stepped left to see. White shows the stroke, black hides
                      it, and every pool is one radial blob with a smooth
                      falloff.

                      The stops are eased rather than linear: a plain
                      white→transparent radial has its steepest change at the
                      very centre, which still reads as an edge. Holding near
                      white to 30% and easing out through 55/78% puts the fastest
                      part of the change in the middle of the run, where the eye
                      reads it as a highlight rather than as a boundary. */}
                  <radialGradient id="pyrShineBlob" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
                    <stop offset="30%"  stopColor="#fff" stopOpacity=".86" />
                    <stop offset="55%"  stopColor="#fff" stopOpacity=".52" />
                    <stop offset="78%"  stopColor="#fff" stopOpacity=".20" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                  {/* THE CORE. The soft blob above carries the falloff; on its
                      own it has no peak, because a gradient that starts easing
                      immediately never actually reads as bright. This one HOLDS
                      full white across the middle 40% and only then drops, so
                      the run has a hot centre with a fast, still-smooth
                      shoulder. Two layers: sharpness from this, blending from
                      the other. */}
                  {/* A small blur for the outer glow below. It is deliberately
                      the only blurred thing touching the outline: everything
                      else stays hard. */}
                  <filter id="pyrOuter" x="-30%" y="-30%" width="160%" height="160%"
                    colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="3.5" />
                  </filter>

                  <radialGradient id="pyrShineCore" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
                    <stop offset="40%"  stopColor="#fff" stopOpacity="1" />
                    <stop offset="62%"  stopColor="#fff" stopOpacity=".62" />
                    <stop offset="82%"  stopColor="#fff" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                  {TIERS.map((pts, i) => (
                    <mask key={i} id={`pyrShineMask${i}`} maskUnits="userSpaceOnUse"
                      x="0" y="0" width="600" height="440">
                      <rect x="0" y="0" width="600" height="440" fill="#000" />
                      {shineSpots(pts).map((sp, k) => (
                        <circle key={k} cx={sp.x} cy={sp.y} r={sp.r}
                          fill="url(#pyrShineBlob)" opacity={sp.k.toFixed(3)} />
                      ))}
                    </mask>
                  ))}
                  {TIERS.map((pts, i) => (
                    <mask key={i} id={`pyrCoreMask${i}`} maskUnits="userSpaceOnUse"
                      x="0" y="0" width="600" height="440">
                      <rect x="0" y="0" width="600" height="440" fill="#000" />
                      {shineSpots(pts).map((sp, k) => (
                        <circle key={k} cx={sp.x} cy={sp.y} r={sp.r * 0.4}
                          fill="url(#pyrShineCore)" opacity={sp.k.toFixed(3)} />
                      ))}
                    </mask>
                  ))}

                  {/* The apex flare, pulled right down. At r=46 with a .95
                      volt-50 core it sat on the point like a bulb — brighter
                      and far wider than anything else on the shape, and the
                      apex already has the outline's own corner pool on it. This
                      is now a hint that the point is lit, not a light source:
                      r=20 at .40, opening on volt-100 rather than volt-50. */}
                  <radialGradient id="pyrApex" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="var(--volt-100)" stopOpacity=".40" />
                    <stop offset="35%"  stopColor="var(--volt-300)" stopOpacity=".16" />
                    <stop offset="100%" stopColor="var(--volt-500)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {TIERS.map((pts, i) => {
                  const d = roundedPath(pts, 13);
                  return (
                    <g key={i}>
                      {/* No fill: the tier interior sits within a few luma of
                          the page behind it. */}
                      <g clipPath={`url(#pyrClip${i})`} filter="url(#pyrSoft)">
                        {/* the low continuous run along every edge */}
                        <path d={d} fill="none" stroke="url(#pyrInner)"
                          strokeWidth="16" />
                        {/* the pools where the edges meet. Clipped, so each is
                            cut by the shape and reads as light gathering in the
                            angle rather than a disc laid on top of it — and
                            weighted by where the corner sits in its own tier,
                            so the two at the bottom pool brightly and the ones
                            along the top barely show. */}
                        {pts.map(([cx, cy], k) => {
                          const ys = pts.map((q) => q[1]);
                          const lo = Math.min(...ys);
                          const hi = Math.max(...ys);
                          const t = hi === lo ? 1 : (cy - lo) / (hi - lo);
                          return (
                            <circle key={k} cx={cx} cy={cy} r="54"
                              fill="url(#pyrCorner)" opacity={(0.18 + 0.82 * t).toFixed(2)} />
                          );
                        })}
                      </g>

                      {/* A DYNAMIC outer glow, and deliberately almost
                          nothing: a wide, blurred stroke wearing the same shine
                          mask, so light only spills where the outline is
                          actually lit and the dim stretches throw none. Painted
                          before the edge so it sits behind it and cannot soften
                          the line. Opacity .09 — it should register as a hint
                          that the corners are hot, never as a halo. */}
                      <path d={d} fill="none" stroke="var(--volt-400)"
                        strokeWidth="7" strokeLinejoin="round" opacity=".09"
                        filter="url(#pyrOuter)"
                        mask={`url(#pyrShineMask${i})`} />

                      {/* The crisp lit edge, painted last so nothing softens
                          it. 1.6px, up from 1.2: this outline is now the ONLY
                          thing describing the pyramid, since the tiers carry no
                          fill, where a card's 1px border merely edges a panel
                          that is already visible. Still well under the 2.16px
                          it drew before, which read as too heavy. */}
                      <path d={d} fill="none" stroke="url(#pyrEdge)"
                        vectorEffect="non-scaling-stroke" strokeWidth="1.6"
                        strokeLinejoin="round" />

                      {/* THE SHINE, two masked passes over the base edge, BOTH
                          at the border's own 1.6px. That is the point: the
                          shine is the border going bright, not a glow sitting
                          on it. At 3 units the halo rendered 2.7px against a
                          1.6px border, overhanging by half a pixel on each
                          side, and the lit runs read as thick soft bars.
                          Matching the width makes the highlight sharp again;
                          the smoothness comes from the mask, not from spread.

                          First the halo: volt-100, shaped by the eased blob. */}
                      <path d={d} fill="none" stroke="var(--volt-100)"
                        vectorEffect="non-scaling-stroke" strokeWidth="1.6"
                        strokeLinejoin="round"
                        mask={`url(#pyrShineMask${i})`} />

                      {/* the hot core, tighter mask, pure white, pinned to real
                          pixels so it stays a hard line at any viewport */}
                      <path d={d} fill="none" stroke="#fff"
                        vectorEffect="non-scaling-stroke" strokeWidth="1.6"
                        strokeLinejoin="round"
                        mask={`url(#pyrCoreMask${i})`} />

                    </g>
                  );
                })}

                <circle cx="300" cy="7" r="20" fill="url(#pyrApex)" />
              </svg>

              {/* The copy over the shape, laid out exactly as the reference
                  render has it, and the two layouts differ:

                  APEX — everything stacked and centred: icon, label, figure,
                  caption. It has to be, since a triangle has no width to put
                  anything beside anything else.

                  BANDS — the icon sits to the LEFT of a left-aligned label +
                  figure, that row centred as a group.

                  No caption line: each tier is icon, label, figure. The
                  caption strings stay in content.ts as `caption` — they came
                  from the reference render rather than the copy doc, so nothing
                  of the source is lost by not printing them. */}
              {[...mechanism.pyramid].reverse().map((tier, i) => {
                const driver = mechanism.pyramid.length - 1 - i;
                return (
                  <div className={`cso-tier cso-tier-${i + 1}`} key={tier.label}>
                    <div className="cso-tier-row">
                      <span className="cso-tier-ic" aria-hidden>
                        <DriverGlyph i={driver} size={i === 0 ? 19 : 22} />
                      </span>
                      <span className="cso-tier-head">
                        <span className="cso-tier-label">{tier.label}</span>
                        <span className="cso-tier-pct">{tier.pct}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
