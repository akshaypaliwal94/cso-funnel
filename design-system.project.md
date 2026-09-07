# Skin · SIGNAL & DEPTH (project override) · Layer 3

> Project override for `/workspace/cso-funnel` (Akshay Paliwal, Lead-to-Cash
> System). **This replaces the locked SDP Clinical Blue skin that VSL mode
> normally applies.**
>
> Not derived, not reverse-engineered: transcribed from the client's own
> `Sales Consulting Business/Color System & Theme.pdf` (v1.0, 7 pages, 12 core
> values, with its own measured contrast table). The brain
> (`~/.claude/system/design-system.base.md`, C1 to C13) is unchanged and still
> wins any disagreement.

## Why this overrides the locked skin

SHAPE's VSL mode locks the SDP Clinical Blue skin so every VSL funnel comes out
looking like the last one. The doctrine's own escape hatch is that a re-brand
swaps the token block and keeps the structure. Here the client arrived with a
**complete, measured brand system of their own**, which outranks a house default:
a locked skin exists to stop us re-deriving a look from nothing, not to overrule
a client who already has one.

**What is kept from SDP:** the section anatomy, the band rhythm concept, the
component set, the reveal choreography, the sticky bar behaviour, the FAQ
mechanics. **What is replaced:** every colour, and the light-first polarity.

**The polarity flip is the one structural consequence.** SDP is light-first
(white ground, dark bands reserved for authority and the finale). Signal & Depth
is **dark-first**: Obsidian is stated as "90% of every screen". So the band
rhythm inverts. Dark is the default ground and the rare light band becomes the
accent, not the other way round.

## Tokens (transcribed verbatim from the PDF)

```
/* 01 · PRIMARY. "The spend. Never more than a tenth of the surface." */
--voltage:      #1A0FF5   /* Primary CTA, links. The one colour that converts */
--signal:       #1408CF   /* Hover, active, focus rings */
--cobalt:       #19108D   /* Section fills, gradient mid-stop, charts */
--abyss:        #080842   /* Deep ambient, hero base, footer */

/* 02 · FOUNDATION. "90% of every screen." */
--obsidian:     #0D0D12   /* Page background, the default canvas */
--graphite:     #1A1C20   /* Cards, panels, elevated surfaces */
--slate:        #272632   /* Borders, dividers, disabled states */
--violet-moss:  #414F27   /* Success states, verified, organic accent */

/* 02 · WARM ACCENT. "Humanity, pricing, proof." */
--amber:        #D48B5C   /* Secondary CTA, PRICING, emphasis */
--sand:         #ECB089   /* Highlights, hover on warm, illustration */
--bone:         #F7EADD   /* Body copy on dark, primary text */
--ivory:        #FEF3E8   /* Headlines, maximum contrast moments */

/* Semantic tokens, as the PDF assigns them */
--bg:             #0D0D12   /* body */
--surface:        #1A1C20   /* card, nav, modal */
--surface-raised: #272632   /* hover card, tooltip */
--border:         #272632   /* 1px hairlines */
--text-primary:   #F7EADD   /* headings, body */
--text-secondary: #A9A3B5   /* captions, meta */
--text-muted:     #6E6880   /* labels, timestamps */
--action:         #1A0FF5   /* buy, book, subscribe */
--action-hover:   #1408CF   /* pressed state */
--action-2:       #D48B5C   /* outline CTA, pricing */
--focus-ring:     #4E44FF   /* keyboard focus, 2px */
--success:        #5C7A38   /* form sent, paid */
--warning:        #D49A3E   /* cart expiry, limits */
```

## The spend ratio (the PDF states it as a rule, so it is one)

```
60%  FOUNDATION   Obsidian + Graphite.  Space to think.
30%  STRUCTURE    Cobalt + Abyss.       Hierarchy and depth.
10%  SIGNAL       Voltage + Amber.      ONLY where you want a click.
```

Voltage never exceeds a tenth of the surface. This is C2 (one accent, spent like
a spotlight) written into the client's own system, so it is not negotiable for
visual preference.

## Gradients (verbatim)

```
HERO FIELD    135deg  #080842 → #19108D → #1A0FF5   above-the-fold background
CONVERSION     90deg  #1A0FF5 → #1408CF             primary button fill
DEPTH FADE    180deg  #0D0D12 → #12102D             section transitions
```

## Contrast, from the PDF's own measured table

