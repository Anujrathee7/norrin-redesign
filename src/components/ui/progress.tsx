import type * as React from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '@/lib/cn'

/**
 * shadcn's Progress, on Radix's primitive. The second adopted component.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS UNCHANGED
 * ---------------------------------------------------------------------------
 * The Radix Root/Indicator pair, both `data-slot`s, the prop shape and the
 * indicator's transform are upstream's. §2.3: style it, never fork it.
 *
 * ---------------------------------------------------------------------------
 * WHAT CHANGED
 * ---------------------------------------------------------------------------
 * 1. `bg-primary` and `bg-primary/20` resolve through the bridge in index.css
 *    onto `--accent` — the same colour the position dots used before this, so
 *    the swap changes the shape of the indicator and not the palette. No stock
 *    value is involved (§2.2), and nothing is written at a call site (§2.4).
 *
 * 2. `transition-all` becomes `transition-transform`. The only property that
 *    changes is the indicator's transform; `all` also animates colour and, more
 *    to the point, is the version that makes a compositor promise it cannot
 *    keep. The global `prefers-reduced-motion` reset in index.css collapses the
 *    duration either way.
 *
 * No shadow (§2.7), and no focus or ring classes: the primitive ships none and
 * none are added, so the page's global `:focus-visible` outline is the only
 * treatment in play — which is the point of stripping them from the Badge too.
 *
 * ---------------------------------------------------------------------------
 * IT IS `aria-hidden` WHEREVER IT IS USED, AND THAT IS THE INTERESTING PART
 * ---------------------------------------------------------------------------
 * The decision is not made here — a component cannot know whether it is
 * describing a download or a card pile — but the one consumer's reasoning is
 * worth stating next to the code that would otherwise announce it. See the
 * `.stack-progress` note in index.css and the header in CardStack.tsx: `role=
 * "progressbar"` means task completion, all four cases are already in the
 * accessibility tree in source order, and "25%" is not a description of
 * "showing the first of four".
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-transform"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
