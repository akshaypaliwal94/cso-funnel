import { asset } from "./asset-version";
import { brand, hero } from "./content";
import type { ReactNode } from "react";
import { CtaLockup, Wrap } from "./sdp";
import { VSLFrame } from "./VSLFrame";

/**
 * BEAT 1 · HERO / VSL — §8 focal media, the page's heaviest composite.
 *
 * Order follows the locked post-Kunal hero sequence, minus the beats this
 * funnel has no copy for: gate pill, two-tier H1, sub, VSL frame, CTA lockup.
 * No pre-video feature pills, no credibility stat table and no outcome pills,
 * because the source supplies none and inventing them is fabricated proof.
 */
export function Hero() {
  return (
    <section id="top" className="sdp-hero">
      <Wrap className="sdp-hero-inner">
        {/* The client's wordmark, shipped as supplied, small and unrestyled.
            It is a 3D chrome gaming-style lockup and the colour system it sits
            in is flat and disciplined: the two do not sit together comfortably.
            The logo is the client's, so it is flagged in the skin doc rather
            than restyled here. */}
        <img
          className="cso-logo"
          src={asset(brand.logo)}
          width={brand.logoW}
          height={brand.logoH}
          alt="Lead-to-Cash System"
        />

        <div className="sdp-eyebrow-pill">
          <span className="glowdot" aria-hidden />
          <span>{hero.callout}</span>
        </div>

        <h1 className="sdp-h1" data-sdp-reveal style={{ "--d": ".06s" } as React.CSSProperties}>
          <span className="sdp-h1-l1">{litten(hero.headlineL1, hero.headlineL1Lit)}</span>
          <span className="sdp-h1-l2">{hero.headlineL2}</span>
        </h1>

        <p
          className="sdp-sub"
          data-sdp-reveal
          style={{ "--d": ".14s", maxWidth: "820px", fontSize: "16px" } as React.CSSProperties}
        >
          {hero.sub}
        </p>

        <div data-sdp-reveal style={{ "--d": ".20s" } as React.CSSProperties}>
          <VSLFrame />
        </div>

        <div data-sdp-reveal style={{ "--d": ".26s" } as React.CSSProperties}>
          <CtaLockup />
        </div>
      </Wrap>
    </section>
  );
}

/**
 * Wraps each listed token in the headline with the warm accent, in order and
 * first-occurrence only, leaving the sentence itself untouched.
 *
 * Split rather than replace, so nothing is ever re-parsed as markup and a
 * token that appears twice ("3X" also opens line 2 of the maths later) cannot
 * light the wrong one. If a token is not found the sentence still renders
 * whole: the copy can never be damaged by a stale highlight list.
 */
function litten(sentence: string, tokens: readonly string[]): ReactNode[] {
  let rest = sentence;
  const out: ReactNode[] = [];
  tokens.forEach((t, i) => {
    const at = rest.indexOf(t);
    if (at === -1) return;
    out.push(rest.slice(0, at));
    out.push(
      <span className="sdp-lit" key={`${t}-${i}`}>
        {t}
      </span>,
    );
    rest = rest.slice(at + t.length);
  });
  out.push(rest);
  return out;
}
