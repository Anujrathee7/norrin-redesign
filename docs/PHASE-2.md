# Phase 2 — design refinement pass

Phase 1 built the site and rebuilt the navbar pop-out. Phase 2 audited the whole UI and acted
on it. The audit was a 14-agent read-only pass — ten auditors (five section pairs, plus
typography, colour/dark, motion/interaction, responsive/layout, and a hostile "does this read
as AI-default" critic), then three adversarial skeptics whose job was to *refute* each
finding against the real code and screenshots, then a synthesis. 161 findings, 132
adversarially checked.

---

## Shipped

**Navbar settled.** Four variants behind `?nav=1..4` became one. Variant 1 (Centred) won;
`variants.tsx` and the dev picker are gone, −382 lines. The runner-up made the nav items
stations on the production line — the only option that could not be lifted onto another site,
and still wrong: it put a miniature of the page's signature device in the chrome at a size
where the state change is a 3px mark, 200px above the real one. Both visible in the hero
viewport at once, the small one teaching the reader to stop noticing the big one.

**Fake affordances deleted.** Eight breaches of the build's own honesty rule, all in the UI
rather than the copy: four case rows were `<a href="#work">` inside `<section id="work">`;
three publication CTAs were `<a href="#thinking">` inside `<section id="thinking">` under
labels naming real destinations; a "Named partner" badge rendered a formal partner tier from
a field that only records *which Norrin paragraph mentions Anthropic*; an Instagram link
pointed at a bare domain root; the primary CTA's email was the one consequential string
outside the provenance file. A fabricated affordance is the same class of dishonesty as a
fabricated testimonial. Also gone: the completing-rule hover on two non-interactive lists —
the page's signature gesture, spent on static text.

**The page compressed.** Beliefs cut. Platforms folded into Pillars as a spec block (keeping
its `#platforms` id). Proof's four-across metric row cut — two of its four figures already
appeared in the hero one viewport earlier — with the remaining two moved into the hero's
station log, which now *derives* every figure from `norrin.ts` instead of hard-coding four of
them. `story.recognition` promoted from 14px grey to Proof's `h2`, replacing the page's only
`sr-only` heading. Ladder renumbered, contiguous 01–07.

**The production line made one line.** It was four different objects:

- **Mobile rail:** three disconnected stubs, no dashed→solid junction, no crossing square —
  the section lost the one moment it exists to show, on the majority breakpoint, while the
  comment directly above it claimed the opposite. Cause: the rail was anchored to the icon
  column, and a flex child only stretches to the row's *content* box, so every segment
  stopped short by the row's padding-bottom. Re-anchored to the `<li>`; now continuous, with
  the crossing square at station 03's waterline.
- **Hero joints:** the mark's container was `h-0` between two `h-px` siblings under
  `items-center`, so centring resolved onto a half pixel and rounded down — a one-pixel
  staircase at both joints, in the one object the page is remembered by. Now `items-start`
  with three `h-px` children. **Measured: joint delta 0.00px at 390 / 700 / 834 / 1512 /
  1920 / 2560.**
- **Hero above ~1667px:** the solid tail was `clamp(40px,9vw,150px)` while its labels sat in
  a 1512-capped container, so the mark walked out from under the word naming it and
  "Production" ended up labelling the dashed side. The tail is now measured from the
  container's edge.
- **Proof:** `sm:grid-cols-2` snapped the timeline in half exactly at tablet. Below `lg` it is
  now vertical — the same device rotated, which is how TheGap already handles its own narrow
  fallback. And "real" was drawn in `hairline-strong`: the one implementation of four that
  said *solid* in a different colour. Now moss, like the rest.

**Sun given one meaning.** Fixed the build's only WCAG failure: the focus ring was moss on
forest at **1.40:1** across both inverse bands, covering the page's only conversion action.
axe does not automate focus-indicator contrast, so a clean axe run was never evidence about
it. Sun on forest is 10.25:1. Deleted two sun marks measuring **1.03:1** and **1.09:1** on
paper; Pillars' active state moved onto a moss rule. Opacity-fade hovers on both CTAs became
colour swaps — fading the page's most emphatic colour makes the signal go muddy under the
pointer, which is backwards.

**Numbering made to mean sequence again.** The page numbered six things; three were not
sequences. Roles' 01–04 (four simultaneous responsibilities, where "03" meant two different
things inside one section) and Thinking's 01–03 (directly under a heading reading "Start
anywhere you like.") are gone. The section ladder and the Gap stations keep theirs, because
order carries information there.

