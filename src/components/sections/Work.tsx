import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { Reveal } from '@/components/primitives/Reveal'
import { cases, customers, customersIntro } from '@/data/norrin'

/**
 * Work — the roster and the cases.
 *
 * Norrin lists ten recognisable Nordic enterprises on their homepage as a row
 * of plain text links, giving their single strongest piece of peer proof the
 * same visual weight as a footer menu. Here the names are set large, as type.
 *
 * We deliberately do NOT reproduce customer logos: this is an unsolicited
 * speculative redesign and we hold no licence to those marks. Typographic
 * treatment is both the honest option and the better-looking one.
 *
 * Every case line below is quoted verbatim from Norrin's public case pages.
 * No outcome, metric or client name here is invented.
 *
 * The rows are articles, not links. They were `<a href="#work">` inside
 * `<section id="work">` — four affordances promising a destination that was the
 * top of the row you were already in. A fabricated affordance is the same class
 * of dishonesty as a fabricated testimonial, and this build's whole case rests
 * on not doing that. The completing-rule gesture went with them: it is the
 * page's signature and it should never fire on something that cannot be opened.
 */
export function Work() {
  return (
    <section id="work" data-shot="work" aria-labelledby="work-heading" className="py-24 md:py-36">
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-6">
            <SectionHeader index="04" label="Customers" id="work-heading">
              Forerunners, mostly Nordic.
            </SectionHeader>
          </div>
          <div className="col-span-4 self-end md:col-span-5 md:col-start-8">
            <p className="body-serif measure-serif mb-12 text-ink-2 md:mb-20">{customersIntro}</p>
          </div>
        </Grid>

        {/* The roster, as type. */}
        {/* A fast tick across the roster — this is a list of names being read
            out, so the stagger is tight and the travel is small. */}
        <Reveal stagger={0.04} variant="left">
          {/* A grid, not flex-wrap: the old wrap produced nine names then a
              lone orphan at desktop, and 3/4/2/1 at 390px. */}
          <ul className="grid grid-cols-2 items-baseline gap-x-8 gap-y-3 border-t border-hairline py-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-12">
            {customers.map((name) => (
              <li
                key={name}
                className="text-[clamp(1.125rem,0.9rem+0.9vw,1.75rem)] font-medium tracking-[-0.02em] text-ink-2"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Cases, as full-width rows. Each row is uncovered left to right, in
            sequence — a wipe suits a ruled row better than a fade, because the
            rule above it is already a horizontal gesture. */}
        <Reveal as="ol" stagger={0.12} variant="wipe" className="mt-12 md:mt-16">
          {cases.map((c, i) => (
            <li key={c.id}>
              <article className="block border-t border-hairline py-9 last:border-b md:py-11">
                <div className="grid grid-cols-4 items-baseline gap-x-6 md:grid-cols-12">
                  <span
                    className="label col-span-1 text-ink-3 tabular-nums max-md:hidden"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="col-span-4 md:col-span-3">
                    <h3 className="display-4">{c.client}</h3>
                    <p className="label mt-2 text-ink-3">{c.sector}</p>
                  </div>

                  {/* One column width for every row. The old branch narrowed
                      this to make room for a figure only Caruna has, which moved
                      the body column's right edge ~250px between row 1 and rows
                      2-4 inside a full-width-ruled table. */}
                  <div className="col-span-4 mt-4 md:col-span-7 md:col-start-6 md:mt-0">
                    <p className="text-ink">{c.title}</p>
                    <p className="body-serif measure-serif mt-3 text-ink-2">{c.quote}</p>
                    {'attribution' in c && c.attribution ? (
                      <p className="caption mt-3 text-ink-3">{c.attribution}</p>
                    ) : null}
                  </div>

                </div>
              </article>
            </li>
          ))}
        </Reveal>

        <p className="caption mt-8 text-ink-3">
          Case summaries quoted from Norrin&rsquo;s published customer cases.
        </p>
      </Container>
    </section>
  )
}
