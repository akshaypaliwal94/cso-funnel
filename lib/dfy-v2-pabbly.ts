import { CHECKOUT_CONFIG } from "@/lib/checkout-config";
import { originOnly, sha256Hex } from "@/lib/meta-capi";
import type { OrderContext } from "@/lib/order-notes";

/**
 * The /dfy-v2 sale, posted to the same Pabbly webhook TGO-Marketing's dfy-v2
 * used (DFY_V2_PABBLY_WEBHOOK_URL), with the same 34 keys in the same order and
 * the same derivations. Pabbly builds its field mapper from the first payload
 * it sees, so every key goes on every call, empty or not.
 */

/** ≤ ₹1 is a QA payment: sent to Pabbly with is_test, never to Meta. */
const TEST_MAX_PAISE = 100;

type PaymentEntity = {
  id?: unknown;
  order_id?: unknown;
  amount?: unknown;
  currency?: unknown;
  created_at?: unknown;
};

export function isTestPayment(payment: PaymentEntity): boolean {
  return Number(payment.amount ?? 0) <= TEST_MAX_PAISE;
}

export function buildDfyV2PabblyPayload(
  payment: PaymentEntity,
  notes: Record<string, unknown>,
  ctx: OrderContext,
) {
  const paymentId = String(payment.id ?? "");
  const amountPaise = Number(payment.amount ?? 0) || CHECKOUT_CONFIG.amountPaise;
  const amountRupees = Math.round(amountPaise / 100);
  const isTest = amountPaise <= TEST_MAX_PAISE;
  const currency =
    typeof payment.currency === "string" && payment.currency
      ? payment.currency
      : "INR";
  const createdSec = Number(payment.created_at ?? 0);
  const createdAtIso = (createdSec ? new Date(createdSec * 1000) : new Date()).toISOString();

  // The form's values, as TGO's payload used.
  const firstName = ctx.firstName;
  const lastName = ctx.lastName;
  const email = String(notes.email ?? "");
  const dialCode = ctx.dialCode;
  const phoneDigits = String(notes.phone ?? "").replace(/\D/g, "");
  const dialDigits = dialCode.replace(/\D/g, "");
  const national =
    dialDigits && phoneDigits.startsWith(dialDigits)
      ? phoneDigits.slice(dialDigits.length)
      : phoneDigits;

  return {
    lead_id: paymentId,
    created_at: createdAtIso,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: `${dialCode}${national}`,
    city: ctx.city,
    dial_code: dialCode,
    country_code: (ctx.country || "in").toUpperCase(),
    type: "purchase",
    fbc: ctx.fbc,
    fbp: ctx.fbp,
    client_ip_address: ctx.clientIp,
    client_user_agent: ctx.clientUserAgent,
    external_id: email ? sha256Hex(email.trim().toLowerCase()) : "",
    event_source_url: `${originOnly(CHECKOUT_CONFIG.fallbackEventSourceUrl)}/dfy-v2/checkout`,
    amount: isTest ? 0 : amountRupees,
    // A real boolean: a Pabbly router reads the string "false" as true.
    is_test: isTest,
    purchase_event_id: paymentId,
    utm_source: ctx.utmSource,
    utm_medium: ctx.utmMedium,
    utm_campaign: ctx.utmCampaign,
    utm_content: ctx.utmContent,
    utm_term: ctx.utmTerm,
    fbclid: ctx.fbclid,
    referrer: ctx.referrer,
    landing_url: ctx.landingUrl,
    event: "purchase",
    payment_id: paymentId,
    order_id: String(payment.order_id ?? ""),
    name: `${firstName} ${lastName}`.trim(),
    currency,
    product: "1:1 Call With Akshay",
    occupation: "",
  };
}

/** Never throws: a Pabbly failure must not fail the webhook into a retry loop. */
export async function sendDfyV2Pabbly(
  payload: ReturnType<typeof buildDfyV2PabblyPayload>,
): Promise<"sent" | "skipped" | "error"> {
  const url = process.env.DFY_V2_PABBLY_WEBHOOK_URL;
  if (!url) {
    console.error("[rzp-webhook] DFY_V2_PABBLY_WEBHOOK_URL not set, Pabbly skipped");
    return "skipped";
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(
      `[rzp-webhook] ${payload.payment_id} Pabbly ${res.ok ? "sent" : "failed"} (${res.status})`,
    );
    return res.ok ? "sent" : "error";
  } catch (e) {
    console.error(`[rzp-webhook] ${payload.payment_id} Pabbly error`, e);
    return "error";
  }
}
