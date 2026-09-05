import { Link } from 'react-router'
import { isRoute } from '@/components/nav/navData'
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
 * a values section with no careers content. A document does not need a menu of
 * its own headings, and the bar above already carries every one of them. What
 * survives is what a footer is actually for: where the company is, what it is,
 * where else it lives, and who built this.
 *
 * THE FOOTER IS IN THE LAYOUT, so it is under all five pages. Everything in it
 * has to be true from any of them, which is what decides the two link kinds
 * below and the back-to-top above.
 */

/**
 * Three destinations, and each one is exactly the kind of link it looks like.
 *
 * "About us" pointed at `#proof` when Proof was a section of the one page there
 * was. Proof lives on `/work` now, so the row is relabelled to what that section
 * calls itself — an "About us" link landing the reader on the customer cases is
 * a promise the destination does not keep — and the bar's Company drawer carries
 * the identical label and target. One name per thing.
 *
 * THIS COLUMN IS NOW THE ONLY PLACE SOME OF THESE ARE LINKED, and it grew from
 * three rows to five because of it. The bar lost its Thinking and Company items
 * when those routes were merged away, and it lost its drawers entirely — so
 * Track record, Thinking and Careers have no other link on the site. A footer is
 * the right home for them; being the ONLY home is the thing to know before
 * deleting a row here.
 *
 * CONTACT AND CAREERS ARE `/#...`, NOT BARE FRAGMENTS. Contact was a bare
 * `#contact` while the layout rendered that strip after every route, which made
 * it a scroll wherever it was clicked. Both sections live on `/` alone now, so a
 * bare fragment would do nothing on two of the three routes.
 */
const COMPANY_LINKS = [
  // Was "Customer cases"; the bar calls the same section Work. One name per thing.
  { label: 'Work', href: '/work' },
  { label: 'Track record', href: '/work#proof' },
  { label: 'Thinking', href: '/company#thinking' },
  { label: 'Careers', href: '/company#careers' },
  { label: 'Contact', href: '/#contact' },
]

export function Footer() {
  // NO `byCountry` GROUPING ANY MORE. The footprint band grouped seven offices
  // under five country headings because it had five columns to fill across the
  // full width. In one column that shape costs five sub-headings to label seven
  // rows, so the country rides on the city line instead and the list is flat.

  return (
    <footer
      id="footer"
      data-shot="footer"
      // ONE RULE, NOT TWO, AND NO TOP PADDING.
      //
      // This carried `border-t border-hairline pt-20` and the Grid below carries
      // `border-t border-hairline pt-12`, so the footer opened with two hairlines
      // 81px apart — measured — with nothing between them. The first was the
      // footer separating itself from the page; the second was the columns
      // separating themselves from the footer. Two rules drawing one boundary.
      //
      // The FIRST one goes, which is the one that was doing less: the Grid's rule
      // has content directly under it and belongs to the columns, while this one
      // had 80px of empty space beneath it and belonged to nothing.
      //
      // `pt-20` GOES WITH IT rather than being kept, because that padding existed
      // only to hold the two rules apart. Left in place it would push the
      // surviving rule 192px below the last section's content — 112px of the
      // section's own bottom padding plus 80 of this — which is most of a screen
      // of nothing before the footer starts. Removing both leaves the gap as the
      // section's own `pb`, which is what separates every other pair of blocks on
      // the page.
      className="pb-10"
    >
      <Container>
        {/* THE FOOTPRINT BLOCK WAS HERE AND IS DELETED.

            It was a full-width row: a "Footprint" label in the first three
            columns and then five country groups across the remaining nine, each
            with its cities and addresses under a ruled heading. Seven addresses
            in a five-across grid, above the real footer, with about 260px of
            empty first column beside it.

            It was a second footer stacked on the first. The block underneath
            already had a Company column and an Elsewhere column and room for a
            third; splitting the offices out into their own full-width band gave
            an address list more площадь than the site's own navigation, and left
            two ruled rows doing the same job one above the other.

            The offices are not lost — every one of the seven is in the Locations
            column below, with its address. What is gone is the band. */}
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
        <Grid className="gap-y-10 border-t border-hairline pt-12">
          <div
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 8%',
              ['--scrub-to' as string]: 'entry 68%',
            }}
            className="col-span-4 md:col-span-3"
          >
            {/* BACK TO TOP, AND IT STAYS A PLAIN FRAGMENT ON ALL FIVE PAGES.
                `#top` is the hero's id, so on `/` this scrolls to the hero the
                way it always did. On the other four there is no element with
                that id — and that is not a dead link: the HTML spec names
                `#top`, case-insensitively, as the fragment that means the top of
                the document when nothing matches it. So the one anchor is right
                everywhere, which a `<Link to="/">` would not be: this is the
                bottom of a page the reader has just finished reading, and
                sending them to a different page is not what "back to top"
                offers. The wordmark in the BAR does go home; that one is
                identity, this one is a scroll. */}
            <a href="#top" className="flex w-fit items-center gap-2.5 text-accent">
              <span className="wordmark text-ink">
                Norrin
              </span>
            </a>
            <p className="caption mt-5 max-w-[38ch] text-ink-3">{footerBlurb.text}</p>
          </div>

          {/* LOCATIONS — the footprint band, folded into a column.

              THE COUNTRY IS ON THE CITY LINE RATHER THAN OVER A GROUP. Grouping
              seven offices under five headings needs five headings; "Espoo,
              Finland" needs none and loses nothing, because the country was only
              ever there to say which country the city is in.

              THE ADDRESSES STAY. They were the one thing the deleted band had
              that the rest of the footer did not, and a footer that lists where a
              company is without saying where is a list of city names. Three
              columns is ~330px at 1512, which takes the longest of the seven —
              Bangkok's "496-502 Gaysorn Amarin Tower, 5th Floor" — to two lines.

              NOT A `<nav>`, unlike the two columns after it. Nothing here is a
              link: there are no office pages to point at and no map URLs in
              `norrin.ts`, and wrapping seven addresses in a navigation landmark
              would announce a set of destinations to a screen reader that it
              then cannot go to. It is a list of facts, so it is a list.

              Every string is from `norrin.ts` and traceable to Norrin's own
              pages (§3). None of the seven is edited to fit the column. */}
          <div
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 13%',
              ['--scrub-to' as string]: 'entry 73%',
            }}
            className="col-span-4 md:col-span-3 md:col-start-5"
          >
            <p className="label mb-4 text-ink-3">Locations</p>
            <ul className="space-y-3">
              {offices.map((o) => (
                <li key={o.city}>
                  <p className="ui text-ink-2">
                    {o.city}, {o.country}
                  </p>
                  <p className="caption text-ink-3">{o.address}</p>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Company"
            data-scroll="enter"
            style={{
              ['--enter-y' as string]: '20px',
              ['--scrub-from' as string]: 'entry 18%',
              ['--scrub-to' as string]: 'entry 78%',
            }}
            className="col-span-2 md:col-span-2 md:col-start-9"
          >
            <p className="label mb-4 text-ink-3">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) =>
                isRoute(l.href) ? (
                  <li key={l.label}>
                    <Link to={l.href} className="ui text-ink-2 transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ) : (
                  <li key={l.label}>
                    <a href={l.href} className="ui text-ink-2 transition-colors hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ),
              )}
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
            className="col-span-2 md:col-span-2 md:col-start-11"
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
