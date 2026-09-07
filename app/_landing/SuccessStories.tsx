import type { ReactNode } from "react";
import { asset } from "./asset-version";
import { missing, successStories } from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";

/**
 * BEAT 3/4 · PROOF — §6 proof-set crossed with §4 magnitude.
 *
 * The card anatomy follows Atul's reference render (5 Sep), top to bottom:
 * brand mark, brand name in tracked caps, lit rule, the figure, a one-line
 * description, a category chip, a second lit rule, then two outcome cells
 * split by a vertical rule.
 *
 * What the SOURCE supplies is three names and two figures. Nothing else. So
 * every other slot renders as a named, sized placeholder rather than as
 * invented copy — this is the proof beat, and a fabricated description or
 * outcome here is precisely the claim we must never make. The card shows its
 * full designed shape and tells whoever fills it exactly what goes where.
 *
 * Hardik Dhawal has no figure at all, so his card ships visibly incomplete
 * rather than quietly dropped: a proof section that hides its own gap is the
 * design version of a fabricated claim.
 */
export function SuccessStories() {
  return (
    <section className="sd-section sd-panel" id="results">
      <Wrap>
        <SdpHead eyebrow="Results" title="Success Stories" />
        <div className="cso-wins">
          {successStories.map((s, i) => (
            <article
              className="sdp-card cso-win"
              key={s.name}
              data-sdp-reveal
              style={{ "--d": `${0.06 * i}s` } as React.CSSProperties}
            >
              {/* MARK, on a LIGHT PLATE. That is an asset decision, not a
                  style one: TGO ships as a black wordmark on transparent and
                  is invisible on obsidian, while FM4 and FAB are JPGs with
                  baked white backgrounds that would read as bright white
                  rectangles. A plate is the one treatment all three sit on
                  honestly, with no image editing. When knockout versions
                  (white on transparent) arrive, drop the plate and they sit
                  straight on the card as in the reference. */}
              <div className="cso-win-mark">
                {s.logo ? (
                  <span
                    className="cso-win-plate"
                    /* --logo-h is the file height needed for this mark to
                       render at the shared 40px optical height, after its own
                       built-in white margin is cancelled out. */
                    style={{ "--logo-h": `${(40 / (s.logoTrim ?? 1)).toFixed(1)}px` } as React.CSSProperties}
                  >
                    <img src={asset(s.logo)} alt={s.name} loading="lazy" />
                  </span>
                ) : (
                  <span className="cso-slot cso-slot-mark">{missing.storyLogo.label}</span>
                )}
              </div>

              <div className="cso-win-name">{s.name}</div>

              <span className="cso-win-rule" aria-hidden />

              {/* FIGURE. The source sentence, whole, with its amount lit. */}
              {s.result ? (
                <p className="cso-win-figure">{litFigure(s.result, s.resultLit)}</p>
              ) : (
                <p className="cso-win-figure cso-win-figure-empty">
                  <span className="cso-slot">{missing.storyResult.label}</span>
                </p>
              )}

              {s.desc ? (
                <p className="cso-win-desc">{s.desc}</p>
              ) : (
                <p className="cso-win-desc cso-win-desc-empty">
                  <span className="cso-slot">{missing.storyDesc.label}</span>
                </p>
              )}

              {s.tag ? (
                <span className="cso-win-tag">{s.tag}</span>
              ) : (
                <span className="cso-win-tag cso-win-tag-empty">{missing.storyTag.label}</span>
              )}

              <span className="cso-win-rule" aria-hidden />

              {/* OUTCOME CELLS. Two, split by the vertical cut of the house
                  rule, exactly as in the reference. */}
              <ul className="cso-win-outcomes">
                {(s.outcomes ?? [null, null]).map((o, k) => (
                  <li key={k}>
                    <span className="cso-win-oc-ic" aria-hidden />
                    <span className="cso-win-oc-copy">
                      {o ? (
                        <>
                          <span className="l1">{o.l1}</span>
                          <span className="l2">{o.l2}</span>
                        </>
                      ) : (
                        <span className="cso-slot">{missing.storyOutcomes.label}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div data-sdp-reveal style={{ "--d": ".18s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}

/**
 * Lights the amount inside the sentence, leaving the sentence itself intact
 * and in its original order. Split rather than replace, so nothing is
 * re-parsed as markup; if the token is not found the sentence still renders
 * whole, so the copy can never be damaged by a stale highlight value.
 */
function litFigure(sentence: string, token?: string): ReactNode[] {
  if (!token) return [sentence];
  const at = sentence.indexOf(token);
  if (at === -1) return [sentence];
  return [
    sentence.slice(0, at),
    <span className="cso-win-amount" key="amt">
      {token}
    </span>,
    sentence.slice(at + token.length),
  ];
}
