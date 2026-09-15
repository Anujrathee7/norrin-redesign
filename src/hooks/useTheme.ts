import { useSyncExternalStore } from 'react'

/**
 * The theme.
 *
 * Two states, not three. A "system" option is the correct default for a product
 * someone lives in; this is a single page with an argument to make, and it
 * makes it on black. Dark is therefore the default outright — declared as
 * `data-theme="dark"` in index.html rather than resolved here — and this hook
 * only ever moves between the two explicit values.
 *
 * The DOM is the source of truth, not a `useState` seeded from storage. By the
 * time React mounts, index.html has already read localStorage and set the
 * attribute; reading it back means the first render cannot disagree with the
 * pixels that are already on screen. There is one theme, written in one place.
 *
 * useSyncExternalStore because the toggle renders twice — once in the desktop
 * utilities, once in the mobile sheet — and both are mounted at every viewport
 * (they are hidden with CSS, not unmounted). Two independent `useState`s would
 * drift the moment either one was used, and under concurrent rendering could
 * tear inside a single commit.
 */

export type Theme = 'light' | 'dark'
type ThemeOrigin = { x: number; y: number }
type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

const KEY = 'norrin-theme'
const listeners = new Set<() => void>()

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)

  // Storage events fire only in OTHER tabs, which is exactly the case worth
  // handling: change the theme in one tab and the rest follow.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    apply(e.newValue === 'light' ? 'light' : 'dark', { persist: false })
  }
  window.addEventListener('storage', onStorage)

  // If the DOM is the source of truth, it has to be watched, not just read
  // once. tools/audit.mjs and tools/shot.mjs force a theme by writing the
  // attribute directly, and without this the button kept rendering the glyph
  // for the theme it was mounted in — so every forced-light screenshot showed
  // a sun where the product shows a moon, and the harness would have been
  // quietly lying about the one control it was hired to photograph.
  const el = root()
  const observer = el ? new MutationObserver(() => onChange()) : null
  observer?.observe(el!, { attributes: true, attributeFilter: ['data-theme'] })

  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
    observer?.disconnect()
  }
}

function getSnapshot(): Theme {
  return root()?.dataset.theme === 'light' ? 'light' : 'dark'
}

/** No document to read: the markup's default is dark, so this is dark. */
function getServerSnapshot(): Theme {
  return 'dark'
}

function apply(theme: Theme, { persist = true } = {}) {
  const el = root()
  if (!el) return

  // Suppress every transition for one frame — see `.theme-switching` in
  // index.css. Without it the header's 500ms colour cross-fade means the bar
  // arrives in the new theme long after the page beneath it does.
  el.classList.add('theme-switching')
  el.dataset.theme = theme

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = theme === 'light' ? '#f8f7f3' : '#0e120f'

  if (persist) {
    // Blocked storage is not a reason to refuse to switch: the theme still
    // changes, it just does not survive the reload.
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* private mode, blocked cookies */
    }
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.remove('theme-switching'))
  })

  for (const fn of listeners) fn()
}

export function setTheme(theme: Theme, origin?: ThemeOrigin) {
  const doc = typeof document === 'undefined' ? null : (document as TransitionDocument)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Dark enters as a circle expanding from the control that was pressed. The
  // View Transitions API is an enhancement: light mode, reduced motion and
  // browsers without support keep the existing immediate switch.
  if (theme !== 'dark' || !origin || reduced || !doc?.startViewTransition) {
    apply(theme)
    return
  }

  const el = root()
  if (!el) return
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  )
  el.style.setProperty('--theme-reveal-x', `${origin.x}px`)
  el.style.setProperty('--theme-reveal-y', `${origin.y}px`)
  el.style.setProperty('--theme-reveal-radius', `${radius}px`)

  const transition = doc.startViewTransition(() => apply(theme))
  void transition.finished.finally(() => {
    el.style.removeProperty('--theme-reveal-x')
    el.style.removeProperty('--theme-reveal-y')
    el.style.removeProperty('--theme-reveal-radius')
  })
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
