import type { ReactNode } from 'react'
import { Progress } from '@/components/ui/progress'
import { useCardStack } from '@/hooks/useCardStack'

export type StackItem = {
  id: string
  /** The company the case is about. Sits where the design puts a name. */
  who: ReactNode
  /** Its sector. Sits where the design puts a role. */
  role: ReactNode
  /** The case's own title. The card's display line, above the quote. */
  kicker?: ReactNode
  /** The quoted case summary — the card's subject. */
  body: ReactNode
  /** A sourced caption, where one exists. Only one case has one. */
  note?: ReactNode
}

/**
 * The last words of a title, in the accent.
 *
 * ---------------------------------------------------------------------------
 * POSITIONAL, SO NOTHING IS AUTHORED
 * ---------------------------------------------------------------------------
 * The alternative was a second field in `norrin.ts` naming the phrase to
 * colour. That field would be a design decision wearing a content decision's
 * clothes, and `norrin.ts` is the file whose whole contract is that every
 * string in it is traceable to a public Norrin page. A rule that reads "the
 * last two words" needs no data at all.
 *
 * ---------------------------------------------------------------------------
 * THE FILLER GUARD, AND WHY THE RULE CANNOT BE "TWO WORDS" FLAT
 * ---------------------------------------------------------------------------
 * Colour applied from a position lands wherever the sentence happens to end,
 * and English ends plenty of phrases on a preposition or an article. "…for the
 * positive credit register" cut at two words is fine; cut at three it would
 * start the accent on "the", which reads as a highlighter that slipped rather
 * than as an emphasis. So the second-to-last word is checked, and a function
 * word there collapses the phrase to one.
 *
 * On the four cases this actually runs on it takes two words every time —
 * "87,300-kilometer grid", "data-driven organization", "credit register",
 * "architecture quality". The guard is for the fifth case, which is the one
 * nobody will look at.
 */
/**
 * One tone per case, in array order.
 *
 * ---------------------------------------------------------------------------
 * BY ITEM, NOT BY DEPTH — AND IT WAS THE OTHER WAY ROUND, WHICH WAS THE BUG
 * ---------------------------------------------------------------------------
 * Keyed to depth, the front card resolved to `TONES[0]` forever: the coloured
 * cards were real but were always the ones buried behind it, so the pile read
 * as one pale card with some edges. Keyed to the item, each case owns a colour
 * and keeps it, and the front card changes colour because a DIFFERENT CARD
 * arrives there.
 *
 * THE ASSIGNMENT IS POSITIONAL AND ASSERTS NOTHING ABOUT ANYONE. It is the
 * order of an array, not a reading of a client's identity. That distinction is
 * the whole reason this is safe: a colour chosen to REPRESENT a company — one
 * near their own brand's — would be the same class of move as putting their
 * logo on the page, and `norrin.ts` records that we hold no licence for that.
 * Array order says only "this is the third one".
 *
 * ---------------------------------------------------------------------------
 * A WHOLE PROBLEM DISAPPEARS WITH IT
 * ---------------------------------------------------------------------------
 * No card ever changes colour now, so there is no flash to hide at the 50%/51%
 * boundary of `cardstack-deal` where that animation hides its z-index flip, and
 * no cross-fade to tune against the transform. Both were built and both are
 * deleted rather than left inert.
 *
 * THE ORDER IS PAPER, STONE, SUN, DARK, and it is a sequence rather than a set.
 * The reader meets these one at a time, so what is being arranged is the
 * arrival: light, then a warm dark grey, then the one loud card, then the
 * darkest. Sun sits between the two dark tones on purpose — stone and
 * `--role-dark` are 2.10:1 apart, which is a clear difference side by side in
 * the pile and a much weaker one across four seconds of memory, so they are not
 * allowed to follow each other. The wrap is dark back to paper, the largest step
 * in the ladder, which is what makes the cycle read as starting again.
 *
 * It was PAPER, SUN, PAPER, DARK for one build. Four cases and three tones meant
 * paper appeared twice and two of the four cards were the same white; stone is
 * the fourth, and it is `--ink-2` used as a surface rather than a colour anybody
 * had to invent.
 */
const TONES = ['paper', 'signal', 'paper', 'dark'] as const

