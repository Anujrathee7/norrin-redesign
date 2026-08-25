import { memo, useId } from 'react'
import './fyr.css'

/**
 * FYR — Norrin's sea mark.
 *
 * A spar buoy: ballasted, moored, permanently on station, carrying a light.
 * It is not decoration — its shape is a diagram. The topmark encodes how far
 * a piece of work has travelled from pilot to production, borrowing the IALA
 * buoyage grammar rather than inventing a private symbol set:
 *
 *   none + unlit + untethered  → a pilot. Floating free, marking nothing.
 *   cone (point up)            → deployment. The route is being marked.
 *   sphere (safe water mark)   → production. Running, governed, trusted.
 *   two cones point-to-point   → isolated danger: the pilot→production gap.
 *
 * Because the meaning is carried by SHAPE, the mark says exactly the same
 * thing with every animation disabled.
 *
 * Construction note: the topmark is mounted on a thin mast, well clear of the
 * float. That separation is load-bearing — without it the lamp and body read
 * as a head on shoulders, and the mark turns into a character with a face.
 * It must stay an instrument.
 */

export type FyrState = 'pilot' | 'deploying' | 'production' | 'gap'

/**
 * Topmark outlines, centred on (12, 6.2) with a 2.2 × 1.8 half-extent.
 * Every variant is deliberately built from the same command structure —
 * M, five C curves, Z — so the browser can interpolate `d` between any two
 * without the path collapsing. The sphere carries one degenerate curve at its
 * lowest point purely to keep that count matched.
 */
const TOPMARK: Record<FyrState, string | null> = {
  pilot: null,
  deploying:
    'M12 4.4 C12 4.4 13.1 6.2 13.1 6.2 C13.1 6.2 14.2 8 14.2 8 ' +
    'C14.2 8 9.8 8 9.8 8 C9.8 8 10.9 6.2 10.9 6.2 C10.9 6.2 12 4.4 12 4.4 Z',
  production:
    'M12 4.4 C12.99 4.4 13.8 5.21 13.8 6.2 C13.8 7.19 12.99 8 12 8 ' +
    'C12 8 12 8 12 8 C11.01 8 10.2 7.19 10.2 6.2 C10.2 5.21 11.01 4.4 12 4.4 Z',
  gap:
    'M9.8 4.4 C9.8 4.4 14.2 4.4 14.2 4.4 C14.2 4.4 12 6.2 12 6.2 ' +
    'C12 6.2 14.2 8 14.2 8 C14.2 8 9.8 8 9.8 8 C9.8 8 12 6.2 12 6.2 Z',
}

/**
 * Below ~44px the mark is redrawn rather than merely scaled: the sea, mooring
 * and glow are dropped and everything that survives is thickened. A faithful
 * miniature of the full drawing turns to grey mush at favicon size.
 */
const TOPMARK_COMPACT: Record<FyrState, string | null> = {
  pilot: null,
  deploying: 'M12 4.8 L15.5 10.4 L8.5 10.4 Z',
  production: 'M12 4.8 A2.8 2.8 0 1 1 11.99 4.8 Z',
  gap: 'M8.5 4.8 L15.5 4.8 L12 7.6 L15.5 10.4 L8.5 10.4 L12 7.6 Z',
}

/** One wavelength is 12 units, so translating by -12 loops seamlessly. */
const WATER =
  'M-24 14.6 q3 -1.05 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0'

type FyrProps = {
  state?: FyrState
  /** Rendered size in px. */
  size?: number
  /**
   * `full` is the drawn mark; `mark` is the reduced favicon/nav form.
   * Defaults by size, but can be forced — the nav wants the reduced form at
   * 32px, and a spec sheet wants to show the reduced form large.
   */
  variant?: 'full' | 'mark' 
  /** Static instances (nav, favicon) keep the mark but drop the performance. */
  animated?: boolean
  showWater?: boolean
  showMooring?: boolean
  className?: string
  /** Accessible name. Omit for instances that are purely decorative. */
  title?: string | null
}

