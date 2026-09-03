import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '@/lib/cx'

/**
 * Layout primitives.
 *
 * Each of these used to describe behaviour it did not have. `Container` said it
 * "establishes the measure and the grid" and emitted no grid property, so the
 * grid was a string hand-copied into eight files. `SectionHeader` said its index
 * was "hung in the left margin on wide viewports" and rendered it in normal flow
 * at every width. Both claims are now either true or gone.
 */

/**
 * These forward the rest of their props to the underlying div.
 *
 * Without it, anything the caller passes that is not `children` or `className`
 * is silently dropped — and TypeScript will not complain about `data-*` on a
 * component, so the attribute simply never reaches the DOM and whatever
 * depended on it quietly does nothing. That happened three times while wiring
 * the scroll layer before the cause was spotted.
 */
type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
  className?: string
}

/**
 * The page measure.
 *
 * There used to be three widths — wide (1512), default (1320) and text (820).
 * All sixteen call sites passed `wide`; the other two were dead options that
 * still had to be read and reasoned about. One measure, no prop.
 *
 * 1440, AND IT GOT THERE BY OVERSHOOTING. Worth recording, because the two
 * moves look contradictory in a diff.
 *
 * It was 1512, which on a 1920 viewport leaves 204px of margin a side — 10.6% —
 * and the page read as content pushed out to the edges. The prompt for changing
 * it was that the design looked better at 75% browser zoom, which is not a
 * statement about type size at all: zoom does not shrink the layout, it enlarges
 * the viewport. At 75% a 1920 screen reports 2560 CSS pixels, so the same
 * measure sat inside 20.5% margins instead of 10.6%.
 *
 * So it went to 1200 to reproduce that proportion exactly — and 1200 turned out
 * to be too tight for the type once seen. 1440 is the settled answer: ~12.5%
 * margins at 1920, wider lines than 1200 gave, and still less edge-to-edge than
 * 1512 was.
 *
 * The type scale came DOWN at the same time (see the TYPE block in index.css),
 * so lines run longer for two reasons at once — more measure and smaller
 * glyphs. That pairing is the whole change; either alone would have been wrong.
 *
 * Every section reads this, so it is uniform by construction. The one thing it
 * moves that is NOT free is the hero's height: measure and type size both
 * rewrap `display-1`, and the deck's pin model is a hardcoded number that has to
 * be re-derived whenever that happens. See `.shots/probe/deck-h.mjs`.
 */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={cx('mx-auto w-full max-w-[1440px] px-(--spacing-gutter)', className)} {...rest}>
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
export function Grid({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={cx('grid grid-cols-4 gap-x-6 md:grid-cols-12', className)} {...rest}>
      {children}
    </div>
  )
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
  /**
   * `tight` when the caller puts its own copy directly beneath the heading.
   *
   * `none` when the caller composes the header into a layout that owns the
   * spacing itself — a flex row, a grid cell. It exists because the
   * alternative was a wrapper: `Roles` passed `gap="tight"` and then wrapped
   * the result in `mb-12 md:mb-16`, so the prop rendered 28px of margin
   * underneath 64px of margin and the caller's stated intent was silently
   * discarded. That is the same defect the prop was added to prevent, walked
   * back in through a parent instead of a className, and a third value is
   * cheaper than a third way to lose the argument.
   */
  gap?: 'section' | 'tight' | 'none'
}) {
  return (
    // Every section header arrives the same way: the eyebrow rises out from
    // behind its own edge, then the heading follows. Doing this once here
    // rather than per section is what keeps the page feeling like one hand —
    // and it means a new section inherits the entrance for free.
    //
    // Driven by the header's own scroll range rather than by an
    // IntersectionObserver. It used to be a `Reveal`, which flips one attribute
    // the first time the header is seen, disconnects, and is finished forever:
    // the entrance was spent on the first pass and the header sat inert on
    // every one after. Progress here is a function of scroll POSITION, so the
    // lines run backwards on the way up and are never used up.
    //
    // `--scene` is declared on the header and read by the spans inside the
    // masks. It has to be the named timeline and cannot be each span's own
    // `view()`: `.line-mask` is `overflow: hidden`, that is a scroll container,
    // and an element's own view timeline inside one never advances. A named
    // timeline is resolved by walking up the tree instead of by finding a
    // scrollport, so it reaches in through the mask. Verified in a browser
    // first — the failure mode is a heading frozen at `translateY(110%)`, which
    // is permanently invisible type.
    //
    // The two lines are offset rather than simultaneous, which is the same
    // 0.1s stagger the transition used, restated as scroll distance.
    <header
      data-scene
      className={cx(
        gap === 'none' ? '' : gap === 'tight' ? 'mb-6 md:mb-7' : 'mb-12 md:mb-20',
        className,
      )}
    >
      <span className="line-mask">
        {/* Starts at 22%, not at the layer's 10% default. Measured, the rise
            was beginning at y=990-1046 on a 950px viewport — below the fold, so
            the first third of it happened where nobody could see it and the
            eyebrow was already part-risen by the time the header appeared. */}
        <span data-scene-part="line" style={{ ['--scene-from' as string]: 'cover 22%', ['--scene-to' as string]: 'cover 44%' }}>
          <Eyebrow index={index} label={label} tone={tone} />
        </span>
      </span>
      {children ? (
        <h2 id={id} data-scroll="drift-slow" className="display-2 mt-8 max-w-[20ch]">
          <span className="line-mask">
            <span
              data-scene-part="line"
              style={{
                ['--scene-from' as string]: 'cover 28%',
                ['--scene-to' as string]: 'cover 50%',
              }}
            >
              {children}
            </span>
          </span>
        </h2>
      ) : null}
    </header>
  )
}

/**
 * The single eyebrow treatment used by every section, including the hero.
 * Index, separator, label — in that order, at that size, always.
 *
 * THE LEAD-IN RULE IS GONE. A 32px hairline sat before the index, and at label
 * size it did not read as structure — it read as an em dash, so every section on
 * the page opened with "— 04 / Customers", a punctuation mark introducing a
 * heading it had no grammatical relationship to. TheGap already suppressed it
 * with `rule={false}` for a related reason, which left the system with a part
 * that most callers wanted off. Removing it removes the prop too: one eyebrow,
 * one shape, nothing to pass.
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
