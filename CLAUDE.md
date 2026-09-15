# CLAUDE.md — the design standard

Strict rules for this repo. Every rule has a **reason** and a **check**. A change that
fails a check does not ship. Where a rule was learned from a real defect in this
codebase, the defect is named — those are the rules least worth arguing with.

---

## Why this file exists

A senior person at Norrin reviewed this redesign and said it **"looks very closely to
purely AI generated web site."**

The first instinct was to defend the CSS, and an audit did find none of the usual
tells: no Inter, no gradients, no shadows, no `rounded-2xl` card grid, no icon
library, no framer-motion. **That audit asked the wrong question.** AI design
currently clusters around three looks, and the third is *a broadsheet layout with
hairline rules, zero border-radius, and dense newspaper-like columns.* This build was
a textbook instance of it.

Craft is not a point of view. The absence of bad defaults is not the presence of a
design. This file is the standard that was missing, which is why decisions were being
made ad hoc and without review.

---

## 1. The visual standard

### 1.1 Ground — commit, or get out of the way

Either flood a surface with real colour, or keep it white and let imagery carry every
hue. **Off-white with a tasteful hint of warmth is the slop default and is banned.**

*Reason:* both reference sites that read as distinctive do one or the other. Aardvark
floods an entire viewport with saturated yellow. AiiD keeps a pure white page and puts
every hue into a posterised image band. Our old ground — `#f8f7f3`, a warm paper at
0.005 chroma, with one saturated band used twice — is the timid middle, and the timid
middle is what reads as generated.

*Check:* name the ground's role out loud. If the answer is "neutral but a bit warm",
it fails.

### 1.2 Type — one face with personality, one that shuts up

One display face with genuine character. One quiet face for all real reading. Mono for
metadata only. **Never one neutral grotesk doing two jobs.**

*Reason:* three of the four Finnish consultancies studied in `docs/style-research.md`
run a deliberate display/body pairing — Reaktor sets a decorative serif (Larken Thin)
against a grotesk; Solita pairs Sharp Sans Display against Sharp Sans. Both reference
sites do it too: Aardvark is Champ over Degular, AiiD is a heavy display over a neutral
text face. A single neutral family doing everything is the most reliable way to look
like a template.

*Check:* remove the display face. If the page still looks basically the same, the
display face was not doing its job.

### 1.3 Scale — set the h1 like you mean it

*Reason:* Aardvark's h1 computes to 120px. AiiD's is larger. Reaktor's runs to 94px on
a black field with nothing else above the fold. Half-measures read as a CMS.

*Check:* measure the rendered h1. If it is not unmistakably the largest thing on the
screen by a wide margin, it is too small.

### 1.4 Composition — use all four corners

Slop centres everything, or runs one left-hand column and stops.

*Reason:* AiiD's hero puts the descriptor top-left, the title right, the credit
bottom-left in mono, and the scroll cue bottom-right. Four corners, four different
kinds of information, no symmetry.

*Check:* screenshot the viewport and mark where information sits. One column or a
centred stack fails.

### 1.5 Section silhouette — the anti-band rule

**No section may share its silhouette with the section above it.**

This is the most important line in this file. The defect being fixed is nine
repetitions of `full-bleed band → 1512px container → eyebrow → h2 → content grid →
hairline`. Recolouring that does not fix it.

*Reason:* it is precisely what the reviewer saw. Aardvark never repeats a container —
it alternates full-bleed rows, inset rounded colour panels, and rows that run off the
edge of the screen.

*Check:* screenshot the whole page at 25% zoom and look only at the outlines. If
consecutive sections trace the same rectangle, it fails.

### 1.6 Break the frame — at least twice per page

Something leaves the container: an image bleeds off-canvas, a card crosses a panel
edge, a heading crosses a rule.

*Reason:* Aardvark's book row runs off the right edge; its step cards overlap each
other and the panel they sit in. Everything living inside one 1512px box is what makes
a page feel poured into a template.

*Check:* count the elements whose box crosses the container edge. Fewer than two
fails.

### 1.7 Imagery is a composition, not a slot

Collage, bleed, deliberate mismatch of crops. Not one tidy 16:9 per card.

