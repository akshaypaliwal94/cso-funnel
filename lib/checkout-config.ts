import { CURRENCY, PRICE_PAISE, PRICE_RUPEES, PRODUCT_NAME } from "@/lib/offer";

/**
 * Every server-side constant the payment and tracking routes need, in one
 * place. The price comes from lib/offer.ts, which reads it from a single env
 * var, so the amount charged can never drift from the amount displayed.
 */
export const CHECKOUT_CONFIG = {
  amountRupees: PRICE_RUPEES,
  amountPaise: PRICE_PAISE,
  currency: CURRENCY,
  /* Used for the Razorpay payment sheet only. It is deliberately NOT sent to
     Meta: custom_data carries no product string on any event. */
  productName: PRODUCT_NAME,
  /* ⚠️ BLOCKED: the live domain is unknown. This value is sent to Meta as
     event_source_url (reduced to its origin) and is what the thank-you
     redirect and the Razorpay sheet image resolve against, so an unset env var
     would quietly attribute live events to a placeholder host. Fill
     NEXT_PUBLIC_SITE_URL before launch.

     `||`, not `??`. A host that defines the key with a blank value yields an
     empty string, which `??` passes straight through, and an empty
     event_source_url is silently worthless to Meta. */
  fallbackEventSourceUrl:
    (process.env.NEXT_PUBLIC_SITE_URL || "").trim() || "https://example.invalid",
  meta: {
    pixelId: process.env.META_PIXEL_ID ?? "",
    accessToken: process.env.META_CAPI_ACCESS_TOKEN ?? "",
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE ?? "",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
  },
} as const;

/**
 * True only when a real CAPI call can be made. Routes check this and skip
 * quietly rather than posting to Meta with an empty pixel id.
 */
export const capiReady = () =>
  Boolean(CHECKOUT_CONFIG.meta.pixelId && CHECKOUT_CONFIG.meta.accessToken);

/**
 * Whether this deployment is transacting in test mode, derived rather than
 * declared.
 *
 * Razorpay stamps its own environment into the key id (`rzp_test_` versus
 * `rzp_live_`), so this cannot drift out of sync the way a separate IS_TEST
 * env var would when someone swaps the keys and forgets the flag. A Meta test
 * event code is also treated as test, because events sent with one do not
 * count toward optimisation and the sale they describe is not real.
 */
export const isTestMode = () =>
  CHECKOUT_CONFIG.razorpay.keyId.startsWith("rzp_test_") ||
  Boolean(CHECKOUT_CONFIG.meta.testEventCode);
