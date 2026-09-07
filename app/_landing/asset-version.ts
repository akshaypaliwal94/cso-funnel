/**
 * Every /public asset is referenced through asset(), never as a bare path.
 *
 * The path is the cache key in the browser, at the CDN edge and in Next's image
 * optimizer. Replacing artwork under the same filename therefore changes
 * nothing for anyone except the person who swapped it. Bump ASSET_V in the same
 * pass as any swap and every reference busts at once.
 */
export const ASSET_V = "3";

export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${p}${p.includes("?") ? "&" : "?"}v=${ASSET_V}`;
}
