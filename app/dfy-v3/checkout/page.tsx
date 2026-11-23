'use client';

import CheckoutView, { type CheckoutCopy } from '@/app/dfy-v2/checkout/CheckoutView';

/* Every line here is the /dfy-v3 page's own copy. */
const DFY_V3_COPY: CheckoutCopy = {
  source: 'dfy_v3',
  titleWhite: 'Request Your',
  titleOrange: 'Diagnostic Review.',
  intro: 'A small application fee helps us prioritize serious enquiries.',
  productTitle: 'TGO AI Growth Engine',
  productBody:
    'We review your application for fit and, if appropriate, proceed with the diagnostic call and scope discussion.',
  lineItem: 'Application fee',
  detailsHint: 'We’ll use your application to evaluate fit and prepare for a diagnostic conversation.',
  successPath: '/dfy-v3/call-booking',
  prefillFromQuiz: true,
};

export default function DfyV3CheckoutPage() {
  return <CheckoutView copy={DFY_V3_COPY} />;
}
