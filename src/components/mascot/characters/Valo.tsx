import { memo, useId } from 'react'
import './characters.css'

/**
 * VALO — Finnish for light. The watch.
 *
 * THE STORY IT TELLS: "Continuous services and AIOps keep it all running
 * 24/7", and the adoption half of AI Transformation — the part that is not a
 * platform and not a deployment but a person who stays.
 *
 * Built on the Nordic tonttu: the household keeper of folklore who works at
 * night, is never seen, and whose entire deal is that the place runs because
 * of someone you are not thinking about. That is on-call, and it is the one
 * part of Norrin's offer that has no diagram — you cannot draw 24/7 as a
 * shape. You can draw someone still awake.
 *
 * THE BEARD IS LOAD-BEARING, in the literal design sense. A tonttu is drawn
 * as cap, nose, beard, and almost nothing else, so the face reduces to two
 * eyes and a nose with no mouth at all. That solves the problem the whole
 * instrument-era ruleset was built around — Fyr may not have a face, Lunni
 * may not be drawn head-on because the beak becomes a grin — by removing the
 * mouth from the drawing entirely. Valo is the most face-forward character
 * in the set and the only one with nothing to misread.
 *
 * The lantern is the sun accent and, like Fyr's lamp, is mascot anatomy and
 * outside the three-solid budget. It swings from the fist rather than from
 * its own centre, and slower than the body breathes, because it is heavy.
 */

type ValoProps = {
  size?: number
  animated?: boolean
  /** The lantern is the "still on watch" reading. */
  lantern?: boolean
  facing?: 'left' | 'right'
  className?: string
  title?: string | null
}

