import { memo, useId } from 'react'
import './characters.css'

/**
 * FYR — the keeper. Character form.
 *
 * THE STORY IT TELLS: "We believe enterprise AI is won in production."
 *
 * The instrument version of Fyr argues this by being a diagram. The character
 * argues it by being someone who LIVES THERE. A consultant visits; a keeper
 * stays. Fyr is in the water in the picture — not beside it, not above it on
 * a rock — and the waterline crosses its body, which is the whole claim in
 * one line of geometry. Norrin does not deliver to the shore.
 *
 * Everything else follows from being a buoy rather than a lighthouse:
 *   - It is bottom-heavy, so it rights itself after a knock. The silhouette
 *     is deliberately widest below the waterline.
 *   - It is MOORED. The chain is the visual form of "integrated with your
 *     data" — without it the character is merely floating near the problem.
 *     A pilot is untethered by definition, so the chain is absent there.
 *   - Its lamp keeps a rhythm, not a pulse. Real sea marks are dark far
 *     longer than they are lit; a steady throb reads as a gadget.
 *
 * The four states are the same grammar the instrument uses, so this can drop
 * straight into TheGap in place of it. The difference is where the state is
 * carried: the instrument changes its TOPMARK, the character changes its
 * FACE. That is the trade the character form makes — more warmth, less
 * precision — and it is why both versions still exist.
 */

export type FyrState = 'pilot' | 'deploying' | 'production' | 'gap'

type Mood = {
  /** Brow pair. Left brow first; the right is mirrored on x=50. */
  brow: string
  /** Mouth path, or null for a neutral line. */
  mouth: string
  lit: boolean
  moored: boolean
}

/**
 * Expression lives entirely in TWO strokes and one curve. That is not
 * minimalism for its own sake — the fewer marks a face carries, the more
 * each one has to be read, and a character that says four different things
 * with the same three marks reads as one character in four moods rather than
 * as four drawings.
 *
 * Brows do the work. The mouth only confirms what the brows already said,
 * which is also how it works on real faces.
 */
const MOOD: Record<FyrState, Mood> = {
  // Inner ends RAISED — the universal worried brow. Unlit and unmoored: this
  // is the pilot, floating free, marking nothing, and it knows.
  pilot: {
    brow: 'M39.6 43.4 C42.4 41.6 45 40.9 47.4 41.2',
    mouth: 'M46 59.4 C48 58 52 58 54 59.4',
    lit: false,
    moored: false,
  },
  // Inner ends LOWERED — focus, not anger. The work is underway.
  deploying: {
    brow: 'M39.6 41 C42.4 41.1 45 42 47.4 43.4',
    mouth: 'M45.8 58.8 L54.2 58.8',
    lit: true,
    moored: true,
  },
  // Level and settled. The only state that gets a real smile, and it is a
  // small one: this is competence, not delight.
  production: {
    brow: 'M39.6 42 C42.4 40.9 45 40.9 47.4 42',
    mouth: 'M45.6 58 C48 61.4 52 61.4 54.4 58',
    lit: true,
    moored: true,
  },
  // Lit and moored but braced — the gap is the thing being pointed AT, so the
  // keeper is at work in bad water rather than in trouble.
  gap: {
    brow: 'M39.6 40.8 C42.4 41.6 45 42.4 47.4 42.6',
    mouth: 'M46 59.6 C48 58.4 52 58.4 54 59.6',
    lit: true,
    moored: true,
  },
}

/** One wavelength is 14 units, so translating by -28 loops seamlessly. */
const WAVE =
  'M-30 0 q7 -3.4 14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0 t14 0'

type FyrCharProps = {
  state?: FyrState
  size?: number
  animated?: boolean
  showWater?: boolean
  className?: string
  title?: string | null
}

