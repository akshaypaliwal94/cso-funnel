import crypto from "crypto";

import { NextResponse } from "next/server";

import { CHECKOUT_CONFIG, capiReady, metaFor } from "@/lib/checkout-config";
import { sendCapiEvent } from "@/lib/meta-capi";
import { readClientIp, readClientUserAgent } from "@/lib/request-signals";

/**
 * The /dfy-v3 lead, sent when the buyer presses Pay, so an unpaid applicant is
 * still captured. Two legs, independent of each other:
 *
 *   Pabbly  the checkout's details plus the landing-page quiz answers, to
 *           DFY_V3_LEAD_PABBLY_WEBHOOK_URL. Every key goes on every call:
 *           Pabbly builds its field mapper from the first payload it sees.
 *   Meta    age_lead to the dfy pixel, for a custom conversion.
 *
 * Purchases keep going to the dfy-v2 Pabbly from the Razorpay webhook.
 */

const str = (v: unknown, max = 256) => (v == null ? "" : String(v)).trim().slice(0, max);

async function postPabbly(url: string, payload: Record<string, unknown>) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(`[dfy-v3-lead] ${payload.lead_id} Pabbly ${res.ok ? "sent" : "failed"} (${res.status})`);
    return res.ok ? "sent" : "error";
  } catch (e) {
    console.error(`[dfy-v3-lead] ${payload.lead_id} Pabbly error`, e);
    return "error";
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  const quiz = (body.quiz ?? {}) as Record<string, unknown>;
  const utm = (body.utm ?? {}) as Record<string, unknown>;
  const firstName = str(body.firstName, 80);
  const lastName = str(body.lastName, 80);
  const email = str(body.email, 160);
  const city = str(body.city, 80);
  const country = str(body.country, 2).toLowerCase() || "in";
  const dialCode = str(body.dialCode, 6);
  const phoneDigits = str(body.phone, 20).replace(/\D/g, "");
  const dialDigits = dialCode.replace(/\D/g, "");
  const national =
    dialDigits && phoneDigits.startsWith(dialDigits) ? phoneDigits.slice(dialDigits.length) : phoneDigits;
  const fbc = str(body.fbc);
  const fbp = str(body.fbp, 128);
  const clientIp = readClientIp(req);
  const clientUserAgent = readClientUserAgent(req);

  const payload = {
    lead_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    type: "lead",
    funnel: "dfy-v3",
    first_name: firstName,
    last_name: lastName,
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone: `${dialCode}${national}`,
    dial_code: dialCode,
    city,
    country_code: country.toUpperCase(),
    quiz_stage: str(quiz.stage, 120),
    quiz_challenge: str(quiz.challenge, 120),
    quiz_revenue: str(quiz.revenue, 60),
    quiz_ticket: str(quiz.ticket, 60),
    quiz_budget: str(quiz.budget, 60),
    utm_source: str(utm.source, 100),
    utm_medium: str(utm.medium, 100),
    utm_campaign: str(utm.campaign, 100),
    utm_content: str(utm.content, 100),
    utm_term: str(utm.term, 100),
    fbclid: str(body.fbclid, 200),
    fbc,
    fbp,
    referrer: str(body.referrer, 200),
    landing_url: str(body.landingUrl, 300),
    client_ip_address: clientIp,
    client_user_agent: clientUserAgent,
  };

  const url = process.env.DFY_V3_LEAD_PABBLY_WEBHOOK_URL;
  if (!url) console.error("[dfy-v3-lead] DFY_V3_LEAD_PABBLY_WEBHOOK_URL not set, Pabbly skipped");

  const [pabbly, meta] = await Promise.all([
    url ? postPabbly(url, payload) : Promise.resolve("skipped"),
    capiReady("dfy_v2")
      ? sendCapiEvent({
          pixelId: metaFor("dfy_v2").pixelId,
          accessToken: metaFor("dfy_v2").accessToken,
          eventName: "age_lead",
          eventId: payload.lead_id,
          eventSourceUrl:
            (typeof body.eventSourceUrl === "string" && body.eventSourceUrl) ||
            CHECKOUT_CONFIG.fallbackEventSourceUrl,
          user: {
            email: email || undefined,
            phone: phoneDigits || undefined,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            country,
            city: city || undefined,
            externalId: str(body.externalId, 64) || undefined,
            fbc: fbc || undefined,
            fbp: fbp || undefined,
            clientIp: clientIp || undefined,
            clientUserAgent: clientUserAgent || undefined,
          },
          valueRupees: CHECKOUT_CONFIG.amountRupees,
          currency: CHECKOUT_CONFIG.currency,
          testEventCode: CHECKOUT_CONFIG.meta.testEventCode || undefined,
        }).then((r) => (r.ok ? "sent" : "error"))
      : Promise.resolve("skipped"),
  ]);

  console.log(`[dfy-v3-lead] ${payload.lead_id} age_lead=${meta}`);
  return NextResponse.json({ ok: pabbly !== "error" && meta !== "error", pabbly, meta });
}
