import { forYouIf } from "./content";
import { CheckGlyph, CtaLockup, Wrap } from "./sdp";

/* Three line glyphs, one per box, in the house style: 24x24 viewBox drawn at
   30px, currentColor, 1.9 stroke, round caps and joins, matching ArrowGlyph
   and CheckGlyph. No
   emoji and no icon font (C11).

   Each one states its box rather than decorating it: demand is a rising
   trend, traffic is a funnel with flow entering it, and the missing systems
   are a grid whose fourth cell is drawn dashed, so the gap IS the icon. */
const ICONS = [
  /* DEMAND EXISTS */
  <>
    <path d="M4 17.5l5.2-5.2 3.1 3.1L20 8" />
    <path d="M15.4 8H20v4.6" />
  </>,
  /* TRAFFIC & LEADS EXIST */
  <>
    <path d="M3.5 5h17l-6.6 7.6V19l-3.8 1.8v-8.2z" />
    <path d="M7 2.5h10" />
  </>,
  /* SYSTEMS ARE MISSING */
  <>
    <path d="M4 4h6.2v6.2H4zM13.8 4H20v6.2h-6.2zM4 13.8h6.2V20H4z" />
    <path d="M13.8 13.8H20V20h-6.2z" strokeDasharray="2.6 2.6" />
  </>,
];

function FitIcon({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[i]}
    </svg>
  );
}

/**
 * BEAT 2 · THIS IS FOR YOU IF — §2 contrast, self-recognition.
 *
 * The six qualifying lines are the source's own, unchanged. What changed is
 * that they are GROUPED into three boxes of two rather than run as a single
 * list of six. The grouping is the argument: demand exists, traffic exists,
 * systems do not. A flat list makes six equal complaints; three boxes make one
 * diagnosis with a shape, and the reader can see which box they are standing
 * in.
 *
 * The disqualifier bar that used to close this beat was removed on
 * 2026-09-10 (Atul). Its copy is still in content.ts under `forYouIf.note`,
 * unrendered, so the words are not lost if it is ever wanted back.
 *
 * The masthead is built here rather than through SdpHead because this title
 * carries a lit phrase inside it and the shared component takes a plain
 * string. Everything else about it, the eyebrow rules and the spacing tokens,
 * is the same.
 */
export function ForYouIf() {
  return (
    <section className="sd-section sd-panel" id="fit">
      <Wrap>
        <div className="sdp-head">
          <div className="sdp-eyebrow center">The fit</div>
          <h2 className="sdp-h2">
            {forYouIf.titleLead}{" "}
            <em className="fit-lit">{forYouIf.titleLit}</em>{" "}
            {forYouIf.titleTail}
          </h2>
          <p className="sdp-sub fit-deck">
            {forYouIf.deck.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <div className="fit-grid">
          {forYouIf.boxes.map((box, i) => (
            <article
              key={box.title}
              className="sdp-card fit-box"
              data-sdp-reveal
              style={{ "--d": `${0.06 * i}s` } as React.CSSProperties}
            >
              <div className="fit-box-head">
                <span className="fit-box-ic" aria-hidden>
                  <FitIcon i={i} />
                </span>
                <div>
                  <h3 className="fit-box-title">{box.title}</h3>
                  <p className="fit-box-sub">{box.sub}</p>
                </div>
              </div>
              <span className="fit-box-rule" aria-hidden />
              <ul className="fit-box-points">
                {box.points.map((point) => (
                  <li key={point}>
                    <span className="ck" aria-hidden>
                      <CheckGlyph />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* The same lockup the hero runs, unchanged. It is the repeating atom
            of this page: every other beat closes on it, and this was the one
            that did not. It now follows the three boxes directly: the
            disqualifier bar that used to sit between them was removed on
            2026-09-10 (Atul). */}
        <div data-sdp-reveal style={{ "--d": ".30s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
