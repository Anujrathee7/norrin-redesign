import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Nori } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'
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
        {/* Proof and Contact are the two sections that set their own eyebrow
            and heading rather than going through `SectionHeader`, so they do not
            inherit its scroll-driven line rise. Neither had any entrance at all
            — they simply existed — which was survivable when the rest of the page
            arrived once and stopped, and conspicuous now that everything around
            them keeps moving. Same offsets as Contact's, so the two hand-rolled
            headers behave like the four that are not. */}
        <div
          data-scroll="enter"
          style={{
            ['--scrub-from' as string]: 'cover 10%',
            ['--scrub-to' as string]: 'cover 34%',
          }}
        >
          <Eyebrow index="06" label="Track record" className="mb-8" />
        </div>

        <h2
          id="proof-heading"
          data-scroll="enter"
          style={{
            ['--scrub-from' as string]: 'cover 14%',
            ['--scrub-to' as string]: 'cover 38%',
          }}
          className="display-2 max-w-[22ch]"
        >
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
        {/* Was a `Reveal` — one 56px rise on first sight, then finished for
            good. The rail inside it was already scroll-driven, so the block had
            the odd property that its container had stopped animating while its
            contents had not. It is a plain box now; everything that moves in
            here moves off the section's own scroll range. */}
        <div className="mt-20 md:mt-28">
          {/* `data-scene` here declares the named view-timeline the rule
              segments below read from. It sits fine on the same element as
              `data-scroll="drift-slow"` — that drift is a `transform`
              animation on the ol itself, `view-timeline-name` is not a
              transform and doesn't compose with or fight it, so the rail can
              keep drifting AND hand its scroll range down to its own
              children at the same time. */}
          {/* `drift-slow` sits on this wrapper rather than on the <ol> so the
              rail and the figure standing on it move as ONE layer — see the
              note on the mascot. `data-scene` stays on the <ol>, whose scroll
              range is what the segments below read: `view-timeline-name` is
              not a transform, so it neither composes with nor fights the drift
              on the wrapper above it. */}
          <div data-scroll="drift-slow" className="relative">
            {/* Standing ON the rail, at the far end of it — over the one entry
                that has not happened yet, reading about it.

                `NORI_ANCHOR.stand` is the sole of the drawing, so the feet land
                on the line instead of the box's bottom edge floating above it.

                It used to sit INSIDE the <ol>, to ride the rail's drift. axe
                caught that: the content model there is <li>, <script>,
                <template> and nothing else, so a positioned <div> among the
                items is a genuine validity error, not a nitpick — the same one
                that kept the Pillars progress fill out of its own list. The
                drift moved out to the shared wrapper instead, so the rail and
                the figure standing on it still travel as one layer.

                lg only — below that the rail is vertical and there is no
                horizontal line to stand on. This box carries only the
                inline `translateY` anchor transform and no scene part, on
                purpose: an animation on this same element would replace
                that transform outright rather than combine with it, and
                Nori would stop standing on the line. */}
            <div
              className="absolute top-0 right-0 z-10 hidden w-[112px] lg:block"
              style={{ transform: 'translateY(calc(-1 * ' + NORI_ANCHOR.stand.y + '))' }}
            >
              <Nori pose="read" size={112} animated={false} />
            </div>
            {/* The same figure over the same entry, below `lg`, where the rail
                is vertical and the entry it is reading about is the LAST one
                rather than the rightmost. No `stand` anchor here: that anchor
                puts the soles on a horizontal rule and there is no horizontal
                rule in this branch, so applying it would lift the figure by 85%
                of its own height for no reason. It sits beside the final entry
                instead, which is what standing at the end of the line means
                when the line runs downwards. */}
            <div className="absolute right-0 bottom-0 z-10 w-[84px] lg:hidden">
              <Nori pose="read" size={112} animated={false} />
            </div>
            <ol data-scene className="grid grid-cols-1 lg:grid-cols-4">


            {timeline.map((t, i) => {
              const ahead = 'future' in t && t.future
              // Stagger by index so the rail draws in reading order rather
              // than all four segments completing at once, each slot opening
              // before the previous has finished (13% apart, 17% wide) so the
              // sweep reads as one continuous line being drawn rather than
              // four rules ticking off independently.
              //
              // MEASURED IN `cover`, NOT `contain`. `contain` is the period the
              // block is fully inside the viewport, so its length is
              // `viewportHeight - blockHeight` — which shrinks as the block
              // grows. At desktop this list is a 193px four-column row and
              // `contain` is a roomy 757px of scroll; at phone width the same
              // list is a 507px stack and `contain` collapses to 273px, so all
              // four stations drew inside a third of a screen. That is the
              // opposite of the pacing this device is for. `cover` is
              // `blockHeight + viewportHeight`, which GROWS with the block:
              // 1143px at desktop, 1287px on a phone. The window below spans
              // 10%–70% of it, which comes out at 686px and 772px — close to
              // what desktop already had, and nearly three times what the phone
              // was getting.
              //
              // The last slot closes at 68%, comfortably inside the block's
              // stay rather than exactly as it leaves. A rail that finishes
              // drawing while you can still see all of it is the point; landing
              // the final stroke on the way out just means it completes
              // off-screen.
              const sceneRange = {
                ['--scene-from' as string]: `cover ${10 + i * 13}%`,
                ['--scene-to' as string]: `cover ${10 + i * 13 + 17}%`,
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
                  {/* The entry's copy rides in on the same scroll range as the
                      rule that reaches it, offset into the back half of that
                      draw — so the line arrives at a station and the station's
                      text is what it delivers, rather than the two being
                      separate events that happen to overlap. The dashed "ahead"
                      entry gets the same treatment: what is static about it is
                      its dashes, not its right to arrive. */}
                  <div
                    data-scene-part="enter"
                    style={{
                      ['--enter-y' as string]: '28px',
                      ['--scene-from' as string]: `cover ${10 + i * 13 + 6}%`,
                      ['--scene-to' as string]: `cover ${10 + i * 13 + 19}%`,
                    }}
                  >
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
                  </div>
                </li>
              )
            })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
