"use client";

/**
 * The identifiers a browser can supply to the server for event matching.
 *
 * `external_id` is ours: a stable random id per browser, so events from the
 * same person across a session join up even before they give us an email.
 * `_fbc` and `_fbp` are Meta's own cookies. `_fbc` only exists if the visitor
 * arrived with an fbclid, so we synthesise it from the URL on first landing,
 * exactly as Meta's own pixel would.
 *
 * There is no GA4 client id here. This project ships no Google Analytics by
 * Atul's explicit scope call, so there is no _ga cookie to read and no
 * Measurement Protocol call for it to feed.
 */

import { readAttribution } from "@/lib/attribution";

const EXTERNAL_ID_KEY = "ap_external_id";

export function getOrCreateExternalId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(EXTERNAL_ID_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(EXTERNAL_ID_KEY, id);
    return id;
  } catch {
    return "";
  }
}

export function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

/** Meta's format: fb.1.<timestamp>.<fbclid> */
export function captureFbclid(): void {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid || readCookie("_fbc")) return;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${value}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
}

/**
 * The campaign context, read from STORAGE rather than from the current url.
 *
 * It is captured on first landing by lib/attribution.ts. Reading
 * window.location.search here instead would return nothing on /checkout,
 * because the buyer arrived by clicking a link and the query string did not
 * come with them, and every paid sale would be written to the order with blank
 * UTMs.
 */
export function readUtm() {
  const a = readAttribution();
  const pick = (v: string) => v || undefined;
  return {
    source: pick(a.utmSource),
    medium: pick(a.utmMedium),
    campaign: pick(a.utmCampaign),
    content: pick(a.utmContent),
    term: pick(a.utmTerm),
  };
}

/**
 * Everything a server route needs from the browser, in one object.
 *
 * Note what is NOT here: the client IP and the user agent. Both are read
 * server-side from the request headers, because a browser cannot know its own
 * IP and a user agent sent up in a body is forgeable. See lib/request-signals.
 */
export function collectSignals() {
  const a = readAttribution();
  return {
    externalId: getOrCreateExternalId(),
    fbc: readCookie("_fbc") || undefined,
    fbp: readCookie("_fbp") || undefined,
    eventSourceUrl: typeof window !== "undefined" ? window.location.href : "",
    utm: readUtm(),
    fbclid: a.fbclid,
    referrer: a.referrer,
    landingUrl: a.landingUrl,
  };
}
