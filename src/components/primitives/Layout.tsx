import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Reveal } from './Reveal'

/**
 * Layout primitives.
 *
 * Each of these used to describe behaviour it did not have. `Container` said it
 * "establishes the measure and the grid" and emitted no grid property, so the
 * grid was a string hand-copied into eight files. `SectionHeader` said its index
 * was "hung in the left margin on wide viewports" and rendered it in normal flow
 * at every width. Both claims are now either true or gone.
 */

type ContainerProps = {
  children: ReactNode
  className?: string
}

/**
 * The page measure.
 *
 * There used to be three widths — wide (1512), default (1320) and text (820).
 * All sixteen call sites passed `wide`; the other two were dead options that
 * still had to be read and reasoned about. One measure, no prop.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cx('mx-auto w-full max-w-[1512px] px-(--spacing-gutter)', className)}>
      {children}
    </div>
  )
}

/**
 * The page grid: four columns on phones, twelve from `md`.
 *
 * This is the one declaration the whole page composes on, and it was previously
 * written out by hand in eight places. Sections still choose their own column
 * spans — that asymmetry is deliberate and is what stops the page reading as a
 * stack of identical bands — but they no longer each restate what the grid *is*.
 */
export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('grid grid-cols-4 gap-x-6 md:grid-cols-12', className)}>{children}</div>
}

/**
 * Section index + title.
 *
 * `gap` is a prop rather than a className because `cx` is a plain join with no
 * tailwind-merge: passing `className="mb-6"` appended a second margin instead of
 * replacing the first, and which one won was decided by Tailwind's own stylesheet
 * order rather than by the caller. Roles asked for 28px and silently rendered
 * 80px. A prop cannot lose that argument.
 */
export function SectionHeader({
  index,
  label,
  id,
  children,
  className,
  tone = 'default',
  gap = 'section',
}: {
  index: string
  label: string
  id?: string
  children?: ReactNode
  className?: string
  /** `inverse` for the forest bands, where the hairline needs to lift. */
  tone?: 'default' | 'inverse'
  /** `tight` when the caller puts its own copy directly beneath the heading. */
  gap?: 'section' | 'tight'
}) {
  return (
    // Every section header arrives the same way: the eyebrow rises out from
    // behind its own edge, then the heading follows. Doing this once here
    // rather than per section is what keeps the page feeling like one hand —
    // and it means a new section inherits the entrance for free.
    <Reveal
      as="header"
      lines
      stagger={0.1}
      className={cx(gap === 'tight' ? 'mb-6 md:mb-7' : 'mb-12 md:mb-20', className)}
    >
      <span className="line-mask">
        <Eyebrow index={index} label={label} tone={tone} />
      </span>
      {children ? (
        <h2 id={id} className="display-2 mt-8 max-w-[20ch]">
          <span className="line-mask">
            <span>{children}</span>
          </span>
        </h2>
      ) : null}
    </Reveal>
  )
}

/**
 * The single eyebrow treatment used by every section, including the hero.
 * Rule, index, separator, label — in that order, at that size, always.
 */
export function Eyebrow({
  index,
  label,
  tone = 'default',
  className,
}: {
  index?: string
  label: string
  tone?: 'default' | 'inverse'
  className?: string
}) {
  return (
    <p
      className={cx(
        'label flex items-center gap-3',
        tone === 'inverse' ? 'text-inverse-ink-3' : 'text-ink-3',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'inline-block h-px w-8 shrink-0',
          tone === 'inverse' ? 'bg-inverse-hairline-strong' : 'bg-hairline-strong',
        )}
      />
      {index ? (
        <>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
        </>
      ) : null}
      <span className={tone === 'inverse' ? 'text-inverse-ink-2' : 'text-accent'}>{label}</span>
    </p>
  )
}
