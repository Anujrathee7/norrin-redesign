import { Container, SectionHeader } from '@/components/primitives/Layout'
import { publications } from '@/data/norrin'

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
      // TOP PADDING IS 112px AT EVERY WIDTH, NOT 80 BELOW `md`. This section
      // opens `/company`, so what sits above it is not another section, it is a
      // 72px OPAQUE fixed header. At `py-20` an opener's eyebrow renders at y=80
      // against a bar edge of 73 — seven pixels, which reads as type resting on
      // the chrome rather than as a page starting. Measured, on the fifth
      // section to need it; every route opener is checked at 1512x950 and
      // 390x844 before it ships.
      className="bg-surface pt-28 pb-20 md:pt-18 md:pb-28"
    >
      <Container>
        <SectionHeader label="Thinking" id="thinking-heading">
          Start anywhere you like.
        </SectionHeader>

        {/* A scroll-controlled spotlight, not an autoplaying carousel. The
            runway supplies exactly three transitions for four cards. Each card
            moves independently into or away from the centre; the row itself
            never translates. Because the timeline is scroll progress, reversing
            direction reverses the same frame immediately with no duration to
            finish and no completed-state pause. */}
        <div data-thinking-stage>
          <div data-thinking-pin>
            <ol data-thinking-cards className="m-0 list-none p-0">
              {RUNGS.map((r, index) => (
                <li key={r.title} data-thinking-card={index} className="flex flex-col rounded-panel border border-hairline bg-ground p-7 md:p-9">
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
            </ol>
            <div data-thinking-progress aria-hidden="true">
              {RUNGS.map((r, index) => <span key={r.title} data-thinking-step={index} />)}
            </div>
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