const FILLER = new Set(['a', 'an', 'the', 'to', 'for', 'in', 'of', 'and', 'on', 'at', 'with'])

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/)
  if (words.length < 3) return { head: '', tail: title }
  const penultimate = words[words.length - 2].toLowerCase().replace(/[^a-z-]/g, '')
  const take = FILLER.has(penultimate) ? 1 : 2
  return {
    head: words.slice(0, words.length - take).join(' ') + ' ',
    tail: words.slice(words.length - take).join(' '),
  }
}

/**
 * A pile of quote cards that deals itself.
 *
 * ---------------------------------------------------------------------------
 * IT IS A LIST THAT HAPPENS TO BE STACKED
 * ---------------------------------------------------------------------------
 * All items are a complete, static list to assistive technology, in source
 * order, at all times. No `aria-live`, no `aria-hidden`, no `inert`, no DOM
 * reordering — `--d` is a custom property and the pile is a purely visual
 * re-ordering of a list that never moves.
 *
 * This is deliberately NOT the ARIA carousel pattern. That pattern puts
 * `aria-hidden` on every non-current slide, which here would make three of the
 * four real customer cases unreadable to a screen reader in exchange for a
 * pattern label — a content loss bought with a semantic.
 *
 * It also deletes a whole failure class: nothing inside a card is focusable, so
 * there is no focus to restore when the front one changes, and no `inert` to
 * strip a subtree out of the accessibility tree — which this repo has already
 * done once, to the document's only `h1`.
 *
 * ---------------------------------------------------------------------------
 * ONE NEXT CONTROL, AND WHAT IS STILL MISSING
 * ---------------------------------------------------------------------------
 * The whole pile is a real next button, reachable by click, tap, Enter and
 * Space. There is still no picker or pause button, and the position indicator
 * is a Progress bar rather than a row of dots that look like controls.
 *
 * THE COST IS NOW TOTAL, AND IT IS WRITTEN DOWN RATHER THAN HIDDEN. WCAG 2.2.2
 * wants a mechanism to pause content that auto-updates for more than five
 * seconds alongside other content. This component has none. Not an imperfect
 * one — none.
 *
 * It had one until this commit: a hover pause, which was never reachable by
 * keyboard or by thumb but did stop the pile for a mouse. It is removed on the
 * repo owner's instruction, because crossing the cards on the way somewhere else
 * stopped the rotation and that is what they watched happen.
 *
 * WHAT REMAINS ARE TWO STOPS, AND NEITHER IS A CONTROL. Under
 * `prefers-reduced-motion` the timer never starts at all, so a reader who has
 * asked the OS for less motion gets a permanently still pile — which is the
 * population 2.2.2 most exists for, served by a different route. A backgrounded
 * tab stops it, which is about throttled timers rather than about the reader.
 *
 * THE FIX, IF ONE IS WANTED, IS A REAL CONTROL. A pause or previous/next button
 * — reachable by tab and by thumb — not another pointer heuristic. That was
 * already this file's conclusion before the hover pause was removed, and
 * removing it only makes the case shorter: there is now nothing to argue about.
 *
 * HAVING NO CONTROLS IS ALSO WHAT MADE HOVER-PAUSE DANGEROUS HERE, and that is
 * a defect this component actually shipped rather than a hypothetical. A pause
 * with nothing to un-pause it has to be certain it was asked for, and it was
 * not: `pointerenter` fires when the pile scrolls up under a cursor the reader
 * never touched, so the rotation stopped before the first card turned and
 * stayed stopped. That was fixed — armed on `pointermove`, handlers moved onto
 * the pile — and then the whole mechanism was removed anyway. `useCardStack`
 * keeps the measurements, because the lesson outlives the code: a pointer is a
 * bad way to infer intent when nothing can undo the inference.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS RENDERS ITS OWN CARD BODY
 * ---------------------------------------------------------------------------
 * It shares the `.card` shell with Scope — the radius, the hairline, the
 * surface, the padding — and composes the inside differently. Scope's card is a
 * claim resolving into a role name; this is a centred quote under a mark that
 * rides the card's top edge, with its attribution following the text rather
 * than pinned to a floor. Driving both from one slot API produced a component
 * that was two components wearing a trench coat, so the shell is shared and the
 * composition is not.
 */
