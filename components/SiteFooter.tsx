import { LEGAL } from "@/lib/legal";

import "./site-legal.css";

/**
 * The compliance rail. One component, mounted on the landing page, the
 * checkout, the thank-you page and all three legal pages, so the operator
 * identity and the policy links are present wherever someone lands, including
 * on a checkout they reached straight from an ad.
 *
 * It is deliberately thin. On this funnel the finale is the premium peak and
 * there is no standalone footer competing with it, so this reads as the bottom
 * edge of the page rather than as a second closing beat. See the note at the
 * top of components/site-legal.css.
 *
 * WHAT IT CARRIES AND WHY:
 *
 *  · The registered name, the full postal address, a working phone and a
 *    working email. Razorpay's merchant review looks for these ON THE SITE,
 *    not only inside a policy page.
 *  · The three policy links.
 *  · The disclaimers from lib/legal.ts, VERBATIM. Legal copy is the client's
 *    exact wording, moved rather than written fresh, which is why the earnings
 *    disclaimer is still a visible [TODO] rather than a sentence I invented for
 *    a page that shows revenue multiples.
 */
export default function SiteFooter() {
  return (
    <footer className="cso-legal">
      <div className="cso-legal-inner">
        {/* The operator identity block and the disclaimer note were removed
            on 2026-09-10 (Atul). The footer is now the policy links and the
            copyright line, nothing else.

            NOTHING WAS LOST FROM THE SITE. The registered name, the address,
            the email and the phone all render independently on the privacy,
            terms and refund pages, which is where a gateway reviewer reads
            them, and those pages are linked from every footer. The earnings
            and Meta disclaimers live on the policy pages too. */}

        <nav aria-label="Legal" className="cso-legal-nav">
          <a href="/privacy-policy">Privacy Policy</a>
          <span className="dot" aria-hidden>
            ·
          </span>
          <a href="/terms-and-conditions">Terms and Conditions</a>
          <span className="dot" aria-hidden>
            ·
          </span>
          <a href="/refund-policy">Refund Policy</a>
        </nav>

        <p className="cso-legal-copy">
          © {new Date().getFullYear()} {LEGAL.tradeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/**
 * Renders a legal fact, and renders it LOUD when any part of it is still a
 * placeholder.
 *
 * The build bible's rule is that an unfilled legal value stays visible on the
 * page so it cannot ship unnoticed. This is that rule with a border round it:
 * a `[TODO ...]` marker from lib/legal.ts gets a dashed amber box on a live
 * page, which is impossible to walk past.
 *
 * It splits rather than testing the whole string, because the address is a
 * REAL address with one missing piece ("... Kandivali East, Mumbai [TODO: PIN
 * CODE]"). A whole-string test would leave that one lit as ordinary body text,
 * which is exactly the placeholder most likely to survive to launch.
 */
export function Todo({ value }: { value: string }) {
  const parts = value.split(/(\[TODO[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[TODO") ? (
          <span className="cso-todo" key={i}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
