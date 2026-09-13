import { PRICE } from "@/lib/offer";

/**
 * ALL landing-page copy, in one place, reproduced VERBATIM from the sole copy
 * source: /workspace/cso-funnel/COPY-SOURCE.md
 *
 * Nothing here is re-voiced, shortened, reordered or invented. Where the source
 * marks a beat `[INCOMPLETE]`, this file carries a `MISSING` marker instead of
 * filler and the section renders a visible placeholder.
 *
 * NOTE ON EM DASHES: the source contains em dashes (U+2014) throughout the
 * client's own copy. The house rule is no em dashes. They are reproduced here
 * verbatim because the copy is the client's, and flagged rather than silently
 * changed. Swapping them for commas or colons is one pass through this file
 * once Atul decides.
 */

export const site = {
  /** Owned by the LAUNCH agent. The landing page only links to it. */
  checkoutUrl: "/checkout",
  /**
   * THE ONE EDIT THE LAUNCH AGENT MADE TO THIS FILE (2026-09-10).
   *
   * This was the literal string "₹197". It is now derived from lib/offer.ts,
   * which is the single numeric source for the price, because that ONE number
   * has to set three things that must never disagree: the label printed on
   * every button on this page, the amount Razorpay actually charges, and the
   * `value` on every Meta event. Two sources drift, and the drift is invisible
   * until the charge and the label disagree on a live page.
   *
   * The displayed value is unchanged: lib/offer.ts reads
   * NEXT_PUBLIC_PRICE_RUPEES and falls back to 197, which is the price this
   * copy source states.
   */
  price: PRICE,
  name: "Akshay Paliwal",
  role: "Fractional Sales Co-Founder",
};

/* ---------------------------------------------------------------- HERO --- */

export const hero = {
  callout:
    "For Coaches, Service Providers & Agencies making min. ₹3L/month already",
  headlineL1:
    "I'll 3X Your Revenue in 60 Days - As Your Fractional Sales Co-Founder,",
  /* The two tokens in line 1 that carry the promise, lit in the warm accent.
     Held as data rather than as markup inside the string, so the headline above
     stays one verbatim, greppable, diffable sentence: if the copy changes, the
     string changes in one place and these keep working as long as the words
     still appear in it. Matched in order, first occurrence only. */
  headlineL1Lit: ["3X", "60 Days"],
  headlineL2: "With My Done-For-You 'Lead-to-Cash' System",
  sub: "I find exactly where your revenue is leaking, fix it by automating 70% of your sales process with custom-built AI systems, then get you (or your team) closing at up to 50% - even at 2X the price you charge today.",
};

export const cta = {
  /* "100% Refundable" was cut from the BUTTON on 2026-09-10 (Atul): the note
     directly beneath it already says the ₹197 is refunded, so the button was
     making the reassurance twice in the space of two lines. The button now
     carries the action and the price; the note carries the reassurance. */
  label: "Book Your 1:1 Diagnostic Call With Akshay - ₹197",
  note: "This is a diagnostic session — if we're not the right fit, your ₹197 is refunded",
};

/* ------------------------------------------------------------ FEATURED --- */

/* THE PRESS ROW. Logo artwork supplied 2026-09-10, trimmed to its own ink and
   converted to a bone monochrome. See the note in Featured.tsx for why they
   are monochrome rather than in their brand colours.

   EVERY FILE IS TRIMMED TIGHT, with no padding around the mark. That is what
   makes the row's gap a real gap: an earlier pass put each mark on a shared
   canvas, and because a stacked lockup carries far more empty canvas than a
   long wordmark, a single CSS gap produced visibly different spaces between
   each pair. The file's edges are the mark's edges now.

   `w` and `nh` ARE THE FILE'S OWN PIXELS, and they are load-bearing rather
   than documentation. These render at `height:var(--logo-h); width:auto`, and
   an image with width:auto that has not loaded yet has NO intrinsic width: it
   collapses to zero. In the mobile marquee the duplicate copy starts outside
   the mask, so it never triggered a lazy load, contributed no width, and the
   track came out one copy long with a hole after the last logo. The intrinsic
   pair lets the browser reserve the right box before the file arrives.

   `h` IS THE DISPLAY HEIGHT IN PIXELS, and it has to be per logo. Three of
   these are wordmarks and one is a stacked icon-over-text lockup: rendered at
   one height, the lockup's type would be half the size of everything else.
   Equal optical weight is the goal, and equal height is not the way to it.
   Each file is baked at 2x its height here, so the row is retina-sharp.

   `name` is not decoration: it is the alt text, so the row still says who
   these publications are to a screen reader and to anyone whose images fail. */
