import React from 'react';

/* Services, as a stack of narrative rows rather than a grid of cards.

   The reference this follows makes its case the same way: one claim per row,
   set as a headline, with the detail underneath it and nothing but whitespace
   and a hairline between rows. No tiles, no icons, no badges. That restraint is
   the point: boxed cards with icons read as a feature list, while headlines
   read as arguments, and a reader who stops after two still leaves having read
   two complete claims.

   The two-column split does the work a card border would otherwise do: index
   and title hold the left, body holds the right, so the eye can run down the
   titles alone and stop where it wants to.

   Copy is lifted from the existing Our Services section, unchanged, with each
   service's own closing line pulled out as the kicker. */
interface Service {
  title: string;
  body: string;
  kicker: string;
  /* Reused from the old card layout, matched title-for-title in order. */
  image: string;
}

const SERVICES: Service[] = [
  {
    title: 'Performance Marketing',
    body: 'We architect paid acquisition systems — not random ad campaigns. From audience calibration and offer mapping to cross-platform testing and live KPI monitoring, we build performance machines that bring you qualified buyers at scale.',
    kicker:
      'Every rupee tracked. Every decision data-driven. Every campaign tied back to revenue.',
    image: '/assets/images/dfy/gif/performance-marketing.gif',
  },
  {
    title: 'Creative & Copywriting',
    body: 'Your growth depends on the quality of your messaging — so we build creative assets that merge storytelling with performance data. From hooks, scripts, angles and ads to full landing-page copy, every piece is crafted using proven frameworks that convert cold traffic into warm buyers.',
    kicker:
      'Not just nice-looking content. Content engineered to make people take action.',
    image: '/assets/images/dfy/gif/copy-writting.gif',
  },
  {
    title: 'Business Strategy',
    body: 'Most businesses don’t fail because of bad ads — they fail because of bad decisions. We fix this by going deep into your numbers: CAC, retention, pricing, margins, funnel flow and weekly KPIs.',
    kicker:
      'Weekly 1:1 strategy sessions, analysis dashboards, and a clear plan for offers, positioning, funnels and scaling.',
    image: '/assets/images/dfy/gif/business-strategy.gif',
  },
  {
    title: 'Video Production',
    body: 'We handle the entire production ecosystem — studio, lighting, cinematography, scripting, direction and all high-end equipment. All you need to do is show up for 6–8 hours.',
    kicker:
      'One focused session shoots a month of ads, hooks, reels, testimonials and brand content.',
    image: '/assets/images/dfy/gif/pre-production.gif',
  },
  {
    title: 'Post Production',
    body: 'Our editors turn raw footage into high-performing assets. From kinetic cuts and retention-focused pacing to pattern interrupts, captions, hooks and sound design, every edit is optimised for conversions across Meta, YouTube, TikTok and Reels.',
    kicker:
      'A full monthly content bank, delivered, tested, iterated and performance-optimised.',
    image: '/assets/images/dfy/gif/post-production.gif',
  },
  {
    title: 'Technology & IP Development',
    body: 'We build the systems, automations and tracking infrastructure your business needs to scale without chaos. From custom funnels to CRM workflows to reusable assets and frameworks, we turn your method into real intellectual property.',
    kicker: 'A tech ecosystem that makes growth predictable and trackable.',
    image: '/assets/images/dfy/gif/funnel.gif',
  },
];

export default function OurServices() {
  return (
    <section className="relative bg-black py-16 md:py-24">
      <div
        data-reveal
        className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 md:gap-6"
      >
        <span className="dfy-press-rule dfy-press-rule--l" aria-hidden="true" />
        <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
          Our services
        </p>
        <span className="dfy-press-rule dfy-press-rule--r" aria-hidden="true" />
      </div>

      <h2
        data-reveal
        className="dfy-sec-title mx-auto max-w-4xl px-6 text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[7vw] font-bold leading-tight md:text-[42px]"
      >
        <span className="dfy-title-white">One growth system, </span>
        <span className="dfy-title-orange">built in-house</span>
      </h2>

      <p
        data-reveal
        className="dfy-sec-intro mx-auto max-w-2xl px-6 text-center text-[15px] leading-[1.65] text-[#C9CFDA] md:text-lg"
      >
        Six teams, one roof, one plan. Here is exactly what we run for you.
      </p>

      {/* Centre rule with a node per service, rows alternating either side.
          The rule, the nodes and the side-swap all live in dfy-v2.css, so a
          new service needs nothing but an entry in SERVICES above.

          No mt-* here: .dfy-tl owns the gap above the list, because this file's
          stylesheet loads after Tailwind and would override it anyway. */}
      {/* No px-* here either: .dfy-tl owns the gutter, for the same reason it
          owns the gap above. A padding utility on this element does nothing. */}
      <ol className="dfy-tl dfy-sec-body mx-auto max-w-5xl">
        {SERVICES.map((service, index) => (
          <li key={service.title} data-reveal className="dfy-tl-row">
            <span className="dfy-tl-node" aria-hidden="true" />
            <div className="dfy-tl-panel">
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="dfy-service-index font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-sm font-bold leading-none md:text-base"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="dfy-title-white font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-xl font-bold leading-tight md:text-[26px]">
                  {service.title}
                </h3>
              </div>

              <p className="mt-3 text-[15px] leading-[1.7] text-[#C9CFDA] md:mt-4 md:text-[17px]">
                {service.body}
              </p>
              <p className="mt-3 text-[14px] font-medium leading-[1.6] text-[#FFC87A] md:text-[15px]">
                {service.kicker}
              </p>
            </div>

            {/* The still is wrapped rather than placed straight into the grid.
                A bare <img> carries an intrinsic height, so it would set the
                row's height and the text would follow it; an empty div carries
                none, so it takes the height the text block sets and the image
                fills it. The wrapper also does the clipping, which is what lets
                a cropped fill keep its rounded corners. */}
            <div className="dfy-tl-media mt-5 w-full overflow-hidden rounded-2xl md:mt-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
