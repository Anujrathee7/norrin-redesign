import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { Container } from '@/components/primitives/Layout'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { cx } from '@/lib/cx'
import { NAV, isRoute } from './navData'

/**
 * A nav destination, rendered as whatever it actually is.
 *
 * `<Link>` for a route, a plain `<a>` for a bare fragment. Not a stylistic
 * choice: a `<Link>` to `#contact` would push a router location for a scroll
 * that never left the page, and an `<a href="/work">` would reload the whole
 * document — the exact full-page flash this split was supposed to remove. One
 * component so the call sites below stop having to remember which is which.
 */
function NavLink({ href, ...rest }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  return isRoute(href) ? <Link to={href} {...rest} /> : <a href={href} {...rest} />
}

/**
 * Wordmark. Held at `production` — the mark must read at 26px in every state.
 *
 * IT IS NOT A LINK, AND THAT IS DELIBERATE RATHER THAN AN OMISSION.
 *
 * It has been two things already: `#top`, a scroll to the top of the one page
 * there was, and then `<Link to="/">` once home became a route. It is now plain
 * text, because the bar carries an explicit Home item and a wordmark that goes
 * home beside a link that goes home is one destination wearing two controls.
 *
 * The convention it declines is a real one — a clickable logo is what most
 * readers reach for — so the replacement has to be visible rather than implied,
 * which is exactly what a first nav item labelled Home is. What is NOT
 * acceptable is the middle state: a mark that looks pressable and is not is the
 * fabricated affordance §3 bans. So the anchor, the `text-accent`, the focus
 * ring and the screen-reader "home" label all go with the link — nothing here
 * offers an interaction any more, and a `<div>` cannot be tabbed to.
 *
 * THE MARK IS NORRIN'S, NOT OURS. It is the path from their own favicon,
 * norrin.com/hubfs/theme-2025/favicon/norrin-favicon.svg (the same file served
 * as this site's tab icon, see `index.html`), with its white tile dropped and the
 * viewBox cropped to the strokes. It fills with `currentColor` so it follows the
 * theme like the word does, which keeps the colour in the token layer (§2.4).
 * `aria-hidden` because the word beside it already says Norrin; a labelled
 * picture there would announce the name twice.
 */
export function Wordmark() {
  return (
    <div className="flex w-fit shrink-0 items-center gap-2 text-ink">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="126 59 273 394"
        className="h-[1.375rem] w-auto shrink-0"
        fill="currentColor"
      >
        <path d="m130.19 337.68h67.3v-3.08c-3.08-10.28-5.14-34.42-5.14-57.02v-177.24h9.25c41.1 0 73.46 19 88.36 38.01h3.6v-61.65c-17.98-8.22-60.1-13.35-92.98-13.35h-70.38v3.08c3.08 10.28 5.14 34.42 5.14 57.02v154.11c0 22.6-2.05 46.75-5.14 57.02v3.08zm101.2 110.96h67.29v-3.08c-3.08-10.28-5.14-34.42-5.14-57.02v-177.23h9.25c41.1 0 73.46 19 88.36 38.01h3.59v-61.65c-17.98-8.22-60.1-13.35-92.98-13.35h-70.38v3.08c3.08 10.28 5.14 34.42 5.14 57.02v154.11c0 22.6-2.05 46.75-5.14 57.02v3.08z" />
      </svg>
      <span className="wordmark">Norrin</span>
    </div>
  )
}

/* THE CONTACT BUTTON LIVED HERE and is deleted rather than hidden.

   It was the bar's one solid call to action, and it had just been rewritten
   from `#contact` to `/#contact` because Contact stopped being in the layout
   and became a section of `/` alone.

   Removing it is a decision about the bar rather than about Contact: the ask is
   still on the home page, still the last thing on it, and still linked from the
   footer's Company column. What the bar no longer does is carry a standing
   solicitation over every page — which is the same argument that took the
   drawers out, applied to the loudest object in the chrome.

   The mobile sheet's copy went with it, for the reason that matters more than
   symmetry: a sheet that offers Contact while the bar it belongs to does not is
   two different navigations on one site. */

