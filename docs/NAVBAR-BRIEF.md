# Navbar redesign — brief and diagnosis

Status: **built and verified.** Kept as the record of what was wrong and what was decided.

The rest of the site is complete and verified (see `README.md`). This is the one
outstanding piece of work.

---

## Diagnosed problems

Screenshots of every header state are in `.shots/nav/`:
`1-top-transparent`, `2-scrolled-solid`, `3-dropdown-open`, `4-over-dark`, `5-locale-focused`.

### 1. The locale switcher is a native `<select>` — the main issue
`Nav.tsx`, `#locale`. Because it is a real `<select>`, the open dropdown is drawn by the
OS: blue system highlight, white panel, hard border, system font. It ignores the entire
design system and is the single most off-brand element on the page. The user flagged this
directly with a screenshot.

**Constraint on the fix:** whatever replaces it must stay keyboard-operable and screen-reader
correct. A `<button>` + `role="listbox"` / `role="option"` menu with arrow-key roving focus,
`aria-expanded`, `aria-activedescendant`, Escape-to-close and outside-click-to-close. Do not
ship a `<div>` that only responds to mouse. Current axe score is zero violations in both
themes — that must survive.

### 2. The scrolled bar is see-through
`bg-ground/92` + `backdrop-blur-[6px]` is too weak: in `2-scrolled-solid.png` the hero word
"production" reads clearly through the bar, directly behind the "Norrin" wordmark. Needs a
stronger blur and/or a higher-opacity ground, without going fully solid and losing the
material feel.

### 3. The nav group is not optically centred
`justify-between` across three children: logo (~170px), nav, utilities (~230px). The unequal
flanks push the link group roughly 50px left of true centre. Either centre it absolutely, or
commit to a left/asymmetric arrangement on purpose — but the current state reads as an
accident rather than a decision.

### 4. No active-section state
This is a single-page site whose nav items are anchors. Nothing indicates where the reader
currently is. The section-tracking pattern already exists in `Pillars.tsx` (IntersectionObserver
picking the entry nearest the top of the reading zone) and can be reused.

### 5. Minor
- `Contact` is the only filled surface in the bar and is visually heavy. Defensible — it is
  the primary CTA — but worth testing against a lighter treatment.
- The bottom hairline is very faint at the transparent→solid transition.

---

## Proposed direction (not yet validated)

**Signature idea:** the header's bottom hairline becomes *the production line*, filling
left→right with moss as the reader progresses down the page. It is the site's central device,
it is genuinely useful (progress), and it reframes the scroll as the journey from pilot to
production — the page's whole argument. Keep it 1px and quiet; it must not read as a generic
gradient progress bar. Over inverted sections it should switch to sun/inverse ink.

Risk to check: scroll-progress bars are common. What makes this specific is that it is the
same rule used everywhere else on the site, not a new element. If it starts to feel like a
bolted-on widget, cut it — see the "remove one accessory" note below.

**Everything else in the bar stays quiet.** Spend the boldness in one place.

---

## Guardrails carried over from the rest of the build

- Hairlines carry all separation. **Zero box-shadows anywhere on the site.**
- Radius scale is `0 / 2px` only.
- Sun is a signal, never a surface — budget of three solid uses per page, already spent
  (proof marker, gap crossing, contact terminal square) plus Fyr's lamp. A new sun element in
  the navbar needs to displace one of those, not add a fourth.
- Moss is the only accent permitted to touch type or stroke.
- Anything sitting on sun uses fixed dark ink in **both** themes.
- `prefers-reduced-motion` must kill any new motion; content must never depend on it.
- The header already inverts over `[data-tone="inverse"]` sections — preserve that.

## Verification loop (all currently passing — keep them passing)

```bash
npm run build            # tsc -b + vite build
npx oxlint src           # zero warnings
node tools/audit.mjs     # axe-core light + dark, heading order, hidden content
node tools/shot.mjs --vp=desktop --clip=hero
node tools/shot.mjs --all
```

The shot harness navigates by hash so `scroll-margin-top` is honoured, and pre-scrolls so
IntersectionObserver reveals fire before capture. Do not revert either — both were added
because they produced false "broken layout" readings.

