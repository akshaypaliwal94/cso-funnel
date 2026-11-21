import '../dfy-v2/dfy-v2.css';

import { Jost, Poppins } from 'next/font/google';

/* The /dfy-v3 checkout, call-booking and thank-you pages are dfy-v2's own components, so
   they need dfy-v2's stylesheet and display faces. The dfy-v2-root boundary
   comes from the dfy-v3 layout. */
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-poppins-dfy',
});

export default function DfyV2Skin({ children }: { children: React.ReactNode }) {
  return <div className={`${jost.variable} ${poppins.variable}`}>{children}</div>;
}
