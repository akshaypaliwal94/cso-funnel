import { asset } from "./asset-version";
import { brand, hero, site } from "./content";
import { CtaLockup, Wrap } from "./sdp";

/**
 * BEAT 11 · FINAL CTA — the closing peak, formatted lean: wordmark, eyebrow,
 * identity headline, CTA lockup, centred colophon. No dense body paragraphs and
 * no legal wall (the legal pages are the LAUNCH agent's).
 *
 * On a dark-first page the finale cannot be "the dark band" any more, because
 * every band is dark. So it earns its peak by DEPTH instead: the Abyss floor,
 * the two mesh blooms, the lit top seam. It is the deepest point on the page,
 * which is the same argument the light-first version made in reverse.
 *
 * The closing headline is the hero's own headline, repeated verbatim. A funnel
 * finale normally gets its own closing line, but no closing copy was supplied,
 * and writing one here would be putting words in the client's mouth at the
 * single highest-stakes moment on the page. Repeating the promise the visitor
 * arrived on is the honest version.
 */
export function FinalCta() {
  return (
    <section className="cso-finale" id="apply">
      <Wrap className="cso-finale-inner">
        <img
          className="cso-colophon-mark"
          src={asset(brand.logo)}
          width={brand.logoW}
          height={brand.logoH}
          alt="Lead-to-Cash System"
          loading="lazy"
        />

        <div className="sdp-eyebrow center">The next step</div>

        <h2 className="sdp-h2" style={{ marginBottom: "10px" }}>
          {hero.headlineL1}
        </h2>
        <p className="sdp-sub" style={{ marginBottom: "18px" }}>
          {hero.headlineL2}
        </p>

        <CtaLockup />

        <div className="cso-colophon">
          <div className="cso-colophon-line">
            <span>{site.name}</span>
            <span className="star" aria-hidden>
              ✦
            </span>
            <span>{site.role}</span>
            <span className="star" aria-hidden>
              ✦
            </span>
            <span>{site.price} diagnostic call</span>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
