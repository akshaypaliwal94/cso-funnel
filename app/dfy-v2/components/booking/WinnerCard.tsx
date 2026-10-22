'use client';

import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

import { TextBlock } from '../common/TextBlock';

interface WinnerCardProps {
  name: string;
  image: string;
  avatar: string;
  message: ReactNode;
  instagramId: string;
  followers: string;
  isImageRight?: boolean;
}

const WinnerCard: React.FC<WinnerCardProps> = ({
  name,
  image,
  avatar,
  message,
  instagramId,
  followers,
  isImageRight = true,
}: WinnerCardProps) => {
  return (
    <div
      data-reveal
      className={cn(
        'flex flex-col md:flex-row gap-4 md:gap-6 md:items-stretch',
        isImageRight ? 'md:flex-row-reverse' : '',
      )}
    >
      {/* The portrait is FRAMED now. It used to hang in the layout as a bare
          <img> beside a panel, which is the one thing the landing page never
          does: every photograph over there sits in a clipped, ringed well
          (.dfy-face-art inside .dfy-face-card) so the image is part of the
          furniture rather than a cut-out dropped next to it. */}
      <div className="dfy-panel shrink-0 overflow-hidden p-0 md:w-72">
        <img
          src={image}
          alt={name}
          className="size-full object-cover md:h-80"
        />
      </div>

      <div className="dfy-panel relative flex flex-1 flex-col justify-between gap-4 p-5 md:gap-6 md:p-8">
        <div>
          <img
            src="/assets/images/icons/svg/double_quotation.svg"
            alt=""
            aria-hidden="true"
            className="size-7 opacity-60 md:size-8"
          />
          {/* Not italic. Italic was doing the job of "this is a quote", which
              the quotation mark above it already does; the landing page sets no
              body copy in italic anywhere. Same size and colour as every other
              paragraph in the funnel. */}
          <TextBlock className="mt-2 text-left md:mt-3">{message}</TextBlock>
        </div>

        <div className="flex flex-row items-center gap-3 md:gap-4">
          <img
            src={avatar}
            alt=""
            aria-hidden="true"
            className="size-14 shrink-0 rounded-full object-cover md:size-16"
          />
          <div className="flex min-w-0 flex-col">
            {/* .dfy-face-value: the amber ramp every name on the landing page's
                cards is set in, rather than plain white. */}
            <h3 className="dfy-face-value text-start font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-base font-bold leading-tight md:text-lg">
              {name}
            </h3>

            <span
              aria-hidden="true"
              className="dfy-face-divider my-2 block h-px w-14 md:w-16"
            />

            <div className="flex flex-row items-center gap-1.5 text-[13px] leading-normal text-white/45 md:text-sm">
              {instagramId}
              <img
                src="/assets/images/icons/svg/verify.svg"
                alt="verify"
                className="size-4 md:size-[18px]"
              />
            </div>
            <p className="text-[13px] leading-normal text-white/70 md:text-sm">
              {followers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;
