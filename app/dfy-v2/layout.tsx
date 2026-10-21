import './dfy-v2.css';

import { Inter, Jost, Poppins } from 'next/font/google';

/* Loaded here so they ship only on /dfy-v2/*. Jost is the variable font so the
   400/600 heading mix uses real cuts; Poppins carries the 800 the hero needs. */
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  style: ['normal'],
  variable: '--font-poppins-dfy',
});

// The body face these pages were designed on.
const inter = Inter({ subsets: ['latin'] });

/* Tracking is NOT set up here: the root layout's MetaPixel and Clarity already
   run on every route, and a second pixel on this subtree would double-count.

   .dfy-v2-root is the boundary the cso skin's element rules stop at (see the
   :where(:not(.dfy-v2-root *)) guards in app/globals.css) and the scope for
   this subtree's own Tailwind preflight in dfy-v2.css. */
export default function DfyV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`dfy-v2-root ${inter.className} ${jost.variable} ${poppins.variable}`}
    >
      {children}
    </div>
  );
}