export const featured = [
  { name: "Business Standard", src: "/logos/business-standard.webp", h: 26, w: 433, nh: 52 },
  { name: "Google News", src: "/logos/google-news.webp", h: 52, w: 138, nh: 104 },
  { name: "The Outlook", src: "/logos/outlook.webp", h: 36, w: 406, nh: 72 },
  { name: "The Entrepreneur", src: "/logos/entrepreneur.webp", h: 34, w: 343, nh: 68 },
];


/* ------------------------------------------------------- CLIENT RESULTS --- */

/* THE RESULTS WALL, split India / International behind a toggle. Ported from
   the dfy-new funnel on 2026-09-10 (Atul): same roster, same numbers, same
   two-region split, rebuilt in this funnel's own language.

   IT IS THE SAME MAN'S BOOK OF WORK. These are TGO's clients, and the founder
   beat on this page is the story of building TGO, so the roster belongs here
   as much as it does there. Nothing was re-voiced: every name, role, result
   and multiple is carried across exactly as written.

   THE DATA IS DELIBERATELY LOOSE. Several people have a role and no number,
   a few a number and no role, one has neither and one has no photograph. The
   card renders what is present rather than reserving empty slots, so a sparse
   entry reads as a short card instead of a broken one. Filling the gaps with
   invented roles or figures on a PROOF beat is the one thing this section
   must never do. */
export const results = {
  eyebrow: "Client results",
  titleLead: "They built it.",
  titleLit: "We scaled it.",
  deck: "See how experts turned what they know into businesses that generate more revenue, attract better clients, and scale without relying on them for everything.",
  tabs: [
    { id: "india", label: "India" },
    { id: "international", label: "International" },
  ],
  india: [
    { name: "Sourobh Kulkorni", role: "Leading Spinal Expert", result: "5L/month → 44L/month", roi: "4x ROI", photo: "/testimonials/india/sourobh.webp" },
    { name: "Nimisha Maniar", role: "Founder at Studio Aware", result: "50L/year → 2 CR/year", roi: "33x ROI", photo: "/testimonials/india/nimisha.webp" },
    { name: "Aman & Zohra", role: "Natural Fertility Experts", result: "2L/month → 15L/month", roi: "7x ROI", photo: "/testimonials/india/aman-zohra.webp" },
    { name: "Ankita Barasara", role: "Postpartum Healing Expert", result: "1L/month → 4L/month", roi: "10x ROI", photo: "/testimonials/india/ankita.webp" },
    { name: "Hardik Dhawal", role: "Erectile Dysfunction Expert", result: "1L/month → 4L/month", roi: "8x ROI", photo: "/testimonials/india/hardik.webp" },
    { name: "Prashanth Sharma", role: "Fat Loss Expert", result: "0 → 163 online clients in 5 months", photo: "/testimonials/india/prashant.webp" },
    { name: "Anish & Shubham", role: "Science Driven Performance", result: "1L/month → 8L/month", roi: "5x ROI", photo: "/testimonials/india/anish-shubham.webp" },
    { name: "Hirav Mehta", role: "Metabolism Expert", result: "Multiple 6-figures monthly, on auto-pilot", photo: "/testimonials/india/hirav.webp" },
    { name: "Sunny Bhamra", role: "India’s #1 TRT Expert", result: "4L in 10 weeks", roi: "5x ROI", photo: "/testimonials/india/sunny.webp" },
    { name: "Ayush Thakur", role: "Body Transformation Coach", result: "10x’ed his online revenue in 6 months", photo: "/testimonials/india/ayush.webp" },
  ],
  international: [
    { name: "Marcus Mackay", role: "High Performance Coach", result: "$30K/month → $100K/month", roi: "7x ROI", photo: "/testimonials/international/marcus.webp" },
    { name: "Luke", result: "$50K/month in the first 30 days", photo: "/testimonials/international/luke.webp" },
    { name: "Marco Span", result: "15K Euros in the first 4 weeks", photo: "/testimonials/international/marco.webp" },
    { name: "Rebecca Peri", role: "Trauma Healing Expert", result: "$5.5K in the first 4 weeks", photo: "/testimonials/international/rebecca.webp" },
    { name: "Nikki Barta", result: "0 → 8 high-ticket clients in 4 weeks", photo: "/testimonials/international/nikki.webp" },
    { name: "Diego Carrete", role: "Wellness Expert", photo: "/testimonials/international/diego.webp" },
    { name: "Paul Bradley" },
    { name: "Stephen Campollo", photo: "/testimonials/international/stephen.webp" },
    { name: "Erin McDermot", photo: "/testimonials/international/erin.webp" },
  ],
} as const;