export function CardStack({
  items,
  paused = false,
}: {
  items: readonly StackItem[]
  /** `#styleguide` holds the pile still so it can be compared rather than watched. */
  paused?: boolean
}) {
  const { index, leaving, next } = useCardStack(items.length, { paused })

  return (
    // The count is written here rather than on the list because BOTH children
    // measure against it: the pile steps by it, and the position row is placed
    // 1.25rem below the front card by subtracting the pile's full travel. On the
    // list it was out of scope for the dots, which is why they were centred on
    // the column instead of on the card.
    <div data-cardstack-region style={{ ['--stack-count' as string]: String(items.length) }}>
      {/* POSITION, NOT NAVIGATION — AND IT STAYS OUT OF THE ACCESSIBILITY TREE.

          `aria-hidden` is a decision, not an omission, and it is the same one
          the four dots this replaces were making. All four cases are already in
          the tree in source order and none of them is ever hidden, so a screen
          reader has the whole list before this element says anything. What it
          would say is the problem: Radix renders `role="progressbar"`, which
          means TASK COMPLETION, and there is no task here and nothing completes.
          "25%" is not a description of "showing the first of four customer
          cases" — it is a number that sounds like an answer.

          The alternative considered was giving it a real accessible name
          ("Customer case 1 of 4"). It was rejected because it would announce, a
          second time and in a worse form, a list the reader has already been
          given in full — and because a progressbar that is really a position
          indicator is the wrong role wearing a better label.

          ABOVE THE PILE, NOT BELOW IT. The bar belongs to the front card, and a
          front card whose top edge already carries the quotation mark reads as
          the thing being measured. Below the pile it sat on three sheets of
          paper it was not about. */}
      <Progress aria-hidden="true" className="stack-progress" value={((index + 1) / items.length) * 100} />

      {/* A transparent native button makes the entire pile respond to click,
          tap, Enter and Space while leaving the complete case list available
          to assistive technology underneath it. Manual turns restart the
          automatic timer, so the requested card receives a full reading beat. */}
      <button
        type="button"
        className="stack-next"
        aria-label="Show next customer case"
        onClick={next}
      />

      <ol data-cardstack className="m-0 list-none p-0">
        {items.map((item, i) => {
          const d = (i - index + items.length) % items.length
          return (
            <li
              key={item.id}
              style={{ ['--d' as string]: String(d) }}
              data-tone={TONES[i % TONES.length]}
              // Only the card that has actually just left the front is dealt
              // out. Keying this off depth would fire it on first paint, and the
              // last card would throw itself off the page on load — see the note
              // in useCardStack.
              data-leaving={i === leaving ? '' : undefined}
            >
              <div className="card">
                {/* Centred, and pulled up so it straddles the card's top edge.
                    It is outside `.quote-set` on purpose: it is the card's seal
                    and holds the same spot on every case, rather than bobbing as
                    the pile rotates through quotes of different lengths.

                    THERE IS NO AVATAR BESIDE THE ATTRIBUTION AND THERE WILL NOT
                    BE ONE. The design this follows puts a headshot there; we
                    hold no licence to client photography — `norrin.ts` records
                    it — and three of the four cases name no individual at all.
                    A monogram or a grey circle in that slot would be a
                    fabricated affordance (§3): a picture of a person we do not
                    have and, in three cases, of a person who does not exist. */}
                <p aria-hidden="true" className="quote-mark">
                  &ldquo;
                </p>
                {/* THE TITLE, THE QUOTE AND THE ATTRIBUTION TRAVEL AS ONE BLOCK.

                    `.quote-set` is vertically centred by `margin-block: auto`,
                    which is what keeps the gap above the company name identical
                    on all four cases however long the quote is — the slack the
                    tallest case forces onto the other three is spent outside the
                    text rather than inside it.

                    The title leads it rather than being pinned to the card's
                    top. Pinned, it was a label with a hole under it; at the head
                    of the block it is the first thing read and the quote follows
                    from it, which is the order the card is actually making its
                    argument in.

                    The colour is not written here — see `.quote-title` and
                    `.quote-title-tail` in index.css (§2.4). */}
                <div className="quote-set">
                  {item.kicker ? (
                    <p className="quote-title">
                      {typeof item.kicker === 'string'
                        ? (() => {
                            const { head, tail } = splitTitle(item.kicker)
                            return (
                              <>
                                {head}
                                <span className="quote-title-tail">{tail}</span>
                              </>
                            )
                          })()
                        : item.kicker}
                    </p>
                  ) : null}
                  <p className="quote-body">{item.body}</p>
                  <div className="quote-who">
                    <p className="quote-who-name">{item.who}</p>
                    <p className="quote-who-role">{item.role}</p>
                    {item.note ? <p className="quote-who-role">{item.note}</p> : null}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

    </div>
  )
}
