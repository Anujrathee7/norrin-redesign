import { Container, Eyebrow } from '@/components/primitives/Layout'
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
 *
 * ---------------------------------------------------------------------------
 * THE RAIL IS NOW A STATION LINE, not four ruled columns of type.
 *
 * Each milestone gets a date pill sitting on the rail at its node and a card
 * holding the title and the copy, and the cards ALTERNATE above and below the
 * line. That alternation is not styling: §1.5 is the anti-band rule, and four
 * equal cards in a row under a rule is a band — the same rectangle the section
 * above it traces. Staggered, the section's silhouette is a zig-zag that
 * nothing else on the page shares.
 *
 * WHAT IS TRUE ABOUT 2027, AND HOW THE MARKUP SAYS SO. `future: true` is the
 * only input; nothing here counts indices. It drives four things at once:
 *
 *   - the segment ARRIVING at it is dashed. That segment belongs to 2025, which
 *     is why the dash is computed from `marks[i + 1].ahead` — the segment is
 *     dashed because of where it is going, not because of where it starts.
 *   - the node is hollow rather than filled.
 *   - the accent fill does not exist on that segment, so the drawn line stops
 *     at 2025 no matter how far anyone scrolls. There is nothing that could
 *     fill it.
 *   - the pill carries a visually-hidden "planned". A dash and a hollow ring
 *     are visual-only signals, and a screen-reader user given "2027 — Public
 *     listing" with no qualifier has been told something that is not true.
 *
 * Nothing about the ahead segment is animated. A progress bar that ran to the
 * end of the rail would assert a public listing that has not happened, which is
 * §3, not decoration.
 */
