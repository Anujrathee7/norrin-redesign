import { memo } from 'react'
import './characters.css'

/**
 * HIRVI — Finnish for elk. The foundation.
 *
 * THE STORY IT TELLS: Enterprise AI Foundation. "Data and integration
 * platforms, AI platforms where models and agents run, cloud infrastructure.
 * Continuous services and AIOps keep it all running 24/7."
 *
 * The metaphor is carried by one structural joke: the antlers are the rack.
 * A bull elk's antlers are palmate — broad flat blades, not branches — which
 * is genuinely shelf-shaped, and the platform rests across them with its
 * service lights running. Infrastructure you do not see, holding up the
 * things you do.
 *
 * HIRVI DOES NOT ANIMATE. Every other character in the set idles; this one is
 * still on purpose, and the stillness is the characterisation. It is the
 * thing that does not move while everything else stands on it. Only the ear
 * flicks and the three service lights cycle — the smallest possible signal
 * for "alive and serving" without the platform itself wobbling, which would
 * say precisely the wrong thing.
 *
 * It is also the largest and heaviest silhouette in the set, which is the
 * same argument again at the level of pure shape. An elk is the biggest
 * animal in the Nordic forest and the one you build your road around.
 */

type HirviProps = {
  size?: number
  animated?: boolean
  /** Without the rack it is just an elk — the platform is the whole point. */
  showRack?: boolean
  facing?: 'left' | 'right'
  className?: string
  title?: string | null
}