**Dead motion removed.** `useSeaState` ran a permanent `requestAnimationFrame` loop plus two
window listeners and rendered nothing: it wrote `--sea`/`--lean` onto an ancestor in Hero
while `fyr.css` declared both on `.fyr` itself, and a declaration on the element always beats
an inherited value. The mascot's most-documented behaviour was absent from the shipped build.
Deleted, with the orphaned `data-engaged` rule and the unreferenced `@property --fyr-roll`;
the `--sea` arithmetic collapsed to the constants it always resolved to. Roll and heave
verified still running at 7s / 4.5s with a live, changing transform.

**Page resequenced so the nav marker only travels one way.** The bar marks the section you
are reading with its own length of the bottom rule, which only reads as wayfinding if the
marker moves in one direction. It did not: scrolling down lit nav positions **4 → 1 → 2 → 1 →
3**, two backward jumps. The cause was not the bar's order but the page's — "Company" pointed
at Proof, then the *second* section, while "What we do" owned Roles and Pillars, which sat
either side of Work.

Reordering the bar alone would have left one jump (Pillars still pulling back after Work), so
the page was resequenced instead: `Gap → Roles → Pillars → Work → Thinking → Proof → Contact`.
Every nav item now owns a contiguous run, in bar order, and the conventional nav order is
preserved. **Measured: the marker path is now 1 → 2 → 3 → 4, monotonic.**

The narrative it produces is the better one anyway — the problem, what we take responsibility
for, what you can buy, who we did it for, the thinking, the track record, the ask — and the
h2 sequence now reads as one argument. Proof also lost its hairline border: it used to sit
between two ground sections and needed one; it now sits between a surface band and a forest
band, where tone does the separating. That removes the last place the page used a hairline
and a tonal step to do the same job.

**Footer blurb rewritten.** Same claims, plainer sentences, flagged `paraphrase: true` with
the source quoted verbatim beside it so `norrin.ts`'s provenance rule still holds for every
other string. The 2025 recognition is not repeated there because it is now Proof's heading.

**Dark made a translation, not an inversion.** In light the forest band is the darkest plane
on the page — you cross into it and the rules change. In dark it had been "deepened" to
#0d2a1b: L* 14.5 against a ground at L* 5.1, which made it the *lightest* plane, 1.23:1 from
the page, with no hairline marking the edge. Same pixels, opposite rhetoric, and practically
invisible. It is now **raised** to #16452c (L* 25.6, 1.73:1) — within three L* of the
light-mode forest, so it reads as the same material at a different exposure.

Dark moss moved too. Light moss and sun are the same hue (58 vs 57) and separate by
**luminance** — moss dark, sun light, 7.32:1 apart. In dark the accent has to be light to
survive on a near-black ground, so that separation is unavailable, and the old #c9c574 sat at
sun's own hue 1.53:1 away: the moss/sun distinction the whole system rests on had degraded to
"slightly less bright yellow". Dark moss now separates by **hue** instead (86 against sun's
57). Same role, same family, legibly not the signal.

The palette also went from three declarations to one. It was a light `:root`, a
`prefers-color-scheme` copy and an explicit `[data-theme]` copy, with a nine-line comment
explaining the specificity ordering that made the last one win — so every token had to be
edited in two places, and one had already drifted. `light-dark()` keys off `color-scheme`, so
the OS preference and the explicit override became the same mechanism and the ordering problem
stopped existing. `--surface-sunk` and `--danger` were deleted; neither was referenced by any
component.

**The type scale named what it already shipped.** ~22 arbitrary sizes against nine declared
roles, now **one** (a deliberate one-off ramp for the customer roster). Added `.ui` — the
de-facto UI size at fourteen unnamed call sites — `.display-4` for the rung five files were
each hand-rolling a clamp for, and `.wordmark` for the lockup written out twice. Deleted the
role-plus-override pattern at both sites that applied `.display-3` and then replaced its
font-size, keeping only the tracking, which silently coupled those files to a role they were
not using. Deleted `.measure` (zero call sites) and the baked `color` on `.caption`, which ten
of its fourteen uses immediately overrode.

Two floors were wrong at the small end. `.thesis` resolved to 27.8px at 390 against
`.display-3`'s 28.6 — one rung apart at desktop and **inverted on phones**, so the two display
voices swapped rank at the width most people use. And the deck-to-body ratio fell from 1.33 to
1.10, converging exactly where hierarchy is needed most. Both floors raised.