export function Proof() {
  /* Flattened once here rather than probed inside the map. The dash on a
     segment depends on the NEXT station's flag, and `'future' in t` narrowing
     inside a `timeline[i + 1]` lookup is both unreadable and easy to get
     silently wrong when the data grows a fifth entry. */
  const marks = timeline.map((t) => ({
    year: t.year,
    title: t.title,
    body: t.body,
    ahead: 'future' in t && t.future === true,
  }))

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

            {/* Was a `Reveal` — one 56px rise on first sight, then finished for
                good. The rail inside it was already scroll-driven, so the block
                had the odd property that its container had stopped animating
                while its contents had not. It is a plain box now; everything
                that moves in here moves off the section's own scroll range. */}
            {/* HALVED, and the arithmetic is worth writing down because the
                obvious reading of "the track sits too low" points at the wrong
                number.

                The distance from the heading to the RAIL is three things:
                this margin, the height of the tallest card in the row above the
                rail, and the 24px row gap. At 1512 that was 80 + 156 + 24 =
                260px. Only the first of those is a spacing decision — the other
                184px is a card, and shrinking it would mean shrinking the copy.

                The mascot that used to stand here was `position: absolute`, so
                removing it took exactly 0px out of this gap at any width above
                `md`. It is recorded because it is the thing most likely to be
                credited with the change: 80 -> 80 on removal, 80 -> 40 here.
                The rail moved from 260px below the heading to 220px. */}
            <div className="mt-8 md:mt-10">
              {/* The parallax drift that used to be here is gone. It was a
                  `view()` timeline, and a stuck element does not move in the
                  viewport — so from the moment the scene pins it would have
                  frozen, which is the entire time this block is on screen. A
                  parallax layer that cannot move is just a wrapper. The named
                  `--scene` timeline on the runway above is what everything in
                  here reads instead; named lookup walks the tree rather than
                  hunting for a scrollport, so it reaches through the sticky
                  child perfectly well. */}
              {/* NO MASCOT HERE ANY MORE, and the removal is the user's call
                  rather than a tidy-up. Two figures used to stand on this rail —
                  one on the horizontal line at the far right, one beside the
                  last entry in the narrow branch — and both are gone. Nori
                  has since been deleted from the codebase entirely, on the
                  user's instruction: the component, its poses, the `#mascots`
                  surface and the `nori-sway` / `nori-idle` CSS are all gone.

                  One thing the mascot used to justify is worth keeping, because
                  it is still true without it: the list's two card rows are equal
                  `1fr` tracks, so the rail sits at exactly half the block's
                  height and the composition is symmetric about it. That was
                  argued in index.css as "which is why the figure standing on it
                  can be positioned against the wrapper" — the arithmetic
                  survives the argument. */}
              <div className="relative">
                <ol className="tl">
                  {marks.map((m, i) => {
                    const last = i === marks.length - 1
                    /* The segment leaving this station is dashed when the
                       station it ARRIVES at has not happened — and the trailing
                       run past the final station is dashed for the same reason,
                       because there is no station on it at all. Both branches
                       read `ahead`; neither reads `i`. */
                    const dashed = last ? m.ahead : marks[i + 1].ahead

                    /* Stations 18% apart across the hold, each taking about 20%
                       of it, so the sweep reads as one continuous line being
                       drawn rather than four rules ticking off independently.
                       The last card finishes at 79%, leaving a fifth of the
                       hold to look at a finished rail before the pin releases.

                       `contain` is safe here BECAUSE the block is pinned, and it
                       was not safe before. `contain` is the period a scene is
                       fully inside the viewport, so its length is `sceneHeight -
                       viewportHeight` — which collapses toward zero as a scene
                       approaches the viewport's height, and that is what ruled
                       it out when this list was a 193px row in normal flow. A
                       220svh runway is always more than a viewport tall by
                       construction, so `contain` is always about 120svh of
                       scroll: roughly 1140px on a laptop, and it cannot
                       degenerate at any height. */
                    const s = 4 + i * 18

                    return (
                      <li
                        key={m.year}
                        className="tl-item"
                        data-side={i % 2 === 0 ? 'above' : 'below'}
                        data-ahead={m.ahead ? '' : undefined}
                      >
                        <div className="tl-mark">
                          {/* The node arrives as the rail reaches it. `pop` is
                              the one entrance in the layer allowed to fade, and
                              this qualifies on the same grounds the sun terminus
                              does: it is `aria-hidden`, carries no text, and has
                              no contrast requirement to fail. A mark that only
                              slid would be sitting on the rail before the rail
                              got there. */}
                          <span
                            aria-hidden="true"
                            data-scene-part="pop"
                            style={{
                              ['--scene-from' as string]: `contain ${s}%`,
                              ['--scene-to' as string]: `contain ${s + 8}%`,
                            }}
                            className="tl-node"
                          />
                          <p className="tl-pill label tabular-nums">
                            {m.year}
                            {/* The non-visual half of "this has not happened".
                                Everything else that says so — the dash, the
                                hollow node, the rail stopping short — is
                                pixels. */}
                            {m.ahead ? <span className="sr-only"> — planned</span> : null}
                          </p>

                          {/* The rail. The dim base is static and unconditional;
                              the accent fill is a second element on top of it,
                              and it only exists where the line is solid. */}
                          <span
                            aria-hidden="true"
                            className="tl-seg"
                            data-dash={dashed ? '' : undefined}
                          >
                            {dashed ? null : (
                              <>
                                <span
                                  data-scene-part="rule"
                                  style={{
                                    ['--scene-from' as string]: `contain ${s + 4}%`,
                                    ['--scene-to' as string]: `contain ${s + 21}%`,
                                  }}
                                  className="tl-fill tl-fill-h"
                                />
                                <span
                                  data-scene-part="rule-v"
                                  style={{
                                    ['--scene-from' as string]: `contain ${s + 4}%`,
                                    ['--scene-to' as string]: `contain ${s + 21}%`,
                                  }}
                                  className="tl-fill tl-fill-v"
                                />
                              </>
                            )}
                          </span>
                        </div>

                        {/* The card UNCOVERS left to right on the same scroll
                            range as the segment leaving its station, so the line
                            arrives and the card is what it delivers, rather than
                            the two being separate events that happen to overlap.

                            A wipe rather than a lift. It matches the rail — the
                            line is already drawing left to right — and it reads
                            as APPEARING, which a 28px lift does not: at half
                            progress a lift is 14px of offset on type that was
                            legible the whole time.

                            Reversal is free and exact. These are scroll ranges,
                            not triggers, so scrolling back up runs the clip the
                            other way and the cards re-cover right to left,
                            newest first. Nothing had to be written for it.

                            Fading was not an option and is worth recording as
                            such: axe folds ancestor opacity into contrast, and a
                            card held at part of its ink while it waits fails.
                            `clip-path` hides without touching a colour value —
                            and when it does not run at all, which is the case in
                            any browser without scroll timelines and for any
                            reader who asked for less motion, the card is simply
                            there. */}
                        <div
                          className="tl-card"
                          data-scene-part="uncover"
                          style={{
                            ['--scene-from' as string]: `contain ${s + 3}%`,
                            ['--scene-to' as string]: `contain ${s + 21}%`,
                          }}
                        >
                          <h3 className="tl-title">{m.title}</h3>
                          <p className="tl-body">{m.body}</p>
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
