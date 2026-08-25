# Norrin — speculative redesign

An independent, unsolicited redesign of [norrin.com](https://norrin.com/), built from
publicly available information only. Not affiliated with or endorsed by Norrin.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run lint     # oxlint — must be zero
node tools/palette.mjs # every rendered colour pair, measured (must be 61/61)
node tools/audit.mjs   # axe-core (light + dark) + structure audit
node tools/shot.mjs --vp=desktop --sections   # visual QA harness
```

The mascot sheet is at `/#mascots` — Nori's six poses against both grounds,
down to 24px, with motion on and off. The artwork lives in `public/nori-*.svg`;
the app places and sizes it and never recolours it.

---

## 1. The idea

Norrin's own thesis is the sharpest thing on their website, and it is buried below a
webinar promo:

> **"We believe enterprise AI is won in production."**

Everything here is built to make that argument *visible* rather than merely stated.

**The production line.** One rule runs the length of the site. Left of the crossing it is
**dashed and lichen-grey** — provisional, a pilot, not load-bearing. Right of it the rule
goes **solid** — committed, in production. It appears at five scales: the solid rule under
the word "production" in the headline, the hero horizon, the spine of the pilot→production
diagram, the company timeline (where it inverts cleanly for time — what has happened is
solid, what is still ahead is dashed), and the line that finally completes edge-to-edge
above the closing CTA. There is no other decorative device on the site. The argument *is*
the layout.

Note what the hero deliberately does **not** do: there is no marker-pen highlight behind
the money word. That gesture is on every launch page of the last three years. The emphasis
is the site's own device instead — moss ink, and the solid half of the production line
drawn beneath the word that earns it.

## 2. Nori — the mascot

**Nori** is Norrin's character: a small white robot with a lavender antenna, drawn in six
poses. The artwork is authored directly as finished SVGs in `public/nori-*.svg`.

| Pose | Where it is used |
|---|---|
| `wave` | hero mark, contact, the nav and footer head crop |
| `idea` | Thinking — "start anywhere you like" |
| `laptop` | build / work / careers |
| `data` | proof, platforms, numbers |
| `rocket` | the hero crossing point — a pilot becoming production |
| `sleep` | footer, 24/7, empty states |

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
ink `#2E2A40`) is not drawn from the Norrin token system below, which is moss / sun /
forest / lichen. The character is legible and holds its silhouette on both the paper ground
and the forest bands, so nothing is broken — but it is the one element on the site whose
colour is not derived from Norrin's own published theme.

`src/components/mascot/nori/Nori.tsx` · `nori.css` · `public/nori-*.svg`

The pilot → production diagram in `TheGap` still uses the earlier **spar-buoy** drawing
(`src/components/mascot/Fyr.tsx`, `Lunni.tsx`). That is a diagram rather than a mascot: its
four states borrow real IALA buoyage grammar and the section's copy names it directly
("unlit, unmoored, marking nothing"; "isolated danger"). Swapping it for Nori is a copy
rewrite, not an asset swap, and has deliberately been left as a separate decision.

## 3. Design system

Derived from **Norrin's own published theme tokens**, extracted from their HubSpot theme
CSS — not invented. Their palette is a named Nordic nature system (`moss`, `sun`, `forest`,
`lichen`, `sand`, `bark`, `sky`, `turquoise`), which is genuinely distinctive in a category
drowning in indigo gradients, and which their current site barely exploits.

Four of those eight survive as UI colours. Seven nature colours is a mood board, not a system.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--ground` | `#f8f7f3` | `#0e120f` | page (warm paper — `sand`'s only survival) |
| `--surface` | `#f1f0ea` | `#161b17` | alternating bands |
| `--overlay` | `#fdfcfa` | `#191f1b` | the plane a floating control opens onto |
| `--inverse` | `#123e28` *(forest)* | `#16452c` | the inverted sections — raised, not deepened, in dark |
| `--ink` / `--ink-2` / `--ink-3` | `#14170f` / `#4a4d42` / `#696d5f` | `#f2f2ec` / `#b4b8ac` / `#868a7c` | text levels |
| `--hairline` / `--hairline-strong` | `#dddcd2` / `#b9b9ac` | `#252b26` / `#3a423b` | **all** separation |
| `--accent` | `#504e18` *(moss)* | `#9fb87e` | the only accent touching type or stroke |
| `--accent-hover` / `--accent-press` | `#6f6c2a` / `#3c3a10` | `#b3c795` / `#8aa36a` | filled-control states |
| `--signal` | `#f6f279` *(sun)* | same | fill only |
| `--signal-hover` / `--signal-press` | `#ebe565` / `#ddd74d` | same | as above, on the bands |
| `--inactive` | `#88967e` *(lichen)* | `#5d6a55` | the "not yet in production" state — **strokes only** |
| `--tint` | moss @ 6% | accent @ 8% | the wash that fills a rounded control on hover |

