import type { ReactNode } from "react";

import { ArrowGlyph, Wrap } from "@/app/_landing/sdp";
import SiteFooter, { Todo } from "@/components/SiteFooter";

import "./site-legal.css";

/**
 * The shell all three legal pages share: a way back, the title, the effective
 * date, then a capped measure of prose.
 *
 * Type is set once by the .cso-legal-prose rules in components/site-legal.css,
 * so the three pages cannot drift from each other, and the pages themselves
 * ship plain semantic markup with no styling decisions in them.
 *
 * It uses the landing page's own Wrap and ArrowGlyph rather than redeclaring
 * either, so the measure and the back-link mark match the checkout exactly.
 */
export default function LegalPageLayout({
  title,
  effectiveDate,
  intro,
  children,
}: {
  title: string;
  effectiveDate: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="cso-doc">
      <header className="cso-doc-head">
        <Wrap>
          <a className="cso-doc-back" href="/">
            <ArrowGlyph size={13} />
            Back
          </a>
          <h1 className="cso-doc-h1">{title}</h1>
          <p className="cso-doc-date">
            Effective <Todo value={effectiveDate} />
          </p>
        </Wrap>
      </header>

      <article className="cso-doc-body">
        <Wrap>
          <p className="cso-doc-intro">{intro}</p>
          <div className="cso-legal-prose">{children}</div>
        </Wrap>
      </article>

      <SiteFooter />
    </main>
  );
}
