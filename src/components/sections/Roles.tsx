import { Container, SectionHeader } from '@/components/primitives/Layout'
import { roles } from '@/data/norrin'

/**
 * The four roles.
 *
 * Norrin states these in a single dense paragraph on their homepage — as an
 * integrator, a deployer, an infrastructure partner, and the transformation
 * lead. It is the clearest articulation of scope they have written and it is
 * buried in body copy.
 *
 * Set as four columns under their own rules, not as four full-width ruled rows.
 * Work, two sections later, is a ruled-row table and does that idiom properly;
 * running the same construction here made the two read as one layout in
 * different hats, which was the single most template-coded thing about the
 * middle of the page. Four short claims also do not need four full page-widths:
 * as rows this block ran nearly a viewport tall to say sixteen words.
 *
 * Columns also make the point the copy is making. These are four
 * responsibilities held at the same time, side by side — not a sequence you
 * work down, which is exactly what a stack of numbered rows implied.
 *
 * Not numbered, and not hoverable. These are four responsibilities held at the
 * same time, not four steps — numbering them asserted a sequence that does not
 * exist, and "03" meant one thing here and another in the section eyebrow two
 * hundred pixels above. The hover rule went for the same reason it went from
 * Work: nothing here opens, and the completing rule is the page's argument, not
 * a decoration to spend on static text.
 */
export function Roles() {
  return (
    <section
      id="roles"
      data-shot="roles"
      aria-labelledby="roles-heading"
      className="overflow-clip py-24 md:py-36"
    >
      <Container>
        {/* Stacked, not the heading-left / paragraph-top-right lockup used by
            Work — four sections in a row wearing the same header is what makes
            a page feel like one layout in different hats. */}
        {/* No measure on this wrapper. A `max-w-[NNch]` here is resolved against
            the INHERITED 17px font, not against the 72px heading inside it — so
            34ch was ~320px and forced the h2 to four lines. The heading carries
            its own 20ch; the caption carries its own. */}
        <div className="mb-12 md:mb-16">
          <SectionHeader index="02" label="Scope" id="roles-heading" gap="tight">
            What we take responsibility for.
          </SectionHeader>
          {/* The second sentence was a claim about competitors we cannot source. */}
          <p className="caption max-w-[34ch] text-ink-2">Four roles, not eleven service lines.</p>
        </div>

        {/* From the left, in reading order — these are four things read as a
            sequence, not four cards that happen to sit in a row.

            Scroll-driven, not observer-driven. This was a `Reveal`, which fires
            once and disconnects; the four columns slid in on first sight and
            then the block was finished for the rest of the session. Each column
            now runs off its own scroll range, so it arrives on the way down and
            leaves on the way back up.

            EACH ITEM IS TIMED AGAINST ITSELF, not against the list. Staging
            four items inside one container range is the obvious way to do it
            and it is wrong here: at `lg` the columns sit side by side and share
            a scroll fate, but at phone width the list is a tall single column
            and the last item's slot would come and go long before that item is
            anywhere near the screen — an animation that plays to nobody. A
            per-item timeline is correct at every width, and the stagger
            survives because the offsets below shift each item's window relative
            to its own arrival rather than relative to the list's. */}
        <div data-scroll="drift-slow">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {roles.map((r, i) => (
              <li
                key={r.id}
                data-scroll="enter"
                style={{
                  // Travel derived from the gutter, not picked. A fixed -42px
                  // is fine at 1512, where the gutter is 46px, and slices the
                  // type in half at 390, where it is 24px: `overflow-clip`
                  // stops the page scrolling sideways but it does not stop the
                  // viewport edge cutting "Infrastructure partner" down to
                  // "nfrastructure artner", which is what it was doing. Nine
                  // Four fifths of the gutter: at nine tenths the type came to
                  // rest 2px off the viewport edge mid-travel, which reads as
                  // about to be cut even though it never is.
                  ['--enter-x' as string]: 'calc(var(--spacing-gutter, 24px) * -0.8)',
                  ['--enter-y' as string]: '0px',
                  ['--scrub-from' as string]: `cover ${10 + i * 6}%`,
                  ['--scrub-to' as string]: `cover ${10 + i * 6 + 30}%`,
                }}
                className="border-t border-hairline pt-5"
              >
                <h3 className="display-4 max-w-[11ch] text-ink">{r.role}</h3>
                <p className="body-serif mt-4 text-ink-2">{r.claim}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
