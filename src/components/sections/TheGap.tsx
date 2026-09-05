import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Reveal } from '@/components/primitives/Reveal'
import { positioning } from '@/data/norrin'

/**
 * The Gap — the section the site is built for.
 *
 * Norrin's entire thesis is the distance between a demo and something that
 * survives in production, and nowhere on their current site is that distance
 * shown. Here it is the layout: three stations along one rule, dashed and
 * lichen-grey while the work is provisional, going solid only where production
 * actually begins.
 *
 * Two things this section has to get right, because they are the difference
 * between delivering the concept and merely asserting it:
 *
 *   1. The rule goes solid at station 03, not 02. If it flipped at deployment,
 *      the page would be arguing that shipping and production are the same
 *      thing — precisely the claim Norrin exists to reject.
 *
 *   2. The three stations close in over the same scroll ranges the rule reaches
 *      them, and station 03 lands over the exact range the rule goes solid. See
 *      the STATIONS CLOSE IN comment below: the motion is not laid on top of
 *      the argument, it is the argument happening to the stations.
 *
 * Copy discipline: the intro takes only the OPENING clause of Norrin's thesis
 * paragraph. Its remaining clauses become the three station captions, so no
 * sentence is printed twice in one viewport.
 */

/* ========================================================================== *
 * THE SECTION IS ON PAPER NOW, AND THE FOREST IS NOT COMING BACK HERE.
 *
 * This was a full-bleed `--inverse` plane — the page's one saturated surface,
 * two screens in. It is `--ground` in both themes now and the whole inverse ink
 * ladder maps straight down onto the paper one: three ink rungs to three ink
 * rungs, `--inverse-inactive` to `--inactive`, `--inverse-hairline-strong` to
 * `--hairline-strong`. Nothing about the ramp changed shape; it changed side.
 *
 * THE ONE SWAP THAT IS NOT MECHANICAL IS SUN → ACCENT, and it is an improvement
 * rather than a concession. Sun is fill-only and never type (see `--signal` in
 * index.css), so `text-signal` on the `03 — Production` label had to go on any
 * paper ground regardless. But the better reason is that the hero already draws
 * this exact device — `Hero.tsx`'s production line — with `--inactive` dashed
 * and `--accent` solid. On forest this section had to state the same rule in a
 * different pair of colours, because sun is the band's stand-in for moss and
 * moss measures 1.40:1 on forest. On paper the two become literally the same
 * rule at two scales, which is what the page's one device should always have
 * been.
 *
 * THE SEAM IS CARRIED BY THE DRAWING NOW, and that is what finally settled a
 * question this section changed its answer to three times.
 *
 * Seam 1 works by an opaque block riding up over the pinned hero. The forest
 * made that unmissable and paper over paper made it invisible, so for a while
 * the only thing marking the edge was a 1px sun hairline across the top of the
 * recede block — a real edge, but one pixel doing a job a whole plane used to
 * do. A field of drifting plates was briefly added as a second carrier and
 * removed for better reasons (see the STATIONS CLOSE IN note).
 *
 * The hairline is gone too, and it is not missed. What rides over the hero now
 * is a DRAWN LANDSCAPE — two shorelines and a screentone field arriving across
 * the full width — so the block announces itself by being visibly a different
 * place rather than by being outlined. That is a better seam than either
 * previous answer, and it costs the page nothing: the sun budget it frees was
 * three solids and is now down to one, the contact terminus.
 *
 * If this ever needs marking again, the move is a `--hairline-strong` top edge
 * on the recede block — not a shadow, and not the forest coming back.
 *
 * FOREST IS NOW USED ONCE ON THE PAGE, at `Contact`. It is the closing plane
 * rather than a band spent twice. That is a real change to the page's colour
 * rhetoric and it is the change that was asked for, not a side effect.
 * ========================================================================== */

/**
 * A station is TEXT AND A NODE, and nothing else.
 *
 * Three things have stood on this rule and each was removed for the same
 * underlying reason — they answered a question the section was not asking.
 * Spar buoys asked the reader to learn a maritime convention first. A mascot
 * put a cartoon on the page's one set-piece. Photographs were dropped into the
 * mascot's slot at the mascot's size, which made them stamps and cropped away
 * the landscape sweep that was the only thing making them legible.
 *
 * The section's argument was never carried by the object on the line. It is
 * carried by the line: dashed while the work is provisional, solid once, at
 * station 03 and nowhere else. Everything added on top competed with it.
 *
 * A fourth thing was tried and removed on the same grounds: a field of drifting
 * plates in the empty half beside the heading. It did not stand on the rule,
 * but it was still a second object asking for the attention the rule needs, and
 * the motion it existed to carry belonged on the stations all along.
 */
type Station = {
  index: string
  name: string
  quote: string
  detail: string
}

/**
 * When each station arrives, as `animation-range` windows on the pinned
 * scene's timeline.
 *
 * `contain` is the period the runway covers the viewport, which is exactly the
 * period the sticky child is stuck — so these are positions WITHIN the hold.
 * The three windows are sequential and barely overlap, which is the point: the
 * reader watches a pilot appear, then it being built, then it running, one at
 * a time, instead of three things fading up together.
 *
 * They are stated here rather than derived from the shared `--stage` formula in
 * index.css because that formula hardcodes its own `calc()` and never reads the
 * `--scene-from` / `--scene-to` overrides the other parts honour — so a station
 * cannot be retimed through it. Keeping all three in one table also beats
 * leaving one station on a different mechanism than the other two.
 *
 * Nothing starts before `contain 6%`: at `contain 0%` the pin has only just
 * engaged, and an arrival that has already finished by the time you notice the
 * section has stopped moving is an arrival nobody saw.
 */
