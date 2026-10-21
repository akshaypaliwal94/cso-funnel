'use client';

import React, { useState } from 'react';

/* Client results, split India / International behind a toggle.

   Same card as the roster and the partners — amber-into-orange ring, centred
   name / rule / detail stack — with the RESULT given the weight, because that
   is the only line on the card a reader is actually shopping for.

   The data is deliberately loose: several people have a title and no number,
   one or two a number and no title. The card renders whatever is present rather
   than reserving empty slots, so a sparse entry reads as a short card instead
   of a broken one.

   Each card is a PORTRAIT video box: poster frame, play control, and the name
   and result over a scrim at its foot. Portrait because the testimonials are
   shot vertically — letterboxing them into a landscape card would waste half of
   every frame.

   Only one plays at a time. Two testimonials talking over each other is the
   fastest way to make a visitor leave, so starting one stops the other.

   Poster frames live in /assets/dfy-new/testimonials/<region>/ and are cut
   out, with the glow behind the subject fading to transparent so the card's own
   ground shows through at the edges rather than a photo's box sitting inside
   the frame. That is what makes the wall read as one set rather than as a grid
   of unrelated photographs. The older opaque posters in /assets/images/dfy/growth
   are superseded here, though other components still use them.

   Everything ships as .webp only. These are cutouts, so alpha rules out JPEG,
   and the supplied PNGs ran 2-3MB each for a box that never renders wider than
   about 300px: 39MB of sources became 2.9MB of posters. The sources are not
   kept in public/, which is served whole. To add one: drop the cutout in the
   region folder, export it to .webp at 720px wide, point the entry at it, and
   keep the source out of the repo.

   Names without a poster fall back to initials, since an unrelated face is
   worse than none. `video` is a Vimeo player URL; an entry without one stays a
   still. */
interface Story {
  name: string;
  role?: string;
  result?: string;
  roi?: string;
  /* Poster frame. Falls back to the card's own ground plus initials. */
  image?: string;
  /* Vimeo player URL. Without it the play control is a marker, not a button. */
  video?: string;
}

const INDIA: Story[] = [
  {
    name: 'Sourobh Kulkorni',
    role: 'Leading Spinal Expert',
    result: '5L/month → 44L/month',
    roi: '4x ROI',
    image: '/assets/dfy-new/testimonials/india/sourobh.webp',
  },
  {
    name: 'Nimisha Maniar',
    role: 'Founder at Studio Aware',
    result: '50L/year → 2 CR/year',
    roi: '33x ROI',
    image: '/assets/dfy-new/testimonials/india/nimisha.webp',
  },
  {
    name: 'Aman & Zohra',
    role: 'Natural Fertility Experts',
    result: '2L/month → 15L/month',
    roi: '7x ROI',
    image: '/assets/dfy-new/testimonials/india/aman-zohra.webp',
  },
  {
    name: 'Ankita Barasara',
    role: 'Postpartum Healing Expert',
    result: '1L/month → 4L/month',
    roi: '10x ROI',
    image: '/assets/dfy-new/testimonials/india/ankita.webp',
  },
  {
    name: 'Hardik Dhawal',
    role: 'Erectile Dysfunction Expert',
    result: '1L/month → 4L/month',
    roi: '8x ROI',
    image: '/assets/dfy-new/testimonials/india/hardik.webp',
    video: 'https://player.vimeo.com/video/1233978015',
  },
  {
    name: 'Prashanth Sharma',
    role: 'Fat Loss Expert',
    result: '0 → 163 online clients in 5 months',
    image: '/assets/dfy-new/testimonials/india/prashant.webp',
    video: 'https://player.vimeo.com/video/1234034520',
  },
  {
    name: 'Anish & Shubham',
    role: 'Science Driven Performance',
    result: '1L/month → 8L/month',
    roi: '5x ROI',
    image: '/assets/dfy-new/testimonials/india/anish-shubham.webp',
  },
  {
    name: 'Hirav Mehta',
    role: 'Metabolism Expert',
    result: 'Multiple 6-figures monthly, on auto-pilot',
    image: '/assets/dfy-new/testimonials/india/hirav.webp',
    video: 'https://player.vimeo.com/video/1234034518',
  },
  {
    name: 'Sunny Bhamra',
    role: 'India’s #1 TRT Expert',
    result: '4L in 10 weeks',
    roi: '5x ROI',
    image: '/assets/dfy-new/testimonials/india/sunny.webp',
    video: 'https://player.vimeo.com/video/1234034521',
  },
  {
    name: 'Ayush Thakur',
    role: 'Body Transformation Coach',
    result: '10x’ed his online revenue in 6 months',
    image: '/assets/dfy-new/testimonials/india/ayush.webp',
    video: 'https://player.vimeo.com/video/1234034517',
  },
];

