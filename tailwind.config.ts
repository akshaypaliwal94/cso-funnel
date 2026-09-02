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
      colors: {
        voltage: "var(--voltage)",
        obsidian: "var(--obsidian)",
        graphite: "var(--graphite)",
        amber: "var(--amber)",
        bone: "var(--bone)",
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
