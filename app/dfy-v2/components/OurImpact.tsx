import React from 'react';

/* The roster.

   Each card stacks three things centred over the portrait: the name large, a
   rule, then the credential. The portrait is darkened toward its foot so that
   block has somewhere to sit without a solid bar across the image.

   Deepali has no follower count, so the same slot carries the title instead —
   the layout takes whatever the credential happens to be rather than forcing
   everyone into a metric.

   All eight portraits are in. They are shot as one set (dark ground, warm
   orange rim light) so the row reads as a group rather than eight scraped
   headshots, and each is cropped by CSS to 3/4 with the face well inside.

   Served as JPEG, not the supplied PNG. This card uses a plain <img>, so
   nothing resizes them at request time: the browser downloads whatever is on
   disk. The originals are 13MB together for tiles that render near 300px, so
   they are re-encoded to 720px JPEGs (548KB for all eight) and the PNGs are
   kept out of the build. The lettered-panel fallback below stays for any face
   added later whose photograph has not landed yet. */
interface Face {
  name: string;
  value: string;
  label: string;
  platform: 'instagram' | 'youtube' | 'award';
  image?: string;
}

const FACES: Face[] = [
  {
    name: 'Hirav Mehta',
    value: '2M',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/hirav.jpg',
  },
  {
    name: 'Sonia Narang',
    value: '2.4M',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/sonia.jpg',
  },
  {
    name: 'Peeyush Prabhat',
    value: '1.2M',
    label: 'YT Subscribers',
    platform: 'youtube',
    image: '/assets/dfy-new/influencers/peeyush.jpg',
  },
  {
    name: 'Asveth Sreiram',
    value: '700K',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/ashweth.jpg',
  },
  {
    name: 'Arjun Shah',
    value: '500K',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/arjun.jpg',
  },
  {
    name: 'Srushthi Shah',
    value: '300K',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/srushti.jpg',
  },
  {
    name: 'Prakash Kumar',
    value: '105K',
    label: 'Followers',
    platform: 'instagram',
    image: '/assets/dfy-new/influencers/prakash.jpg',
  },
  {
    name: 'Deepali Gupta',
    value: 'Ambassador',
    label: 'Pilates · Asia',
    platform: 'award',
    image: '/assets/dfy-new/influencers/deepali.jpg',
  },
];

const Mark = ({ platform }: { platform: Face['platform'] }) => {
  const common = {
    width: 13,
    height: 13,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (platform === 'youtube') {
    return (
      <svg {...common}>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (platform === 'award') {
    return (
      <svg {...common}>
        <circle cx="12" cy="9" r="5" />
        <path d="m8.5 13.5-1 7.5 4.5-2.5 4.5 2.5-1-7.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
};

/* No bg-black on the section: the shared wrapper in page.tsx supplies it, so
   the client stories swoosh can carry its tails into the top right of this
   section. A background here would paint straight over them. Still `relative`,
   and still later in the DOM, so this section's own content sits above the
   light without needing a z-index. */
export default function OurImpact() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Same rail as the press strip: gradient label between two rules that
          fade out at their far ends. */}
      <div
        data-reveal
        className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 md:gap-6"
      >
        <span className="dfy-press-rule dfy-press-rule--l" aria-hidden="true" />
        <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
          Our impact
        </p>
        <span className="dfy-press-rule dfy-press-rule--r" aria-hidden="true" />
      </div>

      <h2
        data-reveal
        className="dfy-sec-title mx-auto max-w-4xl px-6 text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[6.4vw] font-bold leading-tight md:text-[42px]"
      >
        <span className="dfy-title-white">We are the team behind </span>
        <span className="dfy-title-orange">India&apos;s most influential</span>
        <span className="dfy-title-white"> faces</span>
      </h2>

      <ul className="dfy-sec-body mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-3 md:gap-6 md:px-10 lg:grid-cols-4">
        {FACES.map((face, index) => (
          <li
            key={face.name}
            data-reveal
            style={{ '--i': index } as React.CSSProperties}
            className="dfy-face-card"
          >
            <div className="dfy-face-art relative overflow-hidden rounded-[14px]">
              {face.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={face.image}
                  alt={face.name}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center">
                  <span className="dfy-title-orange text-4xl font-bold opacity-50">
                    {face.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </span>
                </div>
              )}

              {/* The scrim, not a bar: the image keeps going under the type. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/75 to-transparent"
              />

              {/* Name first and large, a rule under it, then the credential.
                  Centred, so the three read as one stacked unit. */}
              <div className="absolute inset-x-0 bottom-0 p-3 text-center md:p-4">
                <p className="dfy-face-value font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[15px] font-bold leading-tight md:text-lg">
                  {face.name}
                </p>

                <span
                  aria-hidden="true"
                  className="dfy-face-divider mx-auto my-2 block h-px w-12 md:my-2.5 md:w-16"
                />

                <p className="inline-flex items-center justify-center gap-1.5 text-[11px] text-white/75 md:text-[13px]">
                  <Mark platform={face.platform} />
                  <span>
                    <span className="font-semibold text-white">
                      {face.value}
                    </span>{' '}
                    {face.label}
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
