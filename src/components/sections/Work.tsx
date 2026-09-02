import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { Nori } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'
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
        <Grid>
          <div className="col-span-4 md:col-span-6">
            <SectionHeader index="04" label="Customers" id="work-heading">
              Forerunners, mostly Nordic.
            </SectionHeader>
          </div>
          <div className="col-span-4 self-end md:col-span-5 md:col-start-8">
            <p className="body-serif measure-serif mb-12 text-reading md:mb-20">{customersIntro}</p>
          </div>
        </Grid>

        {/* The roster, as type. */}
        {/* A list of names being read out, so the whole row visibly travels as
            the section is scrolled — 38px was barely perceptible against a
            roster this wide.

            THE TRAVEL IS DERIVED FROM THE GUTTER, and the previous number was
            wrong twice over. `--pan` is the HALF-amplitude: the keyframes run
            from `+pan` to `-pan`, so `120px` was 240px of travel, not the
            "120px of total pan (60px each way)" the note here used to claim. At
            390px the gutter is 24px, so the row was sliding a hundred pixels
            past the edge of the page and `overflow-clip` was cutting the
            outermost names down to "vell", "onda" and "anska". Screenshotted,
            not deduced — and the note it replaces said it had been checked in
            the browser, which is a good reason to distrust a number that has no
            derivation attached.

            Nine tenths of the gutter is the most the row can move before type
            reaches the container edge, and it holds at every width by
            construction: 22px each way on a phone, 42px on a laptop. */}
        {/* Nori sits ON the roster's top rule — the one long uninterrupted
            horizontal in this section, with the intro paragraph's bottom margin
            clear above it.

            Placed by `NORI_ANCHOR.sit`, the measured height of the seat line
            within the drawing, so the hips land on the rule and the legs hang
            below it at any size. A hand-tuned `-translate-y-[58%]` would go
            quietly wrong the next time the pose file is edited.

            The wrapper is OUTSIDE the panning div on purpose: that div slides
            horizontally on scroll, and a mascot sitting on a rule should not
            slide with the names. */}
        <div className="relative">
          {/* Sized by a WRAPPER, not by the `size` prop. `size` sets the
              image's intrinsic width; the image's own `max-width: 100%` then
              lets a narrower box shrink it, which is how one placement serves
              both widths without a second copy of the markup. The anchor
              survives the resize for free because `NORI_ANCHOR.sit` is a
              PERCENTAGE, resolved against the element's own height — the hips
              land on the rule at 68px exactly as they do at 112px. */}
          <div
            className="absolute top-0 right-[6%] z-10 w-[68px] md:w-[112px]"
            style={{ transform: 'translateY(calc(-1 * ' + NORI_ANCHOR.sit.y + '))' }}
          >
            {/* `animated={false}` kills the idle FLOAT, which translates and
                would lift the hips off the rule — see anchors.ts. The rock below
                replaces it: rotation about the seat line leaves the seat line
                exactly where it is, so the figure moves and the contact does
                not. `flex` on the wrapper is load-bearing, not cosmetic; a block
                parent would add the inline-block's descender to its height and
                shift the percentage pivot off the anchor. */}
            <div
              data-scroll="nori-sway"
              className="flex"
              style={{ ['--pivot' as string]: `50% ${NORI_ANCHOR.sit.y}` }}
            >
              <div className="nori-idle">
                <Nori pose="sit" size={112} animated={false} />
              </div>
            </div>
          </div>

        <div
          data-scroll="pan"
          style={{ ["--pan" as string]: "calc(var(--spacing-gutter, 24px) * 0.9)" }}
        >
          {/* A grid, not flex-wrap: the old wrap produced nine names then a
              lone orphan at desktop, and 3/4/2/1 at 390px. */}
          {/* The names used to arrive on a one-shot `Reveal` and then sit still
              for good. Each now runs off its own scroll range, so the roster
              keeps working on the way back up.

              The travel is VERTICAL, which is not a stylistic choice: the row
              these names sit in already pans 120px sideways, and that number was
              picked against the narrowest grid as the most the outer columns can
              move before their text leaves the container. A horizontal entrance
              composes with an ancestor's horizontal transform and spends a
              margin someone measured. Down the same axis is free.

              Staggered by COLUMN (`i % 5`) rather than by index. The rows are
              already offset from each other by the plain fact that they sit at
              different heights, so an index stagger would compound with that
              and turn a sweep into a slow cascade — by the last name the
              opening ones would be long finished. Modulo the widest column
              count gives a clean left-to-right sweep at `md`, and something
              close to one at the narrower counts, which is as much as a
              breakpoint-blind number can promise. */}
          <ul className="grid grid-cols-2 items-baseline gap-x-8 gap-y-3 border-t border-hairline py-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-12">
            {customers.map((name, i) => (
              <li
                key={name}
                data-scroll="enter"
                style={{
                  ['--enter-y' as string]: '24px',
                  ['--scrub-from' as string]: `cover ${10 + (i % 5) * 4}%`,
                  ['--scrub-to' as string]: `cover ${10 + (i % 5) * 4 + 28}%`,
                }}
                className="text-[clamp(1.125rem,0.9rem+0.9vw,1.75rem)] font-medium tracking-[-0.02em] text-ink-2"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        </div>

        {/* Cases, as a pile.

            THE ONE IDEA TAKEN FROM THE REFERENCE. Everything else it showed —
            the avatar, the star rating, the "$250m revenue added" — is either
            unlicensed or invented, and the eight sections around this one are
            already built out of full-bleed bands and ruled rows. A pile is a
            silhouette this page does not otherwise have (§1.5), and it is an
            object sitting on a plane, which is what the radius rule sanctions.

            NO PERSON ON THE CARD. Three of the four cases name nobody, and the
            one that does — Skanska — is written ABOUT Artturi Kantanen in the
            third person. A ruled row carried that safely because it read as a
            case entry; a card with a name and a face at the top asserts "this
            person said this", which would manufacture an endorsement that does
            not exist. That is the same class of dishonesty as the `href="#work"`
            this file already demoted.

            The attribution itself stays, as a caption under the quote where it
            already was. It is sourced content, and losing real text to a
            styling change is the outcome this section's provenance rules exist
            to prevent.

            WHAT WAS REPLACED. Four full-width ruled rows, each uncovered left
            to right on its own scroll range. The rows were not broken; they
            were the ninth repetition of band-container-rule on one page, which
            is the §1.5 defect the whole redesign is answering. `data-scroll=
            "uncover"` still has a consumer in Thinking, so no CSS went dead.

            The mechanism, and every way to stop it, is in `CardStack`. */}
        <div className="mt-12 md:mt-16">
          <CardStack
            label="Customer cases"
            items={cases.map((c) => ({
              id: c.id,
              picker: c.client,
              eyebrow: c.sector,
              title: c.client,
              lede: c.title,
              body: c.quote,
              note: 'attribution' in c && c.attribution ? c.attribution : undefined,
            }))}
          />
        </div>

        <p className="caption mt-8 text-ink-3">
          Case summaries quoted from Norrin&rsquo;s published customer cases.
        </p>
      </Container>
    </section>
  )
}