The client's table is trustworthy and was spot-checked. The rules that fall out
of it, and they are hard:

- **IVORY / BONE on any foundation colour: AAA.** Body and headings, anywhere.
- **SAND on Voltage: 4.58:1.** Passes AA, so it is the safe label on a Voltage
  fill.
- **AMBER on Voltage: 3.15:1 — LARGE TEXT ONLY.** Amber is for pricing set
  large, never a caption on a blue fill.
- **MUTED (`#6E6880`) fails on Slate, Cobalt and Voltage.** The PDF marks it
  "decorative use only" on those. It is a timestamp colour on Obsidian and
  nothing else.
- **Voltage as a SURFACE carries IVORY at 7.90:1**, which is what makes the
  primary button work.

## Type

⚠️ **The PDF specifies no typefaces.** It is a colour system only. Until the
client supplies a type direction, the SDP skin's pairing is retained, because
retaining half a locked skin is a smaller invention than picking two new faces
for a brand that has not chosen them.

## Assets supplied

| File | Use |
|---|---|
| `public/brand/lead-to-cash-logo.png` | The wordmark. 3D chrome-and-electric-blue, 2073×758, transparent |
| `public/brand/logo-with-photo.png` | Square lockup, 1254×1254 |
| `public/brand/akshay-portrait.png` | Founder portrait, 1448×1086, shot on a blue-lit set |
| `public/brand/venn-reference.png` | The Venn as the client drew it. **A reference, not the shipped asset** |
| `public/journey/*.jpg` | Five journey photographs, 2019 to 2023, for the founder chapters |

## Two conflicts the assets create, both real