/* STATION 03 ARRIVES EARLIER NOW — 40–48% rather than 48–56% — and the road's
   committed half moved with it, from 56–86% to 48–78%.

   Moving one without the other would have broken the only rule this section has:
   station 03 IS the point the line commits, so it cannot land at a different
   moment than the solid half leaves it. The whole back end of the sequence
   shifted 8% earlier and kept its internal spacing — the 8% pause between the
   dashed half finishing and the solid half starting, which is where the crossing
   mark lands, is intact at 40→48.

   The reason is legibility rather than pacing: station 03 carries the longest
   caption in the section, and at 48% it was still arriving when the reader had
   already scrolled far enough to be leaving. */
const STEP_RANGE: [string, string][] = [
  ['contain 10%', 'contain 18%'],
  ['contain 27%', 'contain 35%'],
  ['contain 40%', 'contain 48%'],
]

const STATIONS: Station[] = [
  {
    index: '01',
    name: 'Pilot',
    quote: 'More than slick demos, more than another pilot.',
    detail: 'Unlit. Unmoored. Impressive, and marking nothing.',
  },
  {
    index: '02',
    name: 'Deployment',
    quote: 'Deployment inside real workflows, infrastructure that holds up.',
    detail: 'The route gets marked. The mark gets tethered to real data.',
  },
  {
    index: '03',
    name: 'Production',
    quote: 'Governance that earns trust, and change management that makes it stick.',
    detail: 'On station, in your water, running 24/7.',
  },
]
/* ========================================================================== *
 * THE STATIONS CLOSE IN.
 *
 * WHAT HAPPENS. The three station blocks do not fade up in place any more. They
 * begin scattered — offset, tilted a couple of degrees, slightly undersized —
 * drifting at three different rates, and each one straightens and slides onto
 * its place on the rule as the rule reaches it. Station 03 lands over the same
 * scroll range the line goes solid.
 *
 * WHY IT IS THE STATIONS AND NOT A FIELD OF CARDS. This started as a field of
 * floating plates beside the heading — four service names and two blanks, drawn
 * from the reference this motion came from, which is a landing-page loop of
 * little cards drifting around a logo. It was removed, and the removal is the
 * better version of the idea for a reason worth keeping:
 *
 *   A drifting card field is a SECOND thing on the page, competing with the
 *   three stations for the same attention, and it repeated content that already
 *   has a canonical home in `Pillars`. Moving the motion onto the stations
 *   themselves costs nothing, deletes a whole layer, and makes the convergence
 *   happen to the thing the section is actually about.
 *
 * That is also what stops it reading as a stock parallax field. The reference
 * drifts forever because it is decoration; here the drift RESOLVES, and the
 * resolution is the argument — a pilot is work that is impressive and not on
 * station, and production is when it stops wandering and takes its place. The
 * plates could never have said that. The stations say it by definition.
 *
 * IT IS ALSO THE FAIL-SAFE. Every part animates FROM the scatter TO the row, so
 * the finished state is the aligned one: a browser with no scroll timelines, and
 * any reader who asked for reduced motion, gets three tidy stations rather than
 * a heap that never got tidied. Reversing that would look identical while
 * scrolling and be broken everywhere else.
 *
 * NO OPACITY, ANYWHERE IN IT — and this is the constraint that shaped it. The
 * captions used to arrive on `land`, which fades from 0. That was legal only
 * because a FULLY transparent element is skipped by axe while a partly
 * transparent one is measured, and this exact section once failed the audit on
 * six contrast nodes and then thirteen when its copy was held at a third of its
 * ink. A scrubbed fade would put the captions at every partial opacity between
 * 0 and 1 as a function of scroll position, which is the failing case rather
 * than the exempt one. `converge` moves and rotates and never touches opacity,
 * so the captions are at full ink at every scroll position they exist at.
 * ========================================================================== */
type StationMotion = {
  /** Where it sits while adrift, relative to the place it settles into. */
  adrift: { x: string; y: string; rot: string; scale: string }
  /** The parallax. Three different pairs is the whole of the depth effect. */
  float: { from: string; to: string }
  /** When it closes in. Each lands just after the rule reaches its node. */
  converge: [string, string]
}

/**
 * The scatter is DOWNWARD and modest, and both of those are deliberate.
 *
 * Downward, because up is where the claim is and the fixed header is above
 * that. An earlier pass scattered a block 142px up and put it behind the nav.
 *
 * Modest — 70 to 120px, two to three degrees, no more than 12% of scale —
 * because these are paragraphs, not cards. A caption thrown 260px and tilted
 * seven degrees is a caption nobody reads while it is in flight, and the whole
 * point is that the reader watches the argument assemble rather than waits for
 * it to stop moving. The rotations are small enough that the text stays level
 * enough to read at every frame.
 *
 * Each window opens just after that station's node lands (see `STEP_RANGE`) so
 * the mark arrives first and the caption closes in on it, rather than the two
 * racing. Station 03's window is 66%–90%, which is the solid rule's own
 * 66%–88%: the line committing and the last station taking its place are one
 * event and must not read as two. Retune either and the other moves with it.
 */
const STATION_MOTION: StationMotion[] = [
  {
    adrift: { x: '-110px', y: '58px', rot: '-2deg', scale: '0.92' },
    float: { from: '34px', to: '-24px' },
    converge: ['contain 14%', 'contain 34%'],
  },
  {
    adrift: { x: '-130px', y: '70px', rot: '2deg', scale: '0.9' },
    float: { from: '52px', to: '-38px' },
    converge: ['contain 31%', 'contain 50%'],
  },
  {
    adrift: { x: '-150px', y: '82px', rot: '-1.5deg', scale: '0.94' },
    float: { from: '24px', to: '-16px' },
    converge: ['contain 58%', 'contain 80%'],
  },
]