/* ------------------------------------------------------ THIS IS FOR YOU --- */

/* The six pointers are the source's own lines, unchanged and in their original
   order. They are now GROUPED into three boxes rather than run as one list:
   two lines per box, and the grouping is the argument. Box titles, subtitles
   and the deck are Atul's, added 2 Sep. */
export const forYouIf = {
  /* Rendered as "This is for you if.." with FOR YOU lit. The two full stops
     are deliberate and are reproduced exactly as given. */
  titleLead: "This is",
  titleLit: "FOR YOU",
  titleTail: "if..",

  deck: [
    "If these sound like you, you don't need advice.",
    "You need a system and a CSO who fixes it.",
  ],

  boxes: [
    {
      title: "DEMAND EXISTS",
      sub: "You've built something people want",
      points: [
        "You're already making INR 3L+/month selling online programs, services or products",
        "You're either selling via high-ticket 1:1 sales calls or 1:many webinars/workshops",
      ],
    },
    {
      title: "TRAFFIC & LEADS EXIST",
      sub: "Leads are coming in. But sales lag.",
      points: [
        "You're already running paid ads or have an organic leads coming in",
        "You or your sales team have less than 40% closing rate",
      ],
    },
    {
      title: "SYSTEMS ARE MISSING",
      sub: "There's no system to scale revenue",
      points: [
        "You're unable to charge 2-3x your current prices or get full payments on the call",
        "You don't have a system to follow-up, upsell or generate referrals on auto-pilot",
      ],
    },
  ],

  /* The disqualifier under the three boxes. Two lines, always broken: the
     first states the exclusion, the second states who is left. Atul's copy,
     verbatim, added 5 Sep. */
  note: {
    lead: "If these aren't your problems, this isn't the right engagement for you.",
    turn: "We work with businesses that are serious about fixing revenue at the core.",
  },
};

/* ------------------------------------------------------ SUCCESS STORIES --- */

/**
 * Split on the source's own " - " delimiter. Hardik Dhawal's row has no figure
 * in the source, so `result` is null and the card renders visibly incomplete
 * rather than being quietly dropped or filled in.
 */
/* The card anatomy follows Atul's reference render (5 Sep): mark, brand name,
   rule, figure, description, category chip, rule, two outcome cells.
   `result` and `resultLit` are the only fields the SOURCE actually supplies.
   Everything else is null until Atul writes it, and renders as a named slot
   rather than as invented copy: this is the proof beat, and a fabricated
   description here is exactly the claim we must not make.

   `resultLit` is the token inside `result` that takes the amber display
   treatment. It lights a word IN the sentence rather than splitting the
   sentence in two, because "Closed 10 CR in sales" carries its figure in the
   middle and a two-tier stack would have to reorder his words. If Atul wants
   the reference's exact stacked look he supplies figure and caption as two
   fields; that is a copy decision, not a design one. */
export const successStories: {
  name: string;
  result: string | null;
  resultLit?: string;
  logo?: string | null;
  /* The fraction of the logo FILE's height that the mark actually occupies,
     measured off each file. The three supplied logos are padded very
     differently — TGO runs edge to edge (1.00) while FAB is 29% empty white —
     so rendering them at one size makes TGO look flush to its plate and the
     other two look small and floating. Dividing the target height by this
     number cancels each file's own margin and puts all three marks at the same
     optical size. Re-measure if a file is replaced. */
  logoTrim?: number;
  desc?: string | null;
  tag?: string | null;
  outcomes?: { l1: string; l2: string }[] | null;
}[] = [
  {
    name: "TGO",
    result: "Closed 10 CR in sales",
    resultLit: "10 CR",
    logo: "/stories/tgo_logo.png",
    logoTrim: 1.0,     /* 276x136, no margin at all */
    desc: null, tag: null, outcomes: null,
  },
  {
    name: "FM4 Therapy",
    result: "1 CR in 6 months",
    resultLit: "1 CR",
    logo: "/stories/fm4-therapy.jpg",
    logoTrim: 0.854,   /* 575x480, 35px of white on every side */
    desc: "Sourobh Kulkorni, chose us to launch his flagship online program to help people reverse their knee, back & neck pain using his GOI patented ball therapy.",
    tag: null, outcomes: null,
  },
  {
    name: "FAB",
    result: null,
    logo: "/stories/fab.jpg",
    logoTrim: 0.808,   /* 755x480, 46px of white on every side */
    desc: "FAB Bank, Middle East's biggest bank chose us to launch their entire corporate wellness program for their 7500 workforce.",
    tag: null, outcomes: null,
  },
];

