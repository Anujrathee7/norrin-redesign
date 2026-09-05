import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * What the bar needs to know: whether the page has scrolled, which route the
 * reader is on, and whether the phone sheet is open.
 *
 * ---------------------------------------------------------------------------
 * THIS FILE USED TO BE FOUR TIMES THIS LENGTH, AND THE DRAWERS ARE WHY
 * ---------------------------------------------------------------------------
 * It carried two hover-intent timers, an open/close/toggle trio, a
 * `canHover` media query, a map of trigger elements held so focus could be
 * handed to and from a panel, `exitForward` to tab off the last row into the
 * next item, and `activateTrigger` — which branched on `e.detail === 0` to tell
 * a keyboard activation (toggle the disclosure) from a mouse click (navigate),
 * because otherwise the parent destinations were unreachable on desktop.
 *
 * Every one of those existed to make a hover mega-menu behave, and the menus are
 * deleted — see the header in `navData.ts`. None of it is commented out or left
 * behind a flag: a disclosure's focus management is not something to keep warm
 * for a menu that may never come back, and if one does it will be a Radix
 * primitive under §2.1 rather than this.
 *
 * WHAT SURVIVED IS THE PART THAT WAS NEVER ABOUT DRAWERS. Scroll state, route
 * state, the sheet, and the Escape key.
 *
 * IT ALSO NO LONGER WATCHES WHAT IS UNDERNEATH IT. A fourth observer used to
 * query `[data-tone="inverse"]`, collapse the viewport to a band the height of
 * the bar, and flip the whole header's palette to forest whenever a dark section
 * crossed it. That was a bar with no ground of its own, adapting to every plane
 * it passed over — so the moment Work took a fixed near-black band the header
 * started turning green in the middle of the customer cases, which is what got
 * it removed. The bar paints its own `--ground` and stops asking.
 */
export function useNavState() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /**
   * The reader's location, exactly, rather than an observer's guess.
   *
   * `useLocation` re-renders the bar on every navigation, which is what makes
   * the marker land in the same commit as the page it marks.
   */
  const { pathname } = useLocation()

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

  /* The sheet is the only thing left that Escape closes, and the only thing that
     locks scroll. Both used to have a drawer branch. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  /* A NAVIGATION CLOSES THE SHEET, ADJUSTED DURING RENDER RATHER THAN IN AN
     EFFECT.

     It used to be closed by each row's own `onClick`, which is one handler per
     row and silently wrong for every other way of leaving the page — the
     browser's back button among them.

     Written as `useEffect(() => setMobileOpen(false), [pathname])` it works and
     oxlint refuses it, correctly: an effect that calls setState synchronously
     starts a second render pass, so the sheet paints open over the new page for
     a frame before closing. This is React's documented alternative — compare
     the previous value during render and adjust — so the close lands in the same
     commit as the navigation. The Drawer used the identical shape to hold its
     content through a collapse, so it is the house pattern rather than a new
     one. */
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMobileOpen(false)
  }

  return {
    mobileOpen,
    setMobileOpen,
    scrolled,
    currentPath: pathname,
    /**
     * Whether the bar draws its bottom hairline.
     *
     * An edge is only true where there is something to separate: content that
     * has travelled under the bar, or the sheet hanging off it. At rest over the
     * hero the bar and the page are the same plane, and a rule there would be
     * drawing a line through one surface. The drawer used to be a third reason
     * and is gone.
     */
    edged: scrolled || mobileOpen,
  }
}
