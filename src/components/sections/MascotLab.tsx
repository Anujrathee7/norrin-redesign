import { useState } from 'react'
import { Container, Eyebrow } from '@/components/primitives/Layout'
import { cx } from '@/lib/cx'
import { Nori, type NoriPose } from '@/components/mascot/nori/Nori'
import { NORI_ANCHOR } from '@/components/mascot/nori/anchors'

/**
 * NORI — the mascot sheet.
 *
 * Reachable at #mascots. Not in the nav and not in the page flow: the site has
 * one argument to make and a mascot sheet is not part of it.
 *
 * Everything that used to live here — the four-character cast, the buoy and
 * puffin instruments, the fox, the five plush proposals — is gone. Nori is the
 * mascot; the exploration is history and history does not need a page.
 *
 * What the sheet is still for is testing, in the order the tests matter:
 *   1. BOTH GROUNDS. Nori is a white character with a dark contour, which is
 *      the combination most likely to fail on one ground or the other.
 *   2. SMALL SIZES. The nav needs a ~28px mark. A full-body Nori at that size
 *      is a grey pill, which is why `crop="head"` exists.
 *   3. MOTION OFF. Reduced motion is a real setting and a favicon is a still.
 */

/**
 * The composed poses.
 *
 * These are the answer to a specific complaint: the six original poses are
 * whole-figure drawings that only work at 150px+, so every one of them ends up
 * parked beside a paragraph as a large decorative object. These six are drawn
 * to touch something — a heading's edge, a rule, a card's top border — at
 * 80-140px, which is a different job.
 *
 * The tiles below are LIVE compositions, not thumbnails in boxes. A pose shown
 * floating in a bordered cell tells you nothing about the only thing that
 * matters here, which is how it sits against type. Each one is placed by its
 * measured anchor from `NORI_ANCHOR`, exactly as the real section will place it.
 */
/**
 * Six ways to draw the same resting arm, up for decision.
 *
 * They are separate files rather than a prop, because the artwork is authored
 * as SVG and this component does not draw — the same rule that keeps it from
 * recolouring the poses keeps it from generating them. `tools/nori.mjs` emits
 * all six; once one is chosen it becomes the arm on every pose and these files
 * are deleted.
 *
 * What is actually being decided: `tube` strokes the arm at a constant width
 * and sticks a separate paw on the end, which is the exact construction of a
 * tail — which is why it reads as one. The other five draw the arm as a filled
 * shape with the same white-and-contour build as the body.
 */
const COMPOSED: {
  pose: NoriPose
  name: string
  planned: string
  why: string
}[] = [
  {
    pose: 'lean',
    name: 'Lean',
    planned: 'Hero headline — shoulder against the left edge of the display type',
    why: 'The tilt does the work. Butt the shoulder to a vertical rule and it reads as weight on the type.',
  },
  {
    pose: 'sit',
    name: 'Sit',
    planned: 'The production line, and section top rules',
    why: 'Hips land on the rule, legs hang below it. The seat line is drawn at a known height so nothing is hand-tuned.',
  },
  {
    pose: 'peek',
    name: 'Peek',
    planned: 'Thinking cards, top-right corner — and over the footer rule',
    why: 'Its own drawing, not a crop. The bottom of the file IS the edge, so it butts flush and nothing shows below.',
  },
  {
    pose: 'point',
    name: 'Point',
    planned: 'Beside a figure in the station log, or a roster line',
    why: 'The arm crosses out of the drawing and into the text column, so the gesture lands on something real.',
  },
  {
    pose: 'hold',
    name: 'Hold',
    planned: 'Carrying a section rule — the gap, the timeline',
    why: 'The rule crosses in front of the body. It puts the one device the whole site is built on into the mascot hands.',
  },
  {
    pose: 'read',
    name: 'Read',
    planned: 'Thinking and Work — beside an insight or a case',
    why: 'Eyes down on a held page. The only pose that is looking at something rather than at you.',
  },
]

const POSES: { pose: NoriPose; name: string; use: string }[] = [
  { pose: 'wave', name: 'Wave', use: 'Hero, contact — the greeting' },
  { pose: 'idea', name: 'Idea', use: 'Thinking, insights' },
  { pose: 'laptop', name: 'Laptop', use: 'Work, build, careers' },
  { pose: 'data', name: 'Data', use: 'Proof, platforms, numbers' },
  { pose: 'rocket', name: 'Rocket', use: 'Production — the thesis' },
  { pose: 'sleep', name: 'Sleep', use: 'Footer, 24/7, empty states' },
]

const LADDER = [96, 56, 40, 24]

/**
 * One live composition per pose — the pose doing the job it was drawn for.
 *
 * Every placement here uses `NORI_ANCHOR`, the measured contact geometry of the
 * drawing itself, rather than a hand-tuned offset. The percentages go into
 * `transform: translate()`, where a percentage resolves against the ELEMENT's
 * own size — which is the whole reason it holds at any `size`. (A percentage
 * margin would resolve against the parent's width and drift with the layout.)
 *
 * The translate goes on an outer wrapper, never on the <Nori> span: that span
 * carries the idle float, and a second transform on the same box would simply
 * replace it.
 */
