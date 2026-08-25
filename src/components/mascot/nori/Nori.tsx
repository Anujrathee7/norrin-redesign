import { memo } from 'react'
import './nori.css'

/**
 * NORI — Norrin's mascot.
 *
 * The artwork is the user's, shipped as six finished SVGs in `public/`. This
 * component does not redraw any of it: it places, sizes and idles them, and
 * nothing here recolours or re-paths the files. If a pose needs to change, the
 * file changes — not this component.
 *
 * WHY <img> AND NOT INLINE SVG. Inlining would allow theming the fills from
 * CSS, which is exactly the reason not to do it: the palette is authored, and
 * a component that can repaint it will eventually repaint it by accident.
 * Referencing the files keeps a single source of truth, keeps them cacheable,
 * and keeps the six poses editable in a vector tool without touching the app.
 *
 * The one thing added on top is a slow idle float, applied to a wrapper rather
 * than to the artwork, so it composes with the motion the drawings already
 * imply (the wave arcs, the Zzz) instead of fighting it.
 */

export type NoriPose = 'wave' | 'idea' | 'laptop' | 'data' | 'rocket' | 'sleep'

/**
 * Head-and-ears crop, in the source files' own 512 coordinate space.
 *
 * The nav needs a ~28px mark and a full-body Nori at that size is a grey pill
 * — antenna, arms and feet all collapse into the silhouette. Cropping to the
 * head keeps the eyes, which are the only part that has to survive.
 *
 * Measured off the files: skull top y138, ears y238-284 spanning x110-402.
 * The box stops at y300 because that is where the arms attach.
 */
const HEAD_CROP = '104 132 304 172'

/**
 * The pose the head crop is taken from.
 *
 * NOT `wave`, which is the obvious choice and the wrong one: its raised arm
 * reaches (402,228) with the hand at (405,219) — ABOVE the eyes — so it lands
 * inside any box tight enough to be a head, and the mark renders as a face
 * with a lump stuck to its ear. `data` keeps both arms below y308, which is
 * outside the crop entirely. The skull, ears, antenna and eyes are identical
 * across every pose, so this costs nothing but the expression.
 */
const HEAD_POSE: NoriPose = 'data'

type NoriProps = {
  pose?: NoriPose
  /** Rendered size in px (square, except `head` which is wider than tall). */
  size?: number
  /** `full` is the whole character; `head` crops to the face for small marks. */
  crop?: 'full' | 'head'
  animated?: boolean
  className?: string
  /**
   * Accessible name. Omit for decorative instances — most are, since the
   * character never carries information the copy does not already state.
   */
  title?: string | null
}

function NoriComponent({
  pose = 'wave',
  size = 200,
  crop = 'full',
  animated = true,
  className,
  title = null,
}: NoriProps) {
  const alt = title ?? ''
  // The head crop always draws from HEAD_POSE — see the note there.
  const src = `/nori-${crop === 'head' ? HEAD_POSE : pose}.svg`

  if (crop === 'head') {
    // An <svg> wrapper is what makes the crop possible: <img> has no viewBox,
    // so there is no way to show part of the file without an outer coordinate
    // system to clip it against.
    return (
      <svg
        className={`nori ${className ?? ''}`}
        width={(size * 304) / 172}
        height={size}
        viewBox={HEAD_CROP}
        data-static={!animated || undefined}
        data-pose={pose}
        role={title ? 'img' : 'presentation'}
        aria-label={title ?? undefined}
        aria-hidden={title ? undefined : true}
        focusable="false"
      >
        {title ? <title>{title}</title> : null}
        <image href={src} x={0} y={0} width={512} height={512} />
      </svg>
    )
  }

  return (
    <span
      className={`nori nori--float ${className ?? ''}`}
      data-static={!animated || undefined}
      data-pose={pose}
    >
      <img
        src={src}
        width={size}
        height={size}
        alt={alt}
        // Decorative instances must be removed from the tree entirely, not
        // just given an empty alt — an empty alt on a sized img still reports
        // as an unlabelled graphic in some readers.
        aria-hidden={title ? undefined : true}
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

export const Nori = memo(NoriComponent)