## Note from the frontend-design skill

The skill lists "broadsheet-style layout with hairline rules, zero border-radius" as one of
three current AI-default looks. This build's hairline discipline came from analysing the
user's own reference site (Tailwind v4, layered surfaces, hairlines rather than shadows), and
the palette is Norrin's own extracted theme tokens — so it is brief-driven rather than a
default. Worth re-testing that judgement when touching the navbar, since the navbar is where
a "default" reading would show up first.


---

# OUTCOME

Built. `npm run build` green, `oxlint` clean, axe-core zero violations in both themes —
including with the locale listbox open.

**Fixed**
1. Native `<select>` → hand-built ARIA listbox (`LocaleMenu.tsx`). Verified by keyboard:
   Enter opens, arrows move, Home/End jump, ArrowUp wraps, Enter selects and returns focus
   to the trigger, Escape closes, outside click dismisses. Language names are in their own
   language with `lang` attributes so a screen reader pronounces them correctly.
2. See-through bar → **opaque**. The instinct was to add blur; the correct fix was to remove
   it. This system bans glassmorphism explicitly, so a frosted bar was the one place the
   site broke its own rule.
3. Off-centre nav → three-zone grid (`1fr auto 1fr`).
4. No wayfinding → current-section dot, driven by the same observer pattern as `Pillars`.
5. Dropdown → hairline-divided rows with a mono index column and a moss edge that grows down
   the row on hover, hanging flush from the bar's own rule. No card padding, no shadow, no
   doubled border.
6. The locale switcher was desktop-only, stranding four of five languages on phones. It is
   now in the mobile sheet too.

**Tried and cut**
- *The wordmark's Fyr changing topmark with reading position* (pilot → deploying →
  production). Conceptually the best idea here — it reuses the vocabulary the site already
  teaches and would have made the progress indicator native to the brand. Cut because a
  pilot mark at 26px is a stem and a dot, so the logo went weak for the first screen of
  every visit. An identity that dissolves in one of its states is not an identity.
- *A full-width mega-shelf* for the dropdown. Built, screenshotted, rejected: it was a
  bigger gesture than a four-item menu deserves.
- *A scroll-progress line* in the bottom rule. Cut as redundant once the current-section dot
  existed — two wayfinding signals is one too many.

**Note for a real build:** the Thai and Vietnamese option labels render in a fallback face,
because the site self-hosts latin subsets only. Shipping those locales means adding the
matching subsets.

---

# OUTCOME 2 — the pop-out, rebuilt as a drawer

The bar survived review; the thing hanging off it did not. All four variants shared one
`Dropdown`, so the weakest component in the header was also the one common to every option.
Screenshots of every state are in `.shots/nav/` (`--nav` flag, below).

## What was wrong

1. **It was a card.** Border on all four sides, `rounded-b-[2px]`, fixed `w-[22rem]`, floating
   over the page and aligned to nothing. A four-sided hairline rectangle is still a box.
2. **`01–04` asserted a sequence that does not exist.** Numbering is true in `Pillars` (three
   ordered ways in) and in the section eyebrows. "Platforms we run" is not a fourth pillar,
   and Thinking's children are formats, not steps.
3. **`hover:bg-surface` filled the row.** Filled rectangle plus a bar down the left edge is
   the OS context-menu affordance — the most default hover there is.
4. **Rows were 146px tall**: ~600px of panel for four links, hanging off a 72px bar.
5. **The parent destinations were unreachable by mouse.** `#roles`, `#thinking` and `#proof`
   sat behind a `<button>` that only ever toggled.
6. **The active-section mark was a 3px square floating above the rule**, reading as a speck.

## What it is now

The header temporarily gets taller. Same ground as the bar, no border of its own — the bar's
existing `border-b` is the drawer's top edge — rows aligned to the bar's own `Container`, and
one full-bleed `hairline-strong` rule closing it, exactly as every section divider on the page
behaves. 228px, four rows at 52px.

Rows are the hero stat table's idiom: name left, mono metadata right, hairline between,
bounded at 46rem. Run them the full 1416px and the name loses all relationship with its
metadata across a thousand pixels of nothing — that was the first version and the screenshot
killed it.

