'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

const NAMESPACE = 'tgo-hybrid-growth-call';
const CAL_LINK = 'trainergoesonline/tgo-hybrid-growth-call';
const ELEMENT_ID = 'my-cal-inline-tgo-hybrid-growth-call';

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

const BookingWidget = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useRef(false);

  useEffect(() => {
    // Once only: a second run (React strict mode) would stack a second iframe.
    if (mounted.current) return;
    mounted.current = true;
    loadCal();
    const Cal = window.Cal!;
    Cal('init', NAMESPACE, { origin: 'https://app.cal.com' });
    // Forwards the page's whole query string (utm_*, fbclid, payment id) into the booking.
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;

    // Set synchronously by the 'init' call above.
    const cal = Cal.ns[NAMESPACE]!;
    cal('inline', {
      elementOrSelector: `#${ELEMENT_ID}`,
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
        theme: 'auto',
      },
      calLink: CAL_LINK,
    });
    cal('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#eb5e00' },
        dark: { 'cal-brand': '#eb5e00' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });
    cal('on', {
      action: 'bookingSuccessfulV2',
      callback: () => {
        const qs = searchParams.toString();
        router.push(`/dfy-v2/call-booked${qs ? `?${qs}` : ''}`);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id={ELEMENT_ID}
      style={{ width: '100%', minHeight: '781px', overflow: 'scroll' }}
    />
  );
};

export default BookingWidget;