*Reason:* AiiD's hero is a strip of mismatched tiles at different widths and
treatments, butted together, with a small labelled inset. It reads as authored. A
uniform grid of equal thumbnails reads as a CMS loop.

### 1.8 Photography honesty — the one rule imagery does not get to break

**Norrin's own photographs are never filtered, tinted, duotoned or washed.** Our own
graphic layers may be treated freely.

*Reason:* posterising imagery into two brand hues is a strong device and AiiD uses it
well — but tinting a *client's* photographs quietly makes them ours. That is the same
class of move as repainting someone's logo. The line is ownership, not taste.

**One exception, granted by the repo owner and not a precedent.** The causeway aerial
(`photos.vision`) sits under the Contact band beneath a flat `--scrim`. It was picked
from four rendered options — a blurred Gap backdrop, a reveal at the end of the Gap,
this, and a frame opening in place. The scrim is 76% because inverse type has to pass
against the lightest pixel it can land on (WCAG F83), and those pairs are gated in
`tools/palette.mjs`. Every further treated photograph needs the same conversation again.

**A second exception, granted the same way.** The careers photograph (`photos.careers`)
sits under the Careers band on `/company` beneath `--scrim-deep`, chosen with the repo
owner from four rendered layouts when Values was merged into that band. 88% rather than
76%, because a close-range photograph of faces competed with the copy where an aerial
landscape does not; the pairs are gated the same way, and it no longer animates — a moving picture under running text is a
reading problem. Two is still not a precedent: a third needs the conversation too.

### 1.9 Alt text is written from the picture

Never from a filename, a URL, or a section heading. **Open the file and look at it.**

*Reason, and this one is not hypothetical:* three of six alt texts in this repo
described meeting rooms and working sessions. The images are aerial landscapes — a
river through fields, a switchback road, a causeway over a lake. They had been written
from source filenames like `Change management or AI etc.jpg`. Alt text is what a
screen-reader user is *told is on the page*, so this was not a cosmetic slip.

---

## 2. Strict component rules — library first, theme on top

Hard constraints. Each is checkable. A change that breaks one does not ship.

**State of play, stated honestly: this section has been unenforceable, because the
library was never installed.** `package.json` carries react, react-dom, tailwindcss and
`@tailwindcss/vite` — no shadcn, no Radix, nothing to reach for. So §2.1 has been a rule
against a library that was not there, and `LocaleMenu.tsx` and `ThemeToggle.tsx` are
hand-rolled in violation of it. Adoption is now in progress. §2.1 becomes enforceable the
moment Radix is installed, and those two controls are the backlog it creates — they get
replaced, one at a time, each through §2.5's full gate. Nothing below is softened by
this; the rules stand as written and the code is what has to move.

**2.1 Never hand-roll an interactive primitive.** If shadcn/Radix ships it — menu,
dialog, sheet, select, popover, tooltip, tabs, accordion, toggle — it gets used.
Hand-written ARIA is banned.
*Reason:* this repo has already produced two real focus-ring contrast bugs and an
`inert` bug that stripped the document's only `h1` from the accessibility tree, all in
hand-rolled controls.
*Check:* no `role="listbox"`, `role="menu"`, `role="dialog"` or manual focus-trap code
in `src/`.

**2.2 Never ship a library's default theme.** Every shadcn variable — `--background`,
`--foreground`, `--primary`, `--muted`, `--border`, `--ring`, `--radius` — is driven
from our tokens.
*Reason:* shadcn's stock neutral-zinc look is on tens of thousands of sites. Shipping
it would worsen the exact problem this file exists to prevent.
*Check:* grep the built CSS for shadcn's stock values. The count must be zero.

**2.3 Style the component, never fork its behaviour.** Classes and tokens only. If
behaviour is wrong, upgrade or choose a different primitive.
*Reason:* a patched component silently stops receiving upstream accessibility fixes.

**2.4 A call site never writes a colour.** Colour lives in the token layer or nowhere.
*Check:* no hex values and no colour utilities outside the token bridge.

**2.5 One component at a time, each through the full gate.** Build, oxlint, palette,
axe in **both** themes, plus a hand check of its focus ring, before the next starts.

