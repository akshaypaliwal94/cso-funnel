'use client';

/* eslint-disable react/button-has-type */
import type { ButtonHTMLAttributes } from 'react';
import React from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  hoverClass?: string;
}

const BookingButton: React.FC<ButtonProps> = ({
  // children,
  type = 'button',
  className,
  disabled = false,
  hoverClass,
  ...props
}) => {
  /* The page's own CTA, not a flat orange rectangle sitting on a PNG. The
     wrapper used to paint button-bg.png / button-mbg.png behind a plain
     background-colour button: two different button languages stacked, neither
     of them the one the landing page uses. .dfy-cta brings the gradient, the
     inset lip and the sweeping sheen with it. */
  const baseStyles =
    'dfy-cta w-full px-6 md:px-12 py-4 text-base md:text-lg font-semibold uppercase text-white font-[family-name:var(--font-jost),ui-sans-serif,system-ui]';

  const handleClick = () => {
    const section = document.getElementById('booking-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="dfy-cta-halo mx-auto w-fit max-w-full">
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        {...props}
        className={cn(
          baseStyles,
          className,
          disabled && 'opacity-50 cursor-not-allowed',
          hoverClass,
        )}
      >
        <span className="dfy-cta__sheen" aria-hidden="true" />
        <span className="relative z-10">Book Your hybrid growth Call</span>
      </button>
    </div>
  );
};

export default BookingButton;
