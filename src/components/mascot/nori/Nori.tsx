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

export type NoriPose =
  | 'wave'
  | 'idea'
  | 'laptop'
  | 'data'
  | 'rocket'
  | 'sleep'
  // Poses drawn to be COMPOSED WITH TYPE rather than parked beside it. The
  // first six are whole-figure drawings that only work at 150px+; these are
  // built to sit against a heading, a rule or a card edge at 80-140px.
  | 'lean'
  | 'sit'
  | 'peek'
  | 'point'
  | 'hold'
  | 'read'

/**
 * Each pose's own box, in its file's coordinates.
 *
 * Every pose is square except `peek`, which is 512x274 because the bottom of
 * its viewBox IS the edge being peeked over — the body is cut flat there. A
 * square box would leave 192 units of blank space below the drawing, and the
 * whole point of that file is that it butts flush against a real rule.
 *
 * `size` always means WIDTH. Height is derived, so nothing ever squashes.
 */
const POSE_BOX: Record<NoriPose, { w: number; h: number }> = {
  wave: { w: 512, h: 512 },
  idea: { w: 512, h: 512 },
  laptop: { w: 512, h: 512 },
  data: { w: 512, h: 512 },
  rocket: { w: 512, h: 512 },
  sleep: { w: 512, h: 512 },
  lean: { w: 512, h: 512 },
  sit: { w: 512, h: 512 },
  peek: { w: 512, h: 274 },
  point: { w: 512, h: 512 },
  hold: { w: 512, h: 512 },
  read: { w: 512, h: 512 },
}

/**
 * Head-and-ears crop, in the source files' own 512 coordinate space.
 *
 * The nav needs a ~28px mark, and a full-body Nori at that size is a grey pill:
 * arms, feet and chest panel all collapse into the silhouette. Cropping to the
 * head keeps the two things that survive — the ears and the eyes.
 *
 * Measured off the current drawings: ear tips reach y30 and span x118-394, the
 * head runs y86-314. The box is a little wider and taller than that so nothing
 * touches its edge.
 */
const HEAD_CROP = { x: 112, y: 22, w: 288, h: 302 }

/**
 * The pose the head crop is taken from.
 *
 * NOT `wave`: its raised arm passes y250 on the way out, which is inside any
 * box tight enough to be a head, and the mark renders as a face with a lump
 * stuck to one ear. `data` keeps both arms below y326, outside the crop
 * entirely. Head, ears and eyes are identical across every pose, so this costs
 * nothing but the expression.
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
  const box = POSE_BOX[pose]

  if (crop === 'head') {
    // An <svg> wrapper is what makes the crop possible: <img> has no viewBox,
    // so there is no way to show part of the file without an outer coordinate
    // system to clip it against.
    return (
      <svg
        className={`nori ${className ?? ''}`}
        width={Math.round((size * HEAD_CROP.w) / HEAD_CROP.h)}
        height={size}
        viewBox={`${HEAD_CROP.x} ${HEAD_CROP.y} ${HEAD_CROP.w} ${HEAD_CROP.h}`}
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
        // Derived, never assumed square: `peek` is 512x320 and an explicit
        // square height would squash it. Both dimensions stay explicit so the
        // image reserves its own space and nothing shifts on load.
        height={Math.round((size * box.h) / box.w)}
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
