import { memo, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
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
  | 'prop'

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
  prop: { w: 512, h: 512 },
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
  /**
   * Hop on hover (or on tap, where there is no hover). Opt-in, and off
   * everywhere by default.
   *
   * IT CANNOT BE A CLASS ON THIS COMPONENT'S OWN SPAN, which is the obvious
   * shape and the one that silently does nothing. That span always carries
   * `.nori--float`, and `animated={false}` — which every anchored mascot on the
   * site passes — sets `data-static`, which `nori.css` turns into
   * `animation: none` on that exact element. A hop class handed in through
   * `className` lands there and is killed by the attribute the caller already
   * set. Two animations on one element do not compose either; the later
   * `transform` wins outright rather than adding.
   *
   * So `hop` emits its OWN box inside the span. Nesting is what lets the hop
   * multiply with an idle running on a wrapper outside, instead of replacing
   * it — which is how the hero can breathe and jump at the same time.
   *
   * LEAVE IT UNSET AND THE POSE DECIDES — see `HOP_BY_DEFAULT`. Pass `false` to
   * force it off, `true` to force it on; an explicit value always wins.
   */
  hop?: boolean
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
  hop,
  className,
  title = null,
}: NoriProps) {
  const alt = title ?? ''
  // Unset means "ask the pose". `??` and not `||`, so `hop={false}` is honoured
  // rather than falling through to the default.
  const hops = hop ?? pose === HOP_BY_DEFAULT
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
      <Hoppable hop={hops} airSrc={`/nori-${HOP_AIRBORNE}.svg`}>
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
      </Hoppable>
    </span>
  )
}

/**
 * The airborne frame.
 *
 * THE ARMS ARE THE REASON THIS EXISTS. Nori is one static drawing per pose and
 * nothing here re-paths it, so a jumping figure cannot raise its own arms —
 * `translate` and `scale` move a picture, they do not change what is in it. The
 * only honest way to get limb movement out of static artwork is the way hand-
 * drawn animation has always done it: cut to a different drawing. `wave` already
 * has an arm up, it is the same character on the same rig at the same 512 box,
 * and swapped in for the airborne stretch it reads as arms thrown up mid-jump.
 *
 * Two frames, not a tween. The cut is instant and that is correct — inbetweening
 * two poses by crossfading them would give a translucent double-exposure, which
 * is the one thing that would make it look cheap.
 */
const HOP_AIRBORNE: NoriPose = 'wave'

/**
 * The pose that hops unless told otherwise.
 *
 * `prop` was drawn for one placement and is used in one place: the hero
 * headline. `tools/nori.mjs` says so in its own note — "drawn for the hero
 * headline, and drawn because none of the other twelve could go there". A pose
 * that exists for a single spot can carry that spot's behaviour.
 *
 * IT IS HERE BECAUSE THE PROP KEPT GETTING LOST. The hop was originally opted
 * into from `Hero.tsx` with a single word, which is the smallest possible
 * footprint in a file another agent is actively rewriting — and it was
 * overwritten twice, each time silently, because a missing boolean does not
 * fail a build or a lint or an axe run. It only shows up as "the animation
 * stopped working". Defaulting from the pose removes the contested file from
 * the picture entirely: the hero needs no opt-in, so there is nothing left in
 * it to lose.
 *
 * Every other mascot on the site is unaffected. The anchored poses — `sit` on a
 * rule, `peek` over a card edge, `read` beside a case — must NOT hop: they are
 * placed by a measured contact point and a jump is precisely the motion that
 * breaks it. They keep the default of no hop, and `hop={false}` is available if
 * `prop` is ever placed somewhere a jump would be wrong.
 */
const HOP_BY_DEFAULT: NoriPose = 'prop'

/**
 * The hop's box. Renders nothing extra when `hop` is false, so every existing
 * mascot's markup is byte-identical to what it was.
 *
 * The head crop never reaches here: it returns an `<svg>` several lines above,
 * and it is a 24px nav mark. A mark that jumps when the cursor passes over the
 * wordmark would be a fidget, not a detail.
 *
 * WHY THERE IS JAVASCRIPT HERE AT ALL, given this file's contract says no JS in
 * the motion path. There still is none: nothing below computes a frame, reads a
 * clock or touches a transform. It sets one attribute when the visitor taps and
 * removes it when the browser says the animation ended — the same shape as
 * `Reveal`, where an IntersectionObserver flips `data-revealed` and CSS does
 * every frame. The alternative for a tap-triggered animation is `:active`, and
 * that is broken by construction: the selector stops matching the instant a
 * finger lifts, so a quick tap cancels the animation mid-flight and the figure
 * snaps back to the ground.
 */
function Hoppable({
  hop,
  airSrc,
  children,
}: {
  hop: boolean
  airSrc: string
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  /**
   * Start, or RESTART, the hop.
   *
   * The attribute is driven straight on the node rather than through state,
   * and the reason is the restart. React state cannot express "the same value,
   * again": tapping mid-hop would set `hopping` from true to true, React would
   * see no change, and the tap would land on a dead element. Removing the
   * attribute, forcing a reflow, and putting it back is the one sequence a
   * browser reads as a NEW animation rather than a continuing one.
   *
   * `void el.offsetWidth` is that reflow. Without it the removal and the re-add
   * are coalesced into a single style recalculation and nothing restarts —
   * which is the bug this looked like before, where the second tap did nothing.
   *
   * This is still not JS in the motion path. Nothing here computes a frame or
   * reads a clock; it toggles one attribute and CSS does every frame of the
   * animation, exactly as `Reveal` does with `data-revealed`.
   */
  const start = useCallback(() => {
    const el = ref.current
    if (!el || reduced) return
    el.removeAttribute('data-hopping')
    void el.offsetWidth
    el.setAttribute('data-hopping', '')
  }, [reduced])

  /**
   * The one on load, and it waits.
   *
   * The hero's own entrance runs on a stagger out to ~0.46s, and a mascot
   * jumping while the headline is still arriving is two things competing for
   * the same moment. 1.1s puts it just after the page has settled, which is
   * also about when a reader's eye has finished the headline and is free to
   * notice something small moving.
   */
  useEffect(() => {
    if (!hop || reduced) return
    const t = setTimeout(start, 1100)
    return () => clearTimeout(t)
  }, [hop, reduced, start])

  if (!hop) return children

  return (
    <span
      ref={ref}
      className="nori-hop"
      // Pointer, not click: `onClick` waits out the double-tap delay in some
      // mobile browsers, and this should answer the finger immediately. One
      // handler covers mouse, touch and pen.
      onPointerDown={start}
      // Only the box's own animation ends the hop. The two frames inside run
      // visibility animations of the same length and their events bubble
      // through here — clearing on one of those would strand the figure on the
      // wrong drawing.
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.removeAttribute('data-hopping')
      }}
    >
      <span className="nori-frame nori-frame--ground">{children}</span>
      {/* Decorative twin of a decorative image: always hidden from the tree,
          whatever the caller asked for on the pose itself. */}
      <span className="nori-frame nori-frame--air" aria-hidden="true">
        <img src={airSrc} alt="" draggable={false} decoding="async" />
      </span>
    </span>
  )
}

export const Nori = memo(NoriComponent)
