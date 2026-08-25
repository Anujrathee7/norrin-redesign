import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/lib/cx'

/**
 * Scroll-triggered entrance.
 *
 * Deliberately NOT built on an animation library. An earlier version set
 * `autoAlpha: 0` inline via GSAP and depended on a ScrollTrigger firing to undo
 * it — which means any misfire (a resize that outruns a refresh, a failed
 * chunk, a trigger that never enters its window) leaves the content permanently
 * invisible. Copy that can silently disappear is not an acceptable trade for an
 * eighteen-pixel slide.
 *
 * Instead: the resting state is plain CSS, the hidden state is scoped to
 * `html.js`, and an IntersectionObserver flips one attribute. Every failure
 * mode lands on "content is visible":
 *   - no JS at all            → `html.js` never set, nothing is ever hidden
 *   - no IntersectionObserver → revealed immediately in the effect
 *   - reduced motion          → revealed on mount, no transition
 */

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Seconds before the transition starts. */
  delay?: number
  /** Stagger direct children by this many seconds instead of moving as a block. */
  stagger?: number
}

export function Reveal({ children, as: Tag = 'div', className, delay = 0, stagger }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.dataset.revealed = 'true'
    }

    if (reduced || typeof IntersectionObserver === 'undefined') {
      show()
      return
    }

    if (stagger) {
      Array.from(el.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--reveal-delay', `${delay + i * stagger}s`)
      })
    } else {
      el.style.setProperty('--reveal-delay', `${delay}s`)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show()
            observer.disconnect()
          }
        }
      },
      // Fire slightly before the element is fully in view, so the motion has
      // finished by the time the reader's eye arrives.
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced, delay, stagger])

  return (
    <Tag ref={ref} data-reveal={stagger ? 'stagger' : ''} className={cx(className)}>
      {children}
    </Tag>
  )
}
