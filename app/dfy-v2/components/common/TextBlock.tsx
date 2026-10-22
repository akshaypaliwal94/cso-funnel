import React from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

interface TextBlockProps {
  children: React.ReactNode;
  className?: string;
  // align?: 'left' | 'center' | 'right';
}

export const TextBlock: React.FC<TextBlockProps> = ({
  children,
  className,
  // align = 'center',
}) => {
  return (
    <div
      className={cn(
        /* Flat body colour, not a clipped gradient.

         A gradient on body copy is a display treatment applied to reading text:
         it drags the ends of every line towards 50% opacity, which costs
         contrast exactly where a visitor is trying to read instructions. The
         landing page sets all of its body copy in one flat #C9CFDA, and so does
         this now. Gradients stay on headings, where the line is short enough
         that the falloff reads as light rather than as fading. */
        'text-[15px] leading-[1.65] text-[#C9CFDA] md:text-lg',
        className,
      )}
    >
      {children}
    </div>
  );
};