The forest bands carry the **same ladder again**, because they used to carry eight
hand-picked alphas of `--inverse-ink` — `/15 /20 /25` for rules and `/60 /65 /70 /75 /80 /85`
for type — chosen file by file for the same three jobs, so "muted text on forest" was a
different colour in four sections. `--inverse-ink-2` / `-ink-3`, `--inverse-hairline` /
`-hairline-strong`, `--inverse-inactive`, `--inverse-tint` and `--inverse-overlay` replace
all of them. The two hairline alphas are **solved** to reproduce the paper hairlines'
measured ratios (1.29:1 and 1.85:1) rather than picked by eye, and `--inverse-inactive`
likewise reproduces lichen's 2.92:1 — so a rule reads as the same weight of rule on either
ground, and the page's one device does not change strength when it crosses into a band.

`node tools/palette.mjs` measures every pair the system actually renders — 61 of them,
alpha composited onto its real background first — and exits non-zero on a miss. It is a
verification gate alongside the build, the lint and the axe run.

Two structural rules hold it together:

1. **Separation is carried by 1px hairlines. There are zero box-shadows on the site.**
2. **Sun is a signal, never a surface** — budget of three solid uses per page (the
   recognition marker in the proof bar, the crossing marker in the gap diagram, and the
   terminal square where the closing line completes). Anything sitting on
   sun uses fixed dark ink in *both* themes.

Lichen is a stroke colour, not a text colour: at 11px it clears neither theme's AA
threshold, so "ahead" labels use the ink ramp while the dashed rule keeps the lichen.

### Radius

The scale was `0 / 2px`, on the argument that Norrin's own `2em` pill form fields read soft
and consumer while this is enterprise infrastructure. That argument was right about the
disease and wrong about the cure: what makes a page read consumer is rounding *everything*
indiscriminately, so that curvature says nothing. And `2px` on a 50px button is not a
restrained radius, it is a rasterising artefact — the system was effectively at zero.

The scale is now three values, and it carries a meaning:

> **Radius means you can touch it.**

Structure stays square. Hairlines separate rather than contain, and a rule has no corners —
the production line, the eyebrow rules, the ruled tables, the section bands, the timeline
nodes and the sun terminus are all unchanged. So the only rounded shapes on the page are the
ones that respond, and the eye finds every action without anything having to be coloured
louder. That makes the change subtractive rather than decorative.

The geometry is **the mark's own**. Fyr's float is `rect w=3.6 rx=1.8` — a capsule, fully
rounded — and its mast cap is a softly rounded stroke, so the page borrows the buoy's two
radii instead of inventing a house rounding:

| Token | Value | Used by |
|---|---|---|
| `--radius-action` | `999px` | the solid call to action and the ghost that pairs with it — the float's silhouette |
| `--radius-control` | `8px` | pressable but not the action: nav items, locale trigger, menu options, hamburger, skip link |
| `--radius-panel` | `14px` | things that open or frame: the locale list, the Thinking rungs |

Not rounded, deliberately: **the nav drawer**. It is the header temporarily getting taller —
it shares the bar's ground and takes the bar's own border as its top edge — and a radius
would turn it into a floating card, which is the one thing its construction exists to avoid.

### Controls

There was no button in this system. There were four hand-assembled ones — hero, nav, closing
CTA, mobile sheet — already drifted to three paddings, two transition durations, and two
different ways of writing the same sun hover, one of them a raw hex in a file that could not
see the other raw hex. `.ui` had been extracted for exactly this reason and stopped one rung
short of the thing using it.

