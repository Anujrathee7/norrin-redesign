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

        {/* `data-scene` sits on this `<Grid>`, not on the index nav and not
            on the articles column, because the fill bar below lives in the
            nav's subtree while the rows it is timed against live in the
            articles column's — two sibling subtrees. A named view-timeline
            only reaches DESCENDANTS of the element that declares it, so the
            one element that can hand the same `--scene` timeline to both
            sides is their common ancestor. It also happens to be the
            geometrically honest choice: `Grid`'s own rendered height already
            equals the articles column's height (that column is what sizes
            the row under `align-items: stretch`), so `contain 0%` → `100%`
            on `Grid` maps 1:1 onto exactly the span the fill needs to cover. */}
        <Grid data-scene>
          {/* Sticky index — desktop only. */}
          <nav
            aria-label="Pillars"
            className="col-span-4 hidden md:col-span-4 md:block lg:col-span-3"
          >
            {/* The moss fill rides alongside the sticky rows, not on them:
                `[data-scene-part]` animates `transform`, and a transform on
                `nav`'s sticky child would replace whatever positioning that
                child depends on outright rather than combine with it — the
                same "animation beats inline transform/class" trap as Nori's
                anchor above. So the fill is a separate `<span>`, a sibling of
                `<ol>`, both laid out inside one `relative` wrapper.

                That wrapper is `h-full`, not just `relative`. `nav` is a
                grid item under `Grid`'s default `align-items: stretch`, so
                its real rendered height already matches the tall articles
                column beside it, not the three short rows inside `<ol>` —
                that extra height above and below the rows is exactly the
                room `<ol>`'s sticky positioning uses to stay pinned for
                nearly the whole section instead of for a few rows' worth of
                scroll. Inserting a wrapper here makes IT `<ol>`'s new
                containing block for sticky purposes, so if the wrapper only
                hugged the rows (the default for a plain `relative` div) it
                would hand `<ol>` a containing block a fraction of that
                height and the sticky range would collapse to almost
                nothing. `h-full` keeps the wrapper exactly as tall as `nav`
                already was with `<ol>` as its only child, so the sticky math
                is untouched — verified by screenshot below, since this is
                the one change in this file most likely to silently break
                it. */}
            <div className="relative h-full">
              {/* THE FILL HAS TO BE PINNED WITH THE ROWS, NOT BESIDE THEM.
                  It was first hung off the tall `h-full` wrapper as a sibling
                  of `<ol>`. Every number that pass checked came back right —
                  `<ol>` stayed pinned at exactly 120px and the fill's scaleY
                  tracked scroll linearly — and it was still wrong, because the
                  wrapper is as tall as the ARTICLES column (1368px) while the
                  rows are ~193px and it is the rows that are sticky. The two
                  scrolled independently: mid-section the index sat pinned with
                  its last row ending at y≈285 while the moss line ran on to
                  y≈470, ~190px of colour hanging in empty space beside
                  nothing. It was not riding the rail, it just shared an
                  x-coordinate with it. Only a screenshot showed that.

                  So the sticky element moves off `<ol>` and onto a wrapper the
                  fill can live inside. `position: sticky` IS a positioned
                  element, so the fill resolves against it, is exactly as tall
                  as the index, and travels with it. The sticky range does not
                  change: this box's containing block is still the `h-full`
                  wrapper and its own height is still the rows' height.

                  It cannot go directly inside `<ol>` — the content model there
                  is `<li>` only, and a stray `<span>` would be an actual
                  validity error, not a nitpick. */}
              <div className="sticky top-[120px]">
                <span
                  aria-hidden="true"
                  data-scene-part="rule-v"
                  className="pointer-events-none absolute top-0 left-0 h-full w-px bg-accent"
                />
                <ol className="border-t border-hairline">
                  {pillars.map((p, i) => (
                    <li key={p.id}>
                      <a
                      href={`#pillar-${p.id}`}
                      aria-current={active === i ? 'true' : undefined}
                      className={cx(
                        // `pl-4` clears the fill bar at the row's left edge —
                        // it insets the number and label, not the border:
                        // `border-b` is drawn on this same element's own
                        // border box, which padding never moves, so the rule
                        // still meets the fill bar and the ol's `border-t`
                        // at x=0 instead of floating 16px to its right.
                        'flex items-baseline gap-3 border-b py-4 pl-4 transition-colors duration-300',
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
              </div>
            </div>
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
            {/* The claim arrives a line at a time on the way down and unwinds on
                the way back up. Each line is timed against its own scroll range
                with an index offset for the cascade — these four sit within a
                couple of hundred pixels of each other, so their own ranges are
                nearly identical and the offset is what separates them.

                `Eyebrow` renders a <p> and does not forward `data-*`, so the
                part goes on a wrapper. Not worth widening that component's API
                for one caller — and a wrapper here is honest about what is
                being animated, which is the row, not the eyebrow's internals. */}
            <div className="col-span-4 md:col-span-5">
              <div
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 10%',
                  ['--scrub-to' as string]: 'cover 36%',
                }}
              >
                <Eyebrow
                  label="Built on the stack you already run"
                  tone="inverse"
                  className="mb-7"
                />
              </div>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 14%',
                  ['--scrub-to' as string]: 'cover 40%',
                }}
                className="display-4 max-w-[18ch]"
              >
                Logic Apps in production since{' '}
                <span className="text-signal">{productionSince.year}</span>.
              </p>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 18%',
                  ['--scrub-to' as string]: 'cover 44%',
                }}
                className="body-serif measure-serif mt-6 text-inverse-ink-2"
              >
                {productionSince.claim}
              </p>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 22%',
                  ['--scrub-to' as string]: 'cover 48%',
                }}
                className="caption mt-6 max-w-[44ch] text-inverse-ink-3"
              >
                {partnership}
              </p>
            </div>

            <ul
              data-scroll="breathe"
              className="col-span-4 mt-12 grid grid-cols-1 self-start border-t border-inverse-hairline-strong sm:grid-cols-2 md:col-span-6 md:col-start-7 md:mt-0"
            >
              {/* The stack list arrives row by row against the claim beside it.
                  Staggered by index rather than by column: this is a two-column
                  list read as one inventory, and the eye goes down it, so the
                  cascade should too. */}
              {technologies.map((t, i) => (
                <li
                  key={t.name}
                  data-scroll="enter"
                  style={{
                    ['--enter-y' as string]: '26px',
                    ['--scrub-from' as string]: `cover ${10 + i * 3}%`,
                    ['--scrub-to' as string]: `cover ${10 + i * 3 + 26}%`,
                  }}
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