/* ---------------------------------------------------------- MECHANISM --- */

export const mechanism = {
  headline: "I'll 3X your revenue in 60 days. Here is the system I install",
  sub: "It comes down to three numbers:",
  threeNumbers: [
    "A 50% lift in how many of your leads say yes",
    "A 50% lift in what each deal is worth",
    "A 50% lift in the deals you currently lose after the first call",
  ],
  multiply: "These three don't add up. They multiply.",
  mathsCaption: "The maths",
  mathsBefore:
    "Say you get 100 leads a month. Ten of them close, at ₹1 lakh each. That is ₹10 lakh.",
  mathsAfter:
    "Now fifteen close instead of ten. Each one pays ₹1.5 lakh instead of ₹1 lakh. And the strong follow-up process brings another five clients you thought weren't going to close, plus 2 referrals because there is a proven referral system in place.",
  mathsResult: "The same 100 leads will bring in ₹30 lakh.",
  closing: [
    "That is why fixing only your pitch, or only your follow-up, never works. One number goes up for a month. The other two pull it straight back down.",
    "You already know how this feels. One month everything works. Next month — same leads, same team, same ad spend — and the number falls off a cliff. Here is what I build instead:",
  ],
  /* ---- Structure added to match Atul's reference render (6 Sep) ----------
     FLAGGED: the labels below are MINE, not the source's. The source states
     the maths as prose ("Say you get 100 leads a month. Ten of them close, at
     ₹1 lakh each..."), and a table needs row names. Every VALUE in the table
     is a number the source itself states; only the row and column labels are
     new, and they name the numbers rather than making any claim about them.
     The eyebrow is the reference's own wording. Atul to approve or replace. */
  engineEyebrow: "The engine behind 3X growth",

  /* FLAGGED, same as the pyramid: the intro line and the three title/sub pairs
     below are transcribed from Atul's reference render (6 Sep), not from the
     copy doc. The doc states each driver as a single sentence carrying its own
     figure ("A 50% lift in how many of your leads say yes"); the card he asked
     to replicate states them as a NAME and a plain-English gloss, with no
     figure at all — the figures live on the pyramid beside it. Approve or
     replace. The closing line IS the doc's own. */
  engineIntro:
    "Revenue growth isn't about working harder or getting more leads. It comes from improving three key drivers:",
  drivers: [
    {
      title: "Lead-to-close conversion",
      sub: "Get more of your leads to say yes.",
      pct: "+50%",
    },
    {
      title: "Average deal value",
      sub: "Increase what each deal is worth.",
      pct: "+50%",
    },
    {
      title: "Recovery of deals lost after the first call",
      sub: "Win back the deals you're currently losing.",
      pct: "+50%",
    },
  ],

  mathsTable: {
    head: { metric: "Metric", before: "Before", after: "After installing the system" },
    rows: [
      { metric: "Leads per month",             before: "100",      after: "100" },
      { metric: "Deals closed",                before: "10",       after: "15" },
      { metric: "Average deal value",          before: "₹1 lakh",  after: "₹1.5 lakh" },
      { metric: "Recovered / follow-up sales", before: "0",        after: "+5 clients" },
      { metric: "Referral sales",              before: "0",        after: "+2 clients" },
    ],
    total: { metric: "Total revenue", before: "₹10 lakh", after: "₹30 lakh" },
  },

  /* The pyramid tiers, in the SAME ORDER the source names its three numbers,
     and rendered bottom-up so the base is the first driver.

     FLAGGED: the label and caption on each tier are taken from Atul's own
     reference render (6 Sep), not from the copy doc. The doc states each driver
     as one sentence ("A 50% lift in how many of your leads say yes"), which has
     no title in it, and the layout he asked to match needs a label, a figure
     and a caption as three separate pieces. These are his image's wording, so
     nothing here is invented, but they are not the copy doc's words either and
     should be approved or replaced. The figure is the doc's own 50%. */
  /* RETIRED 2026-09-10 (Atul): the pyramid was removed from the section. It
     and the drivers list beside it were the same three drivers twice, so the
     shape went and its +50% figures moved onto `drivers` above, where the row
     already names the driver each figure measures.

     Kept, not deleted, because the `caption` strings here are the only place
     the reference render's wording survives, and `label` is a shorter name for
     each driver than the drivers list carries. Neither is rendered now. */
  pyramid: [
    {
      label: "More leads say yes",
      pct: "+50%",
      caption: "Get more of your leads to say yes.",
    },
    {
      label: "Higher deal value",
      pct: "+50%",
      caption: "Increase what each deal is worth.",
    },
    {
      label: "Recover lost deals",
      pct: "+50%",
      caption: "Win back the deals you currently lose after the first call.",
    },
  ],


  vennInstruction: "Tap any part of the diagram to see details on what we fix.",

  /* The head of the diagram beat. The headline and its deck are the FIRST of
     the two closing paragraphs, split at its own sentence break — every word is
     the doc's, only the line break is new. The paragraph below them is the
     second closing paragraph, whole. */
  systemEyebrow: "The system",

  /* FLAGGED: the summary bar under the diagram. Its first line is the three
     circle names joined, and its headline is venn.core.label — both already in
     the doc. The closing line is from Atul's reference render (6 Sep), not the
     doc. Approve or replace. */
  vennSummary: {
    note: "Same leads. Same team. Same spend. A completely different outcome.",
  },
};