**The hover is the signature.** The old panel already grew a moss edge, but on the *vertical*
left edge, where it reads as a selection bar. On the horizontal rule it becomes the page's own
device: the line completing left→right as the item becomes real. Same gesture as the hero's
dashed→solid production line, at its smallest scale. No fill, no numbers, no box.

The active-section dot became **a length of the bar's bottom rule**, and an open trigger lights
the same segment — so the drawer visibly hangs from the word that opened it. Two states, one
device.

## Non-obvious things that came out of it

- **One drawer, not one per item.** Moving between menus resizes what is already open instead
  of hard-cutting between two panels. Costs a `lastItem` held through the close animation,
  adjusted during render rather than in an effect so content and open state land in the
  same commit.
- **Full-bleed removes the hover-intent geometry.** There is no diagonal to fall off, so no
  safe triangle — just an 80ms open delay (0ms when already open, so switching is instant)
  and a 140ms close grace.
- **A shared drawer breaks the tab order, and this is the trap.** It cannot sit next to its
  trigger in the DOM the way a per-item panel can, so it landed *after* Contact — Tab from
  "What we do" reached the drawer only via Work, Thinking, Company, locale and Contact first.
  Fixed by handing focus on at both edges: Tab off an open trigger enters the drawer,
  Shift+Tab off the first row returns to the trigger, Tab off the last row closes and
  continues to the next item in the bar.
- **Keyboard toggles, mouse navigates.** `e.detail === 0` distinguishes them. Enter on a
  disclosure must open, not navigate, or the keypress closes what it just opened; a real mouse
  click on a hover-capable pointer navigates, which is what makes the parent sections
  reachable again. Coarse pointers never hover-open at all.
- **Tailwind v4 compiles `scale-x-*` to the `scale` property, not `transform`.** A check
  reading `getComputedStyle().transform` reports `none` and looks like a broken animation. It
  is not — `transition-transform` in v4 covers `transform, translate, scale, rotate`. Measured:
  0 → 0.56 at 60ms → 1.

## Fixed defects found by testing, not by looking

- **axe had never seen an open dropdown.** `audit.mjs` only counted `<nav>` elements and
  `shot.mjs` had no nav-state flag — every earlier nav screenshot was taken by hand, so the
  previous "zero violations including the dropdown" claim was untested. Both harnesses now
  exercise it.
- That pass immediately found a real failure: the drawer's mono notes over a forest band in
  **light** theme at `text-inverse-ink/55` measured **4.32:1**, under the 4.5 floor at 11px.
  Now `/70` — 6.07:1. Dark theme passed because `--inverse` is deeper there.

## Verification

```bash
npm run build                                   # green
npx oxlint src                                  # zero warnings
npx vite preview --port 4181
node tools/audit.mjs http://localhost:4181/     # axe: no violations, light + dark,
                                                # closed AND drawer-open at top and over inverse
node tools/shot.mjs --nav                       # every header state
node tools/shot.mjs --nav --variant=4 --theme=dark
node tools/shot.mjs --all
```

Audit the **production** build, not the dev server: the dev-only variant picker in `Nav.tsx`
is outside any landmark and trips axe's `region` rule on its own.

24 behaviour checks were run against the real page and all pass — collapse at rest, `inert`
when closed, fast-pass-does-not-open, 228px not 600px, full-bleed closing rule, opaque ground,
switch-resizes-rather-than-closes, rule completion on hover and on `focus-visible`, mouse click
reaching `#roles`, Enter-opens-without-navigating, Tab into the drawer, Escape returning focus,
tab-out closing, coarse-pointer behaviour, and reduced motion leaving the drawer at full height
with the rule fully drawn.

## Still open

- Variant 2 (Masthead) still numbers the top-level items `01 What we do`, `02 Work`… That is
  the same false-sequence problem removed from the drawer. Left in place deliberately, because
  the numbers are part of that variant's character and the variant cull has not happened yet.
  If Masthead wins, they should come out.
- No visual "this opens a menu" affordance. `aria-haspopup` covers assistive tech and keyboard
  focus opens the drawer; on a four-item nav a chevron would be the one generic mark left in
  the bar. If it reads as under-signalled, that is the fallback.
