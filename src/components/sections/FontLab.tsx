import { Container } from '@/components/primitives/Layout'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { positioning } from '@/data/norrin'

/**
 * FontLab — the display face, judged at real size in the real headline.
 *
 * WHY A PAGE AND NOT A SPECIMEN SHEET. The note that started this was that the
 * current face "looks like a typical AI font", which is a judgement about how a
 * face reads at 80px carrying a specific sentence on a specific ground — not
 * something a paragraph of Lorem at 24px can answer. So every candidate here is
 * set in the actual `display-1`, with the actual h1 string, on both themes.
 *
 * IT ALSO ANSWERS THE SECOND QUESTION, which is whether the new face should take
 * the UI as well. Schibsted currently does two jobs — headlines AND nav, buttons,
 * controls — and a face that is characterful at 80px can be tiring at 14px in a
 * nav bar. Each block therefore shows the same candidate twice: once as display,
 * once driving a nav row and a button. That is the pair the decision is actually
 * between, and it is not visible in a specimen.
 *
 * The control is first on purpose. Judging three new faces without the incumbent
 * beside them measures novelty, not fit.
 */

type Candidate = {
  id: string
  name: string
  stack: string
  note: string
  /** Optical correction — see the note in the render. */
  tracking: string
}

const CANDIDATES: Candidate[] = [
  {
    id: 'schibsted',
    name: 'Schibsted Grotesk',
    stack: "'Schibsted Grotesk Variable', sans-serif",
    note: 'Current. Norwegian, OFL. The face the "typical AI font" note is about.',
    tracking: '-0.035em',
  },
  {
    id: 'fraunces',
    name: 'Fraunces',
    stack: "'Fraunces Variable', serif",
    note: 'Variable serif with SOFT and WONK axes. Most character of the three — and a second serif alongside Newsreader, which is the cost.',
    tracking: '-0.02em',
  },
  {
    id: 'familjen',
    name: 'Familjen Grotesk',
    stack: "'Familjen Grotesk Variable', sans-serif",
    note: 'Swedish, OFL. Nordic provenance like Schibsted, more character in the a, g and k. Drops in with nothing else to change.',
    tracking: '-0.03em',
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    stack: "'Bricolage Grotesque Variable', sans-serif",
    note: 'Variable grotesque, deliberately irregular widths. Keeps the three-voice split. Reads design-led rather than institutional.',
    tracking: '-0.03em',
  },
]

function Block({ c }: { c: Candidate }) {
  return (
    <section className="border-t border-hairline py-16 md:py-20">
      <Container>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="label text-accent">{c.name}</h2>
          <p className="caption max-w-[52ch] text-ink-3">{c.note}</p>
        </div>

        {/* THE HEADLINE, at the real class and the real string.
            `letter-spacing` is overridden per candidate rather than inherited,
            because tracking is not transferable between faces: -0.035em is
            correct for Schibsted at this size and closes Fraunces up until its
            serifs collide. Judging a face at another face's tracking judges the
            tracking. */}
        <h3
          className="display-1"
          style={{ fontFamily: c.stack, letterSpacing: c.tracking }}
        >
          Enterprise AI is won in <span className="text-accent">production.</span>
        </h3>

        <p
          className="display-2 mt-12 max-w-[20ch]"
          style={{ fontFamily: c.stack, letterSpacing: c.tracking }}
        >
          What we take responsibility for.
        </p>

        {/* The UI question, shown rather than described. */}
        <div className="mt-14 border-t border-hairline pt-8">
          <p className="label mb-6 text-ink-3">The same face driving the interface</p>
          <div
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ fontFamily: c.stack }}
          >
            <nav className="flex flex-wrap items-center gap-x-7 text-[0.875rem]">
              <span>What we do</span>
              <span>Work</span>
              <span>Thinking</span>
              <span>Company</span>
            </nav>
            <span className="btn btn-solid" style={{ fontFamily: c.stack }}>
              Contact us
            </span>
            <span className="btn btn-ghost" style={{ fontFamily: c.stack }}>
              Why pilots stall
            </span>
          </div>
        </div>

        {/* Body copy is NOT swapped. Newsreader carries the reading on this site
            in every candidate, so leaving it fixed is what isolates the variable
            — except for Fraunces, where the point of the block is precisely that
            two serifs now sit together. Look at this paragraph hardest there. */}
        <p className="body-serif measure-serif mt-10 text-reading">{positioning.lede}</p>
      </Container>
    </section>
  )
}

export function FontLab() {
  return (
    <>
      <a href="#faces" className="skip-link">
        Skip to content
      </a>

      <header className="border-b border-hairline py-6">
        <Container className="flex items-center justify-between gap-6">
          <a href="/" className="wordmark control -mx-2 px-2 py-1">
            Norrin <span className="text-ink-3">display faces</span>
          </a>
          <ThemeToggle />
        </Container>
      </header>

      <main id="faces">
        <Container>
          <div className="max-w-[62ch] py-16 md:py-20">
            <h1 className="display-2">Four faces, one headline.</h1>
            <p className="lead measure-serif mt-6 text-ink-2">
              Each candidate set in the real <code className="label">display-1</code>, at the real
              size, carrying the real sentence — then the same face driving a nav row and two
              buttons, which is the second half of the decision.
            </p>
            <p className="caption mt-5 text-ink-3">
              Flip the theme above; a face that holds on paper can thicken on a dark ground.
            </p>
          </div>
        </Container>

        {CANDIDATES.map((c) => (
          <Block key={c.id} c={c} />
        ))}
      </main>

      <footer className="border-t border-hairline py-10">
        <Container>
          <p className="caption text-ink-3">
            Candidates are declared in index.css and used nowhere else. The two that lose get
            deleted with their <code className="label">@font-face</code> blocks.
          </p>
        </Container>
      </footer>
    </>
  )
}
