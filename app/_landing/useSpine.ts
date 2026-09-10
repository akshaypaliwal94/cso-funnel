"use client";

import { useEffect, type RefObject } from "react";

/**
 * THE SCROLL SPINE, shared.
 *
 * Extracted from Process60 on 2026-09-10 when the founder chapters grew a
 * spine of their own. One implementation rather than two, because two copies
 * of a scroll handler drift: the first thing to go out of sync would be the
 * 0.58 sight line, and then the two spines on one page would light at
 * different heights and read as a bug in whichever you saw second.
 *
 * WHAT IT DOES
 *  · sets `--tl-p` on the container, 0 to 1, as the rail passes the sight line
 *  · toggles `.lit` on each item once its node crosses that line
 *  · adds `.armed` to the container, which is what turns the fill on at all
 *
 * WHY 0.58 AND NOT 0.5: the line sits just below the middle of the viewport,
 * so a node lights slightly BEFORE it reaches the centre of the screen. Lit on
 * the exact centre reads as late, because the eye is already there.
 *
 * FAIL-OPEN. Under reduced motion it returns before arming, so `--tl-p` is
 * never set and the fill keeps its CSS height of 100%: a reader who prefers
 * reduced motion gets a fully drawn spine and nothing that moves, rather than
 * an empty rail. Same for a missing rail or an empty list.
 */
export function useSpine(
  ref: RefObject<HTMLElement | null>,
  { railClass, itemClass, nodeClass }: { railClass: string; itemClass: string; nodeClass: string },
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rail = el.querySelector<HTMLElement>(`.${railClass}`);
    const items = Array.from(el.querySelectorAll<HTMLElement>(`.${itemClass}`));
    if (!rail || !items.length) return;

    el.classList.add("armed");
    let raf = 0;

    const read = () => {
      const r = rail.getBoundingClientRect();
      const line = window.innerHeight * 0.58;
      const p = Math.min(1, Math.max(0, (line - r.top) / (r.height || 1)));
      el.style.setProperty("--tl-p", String(p));
      items.forEach((item) => {
        const node = item.querySelector(`.${nodeClass}`);
        if (!node) return;
        const nb = node.getBoundingClientRect();
        item.classList.toggle("lit", nb.top + nb.height / 2 <= line);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.classList.remove("armed");
    };
  }, [ref, railClass, itemClass, nodeClass]);
}
