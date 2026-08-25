# Phase 3 — real content, the middle, and a second mascot

Three jobs: pull accurate content from the live norrin.com, fix the four things wrong with
the middle of the page, and give the site a mascot with some warmth in it.

---

## 1. Content, verified against the source

Fetched norrin.com, /about-us, /services and /technologies.

**Everything already in `norrin.ts` checked out** — 220 employees, 31 M€, 40% growth, 200
clients, founded 2012, the 2024 Cloud1/Devisioona/Smartbi merger, Norrin Advisory and the
Bizone acquisition in 2025, the 2027 listing goal, all ten customers, and the
fastest-growing-IT-consultancy recognition. No figure needed correcting.

**What was missing or wrong:**

- **`partnership`** — "As a recognition for our focused competence, we are a certified
  Microsoft partner in the areas of data, AI, digital innovation, infrastructure and
  analytics." A real, citable claim. Phase 2 deleted a fabricated "Named partner" badge; this
  is the one Norrin actually publishes, and it names competence areas rather than a tier.
- **`productionSince`** — "We've been running Logic Apps -based solutions in production since
  2015." The single most useful sentence on their site for a page arguing that AI is won in
  production: dated, checkable, and about *running* something rather than planning it.
- **`services`** — eight service lines with Norrin's own taglines: "All the data, all the
  time", "24/7 peace of mind", "Analytics and insight — for everyone", "Bespoke yet
  responsible user experiences". The pillars had been rendering bare category names, which is
  the least interesting form of the same information, and the company writes them better than
  a redesign should invent them.
- **Power Platform** was missing from `technologies` — /technologies calls it "our #1 toolkit
  for digitalising enterprise processes".
- **Belief 3 was truncated.** The source reads "…combining business insight with technical
  expertise **to find the best solutions**". Restored.

---

## 2. The middle

All four complaints were the same complaint from different angles: between the hero and the
closing CTA the page ran seven consecutive light sections, every one an eyebrow over a ruled
list, with no dark ground, no second colour and no mascot.

**A forest evidence band, mid-page.** The platform block at the foot of Pillars was a quiet
grey panel. It is now a full-bleed forest band carrying "Logic Apps in production since
**2015**" with the sourced claim beneath it and the Microsoft certification under that. One
move that answers all four: a tonal event in the dead centre, a composition unlike anything
around it, the page's own colour back, and it earns the space with the best evidence Norrin
publishes rather than with decoration. The forest bands now fall at roughly 15%, 48% and 88%
of the scroll — a three-beat rhythm instead of two bookends.

**Roles became four columns.** It was four full-width ruled rows, which is exactly what Work
is two sections later — the same construction twice made them read as one layout in different
hats, and that was the single most template-coded thing about the middle. Four short claims
also do not need four page-widths: as rows the block ran nearly a viewport to say sixteen
words. Columns also make the copy's own point, since these are four responsibilities held at
the same time rather than a sequence you work down. Section height 1285px → 817px.

**Pillars gained real density.** Each pillar now carries a small definition table of its
service lines against Norrin's taglines, instead of one mono line of category names.

The page now runs six distinct compositions where it ran five identical ruled lists: columns
(Roles), sticky-index long-form (Pillars), a forest band (Platforms), roster-plus-table
(Work), tiles (Thinking), and a timeline (Proof).

**Two defects the screenshots caught mid-round:**

- Roles' heading wrapped to four lines. The binding constraint was `max-w-[34ch]` on the
  *wrapper*, which resolves against the inherited 17px font (~320px) rather than against the
  72px heading inside it — the exact bug the audit flagged, which a Phase 2 polish item had
  made worse by tightening 46ch to 34ch. Measures now sit on the elements they measure.
- Nine platform names in two columns orphaned the ninth under a half-width rule. The odd last
  item now spans both columns.

---

## 3. Lunni

Fyr could not be made cute without breaking it. Its own docblock is explicit that the topmark
rides a thin mast well clear of the float *precisely* so the mark never reads as a head on
shoulders — "it must stay an instrument". So the warmth went into a second object.

**Lunni** (Finnish for puffin) is not charm bolted on. It carries the page's argument in the
one register a diagram cannot reach:

> A sea bird lands on a mark that is **on station**. It will not land on a pilot floating
> free — unlit, moored to nothing, marking nothing. There is nothing there to land on.

So Lunni appears at production and nowhere else: on the solid half of the production line,
right of the crossing, on both desktop and the mobile rail. The thesis told as a small act of
trust instead of as a claim.

**Drawn in profile, which is not a style choice.** Three iterations head-on confirmed that a
puffin's beak below two eyes reads as a mouth — the third was unmistakably a grin. Side-on the
beak projects as a wedge and the bird is a bird.

Palette, not plumage: forest back, paper face and belly, sun beak. The beak is mascot anatomy
so, like Fyr's lamp, it sits outside the three-solid sun budget. The face is a fixed `#eef0e6`
rather than `--ground` — keyed to the theme it turned black in dark mode, and a dark face with
white eyes reads haunted rather than friendly. Same 24-unit viewBox as Fyr so the two compose
on one grid, and a 5.6s settle deliberately off-period from Fyr's 7s roll so they never march
in step. Redrawn simplified below 56px. Reduced motion resolves to the resting frame, so
nobody gets a bird with its eyes shut.

---

## Verification

axe: **zero violations** in light and dark, closed and nav-drawer-open, at the top of the page
and over an inverse band. Heading order ok. All **24** navbar behaviour checks still pass.
Build green, oxlint zero warnings.
