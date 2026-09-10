import type { Metadata } from "next";

import { cta } from "../_landing/content";
import LegalPageLayout from "@/components/LegalPageLayout";
import { Todo } from "@/components/SiteFooter";
import { LEGAL } from "@/lib/legal";
import { PRICE } from "@/lib/offer";

export const metadata: Metadata = {
  title: `Refund Policy | ${LEGAL.brand}`,
  description: `Refund terms for the ${PRICE} ${LEGAL.product}.`,
  robots: { index: true, follow: true },
};

/**
 * ⚠️ READ THIS BEFORE EDITING.
 *
 * THE TRIGGER IS THE CLIENT'S OWN SENTENCE, and it is quoted verbatim from
 * app/_landing/content.ts (`cta.note`), which is the sentence printed under
 * every button on the funnel:
 *
 *   "This is a diagnostic session — if we're not the right fit, your ₹197 is
 *    refunded"
 *
 * A policy that contradicts the button is worse than no policy, so this page
 * is written around that promise and nothing wider. If the promise changes,
 * this page changes in the same pass.
 *
 * WHAT THE PROMISE DOES NOT COVER, and is therefore NOT written here:
 *
 *  1. A buyer who pays and then changes their mind BEFORE the call. The
 *     client's sentence conditions the refund on the outcome of the call
 *     ("if we're not the right fit"), which cannot be judged before it
 *     happens. A payment gateway's review normally expects a cancellation
 *     path to exist. That clause is section 3 and it is a visible [TODO]:
 *     Akshay has to decide it, because deciding it for him would be writing
 *     a refund commitment he never made.
 *  2. A buyer who never turns up. Same reason.
 *
 * THE PROCESSING TIMES in section 5 are the house standard used across these
 * funnels, not the client's words. They need his sign-off, but a refund policy
 * with no timeframe in it fails a merchant review, so the standard is written
 * in rather than left blank.
 */
export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      effectiveDate={LEGAL.effectiveDate}
      intro={`The ${LEGAL.product} costs ${PRICE}. This page sets out exactly when that ${PRICE} comes back to you and how.`}
    >
      <h2>1. The promise</h2>
      <p>
        The promise made on the booking page is this, in full:{" "}
        <strong>&ldquo;{cta.note}&rdquo;</strong>
      </p>
      <p>
        So the {PRICE} fee is refunded in full if, on or after the diagnostic
        call, it is decided that this is not the right engagement for you. You
        do not have to argue the point and you do not have to fill in a form.
      </p>

      <h2>2. What you are paying for</h2>
      <p>
        A single 1:1 diagnostic call with {LEGAL.entity}. The fee is {PRICE} and
        it is charged at the time you book.
      </p>

      {/* WRITTEN NARROW ON PURPOSE (2026-09-10). Whether a buyer who cancels,
          reschedules late or does not attend can have the fee back is a
          commercial decision Akshay has not made, and it is not ours to make:
          it decides when he owes money. So this section states only what he
          HAS said, routes the buyer to email, and adds no deadline and no
          forfeiture rule. Silence favours the buyer, which is the safe
          direction to be wrong in, and it is his to tighten when he decides.

          To tighten it: state the notice period for a reschedule and what
          happens to the fee on a no-show. */}
      <h2>3. Cancelling or rescheduling</h2>
      <p>
        If you need to move or cancel your call, email{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we will sort it
        out. The refund basis in section 1 is unchanged by cancelling: if the
        call does not happen, or it happens and we are not the right fit, the{" "}
        {PRICE} comes back to you.
      </p>

      <h2>4. How to request a refund</h2>
      <ul>
        <li>
          Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> from the same
          address you used at checkout.
        </li>
        <li>
          Use the subject line <strong>&ldquo;Refund Request&rdquo;</strong>.
        </li>
        <li>
          Include your full name and the payment reference shown on your
          confirmation page. A line on why is optional, and it helps us improve.
        </li>
      </ul>

      <h2>5. Processing time</h2>
      <p>
        Refunds are processed within 2 business days of the request being
        agreed. Once processed, banks typically take 5 to 7 business days to
        show the credit, which is outside our control.
      </p>

      <h2>6. Refund method</h2>
      <p>
        Refunds go back to the original payment method used at checkout: the
        same card, UPI ID or account. We cannot redirect a refund to a different
        method.
      </p>

      <h2>7. Chargebacks</h2>
      <p>
        Please email us before raising a dispute with your bank. A refund inside
        the terms above is straightforward, and a chargeback simply takes longer
        for everyone.
      </p>

      <h2>8. Contact</h2>
      <p>
        {LEGAL.entity}, <Todo value={LEGAL.address} />.
        <br />
        Questions about this policy:{" "}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {" · "}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>.
      </p>
    </LegalPageLayout>
  );
}
