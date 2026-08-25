# Phase 4 — the colour theme finished, and a radius that means something

Two jobs, and they turned out to be the same job: the system had a complete vocabulary for
*structure* and an incomplete one for *controls*. Everything below follows from that.

---

## 1. What was actually missing

The palette had grounds, ink, hairlines and meaning. It had no **state**. Concretely:

- Hover was written at the call site. `hover:bg-[#e9e45f]` appeared as a raw hex in
  `Contact.tsx` and again in `NavParts.tsx` — two files that cannot see each other, holding
  the same colour by coincidence.
- **Pressed did not exist.** A filled control with no `:active` feels dead under the finger
  on touch, where there is no hover to fall back on.
- There was no surface for a floating control to open onto. The locale list used
  `bg-ground`, so with no shadows permitted its only separation was a `--hairline` border.
- The forest bands were built from **eight hand-picked alphas** of `--inverse-ink` — `/15
  /20 /25` for rules, `/60 /65 /70 /75 /80 /85` for type — chosen file by file for the same
  three jobs. "Muted text on forest" was a different colour in four sections.
- There was **no button**. Four hand-assembled ones, drifted to three paddings
  (`px-6 py-3.5`, `px-5 py-2.5`, `px-6 py-4`) and two transition durations.

## 2. Radius

The old rule was `0 / 2px`, argued as: Norrin's own `2em` pill form fields read soft and
consumer, and this is enterprise infrastructure.

Right about the disease, wrong about the cure. What reads consumer is rounding *everything*
indiscriminately, so curvature says nothing. And 2px on a 50px button is a rasterising
artefact, not a restrained radius — the system was effectively at zero.

The scale is now three values carrying one meaning: **radius means you can touch it.**
Structure stays square, because a hairline separates rather than contains and a rule has no
corners. The production line, eyebrow rules, ruled tables, section bands, timeline nodes and
the sun terminus are untouched. The only rounded shapes on the page are the ones that
respond, so the eye finds every action without anything being coloured louder.

The geometry is the mark's own — Fyr's float is `rect w=3.6 rx=1.8`, a capsule, and its mast
cap is a softly rounded stroke:

| Token | Value | Role |
|---|---|---|
| `--radius-action` | `999px` | the solid CTA and its ghost. The float's silhouette. |
| `--radius-control` | `8px` | nav items, locale trigger, menu options, hamburger, skip link |
| `--radius-panel` | `14px` | the locale list, the Thinking rungs |

**The nav drawer stays square.** It is the header temporarily getting taller; a radius would
make it a floating card, which is the one thing its construction exists to avoid.

**The Thinking rungs are one frame, not three cards.** The cells are already
hairline-separated, so the radius goes on the outer edge and the interior stays ruled —
twelve rounded corners become four, and the block reads as one object you choose from rather
than three boxes competing.

## 3. Things this surfaced that were already broken

Four, none of which a passing audit had ever mentioned:

- **`:focus-visible` set `border-radius: 1px` on the focused element** — on the element, not
  on the ring. Focusing a control reshaped it. With a radius scale in place that would have
  squared the pill CTA the moment it was tabbed to. An outline already follows its element's
  own border-radius, so the declaration is simply gone.
- **The header never declared its tone.** `[data-tone='inverse'] :focus-visible` therefore
  never matched inside the bar, so tabbing the nav while it sat over a forest band drew a
  moss ring — 1.40:1. axe does not automate focus-indicator contrast, so every clean run was
  silent about it. Fixed by `data-tone={inverted ? 'inverse' : undefined}` on the header;
  both harness scripts' `[data-tone="inverse"]` queries are now scoped to `main` so they
  cannot latch onto the fixed bar and quietly audit the same place twice.
- **The locale menu's selected mark was moss on forest** when the bar inverted — drawn, and
  then not visible. Sun is the band's stand-in, as it already is for the focus ring.
- **`tools/shot.mjs` never captured the locale panel.** It matched
  `getByRole('button', { name: /^EN/ })` — the button's visible *text* — but the control has
  an `aria-label` ("Language: English"), and an accessible name overrides text content. So
  `count()` was 0 and the branch silently did nothing. The panel now gets captured on both
  grounds, which is how the white-card-on-forest bug below was found at all.
- **The hamburger had no padding**: a bare 26px icon, so a 26px tap target on the one
  viewport where every target is a thumb.

## 4. The one thing the first pass got wrong

`.panel` gave the locale list `--overlay` — near-white paper. Over the forest bar it opened
as a **white card floating on a dark green band**, which is precisely the construction the
drawer beside it exists to avoid. Caught by screenshot, not by reasoning.

Fixed with `--inverse-overlay`, built as the hover wash made opaque
(`color-mix(--inverse-ink 6%, --inverse)`) rather than as a fourth green, so the band has one
idea about being lifted. Like the wash it carries the `--inverse-ink` and `--inverse-ink-2`
rungs only: `--inverse-ink-3` measures 4.71:1 on the flat band and there is no headroom to
lift it onto — which is why the locale list's code column moved up a rung.

## 5. Verification

`tools/contrast.mjs` + `tools/palette.mjs` are new. The palette file declares **every colour
pair the system actually renders** — alpha composited onto its real background first, because
an uncomposited ratio on the translucent inverse ramp is fiction — measures each one, and
exits non-zero on a miss. **61/61 pass.**

Two of those minimums are not WCAG numbers. A divider is not a UI component boundary, so 3:1
is the wrong bar for one; the bar that matters is **parity** with the paper ramp, so the
paper hairlines' own measured ratios (1.29:1, 1.85:1) and lichen's (2.92:1) are the
minimums. The inverse alphas were solved against them rather than picked: 10% / 22% / 38%.

Two pairs were tightened rather than accepted:

- `--ink-3` on the light hover wash measures **4.53:1** — a pass with no margin left in it.
  The wash stayed at 6% and the one label that sits on it moved to `--ink-2`.
- `--ink-3` on a dark overlay one step lighter than `#191f1b` measures 4.47:1. That is why
  the dark overlay stops where it does.

All gates green: `npm run build`, `npx oxlint src` (zero), `node tools/palette.mjs` (61/61),
`node tools/audit.mjs` against the production preview — axe clean in light and dark, closed
and drawer-open, at top and over an inverse band.

## 6. Removed

`--accent-soft`. A name describing a tone whose only consumer was the hover state, and whose
generated utility (`text-accent-soft`) was never used once. It is `--accent-hover` now.
