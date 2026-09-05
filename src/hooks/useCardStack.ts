import { useEffect, useRef, useState } from 'react'
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
 * would otherwise get it for a fifth of a second. Nothing here is a request, so
 * resuming mid-beat is the pile carrying on where it was rather than a card
 * being snatched.
 *
 * WITH HOVER GONE THE ONLY REMAINING PAUSE IS A BACKGROUNDED TAB, so this now
 * does one job: a reader who leaves and comes back finishes the beat they left
 * rather than being handed a fresh 2.5s. That is a smaller job than it was and
 * the mechanism is kept rather than simplified away, because the alternative —
 * a plain interval restarted on every visibility flip — is exactly the shape
 * that produced the "takes too long" defect in the first place.
 *
 * ---------------------------------------------------------------------------
 * THERE IS NO HOVER PAUSE. THE POINTER DOES NOT STOP THE PILE AT ALL
 * ---------------------------------------------------------------------------
 * Removed on the repo owner's instruction: moving over the cards must not stop
 * the rotation.
 *
 * IT IS WORTH KNOWING WHAT THIS FILE JUST DELETED, because it was fixed twice
 * before it was removed. The original bug was that `pointerenter` fires when an
 * element arrives under a STATIONARY cursor — so scrolling the page until the
 * pile appeared, mouse untouched and parked anywhere in the right-hand column,
 * stopped the rotation before a single card had turned, with no control to start
 * it again. Measured on the production preview: zero rotations in twelve
 * seconds. The fix was to arm the pause on `pointermove` instead, since
 * scrolling under a still cursor fires `pointermove` exactly zero times.
 *
 * That made hover mean hover. It did not change the fact that a reader crossing
 * the pile on the way somewhere else stopped it, which is what the owner
 * watched and asked for. `hovered`, `onPointerMove`, `onPointerLeave` and
 * `pileProps` are all deleted rather than left inert.
 *
 * WHAT THIS COSTS, WRITTEN DOWN RATHER THAN HIDDEN. The pile now has NO pause
 * mechanism of any kind. WCAG 2.2.2 wants one for content that auto-updates
 * alongside other content, and hover was the only thing this component had —
 * imperfect, since it was never reachable by keyboard or touch, but present.
 * `CardStack.tsx` carries the full note; this is the file that made it true.
 *
 * TWO STOPS REMAIN AND NEITHER IS A CONTROL. `prefers-reduced-motion` means the
 * timer never starts, so a reader who has asked the OS for less motion gets a
 * still pile — which is the case 2.2.2 exists for, served by a different route.
 * A backgrounded tab stops it too, which is about throttled timers rather than
 * about the reader.
 *
 * If a pause is wanted back, it should be a real control — a button, reachable
 * by keyboard and thumb — not a pointer heuristic. That was already the
 * conclusion in `CardStack.tsx` before any of this.
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

  // Every reason to stop, in one expression. It is ANDed in one place rather
  // than each condition clearing a shared flag — which is the version that goes
  // wrong, because whichever condition ends last un-pauses the others. `hovered`
  // used to be a third term and is gone; see the note above.
  const running = !reduced && !paused && visible

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

  return { index, leaving, reduced }
}
