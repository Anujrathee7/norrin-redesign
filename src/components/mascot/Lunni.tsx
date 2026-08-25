import { memo } from 'react'
import './lunni.css'

/**
 * LUNNI — Finnish for puffin. Fyr's companion.
 *
 * Fyr is an instrument and must stay one: its own docblock is explicit that the
 * topmark rides a thin mast well clear of the float precisely so the mark never
 * reads as a head on shoulders. Making Fyr cute would break the single thing it
 * exists to do. So the warmth lives in a second object.
 *
 * The bird is not charm bolted on. It carries the same argument the rest of the
 * page makes, in the one register a diagram cannot reach:
 *
 *   A sea bird lands on a mark that is ON STATION. It will not land on a pilot
 *   floating free — unlit, moored to nothing, marking nothing. There is nothing
 *   there to land on. So Lunni appears at production and nowhere else. It is the
 *   page's thesis told as a small act of trust instead of as a claim.
 *
 * Drawn in PROFILE, which is not a style choice. Head-on, a puffin's beak is a
 * broad shape directly below two eyes, and every viewer reads that as a mouth —
 * three iterations confirmed it, the last one unmistakably a grin. Side-on, the
 * beak projects as a wedge and the bird is a bird.
 *
 * Palette, not plumage: forest back, paper face and belly, sun beak. The beak is
 * the warmest shape on the page and is mascot anatomy, so — like Fyr's lamp — it
 * sits outside the three-solid sun budget. The face is fixed `#eef0e6` rather
 * than `--ground`: keyed to the theme it turned black in dark mode, and a dark
 * face with white eyes reads haunted rather than friendly.
 *
 * Same 24-unit viewBox as Fyr, so the two compose on one grid.
 */

type LunniProps = {
  /** Rendered size in px. */
  size?: number
  /** Static instances keep the drawing and drop the idle motion. */
  animated?: boolean
  /** `perched` adds the rail it stands on. */
  variant?: 'perched' | 'standing'
  /** Mirrors the bird, for when it should look back into the page. */
  facing?: 'left' | 'right'
  className?: string
  /** Accessible name. Omit for purely decorative instances. */
  title?: string | null
}

function LunniComponent({
  size = 120,
  animated = true,
  variant = 'standing',
  facing = 'right',
  className,
  title = null,
}: LunniProps) {
  // Below this the beak banding, the eye highlight and the wing collapse into
  // one smudge, so the bird is redrawn simplified rather than merely scaled —
  // the same rule Fyr follows at favicon size.
  const compact = size < 56

  return (
    <svg
      className={`lunni ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      data-static={!animated || undefined}
      data-facing={facing}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      <g className="lunni__bob">
        {/* Feet. Moss — the only accent allowed to be a mark this small. */}
        <ellipse cx={9.4} cy={20.3} rx={2.1} ry={0.85} fill="var(--accent)" />
        {!compact ? (
          <ellipse cx={12.2} cy={20.5} rx={1.7} ry={0.75} fill="var(--accent)" opacity={0.8} />
        ) : null}

        {/* Tail. */}
        <path d="M4.0 13.4 C2.3 12.9 1.3 12.4 1.3 12.2 C1.3 11.8 2.9 11.1 4.5 10.7 Z" fill="var(--inverse)" />

        {/* Body — the dark back and cap, one rounded blob. Puffins have no
            visible neck, which is most of why they read as round. */}
        <path
          d="M10.2 4.3 C6.5 4.3 4.0 7.4 4.0 11.7 C4.0 16.7 6.2 20.4 10.2 20.4 C14.2 20.4 16.2 16.7 16.2 11.7 C16.2 7.4 13.9 4.3 10.2 4.3 Z"
          fill="var(--inverse)"
        />

        {/* Face and belly in one pale shape, offset forward, so a dark crescent
            is left behind it for the cap and back. */}
        <ellipse cx={11.7} cy={12.6} rx={4.1} ry={6.6} fill="#eef0e6" />

        {/* The folded wing. */}
        {!compact ? (
          <path
            d="M7.7 14.6 C6.8 15.8 6.7 17.5 7.4 18.7 C7.9 19.5 8.7 19.7 9.1 19.2 C9.5 18.6 9.2 17.3 8.8 16.2 C8.5 15.3 8.2 14.9 7.7 14.6 Z"
            fill="var(--inverse)"
            opacity={0.5}
          />
        ) : null}

        {/* The beak. Deep and triangular rather than long and pointed — that
            depth is the whole silhouette; a shallow one reads as a duck. */}
        <path
          d="M14.4 8.9 C16.4 9.3 18.4 10.6 19.4 11.6 C19.8 12.0 19.8 12.4 19.4 12.8 C18.4 13.9 16.4 15.2 14.4 15.6 C13.4 13.5 13.4 11.0 14.4 8.9 Z"
          fill="var(--signal)"
          stroke="var(--accent)"
          strokeWidth={compact ? 0 : 0.32}
          strokeLinejoin="round"
        />
        {!compact ? (
          <>
            {/* The banding every puffin beak carries. Moss, not black: a dark
                line here turns the beak into a mouth again. */}
            <path
              d="M16.1 9.6 C15.5 11.3 15.5 13.2 16.1 14.9"
              stroke="var(--accent)"
              strokeWidth={0.4}
              strokeLinecap="round"
              opacity={0.75}
              fill="none"
            />
            <path
              d="M14.6 12.25 C16.4 12.4 18.2 12.35 19.3 12.2"
              stroke="var(--accent)"
              strokeWidth={0.28}
              strokeLinecap="round"
              opacity={0.5}
              fill="none"
            />
          </>
        ) : null}

        {/* The eye. One dot and a highlight — the entire cuteness budget, spent
            in one place rather than spread across the drawing. */}
        <g className="lunni__eye">
          <circle cx={12.6} cy={9.3} r={compact ? 1.1 : 1.0} fill="#14170f" />
          {!compact ? <circle cx={12.92} cy={8.96} r={0.33} fill="#eef0e6" /> : null}
        </g>
      </g>

      {/* The rail it stands on, drawn last so the feet tuck over it. */}
      {variant === 'perched' ? (
        <rect x={1} y={20.6} width={22} height={0.7} rx={0.35} fill="var(--accent)" opacity={0.9} />
      ) : null}
    </svg>
  )
}

export const Lunni = memo(LunniComponent)
