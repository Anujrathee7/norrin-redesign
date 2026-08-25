import { useSyncExternalStore } from 'react'

/**
 * Reactive `prefers-reduced-motion`.
 *
 * useSyncExternalStore rather than useState + useEffect: under concurrent
 * rendering the effect-based version can tear, rendering some components with
 * motion enabled and others with it disabled in the same commit.
 *
 * The media query is also live — someone can flip the OS setting mid-session
 * and every animation on the page responds without a reload.
 */

let query: MediaQueryList | null = null

function get(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  query ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return query
}

function subscribe(onChange: () => void): () => void {
  const mq = get()
  if (!mq) return () => {}
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return get()?.matches ?? false
}

/** Server/prerender snapshot: assume motion is allowed, then correct on hydrate. */
function getServerSnapshot(): boolean {
  return false
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
