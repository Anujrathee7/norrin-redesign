import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The class joiner for adopted library components — and the reason there are
 * two of these.
 *
 * ---------------------------------------------------------------------------
 * WHY NOT JUST USE `cx`
 * ---------------------------------------------------------------------------
 * `src/lib/cx.ts` is a plain `filter(Boolean).join(' ')`, and for this repo's
 * own components that is the correct tool. The author of a hand-written
 * component controls the whole class string, so the last utility to appear in
 * the stylesheet wins and the author knows which one that is.
 *
 * A library component is a different shape: it takes a `className` prop that a
 * CALL SITE writes, and the contract of that prop is override. With a plain
 * join, `cn('whitespace-nowrap', 'whitespace-normal')` emits both and the winner
 * is decided by the order Tailwind happened to generate them in — not by the
 * call site, not by anything visible from either file. That is a silent-bug
 * generator, and it is the specific bug this component set would hit first: the
 * customer card's badge holds a case title long enough to need wrapping, and the
 * shadcn Badge ships `whitespace-nowrap` in its base string.
 *
 * `tailwind-merge` resolves that by knowing which utilities belong to the same
 * property group and dropping the earlier one. It is not a nicety here; without
 * it the `className` prop does not do what its name says.
 *
 * ---------------------------------------------------------------------------
 * THE BOUNDARY, AND THAT IT IS TEMPORARY
 * ---------------------------------------------------------------------------
 * `cn` is for `src/components/ui/**` — the adopted shadcn components — and
 * nothing else. `cx` keeps its 61 call sites across 11 files, untouched.
 *
 * Consolidating them is real work and it is backlog, not this change: a
 * 61-site refactor landed alongside a card redesign would put both in the same
 * diff and make either one hard to review. When it happens, the direction is
 * `cx` -> `cn`, because merge semantics are a superset of joining.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
