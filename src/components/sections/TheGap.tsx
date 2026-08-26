import { Nori, type NoriPose } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'
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
 *   2. The isolated-danger mark (two cones point-to-point) is the topmark for
 *      the gap itself, so it anchors the section rather than sitting unused in
 *      the component's API.
 *
 * Copy discipline: the intro takes only the OPENING clause of Norrin's thesis
 * paragraph. Its remaining clauses become the three station captions, so no
 * sentence is printed twice in one viewport.
 */

type Station = {
  /**
   * The pose that stands on the line at this station. The buoy marks that used
   * to sit here are gone — three spar buoys and a puffin asked the reader to
   * read a maritime diagram before the argument landed, and the argument is
   * just "the line goes solid here". Nori carries the same three states with
   * no convention to learn: an idea, the same idea being built, the thing
   * running.
   */
  pose: NoriPose
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
const STEP_RANGE: [string, string][] = [
  ['contain 8%', 'contain 22%'],
  ['contain 38%', 'contain 52%'],
  ['contain 70%', 'contain 84%'],
]

/**
 * The dashed run, drawn in three segments — one per station — each landing
 * just before the station it leads to. The line lays itself out ahead of the
 * reader rather than waiting for them.
 */
const DASH_RANGE: [string, string][] = [
  ['contain 0%', 'contain 12%'],
  ['contain 26%', 'contain 40%'],
  ['contain 54%', 'contain 66%'],
]

const STATIONS: Station[] = [
  {
    pose: 'idea',
    index: '01',
    name: 'Pilot',
    quote: 'More than slick demos, more than another pilot.',
    detail: 'Unlit. Unmoored. Impressive, and marking nothing.',
  },
  {
    pose: 'laptop',
    index: '02',
    name: 'Deployment',
    quote: 'Deployment inside real workflows, infrastructure that holds up.',
    detail: 'The route gets marked. The mark gets tethered to real data.',
  },
  {
    pose: 'rocket',
    index: '03',
    name: 'Production',
    quote: 'Governance that earns trust, and change management that makes it stick.',
    detail: 'On station, in your water, running 24/7.',
  },
]

export function TheGap() {
  return (
    <section
      id="gap"
      data-tone="inverse"
      data-shot="gap"
      aria-labelledby="gap-heading"
      className="relative overflow-clip bg-inverse py-28 text-inverse-ink md:py-40"
    >
      <Container>
        <div className="grid grid-cols-4 items-end gap-x-6 md:grid-cols-12">
          {/* Desktop drops this eyebrow, not just visually: below, the pinned
              scene grows its own copy that travels into the sticky composition
              with the heading (see the runway comment further down for why the
              heading has to move at all). Keeping a second, purely decorative
              "01 — The gap" sitting up here as well, permanently visible
              alongside the one in the pin, would print the same label twice on
              one screen — so this one steps aside with a plain `md:hidden`. It
              carries no id and nothing depends on it, so display:none costs
              nothing. */}
          <div className="col-span-4 md:col-span-12 md:hidden">
            <Eyebrow index="01" label="The gap" tone="inverse" />
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
              some AT/browser pairings have historically gotten wrong. `sr-only`
              (already in src/index.css, already used this way by Hero's
              `<p className="sr-only">`) collapses to a clipped 1px box instead
              of removing the element, so the id keeps a real, always-present
              target to resolve against. `md:sr-only` applies that only at the
              breakpoint where the pinned echo takes over the visible copy. */}
          <Reveal className="col-span-4 mt-8 md:col-span-6 md:mt-12" variant="left">
            <h2 id="gap-heading" className="thesis md:sr-only">
              {positioning.thesisOpening}
            </h2>
          </Reveal>

          {/* The isolated-danger aside used to sit here: a lone cone mark and a
              sentence of IALA buoyage — "two cones point-to-point mark a hazard
              with open water all round it". It is gone.

              It asked the reader to learn a maritime convention BEFORE the
              metaphor could pay off, which is the wrong order and more work
              than any decorative device is worth. A device that needs a
              footnote is a device that is not working. The three stations below
              make the same argument without teaching anything: unlit and
              drifting, then marked, then on station — and the rule under them
              going solid is the moment being described. */}
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* Three stations, strung along one rule.                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-16 md:mt-32">
        {/* Desktop: horizontal, and pinned.

            This is the page's one set-piece: the three stations hold still
            in the viewport while the production line completes across them,
            then release. `data-scene` + `data-scene-runway` on this outer div
            declares the named view timeline over the runway; the sticky
            child below is what actually holds still, and `contain` — the
            period the runway spans the viewport — is exactly the period that
            child is stuck.

            180svh, not the 240svh an earlier pass used. That pass measured a
            genuine problem — a shorter runway did make the rule's draw and
            the captions' stagger blur into one quick flash — but it measured
            it BEFORE the heading moved into the pin below. With the claim
            now part of the held composition, holding it for 240svh's worth
            of scroll read as a stall rather than a beat once the heading
            stopped being the thing missing and started being the thing the
            reader had already finished reading: the screenshot at the old
            height showed a fully-formed, fully-read composition sitting
            static for most of a screen and a half more of scroll before the
            rule so much as started. 180svh keeps the same percentage-based
            choreography (nothing below is measured in absolute scroll
            distance, only in `contain`/`entry` percentages of the runway, so
            shortening it changes pacing, not timing) while giving the hold a
            length that matches how much is actually happening during it.

            THE STICKY OFFSET IS A `max()`, NOT A ROUND `svh`. Every
            earlier value here was tuned by centring the composition in one
            viewport height and it kept going wrong in the other direction as
            the composition changed underneath it — 16svh put the figures under
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

            `overflow-clip` up on the section (not `overflow-hidden`) is load
            -bearing here: `hidden` would create a scroll container, and a
            `view()` timeline measured against a scroll container it is
            itself inside freezes at 0% forever. Clip has already been
            confirmed not to. */}
        <div data-scene data-scene-runway className="hidden h-[300svh] md:block">
          <div data-scene-pin className="sticky top-[max(88px,12svh)]">
            <Container>
              {/* The claim, brought inside the hold.

                  Before this existed, engaging the pin meant the heading —
                  "Real impact takes more than frontier models." — had already
                  scrolled off above the fixed header, and the reader spent the
                  entire hold looking at three buoys and three captions with no
                  claim left on screen for them to be evidence FOR. A pinned
                  scene exists to hold a claim and its proof together while the
                  proof completes; holding only the proof argues nothing.

                  This is a plain, unanimated echo of the real heading further
                  up the page (see the `md:sr-only` comment on that one for why
                  IT still carries the id and this one does not) — `aria-hidden`
                  because a screen reader encountering the same sentence twice,
                  once as the accessible heading and again as inert decoration
                  three DOM nodes later, has been told nothing new. It is not a
                  `[data-scene-part]`: nothing here needs to animate in, since
                  it is present the instant the runway scrolls this box into
                  place — same as the buoy marks below it, which do not fade in
                  either. It only needs to still be there once the pin engages,
                  which a static element manages for free. No `Reveal` either:
                  `Reveal` drives its own transform/opacity, and stacking that
                  on top of a `sticky` ancestor's paint is the kind of
                  interaction worth avoiding rather than debugging. */}
              {/* THE GAP UNDER THIS BLOCK IS THE FIGURE'S OWN PROTRUSION,
                  NOT A ROUND NUMBER. It was `mb-10` once, and the screenshot
                  showed "frontier models." with a buoy mast drawn straight
                  through it.

                  Whatever stands on the line stands ON it, which means it
                  paints upward from the rule by `NORI_ANCHOR.stand` — 84.72% —
                  of its own width. A fixed margin cannot know that, and one
                  that clears it at 1512px over-clears it at 900px where the
                  clamp has shrunk the figure.

                  So the clearance is stated in `--mark`, the same variable the
                  figures are sized from, and the two cannot drift apart. */}
              <div
                aria-hidden="true"
                className="mb-[calc(clamp(84px,8.5vw,132px)*0.85+34px)] max-w-[38ch]"
              >
                <Eyebrow index="01" label="The gap" tone="inverse" />
                <h2 className="thesis mt-3">{positioning.thesisOpening}</h2>
              </div>

              {/* No `data-scroll="drift"` here any more: that was an in-flow
                  parallax nudge, and this `<ol>` is now the pinned scene's
                  sticky content — a drift layered on top of a pin is two
                  scroll-driven effects arguing about the same element's
                  position, and the pin has to win unopposed. */}
              {/* `--mark` is the mascot's width, declared once here because
                  TWO things depend on it: the figures standing on the line
                  below, and the heading's clearance above. Left as separate
                  numbers they drift apart, and the way that failure shows up is
                  a buoy mast drawn through the word "models" — which is exactly
                  what happened when the clearance was a round `mb-10`. */}
              <ol
                className="grid grid-cols-3"
                style={{ ['--mark' as string]: 'clamp(84px,8.5vw,132px)' }}
              >
                {STATIONS.map((s, i) => (
                  <li key={s.name} className="relative">
                    {/* THE WHOLE LINE DRAWS, not just the solid half. The
                        dashed run used to sit finished from the first frame and
                        only the production half grew, which read as the line
                        having always been there and something being added to
                        the end of it. Now it lays itself out segment by segment
                        as the reader scrolls — dashed to the crossing, then
                        solid past it — so the rule arrives WITH the stations it
                        strings together.

                        The dashed segments never turn solid. That distinction
                        is the section's entire argument: what is provisional
                        stays provisional, and the state change happens once, at
                        station 03. Drawing them is not the same as promoting
                        them. */}
                    {i < 2 ? (
                      <span
                        aria-hidden="true"
                        data-scene-part="rule"
                        style={{
                          ['--scene-from' as string]: DASH_RANGE[i][0],
                          ['--scene-to' as string]: DASH_RANGE[i][1],
                        }}
                        className={
                          (i === 0 ? 'left-[-50vw]' : 'left-0') +
                          ' absolute top-0 right-0 border-t border-dashed border-inverse-inactive'
                        }
                      />
                    ) : (
                      <>
                        <span
                          aria-hidden="true"
                          data-scene-part="rule"
                          style={{
                            ['--scene-from' as string]: DASH_RANGE[2][0],
                            ['--scene-to' as string]: DASH_RANGE[2][1],
                          }}
                          className="absolute top-0 right-1/2 left-0 border-t border-dashed border-inverse-inactive"
                        />
                        {/* The solid half draws itself left-to-right as the
                            scene advances rather than sitting finished from
                            the first frame — the line completing is the one
                            moment this whole section exists to show, so it
                            has to be something the reader watches happen.
                            `[data-scene-part='rule']` supplies its own
                            `transform-origin: left center`, which matches
                            this element's existing anchor at `left-1/2`, so
                            unlike the two marks below it needs no wrapper:
                            there is no other transform on it to lose. Range
                            is 12%–65% of the scene, not the default 0–100%:
                            starting at 12% gives the pin a beat to settle
                            before anything moves, and finishing at 65%
                            leaves the reader time to register the line as
                            *complete* before the section releases, rather
                            than watching it still creeping at the last
                            frame. */}
                        <span
                          aria-hidden="true"
                          data-scene-part="rule"
                          style={{
                            ['--scene-from' as string]: 'contain 66%',
                            ['--scene-to' as string]: 'contain 88%',
                          }}
                          className="absolute top-0 right-[-50vw] left-1/2 h-px bg-signal/80"
                        />
                        {/* The crossing. One of the page's three solid uses of sun.

                            Two boxes, not one. `scene-land`'s keyframes set
                            `transform` on `from`, and an animation always
                            wins over a class-based transform on the same
                            property rather than composing with it — so the
                            static `-translate-x-1/2 -translate-y-1/2` that
                            centres this mark on the rule cannot live on the
                            same element the animation drives. The outer span
                            keeps the position and that centring translate;
                            the inner span is a plain block that owns only
                            size, colour and `data-scene-part`, with no
                            transform of its own for the animation to
                            clobber. It lands early (18%–30%) because this
                            square sits at the rule's own origin — the line
                            reaches it almost the instant it starts drawing. */}
                        <span
                          aria-hidden="true"
                          className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2"
                        >
                          <span
                            data-scene-part="land"
                            style={{
                              ['--scene-from' as string]: 'contain 64%',
                              ['--scene-to' as string]: 'contain 72%',
                            }}
                            className="block h-full w-full bg-signal"
                          />
                        </span>
                                              </>
                    )}

                    {/* Nori stands ON the line, where the buoy used to float in
                        it. Two boxes, not one, and the split is load-bearing:
                        the OUTER box carries the placement — centre it on the
                        station and lift it by `NORI_ANCHOR.stand`, the measured
                        height of the drawing's painted sole, so the feet land
                        on the rule instead of the box's bottom edge hovering
                        above it — and the INNER box carries the arrival. An
                        animation replaces a transform outright rather than
                        composing with it, so a `scene-part` on the outer box
                        would erase the placement the moment it started and drop
                        the figure to the caption.

                        Width comes from `--mark` on the list rather than from
                        `size`, because the heading's clearance above is derived
                        from the same variable — the two cannot drift apart. The
                        `size` prop is left large and the image's own
                        `max-width: 100%` brings it down. */}
                    <div className="relative h-0">
                      <div
                        className="absolute top-0 left-1/2 w-[var(--mark)]"
                        style={{
                          transform:
                            'translateX(-50%) translateY(calc(-1 * ' + NORI_ANCHOR.stand.y + '))',
                        }}
                      >
                        {/* `flex` is load-bearing, not layout habit. <Nori>
                            renders an inline-block, so a plain block wrapper
                            adds the line box's descender underneath it — and
                            the lift above is a PERCENTAGE, which resolves
                            against this box's height. Six phantom pixels of
                            descender put the feet 7px above the line, measured.
                            A flex box has no line box and no descender. */}
                        <div
                          data-scene-part="land"
                          className="flex"
                          style={{
                            ['--scene-from' as string]: STEP_RANGE[i][0],
                            ['--scene-to' as string]: STEP_RANGE[i][1],
                          }}
                        >
                          <Nori pose={s.pose} size={220} animated={false} />
                        </div>
                      </div>
                    </div>

                    {/* The caption arrives WITH its own mascot, on the same
                        window, so a station reads as one thing appearing rather
                        than a figure and then some text. `land` fades from 0
                        rather than from a dim value on purpose: axe skips a
                        fully transparent element but measures a partly
                        transparent one, and body copy held at a third of its
                        ink fails contrast — which is exactly how the previous
                        version of this section broke the audit.

                        `pt-` only has to clear the rule now, not a buoy's
                        submerged half, so it is a flat number again. */}
                    <div
                      data-scene-part="land"
                      style={{
                        ['--scene-from' as string]: STEP_RANGE[i][0],
                        ['--scene-to' as string]: STEP_RANGE[i][1],
                      }}
                      className="px-4 pt-11 text-center lg:px-10"
                    >
                      <p className={i === 2 ? 'label text-signal' : 'label text-inverse-ink-3'}>
                        {s.index} — {s.name}
                      </p>
                      <p className="body-serif mx-auto mt-4 max-w-[34ch] text-inverse-ink">
                        {s.quote}
                      </p>
                      <p className="caption mx-auto mt-3 max-w-[32ch] text-inverse-ink-3">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Container>
          </div>
        </div>

        {/* Mobile: the same single rule, turned vertical. Three marks side by
            side at phone width would be three unreadable smudges.

            Each station owns TWO segments — above its waterline and below it —
            so consecutive rows abut and the rail is continuous from station 01
            down. The state changes at station 03's waterline, on the mark, with
            the same crossing square the desktop rail has.

            This previously ran `top-9 bottom-0` inside each `<li>`, which left a
            gap the height of every mark: three disconnected stubs, no visible
            dashed→solid junction and no crossing — the majority breakpoint lost
            the one moment the section exists to show, while the comment here
            claimed the opposite. */}
        <Container className="md:hidden">
          <ol className="relative">
            {STATIONS.map((s, i) => (
              <li key={s.name} className="relative flex gap-6 pb-14 last:pb-16">
                {/* The rail hangs off the <li>, not off the icon column.
                    A flex child only stretches to the row's CONTENT box, so
                    anchoring it there stopped every segment short by the row's
                    own padding-bottom — which is exactly the gap that made this
                    read as three stubs. On the <li>, `bottom-0` reaches the
                    padding edge, so consecutive rows abut and the rail is one
                    line. The icon column is w-14, so its centre is left-7. */}
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-7 h-9 w-0 -translate-x-1/2 border-l border-dashed border-inverse-inactive"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={
                    'absolute top-9 bottom-0 left-7 -translate-x-1/2 ' +
                    (i === 2
                      ? 'w-px bg-signal/80'
                      : 'w-0 border-l border-dashed border-inverse-inactive')
                  }
                />
                {i === 2 ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-9 left-7 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-signal"
                    />
                  </>
                ) : null}

                {/* The column stays `w-14`. The vertical rail is drawn at
                    `left-7` — its centre — and every offset in this branch is
                    measured against that, so swapping the mark for a mascot is
                    not a reason to move it. */}
                <div className="relative flex w-14 shrink-0 justify-center">
                  <div className="w-14">
                    <Nori pose={s.pose} size={56} animated={false} />
                  </div>
                </div>
                <div className="pt-1">
                  <p className={i === 2 ? 'label text-signal' : 'label text-inverse-ink-3'}>
                    {s.index} — {s.name}
                  </p>
                  <p className="body-serif mt-3 text-inverse-ink">{s.quote}</p>
                  <p className="caption mt-2 text-inverse-ink-3">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </div>

      <Container>
        <p className="lead measure-serif mt-14 text-inverse-ink-2 md:mt-16">
          {positioning.thesisClose}
        </p>
      </Container>
    </section>
  )
}