`.btn` is geometry and behaviour; `.btn-solid` / `.btn-signal` / `.btn-ghost` are colour
only. `.control` is the smaller pressable role, `.panel` is the opening one. Both invert
under `[data-tone='inverse']`, which the header now declares — without that attribute
`[data-tone='inverse'] :focus-visible` never matched inside the bar, so tabbing the nav while
it sat over a forest band drew a **moss** ring at 1.40:1, which is to say no ring at all. axe
does not automate focus-indicator contrast, so every clean audit run to date was silent
about it.

### Typography

Three families, all open-source and self-hosted. Norrin's real faces (ABC Camera Plain,
LFS Adelia) are commercially licensed and could not be used — but their heading face is a
**script**, which in an enterprise-AI context reads decorative and costs them authority.
Replacing it was a deliberate correction, not a workaround.

- **Schibsted Grotesk** — display and UI. Commissioned by the Norwegian-Swedish press group;
  genuinely Nordic provenance rather than cosplay, and it holds up at both 7.5rem and 0.875rem.
- **Newsreader** — the thesis, leads, case bodies. Carries the human register Norrin's values
  copy actually has.
- **IBM Plex Mono** — indices, unit labels, addresses, telemetry. The "production" voice.

Fluid scale via `clamp()` in `src/index.css` (`.display-1` … `.label`), clamped against a
360 → 1512px range.

## 4. Architecture

```
src/
  data/norrin.ts              verified public content, provenance-commented
  lib/cx.ts                   class joiner (own module, so Fast Refresh survives)
  hooks/
    useReducedMotion.ts       useSyncExternalStore — cannot tear under concurrent render
    useDrawLine.ts            measures once, then hands off to a CSS transition
  components/
    primitives/               Container, SectionHeader, Eyebrow, Reveal
    mascot/Fyr.tsx            the sea mark — a diagram, never a character
    mascot/Lunni.tsx          the puffin; lands only on a mark that is on station
    nav/                      one bar (three competing variants were cut in Phase 2)
    sections/                 one file per homepage section
tools/
  shot.mjs                    screenshot harness (viewports, themes, clips, --nav states)
  audit.mjs                   axe-core (incl. open nav drawer) + heading order + landmarks
  contrast.mjs                WCAG ratio, with alpha composited onto its real background
  palette.mjs                 every pair the system renders, declared and measured
```

`src/data/norrin.ts` is the single source of content. Every string carries a provenance
comment naming the public page it came from.

## 5. Motion

Three easings, on purpose. `--ease-entrance` (0.33, 1, 0.68, 1) for arrivals, `--ease-ui`
for state, `--ease-exit` for dismissals.

**Reveals are CSS, not a library.** An earlier version used GSAP + ScrollTrigger; it set
`autoAlpha: 0` inline and depended on a trigger firing to undo it, which means any misfire
leaves copy permanently invisible. That is a bad trade for an 18px slide. Now the hidden
state is scoped to `html.js` and an IntersectionObserver flips one attribute — so *no JS*,
*no IntersectionObserver*, or *reduced motion* all degrade to fully visible content.

Removing GSAP entirely — it was down to animating one line — cut **46 kB gzip**.

Fyr's idle motion is pure CSS on nested groups (`heave` and `roll` are separate axes with a
non-harmonic 7 : 4.5 period ratio, so the loop never visibly repeats). The lamp uses a real
IALA rhythm, `Fl(2) 6s`. JS writes exactly two custom properties.

`prefers-reduced-motion` stops all of it, holds the lamp **lit** rather than dark, and
changes nothing about what the page communicates.

## 6. Responsive

Verified at 320 / 390 / 834 / 1280 / 1512. No horizontal overflow at 320px.

The gap diagram is the one section that genuinely re-lays-out rather than reflowing: three
marks side by side at phone width would be three unreadable smudges, so the rule turns
vertical and the marks become a rail. Fyr itself is **redrawn, not scaled**, below ~44px —
sea, mooring and glow are dropped and everything that survives is thickened, because a
faithful miniature turns to mush at favicon size.

## 7. Accessibility

- **axe-core: zero violations**, light and dark, across `wcag2a/2aa/21a/21aa` + best-practice.
- The fixed header inverts its palette while an inverted section is beneath it, so it never
  slices a heading with a cream band on forest green.