function FyrComponent({
  state = 'production',
  size = 240,
  variant,
  animated = true,
  showWater = true,
  showMooring = true,
  className,
  title = null,
}: FyrProps) {
  const compact = (variant ?? (size < 44 ? 'mark' : 'full')) === 'mark'
  // Instances coexist on one page, so gradient ids must not collide.
  const glowId = `fyr-glow-${useId().replace(/:/g, '')}`
  const topmark = compact ? TOPMARK_COMPACT[state] : TOPMARK[state]
  const lit = state !== 'pilot'
  // A pilot is untethered by definition — nothing moors it to real data.
  const moored = showMooring && state !== 'pilot'

  return (
    <svg
      className={`fyr ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      data-static={!animated || undefined}
      data-state={state}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {/* A flat disc reads as a smudge, never as light. The falloff is what
          makes the lamp look lit rather than stickered on. */}
      {lit && !compact ? (
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="var(--signal)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
          </radialGradient>
        </defs>
      ) : null}

      {/* The sea sits outside the heave/roll groups: water does not tilt. */}
      {showWater && !compact ? (
        <g className="fyr__water">
          <path
            d={WATER}
            stroke="currentColor"
            strokeWidth={0.55}
            strokeLinecap="round"
            opacity={0.35}
          />
        </g>
      ) : null}

      <g className="fyr__heave">
        <g className="fyr__roll">
          {/* Mooring — the tether is the visual claim "integrated with your
              data". Without it, the mark is only floating near the problem. */}
          {moored && !compact ? (
            <g opacity={0.4}>
              <path
                d="M12 20.4 L12 22.5"
                stroke="currentColor"
                strokeWidth={0.4}
                strokeLinecap="round"
              />
              <rect x={10.4} y={22.5} width={3.2} height={1} rx={0.3} fill="currentColor" />
            </g>
          ) : null}

          {/* Ballast — the reason it self-rights instead of capsizing. */}
          {!compact ? (
            <path
              d="M10.9 16.8 L13.1 16.8 L12.85 20.4 L11.15 20.4 Z"
              fill="currentColor"
              opacity={0.5}
            />
          ) : null}

          {/* Float — the buoyant collar that straddles the waterline. */}
          {!compact ? (
            <rect x={10.2} y={12.2} width={3.6} height={5.4} rx={1.8} fill="currentColor" />
          ) : null}

          {/* Mast. Thin on purpose at full size — it is what keeps the topmark
              legible as a separate signal rather than a head. At favicon size
              it becomes the body, because a 0.9u stem disappears. */}
          <rect
            x={compact ? 10.6 : 11.55}
            y={compact ? 9.5 : 2.4}
            width={compact ? 2.8 : 0.9}
            height={compact ? 12 : 11.2}
            rx={compact ? 1.4 : 0.45}
            fill="currentColor"
          />

          {topmark ? (
            <path
              className="fyr__topmark"
              d={topmark}
              style={{ d: `path("${topmark}")` }}
              fill="currentColor"
            />
          ) : null}

          {/* Lamp. The glow is a second circle, never a blur filter — filter
              repaints are the one genuine performance trap in an SVG this size. */}
          <g>
            {!compact ? (
              <circle
                className={lit ? 'fyr__glow' : undefined}
                cx={12}
                cy={1.6}
                r={4.6}
                fill={`url(#${glowId})`}
                opacity={lit ? 1 : 0}
              />
            ) : null}
            <circle
              className={lit ? 'fyr__lamp' : undefined}
              cx={12}
              cy={compact ? 2.2 : 1.6}
              r={compact ? 1.7 : 1}
              fill={lit ? 'var(--signal)' : 'currentColor'}
              opacity={lit && !compact ? 0.5 : 1}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export const Fyr = memo(FyrComponent)
