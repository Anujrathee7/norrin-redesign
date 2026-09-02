import { useCallback, useEffect, useState, type PointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePageVisible } from '@/hooks/usePageVisible'

/**
 * The card stack's rotation.
 *
 * ---------------------------------------------------------------------------
 * EVERY REASON TO STOP, IN ONE EXPRESSION
 * ---------------------------------------------------------------------------
 * `running` is the whole contract. Four independent conditions can stop the
 * rotation and they are ANDed in one place rather than each clearing a shared
 * `paused` flag — which is the version that goes wrong, because whichever
 * condition ends last un-pauses the other three.
 *
 * REDUCED MOTION IS FIRST AND UNCONDITIONAL. The interval never starts, so the
 * front card stays wherever it was and the section is a static pile. The pause
 * control is not rendered in that state either: there is nothing to pause, and
 * a control that does nothing is a fabricated affordance (§3).
 *
 * `userPaused` IS STICKY. Nothing clears it — not hover ending, not blur, not
 * the tab coming back. That stickiness is exactly what makes it the WCAG 2.2.2
 * mechanism rather than a hover convenience: a reader who stops it has stopped
 * it, and it stays stopped until they say otherwise.
 *
 * HOVER IS MOUSE-ONLY, and this is not a detail. `pointerenter` fires on a
 * touch tap, but `pointerleave` frequently does not fire until the next tap
 * somewhere else — so on a phone, one tap on the stack would stop the rotation
 * indefinitely without the reader ever asking for it, and without the pause
 * control reflecting it. Gating on `pointerType` keeps hover meaning hover.
 */
export function useCardStack(
  count: number,
  { interval = 6000, startPaused = false }: { interval?: number; startPaused?: boolean } = {},
) {
  const reduced = useReducedMotion()
  const visible = usePageVisible()

  const [index, setIndex] = useState(0)
  // `startPaused` exists for #styleguide, where the pile is a specimen being
  // looked at rather than a section being read. A guide that rotates under the
  // reviewer is a guide you cannot compare two states in.
  const [userPaused, setUserPaused] = useState(startPaused)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)

  const running = !reduced && !userPaused && !hovered && !focused && visible

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval)
    return () => window.clearInterval(id)
  }, [running, count, interval])

  const onPointerEnter = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true)
  }, [])
  const onPointerLeave = useCallback(() => setHovered(false), [])

  const toggle = useCallback(() => setUserPaused((p) => !p), [])

  return {
    index,
    setIndex,
    reduced,
    userPaused,
    running,
    toggle,
    /**
     * Spread onto the wrapper that contains BOTH the pile and its controls.
     *
     * React's `onFocus`/`onBlur` are `focusin`/`focusout` and therefore bubble,
     * so this is focus-WITHIN for the whole region. That is deliberate: tabbing
     * toward the picker must stop the rotation first, or the card the reader is
     * aiming at changes underneath them between one keystroke and the next.
     */
    regionProps: {
      onPointerEnter,
      onPointerLeave,
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  }
}
