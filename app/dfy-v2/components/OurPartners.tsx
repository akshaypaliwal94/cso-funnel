import React from 'react';

/* Brands, built on the same card as the roster: same amber-into-orange ring,
   same name / rule / credential stack, centred.

   The difference is what sits above the stack. A person gets a portrait, which
   fills its frame; a brand gets a logo, which is somebody else's property and
   comes in whatever proportions it comes in.

   The marks keep their own colours. A white knockout row is tidier and cheaper
   looking: it turns five real clients into five generic silhouettes, and FAB's
   red, CP's teal and Kaizen's coral are the part a visitor actually recognises.
   So the premium is bought in the ground and the sizing instead, which is the
   two things that are ours to control.

   The ground is the warm ivory plate in .dfy-partner-well, not pure white.

   The sizing is done in the files, not in CSS. Every logo ships pre-composed
   into the same 3:1 canvas, so one fixed height in the markup lands all five
   consistently and no logo is ever cropped or stretched. Inside that canvas
   each mark is scaled by optical weight rather than bounding box: half equal
   ink area, half equal diagonal, because a solid coin (Ikore) at the same
   height as a hairline script (Kaizen) reads twice as loud. Two hand nudges sit
   on top of the formula where the maths only got close.

   Backgrounds are lifted off, not just cropped: alpha comes from the distance
   to white and the colour is un-composited back out of that white, so edges
   stay the brand's colour instead of going milky against the ivory.

   Kaizen is the exception to the source. Its supplied file is gold on a navy
   tile and Atul's is a white knockout, and neither can sit on a light plate, so
   this uses the brand's own navy-and-coral lockup from the Kaizen project.

   Sources kept beside the outputs: `*.jpg` as supplied, `kaizen-source.png`
   (Atul's white file) and `kaizen-brand-blue.png` (the official lockup).

   Any card without a `logo` still draws the brand name in the plate. */
interface Partner {
  name: string;
  description: string;
  logo?: string;
}

const PARTNERS: Partner[] = [
  {
    name: 'CLAT Possible',
    logo: '/assets/dfy-new/brands/clat-possible.png',
    description: 'India’s Top CLAT Coaching Company with 12 Centers Pan India',
  },
  {
    name: 'Studio Aware',
    logo: '/assets/dfy-new/brands/studio-aware.png',
    description: 'Rapidly Expanding Luxury Interior Designing Firm',
  },
  {
    name: 'FAB Bank',
    logo: '/assets/dfy-new/brands/fab.png',
    description: 'Largest Bank in Middle East & Africa',
  },
  {
    name: 'Ikore Pilates',
    logo: '/assets/dfy-new/brands/ikore-pilates.png',
    description: 'Global Luxury Pilates Studios',
  },
  {
    name: 'FM4 Therapy',
    logo: '/assets/dfy-new/brands/fm4-therapy.png',
    description: 'GOI Patented Ball Therapy for Knee, Back & Neck Pain',
  },
  {
    name: 'Kaizen',
    logo: '/assets/dfy-new/brands/kaizen.png',
    description: 'Luxury Wellness Center in Goa',
  },
];

export default function OurPartners() {
  return (
    <section className="relative bg-black py-16 md:py-24">
      <div
        data-reveal
        className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 md:gap-6"
      >
        <span className="dfy-press-rule dfy-press-rule--l" aria-hidden="true" />
        <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
          Our partners
        </p>
        <span className="dfy-press-rule dfy-press-rule--r" aria-hidden="true" />
      </div>

      <h2
        data-reveal
        className="dfy-sec-title mx-auto max-w-4xl px-6 text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[7vw] font-bold leading-tight md:text-[42px]"
      >
        <span className="dfy-title-white">Brands we have </span>
        <span className="dfy-title-orange">worked with</span>
      </h2>

      <p
        data-reveal
        className="dfy-sec-intro mx-auto max-w-2xl px-6 text-center text-[15px] leading-[1.6] text-[#C9CFDA] md:text-lg"
      >
        Trusted by Industry leaders across India, Middle East and beyond.
      </p>

      {/* Three up rather than six: at six across, a logo plate is narrower than
          the description underneath it and the row reads as a strip of labels.
          Six divides into two clean rows of three, so nothing is left orphaned
          on a short last row. */}
      <ul className="dfy-sec-body mx-auto grid max-w-5xl grid-cols-1 justify-center gap-4 px-6 sm:grid-cols-2 md:gap-6 md:px-10 lg:grid-cols-3">
        {PARTNERS.map((partner, index) => (
          <li
            key={partner.name}
            data-reveal
            style={{ '--i': index } as React.CSSProperties}
            className="dfy-face-card"
          >
            <div className="dfy-partner-inner rounded-[14px] px-5 pb-6 pt-7 text-center md:px-6 md:pb-7 md:pt-8">
              {/* No horizontal padding here: the breathing room is baked into
                  the 3:1 canvas each logo ships in, so the plate can be one
                  clean rectangle at a fixed height across all five. */}
              <div className="dfy-partner-well mb-6 flex h-[84px] items-center justify-center rounded-[12px] md:h-[100px]">
                {partner.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="text-xs uppercase tracking-[0.2em] text-white/25">
                    {partner.name}
                  </span>
                )}
              </div>

              <p className="dfy-face-value font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-lg font-bold leading-tight md:text-xl">
                {partner.name}
              </p>

              <span
                aria-hidden="true"
                className="dfy-face-divider mx-auto my-3 block h-px w-14 md:my-3.5 md:w-16"
              />

              <p className="text-[13px] leading-[1.6] text-white/70 md:text-sm">
                {partner.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
