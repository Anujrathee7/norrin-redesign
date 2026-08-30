import { useState } from 'react'
import { Container } from '@/components/primitives/Layout'
import { LocaleMenu } from '@/components/primitives/LocaleMenu'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { cx } from '@/lib/cx'
import { NAV, type NavItem } from './navData'

/** Wordmark. Held at `production` — the mark must read at 26px in every state. */
export function Wordmark({ inverted }: { inverted: boolean }) {
  return (
    <a
      href="#top"
      className={cx(
        'flex w-fit shrink-0 items-center gap-2.5 transition-colors duration-500',
        inverted ? 'text-signal' : 'text-accent',
      )}
    >
      <span
        className={cx(
          'wordmark transition-colors duration-500',
          inverted ? 'text-inverse-ink' : 'text-ink',
        )}
      >
        Norrin
      </span>
      <span className="sr-only">Norrin — home</span>
    </a>
  )
}

export function ContactButton({ inverted }: { inverted: boolean }) {
  return (
    <a
      href="#contact"
      // A colour swap, not an opacity fade: fading the page's most emphatic
      // colour makes the signal go muddy under the pointer, which is backwards.
      // Both swaps now live in .btn-signal / .btn-solid rather than as two raw
      // hexes in two files that could not see each other.
      className={cx('btn btn-sm', inverted ? 'btn-signal' : 'btn-solid')}
    >
      Contact
    </a>
  )
}

/**
 * The current item's length of the bar's bottom rule.
 *
 * This replaces a 3px square that floated in the dead space above the rule and
 * read as a speck. Sitting *on* the rule, it is the production line doing
 * wayfinding — and when a drawer is open it is what the drawer hangs from, so
 * the pop-out is visibly attached to the word that opened it.
 */
