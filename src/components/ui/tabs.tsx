import type * as React from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '@/lib/cn'

/**
 * shadcn's Tabs, on Radix's primitive. The third adopted component.
 *
 * ---------------------------------------------------------------------------
 * WHY A PRIMITIVE AT ALL, AND WHY THIS ONE
 * ---------------------------------------------------------------------------
 * §2.1: a tab set is roving-tabindex keyboard navigation, `aria-controls`
 * wiring and an active-descendant relationship between a list and its panels.
 * Hand-written ARIA is banned here for reasons this repo has already paid for
 * twice, and Radix ships exactly this. Nothing below touches behaviour (§2.3).
 *
 * The two groups are NOT a taxonomy invented to justify a component: Norrin's
 * own `/about-us` prints "We believe in" and "Ways of working" as two separate
 * headed sections, and `norrin.ts` has named both since its provenance header
 * was written. The component follows the source's structure (§3).
 *
 * ---------------------------------------------------------------------------
 * WHAT CHANGED FROM STOCK, AND WHY EACH ONE
 * ---------------------------------------------------------------------------
 * 1. NO PILL, NO FILLED TRACK. shadcn's stock list is a `bg-muted` rounded
 *    container holding a `bg-background` rounded active pill — the single most
 *    recognisable shadcn tell there is, and shipping it would worsen the exact
 *    problem CLAUDE.md exists to prevent (§2.2). This draws the page's own
 *    gesture instead: a hairline under the row, and the active trigger marking
 *    its span of that line in accent. It is the same device the nav bar already
 *    uses for the current route, so the page reads as one hand.
 *
 * 2. `--radius` IS UNSPENT HERE. A tab is not an object sitting on a plane; the
 *    rule it sits on IS the plane, and planes have no corners. Square, per the
 *    amended radius rule in index.css.
 *
 * 3. NO SHADOW (§2.7). The list separates on a hairline like everything else.
 *
 * 4. NO `ring-*` UTILITIES. shadcn ships a focus ring built from `ring` and
 *    `ring-offset`; this repo has produced two real focus-ring contrast bugs and
 *    resolves them globally with one `:focus-visible` outline that is already
 *    correct on both grounds and in both themes. Adding a second, differently
 *    computed ring here is how a third bug gets made. The `Progress` adoption
 *    made the same call for the same reason.
 *
 * 5. EVERY COLOUR IS A BRIDGED TOKEN — `text-muted-foreground`,
 *    `border-border`, `text-primary` — all of which resolve through index.css
 *    onto `--ink-3`, `--hairline` and `--accent`. No hex, no colour utility
 *    written at a call site (§2.4), and no stock shadcn value anywhere (§2.2).
 *
 * ---------------------------------------------------------------------------
 * THE CONTENT IS NEVER HIDDEN BY MOTION
 * ---------------------------------------------------------------------------
 * There is no enter/exit animation on the panels, deliberately. §3's guard rail
 * is that no animation may leave content in a state where its failure hides it,
 * and a panel that fades in is a panel that can fail to. Radix mounts and
 * unmounts; the switch is instant and cannot strand anything at `opacity: 0`.
 */

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('flex w-full items-stretch gap-8 border-b border-border', className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // `-mb-px` pulls the trigger's own border onto the list's hairline so the
        // active mark replaces that segment rather than sitting under it.
        'label -mb-px cursor-pointer border-b-2 border-transparent pb-4 text-ink-3',
        'transition-colors hover:text-ink',
        'data-[state=active]:border-primary data-[state=active]:text-ink',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
