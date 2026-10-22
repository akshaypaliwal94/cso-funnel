'use client';

import { useEffect } from 'react';

import { trackDfyViewContent } from '@/lib/track';

/** Landing-page view for /dfy-v2: ViewContent to its own pixel, once per session. */
export default function DfyFunnelTracker() {
  useEffect(() => {
    trackDfyViewContent();
  }, []);

  return null;
}
