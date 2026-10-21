import type { ReactNode } from 'react';
import React from 'react';

import { cn } from '@/app/dfy-v2/_lib/cn';

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

/* The funnel's section heading, wearing the landing page's masthead.

   Solid white, NOT .dfy-title-white, and that is the point rather than a
   shortcut.

   .dfy-title-white is a vertical ramp that maps to its element's BOX. On the
   landing page it only ever wraps a short single-line fragment ("Brands we have
   "), so the ramp maps to one line's height and the grey lands on the feet of
   those letters, which is what it was tuned for.

   These headings run to two and three lines. Put the same class around all of
   them and the ramp stretches across the whole block: the top line comes out
   flat and only the last line gets any grey, which reads as a broken gradient
   rather than as lit type. box-decoration-break: clone is supposed to give each
   line fragment its own box and does not do so reliably with
   background-clip: text, which is exactly why the landing hero splits its title
   into one BLOCK span per line instead of relying on it. This component takes
   arbitrary children, so it cannot split them into lines.

   Between a gradient that mis-maps and no gradient, no gradient is closer to
   the landing page: the ramp there is subtle enough that a flat white reads as
   the same heading, while a ramp spread over three lines does not.

   Accent words are the caller's job: wrap them in .dfy-title-orange. Those are
   short, single-line, and map correctly. */
export const MainHeading: React.FC<HeadingProps> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        'text-center font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[7vw] font-bold leading-tight text-white md:text-[42px]',
        className,
      )}
    >
      {children}
    </h2>
  );
};

// export const SubHeading: React.FC<HeadingProps> = ({ children, className }) => {
//   const defaultClasses =
//     'font-gilroy text-lg md:text-2xl lg:text-3xl leading-120 text-[#191825]';

//   return <h2 className={cn(defaultClasses, className)}>{children}</h2>;
// };