1. **The logo is a different visual language from the colour system.** The
   wordmark is a 3D chrome-bevelled, glowing, gaming-style lockup. Signal &
   Depth is flat, disciplined and restrained ("a disciplined palette for a
   premium personal brand"). They do not sit together comfortably. The logo is
   the client's, so it ships as supplied, small, and is not restyled. Flagged
   rather than fixed.

2. **The supplied Venn PNG and the 60-day install PDF are both LIGHT designs**
   (white ground, blue / purple / teal / green phase colours). On a dark-first
   page a white PNG would be a hole. So the Venn is **rebuilt as SVG in these
   tokens** rather than dropped in as an image, and the install PDF's content is
   rebuilt as page sections. The originals stay as content references.

---

## THE LIT EDGE — the house treatment for every card and every divider

**Locked, 2026-09-05.** Every card, panel and rule on this funnel carries one
edge treatment. It is not a per-section decision any more: a card that opts out
reads as the unfinished one.

**It was measured off the client's reference render, not estimated,** and the
measurements are the reason it works. Four facts, all of which earlier attempts
got wrong:

1. **The line is lit along its whole width.** It cuts on at full strength right
   at the corner and never fades in. Fading both ends to nothing (the way the
   rule above "Featured in" does) lights only the middle third, and that is the
   failure mode this replaced.
2. **It ends at the corners.** No overhang. A pixel outside the card measures
   the bare ground.
3. **Brightness runs blue → WHITE → blue:** a pure-white nucleus at 50%, a
   secondary flare at 19%, a long dim tail down the right half. That asymmetry
   is the difference between a reflection and a decal, so it is reproduced
   rather than averaged out.
4. **The core is 2px and the halo is gone by 14px.** A hard thin line with a
   tight bloom. Never a soft bar, and never a glow ringing the whole box.

**Glow is not shine.** Spreading light around all four sides of a card is the
bloom this system explicitly replaced. The light belongs on the top edge, and
it comes off that edge upward.

### The tokens (in `app/globals.css`, use them, never re-derive)

| Token | What it is |
|---|---|
| `--edge-line` | the 90° measured profile: the line across a card's top edge |
| `--edge-halo` | the drop-shadow pair applied **to the line**, so the halo inherits the line's own alpha: brightest under the nucleus, absent under the tail. No hand-placed second gradient tracks that. |
| `--edge-line-soft` | same profile, ~half strength, no pure white. For rules INSIDE a card, for stacked rows, and for section dividers. |
| `--edge-halo-soft` | its halo |
| `--edge-line-v` | the vertical cut, for column separators and left rules |
| `--rim-edge` | the side stroke: `volt-100` at the top corners → dead by the bottom edge. **Never a saturated blue at the top** — volt-400/600 there puts a bright band down the first fifth of each side that competes with the line. |
| `--edge-wash` | the light landing inside the panel, gone by a third of the way down. Without it the line floats on a flat panel and stops looking like it is lighting anything. |

### How to apply it

- **Any card:** give it `.sdp-card`. It carries everything. Change the fill with
  `--card-ground` (the fit boxes set it to obsidian); change nothing else.
- **A card that is not an `.sdp-card`:** transparent 1px border, then
  `var(--edge-wash) padding-box, <ground> padding-box, var(--rim-edge) border-box`,
  and the line on a free pseudo-element.
- **The line's slot is `::after`**, because `::before` is spoken for on the
  cards that draw their own devices there. Where `::after` is taken
  (`.cso-journey-frame`), use `::before` and say so in a comment.
- **A card that clips** (`overflow:hidden`) cannot hang the line over its
  border: set `top:0` instead of `top:-1px`.
- **A divider** is `--edge-line-soft` as a *background*, not a border: a border
  cannot carry a gradient along its length. Size it `100% 1px` and position it
  `top`/`bottom`; vertical rules take `--edge-line-v` at `1px 100%`.
- **Hover brightens the LINE**, it does not ring the card.
- **Repeated elements drop to soft.** Eight FAQ rows or five journey frames at
  full strength read as a ladder or a fence. Full strength is for a card that
  stands alone; the open FAQ row takes the full line because that IS the marker.

### What deliberately does NOT take it

- **Small chips and pills.** A 1px lit stroke on a 28px pill is noise.
- **Controls** (the mobile venn stack buttons) take the side stroke only. A lit
  line across the top of a button says "lit panel", and these are things you
  press.
- **The pull quote keeps its amber left rule.** That marker is doing a different
  job; its other three sides take the house stroke.

### The pyramid's outline (THIS SHAPE ONLY)

**Locked, 2026-09-06. Scope: the mechanism section's pyramid in this funnel, and
nothing else.** It is NOT a general rule for shapes, and it does not change how
the lit edge works on cards, dividers or any other component — those stay
exactly as specified above. If another shape ever wants this treatment, that is
a fresh decision, not an inheritance.

Around this shape the outline's value must **change as it travels**. A single
ramp — top bright, bottom dim — reads as a printed outline, not a lit one.

Two parts, and the split is the rule:

1. **The corners are mandatory.** Light pools where a surface turns. Every
   corner of every tier carries a lit run, and they are the strongest points on
   the outline. This is not optional and not decorative: without it the shape
   stops reading as lit.
2. **The straight runs are dynamic.** Between the corners the shine is
   scattered — smaller flares, varying length and level, placed by a hash of the
   shape's own coordinates. Only edges long enough to carry one get one.

**Seeded, never `Math.random()`.** Random numbers differ between the server and
the client, which throws a hydration mismatch, and the highlights jump to new
positions on every reload. Seed from the geometry so it looks scattered and
stays put.

**Every lit run must ramp in and out.** A dash carries one opacity for its whole
length, so on its own it switches on and off at its ends and reads as a painted
segment. Build each run from four nested dashes on the same centre — longest and
faintest first, `[2.4, .14] [1.8, .30] [1.35, .56] [1.0, 1.0]` — so the value
climbs to the middle and falls away symmetrically. Round caps on all of them.

**Weighting.** Where shapes stack, the underside of each is the lit edge and its
top edge sits in the shadow of the one above: top corners at roughly a fifth of
the strength of the bottom ones, and the continuous inner run ramps the same way
down the shape.

**The inner glow is separate from the outline** and follows the same modulation:
a faint continuous run just inside the edge plus a bloom pooled at each corner,
blurred together so it reads as one band whose level rises and falls. One colour
only (currently `volt-600`) — the level changes, never the hue.

**What not to do**, all learned the hard way on this build:
- Do not fill the shape. The interior sits within a few luma of the page.
- Do not widen the inner glow to carry the falloff. A stroke is a flat slab: at
  104 units wide it covered whole tiers (they are ~104 units tall) and the
  inside went solid blue. Keep the slab narrow and let the blur do the falloff.
- Do not add a wide, strong outer bloom near the edge. It washes out the
  contrast at the line and the border reads blurry.
- Do not let the ramp walk into saturated blue. Hold the pale end and drop the
  level, or the outline reads as silver on top and blue underneath.
