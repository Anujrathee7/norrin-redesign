import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { CardStack } from '@/components/primitives/CardStack'
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
    // `overflow-clip`, not `overflow-hidden`. The roster row below pans
    // horizontally on scroll and its travel has to go somewhere: unclipped it
    // pushed the document 74px wider than the viewport at 1512 and 96px at 390,
    // which is a horizontal scrollbar on every page — measured with
    // `scrollWidth - clientWidth`, which is the check the pan value was
    // originally set without. Clipping at the section edge lets the names run
    // off the side of the page like the roster being read out, which is the
    // effect that was wanted.
    //
    // It must be `clip` rather than `hidden`: `hidden` creates a scroll
    // container, and a `view()` timeline measured against a scroll container it
    // is itself inside freezes at 0% forever — the pan would simply stop
    // moving. `clip` clips identically without creating one.
    <section
      id="work"
      data-shot="work"
      aria-labelledby="work-heading"
      className="overflow-clip py-20 md:py-28"
    >
      <Container>
        {/* READING MATTER LEFT, THE PILE RIGHT.

            The intro used to sit top-right, opposite the heading, with the case
            rows full-width underneath. Both halves of that are gone: the text
            is one column now, and the pile stands beside it.

            THIS IS NOT ROLES' SPLIT REPEATED. Scope also runs heading-left,
            cards-right, and two sections tracing the same rectangle is the §1.5
            failure this whole redesign exists to answer. What separates them is
            what the right-hand column DOES: Scope holds four static cards in a
            2x2, contained; this holds one card with a pile behind it that deals
            a card off the edge of the page. Checked at 25%, which is the only
            zoom that question can be answered at.

            The pile is the last column of the grid, so its right edge is the
            container's — everything past it is gutter, and then the section's
            clip. That is what gives the dealt card somewhere to go. */}
        <Grid className="items-start">
          <div className="col-span-4 md:col-span-5">
            <SectionHeader index="04" label="Customers" id="work-heading" gap="tight">
              Forerunners, mostly Nordic.
            </SectionHeader>
            <p className="body-serif measure-serif mt-6 text-reading">{customersIntro}</p>
            {/* THE ROSTER, UNDER THE INTRO IT BELONGS TO.

                It used to be a full-width row of ten names set large, panning
                sideways on scroll, with the mascot sitting on its top rule. All
                three of those are gone.

                Set small and kept in this column, the names read as what they
                grammatically are: the list the sentence above them promises.
                Across the full width at 28px they were competing with the
                section heading for the same job.

                THE PAN WENT WITH THE WIDTH. Its whole argument was a long row
                travelling as you read past it — "the roster being read out" —
                and a column this wide has nowhere to travel to. Sliding it here
                would push names into the empty middle of the split, which is the
                gap that makes the split legible. `[data-scroll='pan']` had no
                other consumer and has been removed from index.css rather than
                left as a rule nothing uses.

                THE MASCOT WENT TOO. It sat on the roster's top rule, and that
                rule is gone. Nori is still on the timeline in Proof and on the
                rungs in Thinking, so the pose and its anchor keep earning their
                place — just not here. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-hairline pt-8">
              {customers.map((name, i) => (
                <li
                  key={name}
                  data-scroll="enter"
                  style={{
                    ['--enter-y' as string]: '16px',
                    // Staggered by column rather than by index: the two columns
                    // are already offset by sitting at different heights, so an
                    // index stagger would compound into a slow cascade down a
                    // list this short.
                    ['--scrub-from' as string]: `cover ${12 + (i % 2) * 5}%`,
                    ['--scrub-to' as string]: `cover ${12 + (i % 2) * 5 + 26}%`,
                  }}
                  className="ui text-ink-2"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Five columns starting at eight, leaving six and seven empty. The
              gap is what makes this a split rather than a two-cell grid — the
              same argument Roles makes about its own empty column. It also
              narrows the card: at six columns it was 744px, which sets the
              quote to two lines and reads as a panel lying on its side rather
              than as a card. */}
          <div className="col-span-4 mt-12 md:col-span-5 md:col-start-8 md:mt-0">
            <CardStack
              items={cases.map((c) => ({
                id: c.id,
                eyebrow: c.sector,
                title: c.client,
                lede: c.title,
                body: c.quote,
                note: 'attribution' in c && c.attribution ? c.attribution : undefined,
              }))}
            />
            <p className="caption mt-8 text-ink-3">
              Case summaries quoted from Norrin&rsquo;s published customer cases.
            </p>
          </div>
        </Grid>


      </Container>
    </section>
  )
}
