import { Container, Eyebrow } from '@/components/primitives/Layout'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'

/**
 * Compare — the argument, side by side.
 *
 * WHY THIS EXISTS. The rest of this project is a redesign, and a redesign shown
 * on its own asks the viewer to hold the original in their head and do the diff
 * themselves. Someone senior at Norrin, opening a cold link, will not. This
 * surface does the diff for them: their page on the left, ours on the right,
 * and one line saying what changed and why.
 *
 * PAIRED BY SUBJECT, NOT BY SCROLL POSITION, and that is deliberate. Their
 * order and ours differ in one place — their thesis sits below a webinar promo
 * and ours does not — so pairing by position would compare unrelated bands and
 * would quietly hide the single structural change most worth arguing for.
 *
 * EVERY NUMBER ON THIS PAGE WAS MEASURED, not estimated, and several of them
 * corrected a first guess that was wrong:
 *   - Heading sizes and the 4.28:1 come from computed styles read off their
 *     live page (`.shots/probe/norrin-hero.mjs`, `norrin-headings.mjs`).
 *   - The video finding comes from the DOM containing no "MINDS" anywhere
 *     (`norrin-slogan2.mjs`, `norrin-heroshape.mjs`).
 *   - The image weight is what a browser actually TRANSFERS on their homepage
 *     (`norrin-weight.mjs`), not what their source files weigh. Their CDN
 *     serves resized WebP; the source-file comparison would have been ~50x and
 *     completely misleading.
 * If a claim here cannot be traced to one of those, it should not be here.
 *
 * TONE. Every note describes a decision and its consequence. None of them
 * describes the people who made it, and none of them is a joke at their
 * expense — this gets sent TO Norrin, and a critique that enjoys itself is one
 * nobody acts on.
 */

type Pair = {
  id: string
  title: string
  /** What their band does. Observed, never inferred. */
  theirs: string
  /** What ours does instead, and the reason. */
  ours: string
}

const PAIRS: Pair[] = [
  {
    id: 'hero',
    title: 'The hero',
    theirs:
      'The document’s only h1 — “We are Norrin” — is set at 19.5px, the same size as the ' +
      'paragraph under it and the link beside it. The line that dominates the screen is an ' +
      '825×633 video of letterforms with no text alternative, so the page’s largest statement ' +
      'is not text: it cannot be selected, indexed, or translated into the four other ' +
      'languages the site ships. The CTA is an anchor classed “button” with no background, ' +
      'border or padding, at 4.28:1 against the moss ground — under the 4.5:1 minimum, and ' +
      'the lowest-contrast text in the hero.',
    ours:
      'Their thesis takes the h1 and the display size; the company name becomes the eyebrow, ' +
      'which is what a name is. Their brand line returns as real type, so it can be read, ' +
      'searched and translated. The CTA is a button. Nothing here is new copy — the words are ' +
      'theirs, in a different order of importance.',
  },
  {
    id: 'thesis',
    title: 'Enabling enterprise AI',
    theirs:
      'The one band on the homepage with a genuinely large heading. Underneath it, the ' +
      'sentence that actually argues for the company — “We believe enterprise AI is won in ' +
      'production.” — is an h3 at 19.5px in regular weight, two screens below a webinar promo.',
    ours:
      'That sentence is the whole site. It is the h1 in the hero and this section is built to ' +
      'prove it: one rule running the length of the page, dashed while the work is a pilot ' +
      'and solid once it reaches production.',
  },
  {
    id: 'services',
    title: 'What they sell',
    theirs:
      'Three cards of identical weight, each a heading and a paragraph of roughly ninety ' +
      'words. The four roles the intro paragraph names — integrator, deployer, infrastructure ' +
      'partner, transformation lead — are the clearest thing written about the company, and ' +
      'they appear once, in prose, above the cards.',
    ours:
      'Those four roles get their own section and their own line each. The three offers then ' +
      'get room to be different lengths, because they are.',
  },
  {
    id: 'publications',
    title: 'Highlights, and everything to read',
    theirs:
      'A webinar promo and the podcast sit in the band directly under the hero — above the ' +
      'thesis. The vision paper gets its own section much further down. The most perishable ' +
      'item on the page holds its most valuable position.',
    ours:
      'One panel, four rungs, ordered by what each asks of you: read, listen, download, ' +
      'attend. It sits late, where someone still deciding will reach it, and the webinar is ' +
      'last because it asks the most — not because it matters least.',
  },
  {
    id: 'customers',
    title: 'The customers',
    theirs:
      'Ten recognisable Nordic enterprises, listed as links at body size in a block below a ' +
      'short paragraph.',
    ours:
      'The same ten names, set large as type rather than as logos — we hold no licence to ' +
      'their marks, and at this size the roster is the evidence rather than a footnote to it.',
  },
  {
    id: 'careers',
    title: 'Work at Norrin',
    theirs:
      'The recruitment pitch is white text inside a translucent panel laid over a photograph ' +
      'of the office, so its contrast depends on whatever happens to be behind it. The call ' +
      'to action renders with a bullet in front of it.',
    ours:
      'The type sits on the page’s own ground beside the photograph instead of on top of it, ' +
      'so it is legible for the same reason every other paragraph on the site is. Same words, ' +
      'same picture.',
  },
]

