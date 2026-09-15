import { Tabs as TabsPrimitive } from 'radix-ui'
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
 * ---------------------------------------------------------------------------
 * AN INDEX AND ONE OPEN CARD — chosen by the user from four rendered layouts
 * ---------------------------------------------------------------------------
 * It replaced a draggable spotlight carousel that overlapped its cards and
 * cropped the two flanking ones mid-sentence. The four rungs are now a list on
 * the left — step, title, and what each asks for — and the selected rung opens
 * as one full card on the right. Nothing is cropped, nothing moves on its own
 * (so the carousel's open WCAG 2.2.2 pause question is gone with it), and the
 * ladder's order is visible all at once instead of one slot at a time.
 *
 * REAL TABS, FROM RADIX (§2.1). Roving tabindex, arrow keys and the
 * tab/panel wiring are the primitive's, not hand-written. `forceMount` keeps
 * all four panels rendered in one grid cell so the card area is always the
 * tallest card's size — switching never resizes the section or moves the list
 * — and the inactive three are `visibility: hidden`, which also takes them out
 * of the accessibility tree and the tab order, exactly as unmounting would.
 *
 * THE CARD takes its labels into the art as two pills (user pick, card 2):
 * the step top-left, the commitment top-right, the title settled at the art's
 * floor. The call to action stays a statement with no arrow — these rungs are
 * shown rather than linked, and an arrow is a link's affordance (§3).
 *
 * Two deliberate absences, unchanged:
 *
 * The rungs are not numbered. The heading directly above them says "Start
 * anywhere you like." and 01/02/03 in fixed order says the opposite, in the same
 * viewport. What the reader needs is the COMMITMENT each one asks for, which is
 * what the right-hand label in the index carries.
 *
 * The calls to action are not links. We hold no sourced URL for any of them, and
 * inventing one is the same failure as inventing a statistic, so the section
 * states where they live instead.
 */

const RUNGS = [
  {
    step: 'Read',
    commitment: 'No email',
    title: publications.insights.title,
    body: publications.insights.excerpt,
    detail: publications.insights.detail,
    cta: 'Browse NorrInsights',
  },
  {
    step: 'Listen',
    commitment: 'No email',
    title: publications.pod.title,
    body: publications.pod.excerpt,
    detail: publications.pod.detail,
    cta: 'Listen to the Pod',
  },
  {
    step: 'Download',
    commitment: 'Email',
    title: publications.visionPaper.title,
    body: publications.visionPaper.excerpt,
    detail: publications.visionPaper.detail,
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
   * IT IS A RECORDING, NOT AN EVENT. This rung read "Attend · Registration ·
   * See upcoming webinars" until the webinar's own page was read: it offers
   * "Download the webinar recording", so there is nothing to attend and no
   * "upcoming" to see. Whether that download sits behind a form is not visible
   * without running their page's scripts, so the commitment names the format
   * rather than claiming an email — `Email` would be that claim, unverified.
   */
  {
    step: 'Watch',
    commitment: 'Recording',
    title: publications.webinar.title,
    body: publications.webinar.excerpt,
    detail: publications.webinar.detail,
    cta: publications.webinar.cta,
  },
]

// The site-wide art names (index.css, THE ART CARD). The order keeps the colours
// this row had under its old pastel names: ocean, violet, ember, forest.
const TONES = ['slate', 'plum', 'clay', 'sage'] as const

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

        <TabsPrimitive.Root defaultValue={RUNGS[0].title} orientation="vertical" data-thinking-index>
          <TabsPrimitive.List aria-label="Thinking, by what each asks of you" data-thinking-list>
            {RUNGS.map((r) => (
              <TabsPrimitive.Trigger key={r.title} value={r.title} className="thinking-tab">
                <span className="label thinking-tab-step">{r.step}</span>
                <span className="thinking-tab-title">{r.title}</span>
                <span className="label thinking-tab-ask">{r.commitment}</span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div data-thinking-panels>
            {RUNGS.map((r, i) => (
              <TabsPrimitive.Content key={r.title} value={r.title} forceMount data-tone={TONES[i]}>
                <article className="art-card">
                  <div className="case-art">
                    <div className="art-top">
                      <span className="art-pill">{r.step}</span>
                      <span className="art-pill">{r.commitment}</span>
                    </div>
                    <h3 className="case-title">{r.title}</h3>
                  </div>
                  <div className="case-body">
                    <p className="case-summary">{r.body}</p>
                    <p className="art-detail">{r.detail}</p>
                    <p className="art-floor-note">{r.cta}</p>
                  </div>
                </article>
              </TabsPrimitive.Content>
            ))}
          </div>
        </TabsPrimitive.Root>

        <p className="caption mt-10 text-ink-3">
          Each of these is published or announced on norrin.com. This speculative rebuild
          does not reproduce them, so the rungs above are shown rather than linked.
        </p>
      </Container>
    </section>
  )
}
