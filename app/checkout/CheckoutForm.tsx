"use client";

import { useEffect, useRef, useState } from "react";
import { cta, site } from "../_landing/content";
import { ArrowGlyph } from "../_landing/sdp";
import { LockGlyph, RefundGlyph } from "./glyphs";
import { collectSignals } from "@/lib/client-signals";
import { BOOK_HREF, PRODUCT_NAME } from "@/lib/offer";
import { trackAddToCart, trackInitiateCheckout } from "@/lib/track";

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
 * receives one plain object instead of a state tree it has to be taught.
 *
 * ── THE PAY HANDLER (the seam, now filled) ────────────────────────────────
 *
 *   mount   AddToCart to Meta, ref-guarded, arrival only
 *   submit  InitiateCheckout to Meta, then POST /api/razorpay/create-order,
 *           then open the Razorpay sheet
 *   handler navigate to /book-a-call?p=<payment_id> and NOTHING ELSE
 *
 * Two things this handler deliberately does not do:
 *
 *  · It does not fire Purchase. The Razorpay webhook owns that, because a UPI
 *    payer finishes inside their bank app and often never returns to this tab,
 *    and the webhook is the only place a payment is proven rather than merely
 *    attempted.
 *  · It does not send an amount. The server reads the price from lib/offer.ts,
 *    which reads one env var, so the amount charged cannot drift from the
 *    amount printed on the button.
 *
 * WHY THE ROUTE IS /api/razorpay/create-order AND NOT /api/checkout/order,
 * which the original seam comment named: the house layout puts gateway routes
 * under the gateway that owns them, so the webhook sits beside its own
 * create-order and the two are read together.
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
/* The form validates a +91 subscriber number as exactly ten digits, so India
   is what the surface actually enforces, not an assumption about the buyer.
   Sent as the ISO 3166-1 alpha-2 `country` match key, hashed. */
const COUNTRY_ISO = "in";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const RZP_SDK = "https://checkout.razorpay.com/v1/checkout.js";

/* Loaded on demand rather than in the layout: it is roughly 100KB that only
   matters once someone actually presses pay. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RZP_SDK}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const el = document.createElement("script");
    el.src = RZP_SDK;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

/* The payment sheet's accent. It is `--voltage` from PART 1 of globals.css,
   restated as a literal because Razorpay renders the sheet inside its own
   iframe on its own domain, where this project's CSS custom properties do not
   exist. If the token ever changes, change it here in the same pass. */
const RZP_THEME = "#1A0FF5";

export function CheckoutForm() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  /* CHECKOUT ARRIVAL. Meta gets AddToCart, and this is the only place it ever
     fires: not on a landing-page CTA click, which would count a reader who
     tapped two of the page's CTAs twice, and which is not an arrival anyway.

     It is also the ONLY Meta event a DIRECT arrival produces. Someone who
     opens /checkout from an email, a retargeting ad or a bookmark never
     touches the landing page, so without this they are invisible to Meta until
     the pay tap.

     InitiateCheckout deliberately does NOT fire here. It waits for the pay tap
     below: a page-load InitiateCheckout teaches Meta to buy people who land
     rather than people who try to pay.

     Ref-guarded so StrictMode's double effect and a remount cannot inflate the
     count. */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackAddToCart();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const f = new FormData(e.currentTarget);
    const order: CheckoutOrder = {
      firstName: String(f.get("firstName") ?? "").trim(),
      lastName: String(f.get("lastName") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      city: String(f.get("city") ?? "").trim(),
      phone: `${COUNTRY_CODE}${String(f.get("phone") ?? "").replace(/\D/g, "")}`,
    };

    setFailed("");
    setBusy(true);

    /* Meta InitiateCheckout, fired BEFORE the sheet opens rather than after
       payment, because this is the moment intent is real: every field is valid
       (the browser enforced it) and the buyer is committing. */
    trackInitiateCheckout({
      email: order.email,
      /* E.164 without the plus, which is what Meta wants and what the
         create-order route strips to anyway. */
      phone: order.phone.replace(/\D/g, ""),
      firstName: order.firstName,
      lastName: order.lastName,
      city: order.city,
      country: COUNTRY_ISO,
    });

    try {
      const sdk = await loadRazorpay();
      if (!sdk) throw new Error("sdk");

      /* The amount is NEVER sent from here. The server reads it from
         lib/offer.ts, which reads one env var, so the price charged cannot
         drift from the price on the page. */
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...order,
          phone: order.phone.replace(/\D/g, ""),
          country: COUNTRY_ISO,
          ...collectSignals(),
        }),
      });
      const created = await res.json();

      if (!res.ok || !created?.ok) {
        setBusy(false);
        setFailed(
          created?.reason === "not-configured"
            ? "Payments are not switched on yet. Nothing has been charged."
            : "We could not start the payment. Please try again.",
        );
        return;
      }

      const rzp = new window.Razorpay!({
        key: created.keyId,
        order_id: created.orderId,
        amount: created.amount,
        currency: created.currency,
        name: site.name,
        /* ABSOLUTE, not a relative path: Razorpay renders the sheet inside an
           iframe served from its own domain, where "/brand/..." would resolve
           against checkout.razorpay.com and silently 404 into a blank tile. */
        image: `${window.location.origin}/brand/lead-to-cash-logo.png`,
        description: PRODUCT_NAME,
        prefill: {
          name: `${order.firstName} ${order.lastName}`.trim(),
          email: order.email,
          contact: order.phone,
        },
        theme: { color: RZP_THEME },
        modal: { ondismiss: () => setBusy(false) },
        /* PURCHASE IS NOT FIRED HERE. The webhook owns it, so a UPI payer who
           finishes inside their bank app and never returns to this tab is
           still counted. This handler only moves the buyer on. */
        handler: (r: { razorpay_payment_id: string }) => {
          window.location.href = `${BOOK_HREF}?p=${encodeURIComponent(
            r.razorpay_payment_id,
          )}`;
        },
      });
      rzp.open();
    } catch {
      setBusy(false);
      setFailed("We could not start the payment. Please try again.");
    }
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

            Both pages now exist. The Terms href was "/terms" and is now
            "/terms-and-conditions", which is the route that was built. */}
        <label className="co-ack">
          <input className="co-ack-box" name="ack" type="checkbox" required />
          <span>
            I agree to the <a href="/terms-and-conditions">Terms</a> and the{" "}
            <a href="/refund-policy">Refund Policy</a>.
          </span>
        </label>
      </div>

      {/* ONE focal action. There is no second button anywhere on this route.
          The label is unchanged while busy except for the word in front of the
          price, so the button does not resize under the thumb that just tapped
          it; `aria-busy` carries the state to a screen reader. */}
      <button className="sdp-cta co-pay" type="submit" disabled={busy} aria-busy={busy}>
        <span className="sdp-cta-main">
          <span className="cta-label">
            {busy ? "Opening payment" : "Pay"}{" "}
            <span className="co-pay-price">{site.price}</span> · Book My 1:1
            Diagnostic Call
          </span>
          <span className="arrow">
            <ArrowGlyph />
          </span>
        </span>
      </button>

      {/* The failure message. A checkout that cannot take money must say so
          rather than looking finished: the two cases it distinguishes are "the
          gateway is not configured" (nothing was charged, and it is our fault)
          and "the request failed" (try again). */}
      {failed ? (
        <p className="co-say" role="status">
          <b>{failed}</b>
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
