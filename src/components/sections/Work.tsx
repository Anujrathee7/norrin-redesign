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
      // THE NIGHT BAND. Full-bleed, edge to edge — the background is on the
      // SECTION, which already spans the viewport, so there is no inset panel
      // and `--radius-section` stays unspent and still flagged in §4.
      //
      // FIXED IN BOTH THEMES. `--band-night` is `--ground`'s dark branch pinned,
      // and index.css carries the argument: the pile on it is four sheets
      // separated by tone, and a ground that flips takes that separation with it.
      //
      // `data-tone="inverse"` is the page's existing switch for "this plane is
      // dark". It is what repaints the focus ring in sun, which is the one thing
      // in this section that axe cannot check and that this repo has shipped two
      // real bugs in.
      //
      // `overflow-clip` STAYS, and not as a formality: the deal keyframe throws
      // the leaving card to `translate(128%)` and something has to take it, and
      // `hidden` would create a scroll container that freezes the roster's
      // `view()` timeline at 0% forever. The comment above says so at length.
      data-tone="inverse"
      // THE SECTION MOVES DOWN. THE PILE DOES NOT MOVE INSIDE IT.
      //
      // The position row — the 3px bar above the front card — was invisible, and
      // measured rather than eyeballed: the pile column carries `md:-mt-18`, so
      // against a 112px top padding the region began at y=40 and the bar
      // occupied y=40 to 43, entirely beneath a 72px OPAQUE fixed header whose
      // edge sits at 73. It was 33px the wrong side of it. Work opens `/work`
      // now; when it was the fifth section of one long document there was
      // nothing above it to hide under.
      //
      // THIS IS NOT THE FROZEN PILE OFFSET BEING ADJUSTED. The note further down
      // this file says the column start and the negative top margin are the
      // repo owner's own edit and that nothing here may move the pile to
      // compensate for something else. Both are untouched: `md:-mt-18` still
      // pulls the pile exactly 72px above the content top, so the card's top
      // edge still rides 21px above the heading's and the two columns still
      // refuse to read as two halves of one band. What changed is where the
      // section's content top IS — 168px instead of 112 — which moves the pile
      // and the heading together and leaves every relationship inside the
      // section identical. The bar lands at y=96, clearing the header by 23px.
      //
      // Mobile takes 112 rather than 80 for the same reason Pillars does: at
      // `py-20` the eyebrow rendered 7px under the bar's edge. `-mt-18` is `md:`
      // only, so the pile is not involved down there.
      className="overflow-clip bg-band-night pt-28 pb-20 text-inverse-ink md:pt-42 md:pb-14"
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

            THE PILE NO LONGER ENDS AT THE CONTAINER'S RIGHT EDGE, and that is
            the change rather than an oversight. It used to start at column 8 and
            be right-aligned inside its cell, which put the front card hard
            against the container edge and sent the three cards behind it
            stepping OUT of the container — visible as a sheared right edge at
            390, where the deepest card ended 24px outside the viewport and the
            section's clip took it.

            It is LEFT-ALIGNED in its cell now, so the pile grows into the
            column's own slack instead of out of it. The dealt card still has
            somewhere to go: it travels 128% of the card's width to the right,
            which is well past the container and into the clip from anywhere in
            this cell.

            THE COLUMN START AND THE NEGATIVE TOP MARGIN ARE THE USER'S OWN
            EDIT AND ARE FROZEN. This pass moved the pile a column further left
            and it was moved back by hand; the placement here is the one that was
            chosen by looking at it. Nothing in this file may adjust the pile's
            position to compensate for something else — a wider card, a taller
            title, different padding. If one of those stops fitting, the thing
            that changed is what gives. */}
        <Grid className="items-start">
          <div className="col-span-4 md:col-span-5">
            <SectionHeader label="Customers" id="work-heading" gap="tight" tone="inverse">
              Forerunners, mostly Nordic.
            </SectionHeader>
            <p className="body-serif measure-serif mt-6 text-inverse-ink-2">{customersIntro}</p>
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
                rule is gone. Nori has since been deleted from the codebase
                altogether, so there is no remaining consumer of the pose or its
                anchor anywhere on the page. */}
            {/* NINE OF THE TEN, and the tenth is left out on purpose rather than
                by accident. `customers` in norrin.ts keeps all ten, because that
                array is the record of what Norrin publishes and it should stay
                complete. This is a display choice: nine names fill three columns
                exactly, and nothing on this page claims the list is exhaustive —
                the sentence above it says "most of our customers", not "all".
                The moment anything here does claim completeness, this filter has
                to go. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-inverse-hairline pt-8 sm:grid-cols-3">
              {customers
                .filter((name) => name !== 'Plan International Finland')
                .map((name, i) => (
                <li
                  key={name}
                  data-scroll="enter"
                  style={{
                    ['--enter-y' as string]: '16px',
                    // Staggered by column rather than by index: the columns
                    // are already offset by sitting at different heights, so an
                    // index stagger would compound into a slow cascade down a
                    // list this short.
                    ['--scrub-from' as string]: `cover ${12 + (i % 3) * 4}%`,
                    ['--scrub-to' as string]: `cover ${12 + (i % 3) * 4 + 26}%`,
                  }}
                  className="ui text-inverse-ink-2"
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
          {/* `md:-mt-18` — the card's top edge rides above the heading's, which
              is what stops the two columns reading as two halves of the same
              band. The quotation mark hangs a further 13px above the card, and
              the section's own top padding is 112px, so there is still 27px of
              clearance to the section's clip box at the tightest viewport.

              `pr` is gone with the right-alignment: it existed to hold the card
              off the container's right edge, and the card is no longer near it.
              Keeping it would have cost the tablet column 50px of a 306px
              budget, which comes straight off the quote's measure. */}
          <div className="col-span-4 mt-12 md:col-span-5 md:col-start-8  md:-mt-18">
            <CardStack
              items={cases.map((c) => ({
                id: c.id,
                // The design puts a name and a role on the card floor. Ours are a
                // company and a sector, because that is what a case is about — see
                // the note in CardStack about the avatar that is not there.
                who: c.client,
                role: c.sector,
                kicker: c.title,
                body: c.quote,
                note: 'attribution' in c && c.attribution ? c.attribution : undefined,
              }))}
            />
          </div>
        </Grid>


      </Container>
    </section>
  )
}
