import { memo } from 'react'
import './characters.css'

/**
 * LUNNI — the shipper. Character form.
 *
 * THE STORY IT TELLS: the deployer. "We build and ship the agents and
 * applications that do the real work."
 *
 * The instrument-era Lunni was a bird that LANDED on a mark to prove the mark
 * was on station. That is a lovely argument and it is Fyr's argument, told
 * again. The character version gets its own job instead: it is the one who
 * actually builds the thing. Hence the hat.
 *
 * A hard hat on a sea bird is a deliberate joke with a point in it. Norrin's
 * own copy is dismissive of "slick demos" and "another pilot"; a puffin in
 * site PPE is the anti-demo — unglamorous, equipped, standing on a girder
 * that is already bolted down. The bird is at work, not on a brochure.
 *
 * DRAWN IN THREE-QUARTER, which reverses the instrument version's hard rule.
 * That rule existed because head-on, a puffin's beak sits directly under two
 * eyes and every viewer reads it as a mouth — confirmed three times, the last
 * unmistakably a grin. Three-quarter escapes it for a structural reason and
 * not a stylistic one: the beak projects to the SIDE, past the silhouette,
 * so it is read as depth before it is read as a feature. Both eyes stay
 * visible and the bird stays a bird.
 *
 * The beak is the warmest shape in the set. Like Fyr's lamp it is mascot
 * anatomy, so it sits outside the three-solid sun budget.
 */

type LunniCharProps = {
  size?: number
  animated?: boolean
  /** `perched` adds the girder it stands on. */
  variant?: 'perched' | 'standing'
  /** Mirrors the bird, for when it should look back into the page. */
  facing?: 'left' | 'right'
  /** The hard hat is the whole "deployer" reading — off makes it just a bird. */
  hat?: boolean
  className?: string
  title?: string | null
}

