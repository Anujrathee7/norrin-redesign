import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { useTheme } from '@/hooks/useTheme'
import { measure } from '@/lib/contrast'
import { Card } from '@/components/primitives/Card'
import { CardStack } from '@/components/primitives/CardStack'
import { cases, photos, roles } from '@/data/norrin'

/**
 * The style guide — a gate, not a document.
 *
 * WHY IT IS A PAGE AND NOT A MARKDOWN FILE. This project got the note that it
 * "looks very closely to purely AI generated". The fix is a style system a human
 * looked at and agreed to BEFORE any component is rewritten, and a written spec
 * for spacing, type and colour is the one thing you cannot judge by reading it.
 * So the guide renders in the real stack, from the real tokens, in both themes.
 *
 * NOTHING HERE IS TYPED TWICE. Every size, weight and ratio on this page is read
 * off the live DOM as it renders — see `src/lib/contrast.ts`. A guide that
 * restates values a human copied out of the stylesheet starts lying the first
 * time a token moves, and a lying style guide is worse than no style guide.
 *
 * It hangs off `#styleguide` for the same reason `#compare` and `#mascots` do:
 * the homepage has one argument to make, and talking about how it was made is
 * not part of it.
 */

/* ------------------------------------------------------------------ *
 * Colour
 * ------------------------------------------------------------------ */

type Pair = { fg: string; bg: string; label: string; min: number }

/** The paper ramp — everything sitting on `--ground` or `--surface`. */
const PAPER: Pair[] = [
  { fg: '--ink', bg: '--ground', label: 'ink / ground', min: 4.5 },
  { fg: '--ink-2', bg: '--ground', label: 'ink-2 / ground', min: 4.5 },
  { fg: '--ink-3', bg: '--ground', label: 'ink-3 / ground', min: 4.5 },
  { fg: '--accent', bg: '--ground', label: 'accent / ground', min: 4.5 },
  { fg: '--ink', bg: '--surface', label: 'ink / surface', min: 4.5 },
  { fg: '--ink-3', bg: '--surface', label: 'ink-3 / surface', min: 4.5 },
  { fg: '--reading', bg: '--surface', label: 'reading / surface', min: 4.5 },
  { fg: '--hairline', bg: '--ground', label: 'hairline / ground', min: 1.2 },
  { fg: '--hairline', bg: '--surface', label: 'hairline / surface', min: 1.2 },
  { fg: '--hairline-strong', bg: '--ground', label: 'hairline-strong / ground', min: 1.6 },
]

/** The forest ramp — the one chromatic surface, and all of it translucent ink. */
const FOREST: Pair[] = [
  { fg: '--inverse-ink', bg: '--inverse', label: 'inverse-ink / band', min: 4.5 },
  { fg: '--inverse-ink-2', bg: '--inverse', label: 'inverse-ink-2 / band', min: 4.5 },
  { fg: '--inverse-ink-3', bg: '--inverse', label: 'inverse-ink-3 / band', min: 4.5 },
  { fg: '--signal', bg: '--inverse', label: 'signal / band', min: 3 },
  { fg: '--inverse-hairline', bg: '--inverse', label: 'inverse-hairline / band', min: 1.2 },
  { fg: '--inverse-inactive', bg: '--inverse', label: 'inverse-inactive / band', min: 1.8 },
]

