# Norrin — speculative redesign

An independent, unsolicited redesign of [norrin.com](https://norrin.com/), built from
publicly available information only. Not affiliated with or endorsed by Norrin.

**Live:** https://norrin-redesign.vercel.app

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run lint     # oxlint — must be zero
node tools/palette.mjs # every rendered colour pair, measured (must be 65/65)
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
them and nothing else; editing a pose means editing the file. The nav and footer mark is
the same file with `crop="head"` re-declaring the viewBox, not a second asset.

Poses are **generated**, not hand-drawn files: `tools/nori.mjs` draws the character once
and emits every `public/nori-*.svg`. Editing a pose means editing that script and re-running
it. Each pose is drawn to meet **one kind of edge** — `lean` a vertical one, `sit` a rule,
`peek` a long ledge — and they are not interchangeable. The rule learned the expensive way:
**Nori may touch a rule, never type.** A white character with a thin contour resting a hand
on white ink has no visible contact point; every join that works on this site is the mascot
meeting a hairline, the production line or a card border.

The earlier spar-buoy drawings (`Fyr.tsx`, `Lunni.tsx`) are **deleted**.

`src/components/mascot/nori/Nori.tsx` · `nori.css` · `public/nori-*.svg` — rationale in
[docs/design-notes.md](docs/design-notes.md).

## 3. Design system

Derived from **Norrin's own published theme tokens**, extracted from their HubSpot theme
CSS — not invented. Their palette is a named Nordic nature system (`moss`, `sun`, `forest`,
`lichen`, `sand`, `bark`, `sky`, `turquoise`), which their current site barely exploits.
Four of those eight survive as UI colours; seven nature colours is a mood board, not a system.

One departure from that source, and it is deliberate. The accent used to be `moss` — hue
58, an olive that reads khaki on paper — while the dark theme's accent was already a green.
That was a difference nobody could see two devices apart, until a theme toggle went in the
bar and made it a thing you can watch happen in one click. **The accent is green on both
grounds now:** light is the forest band's own `#123e28` lifted one step to `#1a5335`, which
clears 8.40:1 on paper. Dark stays the sage `#9fb87e`. Both now separate from `sun` by hue
as well as by luminance, which moss never did.

**Two larger palette changes were built, measured, and rejected on sight** — worth recording
because both were *better by the numbers* and still wrong:

- **A charcoal dark ground** (`#0e120f` → `#171a18`). It buys the hairlines real room —
  1.29 → 1.35:1 and 1.82 → 1.94:1 — but it takes that room from the forest band, whose lift
  off the page falls to 1.65:1, and a page of large display type on near-black is the effect
  this build is after.
- **A desaturated forest band** (71%/68% chroma → ~34%). It separated *further* from both
  grounds and every rung of the inverse ink ramp gained on it. But at low chroma this hue
  goes teal, and a grey-green plane beside warm paper reads like a colour that drained
  rather than one that was chosen.

Both are recorded rather than quietly dropped, because the lesson is the useful part: the
band is the one surface in this system carrying real colour — everything else sits between
2% and 12% chroma — and that is a decision, not an oversight. Measurements can say a plane
is better separated. They cannot say it is the right plane.

**The forest plane is used twice, not three times.** It was three: the argument (`TheGap`),
a vendor list (the platform stripe), and the ask (`Contact`). The stripe was the only one
that was a band *inside* a section rather than a section — both of its edges sat in one
viewport, so you looked at it instead of travelling through it, and it read as a slab however
it was painted. It was painted three ways before that became clear. It also over-claimed:
nine product names are evidence for a claim made 200px earlier, and they change no rules, so
they should not change the plane. That block is now the closing movement of `Pillars`, on the
section's own surface, separated by a hairline. The two planes that survive both mark a real
change of argument, and each announces its crossing with the page's own device — a sun
leading-edge rule, and the completing production line.

Retiring it surfaced a hole in the gate. Both hairlines were measured against `--ground`
only, but `Pillars` and `Thinking` are `bg-surface` and rule their rows there, so two whole
sections rendered a pair nobody had measured — and it missed, at 1.74:1 / 1.68:1 for the
strong rule and 1.21:1 for the plain one, all under their own parity bar. Both tokens are now
solved for the tighter of the two grounds and clear on both, so a rule reads as the same
weight of rule wherever it is drawn.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--ground` | `#f8f7f3` | `#0e120f` | page (warm paper — `sand`'s only survival) |
| `--surface` | `#f1f0ea` | `#161b17` | alternating bands |
| `--overlay` | `#fdfcfa` | `#191f1b` | the plane a floating control opens onto |
| `--inverse` | `#123e28` *(forest)* | `#16452c` | the two inverted sections — raised, not deepened, in dark |
| `--ink` / `--ink-2` / `--ink-3` | `#14170f` / `#4a4d42` / `#696d5f` | `#f2f2ec` / `#b4b8ac` / `#868a7c` | text levels |
| `--hairline` / `--hairline-strong` | `#d8d7cc` / `#b3b3a5` | `#292f2a` / `#404841` | **all** separation (solved on `--ground` *and* `--surface`) |
| `--accent` | `#1a5335` *(forest, lifted)* | `#9fb87e` *(sage)* | the only accent touching type or stroke |
| `--accent-hover` / `--accent-press` | `#2a6b47` / `#123e28` | `#b3c795` / `#8aa36a` | filled-control states |
| `--signal` | `#f6f279` *(sun)* | same | fill only |
| `--signal-hover` / `--signal-press` | `#ebe565` / `#ddd74d` | same | as above, on the bands |
| `--inactive` | `#88967e` *(lichen)* | `#5d6a55` | the "not yet in production" state — **strokes only** |
| `--tint` | accent @ 6% | accent @ 8% | the wash that fills a rounded control on hover |

The forest bands carry the same ladder again — `--inverse-ink-2` / `-ink-3`,
`--inverse-hairline` / `-hairline-strong`, `--inverse-inactive`, `--inverse-tint` and
`--inverse-overlay` — replacing eight hand-picked alphas of `--inverse-ink` that had drifted
section by section. Their alphas are *solved* to reproduce the paper values' measured ratios
(1.29:1, 1.85:1, and lichen's 2.92:1) rather than picked by eye, so a rule reads as the same
weight of rule on either ground.

`node tools/palette.mjs` measures every pair the system actually renders — 65 of them, alpha
composited onto its real background first — and exits non-zero on a miss. It is a
verification gate alongside the build, the lint and the axe run.

Three rules hold it together:

1. **Separation is carried by 1px hairlines. There are zero box-shadows on the site.**
2. **Sun is a signal, never a surface** — a budget of three solid uses per page (the
   recognition marker in the proof bar, the crossing marker in the gap diagram, and the
   terminal square where the closing line completes). Anything sitting on sun uses fixed
   dark ink in *both* themes.
3. **Radius means you can touch it.** Structure stays square — rules, bands, ruled tables,
   timeline nodes. Only what responds is rounded.

| Token | Value | Used by |
|---|---|---|
| `--radius-action` | `999px` | the solid call to action and the ghost that pairs with it |
| `--radius-control` | `8px` | nav items, locale trigger, menu options, hamburger, skip link |
| `--radius-panel` | `14px` | things that open or frame: the locale list, the Thinking rungs |

Lichen is a stroke colour, not a text colour: at 11px it clears neither theme's AA
threshold, so "ahead" labels use the ink ramp while the dashed rule keeps the lichen.

`.btn` is geometry and behaviour; `.btn-solid` / `.btn-signal` / `.btn-ghost` are colour
only. `.control` is the smaller pressable role, `.panel` the opening one. Both invert under
`[data-tone='inverse']`, which the header declares.

### Light and dark

**Dark is the default, and it is in the markup** — `<html data-theme="dark">` — not applied
by script. A blocking inline script in the head upgrades that to `light` if the reader has
chosen it before, so the flash every dark-first site is known for cannot happen, and a
visitor with JS off still gets the theme the page was designed on rather than whatever their
OS happened to prefer.

The toggle is a single icon button in the bar's utilities, repeated in the mobile sheet
because the utilities row is `hidden` below `lg` and the phone audience would otherwise have
no way out of the default. It is not a track-and-thumb switch: a sliding knob is a second
small moving object in the chrome, two hundred pixels above the production line, which is
the argument that killed the runner-up navbar. The glyph shows where you are *going* — a
sun in dark — and the accessible name says the same thing in words.

Every token is declared once via `light-dark()`, so `[data-theme]` is the only switch:
`useTheme` writes it, and `tools/audit.mjs` / `tools/shot.mjs` write the same attribute to
force a theme. The hook watches it with a `MutationObserver` rather than only reading it at
mount, which is what keeps the harness honest — without that, a forced-light screenshot
rendered a sun where the product shows a moon. Transitions are suppressed for one frame
around the write (`.theme-switching`), or the header's 500ms colour cross-fade arrives half
a second after the page underneath it.

### Typography

Three families, all open-source and self-hosted. Norrin's real faces (ABC Camera Plain,
LFS Adelia) are commercially licensed and could not be used; their heading face is a script,
which in an enterprise-AI context costs them authority.

- **Schibsted Grotesk** — display and UI, at both 7.5rem and 0.875rem.
- **Newsreader** — the thesis, leads, case bodies.
- **IBM Plex Mono** — indices, unit labels, addresses, telemetry.

Fluid scale via `clamp()` in `src/index.css` (`.display-1` … `.label`), clamped against a
360 → 1512px range. The reasoning behind the radius scale, the control classes and the face
swap is in [docs/design-notes.md](docs/design-notes.md).

## 4. Architecture

```
src/
  data/norrin.ts              verified public content, provenance-commented
  lib/cx.ts                   class joiner (own module, so Fast Refresh survives)
  hooks/
    useReducedMotion.ts       useSyncExternalStore — cannot tear under concurrent render
    useTheme.ts               the DOM is the source of truth; MutationObserver on data-theme
  components/
    primitives/               Container, SectionHeader, Eyebrow, Reveal, Photo
    mascot/nori/              Nori — placement and sizing only, never repainting
    nav/                      one bar
    sections/                 one file per homepage section, plus Compare and MascotLab
tools/
  nori.mjs                    draws the character once, emits all 13 poses + the mark
  photos.mjs                  fetches Norrin's photography, encodes AVIF/WebP/JPEG at 3 widths
  compare.mjs                 captures both sides of #compare in one pass
  shot.mjs                    screenshot harness (viewports, themes, clips, --nav states)
  audit.mjs                   axe-core (incl. open nav drawer) + heading order + landmarks
  contrast.mjs                WCAG ratio, with alpha composited onto its real background
  palette.mjs                 every pair the system renders, declared and measured
```

Two surfaces hang off the hash rather than the page: **`#compare`** puts each section of
norrin.com beside the same section rebuilt, and **`#mascots`** is the pose workbench.
Neither is in the nav; the homepage should make the argument rather than talk about it.

**Photography.** The site shipped zero raster images for most of its life, deliberately —
we hold no licence to customer logos or to anyone's headshots. Norrin's own homepage
photographs are the one category without that problem, and they are used here: self-hosted
under `public/photos/`, never hotlinked, re-encoded by `tools/photos.mjs`. They are Norrin's
pictures, shown back to Norrin, in a redesign of Norrin's page. The alt text is **ours** —
five of their six ship with none at all — and `src/data/norrin.ts` marks every one as
authored rather than transcribed.

`src/data/norrin.ts` is the single source of content. Every string carries a provenance
comment naming the public page it came from.

## 5. Motion

Three easings: `--ease-entrance` (0.33, 1, 0.68, 1) for arrivals, `--ease-ui` for state,
`--ease-exit` for dismissals.

**Reveals are CSS, not a library.** The hidden state is scoped to `html.js` and an
IntersectionObserver flips one attribute, so *no JS*, *no IntersectionObserver* or *reduced
motion* all degrade to fully visible content — where the earlier GSAP + ScrollTrigger version
set `autoAlpha: 0` inline and left copy permanently invisible if a trigger misfired. Dropping
GSAP cut **46 kB gzip**.

Nori's idle is pure CSS. Each anchored pose breathes or sways about its own **measured
contact point** (`anchors.ts`) rather than about its box centre, so a figure resting on a
rule never lifts off the thing it is resting on. JS writes exactly two custom properties.

`prefers-reduced-motion` stops all of it, holds the lamp **lit** rather than dark, and
changes nothing about what the page communicates.

## 6. Responsive and accessible

Verified at 320 / 390 / 834 / 1280 / 1512. No horizontal overflow at 320px. The gap diagram
is the one section that re-lays-out rather than reflowing: the rule turns vertical and the
three marks become a rail. Nori is **re-cropped, not scaled**, below ~40px: the same file
with its viewBox re-declared to the head, because at that size a full figure collapses into
a grey pill and only the ears and eyes survive.

- **axe-core: zero violations**, light and dark, across `wcag2a/2aa/21a/21aa` + best-practice.
- The fixed header inverts its palette while an inverted section is beneath it, so it never
  slices a heading with a cream band on forest green.
- Contrast was a real finding: `--ink-3` measured **3.67:1** on ground and drove ~52 nodes of
  failure at 11px, recomputed to `#696d5f` (4.96:1 / 4.65:1). Alpha ink on the forest band
  went from `/45` (3.40:1) to `/60` (4.83:1).
- Single `h1`, no heading-level skips, `header`/`main`/`footer`/`nav` landmarks, skip link.
- Escape and outside-click close the nav panel; the mobile sheet locks scroll and releases it.
- `:focus-visible` only — a 2px accent outline, sun on the forest bands, never suppressed.
- Nori is `aria-hidden` wherever it is decorative, which is everywhere it appears: each
  pose sits beside text that already says the thing, so a label would only repeat it.
- Photography carries real alt text, authored by us and marked as ours in the data file —
  five of Norrin's six homepage images ship with no alt attribute at all.

## 7. Performance

| | |
|---|---|
| JS | **236 kB / 72 kB gzip** (React 19 + ReactDOM is essentially all of it) |
| CSS | 36 kB / **8 kB gzip** |
| Fonts | **3 files, ~120 kB**, latin-subset woff2 only |

Fonts ship latin subsets only, no legacy `.woff` fallbacks, no Newsreader italic, and one
mono weight; the headline face is preloaded. Nori animates `transform` only, and every pose
is a static SVG the browser can cache rather than a runtime drawing.

Photography is AVIF with WebP and JPEG fallbacks at three widths, intrinsic dimensions on
every `<img>` so nothing reflows, and lazy below the fold. Measured against their live page:
norrin.com transfers ~915 kB of images, this rebuild ~525 kB — about 1.7x lighter. Their
delivery is genuinely competent, and the flattering comparison against their 47 MB of source
files would have been wrong, because their CDN resizes and serves WebP.

## 8. What changed, and why

**Observed on norrin.com** (evidence in `docs/research-brief.md`): ~25 primary nav
destinations; the value proposition sitting *below* a "Highlights and News" webinar promo;
ten recognisable Nordic enterprises rendered as plain text links; the 220 / €31M / 40% / 200
proof numbers reachable only via `/about-us`; service copy that is genuinely good and two
clicks deep; a script typeface for headings; and no visualisation anywhere of the
pilot→production gap the company's entire thesis rests on.

1. **Lead with the thesis, not the newsroom.**
2. **Promoted the proof** — the four figures appear twice, as a station log in the hero and
   as a full proof bar.
3. **Collapsed the IA** from ~25 destinations to five, on Norrin's own three-pillar taxonomy,
   which absorbs all eleven service links without loss. Locale moved to a utility switcher.
4. **Surfaced the four roles** — integrator / deployer / infrastructure partner /
   transformation lead — from a dense paragraph into the page's spine.
5. **Designed the roster** as type instead of a link list.
6. **Built a commitment ladder.** Their homepage offers exactly one action ("Contact us"),
   which discards every visitor who is researching rather than buying.
7. **Replaced the script display face.**
8. **Visualised the gap.**
9. **Told the company's story** — the 2012 → 2024 merger (Cloud1, Devisioona, Smartbi) →
   2025 Bizone acquisition → 2027 listing ambition, drawn as a timeline on the production
   line rather than left as one paragraph of prose on `/about-us`.

## 9. Assumptions, and what a real build would need

Assumed, because no internal information was available: that the primary visitor is an
enterprise buyer (CIO/CDO/Head of Data or AI) at a large Nordic enterprise, with candidates
secondary; that the primary conversion is a qualified conversation, with the gated Vision
Paper and newsletter as lower rungs; that the Anthropic + Microsoft alignment is deliberate
positioning. No analytics, funnel data, brand guidelines or CMS constraints were available.

Nothing here invents a statistic, client, testimonial, award or capability — where content
does not exist publicly it is **absent rather than fabricated**. A production build would
still need testimonial quotes with attribution, photography and headshots, licensed customer
logo files (the roster is set as type because we hold no licence to those marks), real
destinations behind the nav and case links, case metrics beyond the four Norrin publishes,
the Vision Paper form and CRM wiring, and licences for Norrin's actual typefaces.
