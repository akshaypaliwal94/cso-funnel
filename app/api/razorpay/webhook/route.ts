import crypto from "crypto";

import { NextResponse } from "next/server";

import { CHECKOUT_CONFIG, capiReady } from "@/lib/checkout-config";
import { sendCapiEvent } from "@/lib/meta-capi";
import { unpackContext } from "@/lib/order-notes";

/**
 * Razorpay webhook, and on this project it has exactly ONE job left: send
 * Meta's Purchase.
 *
 * On the reference build this route did three things. Two of them are gone by
 * Atul's explicit scope call for this funnel:
 *
 *   · no GA4 Measurement Protocol purchase (no Google Analytics on this
 *     project at all)
 *   · no Pabbly fulfilment hand-off (not wired, and no env var for it)
 *
 * WHAT THAT COSTS, stated plainly rather than left to be discovered: nothing
 * in this codebase now tells anyone that a sale happened. There is no
 * automation leg, so the buyer's onboarding (the booking link, the reminder,
 * the receipt beyond Razorpay's own) is whatever Akshay does manually from the
 * Razorpay dashboard. The five readable note keys written at create-order
 * (kind, lead_id, name, email, phone) exist precisely so that dashboard row is
 * usable by a human. If a fulfilment leg is ever added it goes ABOVE the CAPI
 * guard below, so a missing Meta config can never stop a paying buyer
 * receiving what they bought.
 *
 * PURCHASE IS SENT FROM HERE AND NOWHERE ELSE. A browser-side Purchase would
 * miss every UPI payer who completes inside their bank app and never returns
 * to the tab, which in India is most of them. It is also the only place the
 * payment is proven rather than merely attempted.
 *
 * The signature check is not optional. Without it anyone who learns this URL
 * can post a fake payment and inflate Meta's conversion data, which then
 * teaches the ad account to buy the wrong people.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const secret = CHECKOUT_CONFIG.razorpay.webhookSecret;

  if (!secret) {
    console.error("[rzp-webhook] no webhook secret configured");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  /* Length checked first: timingSafeEqual THROWS on unequal lengths. */
  const valid =
    sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

  if (!valid) {
    console.warn("[rzp-webhook] bad signature, rejected");
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const parsed = JSON.parse(raw);
  if (parsed.event !== "payment.captured") {
    // Razorpay sends many event types; only a captured payment is a Purchase.
    return NextResponse.json({ ok: true, ignored: parsed.event });
  }

  const payment = parsed.payload?.payment?.entity ?? {};
  const notes = payment.notes ?? {};
  const paymentId = String(payment.id ?? "");
  const orderId = String(payment.order_id ?? "");
  const amountRupees = Number(payment.amount ?? 0) / 100;

  const valueRupees = amountRupees || CHECKOUT_CONFIG.amountRupees;

  /* Everything the browser knew, written into the order at create time and
     unpacked here. This is the ONLY route back to the buyer's own IP, user
     agent, campaign and landing page: this request came from Razorpay, so its
     own headers describe Razorpay. */
  const ctx = unpackContext(notes);
  const country = ctx.country || "in";

  /* Razorpay is the authority on email and phone: it holds what the buyer
     actually paid with, which can differ from what they typed into the form. */
  const email = String(payment.email ?? "") || "";
  const phone = String(payment.contact ?? "") || "";

  /* Origin only. event_source_url is metadata rather than a matching signal,
     and sendCapiEvent reduces it again on the way out. */
  const eventSourceUrl = CHECKOUT_CONFIG.fallbackEventSourceUrl;

  if (!capiReady()) {
    console.warn("[rzp-webhook] CAPI not configured, Meta Purchase not sent");
    return NextResponse.json({ ok: true, capi: "skipped" });
  }

  /* event_id is the payment id: unique per payment, and stable if Razorpay
     retries the webhook, so a retry cannot double-count the sale. */
  const result = await sendCapiEvent({
    pixelId: CHECKOUT_CONFIG.meta.pixelId,
    accessToken: CHECKOUT_CONFIG.meta.accessToken,
    eventName: "Purchase",
    eventId: paymentId,
    eventSourceUrl,
    user: {
      email: email || undefined,
      phone: phone || undefined,
      firstName: ctx.firstName || undefined,
      lastName: ctx.lastName || undefined,
      country,
      city: ctx.city || undefined,
      externalId: ctx.externalId || undefined,
      fbc: ctx.fbc || undefined,
      fbp: ctx.fbp || undefined,
      /* Captured from the BUYER's request at create-order and carried here.
         Purchase is the one event where a missing device match costs the most:
         these two are worth roughly a point of EMQ on their own. */
      clientIp: ctx.clientIp || undefined,
      clientUserAgent: ctx.clientUserAgent || undefined,
    },
    valueRupees,
    currency: CHECKOUT_CONFIG.currency,
    /* The ONLY descriptive field Meta receives, and it is opaque. The product
       name and the UTMs are deliberately not sent: custom_data is unhashed and
       is read when a dataset is classified. */
    orderId: orderId || undefined,
    testEventCode: CHECKOUT_CONFIG.meta.testEventCode || undefined,
  });

  console.log(`[rzp-webhook] ${paymentId} Purchase capi=${result.ok}`);
  return NextResponse.json({ ok: true, capi: result.ok ? "sent" : "error" });
}
