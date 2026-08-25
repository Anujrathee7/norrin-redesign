import { useState } from 'react'
import { Container, Eyebrow } from '@/components/primitives/Layout'
import { cx } from '@/lib/cx'
import { FyrChar, type FyrState } from '@/components/mascot/characters/FyrChar'
import { LunniChar } from '@/components/mascot/characters/LunniChar'
import { Hirvi } from '@/components/mascot/characters/Hirvi'
import { Valo } from '@/components/mascot/characters/Valo'
import { Fyr } from '@/components/mascot/Fyr'
import { Lunni } from '@/components/mascot/Lunni'

/**
 * MASCOT LAB — the character set, shown against everything that can break it.
 *
 * This is a workbench, not a page of the site. It is reachable at #mascots and
 * is deliberately not in the nav or the page flow: the portfolio page has an
 * argument to make and a gallery of mascots is not part of it.
 *
 * What it exists to test, in the order the tests matter:
 *
 *   1. BOTH GROUNDS. The characters carry a fixed internal palette so they do
 *      not need theme-keyed internals, but that is exactly the decision that
 *      can go wrong — a forest body on a near-black ground loses its edge. The
 *      tone switch here puts every character on the forest band on demand
 *      rather than making you scroll the real site to find one.
 *   2. SMALL SIZES. Every character is shown down to 24px in the same row. A
 *      mascot that only works at 200px is an illustration, and the site needs
 *      a nav mark. Anything that turns to mush in the ladder gets redrawn
 *      compact or gets dropped.
 *   3. MOTION OFF. The set has to say the same thing static, because reduced
 *      motion is a real setting and the favicon is a still.
 *   4. AGAINST THE INSTRUMENTS. The old Fyr and Lunni are rendered at the
 *      bottom at the same size. The character set is only worth adopting if it
 *      beats them, and that is a comparison to look at rather than to assert.
 */

type Cast = {
  key: string
  name: string
  gloss: string
  role: string
  story: string
  render: (size: number, animated: boolean) => React.ReactNode
}

const CAST: Cast[] = [
  {
    key: 'fyr',
    name: 'Fyr',
    gloss: 'Norwegian/Danish — lighthouse',
    role: 'The thesis',
    story:
      'A consultant visits; a keeper stays. The waterline crosses its body, so it is in the water rather than beside it — and it is moored, which is what "integrated with your data" looks like as a shape. Bottom-heavy, so it rights itself after a knock.',
    render: (size, animated) => <FyrChar size={size} animated={animated} />,
  },
  {
    key: 'lunni',
    name: 'Lunni',
    gloss: 'Finnish — puffin',
    role: 'The deployer',
    story:
      'A sea bird in site PPE is the anti-demo: unglamorous, equipped, standing on a girder that is already bolted down. Norrin’s own copy is dismissive of slick demos and one more pilot — this is the one who actually ships.',
    render: (size, animated) => <LunniChar size={size} animated={animated} />,
  },
  {
    key: 'hirvi',
    name: 'Hirvi',
    gloss: 'Finnish — elk',
    role: 'The foundation',
    story:
      'Elk antlers are palmate — broad flat blades, genuinely shelf-shaped — so the platform rests across them with its services running. The only character that does not idle: it is the thing that stays still while everything else stands on it.',
    render: (size, animated) => <Hirvi size={size} animated={animated} />,
  },
  {
    key: 'valo',
    name: 'Valo',
    gloss: 'Finnish — light',
    role: 'The watch',
    story:
      'The tonttu of folklore works at night and is never seen; the place runs because of someone you are not thinking about. That is on-call. 24/7 has no diagram — you cannot draw it as a shape, but you can draw someone still awake.',
    render: (size, animated) => <Valo size={size} animated={animated} />,
  },
]

const LADDER = [96, 56, 40, 24]

const FYR_STATES: { state: FyrState; label: string }[] = [
  { state: 'pilot', label: 'Pilot' },
  { state: 'deploying', label: 'Deploying' },
  { state: 'gap', label: 'The gap' },
  { state: 'production', label: 'Production' },
]

