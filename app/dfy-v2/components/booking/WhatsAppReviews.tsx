import React from 'react';

import BookingButton from './BookingButton';

const images = [
  { src: '/assets/images/x-commune/whatsapp-reviews/1.png', alt: 'Image 1' },
  { src: '/assets/images/x-commune/whatsapp-reviews/2.png', alt: 'Image 2' },
  { src: '/assets/images/x-commune/whatsapp-reviews/3.png', alt: 'Image 3' },
  { src: '/assets/images/x-commune/whatsapp-reviews/4.png', alt: 'Image 4' },
  { src: '/assets/images/x-commune/whatsapp-reviews/5.png', alt: 'Image 5' },
  { src: '/assets/images/x-commune/whatsapp-reviews/6.png', alt: 'Image 6' },
  { src: '/assets/images/x-commune/whatsapp-reviews/7.png', alt: 'Image 7' },
  { src: '/assets/images/x-commune/whatsapp-reviews/8.png', alt: 'Image 8' },
  { src: '/assets/images/x-commune/whatsapp-reviews/9.png', alt: 'Image 9' },
  { src: '/assets/images/x-commune/whatsapp-reviews/10.png', alt: 'Image 10' },
];

const WhatsAppReviews = () => {
  return (
    <section className="px-6 py-8 md:px-4 md:py-16">
      <div className="mx-auto mb-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-4">
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full rounded-xl object-cover shadow"
            />
          </div>
        ))}
      </div>

      <BookingButton>
        CALL BOOKING STARTS IN <span className="font-mono">4:59</span>
      </BookingButton>
    </section>
  );
};

export default WhatsAppReviews;
