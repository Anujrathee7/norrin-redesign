import { useEffect, useRef, useState } from 'react'
import { Container, Eyebrow, Grid, SectionHeader } from '@/components/primitives/Layout'
import { cx } from '@/lib/cx'
import { partnership, pillars, productionSince, services, technologies } from '@/data/norrin'

/**
 * The three pillars.
 *
 * This is Norrin's own taxonomy, and it absorbs every one of the eleven service
 * links currently fanned out under "Services". The real descriptions are good
 * writing that presently sits two clicks deep; they are surfaced verbatim here.
 *
 * A sticky index tracks reading position. It is a genuine wayfinding aid at
 * this length rather than an effect: the reader can see which pillar they are
 * in and jump between them. It collapses to a plain stacked list on small
 * screens, where stickiness would eat the viewport.
 *
 * The platform list closes the section. It used to be a top-level section of its
 * own, with its own index and its own display heading, for eight vendor names
 * whose entire job is to retire one objection — "do they know my stack?" — and
 * whose caption repeated a clause from pillar 01 verbatim. Evidence belongs with
 * the claim it supports, not competing with it for a rung on the ladder. It
 * keeps its #platforms id so existing links still land.
 */
export function Pillars() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the reading zone rather than the
        // first intersecting one, which flickers between neighbours.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (!visible) return
        const idx = refs.current.indexOf(visible.target as HTMLElement)
        if (idx >= 0) setActive(idx)
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 },
    )
    for (const el of refs.current) if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="pillars"
      data-shot="pillars"
      aria-labelledby="pillars-heading"
      className="bg-surface py-24 md:py-36"
    >
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-8">
            <SectionHeader index="03" label="What you can buy" id="pillars-heading">
              Three ways in.
            </SectionHeader>
          </div>
        </Grid>

        <Grid>
          {/* Sticky index — desktop only. */}
          <nav
            aria-label="Pillars"
            className="col-span-4 hidden md:col-span-4 md:block lg:col-span-3"
          >
            <ol className="sticky top-[120px] border-t border-hairline">
              {pillars.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`#pillar-${p.id}`}
                    aria-current={active === i ? 'true' : undefined}
                    className={cx(
                      'flex items-baseline gap-3 border-b py-4 transition-colors duration-300',
                      // The active row is marked by its own rule going moss. The
                      // previous mark was a 6px sun square at 1.03:1 on --surface —
                      // arithmetically invisible, and in the theme most people use
                      // it was the only thing carrying the state.
                      active === i ? 'border-accent text-ink' : 'border-hairline text-ink-3 hover:text-ink-2',
                    )}
                  >
                    <span className="label tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ui">{p.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="col-span-4 md:col-span-7 md:col-start-6 lg:col-span-8 lg:col-start-5">
            {pillars.map((p, i) => (
              <article
                key={p.id}
                id={`pillar-${p.id}`}
                ref={(el) => {
                  refs.current[i] = el
                }}
                className="scroll-mt-32 border-t border-hairline py-10 first:border-t-0 first:pt-0 md:py-14"
              >
                <h3 className="display-3">{p.name}</h3>
                <p className="body-serif measure-serif mt-6 text-ink-2">{p.body}</p>
                {/* Was thirteen bordered, padded, radiused chips. In a system
                    where hairlines separate, a box around each item makes the
                    hairline start CONTAINING instead — and a row of them reads
                    as filter controls you can click. One of them also wrapped to
                    two lines inside its own box at 320px. Set as one ruled mono
                    line, it is the same "production voice" the nav drawer uses
                    for exactly this kind of metadata. */}
                {/* Norrin's own taglines for these service lines, from
                    /services. The bare category names — "Data Platforms",
                    "Continuous Services" — were the least interesting form the
                    same information can take, and the company writes them
                    better than a redesign should invent them. */}
                <dl className="mt-8 border-t border-hairline">
                  {services
                    .filter((sv) => sv.pillar === p.id)
                    .map((sv) => (
                      <div
                        key={sv.name}
                        className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-hairline py-3"
                      >
                        <dt className="ui w-full text-ink sm:w-[13rem]">{sv.name}</dt>
                        <dd className="caption text-ink-2">{sv.tagline}</dd>
                      </div>
                    ))}
                </dl>
              </article>
            ))}
          </div>
        </Grid>

      </Container>

      {/* ------------------------------------------------------------------ */}
      {/* The evidence band.                                                  */}
      {/*                                                                     */}
      {/* This was a quiet grey block at the foot of the section. It is now a  */}
      {/* forest band, for three reasons that are the same reason: between the */}
      {/* hero and the closing CTA the page ran seven consecutive light        */}
      {/* sections with no dark ground, no second colour and no mascot, and    */}
      {/* every one of them was an eyebrow over a ruled list. A band here      */}
      {/* gives the middle a tonal event, a different composition, and the     */}
      {/* page's own colour back — and it earns the space with the best        */}
      {/* evidence Norrin publishes rather than with decoration.               */}
      {/*                                                                     */}
      {/* "In production since 2015" is the single most useful sentence on     */}
      {/* their site for a page arguing that AI is won in production: dated,   */}
      {/* checkable, and about running something rather than planning it.      */}
      {/* ------------------------------------------------------------------ */}
      <div
        id="platforms"
        data-shot="platforms"
        data-tone="inverse"
        className="mt-24 scroll-mt-32 bg-inverse py-20 text-inverse-ink md:mt-32 md:py-24"
      >
        <Container>
          <Grid>
            <div className="col-span-4 md:col-span-5">
              <Eyebrow label="Built on the stack you already run" tone="inverse" className="mb-7" />
              <p className="display-4 max-w-[18ch]">
                Logic Apps in production since{' '}
                <span className="text-signal">{productionSince.year}</span>.
              </p>
              <p className="body-serif measure-serif mt-6 text-inverse-ink-2">
                {productionSince.claim}
              </p>
              <p className="caption mt-6 max-w-[44ch] text-inverse-ink-3">{partnership}</p>
            </div>

            <ul
              data-scroll="breathe"
              className="col-span-4 mt-12 grid grid-cols-1 self-start border-t border-inverse-hairline-strong sm:grid-cols-2 md:col-span-6 md:col-start-7 md:mt-0"
            >
              {technologies.map((t) => (
                <li
                  key={t.name}
                  className="border-b border-inverse-hairline-strong py-3 sm:odd:pr-8 sm:even:pl-8 sm:last:odd:col-span-2 sm:last:odd:pr-0"
                >
                  <span className="ui text-inverse-ink">{t.name}</span>
                </li>
              ))}
            </ul>
          </Grid>
        </Container>
      </div>
    </section>
  )
}
