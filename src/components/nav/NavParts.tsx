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
 * It was `#top`, which was a scroll to the top of the one page there was. Home
 * is a route now, and a wordmark that scrolls instead of going home on four of
 * five pages would be the only broken thing in the bar.
 */
export function Wordmark() {
  return (
    <Link to="/" className="flex w-fit shrink-0 items-center gap-2.5 text-accent">
      <span className="wordmark text-ink">Norrin</span>
      <span className="sr-only">Norrin — home</span>
    </Link>
  )
}

export function ContactButton() {
  return (
    // A NAVIGATION NOW, NOT A SCROLL, and the change is forced rather than
    // preferred. This was `href="#contact"` while the Contact strip was
    // rendered in `SiteLayout` after every route — the target was on whatever
    // page you were already on, so a fragment was the honest kind of link.
    //
    // Contact lives on `/` alone now, so a bare `#contact` would resolve to
    // nothing from the other two routes: a control that scrolls somewhere on one
    // page and does nothing on the rest. §3 has no patience for that, so it says
    // what it does — it goes to the home page, at the ask.
    <Link
      to="/#contact"
      // `.btn-solid` in both themes and at every scroll position. It used to
      // swap to `.btn-signal` while the bar was inverted, which was the right
      // call on a forest bar and is meaningless on a bar that is always the
      // page's own ground. The hover swap it was really about — a colour swap
      // rather than an opacity fade, so the page's most emphatic colour does not
      // go muddy under the pointer — still lives in `.btn-solid` itself.
      className="btn btn-sm btn-solid"
    >
      Contact
    </Link>
  )
}

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
          {/* `/#contact`, for the reason `ContactButton` above sets out at
              length: Contact is a section of `/` now, not of every page. */}
          <Link to="/#contact" className="btn btn-solid btn-block mt-8">
            Contact
          </Link>
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
