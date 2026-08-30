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
      // Symmetric padding again. `pb-0` was correct while this section ended
      // in a full-bleed band — a band running edge to edge IS the terminus and
      // does not also need setting away from the boundary — but the band is
      // gone and the section has to carry its own floor.
      className="bg-surface py-20 md:py-28"
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
              // Each article is its own scene, so the beats below are staged
              // against ITS arrival rather than against the column's. The column
              // is 1368px of content and the three articles reach the reader
              // minutes apart in scroll terms; one shared range would have the
              // last one's slot open while it was still far below the fold.
              //
              // Declaring `--scene` here shadows the Grid's for anything inside
              // this article, which is exactly what is wanted. The Grid's own
              // scene still serves the index rail, because the rail lives in the
              // sibling <nav> and never looks in here.
              <article
                key={p.id}
                id={`pillar-${p.id}`}
                data-scene
                ref={(el) => {
                  refs.current[i] = el
                }}
                className="relative scroll-mt-32 border-t border-hairline py-10 first:border-t-0 first:pt-0 md:py-14"
              >
                {/* The article's own rule goes moss as you reach it — drawn, not
                    switched. This is the same gesture the index rail beside it
                    already makes when a pillar becomes active (`border-accent`
                    on the current row), so the two halves of the section agree
                    about what "you are here" looks like instead of each having
                    its own idea. It draws OVER the static hairline rather than
                    replacing it, so a browser that cannot run it still sees a
                    ruled column.

                    Not on the first article: it carries `first:border-t-0`
                    because it sits directly under the section header, and a rule
                    drawing across nothing is a line with no job. */}
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    data-scene-part="rule"
                    style={{
                      ['--scene-from' as string]: 'cover 12%',
                      ['--scene-to' as string]: 'cover 32%',
                    }}
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent"
                  />
                ) : null}
                <h3
                  data-scene-part="enter"
                  style={{
                    ['--scene-from' as string]: 'cover 18%',
                    ['--scene-to' as string]: 'cover 42%',
                  }}
                  className="display-3"
                >
                  {p.name}
                </h3>
                <p
                  data-scene-part="enter"
                  style={{
                    ['--scene-from' as string]: 'cover 22%',
                    ['--scene-to' as string]: 'cover 46%',
                  }}
                  className="body-serif measure-serif mt-6 text-ink-2"
                >
                  {p.body}
                </p>
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
                    .map((sv, j) => (
                      <div
                        key={sv.name}
                        data-scene-part="enter"
                        style={{
                          // The service rows arrive after the claim they belong
                          // to, one behind the next. 3% apart rather than the
                          // wider steps used elsewhere: there are up to five of
                          // them and a generous stagger would still be running
                          // when the next article's rule starts drawing.
                          ['--enter-y' as string]: '22px',
                          ['--scene-from' as string]: `cover ${28 + j * 3}%`,
                          ['--scene-to' as string]: `cover ${28 + j * 3 + 22}%`,
                        }}
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
        // NOT A PLANE. This was a full-bleed forest band, and it was the only
        // one on the page that was a band INSIDE a section rather than a
        // section. Both of its edges sat in one viewport, so you looked AT it
        // instead of travelling through it — which is why it read as a slab
        // however it was painted, and it was painted three ways before that
        // became clear: full-strength forest, desaturated, and rehued warm.
        //
        // It also over-claimed. Forest is the loudest thing in this system and
        // it was spent on nine vendor names — evidence for a claim made 200px
        // earlier, which changes no rules and so should not change the plane.
        // TheGap and Contact keep theirs: they are sections you scroll through,
        // and each announces its crossing with the page's own device (a sun
        // leading-edge rule, the completing production line). This one had
        // nothing, which is what the border-y was compensating for.
        //
        // So it is the closing movement of Pillars now, on the section's own
        // surface, separated by a hairline — which is this system's first rule
        // and the one place that was not following it. The rule is
        // container-width, not full-bleed: Roles and Work already rule their
        // rows inside Container, and a full-bleed rule here would redraw the
        // section boundary this block just stopped being.
        //
        // `id` and `data-shot` stay. The nav drawer links to #platforms
        // ("Platforms we run", navData.ts) and tools/shot.mjs --clip=platforms
        // targets the shot name; scroll-mt-32 is what clears the fixed header.
        className="mt-20 scroll-mt-32 md:mt-24"
      >
        <Container>
          <div className="border-t border-hairline-strong pt-14 md:pt-16">
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
                <Eyebrow label="Built on the stack you already run" className="mb-7" />
              </div>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 14%',
                  ['--scrub-to' as string]: 'cover 40%',
                }}
                className="display-4 max-w-[18ch]"
              >
                {/* The year was sun. Sun is FILL ONLY, never type, on a paper
                    ground — it was type here purely because sun is the
                    inverse-mode stand-in for moss, which measures 1.40:1 on
                    forest. Off the band, that exemption is gone and the
                    emphasis goes back to the accent. Not a change to the sun
                    budget either way: that budget counts fills. */}
                Logic Apps in production since{' '}
                <span className="text-accent">{productionSince.year}</span>.
              </p>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 18%',
                  ['--scrub-to' as string]: 'cover 44%',
                }}
                className="body-serif measure-serif mt-6 text-ink-2"
              >
                {productionSince.claim}
              </p>
              <p
                data-scroll="enter"
                style={{
                  ['--scrub-from' as string]: 'cover 22%',
                  ['--scrub-to' as string]: 'cover 48%',
                }}
                className="caption mt-6 max-w-[44ch] text-ink-3"
              >
                {partnership}
              </p>
            </div>

            {/* Nine names, so the grid is THREE columns on desktop, not two.
                At two, nine items leave the ninth spanning the full width on a
                row of its own — an orphan under a rule as wide as the whole
                list — and a dead quadrant beside it. Three columns is a clean
                3×3 with no special case, which is why the `last:odd:col-span-2`
                rule that used to paper over it is gone.

                It also needs the width to do that: `col-start-6 / span-7`
                rather than `col-start-7 / span-6`, since "Azure Integration
                Services" will not sit on one line in a third of half the page.
                One column earlier is all it can take — the claim occupies 1–5,
                and starting at 5 puts both in the same track, which grid
                resolves by dropping the list onto a row of its own and making
                the band 100px TALLER than the layout it replaced.

                `md:self-end` bottom-aligns it against the claim. The two
                columns have different natural heights — the claim runs 255px,
                three rows of names run 151 — so one of them has to decide where
                the 104px difference goes. Top-aligned it fell under the list as
                185px of empty band, which is the same hole the old two-column
                grid left in the corner, moved to the floor. Ending both columns
                on one line is the thing a two-column block gets most out of;
                the air moves up beside the claim's own display type, where
                there is already air.

                The md overrides below are `odd:`/`even:`, not a flat `px-0`:
                `sm:even:pl-8` carries a pseudo-class and therefore outranks a
                plain `md:px-0` on specificity no matter which breakpoint comes
                later in the sheet, so every second name in the three-column
                grid kept a 32px indent that nothing had asked for. */}
            <ul
              data-scroll="breathe"
              className="col-span-4 mt-12 grid grid-cols-1 self-start border-t border-hairline-strong sm:grid-cols-2 md:col-span-7 md:col-start-6 md:mt-0 md:grid-cols-3 md:gap-x-6 md:self-end"
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
                  className="border-b border-hairline-strong py-3 sm:odd:pr-8 sm:even:pl-8 md:odd:pr-0 md:even:pl-0"
                >
                  <span className="ui">{t.name}</span>
                </li>
              ))}
            </ul>
            </Grid>
          </div>
        </Container>
      </div>
    </section>
  )
}