**The layout primitives were made true.** `Container` claimed to "establish the measure and
the grid" and emitted no grid property — the grid was a string hand-copied into eight files,
now a `Grid` primitive and **zero** hand-written copies. `SectionHeader` claimed its index was
"hung in the left margin on wide viewports" and rendered it in normal flow at every width;
that claim is deleted rather than built, because breaking the consistent left ledger was
explicitly rejected. Container's `width` prop is gone: all sixteen call sites passed `wide`,
and the other two measures were dead options that still had to be read.

Spacing became a prop. `cx` is a plain join with no tailwind-merge, so passing
`className="mb-6"` appended a second margin instead of replacing the first, and which won was
decided by Tailwind's stylesheet order rather than the caller. **Measured: Roles asked for
28px and rendered 80px.** It renders 28px now.

**Polish, batched last.** Thirteen bordered, padded, radiused capability chips became one
ruled mono line — in a system where hairlines separate, a box around each item makes the
hairline start *containing*, and a row of them reads as filter controls you can click. The
customer roster became an authored grid instead of a `flex-wrap` that produced nine names and
a lone orphan. Caruna's display figure went: 87,300 was already printed twice in the same
eyeline, and reserving its column moved the body text's right edge ~250px between row 1 and
rows 2–4 inside a full-width-ruled table. The isolated-danger block lost "It is the shape this
whole section is about." — the design annotating itself, telling the reader the metaphor is a
metaphor, which is the one move that makes a device look decorative. Platform names ordered by
layer, since the caption above them names two. Contact's duplicated seven-offices sentence cut
(the footprint grid states it with the actual data). Locale listbox given a focus indicator.

---

## Where the audit was wrong, and how we knew

Three findings were rejected on measurement or on reading the code:

1. **"Move Contact's CTA from sun to moss to spend less sun."** Moss on forest is 1.40:1 —
   the identical value being fixed as a WCAG failure on the focus ring in the same package.
   The button's fill would have disappeared into the band. On inverse grounds sun is not a
   budget spend, it is the stand-in for moss. The budget is now stated once in `index.css`
   where it can be counted; it previously lived in two component comments that each claimed
   to be "the third and last permitted use" and neither could see the other.
2. **"Delete `WATER` / `showWater` / `fyr-drift` — all six call sites opt out."** Four of
   eight opt out. `showWater` defaults to `true` and TheGap's two marks are above the compact
   threshold, so water renders. Kept.
3. **"Every screenshot predates the code."** The full-page set was newer than the newest
   source file. Only the per-section and dark sets were stale.

Two of the audit's own figures were also off: page-height measurements were taken from a **2×
screenshot**, so every absolute claim was double the real value. The proportional ones (the
"unbranded 70%") are scale-invariant and stand.

---

## Honest status

Page height 11,154 → **10,009 CSS px**, about **10%** — not the 25–30% the plan projected,
and that gap is entirely the 2× measurement error above. The three most template-coded blocks
are gone, which was the actual point.

**The unbranded middle is still ~70% of the page.** Roles + Work + Pillars are half the
page's height on their own, and that is Norrin's real substance — deleting it would trade a
design problem for a content problem. The remedy is making the device present and correct,
not cutting further.

Source is 3,618 → 3,796 lines. It went *up* while the rendered surface went down: the
deletions are outweighed by rationale comments, matching this codebase's existing style of
arguing each decision in place.

## Not yet done

All twelve packages are shipped. What is deliberately left:

- **The unbranded middle is still ~70% of the page.** Roles + Work + Pillars are half its
  height on their own, and that is Norrin's real substance. Cutting further would trade a
  design problem for a content problem.
- **`beliefs` remains in `norrin.ts` unrendered**, flagged as such. It is sourced research,
  not dead code, and deleting it would lose the provenance work.
- **One arbitrary type size survives** — the customer roster's own ramp, which is a genuinely
  distinct rung and not worth a role.

## Verification — all passing

```bash
npm run build          # green
npx oxlint src         # zero warnings
npx vite preview --port 4187
node tools/audit.mjs http://localhost:4187/
node tools/shot.mjs --sections && node tools/shot.mjs --all
```

axe: **zero violations** in light and dark, closed and drawer-open, at the top of the page
and over an inverse band. Heading order ok. All **24** Phase-1 navbar behaviour checks still
pass. Every one of the 11 anchor targets resolves. Bundle 77.02 → **74.63 kB** gzip.
