import './chibi.css'

/**
 * Shared plush parts.
 *
 * Everything that makes the five proposals read as ONE hand lives here: the
 * gradients, the eye, the blush and the contact shadow. If a character draws
 * its own eye rather than using `<ChibiEyes>`, the set stops being a set.
 *
 * Components only in this file — mixing non-component exports into a module
 * breaks React Fast Refresh for the whole file, which is why `cx` lives alone
 * in its own module too.
 */

/**
 * The gradients each character instance needs. Ids are prefixed per instance
 * because several of these coexist on one page and duplicate gradient ids
 * silently resolve to whichever painted first.
 */
export function ChibiDefs({ id }: { id: string }) {
  return (
    <defs>
      {/* Body volume: lit upper-left, falling to the tinted paper lower-right.
          This gradient IS the style — flatten it and the plush look goes. */}
      <radialGradient id={`${id}-body`} cx="36%" cy="28%" r="82%">
        <stop offset="0%" stopColor="var(--k-body)" />
        <stop offset="58%" stopColor="var(--k-body)" />
        <stop offset="100%" stopColor="var(--k-body-2)" />
      </radialGradient>
      {/* The eye. Slightly lifted at the top so it reads as a sphere rather
          than a hole punched in the face. */}
      <radialGradient id={`${id}-eye`} cx="42%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#3c5142" />
        <stop offset="55%" stopColor="var(--k-ink)" />
        <stop offset="100%" stopColor="#0d1712" />
      </radialGradient>
      <radialGradient id={`${id}-accent`} cx="34%" cy="24%" r="84%">
        <stop offset="0%" stopColor="var(--k-accent)" />
        <stop offset="100%" stopColor="var(--k-accent-2)" />
      </radialGradient>
      {/* Contact shadow. Dense under the body, gone by the rim — a flat
          ellipse reads as a sticker sitting on the page. */}
      <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--k-shadow)" stopOpacity="0.85" />
        <stop offset="65%" stopColor="var(--k-shadow)" stopOpacity="0.3" />
        <stop offset="100%" stopColor="var(--k-shadow)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-blush`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--k-blush)" stopOpacity="0.9" />
        <stop offset="100%" stopColor="var(--k-blush)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/**
 * The eye pair — the whole character, really.
 *
 * TWO HIGHLIGHTS, never one: a large soft catchlight up-left and a small hard
 * one down-right. One highlight reads as a decal; two read as a wet sphere,
 * and that single difference is most of the distance between "cute" and
 * "clip-art". The lower-right one is deliberately tiny — matching their size
 * flattens the eye straight back out.
 */
export function ChibiEyes({
  id,
  cx1,
  cx2,
  cy,
  r,
  compact = false,
}: {
  id: string
  cx1: number
  cx2: number
  cy: number
  r: number
  compact?: boolean
}) {
  const eye = (cx: number) => (
    <g key={cx}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.12} fill={`url(#${id}-eye)`} />
      {!compact ? (
        <>
          <ellipse
            cx={cx - r * 0.34}
            cy={cy - r * 0.42}
            rx={r * 0.36}
            ry={r * 0.42}
            fill="#ffffff"
            opacity={0.95}
          />
          <circle cx={cx + r * 0.36} cy={cy + r * 0.4} r={r * 0.17} fill="#ffffff" opacity={0.75} />
        </>
      ) : (
        <circle cx={cx - r * 0.3} cy={cy - r * 0.36} r={r * 0.34} fill="#ffffff" />
      )}
    </g>
  )
  return <g className="chibi__eyes">{[eye(cx1), eye(cx2)]}</g>
}

/** Soft cheeks. Radial, never a flat disc — a flat one reads as a sticker. */
export function ChibiBlush({
  id,
  cx1,
  cx2,
  cy,
  r = 6,
}: {
  id: string
  cx1: number
  cx2: number
  cy: number
  r?: number
}) {
  return (
    <g>
      <ellipse cx={cx1} cy={cy} rx={r} ry={r * 0.66} fill={`url(#${id}-blush)`} />
      <ellipse cx={cx2} cy={cy} rx={r} ry={r * 0.66} fill={`url(#${id}-blush)`} />
    </g>
  )
}

/** The ground contact shadow, animated against the float. */
export function ChibiShadow({ id, cy = 93, rx = 27 }: { id: string; cy?: number; rx?: number }) {
  return (
    <ellipse
      className="chibi__shadow"
      cx={50}
      cy={cy}
      rx={rx}
      ry={rx * 0.2}
      fill={`url(#${id}-shadow)`}
    />
  )
}

/** Four-point sparkles. The one piece of pure decoration the style allows. */
export function ChibiSparks({
  points,
}: {
  points: { x: number; y: number; s: number; k?: 'b' | 'c' }[]
}) {
  return (
    <g fill="var(--k-accent)">
      {points.map((p, i) => (
        <path
          key={i}
          className={`chibi__spark${p.k ? ` chibi__spark--${p.k}` : ''}`}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          d={`M${p.x} ${p.y - p.s} Q${p.x + p.s * 0.2} ${p.y - p.s * 0.2} ${p.x + p.s} ${p.y}
              Q${p.x + p.s * 0.2} ${p.y + p.s * 0.2} ${p.x} ${p.y + p.s}
              Q${p.x - p.s * 0.2} ${p.y + p.s * 0.2} ${p.x - p.s} ${p.y}
              Q${p.x - p.s * 0.2} ${p.y - p.s * 0.2} ${p.x} ${p.y - p.s} Z`}
        />
      ))}
    </g>
  )
}