/* ---------------------------------------------------------------- VENN --- */

/**
 * Fully specified by the source's own table (transcribed from the client's
 * `Venn Diagram.png`). Rebuilt as SVG in the brand tokens rather than shipped
 * as the PNG, which is a light design and would be a white hole on a dark page.
 *
 * The PNG spells the AI Systems rim label "REACVATION". Corrected here to
 * "REACTIVATION", per the source's own note: it is a typo in an asset, not copy.
 *
 * DIAGNOSIS carries no item list in the source (the PNG shows an icon in that
 * slot), so it has none here. An empty list is honest; three invented bullets
 * would not be.
 */
export const venn = {
  circles: [
    { key: "d", name: "DIAGNOSIS", rim: "YOUR CALLS | YOUR NUMBERS", items: [] as string[] },
    {
      key: "c",
      name: "CLOSING",
      rim: "THE PITCH | THE PRICE",
      items: ["Objection Handling", "Value Positioning", "High-Ticket Conversions"],
    },
    {
      key: "a",
      name: "AI SYSTEMS",
      rim: "FOLLOW-UP | REACTIVATION | UPSELL | REFERRALS",
      items: [
        "Follow-Up Automation",
        "Reactivation Sequences",
        "Upsell Flows",
        "Referral Systems",
      ],
    },
  ],
  /** The overlaps. `of` is read off the diagram's own geometry, not invented. */
  overlaps: [
    { key: "dc", label: "2X PRICE", of: ["DIAGNOSIS", "CLOSING"] },
    { key: "da", label: "NO LEAKS", of: ["DIAGNOSIS", "AI SYSTEMS"] },
    { key: "ca", label: "50% CLOSE RATE", of: ["CLOSING", "AI SYSTEMS"] },
  ],
  core: {
    key: "core",
    label: "3X REVENUE IN 60 DAYS",
    of: ["DIAGNOSIS", "CLOSING", "AI SYSTEMS"],
  },
};

/* ----------------------------------------------------- THE 60-DAY INSTALL --- */

/**
 * Transcribed from the client's `Lead-to-Cash System - 60 Day Install.pdf` via
 * the copy source. This is the page's process spine.
 *
 * The source writes each bullet as a bold lead, an em dash, then the detail.
 * That formatting is preserved exactly: `lead` and `rest` are the two halves of
 * the client's own sentence, and the em dash is printed back between them.
 */
export type PhaseBullet = { lead: string; rest: string };
export type PhaseSystem = { name: string; trigger: string; kills: string };
export type Phase = {
  n: string;
  name: string;
  eyebrow: string;
  badge: string;
  weeks: string;
  note?: string;
  bullets: PhaseBullet[];
  systems?: PhaseSystem[];
  quote: string;
};

