import crypto from "crypto";

import { NextResponse } from "next/server";

import { readClientIp, readClientUserAgent } from "@/lib/request-signals";

/**
 * The /dfy-v3 lead, sent when the quiz's details step is submitted: the
 * details plus the five answers and whether they qualified, to
 * DFY_V3_LEAD_PABBLY_WEBHOOK_URL. Qualified or not, every applicant is sent.
 * Every key goes on every call: Pabbly builds its field mapper from the first
 * payload it sees.
 *
 * Pabbly only. The Meta Lead fires from the quiz itself (lib/track.ts).
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
    // A real boolean: a Pabbly router reads the string "false" as true.
    qualified: body.qualified === true,
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

  const pabbly = url ? await postPabbly(url, payload) : "skipped";
  return NextResponse.json({ ok: pabbly !== "error", pabbly });
}
