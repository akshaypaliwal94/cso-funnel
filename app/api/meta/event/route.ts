import { NextResponse } from "next/server";

import { CHECKOUT_CONFIG, capiReady } from "@/lib/checkout-config";
import { sendCapiEvent, sha256Hex, type SendableEvent } from "@/lib/meta-capi";

/**
 * One route for the three PRE-PAYMENT events: ViewContent, AddToCart and
 * InitiateCheckout.
 *
 * The allow-list below is what keeps a single public route from becoming a
 * hole: only reviewed names are accepted, and PURCHASE IS EXPLICITLY NOT AMONG
 * THEM. Purchase is only ever sent by the Razorpay webhook, where the payment
 * is proven and the request is signed. Without that exclusion anyone who
 * learns this URL can post a fake sale and teach the ad account to buy the
 * wrong people.
 *
 * The client IP and user agent are read from THIS request's headers, which is
 * the correct source: this is a fetch from the buyer's own browser. The
 * webhook's equivalents have to travel via the order notes, because that
 * request comes from Razorpay. See lib/request-signals.ts.
 */
const ALLOWED: SendableEvent[] = ["ViewContent", "AddToCart", "InitiateCheckout"];

export async function POST(req: Request) {
  if (!capiReady()) {
    return NextResponse.json({ ok: false, reason: "capi-not-configured" });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const eventName = String(body.eventName ?? "") as SendableEvent;
  if (!ALLOWED.includes(eventName)) {
    return NextResponse.json(
      { ok: false, reason: "event-not-allowed" },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email : "";
  const fbp = typeof body.fbp === "string" ? body.fbp : undefined;

  /* Dedup keys, deterministic so Meta's 48h window collapses double-fires: by
     email where we have one, otherwise by the browser's _fbp. */
  const seed = email || fbp || `${Date.now()}_${Math.random()}`;
  const eventId = sha256Hex(`${seed}|${eventName}`);

  const result = await sendCapiEvent({
    pixelId: CHECKOUT_CONFIG.meta.pixelId,
    accessToken: CHECKOUT_CONFIG.meta.accessToken,
    eventName,
    eventId,
    eventSourceUrl:
      (typeof body.eventSourceUrl === "string" && body.eventSourceUrl) ||
      CHECKOUT_CONFIG.fallbackEventSourceUrl,
    user: {
      email: email || undefined,
      phone: typeof body.phone === "string" ? body.phone : undefined,
      firstName: typeof body.firstName === "string" ? body.firstName : undefined,
      lastName: typeof body.lastName === "string" ? body.lastName : undefined,
      /* The checkout takes a +91 number only and validates it as exactly ten
         digits, so India is what the form actually enforces rather than an
         assumption. If a country picker is ever added, this reads it instead. */
      country:
        typeof body.country === "string" && body.country.length === 2
          ? body.country.toLowerCase()
          : "in",
      city: typeof body.city === "string" ? body.city : undefined,
      externalId: typeof body.externalId === "string" ? body.externalId : undefined,
      fbc: typeof body.fbc === "string" ? body.fbc : undefined,
      fbp,
      clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
      clientUserAgent: req.headers.get("user-agent") ?? undefined,
    },
    valueRupees: CHECKOUT_CONFIG.amountRupees,
    currency: CHECKOUT_CONFIG.currency,
    /* No content_name, no UTMs, no order id. These three events happen before
       an order exists, so custom_data carries value and currency alone. See
       the classification note at the top of lib/meta-capi.ts. The UTMs the
       browser still sends in this body are deliberately read for nothing here:
       they reach the sale through Razorpay's notes instead. */
    testEventCode: CHECKOUT_CONFIG.meta.testEventCode || undefined,
  });

  return NextResponse.json({ ok: result.ok, eventName, eventId });
}
