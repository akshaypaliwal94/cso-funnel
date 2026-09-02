"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll, FAIL-OPEN (design brain C7).
 *
 * The CSS only hides `[data-sdp-reveal]` when `.sd-armed` is present on the
 * root, and only this script adds it. If JS never runs, or runs late, or errors,
 * every element stays visible: the page can never render blank.
 *
 * Reduced motion is honoured twice: the observer is skipped entirely, and the
 * stylesheet neutralises the transform as a backstop.
 */
export function RevealRoot() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sd-root");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-sdp-reveal]"));
    if (!nodes.length) return;

    root.classList.add("sd-armed");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));

    // Anything already on screen at mount reveals immediately, so the hero
    // never sits hidden waiting for a scroll that may not come.
    requestAnimationFrame(() => {
      nodes.forEach((n) => {
        if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add("vis");
      });
    });

    return () => io.disconnect();
  }, []);

  return null;
}
