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
          <div className="col-span-4 md:col-span-12">
            <Eyebrow index="01" label="The gap" tone="inverse" />
          </div>

          <Reveal className="col-span-4 mt-8 md:col-span-6 md:mt-12" variant="left">
            <h2 id="gap-heading" className="thesis">
              {positioning.thesisOpening}
            </h2>
          </Reveal>

          {/* The isolated-danger mark. In IALA buoyage, two cones point-to-point
              mark a hazard with navigable water all round it — which is exactly
              what the pilot-to-production gap is. */}
          <Reveal
            className="col-span-4 mt-12 flex items-start gap-6 border-t border-inverse-hairline-strong pt-7 md:col-span-5 md:col-start-8 md:gap-7"
            delay={0.08}
          >
            <div className="w-14 shrink-0 text-inverse-ink md:w-[132px]">
              <Fyr
                size={132}
                state="gap"
                className="h-auto w-full"
                showWater={false}
                showMooring={false}
                title="Isolated danger mark — the pilot-to-production gap"
              />
            </div>
            <div>
              <p className="label text-inverse-ink-2">Isolated danger</p>
              {/* The second sentence — "It is the shape this whole section is
                  about." — is gone. That is the design annotating itself,
                  telling the reader the metaphor is a metaphor, which is the
                  one move that makes a device look decorative. The mark, the
                  label and the three stations below already say it. */}
              <p className="body-serif mt-3 max-w-[34ch] text-inverse-ink-2">
                In sea marking, two cones point-to-point mark a hazard with open water all
                round it.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* Three stations, strung along one rule.                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-16 md:mt-32">
        {/* Desktop: horizontal. */}
        <div className="hidden md:block">
          <Container>
            <ol data-scroll="drift" className="grid grid-cols-3">
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
                      <span
                        aria-hidden="true"
                        className="absolute top-0 right-[-50vw] left-1/2 h-px bg-signal/80"
                      />
                      {/* The crossing. One of the page's three solid uses of sun. */}
                      <span
                        aria-hidden="true"
                        className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-signal"
                      />
                      {/* Lunni lands on the solid half, never on the dashed one.
                          A sea bird settles on a mark that is on station; there
                          is nothing to land on at a pilot floating free. The
                          argument the whole section makes, made once more by an
                          animal deciding the line is safe. */}
                      <Lunni
                        size={58}
                        variant="standing"
                        facing="right"
                        className="absolute top-0 left-[63%] -translate-y-[86%]"
                        title="A puffin resting on the production line"
                      />
                    </>
                  )}

                  {/* Zero-height rail: the mark is lifted out of flow so the
                      caption sits under the rule, not under the mark's box. */}
                  <div className="relative flex h-0 justify-center">
                    <div className="absolute top-0 w-[clamp(120px,13vw,190px)] -translate-y-[60.83%] text-inverse-ink">
                      <Fyr size={190} state={s.state} className="h-auto w-full" showWater={false} />
                    </div>
                  </div>

                  {/* Clears the mark's submerged 39.17%, plus breathing room. */}
                  <div className="px-4 pt-[calc(clamp(120px,13vw,190px)*0.52)] text-center lg:px-10">
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
