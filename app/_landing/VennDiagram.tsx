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
const W = 764;
const H = 686;

type Sel = string;

export function VennDiagram() {
  /* Opens on the centre: the payoff is what the diagram is for, and a panel
     that starts empty either leaves a hole under the diagram or repeats the
     instruction that is already printed above it. Selecting is therefore a
     SWAP, not a toggle: there is no empty state to fall back into. */
  const [sel, setSel] = useState<Sel>("core");

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

  const detail = getDetail(sel);

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

            {/* rim arcs, r=178. Sweep flags are chosen so every label reads in
                the same direction as the client's own diagram. */}
            <path id="vn-rim-d" d="M271 97 A178 178 0 0 1 493 97" fill="none" />
            <path id="vn-rim-c" d="M87 425 A178 178 0 0 0 175 594" fill="none" />
            <path id="vn-rim-a" d="M483 617 A178 178 0 0 0 635 324" fill="none" />
          </defs>

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

          {/* ---- rings ---- */}
          <circle className={`vn-ring${sel === "d" ? " on" : ""}`} cx={D.cx} cy={D.cy} r={R} />
          <circle className={`vn-ring${sel === "c" ? " on" : ""}`} cx={C.cx} cy={C.cy} r={R} />
          <circle className={`vn-ring${sel === "a" ? " on" : ""}`} cx={A.cx} cy={A.cy} r={R} />

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

            <text className="vn-name" x={198} y={436}>{venn.circles[1].name}</text>
            {venn.circles[1].items.map((it, i) => (
              <text className="vn-item" key={it} x={204} y={474 + i * 22}>{it}</text>
            ))}

            <text className="vn-name" x={566} y={436}>{venn.circles[2].name}</text>
            {venn.circles[2].items.map((it, i) => (
              <text className="vn-item" key={it} x={560} y={474 + i * 22}>{it}</text>
            ))}

            <text className="vn-pair-label" x={266} y={330}>{venn.overlaps[0].label}</text>
            <text className="vn-pair-label" x={498} y={330}>{venn.overlaps[1].label}</text>
            <text className="vn-pair-label" x={382} y={487} style={{ fontSize: 24, fontFamily: "var(--fh)", letterSpacing: ".03em" }}>50%</text>
            <text className="vn-pair-label" x={382} y={513}>CLOSE RATE</text>

            <text className="vn-core-label" x={382} y={352}>3X REVENUE</text>
            <text className="vn-core-label" x={382} y={382}>IN 60 DAYS</text>
          </g>
        </svg>
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