- Contrast was a real finding, not a formality: `--ink-3` measured **3.67:1** on ground and
  drove ~52 nodes of failure at 11px. Recomputed to `#696d5f` (4.96:1 / 4.65:1). Alpha ink
  on the forest band went from `/45` (3.40:1) to `/60` (4.83:1).
- Single `h1`, no heading-level skips, `header`/`main`/`footer`/`nav` landmarks, skip link.
- Escape and outside-click close the nav panel; the mobile sheet locks scroll and releases it.
- `:focus-visible` only — a 2px moss outline, never suppressed.
- Fyr is `role="img"` with a label where it carries meaning, `aria-hidden` where decorative.

## 8. Performance

| | |
|---|---|
| JS | **236 kB / 72 kB gzip** (React 19 + ReactDOM is essentially all of it) |
| CSS | 36 kB / **8 kB gzip** |
| Fonts | **3 files, ~120 kB**, latin-subset woff2 only |

Font work: dropped Cyrillic/Greek/Vietnamese subsets and legacy `.woff` fallbacks that were
being shipped for a page that renders none of them; dropped Newsreader italic (a second
~55 kB face serving four headings); the mono is used at a single weight, so only 500 ships.
The headline face is preloaded.

Fyr animates `transform` and `opacity` only. Its glow is a radial-gradient circle, never a
blur filter — filter repaints are the one real trap in an SVG this size.

## 9. What was observed, and what changed

**Observed on norrin.com** (evidence in `docs/research-brief.md`): ~25 primary nav
destinations; the value proposition sitting *below* a "Highlights and News" webinar promo;
ten recognisable Nordic enterprises rendered as plain text links; the 220 / €31M / 40% / 200
proof numbers reachable only via `/about-us`; service copy that is genuinely good and two
clicks deep; a script typeface for headings; and no visualisation anywhere of the
pilot→production gap the company's entire thesis rests on.

**Changed deliberately**

1. **Lead with the thesis, not the newsroom.**
2. **Promoted the proof.** The four figures now appear twice — a quiet station log in the
   hero (answering "are you durable?" in the first five seconds) and a full proof bar.
3. **Collapsed the IA** from ~25 destinations to five, on Norrin's own three-pillar taxonomy,
   which absorbs all eleven service links without loss. Technologies demoted from seven nav
   items to one evidence block. Locale moved to a utility switcher.
4. **Surfaced the four roles** — integrator / deployer / infrastructure partner /
   transformation lead — from a dense paragraph into the page's spine.
5. **Designed the roster** as type instead of a link list.
6. **Built a commitment ladder.** Their homepage offers exactly one action ("Contact us"),
   which discards every visitor who is researching rather than buying.
7. **Replaced the script display face.**
8. **Visualised the gap.**
9. **Told the company's story.** The 2012 → 2024 merger (Cloud1, Devisioona, Smartbi) →
   2025 Bizone acquisition → 2027 listing ambition is a genuinely differentiating arc that
   currently sits in one paragraph of prose on `/about-us`. It is now a timeline drawn on
   the production line.

## 10. Assumptions

Made because no internal information was available: that the primary visitor is an enterprise
buyer (CIO/CDO/Head of Data or AI) at a large Nordic enterprise, with candidates secondary;
that the primary conversion is a qualified conversation, with the gated Vision Paper and
newsletter as lower rungs; that the Anthropic + Microsoft alignment is deliberate positioning.
No analytics, funnel data, brand guidelines or CMS constraints were available.

## 11. Placeholders and what a real build would need

Nothing on this site invents a statistic, client, testimonial, award or capability. Where
content does not exist publicly, it is **absent rather than fabricated**. A production build
would still need:

- **Testimonial quotes with attribution** — none are published; none were invented.
- **Photography and headshots** — none used. People appear as names and titles only.
- **Customer logo files** — deliberately not reproduced; we hold no licence to those marks,
  so the roster is set as type. This is the honest option and the better-looking one.
- **Real destinations** — this is a single landing page; nav and case links resolve to
  on-page anchors.
- **Case metrics beyond the four Norrin publishes**, and the Vision Paper form/CRM wiring.
- Licences for Norrin's actual typefaces, if the real brand faces were to be used.

## 12. What the review changed

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