export function RuleSegment({ show, inverted }: { show: boolean; inverted: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute inset-x-0 -bottom-px h-px transition-opacity duration-300',
        inverted ? 'bg-signal' : 'bg-accent',
        show ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}

/**
 * The drawer.
 *
 * Not a panel over the page — the header temporarily getting taller. It shares
 * the bar's ground, takes the bar's own `border-b` as its top edge, and aligns
 * its rows to the same `Container` the bar uses, so nothing about it reads as a
 * card. Rows are the hero stat table's idiom: name left, mono metadata right,
 * hairline between. Hovering completes that hairline in moss, left to right —
 * the page's production line at its smallest scale.
 *
 * One drawer per bar rather than one per item, so moving between menus resizes
 * a thing that is already open instead of hard-cutting between two panels.
 */
export function Drawer({
  item,
  inverted,
  onNavigate,
  onFocusTrigger,
  onExitForward,
}: {
  item: NavItem | null
  inverted: boolean
  onNavigate: () => void
  /** Shift+Tab off the first row goes back to the word that opened the drawer. */
  onFocusTrigger: () => void
  /** Tab off the last row closes and carries on to the next item in the bar. */
  onExitForward: () => void
}) {
  // Held so the content does not vanish before the height finishes collapsing.
  // Adjusted during render rather than in an effect, so the content and the open
  // state land in the same commit — an effect would leave the drawer animating
  // open around an empty box for a frame.
  const [lastItem, setLastItem] = useState<NavItem | null>(null)
  const open = !!item?.children
  if (open && item !== lastItem) setLastItem(item)
  const shown = open ? item : lastItem

  return (
    <div
      id="nav-drawer"
      inert={!open}
      className={cx(
        'hidden overflow-hidden transition-[grid-template-rows] duration-200 ease-(--ease-entrance) lg:grid',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        inverted ? 'bg-inverse' : 'bg-ground',
      )}
    >
      <div className="min-h-0">
        {shown?.children ? (
          <>
            <Container>
              {/* Bounded, like the hero's stat table. Run the rows the full width of
                  the bar and the name loses all relationship with its metadata across
                  a thousand pixels of nothing; the full-bleed rule below still
                  terminates the drawer. */}
              <ul className="max-w-[46rem] pt-1 pb-3">
                {shown.children.map((child, i, rows) => (
                  <li key={child.label}>
                    <a
                      href={child.href}
                      onClick={onNavigate}
                      onKeyDown={(e) => {
                        if (e.key !== 'Tab') return
                        if (e.shiftKey && i === 0) {
                          e.preventDefault()
                          onFocusTrigger()
                        } else if (!e.shiftKey && i === rows.length - 1) {
                          e.preventDefault()
                          onExitForward()
                        }
                      }}
                      className={cx(
                        'group/row relative grid grid-cols-[1fr_auto] items-baseline gap-8 border-b py-[0.875rem]',
                        inverted ? 'border-inverse-hairline' : 'border-hairline',
                      )}
                    >
                      <span
                        className={cx(
                          'ui transition-colors duration-200',
                          inverted
                            ? 'text-inverse-ink-2 group-hover/row:text-inverse-ink group-focus-visible/row:text-inverse-ink'
                            : 'text-ink group-hover/row:text-accent group-focus-visible/row:text-accent',
                        )}
                      >
                        {child.label}
                      </span>
                      {child.note ? (
                        <span
                          className={cx(
                            'label whitespace-nowrap',
                            inverted ? 'text-inverse-ink-3' : 'text-ink-3',
                          )}
                        >
                          {child.note}
                        </span>
                      ) : null}
                      {/* The rule completing. Reduced motion snaps it to full via the
                          global duration override, so the state never depends on movement. */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-[280ms] ease-(--ease-entrance) group-hover/row:scale-x-100 group-focus-visible/row:scale-x-100',
                          inverted ? 'bg-signal' : 'bg-accent',
                        )}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
            {/* Full-bleed, like every other divider on the page: it terminates the
                drawer without drawing a box around it. */}
            <div
              aria-hidden="true"
              className={cx('h-px w-full', inverted ? 'bg-inverse-hairline-strong' : 'bg-hairline-strong')}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

export function Hamburger({
  open,
  inverted,
  onClick,
  controls,
}: {
  open: boolean
  inverted: boolean
  onClick: () => void
  controls: string
}) {
  return (
    <button
      // The one control on the page that had no padding: a bare 26px icon, so a
      // 26px tap target on the viewport where every target is a thumb. The
      // negative margin keeps the glyph on the same optical edge it was already
      // on, so this buys 16px of target and moves nothing.
      className={cx(
        'control -mr-2 justify-self-end p-2 lg:hidden',
        inverted ? 'text-inverse-ink' : 'text-ink',
      )}
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
export function MobileSheet({ onNavigate, barHeight = 72 }: { onNavigate: () => void; barHeight?: number }) {
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
                <a href={item.href} onClick={onNavigate} className="display-3 block">
                  {item.label}
                </a>
                {item.children ? (
                  <ul className="mt-3 space-y-2.5">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <a href={c.href} onClick={onNavigate} className="text-ink-2">
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={onNavigate}
            className="btn btn-solid btn-block mt-8"
          >
            Contact
          </a>
          {/* Was desktop-only, which quietly stranded four of five languages.
              The theme joins it on the same terms and for the same reason: the
              toggle lives in the desktop utilities row, which is `hidden` below
              lg, so without this the entire phone audience is locked to the
              default with no way out of it. Two rows, one rule between them —
              the ruled-table idiom the hero stats and the drawer both use. */}
          <div className="mt-8 divide-y divide-hairline border-t border-hairline">
            <div className="flex items-center justify-between py-4">
              <span className="label text-ink-3">Language</span>
              <LocaleMenu />
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="label text-ink-3">Appearance</span>
              {/* The sheet is always on paper — it sets `bg-ground` itself and
                  never inverts — so no `inverted` here, unlike the bar's copy. */}
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  )
}
