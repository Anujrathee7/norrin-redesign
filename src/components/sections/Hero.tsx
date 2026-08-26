import { useEffect, useRef } from 'react'

import { Container, Eyebrow, Grid } from '@/components/primitives/Layout'
import { metrics, offices, positioning, story } from '@/data/norrin'
import { Nori } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'
import { Line } from '@/components/primitives/SplitLines'
import { Reveal } from '@/components/primitives/Reveal'
import { Counter } from '@/components/primitives/Counter'

/**
 * Hero.
 *
 * The composition is one idea: a horizon. Everything the visitor reads sits
 * above the waterline, and the waterline itself is the site's central device —
 * dashed to the left of the mark (pilot: provisional, unfinished) and solid to
 * the right (production: committed, load-bearing). Nori sits exactly on the
 * crossing, which is the whole argument in one object.
 *
 * The rule is assembled as a flex row rather than an absolutely-positioned
 * overlay, so the dashed→solid transition lands precisely on the mark's centre
 * at every viewport width with no magic numbers and no measurement in JS.
 *
 * Deliberately NOT: a big headline over a small paragraph over a button over a
 * stock photo. The mark is not an illustration parked beside the text — it is
 * the terminus of the rule that organises the page.
 */
/**
 * The station log — every figure derived, none transcribed.
 *
 * This used to be four hand-typed strings, while a four-across metric row one
 * viewport below rendered the same `metrics` array. Two of the four figures were
 * therefore printed twice within thirty seconds of each other. The row is gone
 * and the log now reads the source directly, so there is exactly one place a
 * number can be wrong — and a station log is a more distinctive container for
 * them than a stat strip is.
 */
/**
 * `num` marks the rows that are a QUANTITY and can therefore count up.
 *
 * "On station since" is deliberately not one of them: 2012 is a date, and
 * counting a date up from zero races through eleven centuries to say nothing.
 * Offices is a composite string, so it stays put too. Four rows animate, two
 * do not, and the difference is the point rather than an oversight.
 */
type StationRow = { term: string; value: string; num?: number; suffix?: string }

const STATION: StationRow[] = [
  { term: 'On station since', value: String(story.since) },
  ...metrics.map(
    (m): StationRow => ({
      term: m.label,
      value: `${m.value}${m.suffix}`,
      num: m.value,
      suffix: m.suffix,
    }),
  ),
  {
    term: 'Offices',
    value: `${offices.length} / ${new Set(offices.map((o) => o.country)).size} countries`,
  },
]

/* Take the hero out of the tab order once the forest block is over its
 * controls, and put it back the moment it is not.
 *
 * WHY THIS EXISTS. The seam works by overlap, and overlap is what breaks
 * WCAG 2.4.11: Shift+Tab backwards from further down the page lands on "Contact
 * us" or "Why pilots stall", the browser declines to scroll because the hero's
 * box is technically in view, and the focus ring is drawn behind an opaque
 * section. Measured, not theorised — see `.shots/probe/deckcheck2.mjs`. There
 * is no CSS answer: `pointer-events` does not affect focus, and animating
 * `visibility` to hidden would put the whole hero one misfire away from
 * disappearing, which is exactly the failure mode this project removed GSAP to
 * avoid.
 *
 * IT TOUCHES THE TAB ORDER AND NOTHING ELSE. `inert` on the section was the
 * first attempt and axe caught it immediately: inert takes the subtree out of
 * the accessibility tree, and the subtree contains the page's only <h1>, so
 * the whole document lost its level-one heading the moment the forest covered
 * the hero — `page-has-heading-one`, at four of five sampled seam positions.
 * That is a fair trade to refuse. "Covered" is a visual state; a screen reader
 * reads in document order and has no idea anything is on top of anything. The
 * only people affected by the overlap are the ones who can see it AND are
 * moving by keyboard, so the only thing that should change for them is where
 * Tab goes.
 *
 * IT IS NOT IN THE MOTION PATH, and that distinction is the whole argument for
 * allowing it. No animation depends on it. If the effect never runs — no
 * IntersectionObserver, a thrown error, the bundle never loading — the hero is
 * simply focusable while covered, which is the page exactly as it shipped
 * before the seam existed. It can only ever improve on the fallback.
 *
 * WHERE THE LINE IS, it measures rather than guesses. -55% was the first
 * attempt and it fired 200px of scroll too late: a probe stepping the page in
 * 40px increments found five frames at 1512x950, four at 1280x800 and five at
 * 1912x900 where both hero buttons were entirely behind the forest and still
 * in the tab order. The threshold is not a fraction of the viewport, it is the
 * top edge of the hero's highest control — above that line something is still
 * visible and the hero must stay reachable, below it nothing is and it must
 * not — so that is what gets measured, and re-measured on resize.
 *
 * `offsetTop` rather than `getBoundingClientRect`, deliberately. The recede is
 * a transform on a box between here and the controls, so a rect read while the
 * page is scrolled (a restored scroll position, a resize mid-page) is skewed by
 * however far the recede has run. `offsetTop` is layout, and layout does not
 * move.
 */