/* ========================================================================== *
 * THE ROAD.
 *
 * The section's device is no longer a rule ruled across a flat plane. It is a
 * road climbing out of the bottom-left corner of a drawn landscape, dashed
 * while the work is provisional, going solid once — at the crossing, and
 * nowhere else — and running off the top-right corner of the frame. The three
 * stations stand ON it and arrive as it reaches them.
 *
 * WHY A DRAWING AND NOT A PHOTOGRAPH. `#backdrops` rendered seven options for
 * this, four of them over Norrin's own aerials, and this one won for reasons
 * that survive the choosing:
 *
 *   1. TYPE OVER A PHOTOGRAPH HAS NO MEASURABLE CONTRAST. It has whatever ratio
 *      that pixel happens to be. Every photographic option needed the claim to
 *      sit on an opaque panel to be checkable at all, and a panel over the
 *      picture is a third of the picture gone. This backdrop is two flat fills
 *      from the palette — `--surface` land, `--ground` water — so the heading
 *      sits on a known colour and the pair is already in `tools/palette.mjs`.
 *
 *   2. IT IS OURS, SO IT MAY BE STYLISED. The photography rule is absolute:
 *      Norrin's pictures are never filtered, tinted, duotoned or washed. A
 *      drawing has no such constraint — posterised flats, inked shorelines and
 *      a screentone field are all fair game precisely because nobody's
 *      photograph is being repainted to get them.
 *
 *   3. IT RE-THEMES ITSELF. Every colour in it is a custom property, so light
 *      and dark are one asset rather than two, and a palette change reaches it
 *      for free. A raster backdrop would be two files and a permanent liability
 *      the next time a token moves.
 *
 * `preserveAspectRatio="none"`, WHICH IS NORMALLY WRONG AND IS RIGHT HERE. The
 * stations are positioned as percentages of the same box this SVG fills, so
 * stretching the drawing to the box exactly is what guarantees a node stays ON
 * the road at every viewport. With `slice` the drawing would keep its angles
 * and crop instead, and the marks would drift off the line — which is the one
 * failure this composition cannot survive. The cost is that the shorelines
 * stretch with the box; they are organic curves with no true proportion to
 * lose, so nobody can tell.
 * ========================================================================== */

/**
 * Where the road runs, in the backdrop's own 1600x700 coordinates.
 *
 * Stated once, here, because three things have to agree about it: the two path
 * strings below, the crossing square, and the three station nodes. When they
 * disagree the marks float beside the line rather than on it, which reads as a
 * bug rather than as a composition.
 */
const ROAD = {
  /**
   * The provisional approach, out of the bottom-left corner.
   *
   * A CURVE, AND THE CURVATURE MEANS SOMETHING. Each of the three cubics below
   * is steeper than the one before it — roughly -0.22, then -0.33, then -0.57
   * of rise over run. The route does not climb at a constant rate; it starts
   * almost flat, which is what a pilot feels like, and steepens as the work
   * commits. A straight line said the three stations were evenly spaced steps,
   * which is the one thing this section exists to argue against.
   */
  dashed:
    'M0 578 C 90 572, 180 546, 260 520 C 390 484, 500 444, 620 400 C 760 348, 890 272, 990 190',
  /**
   * Committed, from the crossing out to a VISIBLE END.
   *
   * It used to run to `1470 -70` — off the top of the frame — so the committed
   * half was a line leaving the screen. That reads as "and it carries on
   * forever", which sounds like the right idea and is the wrong one here: the
   * section's claim is that the work REACHES production, and a route whose end
   * you never see has not arrived anywhere. It also meant the eye was pulled off
   * the composition at exactly the moment station 03 was asking to be read.
   *
   * It now leaves through the RIGHT EDGE at `1600 26`, not through the top.
   * That distinction is the whole point. A route that exits upward is climbing
   * out of the picture; a route that runs off the right-hand side is still
   * travelling in the direction the reader is reading, and it leaves the frame
   * where the eye is already going. It also keeps the line inside the
   * composition far longer, so the committed half reads as the longest stretch
   * of the journey rather than a short diagonal that vanishes.
   *
   * `26` IS NOT A ROUND NUMBER, IT IS THE EYEBROW'S LINE. Measured, `The
   * gap` sits at viewport y≈107 with the stage starting at 78 and running 872px
   * tall, which puts it at 23 in this 700-unit box. Landing the road within a
   * few units of that gives the composition a top edge two things agree on,
   * instead of a line stopping at an arbitrary height.
   *
   * THE CURVATURE IS THE OTHER HALF. Control points at `1150 92` and `1380 44`
   * hold the steep climb out of the crossing — the initial slope is about -0.61,
   * which continues the dashed half's final -0.57 rather than kinking away from
   * it — and then bend hard into an almost flat approach to the edge. An earlier
   * version flattened too soon and read as a straight line arriving from
   * nowhere; the arc is what makes it read as a route levelling off once it is
   * in production rather than a diagonal that happens to stop.
   */
  solid: 'M990 190 C 1150 92, 1380 44, 1600 26',
  /**
   * Percentages of the box, for the HTML marks that sit on the path.
   *
   * THE THIRD ONE IS THE CROSSING. There is no separate crossing mark, and the
   * first version of this drew one — a square at the dashed/solid junction AND
   * a station-03 node further up the road, which put two green squares on
   * screen and split the section's one moment into two events. Station 03 IS
   * where the line commits. That is the entire argument; it cannot be a
   * different point from the station that names it.
   *
   * These are read straight off the path's own end points, which is the only
   * way they stay on it: 260/1600 and 520/700 for the first, and so on. Change
   * a curve and these change with it or the marks float beside the road.
   */
  stations: [
    { left: '16.25%', top: '74.29%' },
    { left: '38.75%', top: '57.14%' },
    { left: '61.875%', top: '27.14%' },
  ],
} as const

/**
 * The landscape the road crosses.
 *
 * Four flats and one halftone, which is what makes it read as drawn rather than
 * rendered: no gradient, no blur, hard edges only. The screentone is a real SVG
 * pattern rather than a texture image, so it costs nothing to ship and takes
 * its colour from the same hairline token everything else here rules with.
 *
 * Density, not value, carries the depth — the near land mass is toned and the
 * far one is bare. That is how a cel does it, and it is also the only version
 * that works in both themes: a treatment built on VALUE would have to invert
 * between light and dark, and this one simply does not care.
 */
