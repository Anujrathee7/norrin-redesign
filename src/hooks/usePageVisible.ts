import { useSyncExternalStore } from 'react'

/**
 * Reactive Page Visibility.
 *
 * Deliberately the same shape as `useReducedMotion` — `useSyncExternalStore`
 * rather than `useState` + `useEffect` — and for the same stated reason: under
 * concurrent rendering an effect-based mirror of an external value can tear, so
 * one component would believe the tab is hidden while a sibling in the same
 * commit believes it is visible and keeps ticking.
 *
 * It exists at all because a backgrounded tab throttles `setInterval` rather
 * than stopping it. Without this the timer keeps queueing, and the reader comes
 * back to a card stack that riffles through several positions at once to catch
 * up — motion nobody asked for, at the exact moment they are looking.
 */
function subscribe(onChange: () => void): () => void {
  if (typeof document === 'undefined') return () => {}
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

function getSnapshot(): boolean {
  return typeof document === 'undefined' ? true : !document.hidden
}

/** Server/prerender snapshot: assume visible, then correct on hydrate. */
function getServerSnapshot(): boolean {
  return true
}

export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
