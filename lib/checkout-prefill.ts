/* The /dfy-v3 quiz answers, held in sessionStorage until its checkout sends
   them to Pabbly alongside the details the buyer types there. */
export const PREFILL_KEY = 'dfy_checkout_prefill';

export type CheckoutPrefill = {
  /* Question key to the answer's label, e.g. revenue: "₹2–5 lakh". */
  quiz?: Record<string, string>;
};