function CelLandscape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      className="absolute inset-0 -z-10 h-full w-full"
    >
      <defs>
        <pattern id="gap-tone" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2.2" cy="2.2" r="1.4" fill="var(--hairline-strong)" />
        </pattern>
      </defs>

      {/* ONE SHORE, NOT TWO, and the near one carries it.

          There was a far shore across the top as well. It is gone, and losing it
          is what fixes the thing that kept being wrong here: with land at both
          edges the composition had a lighter stripe above the heading AND a
          lighter mass below it, so whichever way the section was sized one of
          them ended up as a band of not-quite-ground rather than as a place. Two
          shores also meant two inked curves competing with the road, which is
          the one line in this section that is supposed to be followed.

          What is left reads as what it is: open water at the top, with the near
          shore rising into the bottom half of the frame. The road runs out from
          that shore across the water, which is the section's whole argument.

          THE NUMBERS ARE THE OLD NEAR SHORE SCALED 2.5x about y=700 — its own
          edge. Scaling rather than redrawing is deliberate. The shoreline's
          shape is what makes it read as a coast instead of a wave, and nudging
          control points by hand is exactly how that turns into a sine curve.

          The inked shoreline below carries the SAME curve as this fill's edge —
          the path data is duplicated, once as a fill and once as a stroke. Edit
          one without the other and the ink peels off the land, which is why they
          are kept a few lines apart and not in separate blocks. */}

      {/* The near shore, and the tone that puts it in front. */}
      <path
        d="M0 700 H1600 V580 C 1372 475, 1156 700, 936 610 S 590 325, 344 460 S 118 670, 0 565 Z"
        fill="var(--surface)"
      />
      <path
        d="M0 700 H1600 V580 C 1372 475, 1156 700, 936 610 S 590 325, 344 460 S 118 670, 0 565 Z"
        fill="url(#gap-tone)"
        opacity="0.65"
      />

      {/* Inked shorelines. `--hairline-strong` and not `--ink`: at 2px across a
          1500px viewport, ink is a black band through the middle of the page in
          light mode and the loudest thing on the screen. The strong hairline is
          the heaviest rule this system actually owns, and it is what every other
          edge on the page is drawn with. */}
      <g
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        stroke="var(--hairline-strong)"
      >
        <path d="M1600 580 C 1372 475, 1156 700, 936 610 S 590 325, 344 460 S 118 670, 0 565" />
      </g>
    </svg>
  )
}

/**
 * One half of the road, wiped on left to right as the scene advances.
 *
 * `uncover` RATHER THAN `rule`, and the difference matters. `rule` grows a box
 * with `scaleX`, which is correct for a straight horizontal hairline and wrong
 * for everything else — applied to a curve it would stretch the curve rather
 * than reveal it, and applied to a dashed path it would stretch the dashes too.
 * `uncover` animates `clip-path: inset()`, so the shape underneath is never
 * touched: the road is drawn at its true geometry and simply becomes visible
 * from the left. It is the same part the page already uses for wiped headings.
 *
 * Each half is its own SVG in its own wrapper because `clip-path` is what is
 * being animated, and two halves on different ranges need two clips.
 */
function RoadHalf({
  d,
  stroke,
  dashed,
  from,
  to,
}: {
  d: string
  stroke: string
  dashed?: boolean
  from: string
  to: string
}) {
  return (
    <div
      aria-hidden="true"
      data-scene-part="uncover"
      style={{ ['--scene-from' as string]: from, ['--scene-to' as string]: to }}
      className="absolute inset-0 -z-10"
    >
      <svg
        viewBox="0 0 1600 700"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="square"
          strokeDasharray={dashed ? '14 16' : undefined}
        />
      </svg>
    </div>
  )
}

/** A square standing on the road. Square, because the radius rule puts
    structure at zero — this is plane, not object. Two boxes for the same reason
    the crossing has always needed two: `scene-land` sets `transform` on its
    `from` frame, and an animation wins over a class-based transform on the same
    property rather than composing with it, so the centring translate cannot
    live on the element the animation drives. */
function RoadNode({
  at,
  solid,
  from,
  to,
}: {
  at: { left: string; top: string }
  solid?: boolean
  from: string
  to: string
}) {
  return (
    <span
      aria-hidden="true"
      className={
        'absolute z-10 -translate-x-1/2 -translate-y-1/2 ' +
        (solid ? 'h-3 w-3' : 'h-2 w-2')
      }
      style={{ left: at.left, top: at.top }}
    >
      <span
        data-scene-part="land"
        style={{ ['--scene-from' as string]: from, ['--scene-to' as string]: to }}
        className={'block h-full w-full ' + (solid ? 'bg-accent' : 'bg-inactive')}
      />
    </span>
  )
}