**2.6 If a component cannot be rethemed to this standard, it is not used.** The
standard does not bend to fit a library.

**2.7 No component introduces a shadow** except a genuinely floating layer (dropdown,
dialog, sheet). Everything in the page separates on hairlines.
*Reason:* all four consultancies studied have effectively zero decorative shadows.
Solita has a real 4-step elevation scale and uses it at `.04`–`.06` alpha, almost
nowhere.

**2.8 Retired: the `#styleguide` specimen rule.** Every adopted component used to have
to be rendered on `#styleguide` in both themes. The repo owner removed that page as no
longer needed, so components are reviewed where they are used: screenshot the section
in both themes (§5).

---

## 3. Standing constraints

**Nothing is invented.** No fabricated statistic, client, testimonial or capability —
**and no fabricated affordance**: a link whose destination is the section it already
sits in, or a badge asserting a partner tier no source supports, is the same class of
dishonesty as a fake number. Missing content is left absent and marked.

Every string in `src/data/norrin.ts` is traceable to a public Norrin page. Anything
authored is flagged (`altIsOurs`, `placeholder`, `paraphrase`). **This governs facts,
never design choices** — an authored palette is a stated point of view, not a false
claim, and the README says so.

**Norrin's own font and logo may be used.** Their typefaces (ABC Camera Plain, LFS
Adelia) and their logo are available to this build directly.
*Reason:* the repo is private and exists only to demo a redesign to Norrin; it is never
used commercially, so licensing does not constrain it. This covers Norrin's own marks
only — customer logos and client headshots stay as type or absent, as `norrin.ts` records.

**Photography before illustration.** Where a real photograph exists, it outranks a
drawing. A cute character on an enterprise consultancy page is the most recognisable
generated signal available.

**Real named humans over abstractions.** Of the four consultancies studied, only
Solita puts a name to a face — and it has the best system of the four. Where no photo
exists, leave the asymmetry visible rather than smoothing it over.

**Numbering only where content is a sequence.** A timeline earns 01/02/03. Eight
unrelated sections do not. Zero of four reference sites number their sections.

**Motion: Motion for components, native CSS `animation-timeline` for scroll.** The
blanket ban — *"no GSAP, no framer-motion"* — was lifted by the repo owner. Motion (the
library formerly called framer-motion, now published as `motion`) is allowed for
component state transitions, enter/exit and gestures. **GSAP ScrollTrigger stays out**,
and everything scroll-linked stays on native CSS `animation-timeline`. The scroll half of
the ban was kept because that is where the real defect was.

*Reason:* the named failure was scroll-driven — a ScrollTrigger misfire strands an
element at `opacity: 0` forever, while a compositor-driven timeline has no JS in the path
to misfire. Reaktor ships `body{opacity:0 !important}` with no `prefers-reduced-motion`
fallback and blanks itself for anyone whose JS fails. A hover state or an exit transition
carries none of that risk, so the ban was wider than the defect it was written for.

**The guard rail that replaces it: no animation may leave content in a state where its
failure hides content.** Never animate a text element's `opacity` from 0 as its arrival —
movement carries arrivals. That is *"Text is never faded for effect"* below, seen from
the other end: the same defect, whether the fade never finishes or never starts. If JS
never runs, every piece of content must still be visible and readable.
`prefers-reduced-motion` is honoured by every animation, with no exceptions.
Keep orchestrated moments; cut scattered ones. Density of scroll effects is itself a
generated-looking signal.

*Check:* two greps, both of which actually run. Every animation rule in the built CSS
sits inside `@supports (animation-timeline: view())`. And under `prefers-reduced-motion`,
every animated element reports `opacity: 1`, `clipPath: none` and its full width.

*This check was rewritten once already.* It first read "disable JavaScript and load the
page; every heading must still be legible" — which sounds right and is unsatisfiable
here. This is a client-rendered SPA with no SSR: with JS off the document is 31
characters, `<div id="root"></div>`, and **no** section passes. A check nothing can pass
is not a standard, it is decoration. The two above catch the same defect — an animation
that can strand content — and can be run today.