export const process60 = {
  eyebrow: "The 60-day install",
  headline: "THE LEAD-TO-CASH SYSTEM",
  deck: "Four phases. Sixty days. This is how those three numbers move.",

  phases: [
    {
      n: "01",
      name: "DIAGNOSIS",
      eyebrow: "THE NUMBERS NOBODY EVER SHOWED YOU",
      badge: "EVERY LEAK, IN RUPEES",
      weeks: "WEEK 1-2",
      bullets: [
        {
          lead: "A proper session with you first",
          rest: "what you think is broken, and what you have already tried to fix",
        },
        {
          lead: "Your real calls, not a questionnaire",
          rest: "I listen to how your deals are actually won and lost",
        },
        {
          lead: "Then the numbers you have never had",
          rest: "you know your cost per lead. You probably don't know your cost per show-up, your revenue per lead, or your LTV to CAC ratio",
        },
        {
          lead: "And a target on each one",
          rest: "so on day 60 there is a scoreboard, not an opinion",
        },
      ],
      quote:
        "Almost every founder can tell me their cost per lead in two seconds. Almost nobody can tell me what a booked call actually costs them — and that is usually where the money is going.",
    },
    {
      n: "02",
      name: "CLOSING",
      eyebrow: "SELLING WITHOUT SOUNDING SALESY",
      badge: "MORE YES, AT A HIGHER PRICE",
      weeks: "WEEK 3-4",
      bullets: [
        {
          lead: "A pitch built around how much they already know",
          rest: "unaware, problem-aware, solution-aware, or ready to buy. Four different conversations, not one script.",
        },
        {
          lead: "Your own best call turned into the standard",
          rest: "so the version that wins stops being an accident",
        },
        {
          lead: "Every objection answered before it arrives",
          rest: "including price, so you stop discounting to rescue a deal",
        },
        {
          lead: "Pre-call and post-call frameworks",
          rest: "they turn up warm, and they buy again afterwards",
        },
      ],
      quote:
        "Nobody sounds pushy because of the words they use. They sound pushy because they are pitching someone who is not ready to hear it yet.",
    },
    {
      n: "03",
      name: "AI SYSTEMS",
      eyebrow: "SEVEN SYSTEMS, BUILT AROUND YOUR BUSINESS",
      badge: "70% OF YOUR PROCESS, AUTOMATED",
      weeks: "WEEK 4-5",
      note: "Custom-built to your offer, your pricing and your actual calls — then installed and handed over. AI agents running on WhatsApp and email. You own all of it.",
      /** name · trigger — consequence, exactly as the source separates them. */
      systems: [
        {
          name: "Nurture Engine",
          trigger: "A lead comes in, before the call",
          kills: "They turn up knowing who you are, instead of cold",
        },
        {
          name: "Reminder System",
          trigger: "24 hours and 1 hour before the call",
          kills: "No-shows you are already paying for",
        },
        {
          name: "Follow-Up Engine",
          trigger: "The call ends with no decision",
          kills: "The seventh touch nobody ever makes",
        },
        {
          name: "Reactivation Engine",
          trigger: "A lead goes quiet for 30, 60 or 90 days",
          kills: "Dead leads you paid for once and never used",
        },
        {
          name: "Upsell Flow",
          trigger: "A client hits a result or a milestone",
          kills: "Revenue left sitting on the table",
        },
        {
          name: "Cross-Sell Flow",
          trigger: "A client needs the thing next to what they bought",
          kills: "The second sale nobody ever offers",
        },
        {
          name: "Referral System",
          trigger: "A client gets the outcome you promised",
          kills: "Referrals that only happen by accident",
        },
      ],
      bullets: [],
      quote:
        "You don't have a follow-up problem. You have a \"someone has to remember\" problem. Systems don't forget, and they don't have a bad week.",
    },
    {
      n: "04",
      name: "AUTOPILOT",
      eyebrow: "DAY 60 BECOMES YOUR NEW FLOOR",
      badge: "3X, AND STILL CLIMBING",
      weeks: "WEEK 5-8",
      bullets: [
        {
          lead: "A dashboard that shows where deals are dying",
          rest: "you stop guessing, for good",
        },
        {
          lead: "A simple weekly review that actually happens",
          rest: "every call teaches you something instead of vanishing",
        },
        {
          lead: "The system gets better every month",
          rest: "the pitch sharpens, the follow-up gets smarter, the numbers keep climbing",
        },
        {
          lead: "You own all of it",
          rest: "it stays in your business whether I am there or not",
        },
      ],
      quote:
        "Most businesses have one great month, then spend the next six trying to remember what they did differently. This is the part that makes sure you never have to guess again.",
    },
  ] as Phase[],

  numbersCaption: "The three numbers all of this moves",
  numbers: [
    { n: "50%", t: "more of your leads say yes" },
    { n: "50%", t: "more from every deal you close" },
    { n: "50%", t: "fewer lost after the first call" },
  ],
  numbersLine:
    "These three don't add up. They multiply. That is where 3X comes from.",

  closingBar: "DAY 60 → UP TO 3X REVENUE",
  closingLine: "And it does not stop there. The system keeps improving after I step back.",
  footnote:
    "Sixteen pieces, built from your own calls and your own numbers. Your baseline is locked before week 1 — and I am paid on what we add above it.",
  signature: "AKSHAY PALIWAL · SALES CO-FOUNDER",
};

