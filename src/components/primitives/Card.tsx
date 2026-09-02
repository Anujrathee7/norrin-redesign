import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/**
 * The one card anatomy on this page.
 *
 * Five slots in a fixed order. Scope fills `body` and `floor`; the customer
 * stack fills `eyebrow`, `title`, `lede` and `body`. That overlap is the whole
 * unification — the same box, the same padding, the same hairline, the same
 * floor rule, filled differently — rather than two components that happen to
 * look alike this week and drift apart the next time one of them is touched.
 *
 * ---------------------------------------------------------------------------
 * NO `className`, AND NO PROP SPREAD
 * ---------------------------------------------------------------------------
 * Both are absent from the type on purpose, and the reason is written down in
 * `Layout.tsx:83`: `cx` is a plain join with no tailwind-merge, so a caller
 * passing a conflicting class APPENDS it rather than replacing, and which one
 * wins is decided by Tailwind's own stylesheet order rather than by the caller.
 * Roles asked for 28px that way and silently rendered 80px. A slot cannot lose
 * that argument, and neither can a prop.
 *
 * The caller owns the `<li>`. So `key`, `style` (the stack's `--d`) and every
 * `data-*` attribute land on an element the caller already controls, and there
 * is nothing here to forward and nothing to silently drop — which is the third
 * trap `Layout.tsx:14` names.
 *
 * Colour and geometry live in `.card` (index.css, `@layer components`). This
 * file writes neither, per §2.4.
 */
export function Card({
  eyebrow,
  title,
  titleId,
  lede,
  body,
  note,
  floor,
}: {
  /** Mono metadata above the heading. The stack: the client's sector. */
  eyebrow?: ReactNode
  /** The card's heading, rendered as `<h3>`. The stack: the client. */
  title?: ReactNode
  titleId?: string
  /** One grotesk line under the heading. The stack: the case title. */
  lede?: ReactNode
  /** The reading matter. The stack: the quote. Scope: the claim. */
  body: ReactNode
  /**
   * A sourced caption under the body. The stack: the one case that carries a
   * named attribution.
   *
   * It is a SLOT rather than something the caller renders next to the card,
   * and that is not a tidiness preference — rendered as a sibling it sat
   * outside the card's box, on top of the cards stacked behind it, and read as
   * a caption belonging to the pile rather than to the case. Screenshotted,
   * not reasoned about.
   */
  note?: ReactNode
  /** Pinned to the card's floor. Scope: the role name. */
  floor?: ReactNode
}) {
  /**
   * The body's top margin is conditional, and this is load-bearing rather than
   * tidy. Scope's claim is the card's FIRST child and has never had a margin
   * above it; the stack's quote follows three other slots and needs one. A
   * flat `mt-3` here would have moved every Scope card's copy down 12px, which
   * is precisely the silent regression the zero-pixel diff check exists to
   * catch.
   *
   * `measure-serif` is unconditional and safe: 62ch never binds at Scope's
   * ~376px of card content, and it is exactly what the stack's ~766px needs.
   */
  const hasSlotAbove = Boolean(eyebrow || title || lede)

  return (
    <div className="card">
      {eyebrow ? <p className="label text-ink-3">{eyebrow}</p> : null}
      {title ? (
        <h3 id={titleId} className="display-4 mt-2 text-ink">
          {title}
        </h3>
      ) : null}
      {lede ? <p className="mt-4 text-ink">{lede}</p> : null}
      <p className={cx('body-serif measure-serif text-reading', hasSlotAbove && 'mt-3')}>{body}</p>
      {note ? <p className="caption mt-3 text-ink-3">{note}</p> : null}
      {/* An `<h3>` only when the card has no `title`, so a card never emits two
          headings at the same level and `tools/audit.mjs`'s heading-order check
          stays clean. Scope reaches this branch; the stack uses `title`. */}
      {floor ? (
        title ? (
          <p className="card-floor display-4 text-ink">{floor}</p>
        ) : (
          <h3 className="card-floor display-4 text-ink">{floor}</h3>
        )
      ) : null}
    </div>
  )
}
