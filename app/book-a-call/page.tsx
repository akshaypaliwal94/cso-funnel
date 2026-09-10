"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "../_landing/content";
import { Wrap } from "../_landing/sdp";
import SiteFooter from "@/components/SiteFooter";
import { PRICE } from "@/lib/offer";
import "./book-a-call.css";

/**
 * THE BOOKING STEP. Sits between the payment and the confirmation:
 *
 *   /checkout -> PAYMENT -> /book-a-call -> BOOKING -> /thank-you
 *
 * Before this existed the thank-you page was the page after payment and its
 * job was to hand the buyer a link and ask them to go and book somewhere else.
 * A confirmation that ends in homework is where people drop, so the booking
 * happens here and the thank-you becomes a real confirmation.
 *
 * ── THE EMBED IS ATUL'S, WITH TWO CHANGES ─────────────────────────────────
 * Namespace, origin, calLink, layout flags and the `bookingSuccessfulV2`
 * action are all his snippet, unchanged. Two things are not:
 *
 *  1. THE REDIRECT TARGET. His snippet sends a successful booking to
 *     `http://akshaypaliwal.com/book-a-call`, which is THIS page: it would
 *     bounce the buyer back to a calendar they have just used. It goes to
 *     /thank-you instead (his correction), and as a relative path, so it
 *     cannot send anyone to `http://` or to the wrong environment.
 *  2. The payment id rides along, so the confirmation can quote a reference.
 *
 * Cal's loader defines window.Cal as a QUEUE and appends its own script, so
 * nothing here waits on an onload: calls made before the script lands are
 * replayed when it arrives.
 */

/* Client-supplied 2026-09-10. Constants, not env vars: NEXT_PUBLIC_* values
   are inlined at build time, so changing one means a rebuild exactly like
   editing this line does. An env var here would be a second place to look for
   the same string, not configuration. */
const CAL_ORIGIN = "https://app.cal.com";
const CAL_LINK = "akshay-paliwal/30min";
const CAL_NS = "30min";
const CAL_DIRECT = `${CAL_ORIGIN.replace(/\/$/, "")}/${CAL_LINK.replace(/^\//, "")}`;

type CalQueue = ((...a: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, (...a: unknown[]) => void>;
  q?: unknown[][];
  config?: Record<string, unknown>;
};

/** Cal's own loader, verbatim apart from reading the url from CAL_ORIGIN. */
function loadCal(origin: string) {
  const C = window as unknown as { Cal?: CalQueue; document: Document };
  const A = `${origin.replace(/\/$/, "")}/embed/embed.js`;
  const L = "init";
  const p = (a: { q?: unknown[][] }, ar: unknown[]) => {
    (a.q = a.q || []).push(ar);
  };
  const d = C.document;
  C.Cal =
    C.Cal ||
    function (...ar: unknown[]) {
      const cal = C.Cal as CalQueue;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        (d.head.appendChild(d.createElement("script")) as HTMLScriptElement).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function (...a: unknown[]) {
          p(api as unknown as { q?: unknown[][] }, a);
        } as unknown as ((...a: unknown[]) => void) & { q?: unknown[][] };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns![namespace] = cal.ns![namespace] || (api as (...a: unknown[]) => void);
          p(cal.ns![namespace] as unknown as { q?: unknown[][] }, ar);
          p(cal as unknown as { q?: unknown[][] }, ["initNamespace", namespace]);
        } else {
          p(cal as unknown as { q?: unknown[][] }, ar);
        }
        return;
      }
      p(cal as unknown as { q?: unknown[][] }, ar);
    };
  return C.Cal as CalQueue;
}

export default function BookACallPage() {
  return (
    <Suspense fallback={null}>
      <BookACall />
    </Suspense>
  );
}

function BookACall() {
  const paymentId = useSearchParams().get("p") ?? "";
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;
    /* The embed reports neither success nor failure, so the only honest
       readiness signal is whether an iframe actually appeared. */
    const started = Date.now();
    const poll = window.setInterval(() => {
      if (cancelled) return;
      if (document.querySelector("#cso-cal iframe")) {
        setState("ready");
        window.clearInterval(poll);
      } else if (Date.now() - started > 9000) {
        setState("failed");
        window.clearInterval(poll);
      }
    }, 300);

    try {
      const Cal = loadCal(CAL_ORIGIN);
      Cal("init", CAL_NS, { origin: CAL_ORIGIN });
      Cal.config = Cal.config || {};
      Cal.config.forwardQueryParams = true;
      const ns = Cal.ns![CAL_NS];

      ns("inline", {
        elementOrSelector: "#cso-cal",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        calLink: CAL_LINK,
      });
      ns("ui", { hideEventTypeDetails: false, layout: "month_view" });

      ns("on", {
        action: "bookingSuccessfulV2",
        callback: () => {
          const q = paymentId ? `?p=${encodeURIComponent(paymentId)}&booked=1` : "?booked=1";
          window.location.href = `/thank-you${q}`;
        },
      });
    } catch {
      if (!cancelled) setState("failed");
      window.clearInterval(poll);
    }

    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [paymentId]);

  return (
    <div className="cso-book">
      <div className="bk-strip">
        <span className="bk-tick" aria-hidden>
          ✓
        </span>
        {PRICE} received
        <span className="bk-sep" aria-hidden>
          ·
        </span>
        One step left
      </div>

      <section className="bk-body">
        <Wrap>
          <div className="bk-mast">
            <span className="bk-pill">Booking</span>
            <h1>
              Now pick your <em>slot.</em>
            </h1>
            <p className="bk-deck">
              A 30 minute call with {site.name}. Choose any time that suits you
              below, and you will get a confirmation by email as soon as you book.
            </p>
          </div>

          <div className="bk-card">
            <div className="bk-cal-inset">
              {state !== "ready" && (
                <p className={state === "failed" ? "bk-note failed" : "bk-note"}>
                  {state === "failed"
                    ? "The calendar could not load here. Use the direct link below and your booking will work exactly the same."
                    : "Loading the calendar."}
                </p>
              )}
              <div id="cso-cal" className="bk-cal" />
            </div>

            {/* Always rendered, never revealed on error: a third-party embed
                fails invisibly, and a blank panel on the page after a payment
                reads as a broken purchase. */}
            <p className="bk-direct">
              Calendar not showing?{" "}
              <a href={CAL_DIRECT} target="_blank" rel="noopener noreferrer">
                Open the booking page directly
              </a>
              .
            </p>
          </div>

          {/* The prep list and the support line were both removed on
              2026-09-10 (Atul). Below the calendar card there is now nothing:
              the page has one job and the embed is it. A buyer who cannot
              book still has the direct Cal link inside the card above, and
              the contact details on every policy page in the footer. */}
        </Wrap>
      </section>

      <SiteFooter />
    </div>
  );
}