const INTERNATIONAL: Story[] = [
  {
    name: 'Marcus Mackay',
    role: 'High Performance Coach',
    result: '$30K/month → $100K/month',
    roi: '7x ROI',
    image: '/assets/dfy-new/testimonials/international/marcus.webp',
    video: 'https://player.vimeo.com/video/1233980975',
  },
  {
    name: 'Luke',
    result: '$50K/month in the first 30 days',
    image: '/assets/dfy-new/testimonials/international/luke.webp',
    video: 'https://player.vimeo.com/video/1233980884',
  },
  {
    name: 'Marco Span',
    result: '15K Euros in the first 4 weeks',
    image: '/assets/dfy-new/testimonials/international/marco.webp',
    video: 'https://player.vimeo.com/video/1233980882',
  },
  {
    name: 'Rebecca Peri',
    role: 'Trauma Healing Expert',
    result: '$5.5K in the first 4 weeks',
    image: '/assets/dfy-new/testimonials/international/rebecca.webp',
  },
  {
    name: 'Nikki Barta',
    result: '0 → 8 high-ticket clients in 4 weeks',
    image: '/assets/dfy-new/testimonials/international/nikki.webp',
    video: 'https://player.vimeo.com/video/1233980992',
  },
  {
    name: 'Diego Carrete',
    role: 'Wellness Expert',
    image: '/assets/dfy-new/testimonials/international/diego.webp',
    video: 'https://player.vimeo.com/video/1233981723',
  },
  {
    name: 'Paul Bradley',
    video: 'https://player.vimeo.com/video/1233980930',
  },
  {
    name: 'Stephen Campollo',
    image: '/assets/dfy-new/testimonials/international/stephen.webp',
    video: 'https://player.vimeo.com/video/1233980931',
  },
  {
    name: 'Erin McDermot',
    image: '/assets/dfy-new/testimonials/international/erin.webp',
    video: 'https://player.vimeo.com/video/1233980881',
  },
];

const TABS = [
  { id: 'india', label: 'India', stories: INDIA },
  { id: 'international', label: 'International', stories: INTERNATIONAL },
] as const;

type TabId = (typeof TABS)[number]['id'];

const PlayGlyph = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="relative z-10"
  >
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

const initials = (name: string) =>
  name
    .replace(/&/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

export default function ClientSuccess() {
  const [active, setActive] = useState<TabId>('india');
  const [playing, setPlaying] = useState<string | null>(null);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section className="relative bg-black py-16 md:py-24">
      <div
        data-reveal
        className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 md:gap-6"
      >
        <span className="dfy-press-rule dfy-press-rule--l" aria-hidden="true" />
        <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
          Client success stories
        </p>
        <span className="dfy-press-rule dfy-press-rule--r" aria-hidden="true" />
      </div>

      <h2
        data-reveal
        className="dfy-sec-title mx-auto max-w-4xl px-6 text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[7vw] font-bold leading-tight md:text-[42px]"
      >
        <span className="dfy-title-white">They Built It. </span>
        <span className="dfy-title-orange">We Scaled It.</span>
      </h2>

      <p
        data-reveal
        className="dfy-sec-intro mx-auto max-w-3xl px-6 text-center text-[15px] leading-[1.65] text-[#C9CFDA] md:text-lg"
      >
        See how experts turned what they know into businesses that generate more
        revenue, attract better clients, and scale without relying on them for
        everything.
      </p>

      {/* The switch. Two buttons in a track rather than a select: there are
          exactly two states and both should be readable at a glance. */}
      <div
        className="dfy-switch dfy-sec-body mx-auto flex w-fit gap-1"
        role="tablist"
        aria-label="Where the results are from"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => {
              setActive(t.id);
              setPlaying(null);
            }}
            className={`dfy-switch-btn ${active === t.id ? 'is-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Four up: a 9:16 box three-across would stand taller than the
          viewport on a laptop. */}
      <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 px-6 md:mt-14 md:grid-cols-3 md:gap-5 md:px-10 lg:grid-cols-4">
        {tab.stories.map((story, index) => (
          <li
            key={story.name}
            data-reveal
            style={{ '--i': index } as React.CSSProperties}
            className="dfy-face-card"
          >
            <div className="dfy-face-art relative aspect-[9/16] overflow-hidden rounded-[14px]">
              {playing === story.name && story.video ? (
                <iframe
                  src={`${story.video}?autoplay=1&title=0&byline=0&portrait=0`}
                  title={`${story.name}’s testimonial`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="size-full border-0 bg-black"
                />
              ) : (
                <>
                  {story.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.image}
                      alt={story.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <span className="dfy-face-value text-4xl font-bold opacity-40">
                        {initials(story.name)}
                      </span>
                    </div>
                  )}

                  {/* The scrim, not a bar: the frame keeps going under the
                      type. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/80 to-transparent"
                  />

                  {story.video ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(story.name)}
                      aria-label={`Play ${story.name}’s testimonial`}
                      className="dfy-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <PlayGlyph />
                    </button>
                  ) : null}

                  <div className="absolute inset-x-0 bottom-0 p-3 text-center md:p-4">
                    <p className="dfy-face-value font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[15px] font-bold leading-tight md:text-base">
                      {story.name}
                    </p>

                    {story.role ? (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45 md:text-[11px]">
                        {story.role}
                      </p>
                    ) : null}

                    <span
                      aria-hidden="true"
                      className="dfy-face-divider mx-auto my-2.5 block h-px w-12 md:w-14"
                    />

                    {story.result ? (
                      <p className="text-[12px] font-semibold leading-[1.45] text-white md:text-[13px]">
                        {story.result}
                      </p>
                    ) : (
                      <p className="text-[11px] italic text-white/40">
                        Result coming soon
                      </p>
                    )}

                    {story.roi ? (
                      <span className="dfy-roi mt-2.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
                        {story.roi}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
