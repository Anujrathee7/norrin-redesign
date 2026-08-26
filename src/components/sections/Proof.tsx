import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Nori } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'
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

        <h2 id="proof-heading" className="display-2 max-w-[22ch]">
          {story.recognition}
        </h2>

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
          {/* `data-scene` here declares the named view-timeline the rule
              segments below read from. It sits fine on the same element as
              `data-scroll="drift-slow"` — that drift is a `transform`
              animation on the ol itself, `view-timeline-name` is not a
              transform and doesn't compose with or fight it, so the rail can
              keep drifting AND hand its scroll range down to its own
              children at the same time. */}
          <ol
            data-scroll="drift-slow"
            data-scene
            className="relative grid grid-cols-1 lg:grid-cols-4"
          >
            {/* Standing ON the rail, at the far end of it — over the one entry
                that has not happened yet, reading about it.

                `NORI_ANCHOR.stand` is the sole of the drawing, so the feet land
                on the line instead of the box's bottom edge floating above it.
                Inside the <ol> on purpose: the rail drifts, and a figure
                standing on a rule has to drift with it or it walks off.

                lg only — below that the rail is vertical and there is no
                horizontal line to stand on. This box carries only the
                inline `translateY` anchor transform and no scene part, on
                purpose: an animation on this same element would replace
                that transform outright rather than combine with it, and
                Nori would stop standing on the line. */}
            <div
              className="absolute top-0 right-0 z-10 hidden lg:block"
              style={{ transform: 'translateY(calc(-1 * ' + NORI_ANCHOR.stand.y + '))' }}
            >
              <Nori pose="read" size={112} animated={false} />
            </div>

            {timeline.map((t, i) => {
              const ahead = 'future' in t && t.future
              // Stagger by index so the rail draws in reading order rather
              // than all four segments completing at once. Four items over
              // one `contain` range, each slot opening before the previous
              // has finished (24% apart, 28% wide) so the sweep reads as one
              // continuous line being drawn rather than four rules ticking
              // off independently — the same overlap idea `stage` already
              // uses elsewhere in this file, just tuned so the LAST item's
              // `to` lands on exactly `contain 100%`: the rail finishes
              // drawing precisely when the block finishes scrolling through,
              // not early with a dead zone after, not late and clipped.
              const sceneRange = {
                ['--scene-from' as string]: `contain ${i * 24}%`,
                ['--scene-to' as string]: `contain ${i * 24 + 28}%`,
              }
              return (
                <li
                  key={t.year}
                  className="relative pb-10 pl-8 last:pb-0 lg:pt-8 lg:pr-8 lg:pb-0 lg:pl-0"
                >
                  {ahead ? (
                    // The dashed "ahead" segment carries no scene part and no
                    // animation at all — it is static in its dashed state by
                    // construction, which is how this section's whole
                    // argument (solid = happened, dashed = still ahead) stays
                    // true no matter how far the reader scrolls. There is
                    // nothing here that could ever fill.
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 h-full w-0 border-l border-dashed border-inactive lg:h-0 lg:w-full lg:border-l-0 lg:border-t"
                    />
                  ) : (
                    // Two sibling spans rather than one responsive span:
                    // `rule` and `rule-v` are different animation-name /
                    // keyframe pairs (scaleX vs scaleY), and a `data-*`
                    // value can't be switched at a Tailwind breakpoint. Each
                    // orientation is its own element, shown with
                    // `hidden lg:block` / `lg:hidden` so exactly one is ever
                    // in the accessibility tree and exactly one ever has its
                    // keyframes running at a given viewport width.
                    <>
                      <span
                        aria-hidden="true"
                        data-scene-part="rule"
                        style={sceneRange}
                        className="absolute top-0 left-0 hidden h-px w-full bg-accent lg:block"
                      />
                      <span
                        aria-hidden="true"
                        data-scene-part="rule-v"
                        style={sceneRange}
                        className="absolute top-0 left-0 h-full w-px bg-accent lg:hidden"
                      />
                    </>
                  )}
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
