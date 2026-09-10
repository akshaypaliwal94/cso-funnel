"use client";

import { useEffect } from "react";

import { trackViewItem } from "@/lib/track";

/**
 * Landing-page tracking, mounted once on the page. Renders nothing.
 *
 * ONE EVENT ONLY: ViewContent, once per session, so a returning visitor still
 * feeds the retargeting audience.
 *
 * AddToCart deliberately does NOT live here. It fires on the checkout's own
 * mount, for two reasons:
 *
 *  1. This page carries several CTAs. A reader who clicks two of them would be
 *     counted twice, which inflates AddToCart volume and deflates the
 *     cost-per-AddToCart the ads are judged on.
 *  2. A click is not an arrival. Counting the checkout's mount counts the
 *     people who actually reached it, and it is the ONLY Meta event a visitor
 *     who opens /checkout directly will ever produce.
 *
 * Do not re-add it here: the two together double-count every ordinary buyer.
 */
export default function FunnelTracker() {
  useEffect(() => {
    trackViewItem();
  }, []);

  return null;
}
