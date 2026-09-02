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
  { note: 'D reading   / ground ', fg: '#a8b09b', bg: '#0e120f', min: 4.5 },
  { note: 'D reading   / surface', fg: '#a8b09b', bg: '#161b17', min: 4.5 },
  { note: 'D ink-3     / ground ', fg: '#868a7c', bg: '#0e120f', min: 4.5 },
  { note: 'D ink-3     / surface', fg: '#868a7c', bg: '#161b17', min: 4.5 },
  { note: 'D ink-3     / overlay', fg: '#868a7c', bg: '#191f1b', min: 4.5 },
  { note: 'D ink-3     / tint   ', fg: '#868a7c', bg: TINT_D, min: 4.5 },
  { note: 'D ink-2     / tint   ', fg: '#b4b8ac', bg: TINT_D, min: 4.5 },
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
]

const failed = check(pairs)
console.log(`\n${pairs.length - failed}/${pairs.length} pass`)
process.exit(failed ? 1 : 0)
