import { missing, successStories } from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";

/**
 * BEAT 3/4 · PROOF — §6 proof-set crossed with §4 magnitude.
 *
 * What the source actually supplies is three NAMES and two FIGURES: no photos,
 * no video, no quotes, no niche or timeframe beyond what is written. So the
 * right render is the named-result card with the figure lit, not an
 * exhibit-frame or a video card that would need assets nobody has given us.
 *
 * Hardik Dhawal has no figure in the source. His card ships visibly incomplete
 * rather than quietly dropped, because a proof section that hides its own gap
 * is the design version of a fabricated claim.
 *
 * THIS IS THE PAGE'S ONE LIGHT BAND. The client's system states Obsidian is
 * "90% of every screen", so the SDP band rhythm inverts: dark is the ground and
 * a light band is the rare accent, spent once. It is spent HERE because the
 * system's own annotation puts the warm family (Bone, Amber) against
 * "humanity, pricing, proof", and this is the proof beat. The band re-declares
 * the semantic tokens, so the components inside it are unchanged.
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
              <div className="cso-win-name">{s.name}</div>
              {s.result ? (
                <div className="cso-win-figure">{s.result}</div>
              ) : (
                <div className="cso-win-figure" style={{ opacity: 0.5 }}>
                  <span className="cso-ph-tag" style={{ marginBottom: 0 }}>
                    {missing.storyResult.label}
                  </span>
                </div>
              )}
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
