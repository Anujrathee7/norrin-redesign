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
            {/* THEIR h1, demoted to the eyebrow — and that demotion is the
                argument this whole section makes.

                On norrin.com "We are Norrin" is the document's only `<h1>`, set
                at 19.5px/700. Measured, every heading on their homepage is
                19.5px except one `h2` at 66.2px; their h1 is the same size as
                the paragraph beneath it and the CTA beside it. So the page's
                top-level heading is a company name at body size, while the
                sentence that actually argues for them — "We believe enterprise
                AI is won in production" — is an `h3` at 19.5px/400, two
                sections down, under a webinar promo.

                We keep both strings and swap their ranks. The name becomes the
                eyebrow, because that is what a name is: a label on the thing,
                not the thing. The thesis takes the `display-1` and the `<h1>`. */}
            <Eyebrow label={positioning.h1} className="mb-7" />

            {/* No highlighter behind the money word — that gesture is on
                every launch page of the last three years. The emphasis is the
                site's own device instead: moss ink, and the solid half of the
                production line drawn under the word that earns it.

                The two lines rise out from behind their own edges, in sequence.
                The split is stated in the markup rather than measured, so it
                cannot disagree with what actually renders. */}
            {/* `relative` so the mascot can be positioned against the heading's
                own em rather than against the column. */}
            <div className="relative">
              <Reveal as="h1" lines className="display-1" stagger={0.11}>
                <Line>Enterprise AI is won in</Line>
                {/* The accent carries the emphasis on its own now. There used to
                  be a solid rule under this word — the production line restated
                  at heading scale — but the real one runs full-bleed at the
                  foot of this same section, and two instances of the site's one
                  device inside a single viewport is the device explaining
                  itself. The colour is the emphasis; the rule below is the
                  argument. */}
                <Line className="block w-fit text-accent">production.</Line>
              </Reveal>

              {/* NORI STANDS IN THE NOTCH BESIDE "Enterprise" — clear of it,
                  not touching it, and that is a finding rather than a compromise.

                  The pose rests a palm on an edge, and the first placement put
                  that palm on the end of the word. Cropped and looked at
                  (`.shots/probe/headline-crop.png`) it does not read: Nori is a
                  WHITE character with a thin contour and the headline is white
                  ink, so the pixels where they meet are white on white. Every
                  other contact on this site works because the mascot meets a
                  RULE — a hairline, the production line, a card border — a dark
                  line on a light ground or the reverse. Type is not a rule. So
                  the figure stands clear, the raised arm reads as a gesture
                  toward the word rather than a grip on it, and the drawing keeps
                  its own silhouette against the ground.

                  THE POCKET IS MEASURED. The headline breaks identically at
                  every width tested (390 / 768 / 1024 / 1280 / 1512): three
                  lines ending at 4.47em, 5.02em and 5.05em of `display-1`, to
                  two decimals, because the type scales with the font and the
                  column never gets narrow enough to rebreak it. Line one is the
                  SHORT one, so the notch to its right is free at every width,
                  and the tightest the column ever leaves it is 1.43em at 1024.
                  The figure occupies 4.62-5.72em, which clears both edges there
                  and everywhere else. See `.shots/probe/h1-lines.mjs`.

                  `--sole-drop` IS A CORRECTION, and it exists because `1lh` is
                  not the baseline. The line box is 0.94em while the font's own
                  content box is 1.233em, so the glyphs overflow their line and
                  the baseline sits above the box bottom that `items-end` aligns
                  to. Standing the figure on that bottom sank it 12px into the
                  descender space — measured off the crop, not guessed. */}
              <div
                aria-hidden="true"
                className="display-1 pointer-events-none absolute top-0 left-[4.27em] flex h-[1lh] items-end"
                style={{ ['--sole-drop' as string]: '0.096em' }}
              >
                <div
                  className="w-[1em]"
                  style={{
                    transform: `translateY(calc(100% - ${NORI_ANCHOR.stand.y} - var(--sole-drop)))`,
                  }}
                >
                  {/* Breathing pivots on the sole, so the feet stay planted. */}
                  <div
                    className="nori-breathe"
                    style={{
                      ['--pivot' as string]: `50% ${NORI_ANCHOR.stand.y}`,
                    }}
                  >
                    <Nori pose="prop" size={280} animated={false} />
                  </div>
                </div>
              </div>
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

                `md:mb-24` is the gap to the station log, stated rather than
                distributed. It used to be whatever `justify-between` had left
                over, which is why it ran 170px at 1512 and 0px at 768 — the
                narrower the column, the more lines this paragraph takes and the
                less slack there was to spend. A stated margin is the same at
                every width and cannot collapse. */}
            <Reveal
              as="p"
              variant="right"
              delay={0.14}
              className="body-serif mb-7 text-ink-2 md:mb-24"
            >
              {positioning.lede}
            </Reveal>

            <Reveal
              as="dl"
              stagger={0.06}
              variant="right"
              delay={0.2}
              className="border-t border-hairline"
            >
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
          <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-inactive" />

          <div className="relative h-px w-[clamp(104px,23vw,320px)] shrink-0 text-accent">
            {/* The rule continues across the mark itself, changing state at
                its exact centre — the crossing point. */}
            <span
              aria-hidden="true"
              className="absolute top-0 right-1/2 left-0 border-t border-dashed border-inactive"
            />
            <span aria-hidden="true" className="absolute top-0 right-0 left-1/2 h-px bg-accent" />

            {/* NO FIGURE ON THE CROSSING, deliberately.

                A mascot stood here twice — `rocket` originally, then `sit`
                while the headline had none. Both times it competed with the
                one thing this object exists to say. The state change in the
                rule IS the argument; a character sitting on it is a second
                focal point 40px from the first, and the eye goes to the face
                every time. The hero carries one figure, and it is up in the
                headline where there is room for it. */}
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
    </section>
  )
}
