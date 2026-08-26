import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Nori } from '@/components/mascot/nori/Nori'
import { Reveal } from '@/components/primitives/Reveal'
import { story, timeline } from '@/data/norrin'

/**
 * Proof — how it got here.
 *
 * This was a four-across metric row above a timeline. The row is gone: two of
 * its four figures were already in the hero's station log one viewport earlier,
 * and a four-up stat strip is the single most template-coded block a consultancy
 * page can contain. The remaining two figures moved up to join the others.
 *
 * What is left is the better idea, which had been getting the smaller type. The
 * production-line device inverts cleanly for time — what has happened is solid,
 * what is still ahead is dashed — so the section argues in the page's own
 * grammar instead of asserting in numerals.
 *
 * The heading is now the recognition itself. It is the most differentiating fact
 * in the whole dataset and it was set at 14px grey behind a sun bullet that
 * measured 1.09:1 on paper, under the only sr-only heading on the page.
 */
export function Proof() {
  return (
    <section
      id="proof"
      data-shot="proof"
      aria-labelledby="proof-heading"
      className="py-24 md:py-36"
    >
      <Container>
        <Eyebrow index="06" label="Track record" className="mb-8" />

        {/* `read` sits at the end of the heading row rather than beside it: the
            heading is 22ch and stops well short of the column, so this is empty
            space being used rather than a figure pushing type around. The pose
            is the only one looking DOWN at something, and what is below it is
            the timeline the heading introduces. */}
        <div className="flex items-end justify-between gap-10">
          <h2 id="proof-heading" className="display-2 max-w-[22ch]">
            {story.recognition}
          </h2>
          <span data-scroll="drift-slow" className="hidden shrink-0 lg:block">
            <Nori pose="read" size={116} />
          </span>
        </div>

        {/* How it got here — on the same rule as everything else. */}
        {/* One rail, rotated — not a grid of separate rules.
            At `sm:grid-cols-2` this became two stacked pairs, so the line that
            carries the argument was snapped in half exactly at tablet. Below
            `lg` it is now vertical, the same device turned ninety degrees, which
            is how TheGap already handles its own narrow fallback.
            "Real" is drawn in moss here, as it is in the hero and the nav. It
            used to be `hairline-strong`, making this the one implementation of
            four that said "solid" in a different colour. */}
        <Reveal className="mt-20 md:mt-28" delay={0.1} variant="rise">
          <ol data-scroll="drift-slow" className="grid grid-cols-1 lg:grid-cols-4">
            {timeline.map((t) => {
              const ahead = 'future' in t && t.future
              return (
                <li
                  key={t.year}
                  className="relative pb-10 pl-8 last:pb-0 lg:pt-8 lg:pr-8 lg:pb-0 lg:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className={
                      'absolute top-0 left-0 ' +
                      (ahead
                        ? 'h-full w-0 border-l border-dashed border-inactive lg:h-0 lg:w-full lg:border-l-0 lg:border-t'
                        : 'h-full w-px bg-accent lg:h-px lg:w-full')
                    }
                  />
                  <span
                    aria-hidden="true"
                    className={
                      'absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2 ' +
                      (ahead ? 'border border-inactive bg-ground' : 'bg-accent')
                    }
                  />
                  <p
                    className={
                      'label tabular-nums ' + (ahead ? 'text-ink-3' : 'text-accent')
                    }
                  >
                    {t.year}
                    {ahead ? ' — ahead' : ''}
                  </p>
                  <h3 className="mt-3 text-ink lg:max-w-[22ch]">{t.title}</h3>
                  <p className="caption mt-2 max-w-[38ch] text-ink-2 lg:max-w-[30ch] lg:pb-8">{t.body}</p>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  )
}
