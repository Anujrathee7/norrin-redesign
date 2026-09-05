/**
 * Every colour pair the system actually renders, measured.
 *
 * This exists because the palette grew a second half — hover, pressed, tint,
 * overlay and a proper inverse ramp — and each of those is a surface something
 * has to stay readable on. `@1` composites the alpha form onto the stated
 * background first; the inverse bands are built from translucent ink, so an
 * uncomposited ratio there would be fiction.
 *
 *   node tools/palette.mjs
 */
import { check } from './contrast.mjs'

// Pre-composited hover washes, so the number below is the surface as painted.
const TINT_L = '#ebede8' // accent 6% over light ground
const TINT_D = '#1b2119' // accent 8% over dark ground

const pairs = [
  // --- light: ink ramp on every paper ground ---------------------------------
  { note: 'L ink       / ground ', fg: '#14170f', bg: '#f8f7f3', min: 4.5 },
  // The card puts the full ink ramp on --surface in two sections at once, so
  // the top of that ramp is now load-bearing there and not just on paper. It
  // was measured on #styleguide and never enforced here, which is the gap this
  // closes: the guide reports, the gate refuses.
  { note: 'L ink       / surface', fg: '#14170f', bg: '#f1f0ea', min: 4.5 },
  { note: 'L ink-2     / ground ', fg: '#4a4d42', bg: '#f8f7f3', min: 4.5 },
  // The customer card sets its quote in --ink-2 on --surface, which demotes the
  // quote under the case title without fading it — §3 refuses opacity on text,
  // so a rung down the ladder is the only honest way to say "quieter". The pair
  // had never been measured here even though the card already put the rest of
  // the ramp on that surface in two sections.
  { note: 'L ink-2     / surface', fg: '#4a4d42', bg: '#f1f0ea', min: 4.5 },
  { note: 'L ink-3     / ground ', fg: '#696d5f', bg: '#f8f7f3', min: 4.5 },
  // Reading ink — the lichen-derived serif colour. Gated on BOTH the ground and
  // the surface because long-form serif runs over Pillars' and Thinking's
  // `--surface` bands as well as on plain paper, and a reading colour that only
  // holds on one of them is a colour that fails wherever the eye spends longest.
  { note: 'L reading   / ground ', fg: '#4d5744', bg: '#f8f7f3', min: 4.5 },
  { note: 'L reading   / surface', fg: '#4d5744', bg: '#f1f0ea', min: 4.5 },
  { note: 'L ink-3     / surface', fg: '#696d5f', bg: '#f1f0ea', min: 4.5 },
  { note: 'L ink-3     / overlay', fg: '#696d5f', bg: '#fdfcfa', min: 4.5 },
  { note: 'L ink-3     / tint   ', fg: '#696d5f', bg: TINT_L, min: 4.5 },
  { note: 'L ink-2     / tint   ', fg: '#4a4d42', bg: TINT_L, min: 4.5 },
  // The top of the ramp on the hover wash. A `.control` hovered goes to
  // --tint behind and --ink in front at the same moment, and a nav item is the
  // most-hovered control on the page — so this is a rendered pair, and it was
  // missing while the two rungs below it were both here. It became load-bearing
  // when the bar stopped inverting: the header's hover state used to resolve to
  // --inverse-tint / --inverse-ink over a band, and the bar now has one ground
  // and therefore exactly one hover pair, in each theme.
  { note: 'L ink       / tint   ', fg: '#14170f', bg: TINT_L, min: 4.5 },
  // ALSO THE NAVBAR'S FOCUS RING, and that is new. The bar used to declare
  // `data-tone="inverse"` over a dark band, which swapped its rings to sun
  // because moss is 1.40:1 on forest. The bar now paints its own --ground and
  // never inverts, so every ring inside it — wordmark, four nav items, theme
  // toggle, locale trigger, Contact, hamburger, and the drawer rows — is drawn
  // in --accent on --ground and nowhere else. This line is that ring's gate.
  // Measured at the 4.5 text bar rather than the 3:1 non-text one, because the
  // colour is doing both jobs and the tighter bar is the honest one to hold it
  // to.
  { note: 'L accent    / ground ', fg: '#1a5335', bg: '#f8f7f3', min: 4.5 },
  { note: 'L accent    / surface', fg: '#1a5335', bg: '#f1f0ea', min: 4.5 },
  { note: 'L accent    / tint   ', fg: '#1a5335', bg: TINT_L, min: 4.5 },

  // --- light: type on solid fills -------------------------------------------
  { note: 'L ground    / accent ', fg: '#f8f7f3', bg: '#1a5335', min: 4.5 },
  { note: 'L ground    / a-hover', fg: '#f8f7f3', bg: '#2a6b47', min: 4.5 },
  { note: 'L ground    / a-press', fg: '#f8f7f3', bg: '#123e28', min: 4.5 },

  // --- dark: ink ramp --------------------------------------------------------
  { note: 'D ink       / ground ', fg: '#f2f2ec', bg: '#0e120f', min: 4.5 },
  { note: 'D ink       / surface', fg: '#f2f2ec', bg: '#161b17', min: 4.5 },
  { note: 'D ink-2     / ground ', fg: '#b4b8ac', bg: '#0e120f', min: 4.5 },
  { note: 'D ink-2     / surface', fg: '#b4b8ac', bg: '#161b17', min: 4.5 },
  { note: 'D reading   / ground ', fg: '#a8b09b', bg: '#0e120f', min: 4.5 },
  { note: 'D reading   / surface', fg: '#a8b09b', bg: '#161b17', min: 4.5 },
  { note: 'D ink-3     / ground ', fg: '#868a7c', bg: '#0e120f', min: 4.5 },
  { note: 'D ink-3     / surface', fg: '#868a7c', bg: '#161b17', min: 4.5 },
  { note: 'D ink-3     / overlay', fg: '#868a7c', bg: '#191f1b', min: 4.5 },
  { note: 'D ink-3     / tint   ', fg: '#868a7c', bg: TINT_D, min: 4.5 },
  { note: 'D ink-2     / tint   ', fg: '#b4b8ac', bg: TINT_D, min: 4.5 },
  { note: 'D ink       / tint   ', fg: '#f2f2ec', bg: TINT_D, min: 4.5 },
  // The dark theme's half of the navbar focus ring — see the light entry above.
  { note: 'D accent    / ground ', fg: '#9fb87e', bg: '#0e120f', min: 4.5 },
  { note: 'D accent    / surface', fg: '#9fb87e', bg: '#161b17', min: 4.5 },
  { note: 'D accent    / tint   ', fg: '#9fb87e', bg: TINT_D, min: 4.5 },

  // --- dark: type on solid fills --------------------------------------------
  { note: 'D ground    / accent ', fg: '#0e120f', bg: '#9fb87e', min: 4.5 },
  { note: 'D ground    / a-hover', fg: '#0e120f', bg: '#b3c795', min: 4.5 },
  { note: 'D ground    / a-press', fg: '#0e120f', bg: '#8aa36a', min: 4.5 },

  // --- sun. Fixed in both themes, so fixed dark ink sits on it. --------------
  { note: '  on-signal / signal ', fg: '#14170f', bg: '#f6f279', min: 4.5 },
  { note: '  on-signal / s-hover', fg: '#14170f', bg: '#ebe565', min: 4.5 },
  { note: '  on-signal / s-press', fg: '#14170f', bg: '#ddd74d', min: 4.5 },
  // THE REST OF THE LADDER THAT SITS ON SUN. The customer pile now sets a whole
  // CARD on sun, and a card needs three rungs of ink, a rule and an accent
  // rather than the one fixed ink `.on-signal` used to be. Sun is a single value
  // in both themes, so unlike every other ink here these are measured once and
  // that is the whole truth about them. The alphas are solved rather than
  // picked: 0.58 measures 4.21:1 and is the step that does not clear.
  { note: '  on-sig-2   / signal ', fg: '#14170f@0.74', bg: '#f6f279', min: 4.5 },
  { note: '  on-sig-3   / signal ', fg: '#14170f@0.66', bg: '#f6f279', min: 4.5 },
  { note: '  on-sig-hair/ signal ', fg: '#14170f@0.20', bg: '#f6f279', min: 1.25 },
  // The title's accent phrase on a sun card. It is the LIGHT accent in both
  // themes: lichen, the dark theme’s accent, measures 1.86:1 here.
  { note: '  on-sig-acc / signal ', fg: '#1a5335', bg: '#f6f279', min: 4.5 },

  // --- the Scope row's dark tone. ONE ENTRY EACH, like the sun ladder above,
  // because the tone is a single value in both themes and one measurement is
  // the whole truth about it. The reasoning is in index.css under SCOPE - THE
  // FOUR ROLES, IN THREE TONES; the short version is that a row built from three
  // tones stops being a row of three tones if two of them follow the theme and
  // the third does not.
  //
  // THE BACKGROUND HERE IS A PLACEHOLDER AND THESE FOUR LINES ARE WHAT MOVES
  // WHEN THE PICK LANDS. `--role-dark` is candidate A (ink) of the four rendered
  // on #styleguide; espresso #2a221c, slate #1c2733 and aubergine #2d1f33 all
  // clear the same four bars, the tightest being inv-ink-3 at 5.97:1 on slate.
  // The pale and sun tones need nothing new: their inks are the light ramp on
  // #f1f0ea and the on-signal ladder on #f6f279, both already measured above.
  { note: '  role-ink   / role-dark', fg: '#eef0e6', bg: '#14170f', min: 4.5 },
  { note: '  role-ink-2 / role-dark', fg: '#eef0e6@0.78', bg: '#14170f', min: 4.5 },
  { note: '  role-ink-3 / role-dark', fg: '#eef0e6@0.62', bg: '#14170f', min: 4.5 },
  // The card's edge, and on this tone it is load-bearing rather than decorative:
  // the dark card on the dark ground measures 1.04:1 as a field, so the rule is
  // the only thing that says a card is there. Same 1.8 parity bar as every other
  // strong hairline in this file.
  { note: '  role-hair-s/ role-dark', fg: '#eef0e6@0.22', bg: '#14170f', min: 1.8 },

  // --- the inverse ramp, composited onto both forest values ------------------
  { note: 'L inv-ink   / inverse', fg: '#eef0e6', bg: '#123e28', min: 4.5 },
  { note: 'L inv-ink-2 / inverse', fg: '#eef0e6@0.78', bg: '#123e28', min: 4.5 },
  { note: 'L inv-ink-3 / inverse', fg: '#eef0e6@0.62', bg: '#123e28', min: 4.5 },
  { note: 'D inv-ink   / inverse', fg: '#eef0e6', bg: '#16452c', min: 4.5 },
  { note: 'D inv-ink-2 / inverse', fg: '#eef0e6@0.78', bg: '#16452c', min: 4.5 },
  { note: 'D inv-ink-3 / inverse', fg: '#eef0e6@0.62', bg: '#16452c', min: 4.5 },
  // Signal is the stand-in for moss on the bands; moss itself is 1.40:1 there.
  { note: 'L signal    / inverse', fg: '#f6f279', bg: '#123e28', min: 4.5 },
  { note: 'D signal    / inverse', fg: '#f6f279', bg: '#16452c', min: 4.5 },
  // --- non-text -------------------------------------------------------------
  // A divider is not a UI component boundary, so 3:1 is the wrong bar for it.
  // The bar that matters is PARITY: a rule must read as the same weight of rule
  // on forest as it does on paper, or the page's one device changes strength
  // when it crosses into the band. The paper ramp is the reference, so its own
  // measured ratios are the minimums here.
  { note: 'L hairline  / ground ', fg: '#d8d7cc', bg: '#f8f7f3', min: 1.25 },
  { note: 'L hair-str  / ground ', fg: '#b3b3a5', bg: '#f8f7f3', min: 1.8 },
  { note: 'D hairline  / ground ', fg: '#292f2a', bg: '#0e120f', min: 1.25 },
  { note: 'D hair-str  / ground ', fg: '#404841', bg: '#0e120f', min: 1.8 },
  // The same two rules on --surface. Pillars and Thinking are both bg-surface
  // and both rule their rows there, so this pair has always been rendered and
  // was never measured — it is the tighter of the two grounds and it is what
  // the values above are now solved for.
  { note: 'L hairline  / surface', fg: '#d8d7cc', bg: '#f1f0ea', min: 1.25 },
  { note: 'L hair-str  / surface', fg: '#b3b3a5', bg: '#f1f0ea', min: 1.8 },
  { note: 'D hairline  / surface', fg: '#292f2a', bg: '#161b17', min: 1.25 },
  { note: 'D hair-str  / surface', fg: '#404841', bg: '#161b17', min: 1.8 },
  { note: 'L inv-hair  / inverse', fg: '#eef0e6@0.10', bg: '#123e28', min: 1.25 },
  { note: 'D inv-hair  / inverse', fg: '#eef0e6@0.10', bg: '#16452c', min: 1.25 },
  { note: 'L inv-hair-s/ inverse', fg: '#eef0e6@0.22', bg: '#123e28', min: 1.8 },
  { note: 'D inv-hair-s/ inverse', fg: '#eef0e6@0.22', bg: '#16452c', min: 1.8 },
  // The dashed "not yet in production" rule, both grounds. Lichen is the paper
  // reference at 2.92:1; lichen on forest itself is 1.24:1, hence the stand-in.
  { note: 'L inactive  / ground ', fg: '#88967e', bg: '#f8f7f3', min: 2.5 },
  { note: 'D inactive  / ground ', fg: '#5d6a55', bg: '#0e120f', min: 2.5 },
  { note: 'L inv-inact / inverse', fg: '#eef0e6@0.38', bg: '#123e28', min: 2.5 },
  { note: 'D inv-inact / inverse', fg: '#eef0e6@0.38', bg: '#16452c', min: 2.5 },

  // --- the night band. Work’s ground, fixed in both themes ------------------
  // It is --ground’s dark branch pinned, so in DARK theme every pair below is
  // one already measured against the page. What is new is that they are now
  // rendered in LIGHT theme too, on a plane that does not flip, which is
  // exactly the case a light-dark() palette never gets asked about. One entry
  // each, because the band is one value.
  { note: '  inv-ink    / night  ', fg: '#eef0e6', bg: '#0e120f', min: 4.5 },
  { note: '  inv-ink-2  / night  ', fg: '#eef0e6@0.78', bg: '#0e120f', min: 4.5 },
  { note: '  inv-ink-3  / night  ', fg: '#eef0e6@0.62', bg: '#0e120f', min: 4.5 },
  { note: '  signal     / night  ', fg: '#f6f279', bg: '#0e120f', min: 4.5 },
  // The roster rule and the progress track, at the band’s two hairline weights.
  { note: '  inv-hair   / night  ', fg: '#eef0e6@0.10', bg: '#0e120f', min: 1.25 },
  { note: '  inv-hair-s / night  ', fg: '#eef0e6@0.22', bg: '#0e120f', min: 1.8 },
  // A paper card on the band, and the deepest card in the pile, which is that
  // paper sunk 78% of the way to the band.
  { note: '  paper card / night  ', fg: '#f1f0ea', bg: '#0e120f', min: 1.25 },
  { note: '  deep card  / night  ', fg: '#333833', bg: '#0e120f', min: 1.25 },
  // The card’s own ink is the light ramp at its fixed values on #f1f0ea, which
  // the pairs at the top of this file already measure. What is new is only that
  // they now render in dark theme as well.
  { note: '  moss       / paper  ', fg: '#1a5335', bg: '#f1f0ea', min: 4.5 },

  // --- stone, the customer pile's fourth card tone --------------------------
  // --ink-2's light value used as a SURFACE. Not a new colour: the hue is
  // already declared, and its two alphas below are re-solved against it because
  // the inverse ramp's third rung measures 4.02:1 there and the strong hairline
  // 1.73:1 — both under their bars on this ground and fine on every other.
  { note: '  inv-ink    / stone  ', fg: '#eef0e6', bg: '#4a4d42', min: 4.5 },
  { note: '  inv-ink-2  / stone  ', fg: '#eef0e6@0.78', bg: '#4a4d42', min: 4.5 },
  { note: '  stone-ink-3/ stone  ', fg: '#eef0e6@0.72', bg: '#4a4d42', min: 4.5 },
  { note: '  stone-hair / stone  ', fg: '#eef0e6@0.28', bg: '#4a4d42', min: 1.8 },
  // The accent phrase. Moss on stone is 1.04:1, so sun stands in — the same
  // substitution this palette already makes on the forest band and on the dark
  // card.
  { note: '  signal     / stone  ', fg: '#f6f279', bg: '#4a4d42', min: 4.5 },
  // Stone as a FIELD: against the section's ground, and against the one other
  // dark card in the pile. Both are card-against-card separations rather than
  // text, so the bar is the parity bar this file sets for a rule.
  { note: '  stone card / night  ', fg: '#4a4d42', bg: '#0e120f', min: 1.25 },
  { note: '  stone card / dark   ', fg: '#4a4d42', bg: '#14170f', min: 1.25 },

  // --- the inverse hover wash. Only ever read against inv-ink / inv-ink-2. ---
  { note: 'L inv-ink-2 / inv+tint', fg: '#eef0e6@0.78', bg: '#244c37', min: 4.5 },
  { note: 'D inv-ink-2 / inv+tint', fg: '#eef0e6@0.78', bg: '#28553d', min: 4.5 },

  // --- the lifted planes. A panel's own ink, and the wash on a row inside it.
  // --inverse-ink-3 is absent on purpose: it does not clear AA on the inverse
  // overlay at any useful lift, which is why the locale list's code column was
  // moved up a rung. Composited values, in order: inverse-overlay (6% over each
  // band) and then the row wash (a further 8%) on top of it.
  { note: 'L inv-ink   / inv-ovl ', fg: '#eef0e6', bg: '#1f4933', min: 4.5 },
  { note: 'L inv-ink-2 / inv-ovl ', fg: '#eef0e6@0.78', bg: '#1f4933', min: 4.5 },
  { note: 'D inv-ink   / inv-ovl ', fg: '#eef0e6', bg: '#245139', min: 4.5 },
  { note: 'D inv-ink-2 / inv-ovl ', fg: '#eef0e6@0.78', bg: '#245139', min: 4.5 },
  { note: 'L inv-ink-2 / ovl+tint', fg: '#eef0e6@0.78', bg: '#305641', min: 4.5 },
  { note: 'D inv-ink-2 / ovl+tint', fg: '#eef0e6@0.78', bg: '#345e47', min: 4.5 },
  { note: 'L ink-3     / overlay ', fg: '#696d5f', bg: '#fdfcfa', min: 4.5 },
  { note: 'D ink-3     / overlay ', fg: '#868a7c', bg: '#191f1b', min: 4.5 },
  // Sun as the band's stand-in for moss: the selected mark and the focus ring.
  { note: 'L signal    / inv-ovl ', fg: '#f6f279', bg: '#1f4933', min: 3 },
  { note: 'D signal    / inv-ovl ', fg: '#f6f279', bg: '#245139', min: 3 },
  // --- Scope's muted card: the tone that replaces an opacity fade -----------
  // The row puts two cards either side of the front one at full legibility, so
  // they cannot recede on opacity (§3: ancestor opacity folds into these very
  // ratios). They recede on scale and on this surface instead, which makes it a
  // real reading ground and puts every rung of its ink in this gate.
  //
  // --role-muted is --hairline's light value, fixed in BOTH themes like the
  // three tones above it — a set whose members change their relationship when
  // the theme flips is not a set — so one entry each, not two.
  //
  // ink-3 IS ABSENT ON PURPOSE. #696d5f lands at 3.67:1 here and fails, so the
  // tone binds its third rung to ink-2 rather than shipping a rung that would
  // fail the first time a caption is added. That is why the pair below is
  // ink-2 and there is no ink-3 line to look for.
  { note: '  role-ink   / role-muted', fg: '#14170f', bg: '#d8d7cc', min: 4.5 },
  { note: '  role-read  / role-muted', fg: '#4d5744', bg: '#d8d7cc', min: 4.5 },
  { note: '  role-ink-2 / role-muted', fg: '#4a4d42', bg: '#d8d7cc', min: 4.5 },
  // THE EDGE IS LICHEN, NOT --hairline-strong, AND THAT IS A MEASUREMENT.
  // #b3b3a5 is the strong hairline the paper tones use and it lands at 1.46:1
  // on this surface — below the parity bar every other rule in this file is
  // solved to, because the surface itself has moved down the ramp toward it.
  // #88967e is --inactive's light value and reaches 2.16:1, which is the same
  // weight of line the paper hairlines draw on their own grounds (1.98 and
  // 2.00). Chosen for its weight, not for what --inactive means elsewhere.
  { note: '  role-edge   / role-muted', fg: '#88967e', bg: '#d8d7cc', min: 1.8 },
  // The card as a field, on both page grounds. It has to read as a card rather
  // than as an outline on paper, which is the tighter of the two by a long way.
  { note: 'L role-muted/ ground   ', fg: '#d8d7cc', bg: '#f8f7f3', min: 1.25 },
  { note: 'D role-muted/ ground   ', fg: '#d8d7cc', bg: '#0e120f', min: 1.25 },

  // --- THE EYEBROW, AND WHY IT ADDS NO LINE ---------------------------------
  // `.eyebrow` was rebuilt (see index.css): 12px in `--ink` rather than 10.5px
  // in `--ink-3`, led by a 20px `--accent` rule, with `--inverse-ink` and
  // `--signal` on the dark planes. It renders on four grounds and nowhere else
  // — `--ground` (TheGap, Proof, Careers, Roles), `--surface` (Pillars,
  // Thinking), `--inverse` (Contact) and `--band-night` (Work) — which is eight
  // ink pairs and eight rule pairs, and EVERY ONE of them is already gated
  // above:
  //
  //   ink       L/D ink / ground .......... 16.90:1  16.80:1
  //             L/D ink / surface ......... 15.87:1  15.53:1
  //             L/D inv-ink / inverse ..... 10.45:1   9.49:1
  //                 inv-ink / night ....... 16.40:1
  //   rule      L/D accent / ground ........ 8.40:1   8.66:1
  //             L/D accent / surface ....... 7.88:1   8.00:1
  //             L/D signal / inverse ...... 10.25:1   9.31:1
  //                 signal / night ........ 16.09:1
  //
  // Restating them as sixteen new rows would make the gate report the same
  // measurement twice under two names, which is how a palette file starts
  // disagreeing with itself. What is recorded instead is that the eyebrow is
  // now a CONSUMER of those rows, so the next person to touch one of them
  // knows the first line of every section on the site depends on it.
  //
  // The rule is measured at the 4.5 text bar rather than the 1.8 parity bar
  // this file uses for hairlines, because the colour is doing both jobs — the
  // same call the navbar's focus ring made — and the tighter bar is the honest
  // one to hold it to.
  //
  // `#backdrops` IS THE NINTH AND TENTH GROUND, AND IT IS NEW HERE. The
  // workbench sets the eyebrow inside `Plate`, which is `--overlay`, and that
  // pair had only ever been measured at the ink-3 rung. Two rows added, one per
  // theme, for each of the ink and the rule — it is a non-shipping surface, but
  // it is a surface the eyebrow renders on and this file's whole claim is that
  // it lists every one of them.
  { note: 'L eyebrow   / overlay ', fg: '#14170f', bg: '#fdfcfa', min: 4.5 },
  { note: 'D eyebrow   / overlay ', fg: '#f2f2ec', bg: '#191f1b', min: 4.5 },
  { note: 'L eyebrow-r / overlay ', fg: '#1a5335', bg: '#fdfcfa', min: 4.5 },
  { note: 'D eyebrow-r / overlay ', fg: '#9fb87e', bg: '#191f1b', min: 4.5 },
  //
  // THE ONE PLACE THE EYEBROW IS NOT MEASURABLE is backdrop 04 on that same
  // workbench, which is the only variant that sets the claim straight onto one
  // of Norrin's aerials with no plate under it. Type over a photograph has
  // whatever ratio that pixel happens to be. It is noted rather than gated:
  // `#backdrops` does not ship, it exists to choose between backdrops, the
  // chosen one is the drawing (two flat fills already in this file), and the
  // eyebrow was sitting there unpanelled before it was restyled — the restyle
  // moved it two rungs UP the ramp, so whatever that ratio is, it is better
  // than it was.
]

const failed = check(pairs)
console.log(`\n${pairs.length - failed}/${pairs.length} pass`)
process.exit(failed ? 1 : 0)
