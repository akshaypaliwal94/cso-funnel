import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import Clarity from "@/components/Clarity";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

/**
 * The two faces are RETAINED from the SDP skin. The client's colour system is a
 * colour system only: it specifies no typefaces. Until they supply a type
 * direction, keeping SDP's pairing is a smaller invention than picking two new
 * faces for a brand that has not chosen them.
 *
 * The ROLES never change: --fh is the condensed all-caps DISPLAY voice, --fb
 * the clean geometric BODY voice.
 */
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akshay Paliwal · Your Fractional Sales Co-Founder",
  description:
    "As your sales co-founder, I find exactly where your revenue is leaking, fix it by automating 70% of your sales process with custom-built AI systems, then get you (or your team) closing at up to 50%.",
};

export const viewport: Viewport = {
  /* Obsidian: the page's default ground, so the browser chrome matches it. */
  themeColor: "#0D0D12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${manrope.variable} sd-root`}>
        {children}
        {/* EVERY ROUTE, not just the landing page.

            MetaPixel does two jobs: the pixel base code plus PageView, and,
            ABOVE its own pixel-id guard, the first-touch attribution capture.
            Both have to run on every route, because a retargeting ad or an
            email can drop someone straight onto /checkout, and that visit is
            the only one carrying the campaign. One click later the UTMs and
            the fbclid are gone from the url for good.

            Clarity is the whole analytics layer on this project: no GA4 base
            tag, no Measurement Protocol, by Atul's scope call. Both components
            render nothing when their env id is missing, so an unfilled value
            leaves no broken script tag behind. */}
        <MetaPixel />
        <Clarity />
      </body>
    </html>
  );
}
