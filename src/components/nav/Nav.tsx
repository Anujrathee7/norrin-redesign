import { Link } from 'react-router'
import { Container } from '@/components/primitives/Layout'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { cx } from '@/lib/cx'
import { NAV } from './navData'
import { Hamburger, MobileSheet, RuleSegment, Wordmark } from './NavParts'
import { useNavState } from './useNavState'

/**
 * The navbar.
 *
 * Four directions were built and compared on the real page behind `?nav=1..4`.
 * This one won: logo left, links optically centred via a 1fr/auto/1fr grid,
 * utilities right, and the current PAGE marked by its own length of the bar's
 * bottom rule. It marked the current SECTION when the site was one document;
 * the mark is the same, what it reads has moved from an IntersectionObserver's
 * guess to `useLocation().pathname`.
 *
 * The runner-up made the nav items stations on the production line — solid
 * behind you, dashed ahead. It was the only option that could not be lifted
 * onto another site, and it was still wrong: it put a miniature of the page's
 * signature device in the chrome, 200px above the real one, at a size where the
 * state change is a 3px mark nobody can read. Both would have been visible in
 * the hero viewport at once, and the small one would have taught the reader to
 * stop noticing the big one. The boldness belongs in the hero. The bar stays
 * quiet and gets out of the way.
 */

/* ONE HEIGHT, AT THE TOP AND EVERYWHERE ELSE. The bar used to stand 72px tall
   at scroll zero and condense to 56px once the page moved — a height
   transition the repo owner asked to have removed. It is the condensed height
   now, unconditionally: the smaller bar is the one every page was already read
   under, and a header that changes size as you start scrolling is motion in
   the one element that should hold still. */
const BAR_HEIGHT = 56

export function Nav() {
  const { mobileOpen, setMobileOpen, edged, currentPath } = useNavState()
  const rowHeight = BAR_HEIGHT

  return (
    <header
      // NO POINTER OR FOCUS HANDLERS. This element carried `onMouseEnter`,
      // `onMouseLeave` and an `onBlur` that checked `relatedTarget` — the whole
      // hover-intent and focus-containment apparatus for the drawers. The
      // drawers are deleted (see `navData.ts`) and so is all of it: a bar with
      // nothing to open does not need to know when the pointer leaves it.
      //
      // THE BAR NO LONGER DECLARES A TONE, BECAUSE IT NO LONGER HAS ONE TO
      // DECLARE. It used to carry `data-tone="inverse"` while an inverted
      // section was under it, and everything inside — ink, hairline, wordmark,
      // rule segment, focus ring — read that attribute and flipped. The bar had
      // no ground of its own, so it had to become whatever it was standing on.
      //
      // That is a bar whose colour is decided by the section beneath it, and
      // the section beneath it is not a stable thing: the moment Work took a
      // fixed near-black band, the header turned forest green in the middle of
      // the customer cases. The fix is not a better observer, it is a ground —
      // see the `bg-ground` below.
      //
      // What that costs, stated plainly: the header's focused controls lose the
      // `[data-tone='inverse'] :focus-visible` sun substitution and fall back to
      // the moss/lichen ring. That is correct now and is measured, not assumed —
      // the ring is only ever drawn on `--ground`, which is the one pair
      // `L/D accent / ground` that `tools/palette.mjs` has always gated, and
      // `.shots/probe/navground.mjs` reports every control at 8.4:1 or better in
      // both themes. It was NOT correct before, which is why the attribute was
      // put here in the first place.
      //
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cx(
          // ITS OWN GROUND, UNCONDITIONALLY. Opaque, never frosted: this system
          // carries separation on hairlines and bans glassmorphism, so a blurred
          // bar would break its own rule — and a transparent one is worse than
          // either, because it makes every section's ground the header's problem.
          // `bg-ground` is the token, so light and dark are one declaration and
          // no colour is written here (§2.4).
          'bg-ground transition-colors duration-300 ease-(--ease-ui)',
          // The edge, not the ground. See `edged` in useNavState: a rule is
          // drawn only where there is something to separate.
          edged ? 'border-b border-hairline' : 'border-b border-transparent',
        )}
      >
        <Container>
          {/* The `ul` below carries the identical height rather than `h-full`,
              because this row is `items-center` (each grid item aligned to the
              row's midline) and not `items-stretch` — the rule segment under the
              current item has to sit on the bar's bottom edge. */}
          <div
            style={{ height: rowHeight }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]"
          >
            <Wordmark />

            <nav aria-label="Primary" className="hidden justify-self-center lg:block">
              <ul
                style={{ height: rowHeight }}
                className="relative flex items-center gap-1"
              >
                {/* EVERY ITEM IS A LINK, AND THERE IS NO SECOND KIND.
                    Three of the four used to be `<button aria-haspopup>` with a
                    click handler that had to tell a keyboard activation from a
                    mouse one, because on a hover-only trigger the parent page
                    was otherwise unreachable on desktop. That entire branch is
                    gone with the drawers: an item is a page, so it is a link to
                    that page, which is what it always should have been able to
                    be. */}
                {NAV.map((item) => {
                  const isCurrent = item.owns.includes(currentPath)
                  return (
                    <li key={item.label} className="flex h-full items-center">
                      <Link
                        to={item.href}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={cx('control block px-3.5 py-2 ui', tone(isCurrent))}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
                {/* One segment for the whole list, not one per item, so it can
                    travel to the new page instead of blinking between two. */}
                <RuleSegment currentPath={currentPath} />
              </ul>
            </nav>

            <div data-nav-end className="hidden items-center gap-3 justify-self-end lg:flex">
              {/* ONE OBJECT NOW. This corner held three — a locale menu, the
                  theme toggle and a solid Contact button — and the note here
                  used to argue about the gap between them.

                  The locale menu went first, because it listed five languages
                  over one set of strings and a control that changes nothing is
                  the fabricated affordance §3 bans a made-up statistic for.
                  `LocaleMenu.tsx` is still in the repo for when translations are
                  real. Contact went second, on the repo owner's call: the ask
                  lives on the home page and in the footer, and the bar stops
                  carrying a standing solicitation over every route.

                  What is left is the one real preference on the site, and the
                  `gap-3` is now moot with a single child — kept only so the row
                  does not have to be rebuilt when something joins it. */}
              <ThemeToggle />
            </div>
            <Hamburger
              open={mobileOpen}
              controls="mobile-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </Container>
      </div>

      {/* The bar's height is passed rather than left to the sheet's default,
          which was 72 and would have left the sheet 16px short of the viewport
          floor under a 56px bar. */}
      {mobileOpen ? <MobileSheet barHeight={BAR_HEIGHT} /> : null}
    </header>
  )
}

/* One ramp, because there is now one ground. The inverse branch went with the
   bar's tone flip: a nav item is always ink on paper (or ink on the dark
   ground), never inverse ink on forest.

   It took `isCurrent || isOpen` before. There is no open state to fold in. */
function tone(isCurrent: boolean) {
  return cx('transition-colors duration-200', isCurrent ? 'text-ink' : 'text-ink-2 hover:text-ink')
}
