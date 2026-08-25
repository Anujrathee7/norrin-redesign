import { Container, Eyebrow, Grid } from '@/components/primitives/Layout'
import { metrics, offices, positioning, story } from '@/data/norrin'
import { Nori } from '@/components/mascot/nori/Nori'
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

export function Hero() {
  return (
    <section
      id="top"
      data-shot="hero"
      className="relative flex min-h-[94svh] flex-col justify-between overflow-hidden pt-[calc(72px+6vh)] pb-[clamp(120px,17vh,190px)]"
    >
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <Eyebrow label="Nordic partner for enterprise AI" className="mb-7" />

            {/* No highlighter behind the money word — that gesture is on
                every launch page of the last three years. The emphasis is the
                site's own device instead: moss ink, and the solid half of the
                production line drawn under the word that earns it.

                The two lines rise out from behind their own edges, in sequence.
                The split is stated in the markup rather than measured, so it
                cannot disagree with what actually renders. */}
            <Reveal as="h1" lines className="display-1" stagger={0.11}>
              <Line>Enterprise AI is won in</Line>
              <Line className="relative block w-fit pb-[0.14em] text-accent after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:bg-accent after:content-['']">
                production.
              </Line>
            </Reveal>

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
          <aside className="col-span-4 mt-14 self-start md:col-span-4 md:col-start-9 md:mt-2 md:self-center lg:col-span-3 lg:col-start-10">
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

            {/* Nori sits at the crossing point, where dashed becomes solid.
                Lifted by 92% of its own box rather than by a magic number:
                the rocket pose's lowest mark (the flame, cy 486 of a 512
                viewBox) has to land ON the rule, not below it. */}
            {/* The mascot drifts faster than the rule it stands on, which is
                what separates the two into layers. `data-scroll` is inert
                unless the browser supports scroll timelines. */}
            <div data-scroll="drift" className="absolute inset-x-0 top-0 -translate-y-[92%]">
              <Nori
                pose="rocket"
                size={300}
                className="mx-auto block w-[72%]"
                title="Nori, at the point where a pilot becomes production"
              />
            </div>
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
