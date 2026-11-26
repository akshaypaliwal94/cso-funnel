'use client';

/* eslint-disable @next/next/no-img-element */

import { useRouter, useSearchParams } from 'next/navigation';
import 'react-phone-number-input/style.css';

import { FormEvent, Suspense, useState } from 'react';
import PhoneInput, { isPossiblePhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

import DfyFunnelTracker from '@/app/dfy-v2/components/DfyFunnelTracker';
import { DFY_V2_PRICE_LABEL } from '@/app/dfy-v2/price';
import { type CheckoutPrefill, PREFILL_KEY } from '@/lib/checkout-prefill';
import { collectSignals } from '@/lib/client-signals';
import { trackDfyLead, trackDfyQualifiedLead } from '@/lib/track';

type Question = { key: string; title: string; help: string; options: [string, string][] };

const QUESTIONS: Question[] = [
  {
    key: 'stage',
    title: 'How are you currently acquiring customers?',
    help: 'Choose your closest situation.',
    options: [
      ['agency', 'I have hired agencies or freelancers to run my ads'],
      ['self', 'I run Meta Ads myself but struggle to scale'],
      ['organic', 'I get customers organically and want to start ads'],
      ['new', 'I am just starting and do not have consistent customers yet'],
    ],
  },
  {
    key: 'challenge',
    title: 'What is your biggest growth frustration?',
    help: 'Pick the one you would most want to fix first.',
    options: [
      ['burned', 'Agencies cost money, results are inconsistent, and I learned nothing'],
      ['decisions', 'I have ad data but do not know what to test or scale'],
      ['creative', 'I struggle to create new ads and test enough angles'],
      ['setup', 'I want to test paid ads without hiring an agency'],
      ['tracking', 'I cannot tell which ads lead to bookings or sales'],
    ],
  },
  {
    key: 'revenue',
    title: 'What is your average monthly business revenue?',
    help: 'Choose your approximate current monthly sales, not your profit.',
    options: [
      ['under-1', 'Below ₹1 lakh'],
      ['1-2', '₹1–2 lakh'],
      ['2-5', '₹2–5 lakh'],
      ['5-10', '₹5–10 lakh'],
      ['10+', 'Above ₹10 lakh'],
    ],
  },
  {
    key: 'ticket',
    title: 'How much do customers typically pay for your main offer?',
    help: 'Select the usual selling price per customer.',
    options: [
      ['under-5', 'Below ₹5,000'],
      ['5-15', '₹5,000–₹15,000'],
      ['15-30', '₹15,000–₹30,000'],
      ['30-75', '₹30,000–₹75,000'],
      ['75+', 'More than ₹75,000'],
    ],
  },
  {
    key: 'budget',
    title: 'What monthly ad budget can you realistically test?',
    help: 'This is advertising spend, separate from any installation fee.',
    options: [
      ['under-15', 'Below ₹15,000'],
      ['15-30', '₹15,000–₹30,000'],
      ['30-60', '₹30,000–₹60,000'],
      ['60-100', '₹60,000–₹1 lakh'],
      ['100+', 'Over ₹1 lakh'],
    ],
  },
];

const REPLIES: Record<string, string> = {
  scale:
    'Example AI guidance: Compare ads by cost per qualified booking and recorded sale, check whether conversion data is reliable, then consider testing a controlled increase on the strongest candidate. Do not change budgets blindly.',
  leaks:
    'Example AI guidance: Follow the journey from ad click to lead, lead to booking, and booking to recorded sale. If lead cost is stable but bookings decline, inspect funnel friction and lead follow-up before buying more traffic.',
  tomorrow:
    'Example AI priority list: (1) Check event health and account billing; (2) review cost per booked call by campaign; (3) approve three distinct awareness angles for the next creative test.',
};

const TABS: [string, string][] = [
  ['overview', 'Overview'],
  ['ask', 'Ask the AI'],
  ['creative', 'Creative Studio'],
  ['health', 'Account health'],
];

type Stage = 'quiz' | 'contact' | 'fee' | 'nofit';

function Qualify() {
  const [stage, setStage] = useState<Stage>('quiz');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizError, setQuizError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState(''); // E.164, from the picker
  const [email, setEmail] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [feeConsent, setFeeConsent] = useState(false);
  const router = useRouter();
  const queryString = useSearchParams().toString();

  const item = QUESTIONS[step];

  const preliminaryFit = () =>
    answers.revenue !== 'under-1' &&
    !(answers.revenue === '1-2' && answers.budget === 'under-15');

  const pick = (value: string) => {
    setAnswers((a) => ({ ...a, [item.key]: value }));
    setQuizError('');
  };

  const next = () => {
    if (!answers[item.key]) {
      setQuizError('Please select an answer to continue.');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
      setQuizError('');
      return;
    }
    setStage('contact');
  };

  /* Step 6. Everyone who answers it is a Lead and goes to the lead Pabbly with
     their answers, qualified or not; only a pass is a QualifiedLead. The
     details then wait in sessionStorage to prefill the checkout. */
  const submitContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactError('');
    if (!firstName.trim()) return setContactError('Please enter your first name.');
    if (!lastName.trim()) return setContactError('Please enter your last name.');
    if (!phone || !isPossiblePhoneNumber(phone)) return setContactError('Please enter a valid WhatsApp number.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setContactError('Please enter a valid email address.');
    if (!contactConsent) return setContactError('Please agree to the application terms.');

    const parsed = parsePhoneNumber(phone);
    const dialCode = parsed ? `+${parsed.countryCallingCode}` : '';
    const person = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
      ...(parsed?.country && { country: parsed.country.toLowerCase() }),
    };
    const quiz = Object.fromEntries(
      QUESTIONS.map((q) => [q.key, q.options.find(([v]) => v === answers[q.key])?.[1] ?? '']),
    );
    const fit = preliminaryFit();

    trackDfyLead(person);
    if (fit) trackDfyQualifiedLead(person);

    // Fire and forget: the visitor never waits on Pabbly.
    fetch('/api/dfy-v3/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...person, dialCode, quiz, qualified: fit, ...collectSignals() }),
      keepalive: true,
    }).catch(() => {});

    const prefill: CheckoutPrefill = { firstName: person.firstName, lastName: person.lastName, email: person.email, phone };
    try {
      sessionStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
    } catch {
      /* Storage blocked: the checkout just opens empty. */
    }

    setStage(fit ? 'fee' : 'nofit');
  };

  const back = () => {
    if (step > 0) {
      setStep(step - 1);
      setQuizError('');
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setStage('quiz');
  };

  // The landing query string (utm_*, fbclid) goes along, as on dfy-v2.
  const pay = () => {
    if (!feeConsent) return;
    router.push(queryString ? `/dfy-v3/checkout?${queryString}` : '/dfy-v3/checkout');
  };

  return (
    <div className="quiz-card" id="quiz-card" aria-live="polite">
      <div className={stage === 'quiz' ? '' : 'is-hidden'} id="quiz-stage">
        <div className="quiz-head">
          <span>Your Growth Fit Check</span>
          <span className="quiz-number">Question {step + 1} of 5</span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={step + 1}
        >
          <div className="bar-fill" style={{ width: `${(step + 1) * 20}%` }} />
        </div>
        <h3 className="question">{item.title}</h3>
        <p className="helptext">{item.help}</p>
        <div className="choices">
          {item.options.map(([value, label]) => {
            const on = answers[item.key] === value;
            return (
              <button key={value} type="button" className="choice" aria-pressed={on} onClick={() => pick(value)}>
                <span className="bubble">{on ? '✓' : ''}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        <div className="quiz-actions">
          <button className="back" type="button" disabled={step === 0} onClick={back}>
            ← Back
          </button>
          <button className="btn" type="button" onClick={next}>
            {step === 4 ? 'Continue to application' : 'Continue'} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="error" role="alert">
          {quizError}
        </div>
      </div>

      <div className={stage === 'contact' ? '' : 'is-hidden'} id="contact-stage">
        <div className="quiz-head">
          <b>Almost there</b>
          <span className="quiz-number">Your details</span>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: '100%' }} />
        </div>
        <h3 className="question">Where can we reach you?</h3>
        <p className="helptext">
          We&apos;ll use your application to evaluate fit and prepare for a diagnostic conversation.
        </p>
        <form noValidate onSubmit={submitContact}>
          <div className="field-grid">
            <div className="field-wrap">
              <label htmlFor="first-name">First name</label>
              <input
                className="field"
                id="first-name"
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="field-wrap">
              <label htmlFor="last-name">Last name</label>
              <input
                className="field"
                id="last-name"
                name="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="field-wrap">
              <label htmlFor="whatsapp">WhatsApp number</label>
              <div className="field phone-field">
                <PhoneInput
                  id="whatsapp"
                  name="phone"
                  international
                  defaultCountry="IN"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(v) => setPhone(v || '')}
                />
              </div>
            </div>
            <div className="field-wrap">
              <label htmlFor="email">Business email</label>
              <input
                className="field"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@business.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={contactConsent}
              onChange={(e) => setContactConsent(e.target.checked)}
            />
            <span>
              I agree to be contacted about my application and understand the{' '}
              <a href="#privacy-note">privacy and application information</a> below.
            </span>
          </label>
          <div className="quiz-actions">
            <button className="back" type="button" onClick={() => setStage('quiz')}>
              ← Back
            </button>
            <button className="btn" type="submit">
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="error" role="alert">
            {contactError}
          </div>
        </form>
      </div>

      <div className={stage === 'fee' ? '' : 'is-hidden'} id="fee-stage">
        <span className="eyebrow">LAST STEP</span>
        <h3 className="question" style={{ marginTop: 10 }}>
          Request Your Diagnostic Review.
        </h3>
        <p className="helptext">A small application fee helps us prioritize serious enquiries.</p>
        <div className="checkout-amount">₹97</div>
        <div className="info-box">
          <span className="refund-ok">100% refund of your {DFY_V2_PRICE_LABEL}</span> if we feel we’re not a good fit
          — no questions asked.
        </div>
        <label className="consent">
          <input type="checkbox" checked={feeConsent} onChange={(e) => setFeeConsent(e.target.checked)} />
          <span>
            I understand this is an application fee, not the full installation price, and that a call or acceptance is
            not guaranteed. I agree to the refund terms above.
          </span>
        </label>
        <div style={{ marginTop: 20 }}>
          <button className="btn" type="button" disabled={!feeConsent} onClick={pay}>
            Proceed to secure ₹97 payment <Arrow />
          </button>
          <p className="tiny-note">
            Secure payment is processed by our checkout provider. Your application is not accepted until it is
            reviewed.
          </p>
        </div>
        <button className="back" type="button" onClick={() => setStage('contact')}>
          ← Back
        </button>
      </div>

      <div className={stage === 'nofit' ? '' : 'is-hidden'} id="no-fit">
        <span className="eyebrow">THANKS FOR SHARING</span>
        <h3 className="question" style={{ marginTop: 12 }}>
          We Might Not Be The Right Fit Just Yet.
        </h3>
        <p className="helptext" style={{ fontSize: 15, lineHeight: 1.75 }}>
          This installation is built for businesses with a proven offer and enough budget to test paid acquisition.
          Based on your answers, it may be better to strengthen your offer or acquisition economics first. You don&apos;t
          need to pay the ₹97 fee.
        </p>
        <button className="btn secondary" type="button" onClick={restart}>
          Start again
        </button>
      </div>
    </div>
  );
}

function CommandCenter() {
  const [tab, setTab] = useState('overview');
  const [answer, setAnswer] = useState(
    'Select an example question above to see an illustrative recommendation. A live installation will depend on your connected data and permissions.',
  );
  const panel = (key: string) => `demo-panel${tab === key ? ' active' : ''}`;

  return (
    <div className="demo-shell">
      <div className="demo-menu">
        <b>
          TGO / GROWTH COMMAND CENTER <span className="demo-menu-tag">· INTERACTIVE MOCKUP</span>
        </b>
        {TABS.map(([key, label]) => (
          <button key={key} className="demo-tab" type="button" aria-selected={tab === key} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="demo-body">
        <div className={panel('overview')}>
          <span className="mock-tag">YOUR ACQUISITION SNAPSHOT</span>
          <div className="demo-kpis">
            <div>
              <span>Ad spend</span>
              <strong>₹48,000</strong>
            </div>
            <div>
              <span>Leads</span>
              <strong>146</strong>
            </div>
            <div>
              <span>Calls booked</span>
              <strong>32</strong>
            </div>
            <div>
              <span>Recorded sales</span>
              <strong>8</strong>
            </div>
          </div>
          <div className="priority">
            <strong>PRIORITY 01 · Investigate the booking drop-off</strong>
            <p>
              Cost per lead is only part of the picture. Compare leads by campaign against qualified bookings before
              increasing budget.
            </p>
          </div>
          <div className="priority">
            <strong>PRIORITY 02 · Prepare your next creative testing round</strong>
            <p>
              Test fresh awareness angles using the creative workflow, then review cost per booked call, not impressions
              alone.
            </p>
          </div>
        </div>
        <div className={panel('ask')}>
          <span className="mock-tag">EXAMPLE AI CONVERSATION</span>
          <p className="demo-ask-title">Ask a better question. Get a more useful next step.</p>
          <button type="button" className="prompt" onClick={() => setAnswer(REPLIES.scale)}>
            Which ads should I scale?
          </button>
          <button type="button" className="prompt" onClick={() => setAnswer(REPLIES.leaks)}>
            Where am I losing leads?
          </button>
          <button type="button" className="prompt" onClick={() => setAnswer(REPLIES.tomorrow)}>
            What should I do tomorrow?
          </button>
          <div className="chat-answer">{answer}</div>
        </div>
        <div className={panel('creative')}>
          <span className="mock-tag">STATIC ADS + SCRIPT STUDIO</span>
          <h3 className="demo-h3">One Idea. Multiple Angles. Repeatable Testing.</h3>
          <div className="demo-kpis">
            <div>
              <span>TOFU</span>
              <strong>Problem</strong>
            </div>
            <div>
              <span>MOFU</span>
              <strong>Method</strong>
            </div>
            <div>
              <span>BOFU</span>
              <strong>Proof</strong>
            </div>
            <div>
              <span>Formats</span>
              <strong>Mix</strong>
            </div>
          </div>
          <div className="priority">
            <strong>Example creative batch</strong>
            <p>
              Test different hooks as static concepts, video scripts, demonstrations and proof-based ads. The goal is
              15–20 review-ready variations in around an hour when source assets and templates are ready.
            </p>
          </div>
        </div>
        <div className={panel('health')}>
          <span className="mock-tag">FOUNDATIONS MATTER</span>
          <h3 className="demo-h3">Know When The Account Needs Attention.</h3>
          <div className="priority">
            <strong>Tracking health</strong>
            <p>
              Check pixel events, conversion signals, UTMs and obvious discrepancies before interpreting ad-level
              results.
            </p>
          </div>
          <div className="priority">
            <strong>Account readiness</strong>
            <p>
              Keep billing status, connected assets and campaign readiness visible where available through supported
              integrations.
            </p>
          </div>
        </div>
        <p className="demo-disclaimer">
          Mock data and illustrative AI answers, not a connected live client dashboard. Real features, CRM compatibility
          and Meta permissions require a working technical integration.
        </p>
      </div>
    </div>
  );
}

function OwnerPhoto() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="owner-photo">
      {!failed && (
        <img
          src="https://www.akshaypaliwal.com/brand/akshay-portrait.png?v=10"
          alt="Akshay Paliwal"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <div className="photo-fallback" style={failed ? { display: 'grid' } : undefined}>
        <div>
          <b>AP</b>
          <span>AKSHAY PALIWAL · FOUNDER, TGO</span>
        </div>
      </div>
    </div>
  );
}

const PROOF = [
  {
    img: 'aman-zohra',
    alt: 'Aman and Zohra historical TGO client result graphic',
    name: 'Aman & Zohra',
    line: 'Natural fertility experts · ₹2L to ₹15L/month, as featured on the existing website',
  },
  {
    img: 'ankita',
    alt: 'Ankita Barasara historical TGO client result graphic',
    name: 'Ankita Barasara',
    line: 'Postpartum healing expert · ₹1L to ₹4L/month, as featured on the existing website',
  },
  {
    img: 'anish-shubham',
    alt: 'Anish and Shubham historical TGO client result graphic',
    name: 'Anish & Shubham',
    line: 'Science Driven Performance · ₹1L to ₹8L/month, as featured on the existing website',
  },
  {
    img: 'nimisha',
    alt: 'Nimisha Maniar historical TGO client result graphic',
    name: 'Nimisha Maniar',
    line: 'Studio Aware · ₹50L to ₹2Cr/year, as featured on the existing website',
  },
];

const STEPS = [
  {
    n: '01',
    tag: 'Diagnose · Human-led',
    eyebrow: 'FIND THE LEAK BEFORE SPENDING MORE',
    title: "First, We Find Out What's Actually Broken.",
    body: "We don't begin by handing you a chatbot. TGO reviews your existing offer, positioning, competitors, funnel, advertising history and sales signals to identify the biggest acquisition leakages.",
    bullets: [
      'Personal growth diagnostic with TGO',
      'Offer and positioning audit',
      'Competitor and market research',
      'Prioritized list of what needs attention',
    ],
    quote: '“You shouldn\'t need to spend more money to discover that the real problem was somewhere else.”',
  },
  {
    n: '02',
    tag: 'Repair · Build',
    eyebrow: 'MAKE YOUR ACQUISITION FOUNDATION RELIABLE',
    title: 'Then We Fix The Funnel, Ads Setup & Tracking.',
    body: 'If you already have a working funnel, we improve what matters. If you need a starting point, we install a standardized lead-generation or booking funnel. We audit or create your Meta advertising foundations, then verify the signals your campaigns depend on.',
    bullets: [
      'Existing funnel improvement or templated setup',
      'Meta Business and ad account readiness',
      'Pixel, conversion events, UTMs and tracking checks',
      'Account health, billing awareness and initial campaign structure',
    ],
    quote:
      '“Before scaling an ad, we should be confident the right events are being recorded and the numbers can be trusted.”',
  },
  {
    n: '03',
    tag: 'Produce · Optimize',
    eyebrow: 'STOP RUNNING OUT OF ADS AND IDEAS',
    title: 'Install The Creative Engine & AI Ads Strategist.',
    body: "We bring TGO's static creative frameworks and video Script Studio into a repeatable workflow so you can produce, review and test new angles across awareness levels without waiting on an agency each time.",
    bullets: [
      'Static ad concepts and video ad scripts',
      'Different angles for TOFU, MOFU and BOFU',
      'AI-assisted analysis of campaign performance',
      'Structured recommendations on what to test, pause or scale',
    ],
    quote:
      '“Aim to create 15–20 review-ready variations in about an hour using prepared assets and templates. Production time and quality depend on the inputs and format.”',
  },
  {
    n: '04',
    tag: 'Own · Handover',
    eyebrow: 'THE ONE THING YOU WALK AWAY WITH',
    title: 'Your Own AI Growth Command Center.',
    body: 'We connect available Meta performance data with your existing lead tracker or supported CRM so the important numbers and next actions become easier to understand. Then we train you to operate the system and explain the reasoning behind the recommendations.',
    bullets: [
      'Ad spend, leads, bookings and recorded sales visibility',
      'Priority actions, account checks and follow-up AI chat',
      'Existing trackers or supported CRM connections where feasible',
      'Walkthroughs, playbooks, approvals and owner training',
    ],
    quote:
      '“Not another black box. An installed system you can understand, question and use without a compulsory agency retainer.”',
  },
];

const SYSTEM = [
  ['Growth Leakage Diagnosis', 'Find wasted spend and lost opportunities.'],
  ['Offer & Positioning', 'Sharpen what the market is buying.'],
  ['Competitor & Market Intelligence', 'Find stronger messages and angles.'],
  ['Funnel Readiness', 'Improve or install one conversion journey.'],
  ['Meta Setup & Data Quality', 'Get tracking, events and UTMs in order.'],
  ['Campaign Testing Framework', "Know what you're testing and why."],
  ['Creative Production System', 'Prepare diverse advertising concepts.'],
  ['Lead-to-Sale Visibility', 'Bring bookings and recorded sales into view.'],
  ['AI Scaling Guidance', 'Review, diagnose and plan the next moves.'],
  ['Command Center & Training', 'Your own dashboard, playbooks and operating skills.'],
];

const COMPARE = [
  [
    'Reports, but no answers',
    'Cost per lead looks good, but booked calls and real sales are unclear.',
    'Lead-to-sale visibility',
    'See advertising spend alongside leads, bookings and recorded sales where data is available.',
  ],
  [
    'Agency holds the decisions',
    'Wait for someone to interpret the numbers or recommend the next test.',
    'AI-assisted decision frameworks',
    'Understand why to test, improve, hold or scale, with your approval.',
  ],
  [
    'New creative every time is a project',
    'Wait for scripts, edits and another round of approvals.',
    'Repeatable creative systems',
    "Generate new concepts and variations from TGO's playbooks and your own assets.",
  ],
  [
    'Every agency switch starts from zero',
    'Knowledge stays with the provider, not your business.',
    'Your own installed system',
    'The workflows, dashboard, context and operating guide remain yours.',
  ],
];

const FAQS = [
  [
    'How long does the installation take?',
    'The proposed delivery structure is a 21-day core setup followed by scheduled adoption and training support across a six-week engagement. The exact timetable and responsibilities will be confirmed after we audit your existing systems, because complex integrations or a new funnel may change the scope.',
  ],
  [
    'How is this different from an agency or a marketing course?',
    "With a course, you're generally left to set everything up. With a traditional agency, the setup and ongoing judgment may stay with the agency. Here TGO diagnoses the acquisition problem, installs the agreed systems and trains you to operate an AI-assisted advertising workflow inside your own business. There's no compulsory monthly agency retainer.",
  ],
  [
    "I've already spent money with agencies and barely made a profit. Is this for me?",
    "That experience is one reason we're building this. We'll look beyond cost per lead at bookings and recorded sales, where reliable data exists. We will also examine your funnel and account foundation. This doesn't guarantee profit, but it gives you better visibility and more ownership of the decisions.",
  ],
  [
    'I get customers organically but have never run Meta Ads. Can I apply?',
    "Yes, provided you have a proven offer, paying customers and a realistic budget for testing ads. We can set up the Meta foundation and teach you how to review results and make decisions. We won't pretend that a new campaign is guaranteed to work.",
  ],
  [
    'Will you create a funnel for me?',
    "If your funnel works, we'll usually prioritize targeted improvements rather than rebuilding it. If you need a funnel, the standard package can include one templated lead-generation or booking journey, subject to scope. Complex websites, multiple product funnels and custom development need separate assessment.",
  ],
  [
    'Can the Command Center connect with my existing CRM?',
    "We'll review your current CRM, lead tracker or spreadsheet and determine which connections are supported. Where a direct connection isn't practical, an agreed intermediate tracker may be possible. Not every CRM or workflow can be connected automatically.",
  ],
  [
    'Will AI automatically run and scale my ads?',
    'The system is designed to help you interpret performance, develop creatives and decide what to test or scale. You remain responsible for approvals and budget decisions. Automated actions, where technically available, require separate validation and appropriate permissions.',
  ],
  [
    'Can I really create 15–20 new creatives in one hour?',
    "That's the target for a review-ready batch of creative concepts or variations when templates and approved source assets are prepared. Finished video edits, animations, testimonials and compliance reviews may take longer. Meta does not require a fixed number of creatives; we focus on meaningful variety and testing.",
  ],
  [
    'Does this include a full AI sales agent and every business automation?',
    'No. The initial product focuses on paid acquisition, creative workflows, decision support and lead-to-sale visibility. Full sales coaching, transcript evaluation, CRM replacement and custom business automation are outside the standard scope, but can be discussed separately.',
  ],
  [
    'What happens after the five questions and the ₹97 fee?',
    "We review your application for fit and, if appropriate, proceed with the diagnostic call and scope discussion. The ₹97 is an application fee, not the installation price. If we determine you don't qualify, the application fee is refundable under the published terms. The payment, scheduling and refund integrations must be configured before launch.",
  ],
];

/* An SVG, not the ↗ character: the loaded Inter subset has no arrow glyph, so
   the browser substituted a thin one from another font. */
function Arrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QualifyBtn({ className = 'btn' }: { className?: string }) {
  return (
    <a className={className} href="#qualify">
      See if you qualify <Arrow />
    </a>
  );
}

export default function DfyV3Page() {
  return (
    <>
      <DfyFunnelTracker />
      <div className="topline">FOR COACHES, CONSULTANTS &amp; SERVICE PROVIDERS WITH A PROVEN OFFER</div>
      <header className="navigation">
        <nav className="wrap nav-inner" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="TGO AI Growth Engine home">
            <img className="brand-logo" src="/assets/images/icons/svg/tgo-white.svg" alt="TGO" width={112} height={56} />
            <small className="brand-tag">AI GROWTH ENGINE</small>
          </a>
          <div className="nav-links">
            <a href="#fit">Who it&apos;s for</a>
            <a href="#proof">Client results</a>
            <a href="#installation">The installation</a>
            <a href="#command-center">The Command Center</a>
            <a href="#about">About Akshay</a>
            <a className="btn small" href="#qualify">
              See if you qualify <Arrow />
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="wrap">
            <span className="eyebrow">THE EXPERIENCE OF A DONE-FOR-YOU AGENCY. NOW INSIDE YOUR BUSINESS.</span>
            <h1 className="display" id="hero-heading">
              I&apos;ll Help You <span className="marker">Get More Paying Clients From Meta Ads</span> Without Paying An
              Agency Every Month.
            </h1>
            <p className="hero-lede">
              First, we find{' '}
              <strong>where your ad budget is getting wasted and why leads aren&apos;t turning into enough sales.</strong>{' '}
              Then my team fixes what matters, installs our tested advertising systems and{' '}
              <strong>AI Growth Command Center</strong>, and trains you to make better ad decisions yourself.
            </p>
            <div className="hero-actions">
              <QualifyBtn />
              <p className="legal-hint">
                5 quick questions · ₹97 application fee after the quiz · Refunded if we determine you&apos;re not a fit
              </p>
            </div>
            <div className="chips">
              <span className="chip">Done-for-you installation</span>
              <span className="chip">Built around your proven offer</span>
              <span className="chip">No mandatory agency retainer</span>
            </div>
            <div className="hero-showcase" aria-label="Illustrative preview of the AI Growth Command Center">
              <div className="showcase-top">
                <span>INSIDE YOUR OWN BUSINESS / AI GROWTH ENGINE</span>
                <div className="dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="showcase-inner">
                <div className="showcase-copy">
                  <span className="tag">THE END RESULT</span>
                  <h2>Know which ads bring customers. Know what to improve next.</h2>
                  <p>Your numbers. Your creatives. Your next moves. One system you understand and own.</p>
                </div>
                <div className="showcase-app">
                  <div className="app-row">
                    <span className="app-brand">TGO · GROWTH COMMAND CENTER</span>
                    <span className="demo-pill">ILLUSTRATIVE PREVIEW</span>
                  </div>
                  <div className="app-metrics">
                    <div>
                      <strong>₹48k</strong>
                      <small>Ad spend</small>
                    </div>
                    <div>
                      <strong>32</strong>
                      <small>Calls booked</small>
                    </div>
                    <div>
                      <strong>8</strong>
                      <small>Recorded sales</small>
                    </div>
                  </div>
                  <div className="app-task">
                    <i>↗</i>Review the 3 creatives with the strongest booked-call costs
                  </div>
                  <div className="app-task">
                    <i>✓</i>Check pixel events and conversion tracking health
                  </div>
                  <div className="app-task">
                    <i>✦</i>Prepare the next creative testing batch
                  </div>
                  <div className="app-mini">
                    <span>ASK YOUR AI STRATEGIST</span>
                    <span>What should I do next? →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quiz-section" id="qualify" aria-labelledby="quiz-heading">
          <div className="wrap quiz-layout">
            <div className="quiz-pitch">
              <span className="eyebrow">THE NEXT STEP</span>
              <h2 id="quiz-heading">
                Let&apos;s See If This Can Work <span className="marker">For Your Business.</span>
              </h2>
              <p>
                You&apos;ve already built something people buy. Tell me where you&apos;re stuck with paid customer
                acquisition, and let&apos;s see whether the AI Growth Engine is the right fit.
              </p>
              <div className="quiz-benefits">
                <span>
                  <i className="tick">✓</i>Just 5 questions, right here on this page
                </span>
                <span>
                  <i className="tick">✓</i>Help us understand your starting point
                </span>
                <span>
                  <i className="tick">✓</i>₹97 application fee, refundable if you don&apos;t qualify
                </span>
              </div>
              <p className="tiny-note">
                Your answers are used for an initial fit assessment. Applying does not guarantee acceptance or
                advertising results.
              </p>
            </div>
            <Suspense fallback={<div className="quiz-card" />}>
              <Qualify />
            </Suspense>
          </div>
        </section>

        <section className="section" id="fit">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">THE FIT</span>
              <h2 className="heading">
                This Is <span className="marker">FOR YOU</span> If...
              </h2>
              <p className="section-lede">
                You don&apos;t need another agency pitch or a course full of tutorials. You need an acquisition system
                that works for your situation, and the ability to operate it yourself.
              </p>
            </div>
            <div className="fit-grid">
              <article className="fit-card agency">
                <div className="num">AVATAR A · ALREADY TRIED AGENCIES</div>
                <h3>You&apos;ve Paid Agencies. But You Still Don&apos;t Know What They Did.</h3>
                <p>
                  You have tried one agency, maybe two or three. They generated leads, perhaps even sales. Then ad spend
                  and agency fees ate most of the money, and you were back to choosing the next agency.
                </p>
                <ul>
                  <li>You&apos;re tired of constantly restarting with someone new.</li>
                  <li>You want to understand which ads actually bring profitable customers.</li>
                  <li>You want the decisions, systems and knowledge inside your business.</li>
                </ul>
              </article>
              <article className="fit-card">
                <div className="num">AVATAR B · ORGANICALLY SUCCESSFUL</div>
                <h3>Your Business Works Organically. Now You Want To Test Ads.</h3>
                <p>
                  People already buy your program or service. But investing in Meta Ads feels risky, especially if it
                  means hiring an expensive agency before you even know whether ads will work.
                </p>
                <ul>
                  <li>You have a proven offer and customers who love it.</li>
                  <li>You want to test paid acquisition with a structured process.</li>
                  <li>You want to learn to make decisions instead of renting a marketer.</li>
                </ul>
              </article>
            </div>
            <div className="small-fit">
              <span>✓ Already selling a real offer</span>
              <span>✓ Coaches, consultants &amp; service providers</span>
              <span>✓ Ready to own your advertising process</span>
            </div>
            <div className="center" style={{ marginTop: 29 }}>
              <QualifyBtn />
            </div>
          </div>
        </section>

        <section className="section pale" id="proof">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">THE TRACK RECORD BEHIND THE SYSTEM</span>
              <h2 className="heading">
                They Built The Business. <span className="marker">We Helped Them Scale.</span>
              </h2>
              <p className="section-lede">
                This isn&apos;t a collection of AI prompts assembled last week. The methods behind the AI Growth Engine
                come from our 7-figure done-for-you marketing agency and years of hands-on execution for coaching and
                service businesses.
              </p>
            </div>
            <div className="stats">
              <div className="stat">
                <strong>1,000+</strong>
                <span>Coaches, consultants &amp; service businesses served</span>
              </div>
              <div className="stat">
                <strong>25</strong>
                <span>Countries served</span>
              </div>
              <div className="stat">
                <strong>₹200Cr+</strong>
                <span>Reported collective client turnover</span>
              </div>
            </div>
            <p className="small-source center">
              TGO-reported historical figures. These are not results generated by the new AI Growth Engine. Verify
              supporting records and definitions before publishing.
            </p>
            <div className="proof-grid">
              {PROOF.map((p) => (
                <figure className="proof-card" key={p.img}>
                  <img
                    loading="lazy"
                    src={`https://www.akshaypaliwal.com/testimonials/india/${p.img}.webp?v=10`}
                    alt={p.alt}
                  />
                  <figcaption>
                    <strong>{p.name}</strong>
                    <small>{p.line}</small>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="proof-note center">
              Historical done-for-you agency case studies, not pilot results for the AI Command Center. Outcomes differ
              by business and are not guaranteed. Images are linked from the existing Akshay Paliwal website.
            </p>
          </div>
        </section>

        <section className="section" id="leaks">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">THE REAL PROBLEM</span>
              <h2 className="heading">
                More Leads Won&apos;t Fix A <span className="marker">Leaking Growth System.</span>
              </h2>
              <p className="section-lede">
                You can have great ads and still waste money. A great offer and still lose buyers. Dozens of reports and
                still have no clue what to do on Monday morning.
              </p>
            </div>
            <div className="comparison">
              <div className="compare-head">
                <div>What most owners have today</div>
                <div>What we help install instead</div>
              </div>
              {COMPARE.map(([aT, aD, bT, bD]) => (
                <div className="compare-row" key={aT}>
                  <div>
                    <strong>{aT}</strong>
                    {aD}
                  </div>
                  <div>
                    <strong>{bT}</strong>
                    {bD}
                  </div>
                </div>
              ))}
            </div>
            <div className="reasoning">
              <b>The goal isn&apos;t to get cheaper leads at any cost.</b> It&apos;s to make it easier to see which
              acquisition activities deserve your time and budget, and to stop depending on an outside agency to answer
              basic growth questions.
            </div>
          </div>
        </section>

        <section className="section pale" id="installation">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">WHAT ACTUALLY GETS INSTALLED</span>
              <h2 className="heading">
                The TGO <span className="marker">AI Growth Engine.</span>
              </h2>
              <p className="section-lede">
                Four phases. One connected system. Built for business owners who already have a proven offer and want
                more control over paid acquisition.
              </p>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <article className="step" key={s.n}>
                  <div className="step-count">
                    <strong>{s.n}</strong>
                    <small>{s.tag}</small>
                  </div>
                  <div className="step-main">
                    <span className="eyebrow">{s.eyebrow}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <ul className="step-bullets">
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <div className="step-quote">{s.quote}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="center" style={{ marginTop: 33 }}>
              <QualifyBtn />
            </div>
            <div className="black-panel">
              <span className="eyebrow light">THE CAPABILITIES WORK TOGETHER</span>
              <h3 className="subheading" style={{ marginTop: 11 }}>
                10 Things We Help You Take Control Of.
              </h3>
              <p className="lead">
                They&apos;re not ten different subscriptions or disconnected tools. They&apos;re connected pieces of one
                installed acquisition system.
              </p>
              <div className="system-grid">
                {SYSTEM.map(([t, d], i) => (
                  <div className="system-mini" key={t}>
                    <div className="index">{String(i + 1).padStart(2, '0')}</div>
                    <strong>{t}</strong>
                    <small>{d}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section dark" id="command-center">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow light">THE FINAL DELIVERABLE</span>
              <h2 className="heading">
                Meet Your <span className="green-text">AI Growth Command Center.</span>
              </h2>
              <p className="section-lede">
                Instead of opening five platforms and waiting for an agency to tell you what&apos;s happening, get one
                place to review acquisition performance, identify priorities and ask what to do next.
              </p>
            </div>
            <CommandCenter />
            <div style={{ textAlign: 'center', marginTop: 35 }}>
              <QualifyBtn className="btn lime" />
              <p className="legal-hint">
                We install and train you. We don&apos;t promise unattended AI campaign changes or guaranteed ad returns.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">THE OPERATOR</span>
              <h2 className="heading">
                Why Should You <span className="marker">Listen To Me?</span>
              </h2>
              <p className="section-lede">
                Because this was built out of real agency work, not a theory about what AI might be able to do.
              </p>
            </div>
            <div className="owner">
              <OwnerPhoto />
              <div>
                <span className="eyebrow">AKSHAY PALIWAL · FOUNDER, TGO</span>
                <h3>I Built The Agency. Now I Want You To Own The System.</h3>
                <p>
                  I started TGO to help experts turn their knowledge into real businesses. Over the years, our
                  done-for-you marketing work taught us what happens behind the scenes: researching offers, building
                  funnels, testing creatives, fixing tracking and making the decisions that drive acquisition.
                </p>
                <p>
                  I also saw the other side. Owners would pay agencies for months, receive reports, switch providers and
                  still have no idea what to do themselves. Some made sales, but had little left after the spend and
                  fees.
                </p>
                <p>
                  That&apos;s why we&apos;re productizing the frameworks we&apos;ve tested and installing them inside the
                  customer&apos;s business, with the training to operate them.
                </p>
                <div className="owner-lines">
                  <div className="owner-line">
                    <strong>Tested through real agency engagements</strong>
                    <span>Not a generic AI prompt bundle or one-size-fits-all course.</span>
                  </div>
                  <div className="owner-line">
                    <strong>Human diagnosis before any install</strong>
                    <span>We identify the problem before deciding what needs to be built.</span>
                  </div>
                  <div className="owner-line">
                    <strong>Ownership, not permanent dependence</strong>
                    <span>Our goal is to transfer the system and the understanding.</span>
                  </div>
                </div>
                <QualifyBtn />
              </div>
            </div>
          </div>
        </section>

        <section className="section pale" id="faq">
          <div className="wrap">
            <div className="center">
              <span className="eyebrow">QUESTIONS</span>
              <h2 className="heading">FAQs</h2>
            </div>
            <div className="faq-wrap">
              {FAQS.map(([q, a]) => (
                <details className="faq" key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing center">
          <div className="wrap">
            <span className="eyebrow light">THE NEXT STEP</span>
            <h2 className="heading">
              I&apos;ll Help You Take Control Of Your Ads.{' '}
              <span className="green-text">Without Depending On Another Agency.</span>
            </h2>
            <p>
              Let&apos;s find where your growth is leaking, build what you actually need, and put the advertising
              decisions back in your hands.
            </p>
            <QualifyBtn className="btn lime" />
            <div className="legal-hint" style={{ marginTop: 14 }}>
              5 quick questions · ₹97 refundable application fee for applicants TGO determines are not qualified
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>
            <b>TGO AI Growth Engine</b> · © 2026 TrainerGoesOnline
          </span>
          <span id="privacy-note">
            Application data is used to evaluate fit. Privacy, terms, refund policy and payment integration must be
            finalized before launch.
          </span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      <div className="mobile-cta">
        <a className="btn" href="#qualify">
          See if you qualify <Arrow />
        </a>
      </div>
    </>
  );
}