function Composition({ pose, inverse }: { pose: NoriPose; inverse: boolean }) {
  const rule = inverse ? 'bg-inverse-hairline-strong' : 'bg-hairline-strong'
  const line = inverse ? 'border-inverse-hairline-strong' : 'border-hairline'
  const dim = inverse ? 'text-inverse-ink-3' : 'text-ink-3'
  const mid = inverse ? 'text-inverse-ink-2' : 'text-ink-2'

  if (pose === 'lean') {
    return (
      <div className="relative flex min-h-[210px] items-end">
        <span aria-hidden="true" className={cx('absolute inset-y-4 left-0 w-px', rule)} />
        <div style={{ transform: 'translateX(calc(-1 * ' + NORI_ANCHOR.lean.x + '))' }}>
          <Nori pose="lean" size={168} />
        </div>
        <p className="display-3 mb-7 ml-1 max-w-[13ch]">Enterprise AI is won in production.</p>
      </div>
    )
  }

  if (pose === 'sit') {
    return (
      <div className="relative flex min-h-[210px] items-center">
        <span aria-hidden="true" className={cx('absolute inset-x-0 top-1/2 h-px', rule)} />
        <div
          className="absolute top-1/2 left-6"
          style={{ transform: 'translateY(calc(-1 * ' + NORI_ANCHOR.sit.y + '))' }}
        >
          <Nori pose="sit" size={176} />
        </div>
        <p className={cx('label absolute bottom-[calc(50%+18px)] right-0', dim)}>Pilot</p>
        <p className={cx('label absolute top-[calc(50%+18px)] right-0', dim)}>Production</p>
      </div>
    )
  }

  if (pose === 'peek') {
    return (
      <div className="flex min-h-[210px] items-end">
        <div className={cx('relative w-full border p-5', line)}>
          {/* `bottom-full` and nothing else: the bottom of the peek file IS the
              edge, so the drawing needs no offset to sit on this border. */}
          {/* `flex` is load-bearing: <Nori> renders an inline-block, so a block
              wrapper adds the line-box descender under it and opens a gap
              between the drawing and the border it is meant to be resting on. */}
          <div className="absolute right-6 bottom-full flex">
            <Nori pose="peek" size={156} />
          </div>
          <p className={cx('label', dim)}>03 — Insight</p>
          <p className="mt-2 max-w-[24ch]">Why most enterprise pilots never reach production.</p>
        </div>
      </div>
    )
  }

  if (pose === 'point') {
    return (
      <div className="relative flex min-h-[210px] items-center">
        <div className="relative">
          <Nori pose="point" size={184} />
          <p
            className="display-2 absolute left-full tabular-nums"
            style={{ top: NORI_ANCHOR.point.y, transform: 'translateY(-50%)' }}
          >
            400+
          </p>
        </div>
      </div>
    )
  }

  if (pose === 'hold') {
    return (
      <div className="relative flex min-h-[210px] items-center justify-center">
        <div className="relative">
          <Nori pose="hold" size={200} />
          {/* The section rule, run out to both edges at exactly the height the
              drawing already carries its own. They meet and read as one line. */}
          <span
            aria-hidden="true"
            className={cx('absolute right-[calc(100%-10px)] h-px w-[18vw]', rule)}
            style={{ top: NORI_ANCHOR.hold.y }}
          />
          <span
            aria-hidden="true"
            className={cx('absolute left-[calc(100%-10px)] h-px w-[18vw]', rule)}
            style={{ top: NORI_ANCHOR.hold.y }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[210px] items-end gap-5">
      <Nori pose="read" size={172} />
      <div className={cx('flex-1 border-t pt-4', line)}>
        <p className={cx('label', dim)}>Field note</p>
        <p className={cx('mt-2', mid)}>What it takes to keep a model running after launch day.</p>
      </div>
    </div>
  )
}

export function MascotLab() {
  const [inverse, setInverse] = useState(false)
  const [animated, setAnimated] = useState(true)

  return (
    // <main> with an <h1> inside it: this page is off tools/audit.mjs's path,
    // which only ever visits the site root, and being unaudited is not a reason
    // to be the one broken page in the project.
    <main
      data-tone={inverse ? 'inverse' : undefined}
      className={cx(
        'min-h-screen py-20 transition-colors md:py-28',
        inverse ? 'bg-inverse text-inverse-ink' : 'bg-ground text-ink',
      )}
    >
      <Container>
        <header className="mb-6 md:mb-7">
          <Eyebrow index="00" label="Mascot" tone={inverse ? 'inverse' : 'default'} />
          <h1 className="display-2 mt-8 max-w-[20ch]">Nori.</h1>
        </header>

        <p className={cx('mt-6 max-w-[62ch] text-lg', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
          Six poses, one character. The artwork is authored as finished SVGs in{' '}
          <code className="font-mono text-sm">public/</code> — the app places, sizes and idles
          them, and never recolours or re-paths them. Editing a pose means editing the file.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setInverse((v) => !v)}
            className="control"
            aria-pressed={inverse}
          >
            {inverse ? 'On forest' : 'On paper'}
          </button>
          <button
            type="button"
            onClick={() => setAnimated((v) => !v)}
            className="control"
            aria-pressed={animated}
          >
            {animated ? 'Motion on' : 'Motion off'}
          </button>
          <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
            A white character with a dark contour is the combination most likely to fail on one
            ground — check both.
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Composed poses — where each one is going, shown doing it.          */}
        {/* ---------------------------------------------------------------- */}
        <section className="mt-20 md:mt-28" aria-labelledby="composed-heading">
          <Eyebrow index="01" label="Composed with type" tone={inverse ? 'inverse' : 'default'} />
          <h2 id="composed-heading" className="display-3 mt-6">
            Six poses that touch something.
          </h2>
          <p className={cx('mt-4 max-w-[62ch]', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
            The originals are whole-figure drawings — they only hold up at 150px and larger, so
            each one ends up parked next to a paragraph as a big decorative object. These six are
            drawn to meet an edge: a heading, a rule, the top border of a card. Every tile below is
            the live composition, placed by the drawing&rsquo;s own measured anchor rather than by
            a tuned offset.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-px lg:grid-cols-2">
            {COMPOSED.map((c) => (
              <article
                key={c.pose}
                className={cx(
                  // overflow-clip, not hidden: hidden would make this a scroll
                  // container, which is what froze the scroll timelines on the
                  // main page. Here it just stops the hold pose's rule from
                  // running out across the next tile.
                  'flex flex-col overflow-clip border p-8',
                  inverse ? 'border-inverse-hairline' : 'border-hairline',
                )}
              >
                <Composition pose={c.pose} inverse={inverse} />
                <div
                  className={cx(
                    'mt-8 border-t pt-5',
                    inverse ? 'border-inverse-hairline' : 'border-hairline',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="ui">{c.name}</h3>
                    <p className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                      /nori-{c.pose}.svg
                    </p>
                  </div>
                  <p className={cx('caption mt-3', inverse ? 'text-inverse-ink-3' : 'text-accent')}>
                    Planned: {c.planned}
                  </p>
                  <p
                    className={cx(
                      'caption mt-2 max-w-[52ch]',
                      inverse ? 'text-inverse-ink-3' : 'text-ink-2',
                    )}
                  >
                    {c.why}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* The six originals. */}
        <section className="mt-24" aria-labelledby="originals-heading">
          <Eyebrow index="02" label="The originals" tone={inverse ? 'inverse' : 'default'} />
          <h2 id="originals-heading" className="display-3 mt-6">
            Six whole-figure poses.
          </h2>
        <div className="mt-16 grid grid-cols-1 gap-px md:mt-24 md:grid-cols-2 xl:grid-cols-3">
          {POSES.map((p) => (
            <article
              key={p.pose}
              className={cx(
                'flex flex-col gap-6 border p-8',
                inverse ? 'border-inverse-hairline' : 'border-hairline',
              )}
            >
              <div className="flex items-center justify-center py-2">
                <Nori pose={p.pose} size={200} animated={animated} />
              </div>
              <div>
                <h2 className="display-3">{p.name}</h2>
                <p className={cx('label mt-2', inverse ? 'text-inverse-ink-3' : 'text-accent')}>
                  {p.use}
                </p>
                <p className={cx('label mt-1', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                  /nori-{p.pose}.svg
                </p>
              </div>
              <div
                className={cx(
                  'mt-auto flex items-end gap-5 border-t pt-6',
                  inverse ? 'border-inverse-hairline' : 'border-hairline',
                )}
              >
                {LADDER.map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <Nori pose={p.pose} size={s} animated={animated} />
                    <span
                      className={cx(
                        'label tabular-nums',
                        inverse ? 'text-inverse-ink-3' : 'text-ink-3',
                      )}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        </section>

        {/* The head crop. Its own section because it is a different asset
            decision, not a different pose. */}
        <section className="mt-24" aria-labelledby="mark-heading">
          <Eyebrow index="03" label="The small mark" tone={inverse ? 'inverse' : 'default'} />
          <h2 id="mark-heading" className="display-3 mt-6">
            Head crop, for anything under ~40px.
          </h2>
          <p className={cx('mt-4 max-w-[62ch]', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
            Full-body Nori at nav size is a grey pill — antenna, arms and feet all collapse into
            the silhouette. Cropping to the head keeps the eyes, which are the only part that has
            to survive. Same file, different viewBox; no second asset to maintain.
          </p>
          <div
            className={cx(
              'mt-8 flex flex-wrap items-end gap-10 border p-8',
              inverse ? 'border-inverse-hairline' : 'border-hairline',
            )}
          >
            {[64, 40, 28, 20, 16].map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                <Nori pose="wave" size={s} crop="head" animated={animated} />
                <span
                  className={cx(
                    'label tabular-nums',
                    inverse ? 'text-inverse-ink-3' : 'text-ink-3',
                  )}
                >
                  {s}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5">
                <Nori pose="wave" size={28} crop="head" animated={false} />
                <span className="wordmark">Norrin</span>
              </div>
              <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                in the bar
              </span>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
