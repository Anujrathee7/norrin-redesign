import { Container } from '@/components/primitives/Layout'
import { LocaleMenu } from '@/components/primitives/LocaleMenu'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { cx } from '@/lib/cx'
import { NAV } from './navData'
import { ContactButton, Drawer, Hamburger, MobileSheet, RuleSegment, Wordmark } from './NavParts'
import { useNavState } from './useNavState'

/**
 * The navbar.
 *
 * Four directions were built and compared on the real page behind `?nav=1..4`.
 * This one won: logo left, links optically centred via a 1fr/auto/1fr grid,
 * utilities right, and the current section marked by its own length of the
 * bar's bottom rule.
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

const BAR_HEIGHT = 72

export function Nav() {
  const {
    rootRef,
    openItem,
    canHover,
    openMenu,
    closeMenu,
    scheduleClose,
    cancelClose,
    activateTrigger,
    registerTrigger,
    focusTrigger,
    exitForward,
    mobileOpen,
    setMobileOpen,
    scrolled,
    edged,
    currentSection,
  } = useNavState()

  /* The condensed height, as a STATE rather than a scrub. See the long note in
     index.css where `condense` used to be declared: driving this from an
     animated custom property into `height: calc()` ran style, layout and paint
     on the whole header subtree every frame of the first 220px of scroll, which
     is the hero and nothing else.

     `scrolled` and not `edged`. They differ, and the difference matters:
     `edged` is also true when a drawer or the mobile sheet is open, and opening
     a menu must not make the bar it is hanging from shrink underneath it. */
  const rowHeight = scrolled ? BAR_HEIGHT - 16 : BAR_HEIGHT

  return (
    <header
      ref={rootRef}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu()
      }}
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
      // The bar condenses once the page has moved, and deliberately does NOT
      // touch its own bottom rule: that rule already encodes which section you
      // are reading, and two meanings on one line is one too many.
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
          {/* The row's height is the thing that actually condenses: 72px down
              to 56px, once, on a transition rather than continuously on scroll.

              The `ul` below carries the identical height rather than `h-full`,
              because this row is `items-center` (each grid item aligned to the
              row's midline) and not `items-stretch` — a `h-full` child would
              stay 72px tall regardless of the row shrinking around it.

              A height transition IS layout, and normally this file would refuse
              one. It is allowed here because the header is `position: fixed`, so
              the reflow is contained to its own subtree and never touches the
              document, and because it runs twice per direction change instead of
              on every frame of a 220px scroll band. Under
              `prefers-reduced-motion` the global rule crushes the duration and
              it simply snaps, which is correct. */}
          <div
            style={{ height: rowHeight }}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-[height] duration-300 ease-(--ease-ui) lg:grid-cols-[1fr_auto_1fr]"
          >
            <Wordmark />

            <nav aria-label="Primary" className="hidden justify-self-center lg:block">
              <ul
                style={{ height: rowHeight }}
                className="flex items-center gap-1 transition-[height] duration-300 ease-(--ease-ui)"
              >
                {NAV.map((item) => {
                  const isCurrent = !!currentSection && item.owns.includes(currentSection)
                  const isOpen = openItem === item.label
                  return (
                    <li key={item.label} className="relative flex h-full items-center">
                      {item.children ? (
                        <button
                          ref={(el) => {
                            registerTrigger(item.label, el)
                          }}
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                          aria-controls="nav-drawer"
                          aria-current={isCurrent ? 'true' : undefined}
                          onClick={(e) => activateTrigger(e, item)}
                          onKeyDown={(e) => handoffIntoDrawer(e, isOpen)}
                          onMouseEnter={() => canHover && openMenu(item.label)}
                          className={cx('control px-3.5 py-2 ui', tone(isCurrent || isOpen))}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          ref={(el) => {
                            registerTrigger(item.label, el)
                          }}
                          aria-current={isCurrent ? 'true' : undefined}
                          onMouseEnter={() => canHover && scheduleClose()}
                          className={cx('control block px-3.5 py-2 ui', tone(isCurrent))}
                        >
                          {item.label}
                        </a>
                      )}
                      <RuleSegment show={isCurrent || isOpen} />
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div data-nav-end className="hidden items-center gap-3 justify-self-end lg:flex">
              {/* Left of the locale, not right of it: both are quiet controls
                  and they belong in one group, with the action on the outside.
                  The gap tightened from 4 to 3 because there are three objects
                  in this corner now — at gap-4 the pair read as two separate
                  utilities rather than as a set. */}
              <ThemeToggle />
              <LocaleMenu />
              <ContactButton />
            </div>
            <Hamburger
              open={mobileOpen}
              controls="mobile-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </Container>
      </div>

      <Drawer
        item={NAV.find((i) => i.label === openItem) ?? null}
        onNavigate={closeMenu}
        onFocusTrigger={() => focusTrigger(openItem)}
        onExitForward={() => exitForward(openItem)}
      />
      {mobileOpen ? <MobileSheet onNavigate={() => setMobileOpen(false)} /> : null}
    </header>
  )
}

/** Tab off an open trigger belongs in the drawer, not three items further along. */
function handoffIntoDrawer(e: React.KeyboardEvent, isOpen: boolean) {
  if (e.key !== 'Tab' || e.shiftKey || !isOpen) return
  const first = document.querySelector<HTMLElement>('#nav-drawer a')
  if (!first) return
  e.preventDefault()
  first.focus()
}

/* One ramp, because there is now one ground. The inverse branch went with the
   bar's tone flip: a nav item is always ink on paper (or ink on the dark
   ground), never inverse ink on forest. */
function tone(isCurrent: boolean) {
  return cx('transition-colors duration-200', isCurrent ? 'text-ink' : 'text-ink-2 hover:text-ink')
}
