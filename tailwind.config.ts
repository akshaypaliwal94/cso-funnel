import type { Config } from "tailwindcss";

/**
 * Tailwind is scaffolding only. The landing page is built in the SIGNAL & DEPTH
 * skin (the client's own colour system, see /design-system.project.md), which is
 * a vanilla `.sd-*` / `.sdp-*` CSS system living in app/globals.css. Preflight
 * is disabled so Tailwind's reset cannot fight the skin's own base rules (the
 * skin owns paragraph margins, and a stray reset there is what silently drifts
 * whole sections off-centre).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      /* fontSize, lineHeight and primary: the TGO-Marketing values the /dfy-v2
         pages were built on (size only, no paired line-height). No other page
         uses these utilities. */
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      lineHeight: {
        "100": "100%",
        "120": "120%",
        "130": "130%",
        "140": "140%",
        "160": "160%",
      },
      colors: {
        voltage: "var(--voltage)",
        obsidian: "var(--obsidian)",
        graphite: "var(--graphite)",
        amber: "var(--amber)",
        bone: "var(--bone)",
        primary: {
          1000: "#ff572217",
          1050: "#facd4914",
          1100: "#EE6C29",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