export function TheGap() {
  return (
    <section
      id="gap"
      data-shot="gap"
      data-deck-next
      aria-labelledby="gap-heading"
      // The plane came OFF this element and lives on the wrapper below, which
      // is the only reason seam 2 is safe. The wrapper is what translates away;
      // if the ground were painted only here, the band it vacates would be
      // backed by whatever is behind the section — and inside the deck, that is
      // the still-pinned hero. The hero's production line would slide back out
      // from underneath the departing block, which is a sentence no one should
      // have to read twice to know is wrong.
      //
      // The wrapper below therefore carries `bg-ground` to be OPAQUE rather
      // than to contrast. That distinction is new: when this was a forest band
      // the opacity came for free with the colour, and now it is the only
      // reason the class is there. An inherited background would let the pinned
      // hero read straight through.
      //
      // `data-tone="inverse"` is gone with the forest, and nothing here needs
      // it back: the attribute now only carries the inverse ink sets and the sun
      // focus ring, both of which belong to a dark plane, and this is paper. It
      // used to flip the navbar too — that observer is gone, and the bar paints
      // its own ground regardless of what it is passing over.
      //
      // `overflow-clip`, never `hidden`: hidden would make this a scrollport,
      // and a view() timeline measured inside a scroll container it is itself
      // inside freezes at 0% forever. It is also what contains the two plates
      // that scatter past the measure, so they break the frame without
      // introducing a horizontal scrollbar.
      className="relative overflow-clip bg-ground"
    >
      {/* SEAM 2 — the block that leaves. See `[data-scroll='recede']` in
          index.css for why the range is the tail rather than `exit 0%`, and
          why it is called recede. */}
      {/* THE BOTTOM PADDING IS ASYMMETRIC BETWEEN BREAKPOINTS, and that is the
          point rather than an oversight.

          Below `md` the closing line is a real block in normal flow at the foot
          of this section, so it needs room under it like any other paragraph —
          `pb-28`.

          At `md` and up it is not there. The closing line moved inside the
          pinned stage, so everything this section renders on desktop finishes
          at the runway's last frame and `pb-40` was 160px of padding after
          content that had already ended. Stacked against Roles' own 112px of
          `pt`, plus the stage's own unused tail below the closing line, it read
          as most of a viewport of nothing between two sections.

          `md:pb-12` closes the worst of it without collapsing the join. It is
          not zero on purpose: the two sections still need a boundary, and
          Roles' top padding alone would put the eyebrow hard against the
          drawing's lower shore. */}
      <div data-scroll="recede" className="relative bg-ground pt-16 pb-28 md:pt-14 md:pb-12">
        <Container>
          <div className="grid grid-cols-4 items-end gap-x-6 md:grid-cols-12">
            {/* Desktop drops this eyebrow, not just visually: below, the pinned
                scene grows its own copy that travels into the sticky composition
                with the heading. Keeping a second, purely decorative
                "The gap" sitting up here as well, permanently visible
                alongside the one in the pin, would print the same label twice on
                one screen — so this one steps aside with a plain `md:hidden`. It
                carries no id and nothing depends on it, so display:none costs
                nothing. */}
            <div className="col-span-4 md:col-span-12 md:hidden">
              <Eyebrow label="The gap" />
            </div>

            {/* The heading itself cannot be dismissed the same way. It is the
                section's one h2, `aria-labelledby="gap-heading"` on the
                `<section>` points at it by that id, and an id has to resolve to
                something a screen reader can actually use as a name at every
                width — not just the widths where it happens to be painted.

                Below `md` this renders exactly as it always has: Reveal-wrapped,
                in flow, above the vertical rail. At `md` and up the pinned scene
                takes over as the VISUAL home for this sentence (a plain
                `aria-hidden` echo of it lives inside the sticky child), so this
                instance only needs to keep working as the accessible one. The
                tempting move is `md:hidden`, matching the eyebrow above — but
                `display:none` doesn't just stop the paint, it prunes the element
                out of the accessibility tree, and `aria-labelledby` resolving
                against a hidden-by-`display:none` target is exactly the case
                some AT/browser pairings have historically gotten wrong.
                `sr-only` collapses to a clipped 1px box instead of removing the
                element, so the id keeps a real, always-present target to resolve
                against. */}
            <Reveal className="col-span-4 mt-8 md:col-span-6 md:mt-0" variant="left">
              <h2 id="gap-heading" className="thesis md:sr-only">
                {positioning.thesisOpening}
              </h2>
            </Reveal>
          </div>
        </Container>

        {/* ------------------------------------------------------------------ */}
        {/* Three stations, strung along one rule.                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-16 md:mt-0">
          {/* Desktop: horizontal, and pinned.

              This is the page's one set-piece: the three stations hold still
              in the viewport while the production line completes across them,
              then release. `data-scene` + `data-scene-runway` on this outer div
              declares the named view timeline over the runway; the sticky
              child below is what actually holds still, and `contain` — the
              period the runway spans the viewport — is exactly the period that
              child is stuck.

              THE STICKY OFFSET IS A `max()`, NOT A ROUND `svh`. Every earlier
              value here was tuned by centring the composition in one viewport
              height and it kept going wrong in the other direction as the
              composition changed underneath it — 16svh put the figures under
              the fixed header, 46svh pushed a caption below the fold once the
              heading moved into the pin, 20svh left the last line of station 01
              clearing the bottom of a 740px laptop by 33px while 91px of
              headroom sat unused above it.

              The two constraints are asymmetric, which is why one percentage
              cannot satisfy both. At the TOP the limit is absolute: the fixed
              header ends around 57px and anything above that is simply painted
              over, so the floor is a pixel value. At the BOTTOM the limit scales
              with the viewport. `max(88px, 12svh)` states exactly that — never
              tuck under the header, otherwise sit proportionally — and it was
              checked at 740, 800 and 950 rather than at one height.

              THE RUNWAY IS STILL 300svh AND THE FIELD DID NOT CHANGE THAT. The
              plates sit BESIDE the heading rather than under it, so the pinned
              composition is no taller than it was and every `contain` percentage
              in this file still means the same scroll distance it meant before.
              That was the constraint the field was designed against, not a happy
              accident: retiming the stations to make room for decoration would
              have been the decoration winning.

              `overflow-clip` up on the section (not `overflow-hidden`) is load
              -bearing here: `hidden` would create a scroll container, and a
              `view()` timeline measured against a scroll container it is itself
              inside freezes at 0% forever. Clip has already been confirmed not
              to. */}
          <div data-scene data-scene-runway className="hidden h-[300svh] md:block">
            <div
              data-scene-pin
              style={{ ['--gap-pin-top' as string]: 'max(78px, 8svh)' }}
              className="sticky top-(--gap-pin-top)"
            >
              {/* THE STAGE IS A FIXED BOX, and it has to be.
                  Everything in this composition is placed as a PERCENTAGE of
                  this box — the road in its own viewBox, the three station nodes
                  and the crossing in CSS — and percentages only agree with each
                  other if they are percentages of the same thing. A box that
                  sized itself to its content would move the road out from under
                  the marks standing on it.

                  IT FILLS THE SCREEN NOW, and the height is derived rather than
                  chosen. It was `clamp(560px, 70svh, 780px)` — a floor so the
                  drawing did not collapse into a band on a short laptop, and a
                  ceiling so it did not outrun the sticky offset above it. Both
                  were sound, and the result was still wrong to look at: the box
                  sat 12svh from the top and ran 70svh, so roughly 18svh of flat
                  ground was left showing underneath it. The landscape read as a
                  picture pasted onto the page instead of as the place the
                  section happens in.

                  `calc(100svh - var(--gap-pin-top))` runs the box from the pin's
                  own top edge to the bottom of the viewport exactly. There is no
                  ceiling to tune any more because the number is no longer a
                  guess — it is whatever is left of the screen. The floor is kept
                  as a `max()` for the short-viewport case the old clamp existed
                  to protect.

                  `--gap-pin-top` is declared once on the pin below and read
                  here, because these two numbers have to be the same number.
                  Writing `max(88px,12svh)` twice is how they drift apart.

                  `isolate` IS LOAD-BEARING, AND LEAVING IT OUT WAS A REAL BUG.
                  The landscape and both halves of the road are drawn at `-z-10`
                  so they sit under the type. A negative z-index child is only
                  contained by the nearest ancestor that establishes a STACKING
                  CONTEXT, and the only one here was the recede wrapper — which
                  establishes one solely because it carries a transform
                  animation. Under `prefers-reduced-motion` that animation is
                  switched off, the stacking context goes with it, and every
                  -z-10 layer drops behind the page: the entire backdrop and the
                  whole road disappeared, leaving three captions floating on
                  flat ground. Invisible in normal motion, total in reduced, and
                  only ever found by screenshotting the reduced-motion state.

                  `isolation: isolate` gives this box a stacking context of its
                  own that does not depend on anything animating, which is the
                  only version of this that cannot come apart. */}
              <div className="relative isolate h-[max(560px,calc(100svh-var(--gap-pin-top)))] overflow-clip">
                <CelLandscape />

                {/* The road, in two halves on two ranges. The dashed approach
                    lays itself out first and the committed half follows, so the
                    reader watches the route get built rather than finding it
                    already there.

                    They do not overlap in time. The gap between them — 40% to
                    48% — is where the crossing square lands, so the sequence
                    reads as: the provisional route arrives, it reaches a point,
                    THAT point is marked, and only then does anything solid leave
                    it. Collapsing the gap makes the mark look like a decoration
                    on a line that was always going to be solid. */}
                <RoadHalf
                  d={ROAD.dashed}
                  stroke="var(--inactive)"
                  dashed
                  from="contain 0%"
                  to="contain 40%"
                />
                <RoadHalf
                  d={ROAD.solid}
                  stroke="var(--accent)"
                  from="contain 48%"
                  to="contain 78%"
                />

                {/* The claim, top-left, over the water.
                    It sits where the road is LOW, which is the whole reason the
                    road climbs left-to-right: the drawing leaves its own top-
                    left corner empty for the type. Nothing here overlaps the
                    line at any width, so the heading never needs a panel behind
                    it — see the note on `CelLandscape` for why that mattered
                    enough to pick a drawing over a photograph.

                    `aria-hidden`, because this is a plain echo of the real
                    heading further up (which carries the id `aria-labelledby`
                    resolves against), and a screen reader meeting the same
                    sentence twice has been told nothing new.

                    THE EYEBROW KEEPS ITS LEAD-IN RULE HERE, WHICH REVERSES
                    WHAT THIS COMMENT USED TO SAY. It used to drop it, on the
                    grounds that at 10.5px beside a numeral and a slash the
                    hairline read as a dash — "— 01 / The gap" — and that over
                    a drawn backdrop one extra mark was one too many. The
                    numeral and the slash are gone (CLAUDE.md §3), the label is
                    12px `--ink`, and the rule is 20px of `--accent` rather
                    than a hairline. It does not read as punctuation any more,
                    and the last thing this section needs is an eyebrow that is
                    shaped differently from the seven others on the page. One
                    eyebrow, one shape, nothing to pass. */}
                {/* `pt-[3svh]`, AND THE UNIT CHANGE MATTERS MORE THAN THE
                    NUMBER. This was `pt-[10%]`, which was ~151px of dead space
                    above the eyebrow — but the real problem is that percentage
                    padding resolves against the containing block's WIDTH, not
                    its height. So it was 128px at 1280, 151px at 1512 and 192px
                    at 1920: the gap above the heading grew every time the window
                    got wider, for no reason anyone could name.

                    That was defensible while the stage was a width-ish fixed
                    box. It is not now — the stage is `100svh` minus the pin
                    offset, so its height is viewport-derived and the type inside
                    it should be measured the same way. `svh` makes the heading
                    sit at a constant fraction of the screen at every width. */}
                <Container className="relative pt-[3svh]">
                  <div aria-hidden="true" className="max-w-[30ch]">
                    <Eyebrow label="The gap" />
                    <h2 className="thesis mt-3">{positioning.thesisOpening}</h2>
                  </div>
                </Container>

                {/* THE THREE STATIONS, STANDING ON THE ROAD.
                    ---------------------------------------------------------
                    THEY ARE NOT INSIDE A `Container`, AND THAT WAS A REAL BUG
                    rather than a tidy-up. Every mark here is positioned as a
                    percentage, and the road it has to stand on is a percentage
                    of THIS box — the full-bleed stage. `Container` is capped at
                    1512px and centred with a gutter, so a station at `left: 15%`
                    inside one resolves against a different, narrower, offset box
                    than the road does. The two agree at no viewport width and
                    drift further apart the wider the screen gets: at 1917px the
                    marks sat about 140px right of the line they were supposed to
                    be standing on, which is what put the captions across the
                    road. Same box, same percentages, or the composition is a
                    coincidence that holds at one width.

                    Each caption hangs BELOW and to the right of its node. Below,
                    because the road climbs to the right and the space under it
                    is the only clear ground in the frame; to the right, because
                    the road is higher there, so every pixel further right buys
                    more clearance. */}
                {STATIONS.map((s, i) => (
                  <div key={s.name}>
                    <RoadNode
                      at={ROAD.stations[i]}
                      solid={i === 2}
                      from={STEP_RANGE[i][0]}
                      to={STEP_RANGE[i][1]}
                    />
                    {/* THREE NESTED BOXES, one property each, and the nesting
                        ORDER is load-bearing.

                          float     the parallax, across the whole hold
                          converge  the slide up the road, on this station's
                                    own window
                          uncover   the wipe that reveals it, same window

                        `uncover` is INNERMOST because it animates `clip-path`,
                        which clips an element in its own coordinate space. Put
                        it outside `converge` and the transform would move the
                        text out from under its own clip — visible where it
                        should be hidden, hidden where it should be visible.
                        Clipping the text and then moving the clipped result is
                        the order that composes.

                        `float` and `converge` are separate boxes because they
                        run over different ranges and one element can carry only
                        one `animation-range`.

                        THE WIPE IS WHY THESE ARRIVE ONE AT A TIME. Before it,
                        all three captions were on screen from the first frame of
                        the hold and merely slid about — the reader was handed
                        the whole argument at once and then watched it tidy
                        itself. Now each station is genuinely not there until the
                        road reaches it, which is what travelling a route is
                        like: you find the next thing when you get to it.

                        A WIPE AND NOT A FADE, and that is not a stylistic
                        preference. Scrubbing opacity would hold body copy at
                        every value between 0 and 1 as a function of scroll
                        position, and axe folds ancestor opacity into its
                        contrast maths — this section failed the audit exactly
                        that way once, on six nodes and then thirteen.
                        `clip-path` hides without touching a single colour: the
                        text is either absent or at full ink, never dim.

                        The scatter runs BACK DOWN THE ROAD. Every `adrift` is
                        negative in x and positive in y, which is the road's own
                        vector reversed, so a station that has not arrived yet is
                        further back along the route rather than floating off in
                        an arbitrary direction. */}
                    <div
                      data-scene-part="float"
                      style={{
                        left: ROAD.stations[i].left,
                        top: ROAD.stations[i].top,
                        ['--float-from' as string]: STATION_MOTION[i].float.from,
                        ['--float-to' as string]: STATION_MOTION[i].float.to,
                      }}
                      className="absolute w-[min(26ch,26vw)] translate-y-7 pl-6"
                    >
                      <div
                        data-scene-part="converge"
                        style={{
                          ['--adrift-x' as string]: STATION_MOTION[i].adrift.x,
                          ['--adrift-y' as string]: STATION_MOTION[i].adrift.y,
                          ['--adrift-rot' as string]: STATION_MOTION[i].adrift.rot,
                          ['--adrift-scale' as string]: STATION_MOTION[i].adrift.scale,
                          ['--scene-from' as string]: STATION_MOTION[i].converge[0],
                          ['--scene-to' as string]: STATION_MOTION[i].converge[1],
                        }}
                        // Scaling about the left edge, which is the side the
                        // node is on. About the centre, an arriving station
                        // would appear to grow away from its own mark.
                        className="origin-left"
                      >
                        <div
                          data-scene-part="uncover"
                          style={{
                            ['--scene-from' as string]: STATION_MOTION[i].converge[0],
                            ['--scene-to' as string]: STATION_MOTION[i].converge[1],
                          }}
                        >
                          <p className={i === 2 ? 'label text-accent' : 'label text-ink-2'}>
                            {s.index} {s.name}
                          </p>
                          <p className="body-serif mt-2 text-ink">{s.quote}</p>
                          <p className="caption mt-2 text-ink-3">{s.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* THE CLOSING LINE, AND IT IS THE LAST BEAT OF THE HOLD.
                    It used to sit under the whole section, alone on a line
                    below the diagram, which is where a sentence ends up when
                    nobody decided where it goes. It lives in the composition
                    now — in the open water right of station 02 and under
                    station 03, which was the one genuinely empty quarter of the
                    frame.

                    Aligned to station 03's own column rather than to the page
                    measure. It is the sentence that answers the three stations,
                    so it hangs off the last of them.

                    IT ARRIVES LAST, at 84%–96%, after the road has committed
                    and every station has landed. That gives the hold its full
                    sequence, in the order the argument is actually made: the
                    route, the three stations, then what we do about it. Wiped
                    rather than faded, for the same reason everything else here
                    is — a scrubbed fade holds body copy at every partial
                    opacity between 0 and 1, and axe folds ancestor opacity into
                    its contrast maths.

                    This is the ACCESSIBLE copy at this breakpoint. The one in
                    normal flow further down is `md:hidden`, so exactly one of
                    the two is ever in the accessibility tree. */}
                <div
                  data-scene-part="uncover"
                  style={{
                    ['--scene-from' as string]: 'contain 84%',
                    ['--scene-to' as string]: 'contain 96%',
                  }}
                  // Pushed out to 74%, and the width is capped in `vw` as well
                  // as in `ch` for a reason: at 26ch it cleared the gutter at
                  // 1512 and hung 14px past it at 1280, because a `ch` cap does
                  // not know how much room is left to its right. The `vw` half
                  // of the `min()` is what keeps the block inside the measure at
                  // the narrow end of the range.
                  className="absolute top-[72%] left-[74%] w-[min(26ch,22vw)]"
                >
                  <p className="lead text-ink-2">{positioning.thesisClose}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: the same single rule, turned vertical. Three marks side by
              side at phone width would be three unreadable smudges — and the
              desktop road above is the same diagram with more room, not a
              different one.

              IT IS SCROLL-DRIVEN NOW, AND IT TAKES `#proof`'s RAIL LANGUAGE.
              What was here was a finished picture: a static rule with three
              static marks, drawn complete before the reader reached it. The
              desktop composition is the section's argument HAPPENING — the
              route gets laid out, it reaches a point, that point is marked, and
              only then does anything solid leave it — and the majority
              breakpoint was getting a diagram of that instead. So the narrow
              branch adopts `#proof`'s three layers verbatim: a dim base that is
              always painted, a drawn line that travels down it, and a mark that
              arrives as the line reaches it. The segment ahead of the reader is
              dim; the segment behind is drawn.

              WHERE `#proof`'s REASONING STOPS APPLYING. That section refuses to
              animate its last segment because a bar that ran to the end of the
              rail would assert a public listing that has not happened — an §3
              honesty constraint about a FACT. Nothing here is a claim about the
              future. All three stations are work Norrin does, and the dash
              means "provisional", not "not yet". So this line does reach the
              end, and what changes at station 03 is its STATE. The two rails
              share a mechanism and mean different things by a dash; the full
              argument is in index.css under THE GAP'S NARROW RAIL.

              Each station owns the segment LEAVING it — `#proof`'s convention,
              and the only one that puts the dashed→solid flip on station 03's
              own mark rather than a row boundary away from it. That is the rule
              this section cannot get wrong: production is the crossing, and
              deployment is not.

              `data-scene` is on the <ol> rather than on a runway, because this
              branch is in normal flow — there is nothing to pin at 390px and
              nothing that would fit if there were. So the ranges are `cover`
              percentages of the rail's own passage through the viewport, not
              `contain` percentages of a hold. */}
          <Container className="md:hidden">
            <ol data-scene className="gap-rail">
              {STATIONS.map((s, i) => {
                /* One number per station, 20% apart, and everything below is
                   written as an offset from it so a station cannot be retimed
                   half-way. The mark lands first, then the line leaves it and
                   the caption uncovers on the same range — the line arrives and
                   the caption is what it delivers, rather than two events that
                   happen to overlap.

                   The last segment finishes at cover 74%. Measured on a 390x844
                   viewport that puts station 03 around 170px from the top of the
                   screen as its line completes — still being read, rather than
                   on its way out, which is the failure the desktop STEP_RANGE
                   note records for the same beat. */
                const at = 12 + i * 20

                return (
                  <li key={s.name} className="gap-rail-item">
                    {/* The rail hangs off the <li>, not off the gutter column.
                        A flex child only stretches to the row's CONTENT box, so
                        anchoring it there stopped every segment short by the
                        row's own padding-bottom — three disconnected stubs with
                        a gap the height of every mark. */}
                    <span
                      aria-hidden="true"
                      className="gap-rail-seg"
                      data-dash={i === 2 ? undefined : ''}
                    >
                      {/* A CLIP AND NOT A `scaleY`. Two of these three lines are
                          dashed, and scaling a box stretches the dash period
                          with it — the same reason `RoadHalf` above wipes the
                          desktop road rather than growing it. `uncover-v` is the
                          vertical twin of the wipe the rest of the page uses. */}
                      <span
                        data-scene-part="uncover-v"
                        style={{
                          ['--scene-from' as string]: `cover ${at + 6}%`,
                          ['--scene-to' as string]: `cover ${at + 22}%`,
                        }}
                        className="gap-rail-fill"
                      />
                    </span>

                    {/* The mark, on the same provisional/committed logic as the
                        desktop road: lichen for the two provisional stations,
                        solid accent and a size larger for the crossing.

                        `pop` fades from 0, which every other entrance in this
                        section is forbidden from doing. It qualifies on the
                        same grounds `#proof`'s node does and the captions do
                        not: it is `aria-hidden`, carries no text and has no
                        contrast requirement to fail. A mark that only slid
                        would be sitting on the rail before the rail got
                        there. */}
                    <span
                      aria-hidden="true"
                      data-scene-part="pop"
                      data-crossing={i === 2 ? '' : undefined}
                      style={{
                        ['--scene-from' as string]: `cover ${at}%`,
                        ['--scene-to' as string]: `cover ${at + 6}%`,
                      }}
                      className="gap-rail-node"
                    />

                    {/* THE COLUMN STAYS EMPTY AND KEEPS ITS WIDTH, and that is
                        deliberate rather than leftover. The rail is drawn at the
                        column's centre and the copy begins where the column
                        ends, so both the rail's position and the caption's
                        indent are measured against a width that must not change.
                        Collapsing it would move the rail off the marks and pull
                        every caption left. It is a spacer with a job. */}
                    <div aria-hidden="true" className="gap-rail-gutter" />

                    {/* Wiped, never faded — the constraint this whole section is
                        built around. A scrubbed opacity holds body copy at every
                        value between 0 and 1 as a function of scroll position,
                        and axe folds ancestor opacity into contrast; this
                        section failed the audit exactly that way once, on six
                        nodes and then thirteen. `clip-path` hides without
                        touching a colour, and when it does not run at all the
                        caption is simply there. */}
                    <div
                      className="gap-rail-copy"
                      data-scene-part="uncover"
                      style={{
                        ['--scene-from' as string]: `cover ${at + 6}%`,
                        ['--scene-to' as string]: `cover ${at + 18}%`,
                      }}
                    >
                      <p className={i === 2 ? 'label text-accent' : 'label text-ink-2'}>
                        {s.index} {s.name}
                      </p>
                      <p className="body-serif mt-3 text-ink">{s.quote}</p>
                      <p className="caption mt-2 text-ink-3">{s.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Container>
        </div>

        {/* The closing line, BELOW `md` ONLY.
            Its desktop home is inside the pinned stage — see the copy up there
            and the note beside it. Two copies in the markup, exactly one of
            them rendered at any width: `display:none` prunes an element from
            the accessibility tree as well as from the paint, so a screen reader
            meets this sentence once, not twice. Both read the same string from
            `positioning`, so they cannot drift apart. */}
        <Container className="md:hidden">
          <p className="lead measure-serif mt-14 text-ink-2">{positioning.thesisClose}</p>
        </Container>
      </div>
    </section>
  )
}
