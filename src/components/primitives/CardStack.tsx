import type { ReactNode } from 'react'
import { Toolbar } from '@base-ui/react/toolbar'
import { Card } from '@/components/primitives/Card'
import { useCardStack } from '@/hooks/useCardStack'
import { cx } from '@/lib/cx'

export type StackItem = {
  id: string
  /** The toolbar's label for this item. Real content, never "slide 3". */
  picker: string
  eyebrow?: ReactNode
  title?: ReactNode
  lede?: ReactNode
  body: ReactNode
  note?: ReactNode
}

/**
 * A pile of cards, one in front, with a picker and a pause.
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
 * pattern label — a content loss bought with a semantic. WCAG 2.2.2 governs how
 * auto-updating content is PRESENTED, and is answered by the pause control, not
 * by live-region semantics.
 *
 * It also deletes an entire failure class: there is nothing focusable inside a
 * card, so there is no focus to restore when the front one changes, and no
 * `inert` to strip a subtree out of the accessibility tree — which this repo
 * has already done once, to the document's only `h1`.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS NOT A CAROUSEL COMPONENT
 * ---------------------------------------------------------------------------
 * A scroll-snap track is a scroll container, and a `view()` timeline measured
 * against a scroll container it sits inside freezes at 0% forever. The customer
 * roster directly above this pans on exactly such a timeline. So the pile is
 * transforms in a CSS grid: no `overflow`, no `scroll-snap`, no scrollport.
 *
 * Base UI ships no carousel and no card, and neither is an interactive
 * primitive. What IS one is the control cluster, and that is `Toolbar` —
 * `role="toolbar"`, roving tabindex and arrow-key navigation from the library
 * rather than hand-written, per §2.1. `Tabs` was checked and cannot serve: it
 * renders inactive panels with both `hidden` and `inert`, which no amount of
 * CSS undoes and which would hide three cards outright.
 */
export function CardStack({
  items,
  label,
  startPaused = false,
}: {
  items: readonly StackItem[]
  /** Names the toolbar. The pile itself is an ordinary list and needs no name. */
  label: string
  startPaused?: boolean
}) {
  const { index, setIndex, reduced, userPaused, toggle, regionProps } = useCardStack(items.length, {
    startPaused,
  })

  return (
    // `regionProps` GOES HERE, on the element containing BOTH the pile and its
    // controls. On the pile alone it never sees a pointer or a focus that lands
    // on the picker, so tabbing toward a card left the rotation running and the
    // card moved out from under the reader between keystrokes. Found by the
    // behaviour probe; the comment claiming otherwise was there first.
    <div {...regionProps} className="grid grid-cols-4 gap-x-6 md:grid-cols-12">
      <div className="col-span-4 md:col-span-7">
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
                // The back position is the only one ever arrived at from the
                // front, so this needs no timer and no extra state — see the
                // two-speed transition in index.css.
                data-back={d === items.length - 1 ? '' : undefined}
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

      <div className="col-span-4 mt-10 md:col-span-4 md:col-start-9 md:mt-0">
        <Toolbar.Root
          orientation="vertical"
          aria-label={label}
          className="flex flex-col items-start gap-1"
        >
          {items.map((item, i) => (
            <Toolbar.Button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'true' : undefined}
              className={cx('control label px-3 py-2 text-left', i === index ? 'text-ink' : 'text-ink-3')}
            >
              {item.picker}
            </Toolbar.Button>
          ))}

          {/* Not rendered under reduced motion. There is no rotation to stop,
              and a control that does nothing is a fabricated affordance (§3).

              A STABLE ROLE WITH A CHANGING LABEL, not `aria-pressed`. "Pause,
              pressed" is ambiguous about whether pressed means paused or
              playing; "Play" is not ambiguous about anything. The accessible
              name is the visible text, so 2.5.3 holds by construction. */}
          {reduced ? null : (
            <>
              <Toolbar.Separator className="my-2 h-px w-8 bg-hairline-strong" />
              <Toolbar.Button
                onClick={toggle}
                className="control label px-3 py-2 text-left text-ink-2"
              >
                {userPaused ? 'Play' : 'Pause'}
              </Toolbar.Button>
            </>
          )}
        </Toolbar.Root>
      </div>
    </div>
  )
}