export function MascotLab() {
  const [inverse, setInverse] = useState(false)
  const [animated, setAnimated] = useState(true)

  return (
    // A <main> with an <h1> inside it, rather than the <div> + SectionHeader
    // this started as. Axe caught three moderate violations on that version —
    // landmark-one-main, page-has-heading-one and region — because
    // SectionHeader emits an h2 and nothing here was a landmark. This page is
    // a workbench and would never have been audited by tools/audit.mjs, which
    // only ever visits the site root; being off the audit path is not a reason
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
          <Eyebrow index="00" label="Mascot lab" tone={inverse ? 'inverse' : 'default'} />
          <h1 className="display-2 mt-8 max-w-[20ch]">A cast, not a mark.</h1>
        </header>

        <p
          className={cx(
            'mt-6 max-w-[62ch] text-lg',
            inverse ? 'text-inverse-ink-2' : 'text-ink-2',
          )}
        >
          Four characters, one hand. Each one carries a different part of what Norrin actually
          says about itself — the thesis, the deployer, the foundation, the watch — so the set
          works as a cast rather than as four attempts at the same logo.
        </p>

        {/* Controls. Two switches, because two things break mascots: the ground
            they sit on and having their motion taken away. */}
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
            Both switches change what you are judging — check every character in all four
            combinations.
          </span>
        </div>

        {/* The cast. */}
        <div className="mt-16 grid grid-cols-1 gap-px md:mt-24 lg:grid-cols-2">
          {CAST.map((c) => (
            <article
              key={c.key}
              className={cx(
                'flex flex-col gap-8 p-8 md:p-10',
                inverse
                  ? 'border border-inverse-hairline'
                  : 'border border-hairline',
              )}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <Eyebrow label={c.role} tone={inverse ? 'inverse' : 'default'} />
                  <h2 className="display-3 mt-4">{c.name}</h2>
                  <p
                    className={cx(
                      'label mt-2',
                      inverse ? 'text-inverse-ink-3' : 'text-ink-3',
                    )}
                  >
                    {c.gloss}
                  </p>
                </div>
                <div className="shrink-0">{c.render(150, animated)}</div>
              </div>

              <p className={cx('max-w-[46ch]', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
                {c.story}
              </p>

              {/* The size ladder. The honest test — anything that dies at 24px
                  is an illustration and not a mark. */}
              <div
                className={cx(
                  'flex items-end gap-6 border-t pt-6',
                  inverse ? 'border-inverse-hairline' : 'border-hairline',
                )}
              >
                {LADDER.map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    {c.render(s, animated)}
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

        {/* Fyr carries the same four-state grammar as the instrument, so it can
            drop straight into TheGap. This row is where that gets checked: the
            states have to be told apart at a glance, from the face alone. */}
        <div className="mt-24">
          <Eyebrow index="01" label="Fyr — the four states" tone={inverse ? 'inverse' : 'default'} />
          <p className={cx('mt-6 max-w-[62ch]', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
            The instrument changes its topmark; the character changes its face. That is the
            trade the character form makes — more warmth, less precision — and it is why both
            versions still exist.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            {FYR_STATES.map((s) => (
              <div
                key={s.state}
                className={cx(
                  'flex flex-col items-center gap-4 border p-6',
                  inverse ? 'border-inverse-hairline' : 'border-hairline',
                )}
              >
                <FyrChar size={140} state={s.state} animated={animated} />
                <span className={cx('label', inverse ? 'text-inverse-ink-2' : 'text-accent')}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The comparison the whole thing rests on. */}
        <div className="mt-24">
          <Eyebrow
            index="02"
            label="Against the instruments"
            tone={inverse ? 'inverse' : 'default'}
          />
          <p className={cx('mt-6 max-w-[62ch]', inverse ? 'text-inverse-ink-2' : 'text-ink-2')}>
            The originals, same size. These are diagrams and were built under a rule that Fyr
            may never have a face. The cast is only worth adopting if it beats them at
            something they were actually trying to do.
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-12">
            <div className="flex flex-col items-center gap-3 text-ink">
              <Fyr size={140} animated={animated} showWater={false} />
              <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                Fyr — instrument
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Lunni size={140} animated={animated} />
              <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                Lunni — instrument
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <FyrChar size={140} animated={animated} showWater={false} />
              <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                Fyr — character
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LunniChar size={140} animated={animated} variant="standing" />
              <span className={cx('label', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
                Lunni — character
              </span>
            </div>
          </div>
        </div>

        <p className={cx('mt-24 max-w-[62ch]', inverse ? 'text-inverse-ink-3' : 'text-ink-3')}>
          Standalone animated SVGs of all four are written to{' '}
          <code className="font-mono">public/mascots/</code> by{' '}
          <code className="font-mono">node tools/mascots.mjs</code>. Those files are
          self-contained — palette and keyframes inlined — so they work anywhere, not just in
          this app.
        </p>
      </Container>
    </main>
  )
}
