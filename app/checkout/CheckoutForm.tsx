"use client";

import { useState } from "react";
import { cta, site } from "../_landing/content";
import { ArrowGlyph } from "../_landing/sdp";
import { LockGlyph, RefundGlyph } from "./glyphs";

/**
 * THE DETAILS PANEL — the left half of the empirical order-summary checkout
 * (structure-library §10 TRANSACTION · R11).
 *
 * FIELD ORDER is the spec's, read off the live SDP checkout and not re-derived:
 *   notice callout → first | last → email → city → phone with country code →
 *   acknowledgement → full-width CTA + arrow → trust row.
 *
 * The form is UNCONTROLLED on purpose. Every field is `required` and typed, so
 * the browser does the validation the surface needs, and the pay handler
 * receives one plain object instead of a state tree it has to be taught. Less
 * for the LAUNCH half to unpick.
 */

/** The payload the pay handler receives. Exported so LAUNCH can type against it. */
export type CheckoutOrder = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  /** E.164, country code already prefixed. */
  phone: string;
};

const COUNTRY_CODE = "+91";

export function CheckoutForm() {
  const [seam, setSeam] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const order: CheckoutOrder = {
      firstName: String(f.get("firstName") ?? "").trim(),
      lastName: String(f.get("lastName") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      city: String(f.get("city") ?? "").trim(),
      phone: `${COUNTRY_CODE}${String(f.get("phone") ?? "").replace(/\D/g, "")}`,
    };

    /* ==================================================================
       ▼▼▼  PAY HANDLER SEAM — THIS IS THE LAUNCH AGENT'S HALF  ▼▼▼

       Everything above this line is the surface: it collects and validates
       the details and hands you `order`. Everything below is payment, and
       none of it is written here on purpose (no Razorpay, no API route, no
       env, no amount hardcoded anywhere in the UI — the price the visitor
       reads comes from `site.price` in app/_landing/content.ts and the price
       that is CHARGED must come from the server).

       What goes here:
         1. POST `order` to /api/checkout/order → create the Razorpay order
            server-side, amount read from env, never from the client.
         2. Open the Razorpay modal with the returned order_id.
         3. On success: verify the signature server-side, fire the Purchase
            event (Meta CAPI + GA4) with an event_id for dedupe, then send
            the visitor to the booking surface.
         4. UPI users often never return to the page, so the webhook, not
            this handler, is the source of truth for the conversion.

       Until it is wired, this deliberately says so on screen rather than
       failing silently: a checkout whose button does nothing must never look
       finished.
       ▲▲▲  END SEAM  ▲▲▲
       ================================================================== */
    // eslint-disable-next-line no-console
    console.warn("[checkout] pay handler not wired yet. Order collected:", order);
    setSeam(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="co-panel-title">Your details</h2>
      <span className="co-rule" aria-hidden />

      {/* The notice callout, in the position the live SDP checkout puts it:
          the last thing read before the first field. The sentence is the copy
          source's own CTA note, verbatim, and it is stated in full ONCE on
          this surface: the top strip and the summary's seal carry it in three
          words rather than repeating the sentence. */}
      <div className="co-notice">
        <span className="co-ic" aria-hidden>
          <RefundGlyph />
        </span>
        <p>{cta.note}</p>
      </div>

      <div className="co-fields">
        <div className="co-row2">
          <label className="co-field">
            <span className="co-label">
              First name <span className="co-req">*</span>
            </span>
            <input
              className="co-input co-f-first"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Rahul"
              required
            />
          </label>

          <label className="co-field">
            <span className="co-label">
              Last name <span className="co-req">*</span>
            </span>
            <input
              className="co-input co-f-last"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Sharma"
              required
            />
          </label>
        </div>

        <label className="co-field">
          <span className="co-label">
            Email <span className="co-req">*</span>
          </span>
          <input
            className="co-input co-f-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            required
          />
        </label>

        <label className="co-field">
          <span className="co-label">
            City <span className="co-req">*</span>
          </span>
          <input
            className="co-input co-f-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Mumbai"
            required
          />
        </label>

        <label className="co-field">
          <span className="co-label">
            Phone <span className="co-req">*</span>
          </span>
          {/* One control, two pieces. The cut between them is the house
              vertical rule as a background, never a border. */}
          <span className="co-input co-phone">
            <span className="co-phone-cc">{COUNTRY_CODE}</span>
            <span className="co-phone-cut" aria-hidden />
            <input
              className="co-phone-input"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="98765 43210"
              aria-label="Phone number, ten digits"
              required
            />
          </span>
        </label>

        {/* The acknowledgement. It links the two policy pages rather than
            paraphrasing the offer: restating the refund in my own words here
            would be re-voicing the client's promise on the page where it is
            legally load-bearing.

            FLAG: /terms and /refund-policy are the LAUNCH agent's pages and do
            not exist yet, so these two links 404 until that half ships. */}
        <label className="co-ack">
          <input className="co-ack-box" name="ack" type="checkbox" required />
          <span>
            I agree to the <a href="/terms">Terms</a> and the{" "}
            <a href="/refund-policy">Refund Policy</a>.
          </span>
        </label>
      </div>

      {/* ONE focal action. There is no second button anywhere on this route. */}
      <button className="sdp-cta co-pay" type="submit">
        <span className="sdp-cta-main">
          <span className="cta-label">
            Pay <span className="co-pay-price">{site.price}</span> · Book My 1:1
            Diagnostic Call
          </span>
          <span className="arrow">
            <ArrowGlyph />
          </span>
        </span>
      </button>

      {seam ? (
        <p className="co-say" role="status">
          <b>Payment is not connected yet.</b> The details were collected and
          logged to the console. The Razorpay handler goes in the marked seam in{" "}
          <code>app/checkout/CheckoutForm.tsx</code> and is the LAUNCH agent&rsquo;s
          half of this build.
        </p>
      ) : null}

      {/* The row the spec welds under the CTA. R11 puts the payment methods
          here; the risk reversal is already stated above the fields and beside
          the total, and a third verbatim repeat on one screen weakens it.

          FLAG: these four are Razorpay's standard Indian methods. Which ones
          are actually enabled is decided in the gateway config, which is the
          LAUNCH half — if that config restricts them, this row has to follow
          it or the page promises a method the modal does not offer. */}
      <div className="co-methods">
        <span className="co-methods-cap">
          <span className="co-ic" aria-hidden>
            <LockGlyph size={11} />
          </span>
          Pay securely via
        </span>
        <ul className="co-methods-row">
          <li>UPI</li>
          <li>Cards</li>
          <li>Net Banking</li>
          <li>Wallets</li>
        </ul>
      </div>
    </form>
  );
}