function Ratios({ pairs, inverse }: { pairs: Pair[]; inverse?: boolean }) {
  const theme = useTheme()
  const host = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<{ label: string; r: number; min: number }[]>([])

  // Measured after paint, and again whenever the theme flips: the tokens resolve
  // differently per theme, and a stale number is the exact failure this page
  // exists to prevent.
  useEffect(() => {
    if (!host.current) return
    const el = host.current
    setRows(pairs.map((p) => ({ label: p.label, r: measure(p.fg, p.bg, el), min: p.min })))
  }, [pairs, theme])

  const line = inverse ? 'border-inverse-hairline-strong' : 'border-hairline-strong'
  const dim = inverse ? 'text-inverse-ink-3' : 'text-ink-3'

  return (
    <div ref={host}>
      <ul className={`border-t ${line}`}>
        {rows.map((row) => (
          <li
            key={row.label}
            className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3 ${line}`}
          >
            <span className="label">{row.label}</span>
            <span className={`label ${dim}`}>
              {row.r.toFixed(2)}:1<span className="ml-3">needs {row.min}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Type
 * ------------------------------------------------------------------ */

const TYPE: { cls: string; role: string; sample: string }[] = [
  { cls: 'display-1', role: 'The h1, once per page', sample: 'Enterprise AI is won in production.' },
  { cls: 'display-2', role: 'Section headings', sample: 'What we take responsibility for.' },
  { cls: 'display-3', role: 'Sub-headings and pair titles', sample: 'Three ways in.' },
  { cls: 'display-4', role: 'Card and cell headings', sample: 'Applied AI Solutions' },
  { cls: 'metric', role: 'Numbers only, tabular figures', sample: '220' },
  { cls: 'thesis', role: 'Serif. The argument itself.', sample: 'Enterprise AI is won in production.' },
  { cls: 'lead', role: 'Serif. Deck and lede.', sample: 'The Nordic partner for enabling enterprise AI.' },
  {
    cls: 'body-serif',
    role: 'Serif. Long body copy.',
    sample:
      'Real impact takes more than frontier models, more than slick demos, more than another pilot.',
  },
  { cls: 'ui', role: 'Buttons, nav items, controls', sample: 'Contact us' },
  { cls: 'caption', role: 'Provenance and asides', sample: 'Source: norrin.com, read 2026-09-01.' },
  { cls: 'label', role: 'Mono. Eyebrows and data.', sample: 'Who you will reach' },
]

function TypeRow({ cls, role, sample }: { cls: string; role: string; sample: string }) {
  const theme = useTheme()
  const el = useRef<HTMLParagraphElement>(null)
  const [spec, setSpec] = useState('')

  // Read back what the browser actually set. The scale is built on `clamp()`, so
  // the shipped value depends on the viewport — a number typed here by hand
  // would be correct at exactly one window width.
  useEffect(() => {
    if (!el.current) return
    const s = getComputedStyle(el.current)
    const size = parseFloat(s.fontSize)
    const family = s.fontFamily.split(',')[0].replace(/["]/g, '')
    setSpec(
      [
        `${Math.round(size * 10) / 10}px`,
        `w${s.fontWeight}`,
        `lh ${(parseFloat(s.lineHeight) / size).toFixed(2)}`,
        s.letterSpacing === 'normal' ? 'ls 0' : `ls ${s.letterSpacing}`,
        family,
      ].join('  ·  '),
    )
  }, [theme])

  return (
    <div className="border-b border-hairline py-8">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="label">.{cls}</span>
        <span className="label text-ink-3">{spec}</span>
      </div>
      <p ref={el} className={cls}>
        {sample}
      </p>
      <p className="caption mt-3 text-ink-3">{role}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * The page
 * ------------------------------------------------------------------ */

function Rule({ children }: { children: ReactNode }) {
  return (
    <li className="-indent-5 border-b border-hairline py-4 pl-5">
      <span className="text-accent">&mdash;</span> {children}
    </li>
  )
}

/**
 * The pile's geometry, read off the live DOM.
 *
 * `--stack-shrink` is the one number in the stack that is not derived from
 * another token, and the quantity it actually controls — the side inset at
 * depth 1, in pixels — is a function of the rendered card width. That width is
 * seven of twelve columns of the page measure, and the page measure has already
 * moved twice (1512 -> 1200 -> 1440). The first draft of this constant was
 * estimated against a card width that did not exist and was out by 20%.
 *
 * So the number is printed rather than asserted. If someone moves the measure
 * or the column span, the inset stops matching the step here, visibly, on a
 * page a human is already looking at.
 */
function StackSpec() {
  const theme = useTheme()
  const host = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    const ol = host.current?.querySelector('[data-cardstack]')
    const card = ol?.querySelector('.card')
    if (!ol || !card) return
    const cs = getComputedStyle(ol)
    const step = parseFloat(cs.getPropertyValue('--stack-step'))
    const shrink = parseFloat(cs.getPropertyValue('--stack-shrink'))
    const width = card.getBoundingClientRect().width
    setRows([
      { label: '--stack-step', value: `${step}px — one --radius-panel` },
      { label: '--stack-shrink', value: String(shrink) },
      { label: 'card width, measured', value: `${width.toFixed(1)}px` },
      { label: 'depth-1 side inset', value: `${((width * shrink) / 2).toFixed(2)}px` },
      { label: 'depth-1 vertical step', value: `${step}px` },
      { label: 'list overflow', value: cs.overflow },
    ])
  }, [theme])

  return (
    <div ref={host}>
      <CardStack
        label="Customer cases, on the style guide"
        startPaused
        items={cases.map((c) => ({
          id: c.id,
          picker: c.client,
          eyebrow: c.sector,
          title: c.client,
          lede: c.title,
          body: c.quote,
          note: 'attribution' in c && c.attribution ? c.attribution : undefined,
        }))}
      />
      <ul className="mt-12 border-t border-hairline-strong">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline-strong py-3"
          >
            <span className="label">{r.label}</span>
            <span className="label text-ink-3">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StyleGuide() {
  return (
    <>
      <a href="#guide" className="skip-link">
        Skip to content
      </a>

      <header className="border-b border-hairline py-6">
        <Container className="flex items-center justify-between gap-6">
          <a href="/" className="wordmark control -mx-2 px-2 py-1">
            Norrin <span className="text-ink-3">style guide</span>
          </a>
          <ThemeToggle />
        </Container>
      </header>

      <main id="guide">
        <Container>
          <div className="max-w-[62ch] py-16 md:py-24">
            <Eyebrow label="The system" className="mb-7" />
            <h1 className="display-2">What this page is allowed to look like.</h1>
            <p className="lead measure-serif mt-7 text-ink-2">
              Every size, weight and contrast ratio below is read off the live DOM as this page
              renders, in whichever theme is showing. Nothing is transcribed from the stylesheet.
            </p>
            <p className="caption mt-6 text-ink-3">
              Flip the theme with the control above and every number re-measures.
            </p>
          </div>
        </Container>

        <section className="border-t border-hairline bg-surface py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Type</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Three voices, and the split is the point. Grotesk states, the serif argues, mono
              labels. A face is not chosen per section — it is chosen per job.
            </p>
            {TYPE.map((t) => (
              <TypeRow key={t.cls} cls={t.cls} role={t.role} sample={t.sample} />
            ))}
          </Container>
        </section>

        <section className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Colour on paper</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              The palette is not invented. It was extracted from Norrin&rsquo;s own theme CSS — a
              named Nordic nature system — and four of its eight colours survive as UI. Everything
              here is 2&ndash;12% chroma except one surface.
            </p>
            <div className="max-w-[62ch]">
              <Ratios pairs={PAPER} />
            </div>
          </Container>
        </section>

        <section data-tone="inverse" className="bg-inverse py-16 text-inverse-ink md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Colour on the band</h2>
            <p className="body-serif measure-serif mb-12 text-inverse-ink-2">
              The forest band is the one surface allowed real chroma, and it is used exactly twice
              on the page. Its whole ramp is translucent ink, so every ratio here is composited onto
              the band before it is measured — an uncomposited number would be fiction.
            </p>
            <div className="max-w-[62ch]">
              <Ratios pairs={FOREST} inverse />
            </div>
          </Container>
        </section>

        <section className="border-t border-hairline bg-surface py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Structure</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Separation is carried by 1px hairlines. There are no box-shadows on this site and no
              blur, so &ldquo;lifted&rdquo; has to be said tonally — which is what the overlay
              tokens are for.
            </p>

            <h3 className="display-4 mb-5">Radius means it is an object, not a plane</h3>
            <div className="mb-14 flex flex-wrap items-end gap-6">
              <div className="rounded-action border border-hairline-strong bg-overlay px-6 py-3">
                <span className="label">action · 999px</span>
              </div>
              <div className="rounded-control border border-hairline-strong bg-overlay px-6 py-3">
                <span className="label">control · 8px</span>
              </div>
              <div className="rounded-panel border border-hairline-strong bg-overlay px-6 py-3">
                <span className="label">panel · 14px</span>
              </div>
              <div className="border border-hairline-strong bg-overlay px-6 py-3">
                <span className="label">structure · square</span>
              </div>
            </div>

            <h3 className="display-4 mb-5">Rules that hold</h3>
            <ul className="body-serif measure-serif border-t border-hairline text-reading">
              <Rule>
                <strong className="text-ink">Photography before illustration.</strong> Where a real
                photograph of the subject exists, it outranks a drawing. Illustration is for what
                cannot be photographed.
              </Rule>
              <Rule>
                <strong className="text-ink">Numbering only where content is a sequence.</strong> A
                timeline earns 01/02/03. Eight unrelated sections do not — numbering them asserts a
                progression that does not exist.
              </Rule>
              <Rule>
                <strong className="text-ink">Sun is a signal, never a surface.</strong> Three solid
                uses per page. Anything sitting on sun takes fixed dark ink in both themes.
              </Rule>
              <Rule>
                <strong className="text-ink">
                  The accent is the only colour that touches type.
                </strong>{' '}
                Lichen is a stroke colour; at label sizes it fails AA as text.
              </Rule>
              <Rule>
                <strong className="text-ink">Text is never faded for effect.</strong> Ancestor
                opacity folds into contrast maths, so faded copy genuinely fails it. Movement alone
                carries every text arrival.
              </Rule>
              <Rule>
                <strong className="text-ink">Nothing is invented.</strong> No fabricated statistic,
                client or testimonial — and no fabricated affordance either. A link whose
                destination does not exist is the same class of dishonesty as a fake number.
              </Rule>
            </ul>
          </Container>
        </section>

        {/* ON `--ground`, NOT ON `--surface`. The section above is a surface
            band, and the card's own fill is `--surface` — specimens shown there
            would have had their fill cancelled and only the hairline would have
            survived, which is a picture of a card that does not exist anywhere
            on the page. Scope and the customer stack both sit on the ground, so
            this is where the card gets reviewed. */}
        <section data-shot="card" className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">The card</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              One component, filled two ways. Scope takes the body and the floor; the customer
              stack takes the eyebrow, the heading, the lede and the body. Both specimens carry the
              real strings they carry on the page &mdash; a card filled with placeholder copy tells
              you nothing about the thing this component exists to solve, which is four ragged copy
              lengths sharing a floor.
            </p>
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              <Card body={roles[0].claim} floor={roles[0].role} />
              <Card
                eyebrow={cases[0].sector}
                title={cases[0].client}
                lede={cases[0].title}
                body={cases[0].quote}
              />
            </div>
            <p className="caption mt-4 text-ink-3">
              Left: Scope. Right: the customer stack, shown flat &mdash; the stacking geometry is
              the section below, not the card.
            </p>
          </Container>
        </section>

        <section data-shot="stack" className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">The stack</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Four cards in one grid cell, offset by exactly one corner radius each, so what shows
              of a card behind is precisely its rounded corner. It rotates on a timer, and it stops
              for a hover, for keyboard focus, for a backgrounded tab, and for the pause control —
              which is sticky, and which is not rendered at all when the reader prefers reduced
              motion, because a control that does nothing is a fabricated affordance. Shown here
              paused, so it can be compared rather than watched.
            </p>
            <StackSpec />
            <p className="caption mt-4 text-ink-3">
              Measured off the live DOM on every theme change. The side inset should equal the
              vertical step at the desktop measure; if it does not, the page measure or the
              column span moved and <code>--stack-shrink</code> needs re-deriving.
            </p>
          </Container>
        </section>

        <section className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Photography</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Norrin&rsquo;s own photographs, self-hosted rather than hotlinked, with the exact
              source URL recorded per file. They are shown square-edged and untreated: no radius, no
              shadow, no duotone, no accent wash. Tinting a client&rsquo;s photography into our
              palette is the same class of mistake as repainting their logo.
            </p>
            <div className="grid grid-cols-4 gap-x-6 gap-y-10 md:grid-cols-12">
              <figure className="col-span-4 m-0 md:col-span-6">
                <Photo
                  file={photos.change.file}
                  alt={photos.change.alt}
                  width={photos.change.w}
                  height={photos.change.h}
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
                <figcaption className="caption mt-3 text-ink-3">
                  {photos.change.file} · alt written by us
                </figcaption>
              </figure>
              <figure className="col-span-4 m-0 md:col-span-6">
                <Photo
                  file={photos.careers.file}
                  alt={photos.careers.alt}
                  width={photos.careers.w}
                  height={photos.careers.h}
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
                <figcaption className="caption mt-3 text-ink-3">
                  {photos.careers.file} · alt written by us
                </figcaption>
              </figure>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-hairline py-10">
        <Container className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="caption text-ink-3">
            Speculative redesign concept — not affiliated with or endorsed by Norrin.
          </p>
          <a href="/" className="caption text-accent underline underline-offset-4">
            Back to the page
          </a>
        </Container>
      </footer>
    </>
  )
}
