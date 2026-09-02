import { asset } from "./asset-version";
import { brand, founderChapters, journey, site } from "./content";
import { CtaLockup, SdpHead, Wrap } from "./sdp";

/**
 * BEAT 5 · FOUNDER — on the ABYSS band (the client's system names Abyss "deep
 * ambient, hero base, footer"; this is the page's deep authority moment, and
 * the supplied portrait was shot on a blue-lit set that lands in the same
 * family).
 *
 * A deliberate call against the blueprint's default. The blueprint marks the
 * founder "My Story" beat as the one reliably-TEXT beat, because it is usually
 * flowing prose. This one is not: the source supplies it as four ordered,
 * titled chapters with a real chronology inside them (2018, then 2020, then the
 * problem it exposed, then the decision). That is a genuine §1 sequence, so it
 * earns the numbered chapter ledger.
 *
 * The blueprint's underlying rule still holds, and it is why this is a LEDGER
 * and not a card grid: the STRUCTURE is the ordering, the BODIES are prose, so
 * the prose is left as full paragraphs. The credential figures inside it
 * ($2 million, nearly 1,000 businesses, ₹15 crore) stay inside the sentences
 * that earned them. Lifting them out into a pill row would print the same
 * claims twice and strip them of the story that makes them credible.
 *
 * The five journey photographs ship UNCAPTIONED and ungraded, framed as
 * documents. The client supplied images and no captions; writing a line under
 * each would be inventing a story around someone else's photographs, and
 * colour-grading them to fit the palette would be editing evidence.
 */
export function Founder() {
  return (
    <section className="sd-section sd-deep" id="about">
      <Wrap>
        <SdpHead eyebrow="The operator" title="Why Should You Listen To Me?" />

        <div className="cso-founder-head">
          <div className="cso-portrait">
            <img
              src={asset(brand.portrait)}
              width={brand.portraitW}
              height={brand.portraitH}
              alt={`${site.name}, ${site.role}`}
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="cso-founder-name">{site.name}</h3>
            <span className="cso-founder-role">{site.role}</span>
          </div>
        </div>

        <div className="cso-chapters">
          {founderChapters.map((c, i) => (
            <article
              className="cso-chapter"
              key={c.n}
              data-sdp-reveal
              style={{ "--d": `${0.05 * i}s` } as React.CSSProperties}
            >
              <span className="sdp-pillar-num" aria-hidden>
                {c.n}
              </span>
              <div>
                <h3>{c.title}</h3>
                {c.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="cso-journey" data-sdp-reveal>
          <span className="cso-journey-cap">2019 → 2023</span>
          <div className="cso-journey-strip">
            {journey.map((src) => (
              <figure className="cso-journey-frame" key={src}>
                <img src={asset(src)} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>

        <div data-sdp-reveal>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}
