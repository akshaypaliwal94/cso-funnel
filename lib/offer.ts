/**
 * THE SINGLE SOURCE FOR THE PRICE.
 *
 * One number sets three things that must never disagree: the label the visitor
 * reads on the page, the amount Razorpay actually charges, and the `value` on
 * every Meta event. Two sources drift, and the drift is invisible until the
 * charge and the label disagree on a live page.
 *
 * WHY THIS FILE IS IN lib/ AND NOT app/_landing/offer.ts. The build bible puts
 * it in app/_landing/. On this project app/_landing/ is the landing page's own
 * territory and app/_landing/content.ts is already the single source for every
 * string on the page, so the numeric price lives here and content.ts imports
 * `PRICE` for its `site.price`. There is still exactly ONE declaration of the
 * number, which is the whole point of the law. The only edit made to content.ts
 * was that one import.
 *
 * THE GUARD IS ON A POSITIVE NUMBER, never on null. `??` does not catch an
 * empty string, and .env.example ships every key blank, so a copied-but-
 * unfilled .env.local gives Number('') === 0: a page advertising a zero price
 * and a Razorpay order for zero paise, with nothing throwing anywhere.
 *
 * The fallback is 197, which is the price the live copy source states.
 */
const RAW = Number(process.env.NEXT_PUBLIC_PRICE_RUPEES);

export const PRICE_RUPEES = Number.isFinite(RAW) && RAW > 0 ? RAW : 197;
export const PRICE_PAISE = PRICE_RUPEES * 100;
export const PRICE = `₹${PRICE_RUPEES.toLocaleString("en-IN")}`;

export const CURRENCY = "INR";

/**
 * What the buyer is buying, in the plainest words the copy source uses for it.
 *
 * Used for the Razorpay payment sheet's description and for the legal pages.
 * It is deliberately NOT sent to Meta: see the classification note at the top
 * of lib/meta-capi.ts. custom_data carries no product string on any event.
 */
export const PRODUCT_NAME = "1:1 Diagnostic Call";

/** Where the pay button sends the buyer once the payment is captured. */
/* WHERE A PAYMENT LANDS. Changed 2026-09-10 (Atul): the buyer now goes to the
   booking step, and Cal hands them on to the confirmation once they have a
   slot. A confirmation page that ends in homework is where people drop.

     /checkout -> PAYMENT -> BOOK_HREF -> BOOKING -> THANK_YOU_HREF  */
export const BOOK_HREF = "/book-a-call";
export const THANK_YOU_HREF = "/thank-you";
