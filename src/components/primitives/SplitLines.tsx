import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/**
 * A line of type that rises out from behind its own edge.
 *
 * This is the signature move of the animation-led agency genre, and the single
 * highest-impact effect on the page: a headline that assembles line by line
 * reads as authored, where the same headline fading in reads as a template.
 *
 * IT DOES NOT MEASURE OR SPLIT TEXT. Every library that does this walks the
 * text node, wraps each word, measures the resulting line boxes and re-wraps —
 * which breaks on font swap, on resize, on any language whose line breaking
 * differs from English, and which hides the real text from assistive tech
 * while it is mid-flight. Here the author states the lines explicitly, one
 * `<Line>` per line, so the split is a fact of the markup and cannot ever
 * disagree with what is rendered.
 *
 * The mask carries a padding/negative-margin pair (see `.line-mask` in
 * index.css) because `overflow: hidden` on a text line slices the descenders
 * off g, y and p.
 *
 * Usage:
 *   <Reveal as="h1" lines className="display-1">
 *     <Line>Enterprise AI is won in</Line>
 *     <Line className="text-accent">production.</Line>
 *   </Reveal>
 *
 * `Reveal` in `lines` mode does not fade the block itself — only the lines
 * inside move — and it assigns each line its own delay, so the heading arrives
 * as a sequence rather than as a split block.
 */
export function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className="line-mask">
      <span className={cx(className)}>{children}</span>
    </span>
  )
}
