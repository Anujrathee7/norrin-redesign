import { memo, useId } from 'react'
import { ChibiBlush, ChibiDefs, ChibiEyes, ChibiShadow, ChibiSparks } from './ChibiParts'
import './chibi.css'

/**
 * FIVE PROPOSALS, one plush hand.
 *
 * Each is drawn to the same rules (see chibi.css) so they read as one set and
 * can be compared on the argument rather than on the drawing. Every one comes
 * out of something Norrin actually says about itself:
 *
 *   "We stay close, involve & include... True partnerships need presence,
 *    not just promises."
 *   "We believe in creating together - seeing what neither could alone."
 *   "We value clarity over complexity... skip the sugarcoating."
 *   "Technology means nothing without the humans behind it."
 *   "Enterprise AI is won in production."
 *
 * Nothing here is invented about Norrin, and every piece of natural history
 * used as an argument is verifiable.
 */

type ChibiProps = {
  size?: number
  animated?: boolean
  className?: string
  title?: string | null
}

function useChibi(size: number, animated: boolean, title: string | null) {
  const id = useId().replace(/:/g, '')
  return {
    id,
    // Below this the second eye highlight, the blush and every speckle turn to
    // one grey pixel, so the drawing simplifies rather than merely scaling.
    compact: size < 48,
    svgProps: {
      width: size,
      height: size,
      viewBox: '0 0 100 100',
      fill: 'none' as const,
      'data-static': !animated || undefined,
      role: title ? ('img' as const) : ('presentation' as const),
      'aria-label': title ?? undefined,
      'aria-hidden': title ? undefined : true,
      focusable: 'false' as const,
    },
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   NORPPA — the Saimaa ringed seal.

   THE STRONGEST STORY IN THE SET, and it is entirely factual. The Saimaa
   ringed seal lives in exactly one lake on earth and nowhere else. It fell to
   fewer than 120 animals, and it is coming back — but only because people
   build it somewhere to live: in 2026, NINETY PER CENT of pups were born in
   man-made snow banks and artificial nests.

   That is Norrin's entire proposition told as an animal. "Technology means
   nothing without the humans behind it." "Infrastructure that holds up."
   Something precious survives because somebody engineered the thing it needed
   and then kept showing up. It is also the only candidate whose name is one
   letter from the company's.
   ────────────────────────────────────────────────────────────────────────── */
function NorppaComponent({ size = 200, animated = true, className, title = null }: ChibiProps) {
  const { id, compact, svgProps } = useChibi(size, animated, title)
  return (
    <svg className={`chibi chibiNorppa ${className ?? ''}`} data-chibi="norppa" {...svgProps}>
      {title ? <title>{title}</title> : null}
      <ChibiDefs id={id} />
      <ChibiShadow id={id} rx={28} />
      <g className="chibi__float">
        {/* Flippers, behind the body so they tuck. */}
        <g fill={`url(#${id}-body)`} stroke="var(--k-line)" strokeWidth={1.4}>
          <g className="chibi__wave" style={{ transformOrigin: '28px 64px' }}>
            <path d="M30 58 C22 60 15 67 15.6 74 C16 79 21 79 25.4 74.6 C29 71 31 64 30 58 Z" />
          </g>
          <path d="M70 58 C78 60 85 67 84.4 74 C84 79 79 79 74.6 74.6 C71 71 69 64 70 58 Z" />
          {/* Tail flippers. */}
          <path d="M40 82 C36 86 33 90 34 92 C35 93.6 40 92.6 43.6 89 Z" />
          <path d="M60 82 C64 86 67 90 66 92 C65 93.6 60 92.6 56.4 89 Z" />
        </g>

        {/* The body. One blob — a seal has no neck, and that is most of why it
            reads as plush before it reads as an animal. */}
        <path
          d="M50 17 C67 17 79 32 80 52 C81 73 70 88 50 88 C30 88 19 73 20 52 C21 32 33 17 50 17 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.6}
        />

        {/* The rings it is named for. Soft, and only on the back — a real
            norppa's coat is a scatter of pale rings on dark, inverted here so
            they stay quiet on a pale body. */}
        {!compact ? (
          <g stroke="var(--k-lichen)" fill="none" opacity={0.26} strokeWidth={1}>
            <ellipse cx={29} cy={36} rx={3} ry={2.3} />
            <ellipse cx={71} cy={36} rx={3} ry={2.3} />
            <ellipse cx={24.5} cy={51} rx={2.6} ry={2} />
            <ellipse cx={75.5} cy={51} rx={2.6} ry={2} />
            <ellipse cx={50} cy={25} rx={2.8} ry={2.1} />
            <ellipse cx={38} cy={27} rx={2.2} ry={1.7} />
            <ellipse cx={62} cy={27} rx={2.2} ry={1.7} />
          </g>
        ) : null}

        {!compact ? <ChibiBlush id={id} cx1={30} cx2={70} cy={62} r={7} /> : null}
        <ChibiEyes id={id} cx1={37} cx2={63} cy={50} r={compact ? 10 : 9.6} compact={compact} />

        {/* Nose and muzzle. */}
        <path
          d="M50 68 C46.6 67.4 44.2 65.4 44.2 63.4 C44.2 61.6 46.6 60.8 50 60.8 C53.4 60.8 55.8 61.6 55.8 63.4 C55.8 65.4 53.4 67.4 50 68 Z"
          fill="var(--k-ink)"
        />
        {!compact ? (
          <g stroke="var(--k-ink)" strokeWidth={1.2} fill="none" opacity={0.7}>
            <path d="M50 68 L50 71" />
            <path d="M50 71 C48 73.4 45 73.4 43.6 71.6" />
            <path d="M50 71 C52 73.4 55 73.4 56.4 71.6" />
            {/* Whiskers — the one detail that makes it a seal and not a bean. */}
            <g opacity={0.4}>
              <path d="M40 64 L31 62.4" />
              <path d="M40 67 L31 67.4" />
              <path d="M60 64 L69 62.4" />
              <path d="M60 67 L69 67.4" />
            </g>
          </g>
        ) : null}
      </g>
      {!compact ? (
        <ChibiSparks
          points={[
            { x: 14, y: 30, s: 3.4 },
            { x: 86, y: 26, s: 2.6, k: 'b' },
            { x: 80, y: 16, s: 2, k: 'c' },
          ]}
        />
      ) : null}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   LUMI — the snowy owl.

   The most direct signal in the set. An owl reads as INTELLIGENCE in about a
   quarter of a second, in every market Norrin sells into, with no explaining
   — which for a company whose entire product is enterprise AI is not a small
   thing. It is arctic, so it stays Nordic without costing anything.

   It also lands "we stay close": an owl is the animal that watches, and the
   yellow eye is the one place the brand's sun colour belongs on a face.
   ────────────────────────────────────────────────────────────────────────── */
function LumiComponent({ size = 200, animated = true, className, title = null }: ChibiProps) {
  const { id, compact, svgProps } = useChibi(size, animated, title)
  return (
    <svg className={`chibi chibiLumi ${className ?? ''}`} data-chibi="lumi" {...svgProps}>
      {title ? <title>{title}</title> : null}
      <ChibiDefs id={id} />
      <ChibiShadow id={id} rx={26} />
      <g className="chibi__float">
        {/* Feet. Two small taloned toes each, tucked under the body rather
            than a flat bar across the bottom — which is what the first pass
            drew and which read as a yellow shelf. */}
        <g fill="var(--k-accent)" stroke="var(--k-line)" strokeWidth={1.1}>
          <path d="M38 82 C34.6 84 32.6 87 33.6 89.4 C34.6 91.4 39 91 41.6 89 C43.6 87.4 43.6 83.6 42 82 Z" />
          <path d="M62 82 C65.4 84 67.4 87 66.4 89.4 C65.4 91.4 61 91 58.4 89 C56.4 87.4 56.4 83.6 58 82 Z" />
        </g>

        {/* Body — one egg, no neck. */}
        <path
          d="M50 13 C71 13 83 33 83 56 C83 79 68 91 50 91 C32 91 17 79 17 56 C17 33 29 13 50 13 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.6}
        />

        {/* Wings. Broad at the shoulder and tapering to a rounded tip that
            turns IN toward the belly — the first pass hung two straight lobes
            off the sides and they read unmistakably as droopy ears. */}
        <g className="chibi__wave" style={{ transformOrigin: '24px 44px' }}>
          <path
            d="M27 40 C19 44 15.6 56 17.6 68 C18.6 75 22 80 26 79 C29.6 78 30.6 70 30 60 C29.4 51 28.6 44 27 40 Z"
            fill={`url(#${id}-body)`}
            stroke="var(--k-line)"
            strokeWidth={1.3}
          />
        </g>
        <path
          d="M73 40 C81 44 84.4 56 82.4 68 C81.4 75 78 80 74 79 C70.4 78 69.4 70 70 60 C70.6 51 71.4 44 73 40 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.3}
        />

        {/* The speckling every snowy owl carries. */}
        {!compact ? (
          <g fill="var(--k-lichen)" opacity={0.32}>
            <ellipse cx={32} cy={26} rx={2.4} ry={1.6} />
            <ellipse cx={50} cy={20} rx={2.6} ry={1.7} />
            <ellipse cx={68} cy={26} rx={2.4} ry={1.6} />
            <ellipse cx={26} cy={38} rx={2} ry={1.4} />
            <ellipse cx={74} cy={38} rx={2} ry={1.4} />
            <ellipse cx={38} cy={78} rx={2.2} ry={1.5} />
            <ellipse cx={62} cy={78} rx={2.2} ry={1.5} />
          </g>
        ) : null}

        {/* Facial disc — the shallow heart shape that says owl and not bird. */}
        {!compact ? (
          <path
            d="M50 34 C63 34 71 43 71 53 C71 63 62 71 50 71 C38 71 29 63 29 53 C29 43 37 34 50 34 Z"
            fill="var(--k-body)"
            stroke="var(--k-line)"
            strokeWidth={1}
            opacity={0.75}
          />
        ) : null}

        {/* Sun irises, then the pupil over them. A snowy owl's eye really is
            this yellow, so the brand's signal colour lands on the one feature
            that was always going to carry the character. */}
        <g>
          <circle cx={38.5} cy={50} r={compact ? 11.4 : 11} fill={`url(#${id}-accent)`} />
          <circle cx={61.5} cy={50} r={compact ? 11.4 : 11} fill={`url(#${id}-accent)`} />
        </g>
        <ChibiEyes id={id} cx1={38.5} cx2={61.5} cy={50} r={compact ? 8 : 7.4} compact={compact} />

        {/* Beak. */}
        <path
          d="M50 71 C47.4 70 45.8 67.6 46.4 65.6 C47 64 53 64 53.6 65.6 C54.2 67.6 52.6 70 50 71 Z"
          fill="var(--k-accent)"
          stroke="var(--k-line)"
          strokeWidth={1}
        />
        {!compact ? <ChibiBlush id={id} cx1={26} cx2={74} cy={60} r={6.4} /> : null}
      </g>
      {!compact ? (
        <ChibiSparks
          points={[
            { x: 12, y: 24, s: 3 },
            { x: 88, y: 30, s: 3.4, k: 'b' },
            { x: 84, y: 18, s: 2, k: 'c' },
          ]}
        />
      ) : null}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   REVONTULI — the naali, in plush.

   The fox already chosen, redrawn in this hand so it can be judged against
   the others on equal terms rather than winning by being the only one in the
   room. Same story: `revontulet` means fox fires, the tail throws the aurora.
   Still an arctic fox and still no orange anywhere, because Mozilla Firefox
   is built on this identical myth.
   ────────────────────────────────────────────────────────────────────────── */
function RevontuliChibiComponent({ size = 200, animated = true, className, title = null }: ChibiProps) {
  const { id, compact, svgProps } = useChibi(size, animated, title)
  return (
    <svg className={`chibi chibiRevo ${className ?? ''}`} data-chibi="revontuli" {...svgProps}>
      {title ? <title>{title}</title> : null}
      <ChibiDefs id={id} />
      <ChibiShadow id={id} rx={26} />
      <g className="chibi__float">
        {/* The tail, sun-tipped, curled around the right side. It is the
            aurora-maker, so it gets the accent and nothing else does. */}
        <g className="chibi__wave" style={{ transformOrigin: '74px 76px' }}>
          <path
            d="M70 66 C82 66 92 74 92 82 C92 88 84 91 76 89 C70 87.4 66 82 65 76 Z"
            fill={`url(#${id}-body)`}
            stroke="var(--k-line)"
            strokeWidth={1.5}
          />
          <path
            d="M86 74 C90 76.6 92 79.4 92 82 C92 85 90 87 87 88.4 C84 85 83.6 78.6 86 74 Z"
            fill={`url(#${id}-accent)`}
            opacity={0.95}
          />
        </g>

        {/* Body. */}
        <path
          d="M50 50 C64 50 72 62 72 74 C72 85 63 91 50 91 C37 91 28 85 28 74 C28 62 36 50 50 50 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.5}
        />
        {/* Paws. */}
        <g fill={`url(#${id}-body)`} stroke="var(--k-line)" strokeWidth={1.2}>
          <ellipse cx={41} cy={88} rx={6} ry={4} />
          <ellipse cx={59} cy={88} rx={6} ry={4} />
        </g>

        {/* Ears — big, upright, and the thing that says fox before anything
            else does. */}
        <g fill={`url(#${id}-body)`} stroke="var(--k-line)" strokeWidth={1.5}>
          <path d="M28 30 C24 18 24.6 8 28.6 7 C32.6 6 39 14 42 23 Z" />
          <path d="M72 30 C76 18 75.4 8 71.4 7 C67.4 6 61 14 58 23 Z" />
        </g>
        {!compact ? (
          <g fill="var(--k-accent)" opacity={0.55}>
            <path d="M30 28 C27.4 19.4 27.6 12.4 30 11.6 C32.6 11 36.6 16.6 38.8 23 Z" />
            <path d="M70 28 C72.6 19.4 72.4 12.4 70 11.6 C67.4 11 63.4 16.6 61.2 23 Z" />
          </g>
        ) : null}

        {/* Head — big, tapering to a chin, which is what keeps it a fox rather
            than a cat once the ears stop doing all the work. */}
        <path
          d="M50 16 C67 16 78 29 78 44 C78 53 73 61 65 66 C59 69.6 41 69.6 35 66 C27 61 22 53 22 44 C22 29 33 16 50 16 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.6}
        />

        {!compact ? <ChibiBlush id={id} cx1={30} cx2={70} cy={52} r={6.6} /> : null}
        <ChibiEyes id={id} cx1={38} cx2={62} cy={42} r={compact ? 9.4 : 9} compact={compact} />

        <path
          d="M50 60 C46.8 59.4 44.6 57.6 44.6 55.8 C44.6 54.2 46.8 53.4 50 53.4 C53.2 53.4 55.4 54.2 55.4 55.8 C55.4 57.6 53.2 59.4 50 60 Z"
          fill="var(--k-ink)"
        />
        {!compact ? (
          <g stroke="var(--k-ink)" strokeWidth={1.2} fill="none" opacity={0.7}>
            <path d="M50 60 L50 62.6" />
            <path d="M50 62.6 C48.2 64.6 45.6 64.6 44.4 63" />
            <path d="M50 62.6 C51.8 64.6 54.4 64.6 55.6 63" />
          </g>
        ) : null}
      </g>
      {!compact ? (
        <ChibiSparks
          points={[
            { x: 13, y: 26, s: 3.2 },
            { x: 88, y: 40, s: 2.6, k: 'b' },
            { x: 16, y: 14, s: 2, k: 'c' },
          ]}
        />
      ) : null}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   OTSO — the bear cub.

   The brown bear is Finland's national animal, designated by parliament in
   1985 and revered far longer than that: old Finnish avoided saying its name
   aloud and used otso, kontio, mesikammen instead.

   It carries the bluntest line in Norrin's own copy — "We take responsibility
   by addressing issues head on. We value clarity over complexity... skip the
   sugarcoating." That is a bear. It is the warmest and most immediately
   likeable shape of the five, and the least distinctive: bears are everywhere
   in branding, so this one wins on affection rather than on ownability.
   ────────────────────────────────────────────────────────────────────────── */
function OtsoComponent({ size = 200, animated = true, className, title = null }: ChibiProps) {
  const { id, compact, svgProps } = useChibi(size, animated, title)
  return (
    <svg className={`chibi chibiOtso ${className ?? ''}`} data-chibi="otso" {...svgProps}>
      {title ? <title>{title}</title> : null}
      <ChibiDefs id={id} />
      <ChibiShadow id={id} rx={27} />
      <g className="chibi__float">
        {/* Body. */}
        <path
          d="M50 48 C66 48 75 61 75 74 C75 85 64 92 50 92 C36 92 25 85 25 74 C25 61 34 48 50 48 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.5}
        />
        {/* The chest blaze many bears carry — the accent, spent once. */}
        {!compact ? (
          <path
            d="M50 62 C56 62 60 66 61 71 C57 74 43 74 39 71 C40 66 44 62 50 62 Z"
            fill={`url(#${id}-accent)`}
            opacity={0.75}
          />
        ) : null}
        {/* Arms and feet. */}
        {/* Arms and feet. Pulled IN so they overlap the body — as free-standing
            ellipses beside it they read as four loose blobs orbiting a bear
            rather than as limbs attached to one. */}
        <g fill={`url(#${id}-body)`} stroke="var(--k-line)" strokeWidth={1.3}>
          <g className="chibi__wave" style={{ transformOrigin: '30px 64px' }}>
            <ellipse cx={27.5} cy={70} rx={7.4} ry={9.4} transform="rotate(-12 27.5 70)" />
          </g>
          <ellipse cx={72.5} cy={70} rx={7.4} ry={9.4} transform="rotate(12 72.5 70)" />
          <ellipse cx={40} cy={87.5} rx={8.4} ry={5.8} />
          <ellipse cx={60} cy={87.5} rx={8.4} ry={5.8} />
        </g>

        {/* Ears — small, round, set wide. Small round ears are the single
            difference between a bear cub and a cat. */}
        <g fill={`url(#${id}-body)`} stroke="var(--k-line)" strokeWidth={1.5}>
          <circle cx={27} cy={25} r={10} />
          <circle cx={73} cy={25} r={10} />
        </g>
        {!compact ? (
          <g fill="var(--k-blush)" opacity={0.75}>
            <circle cx={27} cy={25} r={5} />
            <circle cx={73} cy={25} r={5} />
          </g>
        ) : null}

        {/* Head. */}
        <ellipse
          cx={50}
          cy={40}
          rx={28}
          ry={25}
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.6}
        />
        {/* Muzzle. */}
        {!compact ? (
          <ellipse cx={50} cy={51} rx={14} ry={10} fill="var(--k-body)" stroke="var(--k-line)" strokeWidth={1} opacity={0.8} />
        ) : null}

        {!compact ? <ChibiBlush id={id} cx1={28} cx2={72} cy={48} r={6.6} /> : null}
        <ChibiEyes id={id} cx1={39} cx2={61} cy={38} r={compact ? 8.6 : 8.2} compact={compact} />

        <path
          d="M50 52 C46 51.2 43.4 49 43.4 46.8 C43.4 45 46 44 50 44 C54 44 56.6 45 56.6 46.8 C56.6 49 54 51.2 50 52 Z"
          fill="var(--k-ink)"
        />
        {!compact ? (
          <g stroke="var(--k-ink)" strokeWidth={1.3} fill="none" opacity={0.7}>
            <path d="M50 52 L50 55" />
            <path d="M50 55 C48 57.4 45 57.4 43.6 55.6" />
            <path d="M50 55 C52 57.4 55 57.4 56.4 55.6" />
          </g>
        ) : null}
      </g>
      {!compact ? (
        <ChibiSparks
          points={[
            { x: 12, y: 30, s: 3 },
            { x: 89, y: 34, s: 2.6, k: 'b' },
            { x: 86, y: 20, s: 2, k: 'c' },
          ]}
        />
      ) : null}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   SISU — the icebreaker.

   The only non-creature, and the only one whose metaphor is mechanical rather
   than emotional. Finnish companies designed about eighty per cent of the
   world's icebreakers and roughly sixty per cent were built in Finnish yards
   — it is the country's most globally dominant industry.

   An icebreaker's whole job is to GO FIRST and open a route through frozen
   water so ordinary ships can follow and trade actually happens. That is
   "we turn AI ambition into production" with nothing left to explain. It also
   sits closest to Norrin's own register: industrial, unglamorous, load-bearing.

   The cost is warmth: a boat cannot be hugged, and in this style that matters
   more than it would in any other.
   ────────────────────────────────────────────────────────────────────────── */
function SisuComponent({ size = 200, animated = true, className, title = null }: ChibiProps) {
  const { id, compact, svgProps } = useChibi(size, animated, title)
  return (
    <svg className={`chibi chibiSisu ${className ?? ''}`} data-chibi="sisu" {...svgProps}>
      {title ? <title>{title}</title> : null}
      <ChibiDefs id={id} />
      <ChibiShadow id={id} cy={92} rx={30} />
      <g className="chibi__float">
        {/* Broken floes. PALE and faceted, shoved aside in a line either side
            of the hull, so they read as ice the ship has just split rather
            than as two grey rectangles someone left on the canvas. */}
        {/* The ice. UNBROKEN sheet ahead of the bow, shattered slabs behind it
            — that before/after either side of one hull is the entire argument
            of this character, and it is the same solid-behind-dashed-ahead
            idea the site already uses for the production line. */}
        {!compact ? (
          <g stroke="var(--k-line)" strokeWidth={1.1}>
            <g fill="var(--k-body)">
              {/* Ahead: one intact sheet. */}
              <path d="M84 74 L99 71 L99 82 L86 84 Z" />
              {/* Behind: broken up. */}
              <path d="M1 72 L13 70 L16 78 L3 80 Z" />
              <path d="M2 83 L14 81 L16 88 L4 90 Z" />
              <path d="M17 84 L28 83 L29 89 L18 90 Z" />
            </g>
            <g fill="var(--k-accent-2)" opacity={0.5} stroke="none">
              <path d="M84 74 L99 71 L99 75 L84.6 77.6 Z" />
              <path d="M1 72 L13 70 L13.8 73 L1.6 75 Z" />
            </g>
          </g>
        ) : null}

        {/* SEEN IN PROFILE, not head-on. Bow-on, every hull in the world is an
            oval with a flat top, and it reads as a bowl no matter how the
            curve is tuned — two attempts confirmed it. In profile the raked
            stem and the rising sheer line say "ship" immediately, and the ice
            it is climbing onto says which kind of ship. */}

        {/* Mast and the one light, at the stern end. */}
        <path d="M22 55 L22 26" stroke="var(--k-line)" strokeWidth={1.6} />
        <circle
          className="chibi__spark"
          cx={22}
          cy={23.6}
          r={3.4}
          fill="var(--k-accent)"
          style={{ transformOrigin: '22px 23.6px' }}
        />

        {/* Funnel, aft of the bridge. */}
        <path
          d="M60 52 L73 52 L71 27 L62 27 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.4}
        />
        <rect
          x={60.4}
          y={24.4}
          width={12.4}
          height={4.4}
          rx={1.6}
          fill="var(--k-accent)"
          stroke="var(--k-line)"
          strokeWidth={1.2}
        />

        {/* Bridge — where the face lives. On the superstructure, not the bow:
            a face down at the waterline turns it into a bath toy. */}
        <path
          d="M26 56 C26 34 31 27 43 27 C55 27 59 34 59 56 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.6}
        />

        {!compact ? <ChibiBlush id={id} cx1={29} cx2={56} cy={48} r={5.4} /> : null}
        <ChibiEyes id={id} cx1={37} cx2={49} cy={41} r={compact ? 7 : 6.6} compact={compact} />
        {!compact ? (
          <path
            d="M40 51 C41.6 53.4 45.4 53.4 47 51"
            stroke="var(--k-ink)"
            strokeWidth={1.3}
            fill="none"
            opacity={0.7}
          />
        ) : null}

        {/* Hull. The flared bow is the working part of a real icebreaker: it
            rides UP onto the ice and breaks it with the ship's own weight,
            which is why the sides slope OUT to a wide deck rather than in.
            The first pass drew even curves and produced a soup bowl. */}
        {/* Hull in profile. The sheer line RISES toward the bow and the stem is
            raked well forward — that overhang is the working part of a real
            icebreaker: it rides up onto the ice and breaks it with the ship's
            own weight rather than ramming through it. */}
        <path
          d="M12 56 L87 50
             C90.6 54.6 90.6 63 86.4 69.6
             C81 78 71.4 82 59 82
             L33 82
             C20.6 82 13.4 73.4 12 62.6 Z"
          fill={`url(#${id}-body)`}
          stroke="var(--k-line)"
          strokeWidth={1.7}
        />
        {!compact ? (
          <>
            {/* Deck line and the hull band. Bands, not a filled lower half —
                filling it is what made the first version look like soup. */}
            <path
              d="M12.6 60.4 L88.6 55"
              stroke="var(--k-line)"
              strokeWidth={1.2}
              opacity={0.5}
            />
            <path
              d="M13.4 66 L89 60.6
                 C88.6 63.6 87.8 66.4 86.4 69
                 L14.8 71.6 C14 69.8 13.6 68 13.4 66 Z"
              fill={`url(#${id}-accent)`}
              opacity={0.85}
            />
            {/* Portholes. */}
            <g fill="var(--k-line)" opacity={0.4}>
              <circle cx={26} cy={64.6} r={1.7} />
              <circle cx={38} cy={63.8} r={1.7} />
              <circle cx={50} cy={62.9} r={1.7} />
              <circle cx={62} cy={62} r={1.7} />
            </g>
          </>
        ) : null}
      </g>
      {!compact ? (
        <ChibiSparks
          points={[
            { x: 13, y: 30, s: 3 },
            { x: 88, y: 36, s: 2.6, k: 'b' },
            { x: 84, y: 22, s: 2, k: 'c' },
          ]}
        />
      ) : null}
    </svg>
  )
}

export const Norppa = memo(NorppaComponent)
export const Lumi = memo(LumiComponent)
export const RevontuliChibi = memo(RevontuliChibiComponent)
export const Otso = memo(OtsoComponent)
export const Sisu = memo(SisuComponent)
