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

/**
 * Which way the content arrives.
 *
 * Direction is not decoration: a list of roles reading left-to-right wants to
 * arrive from the left, a stat wants to rise, and a case card wants to be
 * uncovered. Using one direction everywhere is what makes a page feel
 * templated even when every other decision is considered.
 */
export type RevealVariant = 'up' | 'rise' | 'left' | 'right' | 'scale' | 'wipe'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Seconds before the transition starts. */
  delay?: number
  /** Stagger direct children by this many seconds instead of moving as a block. */
  stagger?: number
  variant?: RevealVariant
  /**
   * `lines` mode: children are expected to be `.line-mask` wrappers, and the
   * block itself does not fade — only the lines inside it rise. Used for
   * headings, via SplitLines.
   */
  lines?: boolean
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  stagger,
  variant = 'up',
  lines = false,
}: RevealProps) {
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

    if (lines) {
      // Each masked line gets its own delay, so the heading arrives as a
      // sequence rather than as a block that happens to be split.
      el.querySelectorAll<HTMLElement>('.line-mask > *').forEach((line, i) => {
        line.style.setProperty('--line-delay', `${delay + i * (stagger ?? 0.09)}s`)
      })
    } else if (stagger) {
      Array.from(el.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--reveal-delay', `${delay + i * stagger}s`)
      })
    } else {
      el.style.setProperty('--reveal-delay', `${delay}s`)
    }

    // Anything already visible at first paint must reveal even if the page
    // never scrolls. On large viewports a section can sit inside the initial
    // view (or in the -12% rootMargin dead-zone) and never cross the
    // observer's threshold — leaving it stuck at its hidden state. Check the
    // REAL viewport, not the observer's shrunk root.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      show()
      return
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
  }, [reduced, delay, stagger, lines])

  return (
    <Tag
      ref={ref}
      data-reveal={lines ? 'lines' : stagger ? 'stagger' : ''}
      data-variant={variant === 'up' ? undefined : variant}
      className={cx(className)}
    >
      {children}
    </Tag>
  )
}
