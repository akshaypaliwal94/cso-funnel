import React from 'react';

import LightRays from './LightRays';

/* Press strip, directly under the hero.

   Every logo is rendered as a CSS mask rather than as an image, so all four
   arrive in one tone no matter what colour the source file is — Business
   Standard's red, Google's four, Outlook's red-in-white keyline. That is the
   only way a mixed set of press marks sits together without one of them
   shouting. The mask takes its colour from the element, so a single token
   controls the whole row.

   Sizes are per-logo and optical, not uniform: matched by height alone the
   condensed serifs (Business Standard, Entrepreneur) read far heavier than the
   geometric sans next to them. */
const OUTLETS = [
  {
    name: 'Business Standard',
    src: '/assets/images/press/business-standard.svg',
    className: 'h-[20px] w-[170px] md:h-[26px] md:w-[221px]',
  },
  {
    name: 'Google News',
    src: '/assets/images/press/google-news.png',
    className: 'h-[25px] w-[142px] md:h-[33px] md:w-[188px]',
  },
  {
    name: 'Outlook',
    src: '/assets/images/press/outlook.png',
    className: 'h-[25px] w-[146px] md:h-[33px] md:w-[193px]',
  },
  {
    name: 'Entrepreneur',
    src: '/assets/images/press/entrepreneur.svg',
    className: 'h-[20px] w-[102px] md:h-[26px] md:w-[133px]',
  },
];

/* One definition, rendered in three places: the static row, and both passes of
   the mobile marquee. */
const Logo = ({ outlet }: { outlet: (typeof OUTLETS)[number] }) => (
  <span
    role="img"
    aria-label={outlet.name}
    className={`dfy-press-logo block ${outlet.className}`}
    style={{
      WebkitMaskImage: `url('${outlet.src}')`,
      maskImage: `url('${outlet.src}')`,
    }}
  />
);

export default function FeaturedIn() {
  return (
    <section className="relative py-10 md:py-14">
      {/* The counter-light: the same ray shader as the hero, turned upside
          down. Two sources rake down from the top corners; this is a third
          rising to meet them.

          The box's bottom edge lands on the label line and sourceOutside is 0,
          which together pin the lamp exactly there, directly behind the words:
          the rays leave from under the label rather than from somewhere below
          the section, so the strip reads as the thing hiding the source. Zero
          matters — sourceOutside is a FRACTION of the canvas height, so any
          other value drags the source further down every time the box grows.
          Its height is how far the light reaches, deliberately shorter than the
          hero so the beam dies out before it touches the video.

          Indigo, not amber: this is the rays answering themselves, and a warm
          one would compete with the CTA sitting just above it.

          The canvas is masked at its top edge (see .dfy-press-beam). The shader
          clamps its own distance falloff at 0.5, so the rays are still carrying
          light when they reach the end of the canvas and the edge shows up as a
          straight line across the hero — exactly where this beam meets the ones
          raking down from the corners. The mask is what lets the two fields run
          into each other instead of meeting at a seam. */}
      <div className="dfy-press-beam pointer-events-none absolute inset-x-0 top-[46px] z-0 h-[460px] -translate-y-full mix-blend-screen md:top-[62px] md:h-[720px]">
        <LightRays
          raysOrigin="bottom-center"
          sourceOutside={0}
          raysColor="#7B7DF0"
          raysSpeed={0.55}
          lightSpread={1.9}
          rayLength={1.2}
          pulsating={false}
          fadeDistance={0.4}
          saturation={1.1}
          followMouse={false}
          noiseAmount={0}
          distortion={0}
          opacity={0.6}
        />
      </div>

      {/* The strip's own ground, and the reason the light reads as coming from
          BEHIND it. Three layers: the hero's black at the bottom, the beam over
          it, and this opaque panel over the beam — so the only light that
          escapes is what clears the panel's top edge. Without it the rays wash
          across the label and the logos and the source stops reading as hidden.

          It starts at #050505 rather than at black: that is the colour the
          hero's own ground has faded to by its foot, so the panel begins as an
          exact continuation of it and only then falls to black. Painting it
          flat black put a visible step right at the join. */}
      <div
        className="dfy-press-panel absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      {/* The label runs between two rules that fade out at their far ends, the
          same figure as the hero eyebrow but at a fraction of its level — this
          is punctuation between sections, not an element in its own right. */}
      <div
        data-reveal
        className="relative z-10 mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 md:gap-6"
      >
        <span className="dfy-press-rule dfy-press-rule--l" aria-hidden="true" />
        <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
          Featured in
        </p>
        <span className="dfy-press-rule dfy-press-rule--r" aria-hidden="true" />
      </div>

      {/* data-reveal sits on the strip, not on each logo. In the marquee the
          logos start off-screen sideways, so a per-logo reveal would wait for
          an intersection that never comes and the row would stay blank. */}
      <div
        data-reveal
        className="relative z-10 mx-auto max-w-5xl pt-12 md:pt-16"
      >
        {/* Phones get a marquee. Four press marks at their mobile sizes come to
            roughly 560px of logo before any gaps, against a ~340px usable
            width, so a static row has to wrap to two lines and the strip stops
            reading as one run of press. Moving it instead keeps the row a row,
            and shows every logo at full size rather than shrinking them all to
            fit a width they were never drawn for.

            Two identical passes, and the track slides exactly half its own
            width, so the moment it loops the second pass is sitting where the
            first began and the seam cannot be seen. That only holds because the
            spacing is padding ON each item rather than a gap BETWEEN items: a
            gap adds one extra space between the two passes that a 50% shift
            does not account for, and the loop visibly jumps. */}
        <div className="dfy-marquee md:hidden">
          <ul className="dfy-marquee-track">
            {[...OUTLETS, ...OUTLETS].map((outlet, index) => (
              <li
                key={`${outlet.name}-${index}`}
                className="dfy-marquee-item"
                aria-hidden={index >= OUTLETS.length}
              >
                <Logo outlet={outlet} />
              </li>
            ))}
          </ul>
        </div>

        {/* From md up there is room for all four on one line, and a static row
            is better than a moving one: nothing should move that does not need
            to. */}
        <ul className="hidden flex-wrap items-center justify-center gap-x-9 gap-y-7 px-6 md:flex md:gap-x-16">
          {OUTLETS.map((outlet) => (
            <li key={outlet.name}>
              <Logo outlet={outlet} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
