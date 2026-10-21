'use client';

import React, { Suspense } from 'react';

import MainWrapper from '@/app/dfy-v2/components/common/Main';

import ClientStories from './components/ClientStories';
import ClientSuccess from './components/ClientSuccess';
import DfyFunnelTracker from './components/DfyFunnelTracker';
import FeaturedIn from './components/FeaturedIn';
import OurImpact from './components/OurImpact';
import OurPartners from './components/OurPartners';
import OurServices from './components/OurServices';
import RevealOnScroll from './components/RevealOnScroll';
import { WatchToUnlockButton } from './components/WatchToUnlockButton';
import XCommuneHero from './components/XCommuneHero';

function XCommunePageContent() {
  // const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  return (
    <MainWrapper
      isShowFooter
      footerClass="bg-black text-white"
      className="bg-[#07080A]"
    >
      {/* Mounted once for the whole page: it drives every [data-reveal] in the
          sections below. */}
      <RevealOnScroll />
      <DfyFunnelTracker />

      {/* Inside the hero's wrapper, not after it: the strip declares no ground
          of its own, so sitting here it keeps the hero's black instead of
          landing on the page's slightly lighter #07080A and drawing a seam
          across the join. */}
      <div className="relative bg-black">
        <Suspense fallback={<div>Loading...</div>}>
          <XCommuneHero />
        </Suspense>
        <FeaturedIn />
      </div>

      {/* One ground under both: the client stories swoosh runs out of its own
          section and lands in the top right of Our Impact, which it can only do
          if the two share a background instead of each painting its own. */}
      <div className="relative bg-black">
        <ClientStories />

        <OurImpact />
      </div>

      <OurPartners />

      <ClientSuccess />

      <OurServices />

      {/*  Sticky CTA  */}
      <div className="fixed bottom-0 z-50 w-full border-t-2 border-white bg-black px-4 pb-4 pt-2 md:hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <WatchToUnlockButton className="block w-full md:hidden" />
        </Suspense>
      </div>
    </MainWrapper>
  );
}

export default function XCommunePage() {
  // const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <XCommunePageContent />
    </Suspense>
  );
}
