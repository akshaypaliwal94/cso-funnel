'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

/* Which Cal event the widget embeds. dfy-v2 books Akshay's audit; /dfy-v3
   passes its own. */
export type CalEvent = { namespace: string; calLink: string };

export const DFY_V2_CAL: CalEvent = {
  namespace: 'audit',
  calLink: 'akshay-paliwal-zxrvel/audit',
};

export const DFY_V3_CAL: CalEvent = {
  namespace: 'tgo-ai-growth-engine-call',
  calLink: 'trainergoesonline/tgo-ai-growth-engine-call',
};

type CalApi = ((...args: unknown[]) => void) & {
  ns: Record<string, (...args: unknown[]) => void>;
  config?: Record<string, unknown>;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/* Cal.com's own loader snippet, unchanged: it queues calls until embed.js loads. */
function loadCal() {
  /* eslint-disable */
  (function (C: any, A: string, L: string) {
    let p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    let d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  /* eslint-enable */
}

const BookingWidget = ({
  bookedPath = '/dfy-v2/call-booked',
  event = DFY_V2_CAL,
}: {
  bookedPath?: string;
  event?: CalEvent;
}) => {
  const elementId = `my-cal-inline-${event.namespace}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useRef(false);

  useEffect(() => {
    // Once only: a second run (React strict mode) would stack a second iframe.
    if (mounted.current) return;
    mounted.current = true;
    loadCal();
    const Cal = window.Cal!;
    Cal('init', event.namespace, { origin: 'https://app.cal.com' });
    // Forwards the page's whole query string (utm_*, fbclid, payment id) into the booking.
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;

    // Set synchronously by the 'init' call above.
    const cal = Cal.ns[event.namespace]!;
    cal('inline', {
      elementOrSelector: `#${elementId}`,
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
        theme: 'auto',
      },
      calLink: event.calLink,
    });
    cal('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#eb5e00' },
        dark: { 'cal-brand': '#eb5e00' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
    /* Newer embeds fire bookingSuccessfulV2, older ones bookingSuccessful;
       some fire both, hence the guard. */
    let redirected = false;
    const onBooked = () => {
      if (redirected) return;
      redirected = true;
      const qs = searchParams.toString();
      router.push(`${bookedPath}${qs ? `?${qs}` : ''}`);
    };
    cal('on', { action: 'bookingSuccessfulV2', callback: onBooked });
    cal('on', { action: 'bookingSuccessful', callback: onBooked });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id={elementId}
      style={{ width: '100%', minHeight: '781px', overflow: 'scroll' }}
    />
  );
};

export default BookingWidget;
