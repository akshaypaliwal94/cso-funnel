import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
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
  title: "Akshay Paliwal · Your Sales Co-Founder",
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
      <body className={`${bebas.variable} ${manrope.variable} sd-root`}>{children}</body>
    </html>
  );
}
