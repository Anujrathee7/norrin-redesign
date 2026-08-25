import { memo } from 'react'
import './revontuli.css'

/**
 * REVONTULI — Norrin's face.
 *
 * `Revontulet` is Finnish for the northern lights and it means, literally,
 * FOX FIRES — `revon` from an archaic word for fox. In the telling, a fox runs
 * across the fells and its tail flings sparks that become the aurora.
 *
 * WHY THIS AND NOT THE FOUR-CHARACTER CAST. The cast encoded what Norrin DOES
 * — deploys, runs platforms, is on call — and every one of them needed a
 * paragraph underneath to be understood. A brand face has one second. This one
 * carries a story most of its audience already owns, which is the difference
 * between ownable and merely obscure.
 *
 * ── The Firefox problem ───────────────────────────────────────────────────
 * Mozilla Firefox takes its name AND its logo from this exact myth, so the
 * default outcome of drawing it is a browser knockoff. Four deliberate
 * divergences, in order of how much work each does:
 *
 *   1. It is a NAALI — an arctic fox — not a red fox. The recorded myth does
 *      not specify a species, so this is interpretation rather than invention,
 *      and it is true to Finland: the naali is critically endangered there and
 *      bred again in 2023 after a 25-year absence. Firefox's single most
 *      recognisable property is orange. A pale fox is its opposite.
 *   2. NO FIRE. The tail throws an aurora — a cool curtain in sun and lichen.
 *      Nothing here burns.
 *   3. It NEVER curls around a globe. That wrap is Firefox's whole silhouette.
 *   4. It is called Revontuli, never "the fire fox".
 *
 * ── The idea that makes it Norrin's ───────────────────────────────────────
 * THE FOX WALKS THE PRODUCTION LINE.
 *
 * The site already has exactly one decorative device: a rule, dashed while
 * work is provisional and solid once it is real. Here that rule is the ground
 * the fox walks on — SOLID behind it, DASHED ahead — and the aurora rises off
 * the tail over the part already crossed. The mascot stops needing a caption
 * and argues by its own construction instead: it makes the line real by
 * walking it. That is "enterprise AI is won in production" as a drawing.
 *
 * Both segments of that line are the SAME colour. They differ only in dash,
 * because the point is one line in two states — colour them differently and
 * they read as two unrelated rules that happen to be collinear.
 */

export type RevontuliForm = 'mark' | 'sweep' | 'sitting'

type RevontuliProps = {
  /** `mark` is the avatar/favicon head, `sweep` the full lead image, `sitting` the warm one. */
  form?: RevontuliForm
  size?: number
  animated?: boolean
  /**
   * The aurora and the production line. Off for the nav mark, where there is
   * no room for either and both would turn to grit.
   */
  showAurora?: boolean
  facing?: 'left' | 'right'
  className?: string
  /** Accessible name. Omit for purely decorative instances. */
  title?: string | null
}

