import { Fragment } from "react";
import { featured, missing } from "./content";
import { Wrap } from "./sdp";

/**
 * BEAT 0b · TRUST ROW — §12 authority, hairline trust-chip row (light weight).
 *
 * The source supplies publication NAMES only, no logo files. So this renders as
 * a type row in the display voice rather than a logo strip, and says so: a
 * trust row that quietly looks finished while the artwork is still missing is
 * how a gap ships unnoticed. Swapping in real logo artwork later is a straight
 * substitution inside the same row and nothing about the height or rhythm
 * changes.
 */
export function Featured() {
  return (
    <section className="cso-trust">
      <Wrap>
        <span className="cso-trust-cap">Featured in</span>
        <div className="cso-trust-row" data-sdp-reveal>
          {featured.map((name, i) => (
            <Fragment key={name}>
              <span className="cso-trust-item">{name}</span>
              {i < featured.length - 1 ? <span className="cso-trust-sep" aria-hidden /> : null}
            </Fragment>
          ))}
        </div>
        <span className="cso-trust-note">{missing.pressLogos.label}</span>
      </Wrap>
    </section>
  );
}
