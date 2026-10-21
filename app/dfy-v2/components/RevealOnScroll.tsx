'use client';

import { useEffect } from 'react';

/* Drives the [data-reveal] entrance defined in dfy-v2.css.

   One observer for the whole page rather than a wrapper component per section.
   A <Reveal> wrapper would mean an extra DOM node around everything it touches,
   which fights the grids these sections are built on: a wrapper between a grid
   and its items breaks the grid. Marking the real element with an attribute
   leaves the layout exactly as it was.

   Elements are unobserved once they have arrived. Reveals are a first-scroll
   effect, so re-running them on the way back up would turn a considered page
   into a flickering one, and it keeps the observer's list shrinking to nothing
   instead of holding every node on the page for the session.

   rootMargin sets where the move begins relative to the fold. See the note on
   the observer below: it is the one number this whole effect lives or dies on. */
export default function RevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    if (nodes.length === 0) return undefined;

    /* No IntersectionObserver, or reduced motion: show everything at once and
       do not observe anything. Both cases must end with the content VISIBLE —
       the resting state is hidden, so bailing out without this would leave the
       page blank below the hero. */
    const still =
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (still) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return undefined;
    }

    /* Anything already on screen at mount is revealed without animating in.
       Otherwise the top of the page plays its entrance to nobody, and a visitor
       landing mid-page via an anchor sees a section assemble itself under a
       heading they are already reading. */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      /* Two failure modes sit either side of this number, and the gap between
         them is narrow.

         Trigger late and a visitor watches every section animate after it has
         already arrived, which reads as the page lagging behind the scroll.
         That was -12% with a 0.05 threshold: on a tall row the threshold made
         it later still, since 5% of the row's OWN height had to cross before
         it counted.

         Trigger early and the move is over before anyone looks at it. That was
         +14%: technically revealing, effectively invisible.

         -6% with threshold 0 fires as the element's top edge crosses into
         view, so the settle happens while it travels up the screen. The
         stutter that made the late version feel bad was the compositor
         carrying forty will-change layers, not the timing, so this can sit
         later than the overcorrection without bringing the jank back. */
      {
        /* A phone gets a smaller inward margin than a desktop. The unit is a
           percentage of the ROOT, so -6% is about 90px on a laptop but only
           around 45px on a phone, and phone scrolling is the faster of the two
           with momentum on top. The same number is therefore effectively later
           on the device that can least afford it. -2% restores the runway. */
        rootMargin: window.matchMedia('(max-width: 767px)').matches
          ? '0px 0px -2% 0px'
          : '0px 0px -6% 0px',
        threshold: 0,
      },
    );

    nodes.forEach((n) => observer.observe(n));

    /* Nodes that appear AFTER the first pass are shown immediately rather than
       observed. Client Success replaces its whole card grid when the India /
       International toggle is pressed, and those cards mount with the resting
       state on them: without this they would be invisible until an observer
       tick caught up, so switching tabs would blank the section for a frame.

       Not animating them is the correct answer, not a shortcut. A reveal earns
       its keep on first scroll, where it paces content the visitor has not seen
       yet. Replaying it on a tab press puts a delay between a click and its
       result, which is the opposite of premium. */
    const settle = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('[data-reveal]')) node.classList.add('is-in');
          node
            .querySelectorAll<HTMLElement>('[data-reveal]')
            .forEach((el) => el.classList.add('is-in'));
        });
      });
    });
    settle.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      settle.disconnect();
    };
  }, []);

  return null;
}
