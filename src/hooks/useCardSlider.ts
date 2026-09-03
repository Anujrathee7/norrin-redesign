import { useCallback, useEffect, useState, type FocusEvent, type PointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePageVisible } from '@/hooks/usePageVisible'

/**
 * The Scope slider's rotation.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT `useCardStack`
 * ---------------------------------------------------------------------------
 * It is that hook plus two things it cannot have, and it is a second file
 * rather than two options on the first because the customer pile has no
 * controls and must not grow any: its whole accessibility argument is that
 * nothing inside it is focusable, so a `focused` flag there would be dead code
 * pretending to be a feature.
 *
 * WHAT IS ADDED. `focused`, `held`, and a way to move by hand.
 *
 * PAUSING ON FOCUS IS NOT OPTIONAL ONCE THE CONTROLS ARE REAL. A keyboard
 * reader who tabs to the next arrow is reading; a rotation that carries on
 * underneath them moves the thing they are aiming at. Hover covers a mouse and
 * covers nothing else, which is exactly the gap `useCardStack`'s own header
 * writes down when it says hovering is not a mechanism a keyboard reader can
 * reach.
 *
 * ---------------------------------------------------------------------------
 * PRESS AND HOLD, AND WHY IT IS AN ACCESSIBILITY FIX RATHER THAN A FLOURISH
 * ---------------------------------------------------------------------------
 * `CardStack.tsx` records the open cost in writing: WCAG 2.2.2 wants a mechanism
 * to pause content that auto-updates, and hovering is not one a reader can
 * always reach. The arrows and the dots closed that for a keyboard. They do not
 * close it for a THUMB on a card — there is no hover on touch at all, so until
 * now a touch reader who wanted to finish a sentence had to find a 24px dot.
 * Holding a finger on the card is the mechanism that was missing.
 *
 * SO THIS ONE IS NOT GATED ON `pointerType`, AND THAT IS THE WHOLE POINT. The
 * hover pause above IS gated to a mouse, deliberately, because `pointerenter`
 * fires on a touch tap while `pointerleave` frequently does not fire until the
 * next tap somewhere else — an ungated hover stops the rotation on a phone for
 * good. This is the opposite case: it exists FOR touch, and it is safe ungated
 * precisely because it is bounded by a RELEASE rather than by an exit.
 *
 * EVERY WAY A PRESS CAN END, AND WHY NONE OF THEM IS DECORATION. `pointerup` is
 * the ordinary release. `pointercancel` is the browser taking the gesture over,
 * which is exactly what happens when a touch drag becomes a page scroll — so it
 * is the common path on a phone rather than an edge case. `pointerleave` is a
 * mouse dragged off the card. `lostpointercapture` is not padding either: touch
 * pointers are IMPLICITLY captured to their target, so on a phone that is the
 * event that actually ends the gesture.
 *
 * And because "paused forever" is the failure that matters here, the release
 * does not rely on any of them. While a card is held, `pointerup` and
 * `pointercancel` are listened for on the window as well, so a press that ends
 * anywhere — off the card, off the section, off the page — still clears it. The
 * element handlers make it responsive; the window pair makes it impossible to
 * strand.
 *
 * NOTHING IS PREVENTED AND NO `touch-action` IS SET. A finger that starts on a
 * card and swipes is an ordinary page scroll; the browser fires `pointercancel`
 * when it takes the gesture, and the rotation resumes on its own. The handlers
 * go on the card stage only, so the arrows and the dots never see them and a tap
 * on a control is an ordinary tap.
 *
 * ---------------------------------------------------------------------------
 * FIVE SECONDS, NOT THE PILE'S 3.2
 * ---------------------------------------------------------------------------
 * The pile keeps 3.2s and is not touched. This is slower on purpose, and it is
 * the one place the two rotations deliberately disagree: the pile's card is a
 * company and a sector, this one's is a whole sentence, and the longest of the
 * four claims runs 137 characters. The travel is 0.5s of every cycle, so 3.2s
 * left 2.7s of still, sharp card to read that sentence in — under a comfortable
 * pace for it. 5s leaves 4.5s.
 *
 * WHAT IS COPIED, DELIBERATELY UNCHANGED. `running` as a single ANDed expression
 * rather than five things clearing a shared flag — that is the version that goes
 * wrong, because whichever condition ends last un-pauses the other four. Reduced
 * motion first and unconditional: the interval never starts.
 *
 * ---------------------------------------------------------------------------
 * `nudge`, AND WHY MOVING BY HAND RESTARTS THE CLOCK
 * ---------------------------------------------------------------------------
 * Without it, pressing next 200ms before a tick fires means the card the reader
 * asked for is on screen for a fifth of a second. The counter is in the effect's
 * dependency list, so any manual move tears down the interval and starts a fresh
 * one — the reader gets a full beat on the card they chose.
 *
 * It is a counter rather than a boolean because the value has to CHANGE on every
 * press, not merely become true.
 */
export function useCardSlider(
  count: number,
  { interval = 5000, paused = false }: { interval?: number; paused?: boolean } = {},
) {
  const reduced = useReducedMotion()
  const visible = usePageVisible()

  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [held, setHeld] = useState(false)
  const [nudge, setNudge] = useState(0)

  const running = !reduced && !paused && !hovered && !focused && !held && visible

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval)
    return () => window.clearInterval(id)
  }, [running, count, interval, nudge])

  const go = useCallback(
    (n: number) => {
      setIndex(((n % count) + count) % count)
      setNudge((x) => x + 1)
    },
    [count],
  )

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count)
    setNudge((x) => x + 1)
  }, [count])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count)
    setNudge((x) => x + 1)
  }, [count])

  const onPointerEnter = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true)
  }, [])
  const onPointerLeave = useCallback(() => setHovered(false), [])

  // React's `onFocus` / `onBlur` are focusin / focusout, so they bubble from the
  // buttons to the region. The `relatedTarget` guard is what stops a tab from
  // one control to the next inside the same region reading as "focus left" for
  // a frame and restarting the rotation under the reader's hands.
  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback((e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
  }, [])

  const onHoldStart = useCallback(() => setHeld(true), [])
  const onHoldEnd = useCallback(() => setHeld(false), [])

  // THE RELEASE THAT CANNOT BE MISSED. The handlers returned below sit on the
  // cards, so a press that ends anywhere else — off the section, off the window,
  // or as a gesture the browser took over — would otherwise leave `held` true
  // and the rotation stopped with nothing left to start it again. Bound only
  // while a card is actually held, so it costs nothing the rest of the time.
  useEffect(() => {
    if (!held) return
    const release = () => setHeld(false)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [held])

  return {
    index,
    reduced,
    go,
    next,
    prev,
    /** Spread onto the element wrapping the cards AND their controls. */
    regionProps: { onPointerEnter, onPointerLeave, onFocus, onBlur },
    /**
     * Spread onto the CARDS ONLY — never onto the region, or a press on an arrow
     * would read as a hold on the very thing it is trying to move.
     *
     * No `onClick`, no `preventDefault`, no `touch-action`: this listens to a
     * press, it does not claim one.
     */
    holdProps: {
      onPointerDown: onHoldStart,
      onPointerUp: onHoldEnd,
      onPointerCancel: onHoldEnd,
      onPointerLeave: onHoldEnd,
      onLostPointerCapture: onHoldEnd,
    },
  }
}