function useCoveredByNext(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const hero = ref.current
    const next = document.querySelector('[data-deck-next]')
    if (!hero || !next || typeof IntersectionObserver === 'undefined') return

    let io: IntersectionObserver | null = null

    const localTop = (el: HTMLElement) => {
      let y = 0
      let e: HTMLElement | null = el
      while (e && e !== hero) {
        y += e.offsetTop
        e = e.offsetParent as HTMLElement | null
      }
      return y
    }

    const build = () => {
      io?.disconnect()
      io = null
      const controls = [...hero.querySelectorAll<HTMLElement>('a[href],button')]
      if (!controls.length) return
      // Where the card sits once pinned — see the `--deck-card-h` model in
      // index.css. Nothing is covered before that, because nothing is over it.
      const pinned = Math.min(0, window.innerHeight - hero.offsetHeight)
      const line = pinned + Math.min(...controls.map(localTop))
      const below = Math.max(0, Math.round(window.innerHeight - line))
      io = new IntersectionObserver(
        ([entry]) => {
          for (const el of controls) {
            if (entry.isIntersecting) el.setAttribute('tabindex', '-1')
            else el.removeAttribute('tabindex')
          }
        },
        { rootMargin: `0px 0px -${below}px 0px` }
      )
      io.observe(next)
    }

    build()
    window.addEventListener('resize', build)
    return () => {
      window.removeEventListener('resize', build)
      io?.disconnect()
      // Never leave the hero out of the tab order on teardown. A hero nobody
      // can reach is a worse bug than the one this fixes.
      for (const el of hero.querySelectorAll('a[href],button')) el.removeAttribute('tabindex')
    }
  }, [ref])
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  useCoveredByNext(ref)

  return (
    <section
      ref={ref}
      id="top"
      data-shot="hero"
      // THE LOWER CARD OF THE DECK. This section holds still while `01 The
      // gap` rides up over it — see the block comment on `[data-deck]` in
      // index.css. Two classes here are load-bearing for that and look like
      // ordinary styling, so they are worth naming.
      //
      // `bg-ground`: a pinned card has to be opaque. The hero has always
      // inherited its ground from `body` and looked identical doing it, but
      // the moment it stops moving, an inherited background means whatever is
      // underneath shows straight through it.
      //
      // `pb-[clamp(120px,17vh,190px)]`: unchanged, but it is now read twice.
      // The deck pins this card at MINUS that same expression, so the padding
      // is no longer only spacing — it is exactly how much of the hero the pin
      // is allowed to push off the top of the screen. Change one and the other
      // has to change with it; see the `[data-deck]` comment in index.css.
      data-deck-card
      className="relative flex min-h-[94svh] flex-col justify-between overflow-clip bg-ground pt-[calc(72px+6vh)] pb-[clamp(120px,17vh,190px)]"
    >
      {/* THE RECEDE, and note what it is NOT on.
          It used to sit on a sticky column inside this section. It cannot stay
          there: with the whole hero holding, a sticky box inside it has nothing
          left to hold against. So it moves out to the composition — copy and
          station log together — which is what should recede as the dark card
          takes the screen.

          It stops here rather than going up to the <section> for a measured
          reason. `scroll-curtain` ends on `scale(0.93)`, and the production
          line below is full-bleed: its width is deliberately computed from the
          container edge so it REACHES the edge of the screen at every width.
          Scaled by 7% it would stop ~106px short at 1512 and visibly unhook
          from the frame — the page's own device coming loose. The line is the
          hero's foot; it does not need to recede, it needs to be the first
          thing the forest swallows. Same argument keeps the section's own
          `bg-ground` plate unscaled, and keeps `[data-shot="hero"]` on an
          untransformed box so section screenshots are not captured skewed.

          60svh, and biased long on purpose. The range wants to be "the hero's
          height", but that is 100svh at 1512x950 and 134svh at 1912x660 —
          mostly type, only about a quarter of it viewport-derived — so no
          single svh value is right everywhere. Overshooting means the recede
          is still creeping along under an opaque block, which nobody can see;
          undershooting means it finishes in full view, which reads as a stall. */}
      <Container data-scroll="curtain" style={{ ['--curtain-span' as string]: '60svh' }}>
        <Grid>
          {/* The copy column. It was a curtain runway holding a sticky pin and
              an 18svh spacer box, and all three are gone — the deck holds the
              whole section now, so a pin inside it was holding something that
              was already still.

              Deleting the spacer takes about 170px off the hero, which is what
              puts the production line and its PILOT / PRODUCTION labels back on
              the first screen. That was a real complaint and this is the fix
              for it; it was never worth its own magic number.

              The `Reveal`s nested inside are untouched, and should stay that
              way. They are a PAGE-LOAD entrance, and the hero is above the
              fold: a scroll-driven entrance for content already in view when
              the page opens arrives pre-finished, which is no entrance at all.
              Sections 02–07 were converted precisely because they are NOT above
              the fold. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <Eyebrow label="Nordic partner for enterprise AI" className="mb-7" />

            {/* No highlighter behind the money word — that gesture is on
                every launch page of the last three years. The emphasis is the
                site's own device instead: moss ink, and the solid half of the
                production line drawn under the word that earns it.

                The two lines rise out from behind their own edges, in sequence.
                The split is stated in the markup rather than measured, so it
                cannot disagree with what actually renders. */}
            {/* `relative` so the mascot below can be positioned against the
                heading. NOT `w-fit` any more — see the note on the mascot for
                why the wrapper's own width turned out to be useless as an
                anchor. */}
            <div className="relative">
              <Reveal as="h1" lines className="display-1" stagger={0.11}>
                <Line>Enterprise AI is won in</Line>
                <Line className="relative block w-fit pb-[0.14em] text-accent after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-accent after:content-['']">
                  production.
                </Line>
              </Reveal>

              {/* Nori leans on the last "e" of "Enterprise", standing on that
                  line's baseline and scaled to the type. `lean` is tilted with
                  its LEFT shoulder forward, so it leans onto an edge that sits
                  to ITS left — which is exactly what the end of a word is. The
                  pose works unmirrored, the way it was drawn.

                  It cannot live INSIDE the heading: `.line-mask` is
                  `overflow: hidden`, which is what lets the lines rise out from
                  behind themselves, and it would clip the mascot away. So it is
                  positioned against the wrapper instead.

                  EVERY NUMBER HERE IS IN THE HEADING'S OWN em, and that is the
                  whole point. The obvious anchor — hang the mascot off the
                  wrapper's right edge — does not work, because the headline
                  WRAPS: at every width it renders as three visual lines, not
                  the two the markup states, and a wrapped text block's box is
                  always wider than its ragged ink. Measured, the ink stops at
                  74% of the wrapper at 1512px and 86% at 1024px, so there is no
                  fixed percentage to anchor to either. Hung off the box edge
                  the mascot floated 206px clear of the type, leaning on
                  nothing.

                  What IS stable is the width of the word itself: "Enterprise"
                  at `display-1` measures 4.475em at 1024, 1280, 1512 AND 1920 —
                  the same number to three decimals at every width, because it
                  scales with the font rather than with the column. (Derive it
                  by measuring, not by dividing by an assumed font-size: the
                  first attempt guessed 124px where the computed value is 120,
                  and landed the shoulder 19px inside the letter.)

                  `h-[1lh]` is exactly one line of the heading, so `items-end`
                  drops the figure onto the FIRST line's baseline rather than
                  the heading's. That matters: the shoulder sits only about a
                  quarter of the drawing's height above the sole, so a mascot
                  standing at the bottom of a three-line block could never reach
                  the top line's ink — the geometry rules it out, not taste.

                  The size is on the inner box, in em, and the image's own
                  `max-width: 100%` takes it from there, so the mascot tracks
                  the type instead of being pinned to a px value that is right
                  at one viewport and wrong at the next.

                  PRESENT AT EVERY WIDTH, and it needs no breakpoint to be. The
                  offset is `4.475em` measured from the h1's own left edge, and
                  "Enterprise" is the first word of the heading at every size, so
                  that offset lands on the same letter whatever the type is doing
                  — at 390 the line breaks after "Enterprise" and the lean simply
                  has more room. The figure scales itself for the same reason:
                  its box is `1.15em`, so it tracks the heading rather than a px
                  value that is right once.

                  This used to be `lg` and up, on the grounds that the station
                  log sat against the headline column below that and a mascot
                  here would overlap the figures. Measured at 390 / 480 / 640 /
                  768 / 1024 / 1280: the only element its box ever intersects is
                  the h1 it is leaning on, and its right edge stays inside the
                  h1's at every one of them. */}
              <div className="display-1 absolute top-0 left-[4.475em] flex h-[1lh] items-end">
                <div
                  className="w-[1.15em]"
                  style={{
                    // X: the measured shoulder (anchors.ts) onto the letter's
                    // edge, then a hair past flush — daylight between a leaning
                    // figure and what it leans on reads as floating.
                    // Y: the painted sole is at 84.72% of the box, not at its
                    // bottom edge, so without this it hovers above the baseline.
                    transform:
                      'translateX(calc(-1 * ' + NORI_ANCHOR.lean.x + ' - 0.03em)) ' +
                      'translateY(calc(100% - ' + NORI_ANCHOR.stand.y + '))',
                  }}
                >
                  {/* `breathe`, not the rock the other anchored poses get.
                      This one is held at two points at once — feet on the
                      heading's baseline, shoulder against the letter — and a
                      rotation keeps whichever it pivots on and breaks the
                      other. A vertical scale about the sole keeps the feet
                      planted and slides the shoulder along the letter's edge,
                      which is near-vertical where it touches, so both survive. */}
                  <div
                    className="nori-breathe"
                    style={{ ['--pivot' as string]: `50% ${NORI_ANCHOR.stand.y}` }}
                  >
                    <Nori pose="lean" size={240} animated={false} />
                  </div>
                </div>
              </div>
            </div>

            <Reveal as="p" delay={0.34} className="lead measure-serif mt-7 text-ink-2">
              We turn AI ambition into production — co-creating the solutions, infrastructure and
              adoption that make it stick.
            </Reveal>

            {/* The ghost carries the same pill geometry as the solid one, so the
                pair sits on one baseline and one height. It was previously bare
                inline text beside a 51px button — a 22px tap target next to a
                51px one, and visually a caption that had wandered in. The gap
                closes from 32px to 8px now that both have real padding. */}
            <Reveal delay={0.46} className="mt-9 flex flex-wrap items-center gap-x-2 gap-y-2">
              <a
                href="#contact"
                className="btn btn-solid"
              >
                Contact us
              </a>
              <a
                href="#gap"
                className="btn btn-ghost group"
              >
                Why pilots stall
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                  <path
                    d="M8 3 v10 M4 9.5 l4 3.5 4-3.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 ease-(--ease-entrance) group-hover:translate-y-0.5"
                  />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Station log.
              A sea mark carries a station record, so the device earns its
              place — but the real job is commercial. Norrin's strongest
              credibility signals (scale, tenure, footprint) currently sit
              buried on /about-us, which means the buyer weighing "are these
              people durable enough for a three-year programme" never sees
              them. Answering that in the first five seconds is the single
              highest-leverage change available. Every figure is published. */}
          <aside
            data-scroll="drift-slow"
            className="col-span-4 mt-14 self-start md:col-span-4 md:col-start-9 md:mt-2 lg:col-span-3 lg:col-start-10"
          >
            <Reveal as="dl" stagger={0.06} variant="right" delay={0.2} className="border-t border-hairline">
              {STATION.map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5"
                >
                  <dt className="label text-ink-3">{row.term}</dt>
                  <dd className="label tabular-nums text-ink">
                    {row.num !== undefined ? (
                      <>
                        <Counter value={row.num} />
                        {row.suffix}
                      </>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </Reveal>
          </aside>
        </Grid>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* The production line. Dashed left of the mark, solid right of it.  */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-24 md:mt-10">
        {/* `items-start` with three equal-height children, not `items-center`
            with a zero-height one. The mark's container used to be `h-0` between
            two `h-px` siblings, so centring resolved it onto a half pixel and
            rounded down — putting the two halves of the rule on different device
            rows. A one-pixel staircase at both joints, in the one object the
            page is remembered by. */}
        <div className="flex items-start">
          <span
            aria-hidden="true"
            className="h-px flex-1 border-t border-dashed border-inactive"
          />

          <div className="relative h-px w-[clamp(104px,23vw,320px)] shrink-0 text-accent">
            {/* The rule continues across the mark itself, changing state at
                its exact centre — the crossing point. */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-1/2 left-0 border-t border-dashed border-inactive"
            />
            <span aria-hidden="true" className="absolute top-0 right-0 left-1/2 h-px bg-accent" />

            {/* The rocket pose used to stand here, on the crossing. It is gone:
                the mascot now leans on the headline, and one hero cannot carry
                two of the same character without the pair reading as a mistake.
                The crossing itself is unchanged — the state change in the rule
                IS the object, and it never needed a figure standing on it to be
                legible. */}
          </div>

          {/* The tail is measured from the CONTAINER's right edge, not in raw
              vw. At 9vw capped to 150px the mark kept drifting right of the
              1512px-capped container, and past roughly 1667px it walked out from
              under the word naming it — so above that width "Production" was
              labelling the dashed side. */}
          <span
            aria-hidden="true"
            className="h-px w-[calc(max(var(--spacing-gutter),(100vw-1512px)/2)+clamp(40px,4vw,110px))] shrink-0 bg-accent"
          />
        </div>

        <Container>
          <div className="mt-14 flex justify-between md:mt-5">
            <span className="label text-ink-3">Pilot</span>
            <span className="label text-accent">Production</span>
          </div>
        </Container>
      </div>

      <p className="sr-only">{positioning.lede}</p>
    </section>
  )
}