**Text is never faded for effect** — ancestor opacity folds into contrast maths, so
faded copy genuinely fails. Movement alone carries text arrivals.

---

## 4. Under revision — do not treat as settled

These are being decided with the user, on rendered options, not chosen unilaterally.

- **Palette.** Departing from Norrin's extracted moss/sun/forest tokens. Directions are
  rendered in place and picked from. Until then, no rule here hardcodes a hue, and
  `tools/palette.mjs` still gates the *current* tokens.
- **Radius. SETTLED — moved out of this section.** The rule was amended in the open, in
  `src/index.css`, and now reads: **"radius means it is an object, not a plane."** A plane
  is the page itself — a full-bleed band, the ground, a rule, a timeline — and planes have
  no corners because they have no edges you are meant to see. An object sits on a plane
  and has a shape. Structure that is plane stays square: the production line, the eyebrow
  rules, the ruled tables.

  **Amended: a node is a point, not a plane.** The timeline's milestone nodes used to be
  listed above as structure that stays square. They are circles, and the rule was the
  thing that was wrong. A station on a track is a *point* — it has no edges and therefore
  no corners to round, so a circle is its geometry rather than a radius applied to it.
  The track line it sits on is still plane and still square-ended. Drawn as an
  equal-sided box at `--radius-action`, never as a rounded rectangle approximating a
  circle.

  This entry had gone stale: it still quoted the retired *"radius means you can touch
  it"* wording months after `index.css` was amended, and after `Roles` had already shipped
  `--radius-panel` cards under the new rule. The old phrasing was a lossy summary of its
  own scale even when it was current — `--radius-panel` was always documented as
  "anything that opens **or frames**", and the Thinking frame neither opens nor is
  pressable.

  Cards and the customer stack are adopted under this rule and needed no further
  amendment. The one step still unspent is `--radius-section`; it stays declared and
  flagged in `index.css` until a section actually floats.
- **Type. SETTLED — the repo owner's call: the same fonts as norrin.com.** ABC Camera
  Plain sets everything, headings included, as it does on their site (regular 400, and
  their Medium file served as 700). LFS Adelia is used only where Norrin uses it: the one
  large uppercase statement, which here is the hero headline. There is no mono face,
  because Norrin has none. The files are self-hosted in `public/fonts` under §3.

---

## 5. The gates — every change, no exceptions

```
npm run build
npx oxlint src                                 # zero
node tools/palette.mjs                         # every declared colour pair
node tools/audit.mjs http://localhost:4173/    # axe, PRODUCTION PREVIEW
```

Axe must be clean light **and** dark, closed **and** with the bar's open state
showing, at the top and over an inverse band — **and on every route, not just `/`**.

*This line said "nav-drawer-open" until the hover drawers were deleted.* The bar had
four items, three of which opened a mega-menu; there are two now and both are plain
links to routes, so the only open state the bar still has is the mobile sheet, and that
is what `tools/audit.mjs` opens. The wording changed because the thing changed — the
requirement did not. What it has always meant is that the closed bar is the only state
the plain pass ever sees, so any claim about an open one is taken on trust unless
something opens it.

*The per-route clause is new and was learned the same way.* The site is five — now
three — documents, and a gate run against `/` says nothing about the others.

**Axe does not automate focus-indicator contrast.** A clean run has never been evidence
about focus rings; two real ring bugs here were found by hand after clean runs. Check
them manually, in both themes.

**Then screenshot and actually look.** `node tools/shot.mjs --theme=dark`, and read the
image back. Several real defects here — including the alt-text failure in §1.9 — were
caught only by looking. For the pinned scenes, `--clip` captures scroll position zero
where nothing has arrived yet; use `.shots/probe/gap-pin.mjs`.

---

## 6. Where things are

- `src/index.css` — the whole design system, tokens and rationale, ~1900 lines
- `src/data/norrin.ts` — all content, with per-block provenance
- `docs/research-brief.md` — evidence on Norrin itself
- `docs/style-research.md` — Reaktor, Futurice, Vincit, Solita, from their real CSS
- `#compare`, `#backdrops`, `#fonts` — hash surfaces, not nav items
