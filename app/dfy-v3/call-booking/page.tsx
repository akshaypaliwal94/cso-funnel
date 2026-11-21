'use client';

import CallBooking from '@/app/dfy-v2/components/booking/CallBooking';
import WhatsAppReviews from '@/app/dfy-v2/components/booking/WhatsAppReviews';
import WinnerFactory from '@/app/dfy-v2/components/booking/WinnerFactory';
import WinnerSlider from '@/app/dfy-v2/components/booking/WinnerSlider';
import Header from '@/app/dfy-v2/components/common/Header';
import MainWrapper from '@/app/dfy-v2/components/common/Main';
import RevealOnScroll from '@/app/dfy-v2/components/RevealOnScroll';

/* /dfy-v2/call-booking exactly, except a booked slot lands on /dfy-v3/thank-you. */
export default function DfyV3CallBookingPage() {
  return (
    <MainWrapper isShowFooter footerClass="bg-black text-white" className="bg-[#07080A]">
      <RevealOnScroll />

      <div className="bg-black">
        <Header />
        <CallBooking bookedPath="/dfy-v3/thank-you" />
      </div>

      <WinnerFactory />
      <WinnerSlider />
      <WhatsAppReviews />
    </MainWrapper>
  );
}
