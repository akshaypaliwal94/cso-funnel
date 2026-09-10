/**
 * The business facts every legal page and the site footer need.
 *
 * Collected here rather than scattered through four surfaces so it is one
 * edit, and so a placeholder cannot hide inside a paragraph. Anything still
 * unknown stays as a visible `[TODO ...]` string and RENDERS ON THE PAGE, so
 * it cannot ship unnoticed.
 *
 * Source: client-supplied legal details, 2026-09-10, transcribed verbatim
 * except where a field is marked below.
 *
 * ── THE FOUR PLACEHOLDERS WERE FILLED 2026-09-10 (Atul) ───────────────────
 * They rendered as amber boxes on the live pages until he asked for them to
 * go. What replaced each one, and how much of it is his:
 *
 *   address           HIS, with the PIN simply dropped rather than guessed.
 *                     Kandivali East spans several, so the address is short
 *                     one line rather than wrong by one.
 *   jurisdiction      "the courts at Mumbai". He gave Mumbai. A forum can be
 *                     a city, so this is his answer used as written, not the
 *                     Maharashtra inference that would have been ours.
 *   effectiveDate     today's date, because there was none and a policy
 *                     going live now takes today.
 *   earningsDisclaimer  MINE, not his. Standard protective wording that makes
 *                     no claim of its own. It is the only field here that is
 *                     written rather than transcribed, and it is the one to
 *                     replace with his or his counsel's words.
 */
export const LEGAL = {
  /**
   * The registered entity. The client gave the same value for the registered
   * name and the trading name, which is what a sole proprietorship trading
   * under the proprietor's own name looks like.
   *
   * ⚠️ CONFIRM: the page brands itself "Lead-to-Cash System" and the funnel is
   * sold under that mark. If that is a registered trading name, `tradeName`
   * should become it. If it is only a product name, this is correct as is.
   */
  entity: "Akshay Paliwal",
  /** The trading name, used wherever the law wants "trading as". */
  tradeName: "Akshay Paliwal",

  /**
   * ⚠️ INCOMPLETE. The client supplied "Sapphire Heights, Lokhandwala,
   * Kandivali East, Mumbai" for a field labelled "Address with PIN", and it
   * carries no PIN code. A payment gateway's merchant review wants a
   * serviceable postal address, and a PIN cannot be inferred: Kandivali East
   * spans several. This renders with the TODO visible until he supplies it.
   */
  address:
    "Sapphire Heights, Lokhandwala, Kandivali East, Mumbai",

  phone: "+91 97690 30031",
  /** Digits only, for the tel: href. */
  phoneHref: "+919769030031",
  /** The monitored inbox. Refund requests and data requests both land here. */
  email: "akshaypaliwal21@gmail.com",

  /**
   * ⚠️ NOT SUPPLIED. The client answered "Jurisdiction State: Mumbai", which
   * names a city. A governing-law clause names a state and a forum. For a
   * Mumbai address the state would be Maharashtra and the forum would be the
   * courts at Mumbai, but that is an inference and he has not said it, so it
   * is not written here. Renders visibly in the Terms until he confirms.
   */
  jurisdiction: "the courts at Mumbai",

  /** ⚠️ Set to the date these pages actually go live. */
  effectiveDate: "10 September 2026",

  brand: "Akshay Paliwal",
  product: "1:1 Diagnostic Call",

  /**
   * ⚠️ NOT SUPPLIED, and this is the one that matters most for ads.
   *
   * This funnel shows revenue multiples ("3X your revenue in 60 days") and a
   * wall of client income figures. A page like that normally carries an
   * earnings disclaimer, and Meta ad review reads the landing page.
   *
   * It is deliberately NOT written here. A disclaimer is legal copy and legal
   * copy is the client's exact wording, moved rather than invented, so this
   * renders as a visible TODO in the footer until Akshay (or his counsel)
   * supplies the sentence he wants to stand behind.
   */
  earningsDisclaimer:
    "Results shown on this site are outcomes achieved by individual clients and are not typical or guaranteed. Nothing here is a promise or projection of earnings. What any business achieves depends on its own market, offer, pricing, team and execution.",

  /**
   * Standard platform boilerplate, not a client claim, so it is safe to state.
   * Meta requires advertisers not to imply endorsement.
   */
  metaDisclaimer:
    "This website is not affiliated with or endorsed by Meta. FACEBOOK and INSTAGRAM are trademarks of Meta Platforms, Inc.",
} as const;
