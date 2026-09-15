import type { StackItem } from '@/components/primitives/CardStack'
import { cases } from '@/data/norrin'

/**
 * The cases, as cards, for the customer pile on `/work`.
 *
 * Its own file because `CardStack.tsx` exports a component, and a component file
 * that also exports a value loses fast refresh.
 *
 * The attribution's trailing ", Skanska" is dropped because the client name sits
 * directly above it on the floor; the person and the role are what is new there.
 */
export const caseStackItems: StackItem[] = cases.map((c) => {
  const attribution = 'attribution' in c ? c.attribution : undefined
  const suffix = `, ${c.client}`
  return {
    id: c.id,
    client: c.client,
    title: c.title,
    summary: c.short,
    attribution: attribution?.endsWith(suffix) ? attribution.slice(0, -suffix.length) : attribution,
  }
})
