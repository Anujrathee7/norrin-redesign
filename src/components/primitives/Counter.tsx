import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * A number that counts up when it arrives.
 *
 * THE FINAL VALUE IS THE INITIAL STATE. `useState` is seeded with the real
 * number, not with zero, and only an observer that actually fires ever winds
 * it back to count up. That ordering matters more than it looks: the whole
 * point of these figures is that they are Norrin's strongest credibility
 * signals, and a stat that renders as "0" because an observer missed, or
 * because the tab was backgrounded during mount, is worse than no animation at
 * all. Every failure mode here shows the true figure.
 *
 * Reduced motion never winds back, so the number is simply correct and still.
 *
 * The easing is a quintic ease-out: the count is nearly done in the first third
 * of its duration, which is what makes it read as a value settling rather than
 * as a slot machine. A linear count feels mechanical at any duration.
 */
export function Counter({
  value,
  duration = 1.5,
  decimals = 0,
  className,
}: {
  value: number
  /** Seconds. */
  duration?: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return

    let raf = 0
    let done = false

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / (duration * 1000), 1)
        // Quintic ease-out.
        const eased = 1 - Math.pow(1 - t, 5)
        setShown(value * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
        else setShown(value)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done) {
            done = true
            setShown(0)
            run()
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {shown.toFixed(decimals)}
    </span>
  )
}
