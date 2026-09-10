"use client";

import { collectSignals } from "@/lib/client-signals";

/**
 * The one place a page calls to record something.
 *
 * THE EVENT MAP FOR THIS FUNNEL, in full:
 *
 *   landing page view      ViewContent        FunnelTracker, once per SESSION
 *   checkout arrival       AddToCart          CheckoutForm mount, ref-guarded
 *   pay tap, sheet opening InitiateCheckout   immediately before rzp.open()
 *   payment captured       Purchase           the Razorpay webhook, only
 *
 * There is no GA4 leg anywhere: Atul's scope call for this build is Meta and
 * payments, Clarity for session replay, no Google Analytics. So there is no
 * begin_checkout, no add_payment_info and no browser purchase event, and the
 * thank-you page fires nothing at all.
 *
 * THREE RULES THIS MAP EXISTS TO ENFORCE:
 *
 * 1. AddToCart fires on checkout ARRIVAL, never on a CTA click. The landing
 *    page carries several CTAs, so a click listener counts a reader who tapped
 *    two of them twice, which inflates AddToCart volume and deflates the
 *    cost-per-AddToCart the ads are judged on. A click is also not an arrival.
 *
 * 2. InitiateCheckout fires on INTENT, not on arrival. It waits until the
 *    details are valid and the sheet is opening. A page-load IC teaches Meta to
 *    buy people who land, not people who try to pay.
 *
 * 3. Purchase comes from the webhook, never from the browser. UPI payers do not
 *    return to the tab, so a client-side purchase handler misses most Indian
 *    sales, and the webhook is the only place a payment is proven.
 */

/** Fire and forget: analytics must never block or fail a click. */
function capi(eventName: string, person: Person = {}) {
  const s = collectSignals();
  try {
    void fetch("/api/meta/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventName, ...s, ...person }),
      keepalive: true, // survives the navigation a CTA click causes
    });
  } catch {
    /* ignore */
  }
}

type Person = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  /** ISO 3166-1 alpha-2. The checkout is +91 only, so this is always "in". */
  country?: string;
};

/**
 * Fire once per key. The flag is stamped BEFORE the call, so a rapid
 * double-click or a tab closed mid-navigation still dedupes.
 *
 * SESSION storage, not local. A durable view_item style key would mean a
 * returning visitor produces no ViewContent ever again, which starves the
 * retargeting audience and shrinks the optimisation signal.
 */
function once(key: string, fire: () => void) {
  if (typeof window === "undefined") return;
  const k = `ap_evt_${key}`;
  try {
    if (window.sessionStorage.getItem(k)) return;
    window.sessionStorage.setItem(k, "1");
  } catch {
    /* private mode: fire anyway rather than lose the event */
  }
  fire();
}

/** Landing page: the offer has been seen. Once per session. */
export function trackViewItem() {
  once("view_content", () => {
    capi("ViewContent");
  });
}

/**
 * Checkout ARRIVAL. Named for the Meta event it sends, and it fires from the
 * checkout's own mount. Do not move it onto a CTA click: see rule 1 above.
 *
 * This is also the ONLY Meta event a direct arrival ever produces. Someone who
 * opens /checkout from an email, a retargeting ad or a bookmark never touches
 * the landing page, so without this they are invisible to Meta until the pay
 * tap.
 */
export function trackAddToCart() {
  capi("AddToCart");
}

/** Details valid and the payment sheet is opening. This is the real intent. */
export function trackInitiateCheckout(person: Person) {
  capi("InitiateCheckout", person);
}
