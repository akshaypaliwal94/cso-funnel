'use client';

/* LightRays.

   Ported to TypeScript alongside SideRays: this project runs `strict` with
   `allowJs: false`, so the original .jsx would not compile. Same lifecycle
   shape as SideRays — the init effect depends on visibility and origin only,
   and every other prop is pushed straight into the uniforms, because listing
   them all would tear the WebGL context down and rebuild it on a colour change.

   Two changes to the shader itself:

   1. The channel ramp is now anchored to the SOURCE rather than to the top of
      the viewport. The original hard-codes `1.0 - coord.y / height`, which
      warms the top of the canvas and cools the bottom — correct for rays
      falling from above, backwards for rays rising from below, where it would
      tint the far end of the beam instead of its root.

   2. An `opacity` uniform scales the final alpha, so the same shader can run at
      an ambient level without washing the colour out to get there.

   followMouse is kept but defaults off: on this page the light is scenery, and
   a beam that leans toward the cursor pulls attention to itself. */

import './LightRays.css';

import type * as OglModule from 'ogl';
import React, { useEffect, useRef, useState } from 'react';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface LightRaysProps {
  /* Skip the visibility gate: for an instance that is above the fold at
     load, waiting on an observer callback is pure latency. */
  eager?: boolean;
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  opacity?: number;
  sourceOutside?: number;
  className?: string;
}

/* A named shape rather than Record<string, ...>: under
   `noUncheckedIndexedAccess` every index access into a Record is typed
   `| undefined`, so `uniforms.iTime.value = x` does not compile. Declared as a
   TYPE (not an interface) so it stays assignable to ogl's uniform parameter. */
type U = { value: number | number[] };
type Uniforms = {
  iTime: U;
  iResolution: U;
  rayPos: U;
  rayDir: U;
  raysColor: U;
  raysSpeed: U;
  lightSpread: U;
  rayLength: U;
  pulsating: U;
  fadeDistance: U;
  saturation: U;
  mousePos: U;
  mouseInfluence: U;
  noiseAmount: U;
  distortion: U;
  opacity: U;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  // destructured, so the guard below narrows each group to string
  const [, r, g, b] = m;
  if (!r || !g || !b) return [1, 1, 1];
  return [parseInt(r, 16) / 255, parseInt(g, 16) / 255, parseInt(b, 16) / 255];
};

/* `outside` is how far beyond the canvas the source sits, as a fraction of the
   canvas size. The default fifth means the rays are already spreading by the
   time they cross the visible edge — right for a light that is meant to be off
   somewhere past the frame. Push it to 0 and the source lands exactly on the
   edge instead, which is what you want when something on the page is supposed
   to be hiding the lamp. */
