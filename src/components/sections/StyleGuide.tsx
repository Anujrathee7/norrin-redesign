import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Container, Grid, Eyebrow } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { useTheme } from '@/hooks/useTheme'
import { measure } from '@/lib/contrast'
import { CardStack } from '@/components/primitives/CardStack'
import { caseStackItems } from '@/components/primitives/caseStackItems'
import { CardSlider } from '@/components/primitives/CardSlider'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  /* `.label` NO LONGER SAYS "EYEBROWS", AND THE SPLIT IS THE POINT. It used to
     do both jobs, which is why every section on the site opened at 10.5px on
     `--ink-3` and read as invisible. The eyebrow is its own role now — 12px,
     `--ink`, led by an accent rule — and `.label` keeps the 122 places it is
     genuinely an annotation beside something larger. */
  { cls: 'label', role: 'Mono. Units, indices, telemetry.', sample: '31 M€ / 7 offices' },
  { cls: 'eyebrow', role: 'Mono. The first line of a section.', sample: 'Track record' },
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
 * The tone lab
 * ------------------------------------------------------------------ */

/**
 * Four directions for the customer pile's card surfaces, rendered.
 *
 * §4 is the reason this is a page and not a paragraph: the palette is under
 * revision, and it says directions get rendered here and picked from. One tone
 * — the forest — was committed straight to the real pile instead, looked at,
 * and taken off again. That is the round trip this block exists to stop.
 *
 * REAL CONTENT, NOT SWATCHES. Each specimen carries the case title with its
 * accent phrase, the quote and the attribution, because what is being judged is
 * three colours carrying type at four ink weights — which a rectangle of colour
 * cannot tell you anything about.
 *
 * PAPER AND SUN ARE THE SAME IN ALL FOUR. Only the dark tone changes, so the
 * question being asked is exactly one colour wide.
 */
const TONE_DIRECTIONS = [
  { key: 'a', name: 'Ink', hex: '#14170f' },
  { key: 'b', name: 'Espresso', hex: '#2a221c' },
  { key: 'c', name: 'Slate', hex: '#1c2733' },
  { key: 'd', name: 'Aubergine', hex: '#2d1f33' },
] as const