/**
 * The current item's length of the bar's bottom rule.
 *
 * This replaces a 3px square that floated in the dead space above the rule and
 * read as a speck. Sitting *on* the rule, it is the production line doing
 * wayfinding.
 *
 * It used to double as the thing an open drawer hung from, so the pop-out read
 * as attached to the word that opened it. There are no drawers, so it says one
 * thing: this is the page you are on.
 */
export function RuleSegment({ show }: { show: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute inset-x-0 -bottom-px h-px bg-accent transition-opacity duration-300',
        show ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}

/* THE DRAWER LIVED HERE, and it is deleted rather than parked. It was a
   full-width pop-out sharing the bar's ground and Container, with rows in the
   hero stat table's idiom, a hairline completing in moss on hover, an `inert`
   collapsed state, a held `lastItem` so content did not vanish mid-collapse,
   and focus hand-off at both edges so tab order read trigger, rows, next item.

   None of that was wrong. It had nothing left to disclose: see `navData.ts`.
   Keeping it behind a flag would be keeping a disclosure widget's focus
   management warm for a menu that may never return, and if one does it will be
   a Radix primitive under §2.1 rather than this. `NavItem.children` went with
   it, which is why nothing can construct one any more. */

export function Hamburger({
  open,
  onClick,
  controls,
}: {
  open: boolean
  onClick: () => void
  controls: string
}) {
  return (
    <button
      // The one control on the page that had no padding: a bare 26px icon, so a
      // 26px tap target on the viewport where every target is a thumb. The
      // negative margin keeps the glyph on the same optical edge it was already
      // on, so this buys 16px of target and moves nothing.
      className="control -mr-2 justify-self-end p-2 text-ink lg:hidden"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <path
          d={open ? 'M7 7 L19 19 M19 7 L7 19' : 'M5 9 H21 M5 17 H21'}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </button>
  )
}

/** Shared by every variant — the phone experience does not need four takes. */
export function MobileSheet({ barHeight = 72 }: { barHeight?: number }) {
  return (
    <div
      id="mobile-nav"
      style={{ height: `calc(100dvh - ${barHeight}px)` }}
      className="overflow-y-auto border-t border-hairline bg-ground text-ink lg:hidden"
    >
      <Container>
        <nav aria-label="Primary mobile" className="py-6">
          <ul className="divide-y divide-hairline">
            {NAV.map((item) => (
              <li key={item.label} className="py-5">
                {/* NO `onClick` CLOSING THE SHEET, AND NO SUB-LIST UNDER IT.
                    The sub-list is gone with the drawers it mirrored. The
                    handler is gone because closing on click is one handler per
                    row that is silently wrong for every other way of leaving the
                    page — `useNavState` closes the sheet when the pathname
                    changes, which covers a row, the Contact button, and the
                    browser's own back button alike. */}
                <NavLink href={item.href} className="display-3 block">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ONE ROW, NOT TWO. A Language row sat above this one, added here
              because the desktop utilities row is `hidden` below lg and without
              it the entire phone audience was locked out of the locale menu.
              The menu itself is gone from both — it listed five languages over
              one set of strings, and a control that changes nothing is the same
              fabricated affordance §3 bans a made-up number for — so the row
              that existed to reach it went with it. `LocaleMenu.tsx` stays in
              the repo for when the translations are real, and this row comes
              back with it.

              The theme toggle keeps the argument that put it here: it is the one
              real preference on the site, and leaving it desktop-only locks
              every phone reader to the default with no way out. The ruled-table
              idiom stays too — it is what the hero stats are built from, and a
              single row is still a row in a table. */}
          <div className="mt-8 border-t border-hairline">
            <div className="flex items-center justify-between py-4">
              <span className="label text-ink-3">Appearance</span>
              {/* The sheet sets `bg-ground` itself, which is now the same thing
                  the bar does — so this and the bar's copy are finally the same
                  control on the same ground. */}
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  )
}
