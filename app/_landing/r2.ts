/**
 * The Cloudflare R2 public bucket the page's own video is served from.
 *
 * It lives here rather than inside the component that first needed it because
 * two beats now play films out of the same bucket (the hero VSL and the lead
 * testimonial on the results wall). Two copies of an origin is the kind of
 * duplicate that stays correct right up until the bucket moves, and then fixes
 * one caller and silently leaves the other pointing at nothing.
 *
 * THE ORIGIN IS INFRASTRUCTURE, THE KEY IS CONTENT. Callers pass a bare file
 * name, so a new cut of a film is one string to edit next to the copy it
 * belongs to, not a URL to reassemble.
 *
 * No ASSET_V here on purpose: that buster is for files served out of /public,
 * where the path is the only cache key we control. These objects are versioned
 * by their own key, so a new cut ships as a new file name.
 */

/** Client-supplied 2026-09-10. */
export const R2_ORIGIN = "https://pub-ad7f214986d245689e13bb48b2f2819e.r2.dev";

/** Resolve an object key in the bucket to its public URL. */
export function r2(file: string): string {
  return `${R2_ORIGIN}/${file.replace(/^\//, "")}`;
}
