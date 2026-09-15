import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useCardSlider } from '@/hooks/useCardSlider'

export type SlideItem = {
  id: string
  /** The card's reading matter. Scope: the claim. */
  body: ReactNode
  /** Pinned to the card's floor, rendered as the card's `<h3>`. Scope: the role. */
  floor: ReactNode
  /**
   * The same name as a plain string, for the dot's accessible name.
   *
   * It is a separate field rather than a cast of `floor` because `floor` is a
   * ReactNode and a button's `aria-label` is a string — deriving one from the
   * other would work today and break silently the first time a caller puts an
   * element in there.
   */
  label: string
  /**
   * The tone this card takes IN THE FLAT LAYOUT — the name only, never a colour
   * (§2.4). The slider's own tones are keyed to depth in CSS and override this
   * one; this is what survives when the row does not, so the composition the
   * caller authored for a grid is the composition a reduced-motion reader gets.
   */
  tone?: string
  /** Short items under the body — Scope: what Norrin names under each role. */
  points?: readonly string[]
  /** The small label above `points`. Interface chrome, not content. */
  pointsLabel?: string
}

/**
 * A centred three-across slider: one card popped out at the front, one legible
 * card either side of it, and real controls under it.
 *
 * ---------------------------------------------------------------------------
 * THREE VISIBLE POSITIONS, FOUR CARDS, AND WHERE THE FOURTH IS
 * ---------------------------------------------------------------------------
 * The ring is focus / right / off-stage / left. The off-stage card sits at the
 * centre line scaled well under the front card, so it is covered by it rather
 * than parked somewhere off the side of the page — and that is what makes the
 * rotation continuous instead of a teleport. Cards travel LEFT while they are in
 * front (right slot, centre, left slot) and travel RIGHT while they are behind
 * the front card, which is one loop in one direction rather than a slide that
 * has to jump the width of the row to get back to the start.
 *
 * The alternative — parking the fourth card beyond the right-hand one and
 * clipping it — was tried on paper and thrown out: with four cards and three
 * slots the wrap happens between a VISIBLE slot and the parked one, so a card
 * either blinks out of the left-hand slot or sweeps across the whole row to get
 * home. Behind the front card there is nothing to see, so there is nothing to
 * hide.
 *
 * ---------------------------------------------------------------------------
 * IT IS A LIST THAT HAPPENS TO BE ARRANGED — `CardStack`'s posture, copied
 * ---------------------------------------------------------------------------
 * All four items are a complete, static list to assistive technology, in source
 * order, at all times, INCLUDING the one behind the front card. No `aria-live`,
 * no `aria-hidden`, no `inert`, no DOM reordering — position is a custom
 * property on an element that never moves, and every advance is an attribute
 * change rather than a re-render that takes content away.
 *
 * This is deliberately NOT the ARIA carousel pattern, for the reason `CardStack`
 * writes down: that pattern puts `aria-hidden` on every non-current slide, which
 * here would take three of the four things Norrin says it is responsible for out
 * of the accessibility tree in exchange for a pattern label.
 *
 * NOTHING INSIDE A CARD IS FOCUSABLE. The cards hold a claim and a name and no
 * links, so the only focusable things in the component are the controls, which
 * sit outside the moving part and never change position. There is no focus to
 * restore when the front card changes and no `inert` anywhere — which this repo
 * has already done once, to the document's only `h1`.
 *
 * ---------------------------------------------------------------------------
 * THE CONTROLS ARE REAL BUTTONS, AND THAT CLOSES A DOCUMENTED GAP
 * ---------------------------------------------------------------------------
 * `CardStack` ships no controls and records the cost in writing: WCAG 2.2.2
 * wants a mechanism to pause content that auto-updates alongside other content,
 * hovering is not a mechanism a keyboard reader can reach, and it names the fix
 * — "making the dots real buttons is the one-line change that would close it."
 * These are that. Previous, next, and one per role, all `<button>`, all
 * operable, all reachable by tab.
 *
 * Which is why the inert-dot objection does not apply here and is not being
 * walked back. §3's fabricated-affordance rule is about a control that LOOKS
 * pressable and is not; a control that looks pressable and is pressable is the
 * honest end of the same rule. The pile's dots were replaced by a bar precisely
 * because they could not be made real without a hook that pauses on focus, and
 * this component has one.
 *
 * THE ROTATION PAUSES ON FOCUS AS WELL AS HOVER — see `useCardSlider`. Without
 * it, tabbing to the next arrow would move the thing being aimed at.
 *
 * AND IT PAUSES WHILE A CARD IS HELD, which is the part that finally closes WCAG
 * 2.2.2 for a touch reader. Hover does not exist on a phone, so before this the
 * only way to hold a sentence still with a thumb was to hit a 24px dot. A press
 * on a card now stops the rotation for as long as the finger is down and resumes
 * the moment it lifts. It sets no `touch-action` and prevents no default, so a
 * swipe that starts on a card still scrolls the page — the browser takes the
 * gesture, fires `pointercancel`, and the rotation carries on. `useCardSlider`
 * has the full argument and the list of every way a press can end.
 *
 * NO `aria-live`. All four cards are in the accessibility tree in source order
 * at all times and none of them is ever removed, so nothing APPEARS that a
 * reader would otherwise miss — the rotation changes what is in focus visually
 * and changes nothing at all for a screen reader. Announcing it every five
 * seconds would interrupt whatever they were actually reading in order to repeat
 * a list they have already been given in full.
 *
 * ---------------------------------------------------------------------------
 * THE THREE CARDS DO NOT OVERLAP, AND NOTHING RECEDES BY FADING (§3)
 * ---------------------------------------------------------------------------
 * The two flanking cards are entirely visible with a real gap either side of the
 * front one. They recede on SIZE (a scale step) and TONE (a muted surface, with
 * its ink measured against that surface and gated in `tools/palette.mjs`) —
 * never on opacity.
 *
 * THERE WAS A THIRD, A DEPTH-STEPPED BLUR, AND THE USER HAD IT REMOVED. It was
 * permitted where a fade is not, and the distinction still holds for anything
 * that comes after it: ancestor opacity folds into the contrast maths, so faded
 * copy does not merely look weaker, it genuinely fails a ratio, whereas a blur
 * composites at full alpha and moves no ratio at all. `cardstack-deal` still
 * blurs the dealt card on exactly that permission.
 *
 * What it bought was honesty about the ~14.6px effective serif a 0.86-scaled
 * card sets — it made the flanking pair decorative rather than nominally
 * readable. They are small and sharp now, which is why the muted tone's four
 * gated pairs matter more than they did and not less. Nothing else changes: a
 * card is fully sized the moment it is at the front, it gets there on its own
 * every five seconds, it can be held still with a press, and any of the four can
 * be reached directly with a dot.
 *
 * The front card is popped out rather than merely middle: it is the largest, it
 * is the only sun-coloured object in the section, and it carries the one shadow
 * — §2.7's floating-layer clause, argued at its declaration in `index.css`.
 *
 * THE SWITCH IS TRAVEL, NOT A RE-RENDER. Position, scale and tone all transition
 * together over 0.5s on `--ease-ui`, so a card visibly crosses the row — growing
 * and taking the sun as it reaches the front, shrinking and going muted as it
 * leaves — rather than the three slots repainting in place. 0.5s sits between
 * the customer pile's 0.34s transitions and its 0.62s deal: the pile moves one
 * card a short distance, this moves three across a whole row, and at 0.34s the
 * travel read as a jump. An automatic advance and a press on an arrow or a dot
 * run the identical transition; there is no separate manual path.
 *
 * CSS TRANSITIONS, NOT MOTION, AND THAT WAS CHECKED RATHER THAN ASSUMED. §3 now
 * permits Motion for component state, so this was a real choice: the transform
 * is driven by two custom properties written from React, and Chromium was
 * sampled frame by frame to confirm the transition actually fires from a var
 * change rather than snapping. It does — measured across fourteen frames of a
 * 500ms press. Motion would add a dependency and a JS clock to reproduce what
 * the compositor is already doing, and a JS clock is the thing that can strand a
 * card. Another agent reached the same conclusion for the pile and deliberately
 * did not install it; that judgement is followed here rather than reopened.
 *
 * ---------------------------------------------------------------------------
 * THE GEOMETRY IS ARITHMETIC, WRITTEN ONCE
 * ---------------------------------------------------------------------------
 *   --slide-depth  0 at the front, 1 for a flanking card, 2 for the one behind.
 *   --slide-side   -1 left, 0 on the centre line, +1 right.
 *
 * Scale falls out of depth and the offset falls out of scale, so the row resizes
 * itself at every viewport from two numbers in the stylesheet and never from a
 * table of hand-placed positions.
 */
