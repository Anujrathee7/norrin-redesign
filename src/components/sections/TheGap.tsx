import { Fyr, type FyrState } from '@/components/mascot/Fyr'
import { Lunni } from '@/components/mascot/Lunni'
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
  state: FyrState
  index: string
  name: string
  quote: string
  detail: string
}

/**
 * Explicit `animation-range` for each station's caption, replacing the shared
 * `calc(var(--stage) * 18%)` formula from src/index.css for these three
 * instances specifically.
 *
 * That formula gives station 0 the window `contain 0%`–`36%` — which means at
 * the instant the pin engages (`contain 0%`), station 0's `scene-stage`
 * animation is sitting at its own `from` keyframe: opacity 0.3, translated
 * down 30px. On this dark forest ground that is not a subtle entrance, it is
 * a grey smudge, and it is the FIRST thing the reader is supposed to read.
 * The 0.3 floor in the keyframes exists so scrubbing scroll never shows
 * text that has fully vanished; it was never meant to be the resting value
 * at the one moment that matters most, and the keyframes are CSS — off
 * limits here — so the fix has to be a different range, not a different
 * floor.
 *
 * The obvious lever, `--scene-from` / `--scene-to`, does not reach this rule:
 * unlike `rule` and `land`, `[data-scene-part='stage']` in src/index.css
 * hardcodes its `animation-range` from `--stage` and never consults those two
 * custom properties. So this sets `animationRange` itself inline — the actual
 * shorthand, not the custom-property indirection — which an inline style
 * always wins over a class rule for regardless of what that rule's value is
 * built from.
 *
 * Station 0 finishes arriving during `entry`, the phase before the pin locks
 * (`entry 100%` is the same instant as `contain 0%`), so by the time the
 * scene holds, its caption is already sitting at the finished keyframe:
 * opacity 1, no offset. Stations 1 and 2 keep the original two windows
 * unchanged (`18%–54%`, `36%–72%`) — arriving progressively during the hold
 * is the effect this scene exists to sell, and both windows already sit
 * inside the rule's own 12%–65% draw.
 */
const STAGE_RANGE: [string, string][] = [
  ['entry 55%', 'entry 100%'],
  ['contain 18%', 'contain 54%'],
  ['contain 36%', 'contain 72%'],
]

