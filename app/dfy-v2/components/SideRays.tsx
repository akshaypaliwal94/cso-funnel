'use client';

/* SideRays.

   Ported to TypeScript: this project runs `strict` with `allowJs: false`, so the
   original .jsx would not compile. Shader, uniforms and lifecycle are unchanged.

   One fix: the init effect no longer lists every prop in its dependency array.
   It did, which meant changing a colour or a speed tore down the WebGL context
   and rebuilt it, including the 10ms init delay. The second effect already
   pushes those values straight into the uniforms, so init depends on visibility
   and origin alone. */

import './SideRays.css';

import type * as OglModule from 'ogl';
import React, { useEffect, useRef, useState } from 'react';

export type RaysOrigin =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface SideRaysProps {
  /* Skip the visibility gate: for an instance that is above the fold at
     load, waiting on an observer callback is pure latency. */
  eager?: boolean;
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: RaysOrigin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
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
  iSpeed: U;
  iRayColor1: U;
  iRayColor2: U;
  iIntensity: U;
  iSpread: U;
  iFlipX: U;
  iFlipY: U;
  iTilt: U;
  iSaturation: U;
  iBlend: U;
  iFalloff: U;
  iOpacity: U;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  // destructured, so the guard below narrows each group to string
  const [, r, g, b] = m;
  if (!r || !g || !b) return [1, 1, 1];
  return [parseInt(r, 16) / 255, parseInt(g, 16) / 255, parseInt(b, 16) / 255];
};

const originToFlip = (origin: RaysOrigin): [number, number] => {
  switch (origin) {
    case 'top-left':
      return [1, 0];
    case 'bottom-right':
      return [0, 1];
    case 'bottom-left':
      return [1, 1];
    default:
      return [0, 0];
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
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);

  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export default function SideRays({
  speed = 2.5,
  rayColor1 = '#EAB308',
  rayColor2 = '#96c8ff',
  intensity = 2,
  spread = 2,
  origin = 'top-right',
  tilt = 0,
  saturation = 1.5,
  blend = 0.75,
  falloff = 1.6,
  opacity = 1.0,
  eager = false,
  className = '',
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
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

      const [flipX, flipY] = originToFlip(origin);
      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        iSpeed: { value: speed },
        iRayColor1: { value: hexToRgb(rayColor1) },
        iRayColor2: { value: hexToRgb(rayColor2) },
        iIntensity: { value: intensity },
        iSpread: { value: spread },
        iFlipX: { value: flipX },
        iFlipY: { value: flipY },
        iTilt: { value: tilt },
        iSaturation: { value: saturation },
        iBlend: { value: blend },
        iFalloff: { value: falloff },
        iOpacity: { value: opacity },
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
        const { clientWidth: w, clientHeight: h } = node;
        renderer.setSize(w, h);
        uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
      };

      let raf = 0;
      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }
        uniforms.iTime.value = t * 0.001;
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
  }, [hasBeenVisible, origin]);

  /* Prop changes go straight into the uniforms: no GL teardown. */
  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    u.iSpeed.value = speed;
    u.iRayColor1.value = hexToRgb(rayColor1);
    u.iRayColor2.value = hexToRgb(rayColor2);
    u.iIntensity.value = intensity;
    u.iSpread.value = spread;
    const [flipX, flipY] = originToFlip(origin);
    u.iFlipX.value = flipX;
    u.iFlipY.value = flipY;
    u.iTilt.value = tilt;
    u.iSaturation.value = saturation;
    u.iBlend.value = blend;
    u.iFalloff.value = falloff;
    u.iOpacity.value = opacity;
  }, [
    speed,
    rayColor1,
    rayColor2,
    intensity,
    spread,
    origin,
    tilt,
    saturation,
    blend,
    falloff,
    opacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`side-rays-container ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
