import { useState } from 'react'
import { Container, Eyebrow } from '@/components/primitives/Layout'
import { cx } from '@/lib/cx'
import { Nori, type NoriPose } from '@/components/mascot/nori/Nori'

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

const POSES: { pose: NoriPose; name: string; use: string }[] = [
  { pose: 'wave', name: 'Wave', use: 'Hero, contact — the greeting' },
  { pose: 'idea', name: 'Idea', use: 'Thinking, insights' },
  { pose: 'laptop', name: 'Laptop', use: 'Work, build, careers' },
  { pose: 'data', name: 'Data', use: 'Proof, platforms, numbers' },
  { pose: 'rocket', name: 'Rocket', use: 'Production — the thesis' },
  { pose: 'sleep', name: 'Sleep', use: 'Footer, 24/7, empty states' },
]

const LADDER = [96, 56, 40, 24]

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

        {/* The head crop. Its own section because it is a different asset
            decision, not a different pose. */}
        <section className="mt-24" aria-labelledby="mark-heading">
          <Eyebrow index="01" label="The small mark" tone={inverse ? 'inverse' : 'default'} />
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
