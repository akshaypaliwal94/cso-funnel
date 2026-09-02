/**
 * A placeholder held at the REAL asset's aspect ratio, so when the artwork
 * lands nothing reflows and the swap is a one-line change. The label says what
 * belongs there: whoever supplies the file should know the ask without opening
 * this file.
 */
export function MediaPlaceholder({
  ratio = "16 / 9",
  label,
  what,
}: {
  ratio?: string;
  label: string;
  what?: string;
}) {
  return (
    <div className="cso-ph" style={{ aspectRatio: ratio }}>
      <div>
        <span className="cso-ph-tag">
          <Dot />
          {label}
        </span>
        {what ? <p className="cso-ph-what">{what}</p> : null}
      </div>
    </div>
  );
}

/** A non-media placeholder: no fixed ratio, sized by its own content. */
export function CopyPlaceholder({
  label,
  what,
  src,
}: {
  label: string;
  what: string;
  src?: string;
}) {
  return (
    <div className="cso-ph">
      <div>
        <span className="cso-ph-tag">
          <Dot />
          {label}
        </span>
        <p className="cso-ph-what">{what}</p>
        {src ? <span className="cso-ph-src">Source on file: {src}</span> : null}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "currentColor",
        display: "inline-block",
      }}
    />
  );
}