const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number,
  outside: number,
): { anchor: [number, number]; dir: [number, number] } => {
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

/* WebGL context creation can fail, and when it does ogl's Renderer throws from
   its constructor — which, inside a render effect, takes the whole page down
   with it rather than just losing the effect. The usual cause is the per-tab
   context limit: browsers cap how many a page may hold, and every teardown and
   rebuild burns another one until the old ones are collected. Returning null
   here means the component simply renders nothing. */
type Ogl = typeof OglModule;
type Mesh = OglModule.Mesh;
type Renderer = OglModule.Renderer;

const createRenderer = (OGL: Ogl): Renderer | null => {
  try {
    const renderer = new OGL.Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    return renderer.gl ? renderer : null;
  } catch {
    return null;
  }
};

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float opacity;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  // Hot at the root of the beam, cooling along its length. Keyed to the ray
  // direction rather than to the top of the canvas, so it reads the same way
  // whether the light falls from above or rises from below.
  float axis = coord.y / iResolution.y;
  float brightness = rayDir.y > 0.0 ? 1.0 - axis : axis;
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
  fragColor *= opacity;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = false,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  opacity = 1.0,
  sourceOutside = 0.2,
  eager = false,
  className = '',
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  /* An eager instance is on screen at load, so it starts out drawing; the
     observer below still pauses it once it scrolls away. */
  const visibleRef = useRef(eager);
  const [hasBeenVisible, setHasBeenVisible] = useState(eager);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    /* Visibility drives whether the loop DRAWS, not whether the context
       exists. Tearing the context down every time the section scrolls out and
       rebuilding it on the way back is what exhausts the per-tab context limit:
       a released context is not reclaimed immediately, so the churn stacks up
       until creation starts failing. */
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        visibleRef.current = visible;
        if (visible) setHasBeenVisible(true);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!hasBeenVisible || !containerRef.current) return undefined;

    cleanupRef.current?.();
    cleanupRef.current = null;

    let disposed = false;

    const init = async () => {
      /* ogl is fetched HERE rather than imported at the top of the file. A
         static import puts the whole library in the page's first JS payload, so
         it has to arrive, parse and execute before React can render anything at
         all: the light was delaying the text. Loaded on demand it costs nothing
         until the effect runs, and the page paints without it. */
      const OGL = await import('ogl');

      /* One frame, not an arbitrary 10ms. rAF fires immediately after layout,
         which is the actual thing being waited for, and on a fast machine that
         is well under 10ms. */
      await new Promise((r) => {
        requestAnimationFrame(() => r(null));
      });
      const host = containerRef.current;
      if (disposed || !host) return;

      const renderer = createRenderer(OGL);
      if (!renderer) return;
      rendererRef.current = renderer;

      const { gl } = renderer;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      host.replaceChildren(canvas);
      /* The first frame is drawn into a transparent canvas and faded up. The
         light cannot be made instant, but arriving over 700ms reads as the
         scene lighting itself, where appearing all at once reads as something
         that was late. */
      host.style.opacity = '0';
      requestAnimationFrame(() => {
        host.style.transition = 'opacity 700ms var(--dfy-ease, ease-out)';
        host.style.opacity = '1';
      });

      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: followMouse ? mouseInfluence : 0 },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
        opacity: { value: opacity },
      };
      uniformsRef.current = uniforms;

      const mesh = new OGL.Mesh(gl, {
        geometry: new OGL.Triangle(gl),
        program: new OGL.Program(gl, {
          vertex: VERT,
          fragment: FRAG,
          uniforms,
        }),
      });
      meshRef.current = mesh;

      const updateSize = () => {
        const node = containerRef.current;
        if (!node || !rendererRef.current) return;
        renderer.dpr = Math.min(window.devicePixelRatio, 2);
        const { clientWidth: wCss, clientHeight: hCss } = node;
        renderer.setSize(wCss, hCss);
        const w = wCss * renderer.dpr;
        const h = hCss * renderer.dpr;
        uniforms.iResolution.value = [w, h];
        const { anchor, dir } = getAnchorAndDir(
          raysOrigin,
          w,
          h,
          sourceOutside,
        );
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      let raf = 0;
      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }
        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0) {
          const smoothing = 0.92;
          smoothMouseRef.current.x =
            smoothMouseRef.current.x * smoothing +
            mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y =
            smoothMouseRef.current.y * smoothing +
            mouseRef.current.y * (1 - smoothing);
          uniforms.mousePos.value = [
            smoothMouseRef.current.x,
            smoothMouseRef.current.y,
          ];
        }

        try {
          // idle while off-screen: the context stays, the GPU work stops
          if (visibleRef.current) renderer.render({ scene: mesh });
          raf = requestAnimationFrame(loop);
        } catch {
          /* context lost: stop rather than throw every frame */
        }
      };

      window.addEventListener('resize', updateSize);
      updateSize();
      raf = requestAnimationFrame(loop);

      cleanupRef.current = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', updateSize);
        try {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          canvas.parentNode?.removeChild(canvas);
        } catch {
          /* already gone */
        }
        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    init();

    return () => {
      disposed = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [hasBeenVisible, raysOrigin]);

  /* Prop changes go straight into the uniforms: no GL teardown. */
  useEffect(() => {
    const u = uniformsRef.current;
    const renderer = rendererRef.current;
    const node = containerRef.current;
    if (!u || !renderer || !node) return;
    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = followMouse ? mouseInfluence : 0;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;
    u.opacity.value = opacity;

    const { clientWidth: wCss, clientHeight: hCss } = node;
    const { anchor, dir } = getAnchorAndDir(
      raysOrigin,
      wCss * renderer.dpr,
      hCss * renderer.dpr,
      sourceOutside,
    );
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    opacity,
    raysOrigin,
    sourceOutside,
  ]);

  useEffect(() => {
    if (!followMouse) return undefined;
    const onMove = (e: MouseEvent) => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
