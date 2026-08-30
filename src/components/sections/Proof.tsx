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
      className="py-20 md:py-28"
    >
      <Container>
        {/* Proof and Contact are the two sections that set their own eyebrow
            and heading rather than going through `SectionHeader`, so they do not
            inherit its scroll-driven line rise. Neither had any entrance at all
            — they simply existed — which was survivable when the rest of the page
            arrived once and stopped, and conspicuous now that everything around
            them keeps moving. Same offsets as Contact's, so the two hand-rolled
            headers behave like the four that are not. */}
        {/* PINNED, like The Gap, and for a reason that is arithmetic rather
            than taste.

            In normal flow this block scrolls at 1:1, so the distance between
            "the first entry appears at the bottom of the screen" and "the last
            entry is still somewhere you would look at it" is FIXED — measured
            here at about 640px. Padding cannot buy more: making the scene taller
            moves the percentages but not the pixels, because the block's
            position at a given scroll offset is unchanged. Four stations were
            being squeezed into that 640px, which is why the sequence felt
            hurried and why 2027 was landing with the block 158px from the top
            of the screen — already on its way out.

            Pinning removes the constraint entirely: the block stops moving, so
            the scroll available is whatever the runway says. 220svh gives about
            1140px of `contain` at a laptop — nearly double — and every station
            completes while the whole timeline is sitting still in front of you.

            THE HEADING IS INSIDE THE PIN, not above it. A 193px rail held alone
            leaves most of the screen empty for the whole hold; with the eyebrow
            and the claim held above it the composition is a page rather than a
            stripe. They carry no entrance of their own: an element inside a pin
            does not move, so its own `view()` timeline stops the moment the
            scene pins, and an entrance timed that way would freeze half-done.
            The hold IS their gesture. */}
        <div data-scene data-scene-runway className="h-[220svh]">
          <div data-scene-pin className="sticky top-[max(88px,12svh)]">
        <Eyebrow index="07" label="Track record" className="mb-8" />

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
        {/* Was a `Reveal` — one 56px rise on first sight, then finished for
            good. The rail inside it was already scroll-driven, so the block had
            the odd property that its container had stopped animating while its
            contents had not. It is a plain box now; everything that moves in
            here moves off the section's own scroll range. */}
        <div className="mt-20 md:mt-28">
          {/* The parallax drift that used to be here is gone. It was a
              `view()` timeline, and a stuck element does not move in the
              viewport — so from the moment the scene pins it would have frozen,
              which is the entire time this block is on screen. A parallax layer
              that cannot move is just a wrapper. The named `--scene` timeline
              on the runway above is what everything in here reads instead;
              named lookup walks the tree rather than hunting for a scrollport,
              so it reaches through the sticky child perfectly well. */}
          <div className="relative">
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
              <div
                data-scroll="nori-sway"
                className="flex"
                style={{ ['--pivot' as string]: `50% ${NORI_ANCHOR.stand.y}` }}
              >
                <div className="nori-idle">
                  <Nori pose="read" size={112} animated={false} />
                </div>
              </div>
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
              {/* Pivoting on the sole here too, even though nothing is under it
                  in this branch: a figure that rocks about its feet reads as
                  standing whatever it is standing on, and rocking about its
                  middle reads as floating. */}
              <div
                data-scroll="nori-sway"
                className="flex"
                style={{ ['--pivot' as string]: `50% ${NORI_ANCHOR.stand.y}` }}
              >
                <div className="nori-idle">
                  <Nori pose="read" size={112} animated={false} />
                </div>
              </div>
            </div>
            <ol className="grid grid-cols-1 lg:grid-cols-4">


            {timeline.map((t, i) => {
              const ahead = 'future' in t && t.future
              // Stagger by index so the rail draws in reading order rather
              // than all four segments completing at once, each slot opening
              // before the previous has finished (13% apart, 17% wide) so the
              // sweep reads as one continuous line being drawn rather than
              // four rules ticking off independently.
              //
              // `contain` is safe here BECAUSE the block is pinned, and it
              // was not safe before. `contain` is the period a scene is fully
              // inside the viewport, so its length is `sceneHeight -
              // viewportHeight` — which collapses toward zero as a scene
              // approaches the viewport's height, and that is what ruled it out
              // when this list was a 193px row in normal flow. A 220svh runway
              // is always more than a viewport tall by construction, so
              // `contain` is always about 120svh of scroll: roughly 1140px on a
              // laptop, and it cannot degenerate at any height.
              //
              // Four stations across 5%–80% of it, 25% wide and 17% apart, so
              // each takes ~285px of scrolling (it was 240) and the sequence
              // spans ~855px (it was 617). The last station closes at 80%,
              // leaving a fifth of the hold to look at a finished line before
              // the pin releases.
              const sceneRange = {
                ['--scene-from' as string]: `contain ${5 + i * 17}%`,
                ['--scene-to' as string]: `contain ${5 + i * 17 + 25}%`,
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
                  {/* The node arrives as its own rule reaches it. `pop` is the
                      one entrance in the layer allowed to fade, and this
                      qualifies on the same grounds the sun terminus does: it is
                      `aria-hidden`, carries no text, and has no contrast
                      requirement to fail. A mark that only slid would be
                      sitting on the rail before the rail got there.

                      Two boxes. The node's placement is a `translate` written
                      in classes, and an animation on the same element replaces
                      that transform outright rather than composing with it —
                      the dot would jump to the corner. So the positioning stays
                      on the span and the arrival goes on a wrapper. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2"
                  >
                    <span
                      data-scene-part="pop"
                      style={{
                        ['--scene-from' as string]: `contain ${5 + i * 17 + 11}%`,
                        ['--scene-to' as string]: `contain ${5 + i * 17 + 19}%`,
                      }}
                      className={
                        'block h-1.5 w-1.5 ' +
                        (ahead ? 'border border-inactive bg-ground' : 'bg-accent')
                      }
                    />
                  </span>
                  {/* The entry UNCOVERS left to right on the same scroll range
                      as the rule that reaches it, offset into the back half of
                      that draw — so the line arrives at a station and the
                      station's text is what it delivers, rather than the two
                      being separate events that happen to overlap.

                      A wipe rather than the lift this used to be, and it is the
                      right gesture for two reasons. It matches the rail: the
                      rule is already drawing left to right, and the year
                      appearing the same way reads as the line delivering it
                      rather than as a second, unrelated arrival. And it reads
                      as APPEARING, which a 28px lift does not — at half
                      progress a lift is 14px of offset on type that was legible
                      the whole time.

                      Reversal is free and exact. These are scroll ranges, not
                      triggers, so scrolling back up runs the clip the other
                      way: each entry re-covers right to left, and because the
                      entries are staggered left to right on the way down, the
                      LAST one is the first to go. Down the line assembles from
                      2012 outward; up it retreats from the future back. Nothing
                      had to be written for the reverse — it is the same
                      animation read backwards.

                      Fading was not an option and is worth recording as such:
                      axe folds ancestor opacity into contrast, and a year held
                      at part of its ink while it waits fails. `clip-path`
                      hides without touching a single colour value.

                      The dashed "ahead" entry gets the same treatment. What is
                      static about it is its dashes, not its right to arrive. */}
                  <div
                    data-scene-part="uncover"
                    style={{
                      ['--scene-from' as string]: `contain ${5 + i * 17 + 7}%`,
                      ['--scene-to' as string]: `contain ${5 + i * 17 + 25}%`,
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
          </div>
        </div>
      </Container>
    </section>
  )
}