function LunniCharComponent({
  size = 200,
  animated = true,
  variant = 'perched',
  facing = 'right',
  hat = true,
  className,
  title = null,
}: LunniCharProps) {
  return (
    <svg
      className={`ch chLunni ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-static={!animated || undefined}
      data-facing={facing}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      <g className="ch__boil">
        <g className="chLunni__bob">
          {/* Feet. Moss rather than sun: two warm shapes at opposite ends of
              the bird would fight, and the beak has to win that fight. */}
          <g fill="var(--c-moss)" stroke="var(--c-line)" strokeWidth={1.15}>
            <path d="M42 84 C38 86 35.5 88.5 36 90 C36.5 91.2 41 91 45 90 C47 89.4 47.5 86 46.5 84 Z" />
            <path d="M55 84 C51.5 86 49 88.5 49.5 90 C50 91.2 54.5 91 58.5 90 C60.5 89.4 61 86 60 84 Z" />
          </g>

          {/* Tail, behind the body. */}
          <path
            d="M29 66 C22 68 17 71 17.5 73 C18 75 24 76 30 75 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />

          {/* Body. One blob, no neck — that absence is most of why puffins
              read as round and therefore as friendly. */}
          <path
            d="M50 19 C64 19 73 33 73 55 C73 74 64 86 50 86 C36 86 27 74 27 55 C27 33 36 19 50 19 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.9}
          />

          {/* Face and belly in one pale shape, pushed forward, leaving a dark
              crescent behind it for the cap and the back. */}
          <path
            d="M56 26 C66 26 70 40 70 56 C70 73 63 84 52 84 C42 84 36 73 36 57 C36 40 45 26 56 26 Z"
            fill="var(--c-paper)"
            stroke="var(--c-line)"
            strokeWidth={1.15}
          />

          {/* Folded wing, on the near side. */}
          <path
            className="chLunni__wing"
            d="M38 52 C33 56 32 68 36 76 C38.5 80.5 43 81 44 77 C45 72 43 60 41.5 55 C40.6 52.6 39.4 51.6 38 52 Z"
            fill="var(--c-body)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />

          {/* The beak. Deep and triangular, not long and pointed — the depth
              IS the silhouette; a shallow one reads as a duck. */}
          <path
            d="M62 34 C72 35.4 81.5 41 85.5 45.4 C86.6 46.6 86.6 47.8 85.5 49 C81.5 53.6 72 59.4 62 60.6 C58.8 52 58.8 42.6 62 34 Z"
            fill="var(--c-sun)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />
          {/* The banding every puffin beak carries. Moss, not black: a dark
              line across here turns the beak back into a mouth. */}
          {/* The vertical groove is the puffin marking. The horizontal one is
              SHORT on purpose: run the full length of the beak and the two
              together make a midrib in a leaf, and the beak turns into a
              lemon wedge — which is exactly what the first pass drew. */}
          <g stroke="var(--c-moss)" fill="none" opacity={0.8}>
            <path d="M69.5 36.5 C66.6 41.8 66.6 52.6 69.5 58" strokeWidth={1.4} />
            <path d="M76.5 41.5 C74.8 44.4 74.8 50 76.5 53" strokeWidth={1} opacity={0.55} />
          </g>

          {/* Eyes. The far one is smaller and set lower — that difference is
              the entire three-quarter turn, and without it the head flattens
              back to head-on and the grin problem returns. */}
          {/* The NEAR eye has to clear the beak base at x=62. Sat at 58.5 it
              was half on the beak, so the largest eye read as a dark chip on
              the yellow and the depth cue inverted — the far eye looked like
              the real one. Pulled back onto the face where it belongs. */}
          <g className="chLunni__eyes">
            <circle cx={55.2} cy={39.8} r={4} fill="var(--c-line)" />
            <circle cx={56.7} cy={38.3} r={1.35} fill="var(--c-paper)" />
            <circle cx={43.2} cy={42.8} r={2.9} fill="var(--c-line)" />
            <circle cx={44.3} cy={41.6} r={1} fill="var(--c-paper)" />
          </g>

          {hat ? (
            <>
              {/* Hard hat. A tall dome on a wide round brim is a BOWLER, which
                  is what the first pass produced. What makes it site PPE is a
                  shallower crown, a narrower brim, and three ribs rather than
                  one — the ribs are the whole read. */}
              <path
                d="M33 32 C33 20.6 40.4 14 50 14 C59.6 14 67 20.6 67 32 Z"
                fill="var(--c-moss)"
                stroke="var(--c-line)"
                strokeWidth={1.5}
              />
              <path
                d="M29.6 32 C29.6 29.8 35.2 28.6 50 28.6 C64.8 28.6 70.4 29.8 70.4 32 C70.4 33.8 64.8 35 50 35 C35.2 35 29.6 33.8 29.6 32 Z"
                fill="var(--c-moss)"
                stroke="var(--c-line)"
                strokeWidth={1.5}
              />
              <g stroke="var(--c-line)" strokeWidth={1.15} opacity={0.5} fill="none">
                <path d="M50 14.4 L50 28.4" />
                <path d="M41 16.6 C40 20 39.7 24.4 39.9 28.4" />
                <path d="M59 16.6 C60 20 60.3 24.4 60.1 28.4" />
              </g>
            </>
          ) : null}
        </g>
      </g>

      {/* The girder, drawn last so the feet tuck over its edge. Bolts included:
          it is a fixed structure, which is the point — the bird is standing on
          something that was already built and holds. */}
      {variant === 'perched' ? (
        <g>
          <rect
            x={8}
            y={90}
            width={84}
            height={6}
            fill="var(--c-moss)"
            stroke="var(--c-line)"
            strokeWidth={1.5}
          />
          <g fill="var(--c-line)" opacity={0.45}>
            <circle cx={18} cy={93} r={1.3} />
            <circle cx={50} cy={93} r={1.3} />
            <circle cx={82} cy={93} r={1.3} />
          </g>
        </g>
      ) : null}
    </svg>
  )
}

export const LunniChar = memo(LunniCharComponent)
