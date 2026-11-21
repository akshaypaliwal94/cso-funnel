'use client';

import { useEffect } from 'react';

import { trackDfyViewContent } from '@/lib/track';

/** Landing-page view for /dfy-v2 (and /dfy-v3): ViewContent to the dfy pixel, once per session. */
export default function DfyFunnelTracker({ source = 'dfy_v2' }: { source?: 'dfy_v2' | 'dfy_v3' }) {
  useEffect(() => {
    trackDfyViewContent(source);
  }, [source]);

  return null;
}