function ToneCard({ lab }: { lab: 'dark' | 'dark-ruled' | 'paper' | 'sun' }) {
  const c = cases[0]
  const words = c.title.trim().split(/\s+/)
  const head = words.slice(0, -2).join(' ')
  const tail = words.slice(-2).join(' ')
  return (
    <div className="card" data-lab={lab}>
      <div className="quote-set">
        <p className="quote-title">
          {head} <span className="quote-title-tail">{tail}</span>
        </p>
        <p className="quote-body">{c.quote}</p>
        <div className="quote-who">
          <p className="quote-who-name">{c.client}</p>
          <p className="quote-who-role">{c.sector}</p>
        </div>
      </div>
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
 * WHAT THIS READOUT IS FOR. The fan is paid for out of the front card's own
 * width — the region subtracts `--stack-reach` before sizing the card, so that
 * the HAND fits its column rather than the card fitting it and the cards behind
 * turning out into the clip. That makes the card width a consequence of the fan
 * and the column, and a consequence is exactly the kind of number a style guide
 * should print rather than assert.
 *
 * IT MEASURED `--stack-step` UNTIL THE PILE BECAME A HAND. The step is deleted;
 * reading it would print `NaN`, which is the defect described below, again.
 *
 * IT USED TO MEASURE `--stack-shrink`, A TOKEN THAT NO LONGER EXISTS, and it
 * printed `NaN` in two of its six rows for however long that had been true. It
 * also described the step as "one --radius-panel", which stopped being true when
 * the two were decoupled — a lying style guide is worse than no style guide, and
 * this file says so in its own header.
 */
function StackSpec() {
  const theme = useTheme()
  const host = useRef<HTMLDivElement>(null)
  const [rows, setRows] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    const ol = host.current?.querySelector('[data-cardstack]')
    const card = ol?.querySelector('.card')
    if (!ol || !card) return
    const region = host.current?.querySelector('[data-cardstack-region]')
    const cs = getComputedStyle(region ?? ol)
    const fan = parseFloat(cs.getPropertyValue('--stack-fan'))
    const count = parseFloat(cs.getPropertyValue('--stack-count'))
    // Unrotated size: the front card's `li` is at 0deg, so offsetWidth is honest.
    const width = (card as HTMLElement).offsetWidth
    const cardCs = getComputedStyle(card)
    setRows([
      { label: '--stack-fan', value: `${fan}deg per card, about the bottom-left corner` },
      { label: 'deepest angle', value: `${((count - 1) * fan).toFixed(0)}deg` },
      { label: '--stack-reach', value: cs.getPropertyValue('--stack-reach').trim() },
      { label: '--stack-dip', value: cs.getPropertyValue('--stack-dip').trim() },
      { label: '--radius-stack', value: cs.getPropertyValue('--radius-stack').trim() },
      { label: 'card width, measured', value: `${width.toFixed(1)}px` },
      { label: 'card body fill', value: cardCs.backgroundColor },
      { label: 'list overflow', value: getComputedStyle(ol).overflow },
    ])
  }, [theme])

  return (
    // THE SPECIMEN GETS THE SECTION'S REAL GEOMETRY, not the full measure.
    // Rendered edge to edge the card came out 1347px wide and the readout below
    // reported a 24px side inset against a 14px step — a discrepancy invented by
    // the guide rather than found in the page.  is a ratio, so a
    // specimen at the wrong width measures the wrong thing and this readout is
    // the one place that must not lie.
    <div ref={host}>
      <Grid>
        <div className="col-span-4 md:col-span-5 md:col-start-8">
      <CardStack paused items={caseStackItems} />
        </div>
      </Grid>
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
                <strong className="text-ink">Sun may carry a card, never a plane.</strong> Amended:
                this read &ldquo;never a surface&rdquo; until the code broke it three times &mdash; the
                customer pile, this lab and Scope each set a whole card on sun. The line is scale,
                not permission. Never a band or a section ground. Anything sitting on sun takes
                fixed dark ink in both themes.
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

        {/* THE TONE LAB. §4's instruction, carried out: rendered options, in
            both themes, picked from rather than chosen. */}
        <section
          data-shot="tonelab"
          data-tone="inverse"
          className="bg-band-night py-16 text-inverse-ink md:py-24"
        >
          <Container>
            <h2 className="display-3 mb-3">Card tones &mdash; four directions</h2>
            <p className="body-serif measure-serif mb-4 text-inverse-ink-2">
              The customer pile is being given three card surfaces instead of one. Paper and sun are
              the same in all four directions below; only the dark tone changes, so the question is
              exactly one colour wide. Each specimen carries the real case &mdash; title, accent
              phrase, quote, attribution &mdash; because three colours carrying type at four ink
              weights is not a thing a swatch can answer.
            </p>
            <p className="body-serif measure-serif mb-4 text-inverse-ink-2">
              All three surfaces are fixed in both themes, the way sun already is. That is what
              makes a direction a direction. Nothing here is a token in the system and none of it is
              in <code>tools/palette.mjs</code>: gating a colour is what you do once a colour has
              been chosen.
            </p>
            <p className="body-serif measure-serif mb-12 text-inverse-ink-2">
              <strong className="text-inverse-ink">
                These now sit on the night band, which is the ground the pile actually has,
              </strong>{' '}
              and it changes the answer. A dark card on a dark band does not read: measured against
              #0e120f the four dark tones are 1.04:1 (A), 1.21:1 (B), 1.25:1 (C) and 1.22:1 (D)
              &mdash; the parity bar this file sets for a rule is 1.25:1, so the best of them is
              exactly as separated from the band as a hairline is, and the worst is not separated at
              all. Paper reads at 16.54:1 and sun at 16.09:1 on the same ground. Below, each dark
              card is shown twice: on the left as a plane, on the right with the band&rsquo;s
              stronger hairline drawn round it.
            </p>

            {TONE_DIRECTIONS.map((d) => (
              <div key={d.key} data-tonelab={d.key} className="mb-14">
                <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="label">
                    {d.key.toUpperCase()} &middot; {d.name}
                  </span>
                  <span className="label text-inverse-ink-3">{d.hex}</span>
                </div>
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <ToneCard lab="dark" />
                  <ToneCard lab="dark-ruled" />
                  <ToneCard lab="paper" />
                  <ToneCard lab="sun" />
                </div>
              </div>
            ))}

            <p className="caption mb-4 max-w-[62ch] text-inverse-ink-2">
              The accent phrase on a dark card is sun, not moss. Moss measures 1.68&ndash;2.01:1 on
              these four and fails every one of them &mdash; the same failure this file already
              records for moss on the forest band. Sun measures 12.90&ndash;15.44:1. The inverse ink
              ladder clears AA on all four darks at every rung, so the TYPE on a dark card is never
              the problem; only the card&rsquo;s own edge is.
            </p>
            <p className="caption max-w-[62ch] text-inverse-ink-2">
              Three ways out, none of them picked here. ONE: the dark card keeps its tone and gets
              the band&rsquo;s stronger hairline, so it reads as an outlined object rather than as a
              plane &mdash; that rule is 1.87:1 on the band, the same weight every other rule on
              this page is drawn at, and it is the right-hand specimen in each row. TWO: push the
              band darker. It was measured and it is the one to refuse: at #0a0d0b the inverse
              hairline falls to 1.25:1 and at #060807 both hairlines fail their parity bar, so the
              page&rsquo;s only separating device stops reading in order to buy a tenth of a ratio
              behind a card. THREE: drop the dark card and run paper, sun and a mid tone &mdash;
              which is what the sketch this came from actually showed. Option ONE is the one worth
              defending: it costs nothing measured, it keeps all four directions alive, and an
              outlined card on a night ground is a thing this page already knows how to draw.
            </p>
          </Container>
        </section>

        {/* ADOPTED COMPONENTS.

            §2.8 is the clause this section exists for: every adopted component
            is rendered here, in both themes, or it is not adopted. A component
            that exists only inside a section cannot be reviewed — the reviewer
            would have to find the one card that happens to use it, in the one
            state it happens to be in.

            ON `--ground`, for the same reason the card section below is: these
            are shown against the plane they are actually drawn on. */}
        <section data-shot="adopted" className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">Adopted components</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Two shadcn components, rethemed. Not one stock value survives: every colour below is
              a bridge variable pointing at a token that was already here and already measured,
              which is what §2.2 asks for &mdash; the stock neutral-zinc look is on tens of
              thousands of sites and shipping it would worsen the exact problem this page exists to
              answer. The focus classes it shipped with were stripped rather than restyled: a
              Tailwind ring is a box-shadow, and it would have cancelled this page&rsquo;s global
              outline along with the swap that keeps a ring visible on the forest band. A Badge was
              adopted here too and then removed with the element it was carrying &mdash; a
              component with no consumer is not adopted, it is inventory.
            </p>

            <h3 className="display-4 mb-5">Tabs</h3>
            <div className="mb-4 max-w-[46rem]">
              <Tabs defaultValue="a">
                <TabsList>
                  <TabsTrigger value="a">First panel</TabsTrigger>
                  <TabsTrigger value="b">Second panel</TabsTrigger>
                  <TabsTrigger value="c" disabled>
                    Disabled
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="a" className="caption mt-6 max-w-[62ch] text-ink-2">
                  The active trigger marks its own span of the list&rsquo;s hairline in accent. That
                  is the bar&rsquo;s gesture for the current route, reused rather than reinvented,
                  and it is what replaces shadcn&rsquo;s stock <code>bg-muted</code> track holding a
                  <code> bg-background</code> pill &mdash; the single most recognisable tell the
                  library has.
                </TabsContent>
                <TabsContent value="b" className="caption mt-6 max-w-[62ch] text-ink-2">
                  Square, because a tab is not an object sitting on a plane: the rule it sits on is
                  the plane, and planes have no corners. <code>--radius</code> stays unspent here.
                </TabsContent>
                <TabsContent value="c">Disabled panels are unreachable.</TabsContent>
              </Tabs>
            </div>
            <p className="caption mb-12 max-w-[62ch] text-ink-3">
              A disabled trigger is shown because it is the one state with a contrast question worth
              answering on a review page, and it is the state a section never renders. Tab the row
              in both themes: there is no <code>ring</code> utility on it, so the only focus
              treatment is this page&rsquo;s global <code>:focus-visible</code> outline &mdash; the
              same call the Progress adoption made, and for the same two bugs.
            </p>

            <h3 className="display-4 mb-5">Progress</h3>
            <div className="mb-4 max-w-[24rem] space-y-5">
              {[0, 25, 50, 75, 100].map((v) => (
                <div key={v} className="flex items-center gap-4">
                  <span className="label w-10 shrink-0 text-ink-3">{v}%</span>
                  <Progress aria-label={`Progress specimen, ${v} percent`} value={v} />
                </div>
              ))}
            </div>
            <p className="caption mb-6 max-w-[62ch] text-ink-3">
              0% and 100% are shown because they are the two states that expose a track that cannot
              be seen: at 0% only the track is drawn, at 100% only the fill. The track is the accent
              at 20%, the fill the accent solid, so the pair reads on either ground without adding a
              colour to the system.
            </p>
            <p className="caption max-w-[62ch] text-ink-3">
              These five carry an <code>aria-label</code>, because a specimen on a review page is
              genuinely describing its own value. The one in the customer stack does not:
              it is <code>aria-hidden</code> there, and deliberately.{' '}
              <code>role=&ldquo;progressbar&rdquo;</code> means task completion, all four customer
              cases are already in the accessibility tree in source order, and
              &ldquo;25%&rdquo; is not a description of &ldquo;showing the first of four&rdquo;. The
              bar is a picture of where the pile is, for people who can see the pile.
            </p>

            {/* SLIDER — §2.8. Rendered here because a component that exists only
                inside a section cannot be reviewed. `paused` holds it still so
                it can be compared rather than watched; in Scope it advances
                every 5s, pauses on hover, on focus, and while a card is held.

                THE DEPTH-OF-FIELD BLUR IS GONE, on the user's instruction, so
                this specimen and the live section now render the flanking cards
                the same way: small, sharp, and receding on scale and tone alone.
                Under `prefers-reduced-motion` the real section still falls back
                to a flat 2x2 grid with no travel and every card at full size.
                The flanking cards' contrast pairs were gated while the blur was
                here and remain gated — removing it makes them more
                load-bearing, not less. */}
            <h3 className="display-4 mt-14 mb-5">Card slider</h3>
            <CardSlider
              paused
              items={roles.map((r, i) => ({
                id: r.id,
                body: r.claim,
                points: r.points,
                pointsLabel: 'In practice',
                floor: r.role,
                label: r.role,
                // The site-wide art names; the retired dark/paper/signal tones
                // have no art, and rendered a white title on a white card here.
                tone: (['slate', 'clay', 'sage', 'plum'] as const)[i % 4],
              }))}
            />
            <p className="caption mt-6 max-w-[62ch] text-ink-3">
              Three cards across, the centre one focused. The pair beside it recedes by scale and by
              tone &mdash; never by opacity, because ancestor opacity folds into contrast maths and
              faded copy genuinely fails. Every card here is <code>opacity: 1</code>. The arrows and
              dots are real buttons, which is what lets a keyboard or touch user stop it: hover is
              unreachable on touch, and the customer stack records that gap as an accepted cost.
              This component closes it.
            </p>
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
              One anatomy for every card on the site: a gradient art with the heading inside it,
              over a white body. Scope, Thinking, the track record and the customer deck all use
              it, with the art taken by position from four tones. Both specimens carry the real
              strings they carry on the page.
            </p>
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              <article className="art-card" data-tone="slate">
                <div className="case-art">
                  <h3 className="case-title">{roles[0].role}</h3>
                </div>
                <div className="case-body">
                  <p className="case-summary">{roles[0].claim}</p>
                </div>
              </article>
              <article className="art-card" data-tone="sage">
                <div className="case-art">
                  <h3 className="case-title">{cases[2].title}</h3>
                </div>
                <div className="case-body">
                  <p className="case-summary">{cases[2].short}</p>
                  <div className="case-floor">
                    <p className="case-client">{cases[2].client}</p>
                  </div>
                </div>
              </article>
            </div>
            <p className="caption mt-4 text-ink-3">
              Left: Scope. Right: a customer case, shown flat &mdash; the fan is the section
              below, not the card.
            </p>
          </Container>
        </section>

        <section data-shot="stack" className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 className="display-3 mb-3">The stack</h2>
            <p className="body-serif measure-serif mb-12 text-reading">
              Four cards in one grid cell, each stepped down and to the right by the same amount
              and sunk one step closer to the page ground, so the pile reads as four sheets rather
              than as one card with a thick edge. The step was derived from{' '}
              <code>--radius-panel</code> until it was not: a corner radius and the distance between
              two cards were never the same measurement, and tying them meant the only way to make
              the pile legible was to round every panel on the page harder. It rotates on a timer,
              dealing the front card out past the frame; it stops for a mouse and for a backgrounded
              tab, and never starts at all under reduced motion. It carries no controls, so it does
              not meet WCAG 2.2.2 — recorded here rather than left to be discovered. Shown here
              paused, so it can be compared rather than watched.
            </p>
            <StackSpec />
            <p className="caption mt-4 text-ink-3">
              Measured off the live DOM on every theme change. The card width is what is left of the
              column after the pile&rsquo;s travel is subtracted, so if the pile is ever clipped at
              its right edge, it is this row that will say why.
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
