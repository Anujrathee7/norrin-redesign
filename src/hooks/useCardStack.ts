import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
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
 * ---------------------------------------------------------------------------
 * ONE COUNTER, NOT TWO STATES — AND THE OLD PAIR WAS AN IMPURE UPDATER
 * ---------------------------------------------------------------------------
 * This used to hold `index` and `leaving` separately and write the second from
 * inside the first's updater:
 *
 *     setIndex((i) => { setLeaving(i); return (i + 1) % count })
 *
 * A `useState` updater runs during render and must be pure. `main.tsx` renders
 * under `<StrictMode>`, which double-invokes updaters in development precisely
 * to surface that, and React treats the nested call as a render-phase update on
 * the same component. It was measured before it was changed and it did NOT
 * corrupt the pile — `setLeaving` was called twice with the same value, so the
 * second call bailed out — so this is a latent defect rather than one of the two
 * the reader was seeing. It is gone anyway, because it costs nothing to delete:
 *
 * `leaving` was never independent. It is always the card that was in front one
 * rotation ago, which is arithmetic on the rotation count, so ONE monotonic
 * counter derives both and neither updater has a side effect in it. `count` also
 * drops out of the timer entirely, since the modulo now happens at render.
 *
 * `null` until the first rotation is the part that has to survive: keying the
 * deal off depth alone — "animate whatever is at the back" — fires it on the
 * very first paint, because some card is always at the back, and the last card
 * would throw itself off the page on load before anything had happened.
 *
 * ---------------------------------------------------------------------------
 * THE CLOCK SURVIVES A PAUSE, AND THIS IS THE "TAKES TOO LONG" DEFECT
 * ---------------------------------------------------------------------------
 * The timer used to be a `setInterval` in an effect keyed on `running`, so every
 * flip of any condition tore it down and started a FRESH FULL 2.5s. Measured on
 * the production preview: a mouse sweeping onto the pile and off again every
 * 1.5s produced ZERO rotations in twelve seconds. Each hover-out started a 2.5s
 * clock that the next hover-in cancelled at 700ms, forever. Switching tabs did
 * the same thing more quietly.
 *
 * So the clock is a deadline rather than an interval: the cleanup subtracts the
 * time that was actually spent running, and the next start asks for what is
 * LEFT. A pause now costs the reader the length of the pause and nothing else.
 *
 * WHY THERE IS NO FLOOR UNDER THE REMAINDER, which is where this deliberately
 * differs from `useCardSlider`'s `nudge`. That hook restarts the whole clock on
 * a manual move, because a reader who pressed "next" asked for THAT card and
 * would otherwise get it for a fifth of a second. Nobody asked for anything
 * here: the reader has just moved the pointer AWAY from the pile, so resuming
 * mid-beat is the pile carrying on where it was rather than a card being
 * snatched.
 *
 * ---------------------------------------------------------------------------
 * HOVER MEANS THE READER MOVED THE POINTER HERE, NOT THAT THE PAGE MOVED
 * ---------------------------------------------------------------------------
 * This is the "does not work at all" defect, and it needed no unusual input to
 * hit. `pointerenter` fires when the element arrives under a STATIONARY cursor,
 * so scrolling the page down until the pile appeared — with the mouse untouched,
 * parked wherever it happened to be in the right-hand column — set `hovered` and
 * stopped the rotation before the reader had seen a single card turn. There is
 * no control to start it again. Measured on the production preview: mouse never
 * moved, page scrolled, zero rotations in twelve seconds.
 *
 * The two cases separate cleanly, and this was measured too rather than assumed.
 * Scrolling the pile under a still cursor fires `pointerover`/`pointerenter` and
 * `pointermove` EXACTLY ZERO TIMES. A real mouse moving onto the pile fires
 * `pointermove` immediately, with non-zero `movementX/Y`. So the pause is armed
 * by movement, and `pointerenter` is not listened for at all.
 *
 * `setHovered(true)` on every move is deliberate rather than sloppy: React
 * compares eagerly and bails out when the value is unchanged, so a pointer
 * crossing the card schedules exactly one render.
 *
 * STILL MOUSE-ONLY, AND THAT GATE IS UNCHANGED. `pointermove` fires for a touch
 * drag, and `pointerleave` frequently does not fire until the next tap somewhere
 * else — so on a phone one drag across the stack would stop the rotation
 * indefinitely with no control to start it again.
 *
 * WHAT HOVER-PAUSE STILL BUYS, now that it can no longer strand the pile. A
 * mouse reader who moves onto a card to finish reading it holds it there, and
 * moving away resumes — including when the reader scrolls the pile out from
 * under the cursor, which fires `pointerleave`. It is the only pause mechanism
 * this component has (see the WCAG 2.2.2 note in `CardStack.tsx`), so the fix
 * was to make it mean hover, not to delete it.
 *
 * ---------------------------------------------------------------------------
 * 2.5s, DOWN FROM 3.2s
 * ---------------------------------------------------------------------------
 * The user watched the pile and called the cadence slow. It is set by hand
 * rather than derived: the deal keyframe is 0.62s and the tone transitions are
 * 0.34s, so 2.5s still leaves ~1.9s of a still, finished card before the next
 * one goes. Anything under about 2s would start the next deal while the last
 * one was still landing, which is the point where a pile reads as a flicker
 * rather than a deck being turned. `useCardSlider` is deliberately slower and
 * says why — its cards are whole sentences, these are a company and a sector.
 */
export function useCardStack(
  count: number,
  { interval = 2500, paused = false }: { interval?: number; paused?: boolean } = {},
) {
  const reduced = useReducedMotion()
  const visible = usePageVisible()

  const [rotations, setRotations] = useState(0)
  const [hovered, setHovered] = useState(false)

  const running = !reduced && !paused && !hovered && visible

  // The deadline, carried across pauses. `left` is what the current card still
  // owes; `since` is when it last started being spent.
  const left = useRef(interval)
  const since = useRef(0)

  useEffect(() => {
    if (!running) return

    let id = 0
    const turn = () => {
      setRotations((r) => r + 1)
      left.current = interval
      since.current = performance.now()
      id = window.setTimeout(turn, interval)
    }

    since.current = performance.now()
    id = window.setTimeout(turn, left.current)

    return () => {
      window.clearTimeout(id)
      // Bank the part of the beat that was actually spent on screen. Clamped at
      // zero so a long frame cannot hand the next start a negative delay.
      left.current = Math.max(0, left.current - (performance.now() - since.current))
    }
  }, [running, interval])

  const index = count > 0 ? rotations % count : 0

  // Null until a rotation has happened, and null below two cards — with one card
  // the only card would be its own predecessor and would deal itself off the
  // page and back every beat.
  const leaving = rotations === 0 || count < 2 ? null : (rotations - 1) % count

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (e.pointerType === 'mouse') setHovered(true)
  }, [])
  const onPointerLeave = useCallback(() => setHovered(false), [])

  return {
    index,
    leaving,
    reduced,
    /**
     * Spread onto the PILE, not onto the region around it. The region also holds
     * the position bar and the 3rem of air under it, and a hover there paused a
     * card the pointer was nowhere near.
     */
    pileProps: { onPointerMove, onPointerLeave },
  }
}
