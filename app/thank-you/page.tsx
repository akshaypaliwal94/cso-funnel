import type { Metadata } from "next";

import { brand, cta, site } from "../_landing/content";
import { CheckGlyph, Wrap } from "../_landing/sdp";
import { VSLFrame } from "../_landing/VSLFrame";
import SiteFooter from "@/components/SiteFooter";
import { LEGAL } from "@/lib/legal";
import { PRICE } from "@/lib/offer";

import "./thank-you.css";

/**
 * /thank-you: the page the buyer lands on after Razorpay captures the ₹197.
 *
 * ── WHAT THIS PAGE DOES NOT DO ────────────────────────────────────────────
 *
 * IT FIRES NO ANALYTICS AT ALL, and that is correct rather than an omission.
 * Meta's Purchase comes from the Razorpay webhook, because a UPI payer often
 * finishes inside their bank app and never reaches this page, so a Purchase
 * fired here would miss most Indian buyers and double-count the rest. There is
 * no GA4 on this project, so there is no browser purchase event to fire either.
 * The pixel's PageView still fires from the layout, as it does everywhere.
 *
 * IT MAKES NO CLAIM ABOUT THE CALL. The copy source describes what the 60-day
 * install contains, not what the ₹197 diagnostic call contains, and there is no
 * client-supplied post-purchase copy anywhere. So this page states only what is
 * verifiable: the payment landed, here is the reference, here is the one thing
 * to do next, here is how to reach a human. The single sentence of persuasion
 * on it is `cta.note`, the client's own words, verbatim from content.ts.
 *
 * ── REPOSITIONED 2026-09-10 (Atul) ────────────────────────────────────────
 * This used to be the page straight after payment, and its job was to hand
 * the buyer a booking link and ask them to go and book somewhere else. The
 * flow is now:
 *
 *   /checkout -> PAYMENT -> /book-a-call -> BOOKING -> here
 *
 * So by the time anyone lands here they have paid AND booked. The booking
 * link and NEXT_PUBLIC_BOOKING_URL are gone with the job they existed for: on
 * a page reached only BY booking, a "book your call" button is a bug.
 */


/** Client-supplied 2026-09-10, without the @. */
const IG_HANDLE = "akshaypaliwal";

export const metadata: Metadata = {
  title: `Payment received · ${site.name}`,
  /* A post-purchase page is a step, not a landing page, and an indexed one
     leaks a paid destination into search. */
  robots: { index: false, follow: false },
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { p?: string };
}) {
  /* The Razorpay payment id, put on the url by the checkout's handler. It is
     shown as a reference the buyer can quote, and nothing else reads it: the
     payment was already proven server-side by the webhook's HMAC, so this
     value is display only and is never trusted. */
  const paymentId = typeof searchParams.p === "string" ? searchParams.p.slice(0, 40) : "";

  return (
    <main className="ty-page">
      <section className="ty-body">
        <Wrap>
          <div className="ty-mark" aria-hidden>
            <CheckGlyph size={26} />
          </div>

          <h1 className="ty-h1">Payment received</h1>
          <p className="ty-sub">
            Your {PRICE} diagnostic call with {site.name} is paid for and your
            slot is booked. Two things left before we speak.
          </p>

          <p className="ty-receipt">
            <span>
              Paid <b>{PRICE}</b>
            </span>
            {paymentId ? (
              <span>
                Reference <code>{paymentId}</code>
              </span>
            ) : null}
          </p>

          {/* TWO STEPS, on the shape of step 2 of sanobarsamir.com/book:
              a numbered badge, a required-tag eyebrow, a display heading, then
              the thing itself. */}

          {/* ── 1 · the DM ─────────────────────────────────────────────
              ⚠️ AKSHAY'S INSTAGRAM HANDLE IS NOT ON RECORD anywhere in this
              project. It is a client fact, so it is not invented: while
              IG_HANDLE is empty the step states the blocker at full volume
              rather than rendering a button that goes to a guessed profile.
              Fill IG_HANDLE and the step works. */}
          <div className="ty-card ty-step-card">
            <span className="ty-num" aria-hidden>1</span>
            <span className="ty-tag">Required · Instagram</span>
            <h2 className="ty-card-title">Follow {site.name} and send one DM</h2>

            {IG_HANDLE ? (
              <div className="ty-dm">
                {/* The same portrait the about section runs, so the face a
                    buyer has just read about is the face they are following. */}
                <div className="ty-dm-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.portrait}
                    width={brand.portraitW}
                    height={brand.portraitH}
                    alt={site.name}
                    loading="lazy"
                  />
                  <span className="ty-dm-tag">@{IG_HANDLE}</span>
                </div>
                <div className="ty-dm-copy">
                <p className="ty-card-p">
                  Follow <b>@{IG_HANDLE}</b> and send the message{" "}
                  <em>&ldquo;I have booked&rdquo;</em>. It is how we know you
                  are coming, and it is where the call happens if anything goes
                  wrong with email.
                </p>
                <a
                  className="ty-go"
                  href={`https://instagram.com/${IG_HANDLE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow and send the DM
                </a>
                </div>
              </div>
            ) : (
              <p className="ty-blocked">
                <b>The Instagram handle is not set.</b> This step reads it from{" "}
                <code>IG_HANDLE</code> at the top of{" "}
                <code>app/thank-you/page.tsx</code>. Until it is filled there is
                no profile to send anyone to, so the step shows this instead of
                a button pointing at a guess.
              </p>
            )}
          </div>

          {/* ── 2 · the video ─────────────────────────────────────────── */}
          <div className="ty-card ty-step-card">
            <span className="ty-num" aria-hidden>2</span>
            <span className="ty-tag">Before the call</span>
            <h2 className="ty-card-title">
              Watch the video if you have not already
            </h2>
            <p className="ty-card-p">
              It is the same one from the page you just came through. Thirty
              minutes is short, and the call goes further if you have seen it.
            </p>
            {/* The same component the landing hero runs, so there is one
                source for the film and the frame. */}
            <VSLFrame />
          </div>

          {/* A reachable human. The phone number was removed on 2026-09-10
              (Atul); email only. LEGAL.phone still renders on the three policy
              pages, so the site has not lost a contact route. */}
          <p className="ty-help">
            If anything looks wrong, email{" "}
            <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and quote the
            reference above.
          </p>

          {/* The client's own reassurance sentence, verbatim, in an attention
              box (Atul). It is a note about the money rather than a line of
              page copy, so it is framed as one and not left to read as a
              trailing sentence. */}
          <aside className="ty-note">
            <span className="ty-note-ic" aria-hidden>
              <CheckGlyph size={14} />
            </span>
            <p>{cta.note}</p>
          </aside>
        </Wrap>
      </section>

      <SiteFooter />
    </main>
  );
}
