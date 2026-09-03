import { Container, Grid } from '@/components/primitives/Layout'
import { footerBlurb, offices, social } from '@/data/norrin'

/**
 * Footer.
 *
 * Also the footprint section: procurement and risk functions need entity data,
 * and "is this a Finland-only supplier?" is a real objection for a buyer with a
 * Nordic or global estate. Seven offices across five countries answers it, so
 * the addresses are given properly rather than hidden behind a menu item.
 *
 * Mono throughout, hairline-ruled, no ornament.
 *
 * IT MOVES NOW, AND IT DID NOT BEFORE. The scroll layer carried a note saying
 * the footer has no motion because an `entry -> exit` range cannot complete at
 * the page end — the element enters, the document runs out of scroll, and the
 * animation freezes part-way. That was true when this was three columns of
 * eleven links and stood taller than a viewport. It is 708px now, and measured
 * at the top of the block both `cover 12% -> 40%` and `entry 0% -> 100%`
 * complete with nothing left over, at 950px and 780px of viewport.
 *
 * The caveat survives where it still applies: an element at the BOTTOM of the
 * footer has 38px of a 40px range left when the page stops scrolling. So the
 * footprint and the navigation move, and the legal line at the very end does
 * not. That is a real boundary, not an oversight — the last thing on the page
 * is the one thing that can never finish arriving.
 *
 * Deliberately not a sitemap of itself. This was three columns of eleven links,
 * six of which were aliases for two anchors — four separate labels all landing
 * on #pillars, three all landing on #thinking — plus a "Careers" link pointing at
 * a values section with no careers content. A one-page document does not need a
 * menu of its own headings, and the bar above already carries every one of them.
 * What survives is what a footer is actually for: where the company is, what it
 * is, where else it lives, and who built this.
 */

const COMPANY_LINKS = [
  { label: 'About us', href: '#proof' },
  // Was "Customer cases"; the bar calls the same section Work. One name per thing.
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  // Group offices by country so the footprint reads as five countries, not
  // seven addresses.
  const byCountry = offices.reduce<Record<string, typeof offices[number][]>>((acc, o) => {
    ;(acc[o.country] ??= []).push(o)
    return acc
  }, {})

  return (
    <footer id="footer" data-shot="footer" className="border-t border-hairline pt-20 pb-10">
      <Container>
        {/* Footprint */}
        <Grid className="gap-y-10">
          <div
            data-scroll="enter"
            style={{ ['--scrub-to' as string]: 'cover 30%' }}
            className="col-span-4 md:col-span-3"
          >
            <p className="label text-ink-3">Footprint</p>
          </div>
          <ul className="col-span-4 grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-9 lg:grid-cols-5">
            {/* Staggered across the five countries, left to right — the same
                sweep the customer roster uses, and for the same reason: this is
                one list read across, not five things arriving separately. */}
            {Object.entries(byCountry).map(([country, list], i) => (
              <li
                key={country}
                data-scroll="enter"
                style={{
                  ['--enter-y' as string]: '22px',
                  ['--scrub-from' as string]: `cover ${12 + i * 4}%`,
                  ['--scrub-to' as string]: `cover ${12 + i * 4 + 26}%`,
                }}
              >
                <p className="label mb-3 border-b border-hairline pb-2 text-ink">{country}</p>
                <ul className="space-y-2.5">
                  {list.map((o) => (
                    <li key={o.city}>
                      <p className="ui text-ink-2">{o.city}</p>
                      <p className="caption text-ink-3">{o.address}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Grid>

        {/* Navigation */}
        {/* `entry`, NOT `cover`, AND THIS IS A BUG FIX RATHER THAN A TASTE.

            These three blocks used to run on `cover 8/12/16% -> 30/34/38%`,
            described as "measured rather than guessed". It was guessed, and the
            last of the three never finished: the Elsewhere column sat 1.13px
            below its resting position on every page load, on every viewport,
            for as long as the footer has had motion.

            `cover` spans the element crossing the whole scrollport — enter at
            the bottom, leave at the top. Nothing in a footer ever leaves at the
            top, because the document ends first. The highest progress reachable
            at maximum scroll is `d / (viewport + height)`, where `d` is the
            distance from the element's top to the bottom of the document — 29.6%
            for this column at 1512x950. Every range ending past that was unable
            to complete, and the failure gets WORSE on a taller viewport, so no
            hand-picked percentage fixes it for everyone.

            `entry` is the phase that actually describes what these do: the
            element coming into view. It completes as soon as the element is
            fully on screen, which the footer always achieves, and it is
            independent of how much document is left underneath. The ranges below
            end at 68/78/88% so there is headroom even at the shortest viewport.

            The check at the bottom of `tools/anim.mjs` asserts nothing down here
            is left mid-transform when the page stops scrolling. It was reporting
            this correctly the whole time. */}
        <Grid className="mt-20 gap-y-10 border-t border-hairline pt-12">
          <div
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 8%',
              ['--scrub-to' as string]: 'entry 68%',
            }}
            className="col-span-4 md:col-span-3"
          >
            <a href="#top" className="flex w-fit items-center gap-2.5 text-accent">
              <span className="wordmark text-ink">
                Norrin
              </span>
            </a>
            <p className="caption mt-5 max-w-[38ch] text-ink-3">{footerBlurb.text}</p>
          </div>

          <nav
            aria-label="Company"
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 18%',
              ['--scrub-to' as string]: 'entry 78%',
            }}
            className="col-span-2 md:col-span-2 md:col-start-6"
          >
            <p className="label mb-4 text-ink-3">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="ui text-ink-2 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Same construction as its sibling — these are the only links that
              leave the site, so they are the last ones that should lack a landmark. */}
          <nav
            aria-label="Elsewhere"
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 28%',
              ['--scrub-to' as string]: 'entry 88%',
            }}
            className="col-span-2 md:col-span-2 md:col-start-9"
          >
            <p className="label mb-4 text-ink-3">Elsewhere</p>
            <ul className="space-y-2.5">
              {social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="ui text-ink-2 transition-colors hover:text-ink"
                    rel="noreferrer"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Grid>

        {/* Legal. DELIBERATELY STILL — see the note at the top of this file.
            This is the last block on the page, so there is no scroll left for a
            range to complete in: measured, an element down here finishes a
            40px travel with 38px still to go. A permanently half-arrived
            copyright line is worse than a stationary one. */}
        {/* Legal */}
        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-ink-3">© {new Date().getFullYear()} Norrin</p>
          {/* Was `.label` — an 18-word sentence in 11px uppercase mono at 0.14em,
              wrapping to three lines, while the addresses above it are set in sans.
              `.label` is for indices, units and telemetry, not for prose. */}
          <p className="caption max-w-[62ch] text-ink-3">
            Speculative redesign concept — not affiliated with or endorsed by Norrin. Built from
            publicly available information.
          </p>
        </div>
      </Container>
    </footer>
  )
}