function ValoComponent({
  size = 200,
  animated = true,
  lantern = true,
  facing = 'right',
  className,
  title = null,
}: ValoProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      className={`ch chValo ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-static={!animated || undefined}
      data-facing={facing === 'left' ? 'left' : undefined}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {lantern ? (
        <defs>
          <radialGradient id={`valo-glow-${uid}`}>
            <stop offset="0%" stopColor="var(--c-sun)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="var(--c-sun)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--c-sun)" stopOpacity="0" />
          </radialGradient>
        </defs>
      ) : null}

      <g className="ch__boil">
        <g className="chValo__breathe">
          {/* Feet, under everything. */}
          <g fill="var(--c-moss)" stroke="var(--c-line)" strokeWidth={1.3}>
            <path d="M35 84 C31 86 28.5 89 29 90.6 C29.6 92 36 91.8 40 90.8 C42 90.2 42.5 86 41.5 84 Z" />
            <path d="M58.5 84 C54.5 86 52 89 52.5 90.6 C53 92 59.5 91.8 63.5 90.8 C65.5 90.2 66 86 65 84 Z" />
          </g>

          {/* Body. Wide and low — a tonttu is mostly a cone with boots. */}
          <path
            d="M34 56 C28 61 25.5 73 26.5 86 L73.5 86 C74.5 73 72 61 66 56 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.9}
          />

          {/* Belt. Moss, and the only horizontal in the character — it stops
              the body reading as one undifferentiated sack. */}
          <rect
            x={25.6}
            y={74}
            width={48.8}
            height={6.4}
            fill="var(--c-moss)"
            stroke="var(--c-line)"
            strokeWidth={1.4}
          />
          <rect
            x={44}
            y={73.4}
            width={12}
            height={7.6}
            rx={1.4}
            fill="var(--c-sun)"
            stroke="var(--c-line)"
            strokeWidth={1.4}
          />

          {/* Far arm, tucked. */}
          <path
            d="M32 62 C26.5 64 24 70 25.5 74"
            stroke="var(--c-body)"
            strokeWidth={7}
            fill="none"
          />

          {/* Face strip. Only the band between cap and beard is ever visible,
              which is the entire trick: no cheeks, no jaw, no mouth. */}
          <ellipse
            cx={50}
            cy={47}
            rx={13.5}
            ry={7.6}
            fill="var(--c-paper)"
            stroke="var(--c-line)"
            strokeWidth={1.15}
          />

          {/* Beard. Wavy along the bottom rather than a smooth arc — a smooth
              one reads as a bib. */}
          <path
            d="M35 49 C30.6 57 30 69 34 77.5
               C36 81.6 40 79.6 43 81.8
               C46 84 54 84 57 81.8
               C60 79.6 64 81.6 66 77.5
               C70 69 69.4 57 65 49
               C60 54.4 40 54.4 35 49 Z"
            fill="var(--c-paper)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />
          {/* Two strands. Any more and the beard turns into a bundle of rope. */}
          <g stroke="var(--c-line)" strokeWidth={0.9} opacity={0.28} fill="none">
            <path d="M43 58 C41.5 65 41.8 73 43.5 79" />
            <path d="M57 58 C58.5 65 58.2 73 56.5 79" />
          </g>

          <g className="chValo__eyes">
            <circle cx={44} cy={46.6} r={2.8} fill="var(--c-line)" />
            <circle cx={56} cy={46.6} r={2.8} fill="var(--c-line)" />
            <circle cx={45} cy={45.6} r={0.95} fill="var(--c-paper)" />
            <circle cx={57} cy={45.6} r={0.95} fill="var(--c-paper)" />
          </g>

          {/* Nose. Over the beard, and big — on a tonttu the nose is the face.
              It is also what keeps two eyes from reading as a mask. */}
          <circle
            cx={50}
            cy={54}
            r={5.4}
            fill="var(--c-paper)"
            stroke="var(--c-line)"
            strokeWidth={1.4}
          />
          <ellipse cx={50} cy={55.4} rx={3.2} ry={2} fill="var(--c-moss)" opacity={0.25} />

          {/* Cap. Leans, because a cap that stands straight up is a party hat.
              Drawn after the face so its base overlaps the brow line. */}
          {/* Cap. The leading edge CURVES and the tip sits well off centre —
              a straight-sided cone centred over the face is a party hat, which
              is exactly what the first pass drew. The droop is the character. */}
          <path
            d="M63 7 C58 14 49 20 41 27 C36 31.4 34 37 33.4 40.8
               C33.2 42.2 33.8 43 35 43
               L66 43 C67.4 43 68 42.2 67.8 40.8
               C67 33 66 18 65.6 9.6 C65.5 7 64.4 6 63 7 Z"
            fill="var(--c-moss)"
            stroke="var(--c-line)"
            strokeWidth={1.9}
          />
          <circle
            cx={63.4}
            cy={6.4}
            r={3.6}
            fill="var(--c-sun)"
            stroke="var(--c-line)"
            strokeWidth={1.4}
          />

          {/* Near arm, reaching out to the lantern. */}
          <path
            d="M66 60 C70.6 58.4 73.8 57.2 75.4 56.4"
            stroke="var(--c-body)"
            strokeWidth={7.4}
            fill="none"
          />
        </g>

        {/* LANTERN. Outside the breathe group and pivoting on the fist, so it
            hangs rather than rides.
            ORDER IS THE WHOLE FIX HERE. The first pass drew the fist last and
            on top, which hid the bail completely and left a dark ball floating
            above a box — a balloon on a string. Bail first, then the fist over
            its apex, and the hand reads as gripping something. */}
        {lantern ? (
          <g className="chValo__lantern">
            <circle
              className="chValo__flame"
              cx={75}
              cy={71}
              r={19}
              fill={`url(#valo-glow-${uid})`}
            />
            {/* Bail, tall enough to be seen past the fist. */}
            <path
              d="M69.4 64 C69.8 55.4 80.2 55.4 80.6 64"
              stroke="var(--c-line)"
              strokeWidth={1.8}
              fill="none"
            />
            <rect
              x={67.4}
              y={63}
              width={15.2}
              height={3.6}
              rx={1.2}
              fill="var(--c-moss)"
              stroke="var(--c-line)"
              strokeWidth={1.3}
            />
            <path
              d="M69.4 66.6 L80.6 66.6 L79.2 78 L70.8 78 Z"
              fill="var(--c-body)"
              stroke="var(--c-line)"
              strokeWidth={1.5}
            />
            <rect
              className="chValo__flame"
              x={71.8}
              y={68.4}
              width={6.4}
              height={7.6}
              rx={1}
              fill="var(--c-sun)"
            />
            <rect
              x={68.4}
              y={77.6}
              width={13.2}
              height={3.4}
              rx={1.1}
              fill="var(--c-moss)"
              stroke="var(--c-line)"
              strokeWidth={1.3}
            />
            {/* The fist, gripping the bail apex. Inside the swinging group so
                hand and handle never separate. */}
            <circle
              cx={75.4}
              cy={56.6}
              r={4.4}
              fill="var(--c-body)"
              stroke="var(--c-line)"
              strokeWidth={1.4}
            />
          </g>
        ) : null}
      </g>
    </svg>
  )
}

export const Valo = memo(ValoComponent)