function HirviComponent({
  size = 200,
  animated = true,
  showRack = true,
  facing = 'left',
  className,
  title = null,
}: HirviProps) {
  return (
    <svg
      className={`ch chHirvi ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-static={!animated || undefined}
      data-facing={facing === 'right' ? 'left' : undefined}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      <g className="ch__boil">
        {/* Far legs first, in the shade tone. Two tones of leg is the cheapest
            possible depth cue and the only one this drawing needs. */}
        <g fill="var(--c-shade)" stroke="var(--c-line)" strokeWidth={1.3}>
          <path d="M52 68 L52 87 C52 89 57 89 57 87 L57 68 Z" />
          <path d="M75 68 L75 87 C75 89 80 89 80 87 L80 68 Z" />
        </g>

        {/* One combined silhouette for body, neck and head. Drawing these as
            three overlapping parts leaves seams where the strokes cross; a
            single path is more work to author and the only way the contour
            actually reads as one animal. */}
        <path
          d="M34 28
             C26 30 18 36 15 43
             C13.5 46.5 15.5 50 20 50
             C24.5 50 29 47.5 32.5 43.5
             C34 49 36.5 53.5 39.5 58
             C41 63 41 69 41 75
             L71 75
             C77 72 81 66 81 58
             C81 47 73 43 58 43
             C49 43 41 40 37.5 34
             Z"
          fill="var(--c-body)"
          stroke="var(--c-line)"
          strokeWidth={1.9}
        />

        {/* Near legs, over the body. */}
        <g fill="var(--c-body)" stroke="var(--c-line)" strokeWidth={1.5}>
          <path d="M42 70 L42 87 C42 89.4 48 89.4 48 87 L48 70 Z" />
          <path d="M65 70 L65 87 C65 89.4 71 89.4 71 87 L71 70 Z" />
        </g>
        {/* Hooves. */}
        <g fill="var(--c-moss)" stroke="var(--c-line)" strokeWidth={1.2}>
          <rect x={41.4} y={86} width={7.2} height={4.4} rx={1.4} />
          <rect x={64.4} y={86} width={7.2} height={4.4} rx={1.4} />
        </g>

        {/* The blanket. An elk carrying something is a pack animal; the band
            is what turns "an elk" into "an elk that is working". */}
        <path
          d="M55 43.4 C63 43.6 71 45.4 75.5 47.6 L72 61 C65.5 58.6 59 57.6 53.6 57.6 Z"
          fill="var(--c-moss)"
          stroke="var(--c-line)"
          strokeWidth={1.4}
          opacity={0.95}
        />

        {/* Ear. Set BESIDE the antlers rather than under them — tucked at the
            crown it was completely hidden by the rack and the flick animated
            something nobody could see. */}
        <path
          className="chHirvi__ear"
          d="M37 32 C41.4 30.6 45.6 30.8 46.6 32.8 C47.6 34.8 43.8 37.8 39.6 38.4 C37.2 38.8 36.2 35.2 37 32 Z"
          fill="var(--c-body)"
          stroke="var(--c-line)"
          strokeWidth={1.4}
        />

        {/* Muzzle. A compact pale nose at the very tip. It was a long streak
            running back along the jaw, which read as an open mouth. */}
        {/* WIDER THAN TALL, and tinted rather than paper-white. Round and
            bright it was the same size and value as the eye, so the head read
            as having two eyes on one side. A muzzle is a broad soft end, and
            dropping it off full paper settles it behind the eye in the
            reading order — which is where a nose belongs. */}
        <ellipse
          cx={18.8}
          cy={47.2}
          rx={4.6}
          ry={2.7}
          fill="var(--c-paper)"
          stroke="var(--c-line)"
          strokeWidth={1.15}
          opacity={0.62}
        />
        <ellipse cx={17} cy={46.6} rx={1.2} ry={0.85} fill="var(--c-line)" opacity={0.7} />

        {/* Eye. A big pale sclera read as startled; this is mostly pupil, with
            just enough ring to survive on a dark head. */}
        <g className="chHirvi__eyes">
          <circle cx={27.5} cy={40.4} r={2.7} fill="var(--c-paper)" />
          <circle cx={27.8} cy={40.6} r={1.75} fill="var(--c-line)" />
          <circle cx={28.5} cy={39.8} r={0.62} fill="var(--c-paper)" />
        </g>

        {/* ANTLERS — palmate blades, which is what makes them shelves.
            Deliberately LOWER and WIDER than the rack that sits on them. The
            first pass had the blades narrower than the bar, so the bar covered
            them completely and the whole thing read as a table balanced on an
            elk's head — the one reading the character exists to avoid.
            Tines are strokes rather than shaped into the path: at 40px a
            shaped tine closes up into a blob. */}
        <g fill="var(--c-body)" stroke="var(--c-line)" strokeWidth={1.5}>
          <path d="M33 31 C26 29.4 19.4 26.6 16 22.6 C14.6 21 16 19 18.4 19.4 L36.6 22 C37 26 35.4 29 33 31.2 Z" />
          <path d="M38 29.4 C45 27.6 51.6 24.8 55 21.2 C56.4 19.6 55 17.6 52.6 18 L37.4 20.6 C36.6 24.2 36.6 27.4 38 29.4 Z" />
        </g>
        {/* Tines rise to meet the rack underside — that contact is what makes
            the platform look carried instead of hovering. */}
        <g stroke="var(--c-line)" strokeWidth={1.6} opacity={0.9}>
          <path d="M18.6 20 L17 16" />
          <path d="M24 21.4 L23.4 16.4" />
          <path d="M29.6 22.6 L29.6 17" />
          <path d="M45 20.6 L45.6 16.4" />
          <path d="M50.6 19.4 L52 16" />
        </g>

        {/* THE RACK. It rests ACROSS the two blades and overhangs both, which
            is what makes it read as resting rather than as growing out of the
            animal. Three services, staggered, so it is serving rather than
            twinkling. */}
        {showRack ? (
          <g>
            <rect
              x={14}
              y={10}
              width={48}
              height={6}
              rx={1.2}
              fill="var(--c-moss)"
              stroke="var(--c-line)"
              strokeWidth={1.5}
            />
            <g fill="var(--c-body)" stroke="var(--c-line)" strokeWidth={1.4}>
              <rect x={20} y={2.2} width={11} height={7.8} rx={1.2} />
              <rect x={34} y={2.2} width={11} height={7.8} rx={1.2} />
              <rect x={48} y={2.2} width={11} height={7.8} rx={1.2} />
            </g>
            <g fill="var(--c-sun)">
              <circle className="chHirvi__svc" cx={28} cy={6.1} r={1.5} />
              <circle className="chHirvi__svc chHirvi__svc--b" cx={42} cy={6.1} r={1.5} />
              <circle className="chHirvi__svc chHirvi__svc--c" cx={56} cy={6.1} r={1.5} />
            </g>
            {/* Rack rails — the detail that says "equipment" and not "crate". */}
            <g stroke="var(--c-line)" strokeWidth={0.9} opacity={0.4}>
              <path d="M22 4.9 L25.6 4.9" />
              <path d="M36 4.9 L39.6 4.9" />
              <path d="M50 4.9 L53.6 4.9" />
            </g>
          </g>
        ) : null}

        {/* Ground. A single line, because the elk needs to be ON something for
            "holds up" to mean anything. */}
        <path d="M8 91 L92 91" stroke="var(--c-rim)" strokeWidth={1.6} opacity={0.4} />
      </g>
    </svg>
  )
}

export const Hirvi = memo(HirviComponent)
