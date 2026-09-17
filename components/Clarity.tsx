"use client";

import Script from "next/script";

/**
 * Microsoft Clarity, driven by env rather than pasted into the layout by hand.
 *
 * This is the whole analytics layer on this project. Atul's scope call for
 * this build: no Google Analytics, no GA4 base tag and no Measurement
 * Protocol, Clarity only. So there is no components/Analytics.tsx here, and no
 * lib/ga4.ts or lib/ga4-server.ts to go with it: a GA4 helper that nothing
 * mounts is exactly the kind of silent no-op that makes a broken funnel look
 * healthy.
 *
 * Renders nothing when the id is missing, so an unfilled env var leaves no
 * broken script tag behind.
 *
 * afterInteractive, not beforeInteractive: session replay is not needed for
 * first paint and must not compete with it.
 */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

export default function Clarity() {
  if (!CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${CLARITY_ID}');`}
    </Script>
  );
}
