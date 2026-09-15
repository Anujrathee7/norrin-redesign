import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Progress } from '@/components/ui/progress'
import { useCardStack } from '@/hooks/useCardStack'

export type StackItem = {
  id: string
  /** The company the case is about. The card's floor. */
  client: string
  /**
   * The case's own title, set inside the art. The sector pill that sat above
   * it was removed at the user's request; the art carries the title alone.
   */
  title: string
  /** The shortened case line — `short` in norrin.ts, flagged `paraphrase`. */
  summary: string
  /** A named person, where the source names one. Only Skanska does. */
  attribution?: string
}

/**
 * One art per case, in array order.
 *
 * THE ASSIGNMENT IS POSITIONAL AND ASSERTS NOTHING ABOUT ANYONE. It is the
 * order of an array, not a reading of a client's identity: a gradient chosen to
 * REPRESENT a company — one near their own brand's — would be the same class of
 * move as putting their logo on the page, and `norrin.ts` records that we hold
 * no licence for that. Array order says only "this is the third one".
 *
 * Keyed to the item, never to depth: keyed to depth the front card resolved to
 * one tone forever and every other colour was buried behind it.
 */
const TONES = ['slate', 'clay', 'sage', 'plum'] as const

/**
 * A hand of case cards that deals itself.
 *
 * ---------------------------------------------------------------------------
 * THE CARD: ART ON TOP, READING BELOW
 * ---------------------------------------------------------------------------
 * A gradient header carries the case title alone, so the card reads at a
 * glance; the body under it is light and quiet and holds the short line, the
 * client and a Next pill. The art is our own graphic layer — no
 * photograph is treated (§1.8). It replaced a centred quote card whose large
 * quotation mark borrowed the visual grammar of a testimonial for words the
 * client never said.
 *
 * TWO THINGS THE REFERENCE DESIGN HAS ARE NOT HERE, ON PURPOSE (§3):
 * - "Client since 2024". No source states when any of these engagements began.
 *   The floor's second line is the one sourced attribution — Skanska's CIO —
 *   and the other three cards show the client alone. The asymmetry is left
 *   visible rather than filled with something plausible.
 * - "Read case". `cases` carries no URLs, so a link would lead nowhere. The pill
 *   says "Next" instead, which is true: the whole pile is the next button.
 *
 * ---------------------------------------------------------------------------
 * IT IS A LIST THAT HAPPENS TO BE FANNED
 * ---------------------------------------------------------------------------
 * All items are a complete, static list to assistive technology, in source
 * order, at all times. No `aria-live`, no `aria-hidden` on a card, no `inert`,
 * no DOM reordering — `--d` is a custom property and the fan is a purely visual
 * re-ordering of a list that never moves. This is deliberately NOT the ARIA
 * carousel pattern, which would hide three of four real cases from a screen
 * reader in exchange for a pattern label.
 *
 * Nothing inside a card is focusable, which deletes a whole failure class: no
 * focus to restore when the front card changes, and no `inert` to strip a
 * subtree out of the tree — which this repo has already done once, to the
 * document's only `h1`. The Next pill is `aria-hidden` for the same reason; the
 * button laid over the pile already carries its name.
 *
 * ---------------------------------------------------------------------------
 * ONE NEXT CONTROL, AND WHAT IS STILL MISSING
 * ---------------------------------------------------------------------------
 * The whole pile is a real next button, reachable by click, tap, drag, Enter
 * and Space. There is still no pause control: WCAG 2.2.2 wants one for content
 * that auto-updates alongside other content, and this component has none. The
 * two stops that remain are not controls — `prefers-reduced-motion` never starts
 * the timer, and a backgrounded tab stops it. `useCardStack` carries the history
 * of the hover pause that was removed on the repo owner's instruction. If a
 * pause is wanted back, it should be a real button, not a pointer heuristic.
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
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [manualLeaving, setManualLeaving] = useState<number | null>(null)
  const gesture = useRef<{ pointerId: number; startX: number } | null>(null)
  const suppressClick = useRef(false)

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    gesture.current = { pointerId: event.pointerId, startX: event.clientX }
    event.currentTarget.setPointerCapture(event.pointerId)
    suppressClick.current = false
    setDragging(true)
    setDragX(0)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    const distance = event.clientX - active.startX
    // The pile deals to the right. A small resistance to the left makes that
    // direction discoverable without locking vertical page scrolling.
    setDragX(distance < 0 ? Math.max(-28, distance * 0.18) : distance)
  }

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) => {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    const distance = event.clientX - active.startX
    const threshold = Math.min(96, event.currentTarget.clientWidth * 0.22)
    suppressClick.current = Math.abs(distance) > 6
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)

    if (!cancelled && distance >= threshold) {
      setDragX(distance)
      setManualLeaving(index)
      next()
    } else {
      setDragX(0)
    }
  }

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    next()
  }

  return (
    // The count is written here rather than on the list because BOTH children
    // measure against it: the fan's deepest angle and the deal's landing angle.
    <div
      data-cardstack-region
      data-dragging={dragging ? '' : undefined}
      style={{
        ['--stack-count' as string]: String(items.length),
        ['--drag-x' as string]: `${dragX}px`,
        // The dragged card turns about the same shared corner the hand fans
        // from, so a pull reads as lifting a card out of the hand rather than
        // sliding a sheet across a table.
        ['--drag-turn' as string]: `${dragX * 0.03}deg`,
      }}
    >
      {/* POSITION, NOT NAVIGATION — AND IT STAYS OUT OF THE ACCESSIBILITY TREE.
          Radix renders `role="progressbar"`, which means task completion, and
          there is no task here; all four cases are already in the tree in
          source order. */}
      <Progress aria-hidden="true" className="stack-progress" value={((index + 1) / items.length) * 100} />

      {/* A transparent native button makes the entire pile respond to click,
          tap, Enter and Space while leaving the complete case list available
          to assistive technology underneath it. Manual turns restart the
          automatic timer, so the requested card receives a full reading beat. */}
      <button
        type="button"
        className="stack-next"
        aria-label="Show next customer case"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => finishDrag(event, true)}
      />

      <ol data-cardstack className="m-0 list-none p-0">
        {items.map((item, i) => {
          const d = (i - index + items.length) % items.length
          return (
            <li
              key={item.id}
              style={{ ['--d' as string]: String(d) }}
              data-front={d === 0 ? '' : undefined}
              data-manual-leaving={i === manualLeaving ? '' : undefined}
              data-tone={TONES[i % TONES.length]}
              // Only the card that has actually just left the front is dealt
              // out. Keying this off depth would fire it on first paint — see
              // the note in useCardStack.
              data-leaving={i === leaving ? '' : undefined}
            >
              <article className="card art-card">
                {/* The colour is not written here — see `--case-art-*` and the
                    tone mapping in index.css (§2.4). */}
                <div className="case-art">
                  <h3 className="case-title">{item.title}</h3>
                </div>
                <div className="case-body">
                  <p className="case-summary">{item.summary}</p>
                  <div className="case-floor">
                    <div>
                      <p className="case-client">{item.client}</p>
                      {item.attribution ? <p className="case-meta">{item.attribution}</p> : null}
                    </div>
                    <span aria-hidden="true" className="case-next">
                      Next <span className="case-next-arrow">→</span>
                    </span>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
