import type { ReactNode } from 'react'
import { Card } from '@/components/primitives/Card'
import { useCardStack } from '@/hooks/useCardStack'

export type StackItem = {
  id: string
  eyebrow?: ReactNode
  title?: ReactNode
  lede?: ReactNode
  body: ReactNode
  note?: ReactNode
}

/**
 * A pile of cards that deals itself.
 *
 * ---------------------------------------------------------------------------
 * IT IS A LIST THAT HAPPENS TO BE STACKED
 * ---------------------------------------------------------------------------
 * All items are a complete, static list to assistive technology, in source
 * order, at all times. No `aria-live`, no `aria-hidden`, no `inert`, no DOM
 * reordering — `--d` is a custom property and the pile is a purely visual
 * re-ordering of a list that never moves.
 *
 * This is deliberately NOT the ARIA carousel pattern. That pattern puts
 * `aria-hidden` on every non-current slide, which here would make three of the
 * four real customer cases unreadable to a screen reader in exchange for a
 * pattern label — a content loss bought with a semantic.
 *
 * It also deletes an entire failure class: there is nothing focusable inside a
 * card, so there is no focus to restore when the front one changes, and no
 * `inert` to strip a subtree out of the accessibility tree — which this repo
 * has already done once, to the document's only `h1`.
 *
 * ---------------------------------------------------------------------------
 * NO CONTROLS
 * ---------------------------------------------------------------------------
 * There is no picker and no pause button. That is a deliberate instruction, and
 * it has a cost that is written down rather than hidden: WCAG 2.2.2 requires a
 * mechanism to pause content that auto-updates for more than five seconds
 * alongside other content, and hovering is not a mechanism a keyboard reader
 * can reach. The rotation still stops for a mouse, for a backgrounded tab, and
 * entirely for `prefers-reduced-motion` — but this section does not currently
 * meet 2.2.2, and `tools/audit.mjs` cannot tell you so, because axe does not
 * test it. The two ways back to compliance are a visible control, or advancing
 * the pile on scroll instead of on a timer so that nothing auto-updates at all.
 *
 * ---------------------------------------------------------------------------
 * NOT A CAROUSEL COMPONENT
 * ---------------------------------------------------------------------------
 * A scroll-snap track is a scroll container, and a `view()` timeline measured
 * against a scroll container it sits inside freezes at 0% forever. The customer
 * roster in the same section pans on exactly such a timeline. So the pile is
 * transforms in a CSS grid: no `overflow`, no `scroll-snap`, no scrollport.
 */
export function CardStack({
  items,
  paused = false,
}: {
  items: readonly StackItem[]
  /** `#styleguide` holds the pile still so it can be compared rather than watched. */
  paused?: boolean
}) {
  const { index, leaving, regionProps } = useCardStack(items.length, { paused })

  return (
    <div {...regionProps}>
      <ol
        data-cardstack
        style={{ ['--stack-count' as string]: String(items.length) }}
        className="m-0 list-none p-0"
      >
        {items.map((item, i) => {
          const d = (i - index + items.length) % items.length
          return (
            <li
              key={item.id}
              style={{ ['--d' as string]: String(d) }}
              // Only the card that has actually just left the front is dealt
              // out. Keying this off depth would fire it on first paint — see
              // the note in useCardStack.
              data-leaving={i === leaving ? '' : undefined}
            >
              <Card
                eyebrow={item.eyebrow}
                title={item.title}
                lede={item.lede}
                body={item.body}
                note={item.note}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
