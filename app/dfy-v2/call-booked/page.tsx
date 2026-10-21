'use client';

import React from 'react';

import MainWrapper from '@/app/dfy-v2/components/common/Main';

// import Youtube from '../components/booked/Youtube';
import Header from '../components/common/Header';
import { MainHeading } from '../components/common/Heading';
import { TextBlock } from '../components/common/TextBlock';
import RevealOnScroll from '../components/RevealOnScroll';

/* An inline SVG at the funnel's own stroke weight, not a ✓ character.

   The design brain rules emoji out as UI outright: an emoji renders in the
   system's emoji face, so it changes shape between Apple, Android and Windows,
   ignores the surrounding type's weight and colour, and is the single fastest
   tell that a page was assembled rather than designed. currentColor keeps this
   on the page's orange with no second colour token. */
const Tick = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="mt-0.5 shrink-0 text-[#FF6A00]"
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export default function XCommunePage() {
  return (
    <MainWrapper
      isShowFooter
      footerClass="bg-black text-white"
      className="bg-[#07080A]"
    >
      <RevealOnScroll />

      {/* Black, like every section on the landing page. This carried a
          photographic hero_bg.png, which is the single biggest reason these
          pages did not read as the same site: the landing page has no
          photographic grounds anywhere, its depth comes from light (the ray
          shaders and the amber rings) over flat black. */}
      <div className="bg-black">
        <Header />
        <section className="px-6 py-16 md:px-10 md:py-24">
          {/* One block span per line, exactly as the hero title is built.
              .dfy-title-white paints into the element's BOX: give it the whole
              multi-line heading and the ramp stretches across all of it, so only
              the bottom line picks up any grey. A span per line gives each line
              its own box and its own falloff. */}
          <MainHeading>
            <span className="dfy-title-white block">
              <span className="dfy-title-orange">Congrats!</span> Your Call
              Request
            </span>
            <span className="dfy-title-white block">Has Been Received.</span>
          </MainHeading>

          <div className="dfy-sec-body mx-auto max-w-3xl">
            <div className="dfy-panel p-4 md:p-6">
              <TextBlock className="text-center">
                <span className="text-lg font-bold text-[#FF6A00]">
                  IMPORTANT
                </span>
                <br />
                <span className="mt-2 block">
                  Watch this 60-second video from Akshay to understand the next
                  steps and confirm your call.
                </span>
              </TextBlock>
            </div>
          </div>

          <div className="mx-auto mt-8 w-full max-w-4xl md:mt-10">
            {/* <VidalyticsVideo
              embedId="vidalytics_embed_T2a0AnVB1qbWYNRO"
              embedUrl="https://fast.vidalytics.com/embeds/wV4I7Zcu/T2a0AnVB1qbWYNRO/"
              className="dfy-panel mx-auto aspect-video w-full overflow-hidden p-0"
            /> */}
            <div className="dfy-panel relative mx-auto mb-4 aspect-video w-full overflow-hidden p-0">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                id="youtube-iframe"
                src="https://tgox-production-bucket.nyc3.cdn.digitaloceanspaces.com/client_funnel_videos/TGO/thank_you.mp4_v1%20(1080p).mp4"
                controls
                playsInline
                preload="metadata"
                className="size-full bg-transparent object-contain"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 md:py-24">
          <MainHeading>
            <span className="dfy-title-orange">Step 1:</span>{' '}
            <span className="dfy-title-orange">
              Expect a Short Call From Our Core Team
            </span>
          </MainHeading>

          {/* <TextBlock className="dfy-sec-intro mx-auto max-w-3xl text-center">
            Confirm your call by replying "Yes" to our text or email{' '}
            <span className="text-[#FF6A00] underline"> and</span> selecting
            "Yes" in the email calendar invitation.
          </TextBlock> */}

          <div className="dfy-sec-body mx-auto max-w-3xl">
            <div className="dfy-panel space-y-6 p-6 md:p-8">
              {/* Main Info */}
              <TextBlock className="text-center text-base md:text-lg">
                Within the next{' '}
                <span className="font-bold text-[#FF6A00]">24-48 hours</span>,
                someone from Akshay's core strategy team will call you on the
                number you shared.
              </TextBlock>

              {/* Quick Details */}
              <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                <div className="dfy-panel-inset px-4 py-2">
                  <TextBlock className="text-center">
                    <span className="font-bold text-[#FF6A00]">Duration:</span>{' '}
                    5–10 minutes
                  </TextBlock>
                </div>
                <div className="dfy-panel-inset px-4 py-2">
                  <TextBlock className="text-center">
                    <span className="font-bold text-[#FF6A00]">Note:</span> Not
                    a sales call
                  </TextBlock>
                </div>
              </div>

              {/* Purpose Section */}
              <div className="mt-6">
                <TextBlock className="mb-4 text-center">
                  <span className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-lg font-bold text-white md:text-2xl">
                    Purpose of the call:
                  </span>
                </TextBlock>
                <ul className="mx-auto max-w-2xl space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <Tick />
                    <TextBlock>Understand your business</TextBlock>
                  </li>
                  <li className="flex items-start gap-3">
                    <Tick />
                    <TextBlock>Check your current stage</TextBlock>
                  </li>
                  <li className="flex items-start gap-3">
                    <Tick />
                    <TextBlock>
                      Confirm whether our Done-For-You model is the right fit
                    </TextBlock>
                  </li>
                </ul>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 border-t border-[rgba(255,154,45,0.16)] pt-6">
                <TextBlock className="text-center">
                  If it's <span className="font-bold">not a fit</span>, we'll
                  tell you clearly.
                  <br />
                  If it <span className="font-bold">is a fit</span>, your video
                  call with Akshay will be scheduled.
                </TextBlock>

                <div className="dfy-panel-inset p-4">
                  <TextBlock className="text-center">
                    <span className="font-bold text-[#FF6A00]">Please</span>
                    keep your phone available and answer calls from unknown
                    numbers.
                  </TextBlock>
                </div>
              </div>
            </div>
          </div>
          {/* <img
            src="/assets/images/dfy/call-booked.png"
            alt="booked"
            className="mx-auto rounded-md md:max-w-[900px]"
          /> */}
        </section>
      </div>
      <section className="px-6 py-16 md:px-10 md:py-24">
        <MainHeading className="mx-auto max-w-5xl">
          <span className="dfy-title-orange">Step 2:</span>{' '}
          <span className="dfy-title-orange">DM</span> Akshay (our CEO) on
          Instagram saying{' '}
          <span className="dfy-title-orange">“I've Applied”</span>
        </MainHeading>
        <TextBlock className="dfy-sec-intro mx-auto max-w-3xl text-center">
          After watching the video, DM{' '}
          <span className="font-semibold text-[#FF6A00]">“I’ve Applied”</span>{' '}
          on <br /> instagram{' '}
          <a
            href="https://instagram.com/akshaypaliwal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6A00]"
          >
            @akshaypaliwal
          </a>
        </TextBlock>{' '}
        <TextBlock className="mx-auto mt-3 max-w-3xl text-center">
          This helps Akshay identify serious applicants before the strategy
          discussion.
        </TextBlock>
        <div className="dfy-panel dfy-sec-body mx-auto flex max-w-4xl flex-col-reverse items-center justify-between gap-8 pb-4 pt-12 md:flex-row md:pl-4 md:pr-16">
          <div className="md:w-[45%]">
            <TextBlock className="mb-4 text-left text-sm leading-130">
              Why?
            </TextBlock>
            <ul className="mb-4 list-disc space-y-3 pl-6 text-sm leading-130 marker:text-[rgba(255,154,45,0.5)]">
              <li>
                <TextBlock className="text-left text-sm leading-130">
                  So he knows who you are — and that{' '}
                  <span className="text-[#FF6A00]">you’re serious</span>
                </TextBlock>
              </li>
              <li>
                <TextBlock className="text-left text-sm leading-130">
                  So you know this{' '}
                  <span className="text-[#FF6A00]">
                    isn’t some agency script
                  </span>{' '}
                  — it’s real people, real vision
                </TextBlock>
              </li>
              <li>
                <TextBlock className="text-left text-sm leading-130">
                  And he’ll personally drop you 1{' '}
                  <span className="text-[#FF6A00]">short insight</span> to prep
                  you before your call
                </TextBlock>
              </li>
            </ul>
            <TextBlock className="text-left text-sm leading-130">
              It takes 10 seconds. But it makes everything feel real — for both
              of us.
            </TextBlock>
          </div>
          <div className="dfy-panel overflow-hidden p-0">
            <img
              src="/assets/images/x-commune/akshay_insta.png"
              className="md:w-80"
              alt="akshay insta"
            />
            <div className="px-8 pb-6 pt-4 md:px-6 md:pb-8 md:pt-4">
              <div className="mx-auto rounded-3xl bg-[url('/assets/images/x-commune/insta_button_bg.png')] bg-cover bg-center bg-no-repeat py-3 pl-4 pr-6 font-bold md:bg-[url('/assets/images/x-commune/insta_button_bg.png')] md:py-4 md:pl-6 md:pr-8">
                <a
                  href="https://instagram.com/akshaypaliwal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dfy-cta block p-4 text-center font-[family-name:var(--font-jost),ui-sans-serif,system-ui] text-base font-semibold text-white md:px-12 md:py-3 md:text-lg"
                >
                  DM NOW
                  <br />
                  <span className="text-sm font-medium">
                    (click here to DM)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="dfy-face-divider mx-2 h-px max-w-5xl self-stretch md:mx-auto" /> */}
      {/* <section className="px-4 pb-16 pt-6 md:px-0 md:py-16">
        <MainHeading className="mx-auto mb-4 max-w-3xl">
          <span className="dfy-title-orange">Bonus:</span> Watch the{' '}
          <span className="dfy-title-orange">
            TGO Heroes Podcast Series{' '}
          </span>
          on YouTube
        </MainHeading>

        <TextBlock className="dfy-sec-intro mx-auto max-w-3xl text-center">
          Hear how real people turned struggle into scale building online
          brands, income, and freedom in a way that’s simple, systematic, and
          fun.
        </TextBlock>

        <TextBlock className="mx-auto mb-8 max-w-3xl text-center">
          These are{' '}
          <span className="text-[#FF6A00]">raw, unfiltered stories</span> from
          people just like you.
          <br />
          And after just one episode, you won’t just believe in the process,
          you’ll show up to the call clear, inspired, and ready to move.
        </TextBlock>

        <Youtube />
      </section> */}
    </MainWrapper>
  );
}
