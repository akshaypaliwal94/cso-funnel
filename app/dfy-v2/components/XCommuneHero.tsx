'use client';

// import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

// import VidalyticsVideo from '@/components/common/VidalyticsVideo';

import { DFY_V2_PRICE_LABEL } from '../price';
import HeroBackdrop from './HeroBackdrop';
import { WatchToUnlockButton } from './WatchToUnlockButton';

// interface XCommuneHeroProps {
//   // isVideoPlayed: boolean;
//   // setIsVideoPlayed: React.Dispatch<React.SetStateAction<boolean>>;
// }

export default function XCommuneHero() {
  // const [loading, setLoading] = useState(true);
  // const searchParams = useSearchParams();

  // Convert URLSearchParams to a query string
  // const queryString = searchParams.toString();

  // const [isVideoPlayed, setIsVideoPlayed] = useState(false);

  // const handleVideoPlayer = () => {
  //   setLoading(false);
  //   // setIsVideoPlayed(true);
  // };

  return (
    <section className="relative overflow-hidden bg-black pb-0 pt-4 text-white md:pb-16 md:pt-6">
      <HeroBackdrop />
      <div className="relative z-10 mx-auto max-w-3xl text-center xl:max-w-6xl">
        {/* The wordmark used to sit in its own bar above the hero. That bar had
            its own background and cut straight across the top corners, which is
            exactly where the rays originate, so it has been folded in here. */}
        <div className="mb-5 flex justify-center md:mb-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/icons/svg/tgo-white.svg"
            alt="TGO"
            className="h-9 w-16 md:h-12 md:w-20"
          />
        </div>

        {/* The rules run straight out of the pill's edges with no gap, so the
            three pieces read as one continuous line that fades out at both far
            ends. Gradient border and rules live in dfy-v2.css.

            The phone size is a clamp on vw, not a fixed step. This line is 63
            characters, so at any fixed size it either wraps or runs off the
            edge as the viewport changes; sized against the viewport it holds
            one line at every width instead. 2.3vw lands near 9px on a common
            phone and 7.4px on a 320px screen, with a 12px ceiling so it stops
            growing before the md rules take over.

            shrink-0 only from md up. Held at its max-content width the pill was
            about 434px, and since the hero clips its overflow it was not
            pushing a scrollbar, it was being SLICED: both ends of the sentence
            ran off the sides on every phone under roughly 430px. nowrap now
            sets the pill's width from the type, which leaves the flanking rules
            the remainder (flex 1 1 0 with min-width 0, so they take whatever is
            left) rather than being pushed out of the row.

            9px is small, and it is small because 63 characters is a lot to ask
            of one line on a phone, not because the type wanted to be. */}
        <div className="mb-4 flex w-full items-center justify-center">
          <span
            className="dfy-eyebrow-rule dfy-eyebrow-rule--l"
            aria-hidden="true"
          />
          <span className="dfy-eyebrow inline-flex max-w-full items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[clamp(7px,2.3vw,12px)] font-medium tracking-[0.15px] text-white md:shrink-0 md:whitespace-normal md:px-6 md:py-2 md:text-sm md:tracking-[0.3px]">
            ONLY FOR COACHES, CREATORS &amp; FOUNDERS MAKING 2-5L/MONTH ALREADY.
          </span>
          <span
            className="dfy-eyebrow-rule dfy-eyebrow-rule--r"
            aria-hidden="true"
          />
        </div>
        <h1 className="mx-1 mb-4 px-1 text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] leading-[1.34] text-white md:mx-0 md:mb-6 md:px-0">
          {/* Two type steps: the promise is set large and heavy on its own
              line, the qualification runs two lines beneath it a step down.
              Explicit blocks, so the break never moves with the viewport. */}
          <span className="dfy-title-white block whitespace-nowrap text-[6.7vw] font-bold md:text-[62px]">
            Scale to{' '}
            <span className="dfy-title-orange text-[#FF6A00]">
              ₹1–10 Crore/year
            </span>
          </span>
          <span className="dfy-title-white block whitespace-nowrap text-[4.1vw] font-semibold md:text-[38px] md:font-medium">
            with Growth Systems for Industry Dominance,
          </span>
          <span className="dfy-title-white block whitespace-nowrap text-[4.1vw] font-semibold md:text-[38px] md:font-medium">
            Maximum Time Freedom and Peace of Mind.
          </span>
        </h1>

        {/* Padded in so the body sets on two lines rather than three or four
            short ones: 30px a side against the 768px hero column. The break is
            explicit from md up, where the measure is wide enough to hold each
            half; below that the phone's own width decides and the copy runs
            longer. */}
        <p className="mx-auto max-w-4xl px-4 text-center text-[13px] leading-[1.65] text-[#C9CFDA] md:mb-12 md:max-w-[708px] md:px-0 md:text-base md:leading-7">
          No cookie-cutter funnels. Our in-house team builds your brand, ads,
          and sales into
          <br className="hidden md:inline" /> one growth system, proven on{' '}
          <span className="text-[#FF6A00]">
            900+ coaches across 20+ countries.
          </span>
        </p>
        <div className="-mt-12 flex flex-col items-center gap-2">
          {/* 512px -> 768px, up 50%. Only binds from ~md up; on a phone the
              viewport is still the narrower constraint. */}
          <div className="relative w-full max-w-3xl">
            <div className=" bg-center bg-no-repeat px-8 pb-8 pt-[5.35rem] md:pb-16">
              {/* The rim and the bounce live on the frame; the screen clips
                  the video to the same radius. Two elements, because the
                  clipping would cut the rim away if they were one. */}
              <div className="dfy-video-frame mx-auto mb-4 w-full">
                <div className="dfy-video-screen aspect-video w-full overflow-hidden rounded-[18px]">
                  {/* {loading && (
                  <button
                    onClick={handleVideoPlayer}
                    type="button"
                    className="w-full"
                  >
                    <img
                      src="/assets/images/dfy/gif/hero-thumbnail.gif"
                      className="w-full"
                    />
                  </button>
                )}
                */}

                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    id="youtube-iframe"
                    src="https://tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com/client_funnel_videos/TGO/vsl_v2_v1%20(1080p).mp4"
                    controls
                    playsInline
                    preload="metadata"
                    className="size-full bg-transparent object-contain"
                  />

                  {/* <VidalyticsVideo
                  embedId="vidalytics_embed_IjfZO_ktESiQBcid"
                  embedUrl="https://fast.vidalytics.com/embeds/wV4I7Zcu/IjfZO_ktESiQBcid/"
                /> */}
                </div>
              </div>
            </div>

            {/* <img
              src="/assets/images/icons/svg/did_u_watch_id.svg"
              alt=""
              className="absolute bottom-8 left-4 h-24 w-[72px] md:-left-20 md:bottom-4 md:w-44"
            /> */}
          </div>

          {/* `block` un-hides it below md for THIS placement only. The button's
              own base is `hidden md:block`, because on a phone the sticky bar at
              the foot is meant to carry the CTA rather than every inline copy of
              it repeating down the page. In the hero that is wrong: the refund
              line sits directly under this button and explains it, so with the
              button gone the line was left reassuring the visitor about a price
              and a call that nothing on screen had offered yet.

              cn() runs twMerge, so `block` resolves against the base `hidden`
              rather than both landing in the class list and Tailwind's own
              display order deciding. The other two inline placements
              (DFYGrowth, XCommuneIntro) keep the sticky-bar behaviour. */}
          {/* The gutter sits on this wrapper, not on the button and not on the
              halo. .dfy-cta-halo draws its ripple rings at inset: 0, so padding
              on the halo itself would push those rings off the button's edges
              and leave them floating around it. */}
          <div className="w-full px-6 md:px-0">
            <Suspense fallback={<div>Loading...</div>}>
              <WatchToUnlockButton className="block" />
            </Suspense>
          </div>

          {/* Diagnostic reassurance below the CTA (price now lives in the CTA).

              Set in the page's own sans at the page's own body colour. It used
              to carry an inline Georgia stack in italic, which broke the type
              system twice over: a serif at body size, and italic used as a tone
              of voice rather than for emphasis. Georgia is also not a font this
              page loads, so it fell to whatever serif the visitor's OS happened
              to have and rendered differently on every device.

              The emphasis is where it always was, and it is the only thing that
              changes weight: the sentence reassures, the refund is the fact.

              Sized a step BELOW the hero deck, not level with it. This is
              closer microcopy: it removes a risk after the offer has already
              been made, so it is the last thing in the hero that should be
              read. It was 14px against a 13px deck on mobile and level with it
              at 16px on desktop, which put the smallest promise on the page at
              or above the line carrying the actual proposition. 12px / 14px
              against the deck's 13px / 16px puts it back underneath. */}
          <p className="mt-3 max-w-xl px-6 text-center text-xs leading-5 text-[#C9CFDA] md:text-sm md:leading-6">
            A diagnostic session, not a sales pitch. If we’re not the right fit,{' '}
            <span className="font-semibold text-white">
              your {DFY_V2_PRICE_LABEL} is refunded.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
