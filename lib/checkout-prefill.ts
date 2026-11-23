/* The details typed into the /dfy-v3 quiz, held in sessionStorage so its
   checkout opens already filled in. */
export const PREFILL_KEY = 'dfy_checkout_prefill';

export type CheckoutPrefill = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string; // E.164, what the checkout's phone field takes
};
