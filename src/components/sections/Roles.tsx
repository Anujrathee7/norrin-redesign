import { Container, SectionHeader } from '@/components/primitives/Layout'
import { Reveal } from '@/components/primitives/Reveal'
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
      className="py-24 md:py-36"
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
            sequence, not four cards that happen to sit in a row. */}
        <Reveal stagger={0.08} variant="left">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {roles.map((r) => (
              <li key={r.id} className="border-t border-hairline pt-5">
                <h3 className="display-4 max-w-[11ch] text-ink">{r.role}</h3>
                <p className="body-serif mt-4 text-ink-2">{r.claim}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
