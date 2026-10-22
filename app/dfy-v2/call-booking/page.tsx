'use client';

import MainWrapper from '@/app/dfy-v2/components/common/Main';

import CallBooking from '../components/booking/CallBooking';
import WhatsAppReviews from '../components/booking/WhatsAppReviews';
import WinnerFactory from '../components/booking/WinnerFactory';
import WinnerSlider from '../components/booking/WinnerSlider';
import Header from '../components/common/Header';
import RevealOnScroll from '../components/RevealOnScroll';

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
        <CallBooking />
      </div>

      <WinnerFactory />
      <WinnerSlider />
      <WhatsAppReviews />
    </MainWrapper>
  );
}