/* ------------------------------------------------------------- FOUNDER --- */

/* FLAGGED: everything in this block is transcribed from Atul's reference render
   (7 Sep), not from the copy doc — the deck, the one-line summary, the three
   credential chips, and each chapter's year, spine label and pull-quote. The
   chapter TITLES and BODIES below are the doc's own and are untouched. Approve
   or replace. */
export const founderDeck = "Same journey. Real lessons. A bigger impact now.";
export const founderLine = "From AI sales to building TGO to owning the revenue gap.";
export const founderChips = [
  { icon: "bars", label: "Sales operator" },
  { icon: "rocket", label: "Builder at scale" },
  { icon: "target", label: "Obsessed with revenue outcomes" },
];

export const founderChapters = [
  {
    n: "01",
    photo: "/journey/02-2019.jpg",
    title: "I Started As The Lowest-Paid Employee",
    body: [
      "In 2018, I joined an AI company that is a unicorn today. I had never sold internationally or explained AI to people who had never even heard of it - so I learned the only way I could: on calls, getting rejected and getting better.",
      "Eighteen months later, I had sold nearly $2 million to some of India's biggest broadcasters, including Zee, Star and some of the world's biggest sports leagues like Olympics, F1 Racing, Bundesliga, among other unicorns. My employer fully paid to fly me to Europe twice for deals—and I eventually became one of the highest-paid employees in the company.",
    ],
  },
  {
    n: "02",
    photo: "/journey/01-first-business.jpg",
    title: "Then I Built My Own Company",
    body: [
      "In 2020, I started TGO. If I could sell a complex product for someone else, I thought, why not build and sell my own?",
      "Since then, TGO has worked with nearly 1,000 businesses across 25+ countries, grossed over ₹15 crore, grown to 100 employees by 2023—and we're still growing strong in 2026.",
    ],
  },
  {
    n: "03",
    photo: "/journey/03-2021.jpg",
    title: "But Building TGO Revealed A Bigger Problem",
    body: [
      "We became very good at generating leads. The ads worked, the pipelines filled, and the cost per lead made sense - yet revenue rarely grew at that scale.",
      "I kept seeing the same pattern: the money wasn't dying in marketing. It was dying in the gap between a lead coming in and someone actually closing it.",
    ],
  },
  {
    n: "04",
    photo: "/journey/05-2023-b.jpg",
    title: "So I Decided To Own That Gap",
    body: [
      "Everyone was blaming everyone else - the agency blamed sales, sales blamed the leads, clients blamed the agency, and founders were stuck paying for all three.",
      "After years of selling and building a company, I realised the biggest gap in most businesses is the one nobody owns: turning opportunities into revenue. That's why I stopped focusing on selling more leads—and started focusing on helping businesses close the ones they already have.",
    ],
  },
];

/**
 * The five journey photographs, in the order the client filed them. They ship
 * UNCAPTIONED: the client supplied images and no captions, and writing a line
 * for each would be inventing a story around someone else's photographs. The
 * only label on the strip is the span Atul confirmed, 2019 to 2023.
 */