export function CardSlider({
  items,
  paused = false,
}: {
  items: readonly SlideItem[]
  /** Holds the slider still, for a surface that compares rather than watches. */
  paused?: boolean
}) {
  const { index, go, next, prev, regionProps, holdProps } = useCardSlider(items.length, { paused })
  const n = items.length
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<{ pointerId: number; startX: number } | null>(null)

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    gesture.current = { pointerId: event.pointerId, startX: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setDragX(0)
    holdProps.onPointerDown()
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    setDragX(event.clientX - active.startX)
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    const distance = event.clientX - active.startX
    const threshold = Math.min(88, event.currentTarget.clientWidth * 0.16)
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
    setDragX(0)
    holdProps.onPointerUp()

    if (!cancelled && distance <= -threshold) next()
    if (!cancelled && distance >= threshold) prev()
  }

  return (
    // The region wraps the cards AND the controls, so focus moving between the
    // arrows and the dots never leaves it and never restarts the rotation.
    <div
      {...regionProps}
      data-slider
      data-dragging={dragging ? '' : undefined}
      style={{
        ['--slide-count' as string]: String(n),
        ['--slide-drag-x' as string]: `${dragX}px`,
      }}
    >
      {/* THE HOLD GOES ON THE STAGE, NOT ON THE REGION. The region wraps the
          controls too, and a press on the next arrow that also registered as a
          hold would pause the rotation with the very gesture asking it to move.
          Here it covers exactly the cards and nothing else. */}
      <div
        data-slidestage
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => finishDrag(event, true)}
      >
        {/* `data-rolecards` scopes Scope's card sizing in index.css. Colour
            is no longer keyed to depth: each card owns its art by `data-tone`,
            the same site-wide mapping the customer deck uses, so a role keeps
            its colour as it travels the ring (user decision). */}
        <ul data-slidetrack data-rolecards className="m-0 list-none p-0">
          {items.map((item, i) => {
            // How many advances until this card is at the front. Decreases by
            // one per tick, so a card travels the ring rather than jumping.
            const p = (i - index + n) % n
            // Measured the short way round, which is what makes the left and the
            // right flanker the same depth and therefore the same size and the
            // same tone. The symmetry falls out of this line.
            const depth = Math.min(p, n - p)
            // On the centre line at the front, and on the centre line again at
            // the back — the only two places a card has no side.
            const onAxis = p === 0 || p * 2 === n
            const side = onAxis ? 0 : p * 2 < n ? 1 : -1

            return (
              <li
                key={item.id}
                // Depth carries the size; `data-tone` carries the art.
                data-depth={depth}
                data-tone={item.tone}
                style={{
                  ['--slide-depth' as string]: String(depth),
                  ['--slide-side' as string]: String(side),
                }}
              >
                <article className="art-card">
                  <div className="case-art">
                    <h3 className="case-title">{item.floor}</h3>
                  </div>
                  <div className="case-body">
                    <p className="case-summary">{item.body}</p>
                    {item.points?.length ? (
                      <div className="case-points">
                        {item.pointsLabel ? (
                          <p className="case-points-label">{item.pointsLabel}</p>
                        ) : null}
                        <ul>
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {/* The arrows are siblings of the stage rather than children of the dot
          row, because at wide widths they are placed in the grid's outer
          columns, level with the cards, and grid placement only reaches direct
          children. Below that width the same three elements fall into one
          control row under the cards. One grid, two area maps. */}
      <button type="button" data-slidearrow="prev" onClick={prev} aria-label="Previous role">
        {/* Drawn rather than imported. A stroked chevron at the page's own
            hairline weight is four numbers; an icon library for one glyph in one
            component is 40kB and a second visual language. */}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" focusable="false">
          <path d="M14.5 5 7.5 12l7 7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div data-slidedots>
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(i)}
            // Named with the role rather than with a number, so the control says
            // what it does instead of where it sits. "Show role 3 of 4" is a
            // position; "Show Infrastructure partner" is a destination.
            aria-label={`Show ${item.label}`}
            // The current item in a set, which is what this is. Not
            // `aria-selected` — that belongs to a listbox or a tablist, and
            // asserting either would be claiming a pattern this is not.
            aria-current={i === index ? 'true' : undefined}
          >
            {/* The dot itself is drawn by the button's ::before in index.css, so
                the button's own box can be a full 24px target without a 24px
                dot. Empty on purpose — the accessible name is the label. */}
          </button>
        ))}
      </div>

      <button type="button" data-slidearrow="next" onClick={next} aria-label="Next role">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" focusable="false">
          <path d="M9.5 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  )
}