const STATIONS: Station[] = [
  {
    state: 'pilot',
    index: '01',
    name: 'Pilot',
    quote: 'More than slick demos, more than another pilot.',
    detail: 'Unlit. Unmoored. Impressive, and marking nothing.',
  },
  {
    state: 'deploying',
    index: '02',
    name: 'Deployment',
    quote: 'Deployment inside real workflows, infrastructure that holds up.',
    detail: 'The route gets marked. The mark gets tethered to real data.',
  },
  {
    state: 'production',
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

            `top-[27svh]`, not the 46svh an earlier pass used. That number
            was chosen to centre the OLD composition — buoys and captions
            only, no heading — in the space below the fixed header, and it
            did that correctly for that composition. Adding the heading
            above the stations made the composition roughly twice as tall,
            and simply keeping the same top offset pushed the extra height
            straight off the bottom of the viewport: a screenshot at 46svh
            with the heading in place showed station 02's caption painting
            past `y=950` in a 950px-tall viewport, invisible below the fold
            for the entire time it sat at its pre-arrival dim state. 27svh
            re-centres the TALLER composition the same way 46svh centred the
            shorter one — measured again against the actual content height,
            not carried over from before the content changed. It still
            clears the header with room to spare (see the mark-translation
            note below for why that clearance has to be checked by measuring
            paint, not by reading the offset number) and now leaves the
            bottom of the composition inside the viewport too, including the
            few pixels a not-yet-arrived caption's `translateY(30px)`
            pre-animation state paints below its resting position.

            `top-[27svh]` is not a typo for a smaller number: a first pass at
            `top-[16svh]` put the sticky frame right under the site header,
            and a screenshot caught the actual bug that finding by reading
            the code would have missed — Fyr's mark is lifted out of flow and
            translated *up* over its rail (`-translate-y-[60.83%]` etc.), so
            its top edge painted well above the pinned box's own top and
            landed under the fixed header, which sits later in paint order
            and simply covered it. 27svh (177px in the 950px viewport this
            was measured against) clears the header (which ends around 73px)
            with a comfortable margin, same as 46svh did before the heading
            made the composition taller.

            `overflow-clip` up on the section (not `overflow-hidden`) is load
            -bearing here: `hidden` would create a scroll container, and a
            `view()` timeline measured against a scroll container it is
            itself inside freezes at 0% forever. Clip has already been
            confirmed not to. */}
        <div data-scene data-scene-runway className="hidden h-[180svh] md:block">
          <div data-scene-pin className="sticky top-[20svh]">
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
              {/* THE GAP UNDER THIS BLOCK IS THE MARK'S OWN PROTRUSION, NOT A
                  ROUND NUMBER. It was `mb-10` / `lg:mb-12` — 40 and 48px — and
                  the screenshot showed "frontier models." with a buoy mast
                  drawn straight through it.

                  The marks are lifted out of a zero-height rail and translated
                  UP by 60.83%, so at `clamp(120px,13vw,190px)` wide they paint
                  as much as ~116px ABOVE the <ol>'s own top edge. A fixed
                  margin cannot know that, and any fixed margin that clears it
                  at 1512px over-clears it at 900px where the clamp has shrunk
                  the mark.

                  So the gap is expressed in the mark's own terms, the same way
                  the caption padding below the rail already is
                  (`pt-[calc(clamp(...)*0.52)]` — that one clears the mark's
                  SUBMERGED half). The two now scale together and neither can
                  drift out of agreement with the drawing. */}
              <div
                aria-hidden="true"
                className="mb-[calc(clamp(120px,13vw,190px)*0.61+30px)] max-w-[38ch]"
              >
                <Eyebrow index="01" label="The gap" tone="inverse" />
                <h2 className="thesis mt-3">{positioning.thesisOpening}</h2>
              </div>

              {/* No `data-scroll="drift"` here any more: that was an in-flow
                  parallax nudge, and this `<ol>` is now the pinned scene's
                  sticky content — a drift layered on top of a pin is two
                  scroll-driven effects arguing about the same element's
                  position, and the pin has to win unopposed. */}
              <ol className="grid grid-cols-3">
                {STATIONS.map((s, i) => (
                  <li key={s.name} className="relative">
                    {i < 2 ? (
                      <span
                        aria-hidden="true"
                        className={
                          (i === 0 ? 'left-[-50vw]' : 'left-0') +
                          ' absolute top-0 right-0 border-t border-dashed border-inverse-inactive'
                        }
                      />
                    ) : (
                      <>
                        <span
                          aria-hidden="true"
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
                            ['--scene-from' as string]: 'contain 12%',
                            ['--scene-to' as string]: 'contain 65%',
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
                              ['--scene-from' as string]: 'contain 18%',
                              ['--scene-to' as string]: 'contain 30%',
                            }}
                            className="block h-full w-full bg-signal"
                          />
                        </span>
                        {/* Lunni lands on the solid half, never on the dashed one.
                            A sea bird settles on a mark that is on station; there
                            is nothing to land on at a pilot floating free. The
                            argument the whole section makes, made once more by an
                            animal deciding the line is safe.

                            Same two-box problem as the crossing square, except
                            Lunni itself can't be the inner box even in
                            principle: it renders a bare `<svg>` with no prop
                            for forwarding `data-scene-part` through, and its
                            className already carried `-translate-y-[86%]` to
                            lift it onto the line — exactly the transform
                            `scene-land` would otherwise erase. So that
                            translate moved to an outer span alongside the
                            position, Lunni dropped its className entirely,
                            and a plain inner span between the two is what
                            actually animates. Puffin sits at `left-[63%]`,
                            past the crossing at `left-1/2`, so its range
                            (28%–42%) starts and ends a beat after the
                            crossing's: the line reaches the bird slightly
                            later than it reaches the crossing. */}
                        <span aria-hidden="true" className="absolute top-0 left-[63%] -translate-y-[86%]">
                          <span
                            data-scene-part="land"
                            style={{
                              ['--scene-from' as string]: 'contain 28%',
                              ['--scene-to' as string]: 'contain 42%',
                            }}
                            className="block"
                          >
                            <Lunni
                              size={58}
                              variant="standing"
                              facing="right"
                              title="A puffin resting on the production line"
                            />
                          </span>
                        </span>
                      </>
                    )}

                    {/* Zero-height rail: the mark is lifted out of flow so the
                        caption sits under the rule, not under the mark's box. */}
                    <div className="relative flex h-0 justify-center">
                      <div className="absolute top-0 w-[clamp(120px,13vw,190px)] -translate-y-[60.83%] text-inverse-ink">
                        <Fyr size={190} state={s.state} className="h-auto w-full" showWater={false} />
                      </div>
                    </div>

                    {/* Clears the mark's submerged 39.17%, plus breathing room.

                        `data-scene-part="stage"` advances the three captions
                        as one gesture. Timing is no longer the shared
                        `--stage`-driven formula from src/index.css — see the
                        `STAGE_RANGE` comment above for why station 0 needed an
                        explicit `entry`-phase window instead of the default,
                        and stations 1–2 are set explicitly alongside it for
                        the same reason rather than leaving one station on a
                        different mechanism than the other two. All three
                        windows still sit inside the rule's own 12%–65% draw,
                        so the captions are always advancing alongside the
                        line, never ahead of or trailing behind it into dead
                        scroll space. */}
                    <div
                      data-scene-part="stage"
                      style={{ animationRange: STAGE_RANGE[i].join(' ') }}
                      className="px-4 pt-[calc(clamp(120px,13vw,190px)*0.52)] text-center lg:px-10"
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
                    {/* Same rule as desktop: the bird settles on the solid half,
                        below the crossing, never on the dashed run above it.
                        Mobile is the majority breakpoint — it should not be the
                        one that loses the idea. */}
                    <Lunni
                      size={44}
                      className="absolute top-[4.75rem] left-7 -translate-x-1/2"
                      title="A puffin resting on the production line"
                    />
                  </>
                ) : null}

                <div className="relative flex w-14 shrink-0 justify-center">
                  <div className="relative w-14 text-inverse-ink">
                    <Fyr size={56} state={s.state} className="h-auto w-full" showWater={false} />
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