/* PAIRED WITH THE CHAPTERS 2026-09-10. Each chapter now carries its own
   photograph on the `photo` field above, matched IN THE ORDER THE CLIENT FILED
   BOTH: the filenames run first-business, 2019, 2021, 2023, and the chapters
   run 2018, 2020, the problem it exposed, the decision. Sequential is the only
   mapping that is not us deciding what someone else's photographs are of.

   `05-2023-b.jpg` HAS NO CHAPTER. There are four chapters and five images, so
   the last one is unplaced. It is left here rather than deleted: tell us which
   chapter it belongs to and it goes in, or say drop it and it goes.

   This array is no longer rendered anywhere. */
export const journey = [
  "/journey/01-first-business.jpg",
  "/journey/02-2019.jpg",
  "/journey/03-2021.jpg",
  "/journey/04-2023-a.jpg",
  "/journey/05-2023-b.jpg",
];

export const brand = {
  logo: "/brand/lead-to-cash-logo.png",
  logoW: 2073,
  logoH: 758,
  portrait: "/brand/akshay-portrait.png",
  portraitW: 1448,
  portraitH: 1086,
};

/* ----------------------------------------------------------------- FAQ --- */

export type FaqBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export const faqs: { q: string; a: FaqBlock[] }[] = [
  {
    q: "How is this different from a sales coach or a course?",
    a: [
      { kind: "p", text: "A course is an event. You watch it, you feel motivated, and three weeks later nothing has actually changed in your business." },
      { kind: "p", text: "This is an install. I build the pitch, the objection answers and the follow-up systems inside your business, then stay on to listen to your real calls every month and tell you what to fix." },
    ],
  },
  {
    q: "I close everything myself. I don't have a sales team. Does this still work?",
    a: [
      { kind: "p", text: "Yes — and it is often easier." },
      { kind: "p", text: "Nothing here needs a team. Your pitch gets built from your own best calls, not from a template. The AI systems do the follow-up you are currently doing at 11pm, or not doing at all." },
      { kind: "p", text: "The only thing I need is enough activity to diagnose properly." },
    ],
  },
  {
    q: "3X in 60 days sounds too good. Is it realistic?",
    a: [
      { kind: "p", text: "It is not one big jump. It is three small ones stacking on top of each other." },
      { kind: "p", text: "Say 100 leads come in this month. Ten of them buy, at ₹1 lakh each. That is ₹10 lakh." },
      { kind: "p", text: "Now three things each improve by up to 50%:" },
      {
        kind: "list",
        items: [
          "15 people buy instead of 10",
          "Each one pays ₹1.5 lakh instead of ₹1 lakh",
          "Your follow-up rescues another 7 deals you were writing off completely",
        ],
      },
      { kind: "p", text: "The same 100 leads can make you over ₹30 lakh." },
      { kind: "p", text: "Nothing doubled. Nothing tripled. Three separate numbers went up by 50% — and because they multiply instead of adding up, you land past 3X." },
    ],
  },
  {
    q: "What exactly is included?",
    a: [
      { kind: "p", text: "It's a completely done-for-you service with 1:1 consulting. It includes everything in the four phases — the diagnosis, the pitch and objection playbook, the design of all seven AI systems, the dashboard, and the weekly review." },
    ],
  },
  {
    q: "How much of my time will this take?",
    a: [
      { kind: "p", text: "Weeks 1 and 2 need real time from you — one proper working session, plus access to your recordings and numbers. After that it is a 1-hr weekly call." },
      { kind: "p", text: "The whole point is to take sales off your plate, not to add one more thing you have to manage. If I need three hours of your week for sixty days, I have built it wrong." },
    ],
  },
];

/* --------------------------------------------------- MISSING CONTENT ----- */

/**
 * Beats the source still marks incomplete. Each renders as a labelled
 * placeholder sized at its final shape, so dropping the real content in
 * reflows nothing.
 */
export const missing = {
  vslVideo: {
    label: "VSL video not supplied",
    what: "The hero's focal object. Drop the final video in at 16:9 and the frame swaps from this placeholder to a real video element with no layout change.",
  },
  pressLogos: {
    label: "Press logo files not supplied",
    what: "Names only. Swapping in real logo artwork later is a straight substitution inside the same row.",
  },
  storyResult: {
    label: "Result not supplied",
  },
  storyLogo: { label: "Logo" },
  storyDesc: { label: "One-line description of the work" },
  storyTag: { label: "Category" },
  storyOutcomes: { label: "Two outcomes" },
};
