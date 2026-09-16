import { useEffect, useRef } from 'react'

import { Container, Grid } from '@/components/primitives/Layout'
import { ContourField } from '@/components/sections/ContourField'
import { metrics, offices, positioning, story } from '@/data/norrin'
import { Line } from '@/components/primitives/SplitLines'
import { Reveal } from '@/components/primitives/Reveal'
import { Counter } from '@/components/primitives/Counter'

/**
 * Hero.
 *
 * The composition is one idea: a horizon. Everything the visitor reads sits
 * above the waterline, and the waterline itself is the site's central device —
 * dashed to the left of the mark (pilot: provisional, unfinished) and solid to
 * the right (production: committed, load-bearing). The state change AT the
 * crossing is the whole argument in one object, and nothing sits on it.
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
      // THE HERO IS PAPER, NOT A SATURATED PLANE, and that was tried and
      // rejected rather than never considered. Flooding this section in forest
      // was built and looked at: it read as a different company, and it made
      // the contour field — which is the thing worth keeping here — compete
      // with a colour instead of drawing on a ground. What the flood was
      // actually fixing was that the survey lines were too faint to see, and
      // that is fixed where it belongs, in the strokes themselves.
      //
      // `pb-[clamp(120px,17vh,190px)]`: unchanged, but it is now read twice.
      // The deck pins this card at MINUS that same expression, so the padding
      // is no longer only spacing — it is exactly how much of the hero the pin
      // is allowed to push off the top of the screen. Change one and the other
      // has to change with it; see the `[data-deck]` comment in index.css.
      // `isolate` IS LOAD-BEARING AND FIXES A REAL BUG. The contour field sits
      // at `z-index: -10` so it paints above this section's own `bg-ground` but
      // below everything that is read. That only works if this element is a
      // stacking context — otherwise the negative-z child escapes to the nearest
      // ancestor that IS one and paints behind this section's background, which
      // makes it invisible.
      //
      // It used to get that stacking context by accident, from `position:
      // sticky`. But the deck only applies sticky at `min-width: 768px` AND
      // `min-height: 800px`, so outside that query the hero is merely
      // `relative` with `z-index: auto` — no stacking context, no field.
      // Measured: visible at 1512x950, invisible at 1512x700 and 600x900.
      //
      // `isolation: isolate` creates one unconditionally and does nothing else,
      // which is exactly the intent. Relying on sticky was relying on a layout
      // mode to imply a paint mode.
      data-deck-card
      className="relative isolate flex min-h-[94svh] flex-col justify-between overflow-clip bg-ground pt-[calc(72px+6vh)] pb-[clamp(120px,17vh,190px)]"
    >
      {/* The ground the hero stands on. Behind everything, including the band —
          the band is an object sitting on the field, not a second background
          competing with it. See ContourField for why this figure and not a
          gradient. */}
      <ContourField />

      {/* NO PHOTOGRAPH BAND. There was one — three of Norrin's aerials butted
          edge to edge under the nav, at 24vh — and it is gone deliberately
          rather than by attrition.

          It worked, and it was still one thing too many. With the contour field
          behind the type, the hero was carrying two backgrounds arguing for the
          same idea: photographs of terrain from above, over a survey of terrain
          from above. The field says it more quietly and lets the headline be the
          loudest thing on the screen, which at `display-1` it should be.

          What the band cost is worth recording so this is not simply undone
          later: it was the only place the three landscapes read at full width,
          and their left-to-right progression — unmarked water, a route being
          cut, a causeway in use — is the page's argument stated in pictures.
          That progression currently has no home. It is a real loss, not a
          tidy-up. */}
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
          {/* EIGHT AT `lg`, NOT SEVEN, AND IT COSTS THE RIGHT COLUMN NOTHING.
              The aside opposite starts at column 9, so column 8 was simply
              empty — a gutter nobody asked for. Taking it gives the headline a
              whole column more to run in.

              THREE LINES, AUTHORED — "Enterprise / AI is won in / production."
              It used to be a two-line split that wrapped to three because the
              first line was wider than the column. The move to LFS Adelia made
              that line narrow enough to fit, and the heading silently collapsed
              to two. A line count that depends on a font's width is not a
              decision, so the three lines are now stated in the markup. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            {/* THEIR h1 IS NOT HERE AT ALL, and the deletion is the argument
                this section makes — more plainly than the demotion it replaces.

                On norrin.com "We are Norrin" is the document's only `<h1>`, set
                at 19.5px/700. Measured, every heading on their homepage is
                19.5px except one `h2` at 66.2px; their h1 is the same size as
                the paragraph beneath it and the CTA beside it. So the page's
                top-level heading is a company name at body size, while the
                sentence that actually argues for them — "We believe enterprise
                AI is won in production" — is an `h3` at 19.5px/400, two
                sections down, under a webinar promo.

                That string was carried here as an eyebrow for a while, on the
                reasoning that a name is a label on the thing rather than the
                thing. True, but it still spent the first line of the page saying
                who is talking instead of what they claim — and the wordmark in
                the header already answers that, permanently, at every scroll
                position. So the thesis now opens the page with nothing above it.
                The name is in the nav, where a name goes. */}
            {/* No highlighter behind the money word — that gesture is on
                every launch page of the last three years. The emphasis is the
                site's own device instead: moss ink, and the solid half of the
                production line drawn under the word that earns it.

                The three lines rise out from behind their own edges, in sequence.
                The split is stated in the markup rather than measured, so it
                cannot disagree with what actually renders. */}
            {/* `relative` so the mascot can be positioned against the heading's
                own em rather than against the column. */}
            <div className="relative">
              <Reveal as="h1" lines className="display-1" stagger={0.11}>
                <Line>Enterprise</Line>
                <Line>AI is won in</Line>
                {/* The accent carries the emphasis on its own. There used to be
                  a solid rule under this word as well — the production line
                  restated at heading scale — and one device stated twice inside
                  a single viewport is the device explaining itself. */}
                <Line className="block w-fit text-accent">production.</Line>
              </Reveal>

              {/* THE NOTCH BESIDE "Enterprise" IS NOW EMPTY, ON PURPOSE.

                  A mascot used to stand in it — placed against a measured pocket,
                  standing on a corrected baseline, breathing on its own sole. The
                  engineering was sound and it is gone anyway, because the drawing
                  was answering the wrong question. Norrin sells enterprise AI to
                  CIOs of Nordic industrials; a white robot with a lavender antenna
                  beside the thesis is the single most recognisable "generated"
                  signal the page could carry, and it was the one element whose
                  palette belonged to no part of this system.

                  Nothing replaces it, and that is the finding. Of the four Finnish
                  consultancies in `docs/style-research.md`, the strongest
                  typographic page — Reaktor's — opens with no image at all: black
                  ground, a 20px eyebrow, one 94px serif sentence. A short first
                  line with air to its right is a headline that trusts itself. The
                  argument is carried by the line at the foot of this section, which
                  is the device that actually means something.

                  Do not fill this space. It was expensive to empty. */}
            </div>

            {/* THEIR BRAND LINE, PUT BACK AS TEXT — and sitting where a
                subtitle belongs, directly under the headline it amplifies.

                On norrin.com this sentence is an 825x633 `<video>` of letters
                flying into place. It is the largest thing in their hero and it
                is not type: the live DOM returns zero hits for "MINDS", and the
                element carries no `aria-label`, no caption track and no text
                alternative. It cannot be selected, indexed or read aloud — and
                a company shipping five languages cannot translate a sentence
                that has been rendered into a video.

                It is short, so it belongs here rather than in a narrow column:
                one serif line under the display type reads as the headline's
                second breath. Sentence case, not their uppercase — the caps
                were a styling decision, so they stay one. */}
            <Reveal as="p" delay={0.34} className="lead measure-serif mt-7 text-ink-2">
              {positioning.slogan}
            </Reveal>

            {/* The ghost carries the same pill geometry as the solid one, so the
                pair sits on one baseline and one height. It was previously bare
                inline text beside a 51px button — a 22px tap target next to a
                51px one, and visually a caption that had wandered in. The gap
                closes from 32px to 8px now that both have real padding. */}
            <Reveal delay={0.46} className="mt-9 flex flex-wrap items-center gap-x-2 gap-y-2">
              <a href="#contact" className="btn btn-solid">
                Contact us
              </a>
              <a href="#gap" className="btn btn-ghost group">
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
          {/* ONE BLOCK, HUNG FROM THE HEADLINE'S CAP LINE.
              The statement and the evidence read as a single object here, and
              the object is aligned to the type opposite it: `md:mt-3.5` lands
              the paragraph's first line on the cap of "Enterprise", measured
              rather than eyeballed (`.shots/probe/wide.mjs`). The two blocks
              travel together — the gap between them is a plain margin on the
              paragraph, so moving the column moves all of it.

              THIS REPLACES A FOUR-CORNERS CONSTRUCTION, and the thing it gives
              up is worth writing down. The column used to be `self-stretch`
              with `justify-between`: the log was pushed to the bottom of the
              row, which put its last rule within 3px of the CTA row's baseline
              opposite — an alignment nobody names but everybody feels. That is
              gone. In exchange the right column is now a compact unit tied to
              the headline instead of a pair of blocks tied to the frame, and
              the space it used to distribute now sits under the log.

              If that space ever reads as a dead corner rather than as air,
              `md:self-stretch md:justify-between` is the whole of the way back
              — but the paragraph then unhooks from the cap line, because those
              two things cannot both be true. */}
          <aside
            data-scroll="drift-slow"
            className="col-span-4 mt-14 self-start md:col-span-4 md:col-start-9 md:mt-3.5 md:flex md:flex-col"
          >
            {/* THEIR LEDE — verbatim, complete, and read from `data` rather
                than retyped here.

                It used to be a hand-edited version sitting in this file: em
                dash for their comma, Oxford comma dropped, final clause cut.
                Small liberties, but the project's whole claim is that every
                string is traceable to a public page, and a paraphrase in JSX is
                exactly where that claim quietly stops being true. (It also
                retires the `sr-only` duplicate that used to sit at the foot of
                this section and made screen readers hear it twice.)

                It sits in THIS column rather than under the headline because it
                is long — three sentences — and this column was 370px of empty
                ground. A narrow measure is where a long paragraph does its best
                work, and the swap turns the dead quadrant into the part of the
                hero that actually explains the company. What is left under the
                headline is the short line, which is what a subtitle wants to be.

                It holds four columns at every width now. It used to step DOWN
                to three at `lg`, so this paragraph got tighter exactly as the
                page got more room to give it — 39ch at 1512 with 265px of
                empty grid beside it, which read as a caption in the corner
                rather than as the lede. At four it is 47ch and the gutter to
                the copy column is a whole grid column.

                THE STATION LOG USED TO SIT UNDER THIS PARAGRAPH and is now a
                full-width strip at the foot of the section. The gap between the
                two was `md:mb-24`, stated rather than distributed because
                `justify-between` had produced anything from 0px to 170px
                depending on how many lines this paragraph took. Stating it fixed
                the variance and left a different problem: 96px of nothing in the
                middle of a column, next to a left column whose content runs
                continuously. It read as a hole rather than as air.

                Moving the log out solves it at the root instead of tuning the
                number. The log is METADATA — six published figures — and
                metadata belongs at an edge, not stacked mid-column. It also
                makes the hero shorter, which it needed to be. */}
            <Reveal as="p" variant="right" delay={0.14} className="body-serif text-reading">
              {positioning.lede}
            </Reveal>
          </aside>
        </Grid>
      </Container>

      {/* THE STATION LOG, as a strip rather than a column.

          Six published figures, set as metadata at the foot of the section —
          the position a report puts its credit line. They were a six-row `<dl>`
          in the right-hand column, which stacked two unrelated blocks in one
          column and left 96px of dead space between them.

          Still a `<dl>`: these are term/value pairs and the markup should say
          so whichever way they are laid out. Only the axis changed.

          The counters stay. They are seeded with the final value, so a browser
          that never runs the effect shows the true figure rather than a zero —
          the same fail-safe contract every other effect on this page holds to. */}
      <Container className="mt-12 md:mt-8">
        <Reveal
          as="dl"
          stagger={0.05}
          variant="up"
          delay={0.2}
          className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {STATION.map((row) => (
            <div key={row.term}>
              <dt className="label text-ink-3">{row.term}</dt>
              <dd className="label tabular-nums mt-1.5 text-ink">
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
      </Container>

      {/* THE PRODUCTION LINE USED TO END THIS SECTION and is gone by request.
          It was a full-bleed rule — dashed left of a crossing mark, solid
          right of it — with PILOT and PRODUCTION labelled beneath.

          What went with it, so this is not silently rediscovered: it was the
          LEGEND for a convention the page still uses in three other places —
          the road in The Gap (dashed approach, solid crossing), the nav's rule
          marker, and the edge-to-edge terminus in Contact. The convention now
          runs without ever being introduced. The stations in The Gap name it in
          words, which is what makes that survivable, but it is a real cost
          rather than a tidy-up.

          It also carried a stale measurement: the tail was computed against
          `(100vw - 1512px)/2` long after `Container` moved to 1440, so above
          ~1667px the mark walked out from under the word naming it. Dead now,
          but the class of bug — a hardcoded container width inside a call site
          — is exactly why `--spacing-gutter` exists. */}
    </section>
  )
}
