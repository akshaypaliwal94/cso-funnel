import type { Metadata } from "next";
import { asset } from "../_landing/asset-version";
import { brand, cta, site } from "../_landing/content";
import { ArrowGlyph, Wrap } from "../_landing/sdp";
import { CheckoutForm } from "./CheckoutForm";
import { LockGlyph, PersonGlyph, RefundGlyph, ShieldGlyph } from "./glyphs";
import "./checkout.css";

/**
 * CHECKOUT · the transaction surface.
 *
 * SHAPE: structure-library §10 TRANSACTION / §3 ACCUMULATION —
 * "Order-summary checkout" [EMPIRICAL] (R11), composed to the CHECKOUT row of
 * the VSL five-surfaces table: trust strip · two columns, both panels as
 * cards · form panel ↔ summary card with the lit Total · mobile price bar.
 *
 * SKIN: SIGNAL & DEPTH, unchanged. Every box here is the funnel's house box
 * (lit line on ::after, rim stroke, edge wash), every rule is a gradient
 * BACKGROUND rather than a border, and there is no filled voltage panel: the
 * only voltage surface on the page is the pay button.
 *
 * COPY: every word about the offer comes from app/_landing/content.ts. What
 * the empirical spec asks for and this offer has no copy for is LEFT OUT
 * rather than filled in — see the block comment above the summary.
 *
 * NO REVEAL CHOREOGRAPHY. The landing page reveals on scroll; a checkout must
 * be complete the instant it paints, so nothing here is gated on JS at all.
 * The only client code on the route is the form itself.
 */

/**
 * The product name is the CTA LABEL'S OWN WORDS: everything before the price
 * clause, with the imperative dropped. Derived rather than retyped, so if the
 * copy source changes the summary follows it instead of quietly disagreeing
 * with the button the visitor clicked to get here.
 *
 * Declared ABOVE `metadata` because module-scope consts evaluate in order and
 * the metadata object reads it.
 */
const productName = cta.label.split(" - ")[0].replace(/^book\s+your\s+/i, "");

