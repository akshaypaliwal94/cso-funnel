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

/* The attention mark for the disqualifier bar. Same house line style as the
   three box glyphs: 24x24 viewBox, currentColor, 1.9 stroke, round caps and
   joins. A hexagon rather than a triangle: a triangle is a hazard sign and
   this is a boundary, not a warning.

   52px, which is the height of the two lines of copy beside it (16.5px at 1.5
   leading, twice, plus the 4px between them). The mark and the copy block are
   the same object height, so the rule between them spans both cleanly. */
function AlertGlyph({ size = 52 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.6l8.1 4.7v9.4L12 21.4 3.9 16.7V7.3z" />
      <path d="M12 8v5" />
      <path d="M12 16.4h.01" />
    </svg>
  );
}

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

        {/* The disqualifier. It sits under the three boxes because it only
            makes sense after them: the boxes say who this is for, this says
            who it is not. Its own lit edge ties it to them without making it a
            fourth box in the row. */}
        <aside className="fit-note" data-sdp-reveal style={{ "--d": ".24s" } as React.CSSProperties}>
          <span className="fit-note-ic" aria-hidden>
            <AlertGlyph />
          </span>
          <span className="fit-note-rule" aria-hidden />
          <p className="fit-note-copy">
            <span className="fit-note-lead">{forYouIf.note.lead}</span>
            <span className="fit-note-turn">{forYouIf.note.turn}</span>
          </p>
        </aside>

        {/* The same lockup the hero runs, unchanged. It is the repeating atom
            of this page: every other beat closes on it, and this was the one
            that did not. It lands AFTER the disqualifier, not before, so the
            reader has already checked themselves against both the three boxes
            and the exclusion before they are asked to act. */}
        <div data-sdp-reveal style={{ "--d": ".30s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
