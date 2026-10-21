import React from 'react';

import { MainHeading } from '../common/Heading';
import { TextBlock } from '../common/TextBlock';
import BookingButton from './BookingButton';
import WinnerCard from './WinnerCard';

const WinnerFactory = () => {
  return (
    <section className="px-4 py-8 md:px-4 md:py-16">
      <MainHeading className="mb-3 md:mb-6">
        We are a <br className="block md:hidden" />{' '}
        <span className="dfy-title-orange">Winners Factory</span>...
      </MainHeading>
      <TextBlock className="mb-8 text-center md:mb-12">
        We only work with coaches & creators who are aiming to be No. 1 in their
        market…
      </TextBlock>

      <div className="mx-auto mb-8 flex w-full max-w-[950px] flex-col items-center justify-center gap-4">
        <WinnerCard
          name="Hirav Mehta | Fitness Content Creator"
          avatar="/assets/images/x-commune/avatar/hirav.png"
          message={
            <>
              “I’ve been building my physique for 6 years but I always wanted to
              monetize my knowledge in the fitness industry. With TGO, now I’m
              making consistent{' '}
              <span className="text-[#FF6A00]">6 figures every month</span> by
              implementing the exact process from generating leads to closing
              clients.”
            </>
          }
          image="/assets/images/x-commune/winners/hirav.png"
          instagramId="@muscle_mehta"
          followers="1.6M+ Followers"
          isImageRight={false}
        />

        <WinnerCard
          name="Hardik Dhawal | Floor Trainer turned Online Coach"
          avatar="/assets/images/x-commune/avatar/hardik.png"
          message={
            <>
              “From 1st March to 1st April, we pulled in a solid{' '}
              <span className="text-[#FF6A00]">₹2,97,614 in revenue</span> from
              new clients alone, with just ₹12,295 spent on ads. That’s some
              next-level ROI magic! No funnels, no agencies and working on my
              own schedule.”
            </>
          }
          image="/assets/images/x-commune/winners/hardik.png"
          instagramId="@hardiksinghfitness"
          followers="2500+ Followers"
          isImageRight={false}
        />
      </div>

      <BookingButton>Book Your hybrid growth Call</BookingButton>
      {/* <WinnerCard
        title="Custom Logo"
        subTitle="Strengthen Your Brand Identity"
        description="Incorporate your business’s logo into the app, ensuring your brand is front and center. Create a cohesive experience that clients instantly recognize."
        imageSrc="/assets/images/feature/custom-logo.png"
        altText="Multi-Week Plans"
        buttonText="Get Lifetime Access"
        isImageRight={false}
        hasDarkBackground={false}
      /> */}
    </section>
  );
};

export default WinnerFactory;