/**
 * A pair of stills.
 *
 * Both sides are captured by `tools/compare.mjs` in one pass — see the note at
 * the top of that file for why stills rather than live sections, and why it
 * matters that one command produces both.
 *
 * Intrinsic dimensions are stated so nothing reflows as the twelve images
 * arrive; every one is lazy except the first pair's, which is above the fold.
 */
function Shot({ src, alt, label, eager }: { src: string; alt: string; label: string; eager?: boolean }) {
  return (
    <figure className="m-0">
      <figcaption className="label mb-3 text-ink-3">{label}</figcaption>
      <img
        src={src}
        alt={alt}
        width={1440}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block w-full border border-hairline bg-surface"
      />
    </figure>
  )
}

export function Compare() {
  return (
    <>
      <a href="#pairs" className="skip-link">
        Skip to the comparison
      </a>

      {/* Deliberately not the site's own navbar. This is a separate document
          about the site, and giving it the site's chrome would suggest it is a
          page of it — which would also put a second copy of every nav anchor
          into a document that has none of those sections. */}
      <header className="border-b border-hairline py-6">
        <Container className="flex items-center justify-between gap-6">
          <a href="/" className="wordmark control -mx-2 px-2 py-1">
            Norrin <span className="text-ink-3">redesign</span>
          </a>
          <ThemeToggle />
        </Container>
      </header>

      <main>
        <Container>
          <div className="max-w-[62ch] py-16 md:py-24">
            <Eyebrow label="Side by side" className="mb-7" />
            <h1 className="display-2">What changed, and why.</h1>
            <p className="lead measure-serif mt-7 text-ink-2">
              Every section of norrin.com’s homepage, beside the same section rebuilt. The copy
              is theirs throughout — almost nothing here is rewritten, because the argument is
              that the words were already good and the page was not making them legible.
            </p>
            <p className="caption mt-6 text-ink-3">
              An independent, unsolicited redesign built from public information only. Not
              affiliated with or endorsed by Norrin. Screenshots of norrin.com were captured at
              1440×900 for the purpose of criticism and comparison; both sides are regenerated
              by one command so they never drift apart. Every figure quoted below was measured
              from their live page, not estimated.
            </p>
          </div>
        </Container>

        <div id="pairs">
          {PAIRS.map((pair, i) => (
            <section
              key={pair.id}
              aria-labelledby={`pair-${pair.id}`}
              // Alternating ground so each pair reads as its own object without
              // needing a card, a shadow or a radius — the same way the rest of
              // the site separates things.
              className={i % 2 === 1 ? 'bg-surface py-16 md:py-24' : 'py-16 md:py-24'}
            >
              <Container>
                <h2 id={`pair-${pair.id}`} className="display-3 mb-10">
                  {pair.title}
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
                  <div>
                    <Shot
                      src={`/compare/theirs-${pair.id}.webp`}
                      alt={`norrin.com’s ${pair.title.toLowerCase()} section as published.`}
                      label="norrin.com"
                      eager={i === 0}
                    />
                    <p className="body-serif mt-5 text-reading">{pair.theirs}</p>
                  </div>

                  <div>
                    <Shot
                      src={`/compare/ours-${pair.id}.webp`}
                      alt={`The same section rebuilt in this redesign.`}
                      label="This redesign"
                      eager={i === 0}
                    />
                    <p className="body-serif mt-5 text-reading">{pair.ours}</p>
                  </div>
                </div>
              </Container>
            </section>
          ))}
        </div>

        {/* The one claim on this page that is about bytes rather than about
            design, kept separate because it is the one most likely to be
            checked — and because the honest version of it is far less
            flattering than the obvious one. Their source files sum to ~47 MB,
            which would make a wonderful headline and would be a lie: their CDN
            serves resized WebP and a browser actually transfers about 915 kB. */}
        <section aria-labelledby="weight" className="border-t border-hairline py-16 md:py-24">
          <Container>
            <h2 id="weight" className="display-3 mb-8">
              One number, stated carefully.
            </h2>
            <div className="max-w-[62ch]">
              <p className="body-serif text-reading">
                Loaded in a real browser and scrolled to the bottom, norrin.com transfers about{' '}
                <strong className="text-ink">915&nbsp;kB</strong> of photography — six images,
                served as WebP at sensible widths. This rebuild serves the same six as AVIF for
                about <strong className="text-ink">525&nbsp;kB</strong>. That is a real
                improvement and a modest one: roughly 1.7×, not the order of magnitude their raw
                source files would suggest.
              </p>
              <p className="caption mt-6 text-ink-3">
                Their image delivery is genuinely competent, and the first version of this page
                said otherwise. Comparing our output against their 47&nbsp;MB of source files
                would have been flattering, easy, and wrong.
              </p>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-hairline py-10">
        <Container>
          <a href="/" className="ui text-accent underline-offset-4 hover:underline">
            See the full redesign
          </a>
        </Container>
      </footer>
    </>
  )
}
