import { CONTOURS } from './contours'

/**
 * The hero's background field — an aerial contour survey.
 *
 * WHY THIS FIGURE, and not a gradient, a mesh, a particle field or any of the
 * other things a hero background usually is. It is the one image that already
 * belongs to three things this page does:
 *
 *   1. THE AERIAL VIEW. Norrin's own photography is aerial landscape — a river
 *      through fields, a switchback road, a causeway over a lake. A contour map
 *      is what those photographs are OF, abstracted. (This used to say "the
 *      band directly above it is three aerial photographs". That band was
 *      removed; the kinship is with the photographs wherever they land, not
 *      with a band that no longer exists.)
 *   2. THE PRODUCTION LINE. This page's entire device is a rule that is dashed
 *      while the work is provisional and solid once it is real. Survey
 *      cartography uses exactly that convention for exactly that reason:
 *      surveyed contours are solid, interpolated ones are dashed. Every third
 *      line here is solid. The device recurs at map scale instead of being
 *      restated in words.
 *   3. NORDIC WITHOUT COSTUME. Cartography carries the register without a pine
 *      tree, an aurora or a flag.
 *
 * IT IS OURS, AND THE README SAYS SO. Everything else visual on this page is
 * either Norrin's own (their photographs, their copy) or derived from their
 * published tokens. This is authored. That is allowed — "nothing is invented"
 * governs facts, never design choices — but it is the kind of thing that has to
 * be stated rather than left to be assumed, because the value of the rule is
 * that a reader can trust the parts that ARE quotation.
 *
 * WHY VECTOR AND NOT AN IMAGE. A raster of this would be a fixed resolution, a
 * second asset for dark mode, and — as a GIF — 256 colours with 1-bit alpha and
 * megabytes for any loop worth having, animating straight through
 * `prefers-reduced-motion`. This is 7.2 kB gzipped, scales to any viewport, and
 * takes every colour from a CSS custom property, so it re-themes itself for
 * free when the palette changes rather than needing to be redrawn.
 */
export function ContourField() {
  return (
    <div
      aria-hidden="true"
      // `-z-10`, and this was a real bug rather than a preference. An
      // absolutely-positioned element with no z-index paints ABOVE static
      // in-flow siblings, so the first version drew contour lines straight
      // across the three photographs and through the middle of the headline.
      //
      // A negative z-index is the correct fix and not the dangerous one it
      // looks like: a negative child paints above its own parent's background
      // and borders, but below the parent's in-flow content. That is exactly
      // the layer wanted — over `bg-ground`, under everything that is read.
      className="contour-field pointer-events-none absolute inset-0 -z-10 overflow-clip"
    >
      <svg
        // `slice`, not `meet`: this is a ground, and a ground fills its box.
        // `meet` would letterbox the field and leave the section's flat plate
        // showing above and below it at most aspect ratios.
        //
        // THE FIELD IS AUTHORED AT THE HERO'S OWN ASPECT, and that is the whole
        // reason it is legible. It was 1600x620 — an aspect of 2.58 against a
        // hero box of about 1.63 — so `slice` scaled it 1.5x and cropped away
        // 37% of the width. Two thirds of the survey was off-screen, which is
        // why it read as a few stray strokes rather than as terrain, and why it
        // only came good at 75% browser zoom where the viewport gets tall enough
        // to keep more of it.
        //
        // 1600x1000 is 1.6, which is the hero's box at the sizes it actually
        // renders. Almost nothing is cropped now, so the composition that was
        // generated is the composition that is seen.
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* NO GROUP OPACITY, and no borrowed hairlines. Both changed together
            and neither works without the other.

            It used to be `--hairline` / `--hairline-strong` under
            `opacity="0.5"`. Two problems compounded: those tokens are solved to
            read as structure, not as a ground, and in dark they are a lifted
            grey (`#292f2a`) only a few steps off the plate — so halving them
            left a survey you had to look for rather than one you could read.

            The field now draws in `--contour` / `--contour-strong`, which are
            white at low alpha in dark and pigment in light, and it draws them at
            full strength. The tokens carry the entire decision about how far
            back this layer sits, which is where one definition of that belongs.

            THICKER TOO, at 1.25. Half a hair, but `vector-effect:
            non-scaling-stroke` means this is 1.25 DEVICE pixels at every
            viewport rather than a width that grows with the `slice` scale, so
            it is the only place the weight can be set honestly.

            Still decoration — `aria-hidden`, no text — which is the only kind of
            thing on this page allowed to be tuned by eye rather than solved to a
            ratio. Text is never faded, because ancestor opacity folds into
            contrast maths and genuinely fails it. */}
        <g fill="none" strokeWidth="1.25" vectorEffect="non-scaling-stroke">
          {CONTOURS.map((c, i) => (
            <path
              key={i}
              d={c.d}
              // Two weights, and the split is the survey convention rather than
              // a rhythm picked to look varied: solid lines are the surveyed
              // ones, dashed are interpolated.
              //
              // NO className. These used to carry `contour-solid` /
              // `contour-dashed`, whose only job was to hook the two infinite
              // animations that have been removed for performance — see the
              // note in index.css. A class that selects nothing is a hook
              // waiting to be re-used by accident.
              stroke={c.solid ? 'var(--contour-strong)' : 'var(--contour)'}
              strokeDasharray={c.solid ? undefined : '5 7'}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