function RevontuliComponent({
  form = 'sweep',
  size = 200,
  animated = true,
  showAurora = true,
  facing = 'right',
  className,
  title = null,
}: RevontuliProps) {
  // Below this the mask, the ruff and the whiskers collapse into one smudge,
  // so the head is REDRAWN simplified rather than merely scaled — the same
  // rule Fyr follows at favicon size, and the gap the last set never closed.
  const compact = size < 44

  const svg = (children: React.ReactNode) => (
    <svg
      className={`chRevo ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      data-static={!animated || undefined}
      data-form={form}
      data-facing={facing === 'left' ? 'left' : undefined}
      role={title ? 'img' : 'presentation'}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )

  /* ── The head, used by `mark` and `sitting` ────────────────────────────── */
  const ears = (
    <>
      <g className="chRevo__ear" style={{ transformOrigin: '33px 33px' }}>
        <path
          d="M29 33 C24.6 23 23.6 13.6 26.4 11.6 C29.4 9.6 36 14.6 40.4 21.6 C42.6 25.2 43.6 28.2 44 30.4 Z"
          fill="var(--r-coat)"
          stroke="var(--r-line)"
          strokeWidth={compact ? 2.6 : 1.9}
        />
        {!compact ? (
          <path
            d="M30.8 30 C28 23.4 27.4 17.4 29.2 16.2 C31 15.2 35 19.2 38.2 24.4 C39.8 27 40.6 28.8 41 30 Z"
            fill="var(--r-ear)"
          />
        ) : null}
      </g>
      <g className="chRevo__ear" style={{ transformOrigin: '67px 33px', animationDelay: '2.9s' }}>
        <path
          d="M71 33 C75.4 23 76.4 13.6 73.6 11.6 C70.6 9.6 64 14.6 59.6 21.6 C57.4 25.2 56.4 28.2 56 30.4 Z"
          fill="var(--r-coat)"
          stroke="var(--r-line)"
          strokeWidth={compact ? 2.6 : 1.9}
        />
        {!compact ? (
          <path
            d="M69.2 30 C72 23.4 72.6 17.4 70.8 16.2 C69 15.2 65 19.2 61.8 24.4 C60.2 27 59.4 28.8 59 30 Z"
            fill="var(--r-ear)"
          />
        ) : null}
      </g>
    </>
  )

  const head = (
    <>
      {ears}
      {/* Skull. The wavy sides are the winter ruff — a naali is nearly
          spherical in coat, and that roundness is most of the warmth. */}
      {/* TAPERS TO A CHIN. The first version was a circle, and a circle under
          two ears is a cat or a husky — three viewings confirmed it. A fox
          head narrows sharply below the eyes, and that narrowing is doing more
          work here than the ears are. */}
      <path
        d="M50 21 C64 21 74.5 28 77.5 40
           C79 46.5 77.5 54 73.5 60.5
           C69 67.5 61 74 55 77.5
           C52 79.2 48 79.2 45 77.5
           C39 74 31 67.5 26.5 60.5
           C22.5 54 21 46.5 22.5 40
           C25.5 28 36 21 50 21 Z"
        fill="var(--r-coat)"
        stroke="var(--r-line)"
        strokeWidth={compact ? 2.6 : 1.9}
      />
      {/* The mask. TAPERED toward the chin, not an ellipse: a round pale patch
          under two eyes reads husky, and the narrowing is most of what makes
          the animal a fox head-on. Fixed paper in BOTH coats — in summer it is
          the mask a real naali wears, in winter it vanishes into the coat and
          only the eyes are left, which is exactly why it is never theme-keyed. */}
      {!compact ? (
        <path
          d="M50 34.5 C61 34.5 69 43 69 53.5 C69 61 64 68.5 57 73
             C54 75 46 75 43 73 C36 68.5 31 61 31 53.5 C31 43 39 34.5 50 34.5 Z"
          fill="var(--r-face)"
        />
      ) : null}

      <g className="chRevo__eyes">
        <ellipse cx={39.6} cy={48} rx={compact ? 4.4 : 4.2} ry={compact ? 4.4 : 4.6} fill="var(--r-eye)" />
        <ellipse cx={60.4} cy={48} rx={compact ? 4.4 : 4.2} ry={compact ? 4.4 : 4.6} fill="var(--r-eye)" />
        {!compact ? (
          <>
            <circle cx={41.2} cy={46.2} r={1.5} fill="#ffffff" />
            <circle cx={62} cy={46.2} r={1.5} fill="#ffffff" />
          </>
        ) : null}
      </g>

      {/* Nose. A rounded wedge, never a circle — a circle reads as a button
          and takes the fox straight to "puppy". */}
      <path
        d="M50 66 C46.8 65.4 44.4 63.6 44.4 61.6 C44.4 59.8 46.6 59 50 59 C53.4 59 55.6 59.8 55.6 61.6 C55.6 63.6 53.2 65.4 50 66 Z"
        fill="var(--r-eye)"
      />
      {!compact ? (
        <g stroke="var(--r-line)" strokeWidth={1.3} fill="none" opacity={0.7}>
          <path d="M50 66 L50 69.4" />
          <path d="M50 69.4 C48.4 71.2 46 71.2 44.8 69.8" />
          <path d="M50 69.4 C51.6 71.2 54 71.2 55.2 69.8" />
        </g>
      ) : null}
    </>
  )

  // BELOW 44px THERE IS ONLY THE FACE. A full-body fox at favicon size is four
  // legs and a tail resolving into one grey smudge, and the size ladder made
  // that obvious the moment it was rendered. Rather than ship three forms of
  // which two are unusable small, every form collapses to the mark — which is
  // itself redrawn simplified rather than scaled. This is the rule Fyr already
  // follows and the gap the previous mascot set never closed.
  if (form === 'mark' || compact) {
    return svg(
      <g className="chRevo__breathe">
        {/* The aurora, as an ARC following the skull rather than three vertical
            strokes above it. The vertical version read unmistakably as insect
            antennae — a band curving over the head reads as sky. */}
        {showAurora && !compact ? (
          <g className="chRevo__aurora" fill="none" strokeLinecap="round">
            <path
              d="M17 26 C22 10 36 3 50 3 C64 3 78 10 83 26"
              stroke="var(--r-sun)"
              strokeWidth={2.8}
              opacity={0.85}
            />
            <path
              d="M12 30 C18 11 34 8.4 50 8.4"
              stroke="var(--r-lichen)"
              strokeWidth={1.8}
              opacity={0.5}
              className="chRevo__aurora--b"
            />
          </g>
        ) : null}
        {head}
      </g>,
    )
  }

  if (form === 'sitting') {
    return svg(
      <g className="chRevo__breathe">
        {/* Tail, curled forward around the feet — the composed pose. */}
        <path
          className="chRevo__tail"
          style={{ transformOrigin: '34px 76px' }}
          d="M36 68 C24 66 13 70 9.4 77 C6.8 82 11 86 19.4 85.4 C29 84.6 36 80 39 76 Z"
          fill="var(--r-coat)"
          stroke="var(--r-line)"
          strokeWidth={1.9}
        />
        {/* Seated body: a wedge, wide at the base. */}
        <path
          d="M50 40 C61 40 67 50 69 62 C70.6 72 69.4 82 67.4 84 L32.6 84 C30.6 82 29.4 72 31 62 C33 50 39 40 50 40 Z"
          fill="var(--r-coat)"
          stroke="var(--r-line)"
          strokeWidth={1.9}
        />
        {/* Chest blaze. */}
        <path
          d="M50 52 C55.6 52 59 60 60 70 C60.8 78 60 83 59 84 L41 84 C40 83 39.2 78 40 70 C41 60 44.4 52 50 52 Z"
          fill="var(--r-face)"
          opacity={0.9}
        />
        {/* Front paws, over the chest. */}
        <g fill="var(--r-coat)" stroke="var(--r-line)" strokeWidth={1.5}>
          <path d="M40 74 C38.4 76.6 38 81 38.6 83.4 L46 83.4 C46.6 81 46.2 76.6 44.6 74 Z" />
          <path d="M55.4 74 C53.8 76.6 53.4 81 54 83.4 L61.4 83.4 C62 81 61.6 76.6 60 74 Z" />
        </g>
        <g transform="translate(7 -13) scale(0.86)">{head}</g>
      </g>,
    )
  }

  /* ── SWEEP: the lead image ─────────────────────────────────────────────── */
  return svg(
    <>
      {/* THE PRODUCTION LINE. Solid behind, dashed ahead, one colour. */}
      {showAurora ? (
        <g stroke="var(--r-sun)" strokeWidth={2.4} strokeLinecap="round">
          <path d="M-2 87 L34 87" />
          <path d="M66 87 L102 87" strokeDasharray="0.5 7" opacity={0.9} />
        </g>
      ) : null}

      <g className="chRevo__breathe">
        {/* Aurora curtains, rising directly off the tail plume so they read as
            thrown BY it. Floating them free of the tail — the first attempt —
            made them ambient decoration instead of the fox's own doing. */}
        {showAurora ? (
          <g className="chRevo__aurora" fill="none" strokeLinecap="round">
            <path d="M11 26 C7.4 19 6.6 11 9 3" stroke="var(--r-sun)" strokeWidth={2.8} opacity={0.85} />
            <path
              d="M18.5 24 C16 17.4 16.4 9.4 19 2"
              stroke="var(--r-sun)"
              strokeWidth={2}
              opacity={0.5}
              className="chRevo__aurora--b"
            />
            <path d="M26 27 C24.6 21 26 13.6 29 7" stroke="var(--r-lichen)" strokeWidth={1.8} opacity={0.55} />
          </g>
        ) : null}

        {/* Tail. A PLUME rising back and up, not the low horizontal blob the
            first pass drew — that read as a second body swimming behind the
            fox. Raised, it is unmistakably a tail and it puts the aurora where
            the myth says it comes from. */}
        <g className="chRevo__tail" style={{ transformOrigin: '34px 50px' }}>
          <path
            d="M34 54 C26 51.6 17 45.6 12 37.4 C7.6 30.2 8.2 21.6 13.4 18.4
               C18.6 15.2 23.6 19.6 25.6 26.6 C27.6 33.4 30 40.4 36 46 Z"
            fill="var(--r-coat)"
            stroke="var(--r-line)"
            strokeWidth={1.9}
          />
          {/* Pale tip. A naali's tail carries one, and it is also the thing
              that stops a big single-colour crescent reading as a leaf — which
              is precisely what the thin first version read as. */}
          <path
            d="M13.4 18.4 C18.6 15.2 23.6 19.6 25.6 26.6 C22.6 28.6 18 27.6 15 24.6 C13 22.6 12.6 20.2 13.4 18.4 Z"
            fill="var(--r-face)"
            opacity={0.9}
          />
        </g>

        {/* Far legs, in the shade tone — two tones of leg is the cheapest
            depth cue and the only one this drawing needs. */}
        <g fill="var(--r-shade)" stroke="var(--r-line)" strokeWidth={1.4}>
          <path d="M44 58 L44 81 C44 83.4 50 83.4 50 81 L50 58 Z" />
          <path d="M62 57 L62 81 C62 83.4 68 83.4 68 81 L68 57 Z" />
          <ellipse cx={47} cy={82} rx={4.2} ry={2.6} />
          <ellipse cx={65} cy={82} rx={4.2} ry={2.6} />
        </g>

        {/* One combined silhouette for body, neck and head. Three overlapping
            parts leave seams where their strokes cross; a single path is more
            work to author and the only way the contour reads as one animal.
            Shorter and DEEPER than the first pass, which was long and thin and
            therefore a dog. */}
        <path
          d="M72 27
             C77 26 82 30 86 34.6
             C89.4 38 91.4 41.6 91.4 44.4
             C91.4 47 89.4 48 86.4 48
             C82 48 77 46.4 74 44
             C71.6 49 70 55 68.6 61
             L38 63
             C32.6 61 29 56 29 50.4
             C29 44 33.4 39.6 41 38
             C54 35.4 65 31.6 72 27
             Z"
          fill="var(--r-coat)"
          stroke="var(--r-line)"
          strokeWidth={1.9}
        />

        {/* Near legs, over the body. Short and sturdy: the first pass had them
            nearly as long as the body, which is a deer, not a fox. */}
        <g fill="var(--r-coat)" stroke="var(--r-line)" strokeWidth={1.6}>
          <path d="M36 60 L36 83 C36 85.6 43 85.6 43 83 L43 60 Z" />
          <path d="M56 59 L56 83 C56 85.6 63 85.6 63 83 L63 59 Z" />
          {/* Paws, wider than the leg. Without them the legs terminate flat
              and the fox reads as standing on four table legs. */}
          <ellipse cx={39.5} cy={84} rx={4.8} ry={2.9} />
          <ellipse cx={59.5} cy={84} rx={4.8} ry={2.9} />
        </g>

        {/* Ears. */}
        <g fill="var(--r-coat)" stroke="var(--r-line)" strokeWidth={1.7}>
          <path
            className="chRevo__ear"
            style={{ transformOrigin: '69px 30px' }}
            d="M65.4 30.6 C64 22.6 65.4 15.6 68.4 14.4 C71.4 13.2 75 18.4 76.6 24.4 C77.4 27.4 77.4 30 76.8 31.6 Z"
          />
          <path
            className="chRevo__ear"
            style={{ transformOrigin: '81px 28px', animationDelay: '3.4s' }}
            d="M77.6 28.4 C77.6 20.6 79.4 15 82 14 C84.6 13 87.4 18.4 87.8 24 C88 26.8 87.6 29 86.8 30.6 Z"
          />
        </g>

        {/* Muzzle mask and throat, in the fixed paper. */}
        <path
          d="M75.6 40.4 C80 39 86 40 90 42.4 C91.6 43.4 91 45.8 88.2 46.6 C83 48 77.6 46 75.6 43.6 Z"
          fill="var(--r-face)"
        />
        <path
          d="M42 52 C49.6 54.6 59.6 56 68.8 55 L68.6 61 L38.6 63 C35.6 60.4 36.6 53.4 42 52 Z"
          fill="var(--r-face)"
          opacity={0.85}
        />

        <g className="chRevo__eyes" style={{ transformOrigin: '80px 37px' }}>
          <ellipse cx={80.4} cy={37} rx={2.8} ry={3.1} fill="var(--r-eye)" />
          <circle cx={81.5} cy={35.8} r={1} fill="#ffffff" />
        </g>
        <path
          d="M90.6 42.4 C89 42.2 87.8 41.2 87.8 40.2 C87.8 39.3 88.9 38.9 90.6 38.9 C92.3 38.9 93 39.3 93 40.2 C93 41.2 92.2 42.2 90.6 42.4 Z"
          fill="var(--r-eye)"
        />
      </g>
    </>,
  )
}

export const Revontuli = memo(RevontuliComponent)
