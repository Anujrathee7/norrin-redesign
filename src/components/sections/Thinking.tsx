import { Container, SectionHeader } from '@/components/primitives/Layout'
import { publications } from '@/data/norrin'
import { Nori } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'

/**
 * Thinking — the commitment ladder.
 *
 * Norrin's current homepage offers exactly one action: "Contact us". For a
 * high-consideration enterprise purchase that discards every visitor who is
 * researching rather than buying — which, this early in a cycle, is most of
 * them.
 *
 * All of these already exist publicly (a newsletter, a podcast, a gated vision
 * paper, a webinar). Presented as rungs ordered by what they ASK FOR, they let
 * someone convert months before they are ready to talk to sales.
 *
 * The webinar is the one their homepage promotes hardest — it sits in the band
 * directly under their hero, above their own thesis. Here it is last, because
 * it asks the most and because a dated promo is the most perishable thing a
 * homepage can lead with.
 *
 * Two deliberate absences:
 *
 * The rungs are not numbered. The heading directly above them says "Start
 * anywhere you like." and 01/02/03 in fixed order says the opposite, in the same
 * viewport. What the reader needs is the COMMITMENT each one asks for, which is
 * already the right-hand label — so that carries the row and the digit goes.
 *
 * The calls to action are not links. They were `<a href="#thinking">` inside
 * `<section id="thinking">` under labels naming real destinations. We hold no
 * sourced URL for any of the three, and inventing one is the same failure as
 * inventing a statistic, so the section states where they live instead.
 */

const RUNGS = [
  {
    step: 'Read',
    commitment: 'No email',
    title: publications.insights.title,
    body: publications.insights.excerpt,
    cta: 'Browse NorrInsights',
  },
  {
    step: 'Listen',
    commitment: 'No email',
    title: publications.pod.title,
    body: publications.pod.excerpt,
    cta: 'Listen to the Pod',
  },
  {
    step: 'Download',
    commitment: 'Email',
    title: publications.visionPaper.title,
    body: publications.visionPaper.excerpt,
    cta: publications.visionPaper.cta,
  },
  /**
   * The webinar — the one item from their "Highlights and News" band this
   * ladder had no rung for, which is why our panel offered three things where
   * their homepage offers four.
   *
   * IT GOES LAST, and that placement is the argument. Norrin runs this card in
   * the band directly under their hero, above their own thesis. It is the most
   * perishable thing on the page — a dated promo for one event — sitting in the
   * position that should carry the most durable. Here it is the top of the
   * ladder because it asks the most, not because it is the most important.
   *
   * "Registration" IS AN INFERENCE, and the only one in this file. Their card
   * does not say whether the webinar is gated, live or on demand, so this does
   * not claim an email is required — `Email` would have been that claim.
   * "Registration" describes the act a webinar involves and nothing more. If it
   * turns out to be an open link, the correction is one word.
   */
  {
    step: 'Attend',
    commitment: 'Registration',
    title: publications.webinar.title,
    body: publications.webinar.excerpt,
    cta: 'See upcoming webinars',
  },
]

