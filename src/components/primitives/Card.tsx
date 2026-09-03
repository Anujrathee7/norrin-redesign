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
  index,
  title,
  titleId,
  lede,
  body,
  note,
  floor,
}: {
  /** Mono metadata above the heading. The stack: the client's sector. */
  eyebrow?: ReactNode
  /**
   * A position marker set opposite the eyebrow. The stack: which card of the
   * pile this is.
   *
   * `aria-hidden`, because it duplicates information a screen reader already
   * has for free — all the cards are in the accessibility tree in source order,
   * so the number adds nothing there and would only be read out twice.
   */
  index?: ReactNode
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
      {/* THE IDENTITY BLOCK. Sector and position on one mono line, then the
          client set large enough to be the card's subject rather than one of
          four paragraphs in it.

          The card previously ran 10.5 / 25 / 17 / 17px — its largest element
          was 1.47x its body text and two of its four blocks were the same size,
          so it had no focal point and read as a box of prose. §1.3 makes the
          same argument about the h1: if it is not the largest thing by a wide
          margin, it is too small.

          SETTING THE NAME LARGE IS THIS SECTION'S OWN ARGUMENT, not a new one.
          The file opens by noting that Norrin gives its strongest peer proof
          the visual weight of a footer menu, and that the fix is to set the
          names as type — we hold no licence to their marks, so typography is
          both the honest option and the better-looking one. That job used to
          belong to the roster; the roster is small now, and the argument had
          nowhere left to live. */}
      {eyebrow || index ? (
        <p className="label flex items-baseline justify-between gap-4 text-ink-3">
          <span>{eyebrow}</span>
          {index ? (
            <span aria-hidden="true" className="tabular-nums">
              {index}
            </span>
          ) : null}
        </p>
      ) : null}
      {title ? (
        <h3 id={titleId} className="display-2 mt-4 text-ink">
          {title}
        </h3>
      ) : null}
      {/* THE QUOTED MATTER, GROUPED, so the stack can size it as one block —
          see the font-size rule scoped to `.card-quoted` in index.css. Scope has
          no `title`, takes no group, and its flow is untouched, which is what
          keeps its zero-pixel diff true. */}
      {title ? (
        <div className="card-quoted mt-8">
          {/* THE QUOTATION MARK IS GONE, and it is worth saying why rather than
              leaving a hole where it was. It marked the case text as quoted,
              which was true — these strings are verbatim from Norrin's published
              pages. But a large quote glyph under a client's name is the visual
              grammar of a testimonial, and these are summaries Norrin wrote, not
              words the client said. The card carries no person, no face and no
              attribution for exactly that reason, and the glyph was the one
              element pulling the other way. The caption under the pile still
              states the source, which is the honest way to say it. */}
          {lede ? <p className="mt-2 text-ink">{lede}</p> : null}
          <p className="body-serif measure-serif mt-3 text-reading">{body}</p>
          {note ? <p className="caption mt-3 text-ink-3">{note}</p> : null}
        </div>
      ) : (
        <>
          <p className={cx('body-serif measure-serif text-reading', hasSlotAbove && 'mt-3')}>
            {body}
          </p>
          {note ? <p className="caption mt-3 text-ink-3">{note}</p> : null}
        </>
      )}
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
