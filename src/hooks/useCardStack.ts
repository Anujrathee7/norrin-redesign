import { useCallback, useEffect, useState, type PointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePageVisible } from '@/hooks/usePageVisible'

/**
 * The card stack's rotation.
 *
 * ---------------------------------------------------------------------------
 * EVERY REASON TO STOP, IN ONE EXPRESSION
 * ---------------------------------------------------------------------------
 * `running` is the whole contract. The conditions are ANDed in one place rather
 * than each clearing a shared `paused` flag — which is the version that goes
 * wrong, because whichever condition ends last un-pauses the other three.
 *
 * REDUCED MOTION IS FIRST AND UNCONDITIONAL. The interval never starts, so the
 * first card stays in front and the section is a static pile.
 *
 * HOVER IS MOUSE-ONLY, and this is not a detail. `pointerenter` fires on a
 * touch tap, but `pointerleave` frequently does not fire until the next tap
 * somewhere else — so on a phone, one tap on the stack would stop the rotation
 * indefinitely with no control to start it again. Gating on `pointerType` keeps
 * hover meaning hover.
 *
 * ---------------------------------------------------------------------------
 * `leaving`, AND WHY IT IS NOT JUST "THE CARD AT THE BACK"
 * ---------------------------------------------------------------------------
 * The card that has just left the front is dealt out of frame rather than
 * collapsing into the pile, and that motion is a keyframe animation rather than
 * a transition, because it travels through a waypoint.
 *
 * Keying it off depth alone — "animate whatever is at the back" — fires it on
 * the very first paint, because some card is always at the back. The last card
 * would throw itself off the page on load, before anything had happened. So the
 * leaving card is tracked explicitly and is `null` until a rotation has actually
 * occurred.
 */
export function useCardStack(
  count: number,
  { interval = 3200, paused = false }: { interval?: number; paused?: boolean } = {},
) {
  const reduced = useReducedMotion()
  const visible = usePageVisible()

  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState<number | null>(null)
  const [hovered, setHovered] = useState(false)

  const running = !reduced && !paused && !hovered && visible

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setIndex((i) => {
        setLeaving(i)
        return (i + 1) % count
      })
    }, interval)
    return () => window.clearInterval(id)
  }, [running, count, interval])

  const onPointerEnter = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true)
  }, [])
  const onPointerLeave = useCallback(() => setHovered(false), [])

  return {
    index,
    leaving,
    reduced,
    /** Spread onto the element wrapping the pile. */
    regionProps: { onPointerEnter, onPointerLeave },
  }
}