export const metadata: Metadata = {
  title: `Checkout · ${productName}`,
  description: cta.note,
  /* A transaction surface has no business in an index: it is a step, not a
     landing page, and an indexed checkout competes with the funnel that feeds
     it. */
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="co-page">
      {/* ---------------------------------------------------------- top --- */}
      <Wrap>
        <header className="co-top">
          <img
            className="co-top-mark"
            src={asset(brand.logo)}
            width={brand.logoW}
            height={brand.logoH}
            alt="Lead-to-Cash System"
          />
          <a className="co-back" href="/">
            <ArrowGlyph size={13} />
            Back
          </a>
        </header>
      </Wrap>

      {/* --------------------------------------------------- trust strip ---
          Three items, dot separated, each mark in the house icon bed. The
          spec's charcoal band is drawn as a ruled strip instead: a flat fill
          band on a gradient page is the seam this skin exists to remove. */}
      <div className="co-strip">
        <Wrap>
          <div className="co-strip-row">
            <span className="co-strip-item">
              <span className="co-ic" aria-hidden>
                <LockGlyph />
              </span>
              Secure payment
            </span>
            <span className="co-strip-sep" aria-hidden />
            <span className="co-strip-item">
              <span className="co-ic" aria-hidden>
                <RefundGlyph />
              </span>
              100% refundable
            </span>
            <span className="co-strip-sep" aria-hidden />
            <span className="co-strip-item">
              <span className="co-ic" aria-hidden>
                <PersonGlyph />
              </span>
              1:1 with {site.name}
            </span>
          </div>
        </Wrap>
      </div>

      <section className="co-body">
        <Wrap>
          {/* ------------------------------------------------- masthead ---
              Eyebrow and headline only. The source has no checkout-specific
              deck, and the one reassurance sentence it does have (cta.note) is
              spent where it converts hardest: the notice callout directly
              above the first field. Saying it twice on one screen would weaken
              it, and writing a second line here would be putting words in the
              client's mouth on the page that takes money. */}
          <div className="sdp-head co-head">
            <div className="sdp-eyebrow center">Secure checkout</div>
            <h1 className="co-h1">{productName}</h1>
          </div>

          {/* ------------------------------------------- mobile price bar ---
              The summary, collapsed. Below 900px the number is on screen
              before the first keystroke; the full card still follows the
              form. */}
          <div className="co-panel co-pricebar">
            <span className="co-pricebar-l">
              <span className="co-pricebar-name">{productName}</span>
              <span className="co-pricebar-note">100% refundable</span>
            </span>
            <span className="co-pricebar-fig">{site.price}</span>
          </div>

          <div className="co-grid">
            {/* ------------------------------------------- details panel --- */}
            <div className="co-panel co-form-panel">
              <CheckoutForm />
            </div>

            {/* ------------------------------------------- order summary ---
                WHAT IS DELIBERATELY NOT HERE, and why. The empirical spec's
                summary card carries an event pill, a ticked value stack, and a
                was / now / SAVE badge. This offer supports none of the three
                and each was left out rather than invented:

                  · EVENT PILL — there is no date. The call is booked after
                    payment, on the booking surface; a pill here would have to
                    state a date nobody has set.
                  · VALUE STACK — the source states no deliverables for the
                    ₹197 call and no per-item values. The four phases in the
                    copy doc describe the 60-day install, which is NOT what
                    this ₹197 buys, so borrowing those bullets would overstate
                    the purchase at the exact moment it is being made. The
                    ledger therefore carries the one thing being bought.
                  · WAS / NOW / SAVE — there is no anchor price. This funnel
                    sells one ₹197 refundable diagnostic call and nothing else,
                    so there is nothing to strike through.

                What remains is the honest shape: the product named once, the
                Total as the lit value-moment, the refund seal, and who
                delivers it. */}
            <aside className="co-panel co-summary">
              <h2 className="co-panel-title">Order summary</h2>
              <span className="co-rule" aria-hidden />

              <div className="co-sum-product">
                <span className="co-sum-by">Lead-to-Cash System</span>
                <h3 className="co-sum-name">{productName}</h3>
              </div>

              {/* THE LEDGER COLLAPSES. With one line item and no per-item
                  value copy, a ticked "what's included" row would print the
                  product name a second time forty pixels under itself and the
                  same figure twice — a ledger of one is not a ledger. So the
                  product IS the line item and the next thing on the card is
                  what it costs. When the source supplies what the call
                  includes, the rows go back in here, between these two rules,
                  and nothing else on the card moves. */}
              <span className="co-rule quiet" aria-hidden />

              {/* THE VALUE-MOMENT (C3). The one lit figure in the panel. */}
              <div className="co-total">
                <span className="co-total-l">Total payable</span>
                <span className="co-total-fig">{site.price}</span>
              </div>

              <div className="co-seal">
                <span className="co-ic" aria-hidden>
                  <ShieldGlyph size={12} />
                </span>
                {/* The guarantee line, in the CTA label's own three words. The
                    full sentence (cta.note) is stated once, in the form's
                    notice callout: repeating a risk reversal verbatim in two
                    columns of one screen weakens it. */}
                <p>{site.price} · 100% refundable</p>
              </div>

              <span className="co-rule quiet" aria-hidden />

              {/* Who delivers it. A small box: the house stroke, no top line
                  and no halo. */}
              <div className="co-deliver">
                <img
                  className="co-deliver-face"
                  src={asset(brand.portrait)}
                  width={brand.portraitW}
                  height={brand.portraitH}
                  alt={site.name}
                  loading="lazy"
                />
                <span className="co-deliver-txt">
                  <span className="co-deliver-name">{site.name}</span>
                  <span className="co-deliver-role">{site.role}</span>
                </span>
              </div>
            </aside>
          </div>
        </Wrap>
      </section>

      {/* --------------------------------------------------------- foot ---
          The identity line only. The compliance footer Razorpay's merchant
          review looks for (registered name, full postal address, phone, email
          + the three legal links) is the LAUNCH agent's, and none of those
          four facts exists in content.ts. Inventing an address on a payment
          page is the one thing a checkout must never do. */}
      <footer className="co-foot">
        <Wrap>
          <div className="co-foot-line">
            <span>{site.name}</span>
            <span className="star" aria-hidden>
              ✦
            </span>
            <span>{site.role}</span>
            <span className="star" aria-hidden>
              ✦
            </span>
            <span>{site.price} diagnostic call</span>
          </div>
        </Wrap>
      </footer>
    </main>
  );
}
