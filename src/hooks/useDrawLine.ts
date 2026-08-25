import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Draws an SVG path once it enters view.
 *
 * This was the only thing GSAP was still doing on the site, at a cost of about
 * 100 kB gzipped for a single stroke. The dash length is the one value that
 * genuinely needs measuring; everything after that is a CSS transition on
 * `stroke-dashoffset`. Reduced motion skips straight to the drawn state.
 */
export function useDrawLine<T extends SVGGeometryElement>(delay = 0) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const draw = () => {
      el.style.strokeDasharray = ''
      el.style.strokeDashoffset = ''
    }

    if (reduced) {
      draw()
      return
    }

    const length = el.getTotalLength()
    el.style.strokeDasharray = String(length)
    el.style.strokeDashoffset = String(length)
    el.style.transition = `stroke-dashoffset 1.3s var(--ease-entrance) ${delay}s`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.strokeDashoffset = '0'
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      // Never strand a half-drawn rule on screen.
      draw()
    }
  }, [reduced, delay])

  return ref
}
