'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import 'react-phone-number-input/style.css';

import { useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';

import Loading from '@/app/dfy-v2/components/common/Loading';
import { collectSignals } from '@/lib/client-signals';
import { LEGAL } from '@/lib/legal';
import { PRODUCT_NAME } from '@/lib/offer';
import { trackDfyAddToCart, trackDfyInitiateCheckout } from '@/lib/track';

import RevealOnScroll from '../components/RevealOnScroll';
import { DFY_V2_PRICE_LABEL } from '../price';

const ORIGINAL_PRICE = '₹499';
const PRICE = DFY_V2_PRICE_LABEL;

type RazorpayWindow = {
  Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
};

const RZP_SDK = 'https://checkout.razorpay.com/v1/checkout.js';

// Loaded on demand: ~100KB that only matters once someone presses pay.
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as unknown as RazorpayWindow).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RZP_SDK}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const el = document.createElement('script');
    el.src = RZP_SDK;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // E.164 (from PhoneInput)
  city: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
}

// ---- Icons (funnel-orange) for the trust + payment chips ----
const ICON = 'shrink-0';
const TickIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 33 33"
    fill="none"
    className={ICON}
    aria-hidden="true"
  >
    <path
      d="M12.2305 27.7505L3.7915 19.3115L7.63731 15.4657L12.2305 20.0725L25.6569 6.63254L29.5027 10.4783L12.2305 27.7505Z"
      fill="#FF6A00"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const ShieldCheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const CardIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
const WalletIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF6A00"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={ICON}
    aria-hidden="true"
  >
    <path d="M19 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
    <path d="M21 12h-5a2 2 0 0 0 0 4h5v-4Z" />
  </svg>
);

const trustItems = [
  { label: 'SSL Secure', icon: <LockIcon /> },
  { label: 'Verified', icon: <ShieldCheckIcon /> },
  { label: 'Protected', icon: <CheckCircleIcon /> },
  { label: 'Instant', icon: <ClockIcon /> },
];

const inputClass = 'dfy-field';
const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#C9CFDA]';
const hintClass = 'text-[11px] font-semibold text-white/50';

