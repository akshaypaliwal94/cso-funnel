import './dfy-v3.css';

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TGO AI Growth Engine | Get More Paying Clients From Meta Ads',
  description:
    'Get more paying clients from Meta Ads without paying a marketing agency every month. TGO diagnoses growth leaks, installs your advertising systems and AI Growth Command Center, and trains you to use them.',
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

/* dfy-v2-root is the class the cso skin's element rules in app/globals.css
   skip, so this page's own stylesheet is the only one styling it. */
export default function DfyV3Layout({ children }: { children: React.ReactNode }) {
  return <div className={`dfy-v2-root dfy3 ${inter.className}`}>{children}</div>;
}
