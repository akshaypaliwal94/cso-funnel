'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

import { DFY_V2_PRICE_LABEL } from '../price';

interface WatchToUnlockButtonProps {
  className?: string;
}

export const WatchToUnlockButton: React.FC<WatchToUnlockButtonProps> = ({
  className = '',
}) => {
  // const [secondsLeft, setSecondsLeft] = useState(secondsToUnlock);
  // const [isCallReady, setIsCallReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Forward the ENTIRE landing-page query string (utm_*, fbclid, gclid, etc.)
  // so every parameter survives the hop to the checkout page.
  const queryString = searchParams.toString();

  // No event here: AddToCart fires on checkout arrival (see lib/track.ts),
  // so a reader who taps two CTAs is not counted twice.
  const handleClick = () => {
    router.push(
      queryString ? `/dfy-v2/checkout?${queryString}` : '/dfy-v2/checkout',
    );
  };

  return (
    <div
      className={cn(
        'dfy-cta-halo mx-auto hidden w-full max-w-xl md:block',
        className,
      )}
    >
      <button type="button" onClick={handleClick} className="dfy-cta w-full">
        {/* The sweep. Sits above the fill and below the label, so the text
            never dims as it passes. */}
        <span className="dfy-cta__sheen" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 px-4 py-3 font-[family-name:var(--font-jost),ui-sans-serif,system-ui] font-semibold leading-[1.05] text-white md:px-12 md:py-4">
          <span className="text-base leading-tight drop-shadow-[0_1px_1px_rgba(120,40,0,0.45)] md:text-2xl">
            Book Your 1:1 Call With Akshay
          </span>
          <span className="flex flex-wrap items-center justify-center gap-2 text-sm font-normal normal-case md:text-base">
            <span className="text-white/55 line-through">₹499</span>
            <span className="font-extrabold">{DFY_V2_PRICE_LABEL}</span>
            {/* Tinted with the button's own top highlight (the #FFE9C7 in the
                .dfy-cta inset shadow), not neutral white. A white-on-white
                glass pill was the only cool element on a page that is warm
                everywhere else, and that is exactly the borrowed-component look
                a bespoke CTA is meant to avoid: it read as a chip dropped onto
                the button rather than as part of it. */}
            <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,233,199,0.5)] bg-[rgba(255,233,199,0.18)] px-2 py-0.5 text-xs font-semibold text-[#FFF4E2]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              100% Refundable
            </span>
          </span>
        </div>
      </button>
    </div>
  );
};
