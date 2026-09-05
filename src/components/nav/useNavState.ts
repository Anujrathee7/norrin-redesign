import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { NAV } from './navData'

/**
 * Everything every navbar variant needs to know, in one place: whether the page
 * has scrolled, which page is being read, and which drawer is open.
 *
 * This began as shared plumbing for four competing bars. Three are gone; the
 * hook stays split out because the observers and the hover-intent timers are
 * the part worth reading on their own.
 *
 * IT NO LONGER WATCHES WHAT IS UNDERNEATH IT, and that is the point. A fourth
 * observer used to query `[data-tone="inverse"]`, collapse the viewport to a
 * band the height of the bar, and flip the whole header's palette to forest
 * whenever a dark section crossed it. That was a bar with no ground of its own,
 * adapting to every plane it passed over — so the moment Work took a fixed
 * near-black band the header started turning green in the middle of the
 * customer section, which is what got it removed.
 *
 * The bar now paints its own `--ground` and stops asking. `data-tone="inverse"`
 * stays on the SECTIONS: it still drives the sun focus-ring substitution, the
 * inverse ink sets, `tools/audit.mjs` and `tools/shot.mjs`. Nothing about it was
 * for the nav except this observer.
 *
 * A SECOND OBSERVER HAS GONE THE SAME WAY, for a better reason: it has nothing
 * left to observe. The current-item marker used to be driven by an
 * IntersectionObserver over `main section[id]`, taking the topmost section
 * crossing a band 20% down the viewport and matching its id against each item's
 * `owns` list. That was an INFERENCE about which page the reader was on, made
 * from geometry, on a document where all five pages were stacked in one scroll.
 * The pages are five routes now, so the answer is `useLocation().pathname` —
 * known exactly, correct on first paint rather than after the first scroll
 * event, and with no band to be caught between two sections in.
 */

/** Long enough that crossing the nav on the way to Contact doesn't open anything. */
const OPEN_DELAY = 80
/** Short grace on leaving, so a pointer clipping the edge doesn't collapse the drawer. */
const CLOSE_DELAY = 140

type Trigger = { label: string; href: string }

