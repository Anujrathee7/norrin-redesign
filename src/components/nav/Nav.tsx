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
    inverted,
    scrolled,
    solid,
    currentSection,
  } = useNavState(BAR_HEIGHT)

  /* The condensed height, as a STATE rather than a scrub. See the long note in
     index.css where `condense` used to be declared: driving this from an
     animated custom property into `height: calc()` ran style, layout and paint
     on the whole header subtree every frame of the first 220px of scroll, which
     is the hero and nothing else.

     `scrolled` and not `solid`. They differ, and the difference matters: `solid`
     is also true when a drawer or the mobile sheet is open, and opening a menu
     must not make the bar it is hanging from shrink underneath it. */
  const rowHeight = scrolled ? BAR_HEIGHT - 16 : BAR_HEIGHT

  return (
    <header
      ref={rootRef}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu()
      }}
      // The bar declares its tone. Without this, `[data-tone='inverse']
      // :focus-visible` never matched inside the header, so tabbing through the
      // nav while it sat over a forest band drew a MOSS ring — 1.40:1, which is
      // to say no ring at all. axe does not automate focus-indicator contrast,
      // so every clean audit run to date was silent about it.
      data-tone={inverted ? 'inverse' : undefined}
      // The bar condenses once the page has moved, and deliberately does NOT
      // touch its own bottom rule: that rule already encodes which section you
      // are reading, and two meanings on one line is one too many.
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cx(
          'transition-colors duration-500 ease-(--ease-ui)',
          // Opaque, never frosted: this system carries separation on hairlines and
          // bans glassmorphism, so a blurred bar would break its own rule.
          solid
            ? inverted
              ? 'border-b border-inverse-hairline-strong bg-inverse'
              : 'border-b border-hairline bg-ground'
            : 'border-b border-transparent',
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
            <Wordmark inverted={inverted} />

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
                          className={cx('control px-3.5 py-2 ui', tone(inverted, isCurrent || isOpen))}
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
                          className={cx('control block px-3.5 py-2 ui', tone(inverted, isCurrent))}
                        >
                          {item.label}
                        </a>
                      )}
                      <RuleSegment show={isCurrent || isOpen} inverted={inverted} />
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
              <ThemeToggle inverted={inverted} />
              <LocaleMenu inverted={inverted} />
              <ContactButton inverted={inverted} />
            </div>
            <Hamburger
              open={mobileOpen}
              inverted={inverted}
              controls="mobile-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
            />
          </div>
        </Container>
      </div>

      <Drawer
        item={NAV.find((i) => i.label === openItem) ?? null}
        inverted={inverted}
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

function tone(inverted: boolean, isCurrent: boolean) {
  return cx(
    'transition-colors duration-200',
    inverted
      ? isCurrent
        ? 'text-inverse-ink'
        : 'text-inverse-ink-2 hover:text-inverse-ink'
      : isCurrent
        ? 'text-ink'
        : 'text-ink-2 hover:text-ink',
  )
}
