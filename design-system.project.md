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