export function useNavState() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  /** Assume a mouse until told otherwise: the desktop bar is hidden below `lg` anyway. */
  const [canHover, setCanHover] = useState(true)

  const rootRef = useRef<HTMLElement>(null)
  const triggerEls = useRef(new Map<string, HTMLElement | null>())
  const openRef = useRef<string | null>(null)
  const openTimer = useRef(0)
  const closeTimer = useRef(0)

  useEffect(() => {
    openRef.current = openItem
  }, [openItem])

  /* ── pointer capability ───────────────────────────────────────────────────
     A hover menu on a touch screen is a trap, and on a touch-capable laptop the
     parent destinations have to stay reachable. Everything below branches on it. */
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const read = () => setCanHover(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])

  /* ── open / close ────────────────────────────────────────────────────────
     The drawer is full-bleed and sits directly under the bar, so there is no
     diagonal for the pointer to fall off and no safe-triangle geometry to write.
     Two timers are the whole of the hover intent. */

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    openTimer.current = 0
    closeTimer.current = 0
  }, [])

  const closeMenu = useCallback(() => {
    clearTimers()
    setOpenItem(null)
  }, [clearTimers])

  const openMenu = useCallback((label: string) => {
    window.clearTimeout(closeTimer.current)
    window.clearTimeout(openTimer.current)
    closeTimer.current = 0
    // Already open: move between items with no delay, so the nav feels like one
    // control rather than four that each have to be waited out.
    if (openRef.current) {
      openTimer.current = 0
      setOpenItem(label)
      return
    }
    openTimer.current = window.setTimeout(() => setOpenItem(label), OPEN_DELAY)
  }, [])

  const scheduleClose = useCallback(() => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    openTimer.current = 0
    closeTimer.current = window.setTimeout(() => setOpenItem(null), CLOSE_DELAY)
  }, [])

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = 0
  }, [])

  const toggleMenu = useCallback(
    (label: string) => {
      clearTimers()
      setOpenItem((prev) => (prev === label ? null : label))
    },
    [clearTimers],
  )

  /** Held so focus can be handed to and from the drawer. */
  const registerTrigger = useCallback((label: string, el: HTMLElement | null) => {
    triggerEls.current.set(label, el)
  }, [])

  const focusTrigger = useCallback((label: string | null) => {
    if (label) triggerEls.current.get(label)?.focus()
  }, [])

  /**
   * Tab out of the last row.
   *
   * One drawer serves every item, so it cannot sit next to the trigger in the
   * DOM the way a per-item panel would — which is exactly what normally puts a
   * shared mega-menu's contents at the wrong end of the tab order. Handing focus
   * on at both edges restores the order a disclosure is supposed to have:
   * trigger, its rows, then the next item in the bar.
   */
  const exitForward = useCallback(
    (label: string | null) => {
      clearTimers()
      setOpenItem(null)
      const i = NAV.findIndex((n) => n.label === label)
      const next = i >= 0 ? NAV[i + 1] : undefined
      const el = next
        ? triggerEls.current.get(next.label)
        : rootRef.current?.querySelector<HTMLElement>('[data-nav-end] button, [data-nav-end] a')
      el?.focus()
    },
    [clearTimers],
  )

  /**
   * What a click on a parent item means depends on how it was made.
   *
   * `detail === 0` is a keyboard activation, where a disclosure must toggle —
   * navigating on Enter would close the drawer the same keypress just opened.
   * A real mouse click on a hover-capable pointer navigates instead, because
   * otherwise `/what-we-do`, `/thinking` and `/company` are unreachable on
   * desktop: the trigger is a button, and hovering is the only thing that ever
   * opened it.
   *
   * `navigate()` AND NOT `window.location.hash`. The destinations are routes
   * now, and assigning to `location.hash` with a path in it would have written
   * `#/what-we-do` into the URL — a fragment matching no element, on the page
   * the reader was already on. The router also has to be the one that moves, or
   * the bar's own current-item marker is reading a pathname nothing updated.
   */
  const activateTrigger = useCallback(
    (e: { detail: number }, item: Trigger) => {
      if (e.detail === 0 || !canHover) {
        toggleMenu(item.label)
        return
      }
      clearTimers()
      setOpenItem(null)
      void navigate(item.href)
    },
    [canHover, clearTimers, navigate, toggleMenu],
  )

  useEffect(() => clearTimers, [clearTimers])

  /* ── scroll ──────────────────────────────────────────────────────────────
     The last listener in here. This was "observers", plural, when the current
     item was also inferred from geometry; the only thing left that genuinely
     has to be measured is whether the page has moved at all. */

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const open = openRef.current
      if (open) {
        clearTimers()
        setOpenItem(null)
        // Escape must not strand focus inside a drawer that is closing.
        triggerEls.current.get(open)?.focus()
      }
      setMobileOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeMenu()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [clearTimers, closeMenu])

  // The mobile sheet and the full-screen menu are the only things that lock scroll.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return {
    rootRef,
    openItem,
    canHover,
    openMenu,
    closeMenu,
    toggleMenu,
    scheduleClose,
    cancelClose,
    activateTrigger,
    registerTrigger,
    focusTrigger,
    exitForward,
    mobileOpen,
    setMobileOpen,
    scrolled,
    /** The route the reader is on. Compared against each item's `owns`. */
    currentPath: pathname,
    /**
     * Whether the bar draws its bottom hairline.
     *
     * This was `solid`, back when it also decided whether the bar had a
     * background at all. The bar is opaque unconditionally now, so the only
     * thing left for this flag to say is whether there is an EDGE — and an edge
     * is only true where there is something to separate: content that has
     * travelled under the bar, or a drawer hanging off it. At rest over the
     * hero the bar and the page are the same plane and a rule there would be
     * drawing a line through one surface.
     */
    edged: scrolled || openItem !== null || mobileOpen,
  }
}
