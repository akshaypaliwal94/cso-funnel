import React from 'react';

import SideRays from './SideRays';

/* Futuristic hero ground for /dfy-v2.

   SideRays carries the motion, one instance per top corner. Both clear to
   transparent, so the charcoal-to-black ground below is what the light sits on.

   Standing note: do NOT paint a coloured radial glow over the top of the light
   field. That was tried and it read as a blob sitting ON the effect rather than
   as part of it. */
/* Charcoal at the top where the rays originate, falling to near-black at the
   foot of the section. The rays clear to transparent, so this is the ground
   their light actually sits on. */
/* FERROFLUID_REVERT - the tuned configuration that was here before the rays
   came back, kept because it took several passes to land. Ferrofluid.tsx and
   Ferrofluid.css were deleted; the port is in git history.

     const FERRO_COLORS = ['#232176', '#3B37C4', '#6E73E0'];   // stable ref: an
     // inline literal remounts its GL context on every render

     <Ferrofluid colors={FERRO_COLORS} speed={0.1} scale={2.1} turbulence={0.9}
       fluidity={0.1} rimWidth={0.24} sharpness={3.2} shimmer={1.35} glow={1.0}
       flowDirection="down" opacity={0.7} mouseInteraction mouseStrength={1}
       mouseRadius={0.35} />

   sharpness is an EXPONENT on a value <= 1, so raising it darkens. That is the
   dial that moves visibility most, not glow. */

const GROUND =
  'linear-gradient(180deg, #1C1C1E 0%, #131315 38%, #0A0A0B 72%, #050505 100%)';

export default function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 isolate overflow-hidden"
      style={{ background: GROUND }}
    >
      {/* 0 · side rays, one source in each top corner. The shader hard-codes a
             single ray origin and derives the other corner by flipping
             coordinates, so a second corner needs a second instance. tilt is 0
             on BOTH on purpose: the flip happens before the rotation, so
             matching values already render as mirror images and a negative
             value on the left breaks the symmetry. */}
      <div className="absolute inset-0">
        <SideRays
          eager
          speed={2.5}
          rayColor1="#6366F1"
          rayColor2="#9596f9"
          intensity={1.15}
          spread={1.6}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.35}
          falloff={1.55}
          opacity={0.82}
        />
      </div>
      <div className="absolute inset-0">
        <SideRays
          eager
          speed={2.5}
          rayColor1="#6366F1"
          rayColor2="#9596f9"
          intensity={1.15}
          spread={1.6}
          origin="top-left"
          tilt={0}
          saturation={1.5}
          blend={0.35}
          falloff={1.55}
          opacity={0.82}
        />
      </div>

      {/* 1 · vignette. Eased from 0.75 to 0.45 and pushed out to start at 55%:
             at the old strength it crushed the charcoal top of GROUND into
             black, so the gradient was there but invisible. The legibility
             scrim that used to sit above this was removed along with the side
             rays it existed to protect. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 42%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}
