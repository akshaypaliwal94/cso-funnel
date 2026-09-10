import type { Metadata } from "next";

import LegalPageLayout from "@/components/LegalPageLayout";
import { Todo } from "@/components/SiteFooter";
import { LEGAL } from "@/lib/legal";
import { PRICE } from "@/lib/offer";

export const metadata: Metadata = {
  title: `Terms and Conditions | ${LEGAL.brand}`,
  description: `The terms that apply when you book the ${PRICE} ${LEGAL.product}.`,
  robots: { index: true, follow: true },
};

/**
 * ⚠️ HOUSE TEMPLATE, adapted to this offer. Needs the client's sign-off.
 *
 * Two things are deliberately NOT here:
 *
 *  · NO DESCRIPTION OF THE 60-DAY INSTALL. This page governs the ₹197
 *    diagnostic call, which is the only thing sold on this site. The four
 *    phases described in the copy source are a separate engagement, sold on
 *    the call, with its own contract. Restating them here would make a ₹197
 *    payment look like it buys them.
 *  · NO RESULTS OR EARNINGS CLAIM, in either direction. Section 7 states that
 *    no outcome is guaranteed, which is the limit; the positive disclaimer
 *    that belongs in the site footer is Akshay's own wording to supply, and it
 *    is a visible [TODO] there until he does.
 *
 * Section 10 (governing law) renders a placeholder, because the client's
 * "Jurisdiction State: Mumbai" names a city and a governing-law clause names a
 * state and a forum. The inference is obvious and it is still an inference, so
 * it is not written.
 */
export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      effectiveDate={LEGAL.effectiveDate}
      intro={`These terms apply when you book or take part in a ${LEGAL.product} with ${LEGAL.entity}. By completing checkout you agree to them.`}
    >
      <h2>1. Who we are</h2>
      <p>
        This service is provided by {LEGAL.entity},{" "}
        <Todo value={LEGAL.address} />. You can reach us at{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> or{" "}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>.
      </p>

      <h2>2. What you are buying</h2>
      <p>
        One 1:1 diagnostic call with {LEGAL.entity}, held online at a time you
        book after payment. The fee is {PRICE}.
      </p>
      <p>
        <strong>
          This fee buys the diagnostic call and nothing else.
        </strong>{" "}
        Any longer engagement discussed on that call is a separate agreement,
        separately priced, and is not included in or promised by this purchase.
      </p>

      <h2>3. Scheduling</h2>
      <ul>
        <li>
          You choose your slot after payment, from the times offered on the
          booking page.
        </li>
        <li>
          We may move a call for reasons outside our control, and will tell you
          as early as possible.
        </li>
        <li>You are responsible for your own internet access and device.</li>
      </ul>

      <h2>4. What you agree to bring</h2>
      <p>
        The call is a diagnosis of your sales process, so it depends on you
        describing your business honestly. We are not responsible for
        conclusions drawn from figures or information you give us that turn out
        to be inaccurate.
      </p>

      <h2>5. Your access</h2>
      <ul>
        <li>The booking is personal to you and must not be resold.</li>
        <li>
          Recording or republishing the call, or any material shared on it, is
          not permitted without written consent.
        </li>
        <li>
          We may end a call and withdraw access for abusive conduct.
        </li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        Any framework, document or material shared with you remains the property
        of {LEGAL.entity}. You get a personal, non-transferable licence to use it
        for your own business.
      </p>

      <h2>7. Results</h2>
      <p>
        Advice given on the call is exactly that: advice. We do not guarantee any
        specific commercial outcome, and results depend on your market, your
        offer, your pricing and what you actually implement afterwards.
      </p>

      <h2>8. Payment and refunds</h2>
      <p>
        Payment is taken at checkout through our payment processor. Refunds are
        governed by our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, our total liability in connection with
        this service is limited to the amount you paid for it. Nothing in these
        terms limits liability that cannot lawfully be limited.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of{" "}
        <Todo value={LEGAL.jurisdiction} /> have exclusive jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        {LEGAL.entity}, <Todo value={LEGAL.address} />.
        <br />
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {" · "}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>
      </p>
    </LegalPageLayout>
  );
}
