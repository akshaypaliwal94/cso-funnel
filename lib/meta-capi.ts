import crypto from "crypto";

/**
 * Meta Conversions API primitives, shared by every server-side event route.
 *
 * STANDARD EVENT NAMES ONLY. A custom event cannot be an Aggregated Event
 * Measurement priority event, does not populate Meta's standard funnel report,
 * and cannot be optimised against the same way. There is no custom event on
 * this funnel at all: the offer has no qualifying question on the checkout, so
 * there is nothing for a QualifiedLead segment to split on. If the client ever
 * adds one, it goes in the CustomEvent union below and nowhere else.
 *
 * ── Classification hygiene ────────────────────────────────────────────────
 * Meta classifies a dataset into its restricted "Health and wellness
 * condition" category by reading a handful of surfaces, and a restriction,
 * once applied, binds at the ROOT DOMAIN and is not cleanly reversible.
 *
 * This offer is B2B sales consulting, so the intrinsic nature of the product
 * is not the risk here. The risk is the client ROSTER on the landing page,
 * which names an erectile dysfunction expert, a fertility practice, a
 * postpartum specialist and a TRT expert as customers. That is the client's
 * own proof copy and it is not this file's to remove. What this file CAN do is
 * make sure the payload we ourselves send declares nothing, which costs
 * nothing and removes the only two surfaces the code owns:
 *
 *   `custom_data`, value, currency and order_id ONLY. No content_name, no
 *   product string, no category, no UTM, no fbclid. custom_data is NOT hashed
 *   and IS read.
 *
 *   `event_source_url`, reduced to the ORIGIN, server-side. Done here rather
 *   than trusted from the caller, because the caller is a browser posting
 *   window.location.href, which is precisely the value with the path and the
 *   fbclid on it.
 *
 * `user_data` is untouched and stays MAXIMAL. It is all SHA-256 hashed, it is
 * what EMQ is scored on, and it declares nothing about the offer. Hygiene
 * means removing description, never removing matching.
 */

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

/**
 * Strip an event_source_url to its origin. Falls back to the raw string only
 * if it will not parse: a malformed url is not a leak.
 */
export function originOnly(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

/** Meta's standard events. Nothing outside this union is sendable. */
export type StandardEvent =
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

/**
 * Custom events, kept as a closed union for the same reason the standard ones
 * are: a free-form string is how an unreviewed term eventually reaches Meta as
 * an event name, and the event name is one of the surfaces a dataset is
 * classified on.
 *
 * EMPTY ON PURPOSE. `never` means the compiler rejects every custom event
 * until someone widens this type, which is a review. The Kaizen funnel's
 * QualifiedLead exists because that checkout asks a qualifying question; this
 * one asks none, and a custom event with nothing to segment on is a wasted
 * Aggregated Event Measurement slot on iOS, where standard events rank first.
 */
export type CustomEvent = never;

export type SendableEvent = StandardEvent | CustomEvent;

export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/* Normalisation rules are Meta's, not ours. Each helper returns undefined for
   an empty field rather than hashing the empty string, which would otherwise
   ship a hash that matches every other empty field. */
export function hashEmail(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashPhone(v: string) {
  const s = v.replace(/\D/g, ""); // E.164 without the plus
  return s ? sha256Hex(s) : undefined;
}
export function hashName(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashCountry(v: string) {
  const s = v.trim().toLowerCase(); // ISO 3166-1 alpha-2
  return s ? sha256Hex(s) : undefined;
}

/* City: lowercase, and strip spaces and punctuation entirely. Meta's own
   normalisation removes them, so "New Delhi" and "newdelhi" must hash to the
   same value or the match is silently lost. */
export function hashCity(v: string) {
  const s = v.trim().toLowerCase().replace(/[^a-z]/g, "");
  return s ? sha256Hex(s) : undefined;
}

export type UserSignals = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  externalId?: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

function buildUserData(u: UserSignals) {
  return {
    ...(u.email && { em: [hashEmail(u.email)!] }),
    ...(u.phone && { ph: [hashPhone(u.phone)!] }),
    ...(u.firstName && { fn: [hashName(u.firstName)!] }),
    ...(u.lastName && { ln: [hashName(u.lastName)!] }),
    ...(u.country && { country: [hashCountry(u.country)!] }),
    ...(u.city && { ct: [hashCity(u.city)!] }),
    ...(u.externalId && { external_id: [sha256Hex(u.externalId)] }),
    ...(u.fbc && { fbc: u.fbc }),
    ...(u.fbp && { fbp: u.fbp }),
    ...(u.clientIp && { client_ip_address: u.clientIp }),
    ...(u.clientUserAgent && { client_user_agent: u.clientUserAgent }),
  };
}

/**
 * One event, one POST. Returns Meta's response so routes can log it; never
 * throws into a request, because a failed analytics call must not fail a
 * payment or a page.
 */
export async function sendCapiEvent(params: {
  pixelId: string;
  accessToken: string;
  eventName: SendableEvent;
  eventId: string;
  eventSourceUrl: string;
  user: UserSignals;
  valueRupees: number;
  currency: string;
  /* An opaque Razorpay id. It says nothing about what was bought, and Meta
     uses it for its own deduplication of a purchase across sources. */
  orderId?: string;
  testEventCode?: string;
}): Promise<{ ok: boolean; status: number; body: unknown }> {
  const body = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: originOnly(params.eventSourceUrl),
        action_source: "website",
        user_data: buildUserData(params.user),
        /* Nothing may be added here without the same review these three got.
           See the classification note at the top of this file: every key below
           is a number or an opaque id, and that is the property that keeps
           this dataset unclassified. */
        custom_data: {
          currency: params.currency,
          value: params.valueRupees,
          ...(params.orderId && { order_id: params.orderId }),
        },
      },
    ],
    ...(params.testEventCode && { test_event_code: params.testEventCode }),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${params.pixelId}/events?access_token=${params.accessToken}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    return { ok: res.ok, status: res.status, body: await res.json() };
  } catch (e) {
    return { ok: false, status: 0, body: String(e) };
  }
}
