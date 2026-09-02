import { Faq } from "./_landing/Faq";
import { Featured } from "./_landing/Featured";
import { FinalCta } from "./_landing/FinalCta";
import { ForYouIf } from "./_landing/ForYouIf";
import { Founder } from "./_landing/Founder";
import { Hero } from "./_landing/Hero";
import { Mechanism } from "./_landing/Mechanism";
import { Process60 } from "./_landing/Process60";
import { RevealRoot } from "./_landing/Reveal";
import { StickyCta } from "./_landing/StickyCta";
import { SuccessStories } from "./_landing/SuccessStories";

/**
 * Section order is the COPY SOURCE'S order, not the blueprint's default.
 * The blueprint puts the founder beat before the mechanism; this client's
 * document puts it after the process. The source is the client's running order
 * and it wins. Everything else follows the VSL blueprint beat for beat.
 *
 * BAND RHYTHM — inverted, because the skin is inverted. The client's system
 * states Obsidian is "90% of every screen", so dark is the ground and the ONE
 * light band is the rare accent:
 *
 *   hero OBSIDIAN (masked hero-field bloom) · trust hairline · fit GRAPHITE ·
 *   proof BONE (the single light band) · mechanism OBSIDIAN ·
 *   the 60-day install DEPTH FADE · founder ABYSS · FAQ GRAPHITE ·
 *   finale ABYSS FLOOR (the deepest point, and the page's peak).
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <Featured />
      <ForYouIf />
      <SuccessStories />
      <Mechanism />
      <Process60 />
      <Founder />
      <Faq />
      <FinalCta />

      <StickyCta />
      <RevealRoot />
    </main>
  );
}
