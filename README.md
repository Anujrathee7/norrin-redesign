# Norrin — speculative redesign

An independent, unsolicited redesign of [norrin.com](https://norrin.com/), built from
publicly available information only. Not affiliated with or endorsed by Norrin.

**Live:** https://norrin-redesign.vercel.app

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
them and nothing else; editing a pose means editing the file. The nav and footer mark is
the same file with `crop="head"` re-declaring the viewBox, not a second asset.

The pilot → production diagram still uses the earlier spar-buoy drawing (`Fyr.tsx`,
`Lunni.tsx`) — a diagram rather than a character.

`src/components/mascot/nori/Nori.tsx` · `nori.css` · `public/nori-*.svg` — rationale in
[docs/design-notes.md](docs/design-notes.md).

## 3. Design system

Derived from **Norrin's own published theme tokens**, extracted from their HubSpot theme
CSS — not invented. Their palette is a named Nordic nature system (`moss`, `sun`, `forest`,
`lichen`, `sand`, `bark`, `sky`, `turquoise`), which their current site barely exploits.
Four of those eight survive as UI colours; seven nature colours is a mood board, not a system.

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

The forest bands carry the same ladder again — `--inverse-ink-2` / `-ink-3`,
`--inverse-hairline` / `-hairline-strong`, `--inverse-inactive`, `--inverse-tint` and
`--inverse-overlay` — replacing eight hand-picked alphas of `--inverse-ink` that had drifted
section by section. Their alphas are *solved* to reproduce the paper values' measured ratios
(1.29:1, 1.85:1, and lichen's 2.92:1) rather than picked by eye, so a rule reads as the same
weight of rule on either ground.

`node tools/palette.mjs` measures every pair the system actually renders — 61 of them, alpha
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