export function Thinking() {
  return (
    <section
      id="thinking"
      data-shot="thinking"
      aria-labelledby="thinking-heading"
      className="bg-surface py-20 md:py-28"
    >
      <Container>
        <SectionHeader index="05" label="Thinking" id="thinking-heading">
          Start anywhere you like.
        </SectionHeader>

        {/* Wiped rather than faded: the rungs are one framed object, and a wipe
            crossing it reads as one gesture where four fades read as four
            separate arrivals. */}
        {/* The frame gets a `relative` wrapper for one reason: Nori peeks over
            its top border, and the border is on the <ul> two levels down inside
            an `overflow-hidden` frame — anything positioned in there would be
            clipped away. Anchored out here, `bottom-full` is all the placement
            it needs, because the bottom of the peek drawing IS the edge being
            peeked over. No offset, no magic number.

            This replaces a 150px `idea` parked beside the header. Same
            character, but touching something instead of floating next to it. */}
        {/* The drift is on this shared wrapper, not on the frame below it: Nori
            peeks over the frame's top border, and a figure resting on an edge
            has to travel with that edge or it drifts off the thing it is
            holding. One layer, two children. */}
        <div data-scroll="drift-slow" className="relative">
          {/* Present at every width now. The border it peeks over is the
              frame's own top edge, which exists on a phone exactly as it does on
              a desktop — this was hidden below `md` for size, not for want of
              something to hold on to, so it gets a narrower box instead of a
              breakpoint. Pulled in to `right-6` on small screens so it clears
              the frame's rounded corner. */}
          <div className="absolute right-6 bottom-full flex w-[84px] md:right-10 md:w-[124px] lg:right-20">
            {/* The float is still off — it would lift the fingers off the
                border being peeked over. The rock replaces it, pivoting on the
                bottom edge of the drawing, which IS the edge it is gripping
                (`NORI_ANCHOR.peek` is 100% for exactly that reason). Rotation
                there keeps the grip and tips the head, which is what peeking
                over something actually looks like. */}
            <div
              data-scroll="nori-sway"
              className="flex"
              style={{
                ['--pivot' as string]: `50% ${NORI_ANCHOR.peek.y}`,
                ['--sway' as string]: '3.2deg',
              }}
            >
              <div className="nori-idle">
                <Nori pose="peek" size={124} animated={false} />
              </div>
            </div>
          </div>

        {/* Uncovered left to right against its own scroll range, so it runs
            backwards when you scroll back up instead of being spent on the
            first pass. Still ONE gesture across the whole frame and not four
            staggered cells: the rungs are hairline-separated parts of a single
            object, and four arrivals would argue they are four competing
            boxes — which is the exact reading the frame was built to prevent.

            The clip lives on a wrapper rather than on the <ul>, because the
            <ul> is `overflow-hidden` (that is what clips the cells' square
            grounds to the rounded frame) and `overflow: hidden` is a scroll
            container — an element's own view timeline inside one never
            advances. Out here it is measured against the page. */}
        {/* Its own window, later and wider than the shared default. This is
            the tallest single object that animates on the page, and how far a
            block must travel before it is properly on screen scales with its
            height — a 40px list row is readable almost as soon as it appears, a
            302px frame is not. Measured at 900px viewport: the wipe now runs
            from the frame having ~200px on screen to it sitting complete near
            the middle, instead of finishing while it was still a sliver at the
            bottom edge. */}
        <div
          data-scroll="uncover"
          style={{
            ['--scrub-from' as string]: 'cover 16%',
            ['--scrub-to' as string]: 'cover 46%',
          }}
        >
          {/* One frame with four cells, not four cards.
              The rungs are hairline-separated already, so the radius goes on the
              OUTER edge and the interior stays ruled — sixteen rounded corners
              become four, and the block still reads as one object you can choose
              from rather than four competing boxes. `overflow-hidden` is what
              lets the cells' own square backgrounds be clipped by the frame.

              THE COLUMN COUNT HAS TO DIVIDE THE RUNGS. This was `md:grid-cols-3`
              when there were three; adding the webinar left a fourth cell alone
              on a second row beside two cells of bare frame — the one failure
              mode a single framed object cannot survive, because the empty space
              is inside the frame and reads as a rendering fault. Two-up from
              `md`, four-up from `xl` where there is room for four measures of
              this length. Never an odd column count while there are four. */}
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-hairline bg-hairline md:grid-cols-2 xl:grid-cols-4">
            {RUNGS.map((r) => (
              <li key={r.title} className="flex flex-col bg-surface p-7 md:p-9">
                <div className="mb-7 flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
                  <span className="label text-ink-3">{r.step}</span>
                  <span className="label text-ink-3">{r.commitment}</span>
                </div>

                <h3 className="display-4">
                  {r.title}
                </h3>
                <p className="caption mt-4 grow text-ink-2">{r.body}</p>

                <p className="mt-8 ui text-ink-3">{r.cta}</p>
              </li>
            ))}
          </ul>
        </div>
        </div>

        <p className="caption mt-8 text-ink-3">
          Each of these is published or announced on norrin.com. This speculative rebuild
          does not reproduce them, so the rungs above are shown rather than linked.
        </p>
      </Container>
    </section>
  )
}