const CheckoutContent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
  });
  const [country, setCountry] = useState<string>('IN');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false);

  const searchParams = useSearchParams();
  // Full incoming query string - forwarded verbatim to the call-booking page
  // after payment.
  const queryString = searchParams.toString();

  const computeErrors = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!data.phone) newErrors.phone = 'Phone number is required';
    if (!data.city.trim()) newErrors.city = 'City is required';
    return newErrors;
  };

  const validateForm = (): boolean => {
    const newErrors = computeErrors(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value: string | undefined): void => {
    setFormData((prev) => ({ ...prev, phone: value || '' }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  // Checkout arrival: DFYAddToCart, ref-guarded against StrictMode's double run.
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackDfyAddToCart();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isLoading || !validateForm()) return;

    const parsed = formData.phone
      ? parsePhoneNumber(formData.phone)
      : undefined;
    const countryIso = (parsed?.country || country || 'IN').toLowerCase();
    const dialCode = parsed ? `+${parsed.countryCallingCode}` : '';
    // E.164 digits without the plus: what Meta and create-order expect.
    const phoneDigits = formData.phone.replace(/\D/g, '');

    const person = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      phone: phoneDigits,
      country: countryIso,
    };

    setIsLoading(true);
    trackDfyInitiateCheckout(person);

    try {
      if (!(await loadRazorpay())) throw new Error('sdk');

      // No amount is sent: the server reads it from lib/offer.ts.
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...person,
          ...collectSignals(),
          funnel: 'dfy_v2',
          dialCode,
        }),
      });
      const created = await res.json();

      if (!res.ok || !created?.ok) {
        setIsLoading(false);
        alert(
          created?.reason === 'not-configured'
            ? 'Payments are not switched on yet. Nothing has been charged.'
            : 'Failed to initiate payment. Please try again.',
        );
        return;
      }

      const rzp = new (window as unknown as RazorpayWindow).Razorpay!({
        key: created.keyId,
        order_id: created.orderId,
        amount: created.amount,
        currency: created.currency,
        name: LEGAL.brand,
        description: PRODUCT_NAME,
        prefill: {
          name: `${person.firstName} ${person.lastName}`.trim(),
          email: person.email,
          contact: formData.phone,
        },
        theme: { color: '#FF6A00' },
        modal: { ondismiss: () => setIsLoading(false) },
        // DFYPurchase is fired by the Razorpay webhook, not here: UPI payers often
        // never return to this tab.
        handler: (r: { razorpay_payment_id: string }) => {
          const qs = new URLSearchParams(queryString);
          qs.set('p', r.razorpay_payment_id);
          window.location.href = `/dfy-v2/call-booking?${qs.toString()}`;
        },
      });
      rzp.open();
    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      setIsLoading(false);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  // ---- Reusable Order Summary body (product + line item + methods + total) ----
  const summaryDetails = (
    <>
      <div className="dfy-panel-inset flex gap-4 p-4">
        <div className="dfy-chip size-16 shrink-0 overflow-hidden rounded-lg p-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/akshay-portrait.png"
            alt="Akshay Paliwal"
            className="size-full object-cover object-[50%_25%]"
          />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-base font-semibold leading-[1.05]  ">
            1:1 Call With Akshay
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#C9CFDA]">
            30 mins, 1:1 with Akshay (Co-Founder &amp; CEO). Your exact
            bottleneck — and the path to ₹1–2Cr/yr.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-b border-[rgba(255,154,45,0.16)] pb-4 text-sm">
        <span className="text-[#C9CFDA]">1:1 Strategy Call</span>
        <span className="flex items-center gap-2">
          <span className="text-white/40 line-through">{ORIGINAL_PRICE}</span>
          <span className="font-semibold text-[#FF6A00]">{PRICE}</span>
        </span>
      </div>

      {/* Accepted payment methods — brand-styled chips on the funnel dark bg */}
      <div className="dfy-panel-inset mt-5 p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Accepted Payment Methods
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-8 items-center rounded-md bg-[#0E6FC9] px-2.5 text-xs font-extrabold tracking-wide text-white">
            UPI
          </span>
          <span className="inline-flex h-8 items-center rounded-md bg-[#1A1F71] px-2.5 text-xs font-extrabold italic tracking-wide text-white">
            VISA
          </span>
          <span className="dfy-chip h-8 rounded-md px-2.5">
            <span className="size-4 rounded-full bg-[#EB001B]" />
            <span className="-ml-1.5 size-4 rounded-full bg-[#F79E1B]/90" />
          </span>
          <span className="inline-flex h-8 items-center rounded-md bg-[#0F9D58] px-2.5 text-xs font-extrabold tracking-wide text-white">
            RuPay
          </span>
          <span className="dfy-chip h-8 rounded-md px-2.5 text-xs font-semibold">
            <CardIcon /> Net Banking
          </span>
          <span className="dfy-chip h-8 rounded-md px-2.5 text-xs font-semibold">
            <WalletIcon /> Wallets
          </span>
        </div>
      </div>

      <div className="dfy-panel-inset mt-5 flex items-center justify-between p-4">
        <span className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-base font-semibold leading-[1.05] ">
          Total Today
        </span>
        <span className="flex items-baseline gap-2">
          <span className="text-base text-white/40 line-through">
            {ORIGINAL_PRICE}
          </span>
          <span className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-2xl font-semibold leading-[1.05]  text-[#FF6A00]">
            {PRICE}
          </span>
        </span>
      </div>
    </>
  );

  // ---- Reusable Pay CTA (submits the form) + refund guarantee ----
  const payCta = (
    <>
      <button
        type="submit"
        disabled={isLoading}
        className="dfy-cta mt-5 flex w-full items-center justify-center gap-3 px-6 py-4 font-[family-name:var(--font-jost),ui-sans-serif,system-ui] text-lg font-semibold leading-[1.05] text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          'Processing…'
        ) : (
          <>
            Pay Now — {PRICE}
            <span className="flex size-7 items-center justify-center rounded-full bg-white/20 text-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-[#C9CFDA]">
        <span className="font-semibold text-[#46c46a]">
          100% refund of your {PRICE}
        </span>{' '}
        if we feel we’re not a good fit — no questions asked.
      </p>
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <RevealOnScroll />

      {/* Top trust bar */}
      <div className="border-b border-[rgba(255,154,45,0.16)] bg-black/40">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9CFDA]/70 md:text-xs">
          <span className="flex items-center gap-1.5">
            <TickIcon /> Secure Checkout
          </span>
          <span className="flex items-center gap-1.5">
            <TickIcon /> 256-Bit SSL
          </span>
          <span className="flex items-center gap-1.5">
            <TickIcon /> 100% Money-Back
          </span>
        </div>
      </div>

      {/* Header, built on the landing page's masthead rather than its own.

          The eyebrow is the same rail used by every section over there: a
          gradient label between two rules that fade out at their far ends. It
          replaces a bordered pill, which was a second eyebrow language for a
          funnel that already has one.

          The title takes .dfy-title-white / .dfy-title-orange. It used to run a
          bespoke silver gradient against a second orange ramp, neither of which
          appears anywhere on the landing page, so the two headings a visitor
          sees thirty seconds apart were built from different parts. */}
      <div className="mx-auto max-w-3xl px-6 pt-10 text-center md:pt-14">
        <div
          data-reveal
          className="mx-auto flex max-w-5xl items-center justify-center gap-4 md:gap-6"
        >
          <span
            className="dfy-press-rule dfy-press-rule--l"
            aria-hidden="true"
          />
          <p className="dfy-press-label shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
            You’re one step away
          </p>
          <span
            className="dfy-press-rule dfy-press-rule--r"
            aria-hidden="true"
          />
        </div>

        <h1
          data-reveal
          className="dfy-sec-title font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-[7vw] font-bold leading-tight md:text-[42px]"
        >
          {/* One BLOCK span carrying the line, with the accent nested inside
              it: the hero's exact construction.

              Inline was the bug. background-clip: text paints into the
              element's box, and an inline box is tight to the glyphs with none
              of the leading a block box carries. .dfy-title-white's stops are
              tuned for a box whose bottom quarter sits below the baseline and
              is therefore empty, so on an inline box that whole grey run lands
              ON the letters instead of at their feet, and the word washes out
              across its width rather than picking up light from above. Every
              title line on the hero is a block span for this reason. */}
          <span className="dfy-title-white block">
            Complete Your <span className="dfy-title-orange">Booking</span>
          </span>
        </h1>

        <p
          data-reveal
          className="dfy-sec-intro mx-auto max-w-xl text-[13px] leading-[1.65] text-[#C9CFDA] md:text-base md:leading-7"
        >
          Add your details and lock your slot. Your private call link hits your
          inbox the moment your {PRICE} is confirmed.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl px-4 pb-16 pt-8"
      >
        {/* MOBILE: collapsed order summary tab (tap to expand) */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
            className="dfy-panel flex w-full items-center justify-between p-4 text-left"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6A00]">
                Order Summary
              </p>
              <p className="text-xs text-white/50">Tap to view details</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-baseline gap-1.5">
                <span className="text-sm text-white/40 line-through">
                  {ORIGINAL_PRICE}
                </span>
                <span className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-xl font-semibold leading-[1.05]  text-[#FF6A00]">
                  {PRICE}
                </span>
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-[#C9CFDA] transition-transform ${summaryOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </button>
          {summaryOpen && (
            <div className="dfy-panel mt-3 p-6">{summaryDetails}</div>
          )}
        </div>

        {/* Two-column layout: stacks on mobile/tablet, side-by-side on lg */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Left: Your Details */}
          <div className="dfy-panel p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#FF6A00] font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-sm font-semibold leading-[1.05]  text-white">
                1
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-xl font-semibold leading-[1.05] ">
                  Your Details
                </h2>
                <p className="text-xs text-white/50">
                  We’ll send your call link to these details.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleTextChange}
                    className={inputClass}
                    placeholder="Rahul"
                  />
                  {errors.firstName && (
                    <span className="mt-1 block text-xs text-red-400">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleTextChange}
                    className={inputClass}
                    placeholder="Sharma"
                  />
                  {errors.lastName && (
                    <span className="mt-1 block text-xs text-red-400">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className={labelClass} htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <span className={hintClass}>Call link comes here</span>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  className={inputClass}
                  placeholder="rahul@example.com"
                />
                {errors.email && (
                  <span className="mt-1 block text-xs text-red-400">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className={labelClass} htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <span className={hintClass}>For WhatsApp reminders</span>
                </div>
                {/* Single clean field: flag + dial code + number share one
                    border (see .tgo-phone overrides in globals.css). */}
                <div className="tgo-phone dfy-field flex h-[52px] items-center px-3 py-0 focus-within:border-[rgba(255,138,28,0.7)] focus-within:shadow-[0_0_0_3px_rgba(255,106,0,0.16)]">
                  <PhoneInput
                    id="phone"
                    international
                    defaultCountry="IN"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onCountryChange={(c) => c && setCountry(c)}
                    className="w-full"
                  />
                </div>
                {errors.phone && (
                  <span className="mt-1 block text-xs text-red-400">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="city">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  className={inputClass}
                  placeholder="Mumbai"
                />
                {errors.city && (
                  <span className="mt-1 block text-xs text-red-400">
                    {errors.city}
                  </span>
                )}
              </div>
            </div>

            {/* Trust chips with distinct icons */}
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {trustItems.map((t) => (
                <span
                  key={t.label}
                  className="dfy-chip justify-center rounded-lg px-2 py-2.5 text-xs font-semibold"
                >
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Order Summary (desktop only - mobile uses the tab above) */}
          <div className="dfy-panel hidden p-6 md:p-8 lg:block">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#FF6A00]/15 text-[#FF6A00]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <h2 className="font-[family-name:var(--font-poppins-dfy),ui-sans-serif,system-ui] text-xl font-semibold leading-[1.05] ">
                Order Summary
              </h2>
            </div>
            {summaryDetails}
            {payCta}
          </div>
        </div>

        {/* MOBILE: pay CTA at the bottom */}
        <div className="lg:hidden">{payCta}</div>
      </form>

      {/* A legal strip, not the site footer.

          This page had no footer of any kind, so from the one screen where money
          changes hands there was no route to the terms, the privacy policy or
          the refund policy. That is a compliance gap before it is a design one:
          a payment page is expected to expose all three.

          It is deliberately a strip rather than the marketing footer the other
          pages carry. A brand block with navigation at the point of payment is
          an exit, and the only links that earn their place here are the ones a
          buyer may legitimately want to read before paying. */}
      <footer className="border-t border-[rgba(255,154,45,0.16)] px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]">
            {[
              { href: '/terms-and-conditions', label: 'Terms & Conditions' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/refund-policy', label: 'Refund Policy' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#C9CFDA] underline-offset-4 transition-colors hover:text-[#FFC87A] hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-[12px] leading-[1.6] text-white/45">
            &copy; {new Date().getFullYear()} {LEGAL.entity}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function DfyNewCheckoutPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CheckoutContent />
    </Suspense>
  );
}
