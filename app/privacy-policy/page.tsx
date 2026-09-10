import type { Metadata } from "next";

import LegalPageLayout from "@/components/LegalPageLayout";
import { Todo } from "@/components/SiteFooter";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: `Privacy Policy | ${LEGAL.brand}`,
  description: `How ${LEGAL.brand} collects, uses and protects your personal information.`,
  robots: { index: true, follow: true },
};

/**
 * ⚠️ THIS IS THE HOUSE TEMPLATE, NOT THE CLIENT'S OWN WORDING.
 *
 * The client supplied entity details only: name, address, phone, email and a
 * jurisdiction answer. He supplied no policy text. Every clause below is the
 * standard template used across these funnels, adapted to what this site
 * ACTUALLY does (Meta advertising tools, Microsoft Clarity session replay,
 * Razorpay, and nothing else), and it needs his sign-off before launch.
 *
 * Every factual statement in it is checkable against the codebase:
 *   - the fields collected are the five on app/checkout/CheckoutForm.tsx
 *   - the advertising tool is Meta, via components/MetaPixel.tsx and
 *     app/api/meta/event/route.ts
 *   - the analytics tool is Microsoft Clarity, via components/Clarity.tsx.
 *     There is no Google Analytics on this site, so none is claimed here.
 *   - the payment processor is Razorpay
 * If any of those change, this page changes with them.
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      effectiveDate={LEGAL.effectiveDate}
      intro={`This policy explains what we collect when you visit this site or book a ${LEGAL.product} with ${LEGAL.entity}, why we collect it, and what you can ask us to do with it.`}
    >
      <h2>1. Information we collect</h2>
      <p>Directly from you, when you book and pay:</p>
      <ul>
        <li>Your first and last name, email address, city and phone number.</li>
        <li>
          Payment confirmation details from our payment processor. We never see
          or store your full card number, UPI PIN or bank credentials.
        </li>
        <li>Anything you send us by email or message.</li>
      </ul>
      <p>Automatically, when you browse:</p>
      <ul>
        <li>
          Device, browser, approximate location, and which pages you viewed and
          for how long.
        </li>
        <li>
          A recording of your session on this site (mouse movement, scrolling
          and clicks), used to see where pages confuse people. Keystrokes in
          form fields are masked.
        </li>
        <li>
          Campaign parameters (UTM tags) telling us which ad or link brought you
          here.
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To schedule and deliver the {LEGAL.product} you booked.</li>
        <li>To answer your questions and provide support.</li>
        <li>To send transactional email related to your purchase.</li>
        <li>
          To measure which ads and pages work, so we spend less to reach the
          people we can help.
        </li>
        <li>
          With your consent, to tell you about our other services. You can stop
          this at any time.
        </li>
      </ul>

      <h2>3. Advertising and analytics</h2>
      <p>
        We use Meta (Facebook and Instagram) advertising tools and Microsoft
        Clarity for session analytics. These may set cookies. Meta receives a
        hashed, non-readable version of details such as your email or phone
        number so a purchase can be matched to the ad that led to it. It does
        not receive your details in a form that identifies you to anyone reading
        them, and it is not sent any description of what you bought.
      </p>

      <h2>4. Who we share it with</h2>
      <p>
        Only with the services needed to run this business: our payment
        processor (Razorpay), our email and messaging providers, our scheduling
        and video conferencing providers, and the advertising and analytics
        platforms named above.{" "}
        <strong>We do not sell your personal information.</strong>
      </p>

      <h2>5. How long we keep it</h2>
      <p>
        For as long as needed to deliver the service and to meet tax and
        accounting obligations. You can ask us to delete it sooner, subject to
        those obligations.
      </p>

      <h2>6. Your rights</h2>
      <ul>
        <li>Ask for a copy of what we hold about you.</li>
        <li>Ask us to correct anything wrong.</li>
        <li>Ask us to delete it.</li>
        <li>Withdraw consent for marketing at any time.</li>
      </ul>
      <p>
        Email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> and we will
        respond within a reasonable period.
      </p>

      <h2>7. Children</h2>
      <p>
        This service is intended for business owners and is for adults. We do
        not knowingly collect information from anyone under 18.
      </p>

      <h2>8. Changes</h2>
      <p>
        If this policy changes we will update the effective date above. Material
        changes will be communicated to clients by email.
      </p>

      <h2>9. Contact</h2>
      <p>
        {LEGAL.entity}, <Todo value={LEGAL.address} />.
        <br />
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
        {" · "}
        <a href={`tel:${LEGAL.phoneHref}`}>{LEGAL.phone}</a>
      </p>
    </LegalPageLayout>
  );
}
