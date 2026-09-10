"use client";

import { useEffect, useRef, useState } from "react";
import { cta, site } from "./content";
import { ArrowGlyph } from "./sdp";

/**
 * BEAT 12 · STICKY CTA — page chrome, not a section, so it is not gated.
 *
 * Appears once the hero is past, hides again once the finale is in view, so it
 * never competes with the page's closing peak. It carries the source's own
 * button label, shortened to its transactional half for the bar; the full label
 * is on every in-page button.
 */
export function StickyCta() {
  const [on, setOn] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const read = () => {
      const finale = document.getElementById("apply");
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const finaleIn = finale ? finale.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      setOn(pastHero && !finaleIn);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`sdp-stuck${on ? " on" : ""}`} aria-hidden={!on}>
      <div className="sdp-wrap sdp-stuck-inner">
        <span className="sdp-stuck-label">{cta.note}</span>
        <a className="sdp-stuck-go" href={site.checkoutUrl} tabIndex={on ? 0 : -1}>
          Book Your 1:1 Diagnostic Call - {site.price}
          <ArrowGlyph />
        </a>
      </div>
    </div>
  );
}