function FyrCharComponent({
  state = 'production',
  size = 200,
  animated = true,
  showWater = true,
  className,
  title = null,
}: FyrCharProps) {
  const uid = useId().replace(/:/g, '')
  const mood = MOOD[state]

  return (
    <svg
      className={`ch chFyr ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-static={!animated || undefined}
      data-state={state}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      <defs>
        {/* The band is clipped to the body rather than drawn as a fitted path.
            A fitted path has to be re-authored every time the body changes;
            a clip just keeps working. */}
        <clipPath id={`fyr-body-${uid}`}>
          <path d="M50 26 C62 26 70 38 70 55 C70 74 62 86 50 86 C38 86 30 74 30 55 C30 38 38 26 50 26 Z" />
        </clipPath>
        {mood.lit ? (
          <radialGradient id={`fyr-glow-${uid}`}>
            <stop offset="0%" stopColor="var(--c-sun)" stopOpacity="0.5" />
            <stop offset="45%" stopColor="var(--c-sun)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--c-sun)" stopOpacity="0" />
          </radialGradient>
        ) : null}
      </defs>

      {/* Water BEHIND the body. Two waves at different depths is what makes a
          waterline read as a surface rather than as a drawn line. */}
      {showWater ? (
        <g className="chFyr__wave" opacity={0.45}>
          <path d={WAVE} transform="translate(0 79)" stroke="var(--c-rim)" strokeWidth={1.5} />
        </g>
      ) : null}

      <g className="ch__boil">
        <g className="chFyr__bob">
          {/* Mooring. Drawn first so the body covers where it enters. */}
          {/* Mooring, as CHAIN LINKS rather than a line with a foot on it. A
              straight stem ending in a crossbar reads as the stand of a table
              lamp, which turned the whole character into an object sitting on
              a surface — the exact opposite of floating. Links descending into
              the water say tethered and say it downward. */}
          {mood.moored ? (
            <g stroke="var(--c-rim)" strokeWidth={1.5} fill="none" opacity={0.45}>
              <ellipse cx={50} cy={87.5} rx={1.7} ry={2.6} />
              <ellipse cx={50} cy={91.6} rx={1.7} ry={2.6} />
              <ellipse cx={50} cy={95.7} rx={1.7} ry={2.6} />
            </g>
          ) : null}

          {/* Arms. Stroked rather than filled: a stroke with a round cap IS a
              limb at this scale, and filling one costs eight more points. */}
          <g stroke="var(--c-body)" strokeWidth={3.6}>
            <path d="M32 60 C26 59.4 22.6 63 23 67.6" />
            <path d="M68 60 C74 59.4 77.4 63 77 67.6" />
          </g>
          <g fill="var(--c-body)" stroke="var(--c-line)" strokeWidth={1.15}>
            <circle cx={22.4} cy={69.4} r={4.6} />
            <circle cx={77.6} cy={69.4} r={4.6} />
          </g>

          {/* Body. Widest below the waterline — that is the self-righting
              claim made as a silhouette. */}
          <path
            d="M50 26 C62 26 70 38 70 55 C70 74 62 86 50 86 C38 86 30 74 30 55 C30 38 38 26 50 26 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.9}
          />

          {/* Livery band. Real buoys carry one; here it doubles as the line
              that stops the body reading as a plain egg. */}
          <g clipPath={`url(#fyr-body-${uid})`}>
            <rect x={28} y={66} width={44} height={7.4} fill="var(--c-moss)" opacity={0.9} />
            <rect x={28} y={73.4} width={44} height={13} fill="var(--c-shade)" opacity={0.55} />
          </g>

          {/* Face patch. Fixed paper, never --ground: theme-keyed it goes black
              in dark mode and a dark face with pale eyes reads haunted. */}
          <ellipse
            cx={50}
            cy={50}
            rx={16}
            ry={13.6}
            fill="var(--c-paper)"
            stroke="var(--c-line)"
            strokeWidth={1.15}
          />

          <ellipse cx={40.4} cy={55.4} rx={3.2} ry={1.9} fill="var(--c-moss)" opacity={0.32} />
          <ellipse cx={59.6} cy={55.4} rx={3.2} ry={1.9} fill="var(--c-moss)" opacity={0.32} />

          <g className="chFyr__eyes">
            <circle cx={43.6} cy={50} r={4.1} fill="var(--c-line)" />
            <circle cx={56.4} cy={50} r={4.1} fill="var(--c-line)" />
            <circle cx={45} cy={48.5} r={1.4} fill="var(--c-paper)" />
            <circle cx={57.8} cy={48.5} r={1.4} fill="var(--c-paper)" />
          </g>

          <g stroke="var(--c-line)" strokeWidth={1.6} fill="none">
            <path d={mood.brow} />
            <path d={mood.brow} transform="translate(100 0) scale(-1 1)" />
            <path d={mood.mouth} strokeWidth={1.4} />
          </g>

          {/* Lantern. The cage sits on a short neck so the light stays a
              separate signal instead of becoming a hat. */}
          <rect
            x={46.4}
            y={17.5}
            width={7.2}
            height={10}
            rx={2.4}
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.15}
          />
          {mood.lit ? (
            <circle
              className="chFyr__flash"
              cx={50}
              cy={13.6}
              r={12}
              fill={`url(#fyr-glow-${uid})`}
            />
          ) : null}
          <path
            d="M38.6 19.4 L61.4 19.4 L58.4 7.6 L41.6 7.6 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />
          {mood.lit ? (
            <circle className="chFyr__flash" cx={50} cy={13.5} r={5.4} fill="var(--c-sun)" />
          ) : (
            <circle cx={50} cy={13.5} r={5.4} fill="var(--c-shade)" opacity={0.7} />
          )}
          {/* Cage bars, over the light so it reads as caged rather than as a
              sticker sitting on top of the housing. */}
          <g stroke="var(--c-line)" strokeWidth={1.1} opacity={0.85}>
            <path d="M44.6 19.4 L45.8 7.6" />
            <path d="M55.4 19.4 L54.2 7.6" />
          </g>
          <path
            d="M50 1.4 L64.6 8.2 L35.4 8.2 Z"
            fill="var(--c-moss)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />
        </g>
      </g>

      {/* Water IN FRONT, so the body is genuinely in it. This single overlap is
          what separates "deployed in your water" from "floating past it". */}
      {showWater ? (
        <g className="chFyr__wave">
          <path d={WAVE} transform="translate(0 83.5)" stroke="var(--c-rim)" strokeWidth={2} />
        </g>
      ) : null}
    </svg>
  )
}

export const FyrChar = memo(FyrCharComponent)
