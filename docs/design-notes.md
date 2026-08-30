# Design notes

The reasoning behind the decisions the [README](../README.md) states. Kept out of
the README so that file describes what the site *is* rather than arguing for it.

## Nori — why the mascot is built this way

**The app never recolours or re-paths the drawings.** `Nori.tsx` places, sizes and idles
them and nothing else; editing a pose means editing the file. That is why the poses are
referenced as files rather than inlined as JSX — a component that *can* repaint authored
artwork will eventually repaint it by accident.

**The small mark is a crop, not a second asset.** At nav size a full-body Nori collapses
into a grey pill — antenna, arms and feet all disappear into the silhouette — so
`crop="head"` re-declares the viewBox over the same file to keep the eyes, which are the
only part that has to survive. The favicon (`public/nori-mark.svg`) is the same crop baked
into a standalone file, since a favicon cannot reliably reference another SVG.

Motion is placement-level only and obeys the same contract as everything else here:
transform and opacity, no filters, no JS in the motion path, `data-static` to kill it, and
`prefers-reduced-motion` resolving to the resting frame. The float is deliberately slow and
shallow because the drawings already carry their own implied motion — the wave arcs, the
rising Zzz, the rocket's speed lines — and a lively bob on top of those reads as two
animations arguing rather than one character breathing.

**A known inconsistency, stated rather than hidden:** Nori's palette (lavender `#B7A7E8`,
ink `#2E2A40`) is not drawn from the Norrin token system, which is moss / sun / forest /
lichen. The character is legible and holds its silhouette on both the paper ground and the
forest bands, so nothing is broken — but it is the one element on the site whose colour is
not derived from Norrin's own published theme.

The spar-buoy drawings that preceded Nori (`Fyr.tsx`, `Lunni.tsx`) are **deleted**, and the
pilot → production diagram in `TheGap` now carries Nori's `idea` / `laptop` / `rocket` poses
at its three stations. This note used to say the buoy was still there and that replacing it
was a pending decision; it was made, and this paragraph was simply stale.

## Radius — why the scale changed

The scale was `0 / 2px`, on the argument that Norrin's own `2em` pill form fields read soft
and consumer while this is enterprise infrastructure. That argument was right about the
disease and wrong about the cure: what makes a page read consumer is rounding *everything*
indiscriminately, so that curvature says nothing. And `2px` on a 50px button is not a
restrained radius, it is a rasterising artefact — the system was effectively at zero.

Three values, carrying a meaning — **radius means you can touch it**. Hairlines separate
rather than contain, and a rule has no corners, so the production line, the eyebrow rules,
the ruled tables, the section bands, the timeline nodes and the sun terminus are all
unchanged. The only rounded shapes on the page are the ones that respond, and the eye finds
every action without anything having to be coloured louder. That makes the change
subtractive rather than decorative.

The geometry was **borrowed rather than invented**: the scale came off the buoy mark that
stood here before Nori, whose float was `rect w=3.6 rx=1.8` — a capsule, fully rounded —
and whose mast cap was a softly rounded stroke. The drawing is gone; the two radii it gave
the page are still the ones in use, which is the only reason to record where they came
from.

Not rounded, deliberately: **the nav drawer**. It is the header temporarily getting taller —
it shares the bar's ground and takes the bar's own border as its top edge — and a radius
would turn it into a floating card, which is the one thing its construction exists to avoid.

## Controls — why `.btn` exists

There was no button in this system. There were four hand-assembled ones — hero, nav, closing
CTA, mobile sheet — already drifted to three paddings, two transition durations, and two
different ways of writing the same sun hover, one of them a raw hex in a file that could not
see the other raw hex. `.ui` had been extracted for exactly this reason and stopped one rung
short of the thing using it.

Both `.control` and `.panel` invert under `[data-tone='inverse']`, which the header now
declares — without that attribute `[data-tone='inverse'] :focus-visible` never matched
inside the bar, so tabbing the nav while it sat over a forest band drew a **moss** ring at
1.40:1, which is to say no ring at all. axe does not automate focus-indicator contrast, so
every clean audit run to date was silent about it.

## Typography — why the display face was replaced

Norrin's heading face is a **script**, which in an enterprise-AI context reads decorative and
costs them authority. Replacing it was a deliberate correction, not a workaround. Schibsted
Grotesk was commissioned by the Norwegian-Swedish press group — genuinely Nordic provenance
rather than cosplay — and it holds up at both 7.5rem and 0.875rem. Newsreader carries the
human register Norrin's values copy actually has; IBM Plex Mono is the "production" voice.

## What the review changed

The build was put through two rounds of hostile review — briefed to find what was wrong,
not to be encouraging. Findings that were acted on:

- **The same paragraph printed twice in one viewport.** The Gap section's intro repeated,
  word for word, the clauses used as its three station captions. The intro now carries only
  the opening clause; the stations carry the rest. A second round caught that the Gap's
  heading then restated the hero almost verbatim — it now names the problem instead of
  repeating the claim.
- **The bowtie topmark existed in the component API and appeared nowhere.** The isolated
  danger mark is the topmark for the gap; it was missing from the section called "The gap".
  Concept asserted rather than delivered. It now anchors the section.
- **The dash→solid transition landed on station 02**, which argued that deployment and
  production are the same thing — the exact claim Norrin exists to reject. It now lands on 03,
  anchored to the mark itself rather than to a percentage.
- **Dark mode collapsed forest to near-black**, erasing the only structural rhythm the page
  has. The cause was a specificity bug: `:root:not([data-theme='light'])` (0,2,0) silently
  outranked `[data-theme='dark']` (0,1,0), so an explicit toggle lost to the media query.
- **The fixed cream header sliced headings** on the forest sections. It now inverts.
- **The hero used a marker-pen highlight** — the most-copied launch-page gesture of the last
  three years, and it stranded the full stop outside the block.

Findings investigated and **not** acted on, with evidence:

- *"Missing `scroll-margin-top` — the bar eats every section heading."* Not reproducible.
  Anchor navigation lands every section at 96px with headings 180–280px clear of the 72px
  bar. The artefact came from the screenshot harness using `scrollIntoViewIfNeeded()`, which
  ignores `scroll-margin`. The harness was fixed to navigate by hash instead.
- *"The Contact rule stops short of its terminal square."* It completes; `stroke-dashoffset`
  reaches 0 at ~2.4s. The harness was capturing mid-draw. Capture delay increased.
- *"Tertiary grey on forest reads below AA."* Measured 5.4–6.5:1 depending on band. axe
  reports zero contrast violations in both themes.
