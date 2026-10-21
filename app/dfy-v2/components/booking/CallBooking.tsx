import React, { Suspense } from 'react';

import { LEGAL } from '@/lib/legal';

import { DFY_V2_PRICE_LABEL } from '../../price';
import { MainHeading } from '../common/Heading';
import { TextBlock } from '../common/TextBlock';
import BookingWidget from './BookingWidget'; // make sure path is correct

const CallBooking = () => {
  return (
    <section className="p-6 pb-8 pt-4 md:pb-16 md:pt-6">
      <MainHeading className="mb-4 md:mb-6">
        Book Your <span className="dfy-title-orange">1:1 Call</span> With Akshay
      </MainHeading>

      <p className="mx-auto mb-4 max-w-2xl px-2 text-center text-base leading-7 text-[#C9CFDA] md:mb-6 md:text-lg">
        Pick a slot and you’re locked in for 30 minutes with{' '}
        <span className="font-semibold text-[#FF6A00]">Akshay</span>. A
        diagnostic session, not a sales pitch. If we’re not the right fit,{' '}
        <span className="font-semibold text-white">
          your {DFY_V2_PRICE_LABEL} is refunded.
        </span>
      </p>

      <TextBlock className="mb-4 text-center md:mb-6">
        Select first date, then time, answer the short questionnaire, and submit
        - so we have the details needed to <br className="hidden md:block" />{' '}
        help you on your call (takes 2-3 minutes).
      </TextBlock>

      <div className="mx-auto max-w-6xl" id="booking-section">
        <Suspense fallback={<div>Loading booking form...</div>}>
          <BookingWidget />
        </Suspense>
      </div>

      <TextBlock className="mb-2 mt-4 text-center md:mt-6">
        <span className="text-[#FF0004]">**</span>If the calendar doesn't load
        after a few seconds, try refreshing the page.
      </TextBlock>

      <TextBlock className="text-center md:mt-0">
        No available times? Just email us at{' '}
        <a href={`mailto:${LEGAL.email}`} className="text-[#FF6A00] underline">
          {LEGAL.email}
        </a>{' '}
        and we’ll get you scheduled.
      </TextBlock>
    </section>
  );
};

export default CallBooking;
