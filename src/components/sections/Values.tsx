import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { aboutHeadline, beliefs, waysOfWorking } from '@/data/norrin'

/**
 * Values — the two headed blocks Norrin's own `/about-us` prints, on `/company`.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS, AND WHAT IT REVERSES
 * ---------------------------------------------------------------------------
 * `beliefs` was extracted and then cut, and `norrin.ts` still carries the note
 * explaining why: four short statements occupying ~945px of a page whose middle
 * 70% already carried no brand. That was correct about the page it described —
 * one long document — and that page no longer exists. `/company` is its own
 * route and was the thinnest on the site at two sections. The reason the block
 * was cut is the reason it belongs here.
 *
 * `waysOfWorking` is not a reversal at all: the provenance header in
 * `norrin.ts` has read `"We believe in" + "Ways of working"` since it was
 * written, and only the first half had ever been extracted.
 *
 * ---------------------------------------------------------------------------
 * THE TABS ARE THE SOURCE'S OWN STRUCTURE, NOT A DEVICE
 * ---------------------------------------------------------------------------
 * `/about-us` prints these as two separately headed sections. Splitting them
 * across two panels reproduces that; it does not invent a taxonomy to justify a
 * component (§3). The trigger labels are the source's section headings verbatim.
 *
 * Every statement is shown in full inside its panel — nothing is truncated and
 * nothing needs a second click to be read. An accordion was the obvious reach
 * for headings-with-bodies and was rejected on purpose: it would collapse seven
 * statements into seven rows and make the thinnest route on the site shorter,
 * which is the opposite of what this section is for.
 *
 * ---------------------------------------------------------------------------
 * SILHOUETTE (§1.5), MEASURED AGAINST WHAT IT FOLLOWS
 * ---------------------------------------------------------------------------
 * This sits between Careers and Thinking. Careers is page-ground, a two-column
 * split with a photograph on the right; Thinking is `bg-surface` with a
 * rounded-panel four-cell grid.
 *
 * THE GROUND IS SHARED WITH CAREERS AND THE OUTLINE IS NOT, which is the
 * distinction §1.5 actually draws — it asks whether consecutive sections trace
 * the same rectangle, not whether they stand on the same plane. This one is a
 * heading held left against a tab row on its own rule, with the statements
 * running as a numbered ruled list beneath. No panel, no card, no image, and no
 * two-column split. Thinking's surface panel breaks the run underneath it.
 *
 * §1.6: the tab row's rule runs past the container's gutter and off the right
 * edge of the page rather than stopping politely inside it.
 */
export function Values() {
  return (
    <section id="values" aria-labelledby="values-heading" data-scene className="py-20 md:pt-14 md:pb-20">
      <Container>
        {/* Heading left, tab row right — four corners rather than a centred
            stack (§1.4). Below `lg` they stack, because a seven-word display
            heading and a two-item tab row do not share a line at 390px without
            one of them wrapping into nonsense. */}
        {/* `items-start`, NOT `items-end`. Aligning the two columns' bottoms
            looked right in the abstract and was wrong on the page: the tab
            column is ~780px and the heading block ~200px, so ending them
            together dropped the heading to the floor and left ~450px of
            empty ground above it. Starting them together puts the eyebrow
            on the same line as the tab row, which is the join the two
            columns actually share. */}
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-16">
          <div className="lg:max-w-[24ch]">
            <Eyebrow label="Values" />
            <h2 id="values-heading" data-scroll="drift-slow" className="display-2 mt-8 max-w-[16ch] text-balance">
              {aboutHeadline}
            </h2>
          </div>

          <Tabs defaultValue="believe" className="mt-12 lg:mt-0 lg:w-[min(64ch,46vw)] lg:shrink-0">
            {/* The list's hairline is this section's rule, and it leaves the
                page on the right (§1.6). */}
            <TabsList className="lg:-mr-(--spacing-gutter) lg:pr-(--spacing-gutter)">
              <TabsTrigger value="believe">We believe in</TabsTrigger>
              <TabsTrigger value="ways">Ways of working</TabsTrigger>
            </TabsList>

            <TabsContent value="believe" className="mt-12">
              <ValueList items={beliefs.map((b) => ({ title: b.predicate, body: b.body }))} lead="We believe in" />
            </TabsContent>

            <TabsContent value="ways" className="mt-12">
              <ValueList items={waysOfWorking.map((w) => ({ title: w.title, body: w.body }))} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  )
}

/**
 * One panel's statements.
 *
 * `lead` exists because the four beliefs all open with the same three words.
 * `norrin.ts` lifts that shared opening into `predicate` precisely so a page can
 * set it once instead of printing it four times, and this is the page doing it:
 * the lead is stated as the panel's own line and each item carries the rest of
 * its sentence. No wording is changed — reading the lead and any item back to
 * back gives Norrin's sentence exactly. The ways-of-working items share no
 * opening, so they pass no `lead` and print whole.
 *
 * Numbered because these ARE a sequence in the source: statements printed in
 * order under one heading. The standing rule is that numbering is earned by
 * content that is a sequence, and a values list read in order qualifies where
 * eight unrelated sections did not.
 *
 * The number is `aria-hidden`: an ordered list already announces position, and
 * a screen reader reading "zero one" before every item is the same noise the
 * card pile's progress bar was hidden to avoid.
 */
function ValueList({ items, lead }: { items: { title: string; body: string }[]; lead?: string }) {
  return (
    <>
      {lead ? <p className="body-serif text-ink-3">{lead}&hellip;</p> : null}

      <ol className={lead ? 'mt-6' : undefined}>
        {items.map((item, i) => (
          <li
            key={item.title}
            data-scene-part="enter"
            style={{
              ['--scene-from' as string]: 'cover ' + (18 + i * 5) + '%',
              ['--scene-to' as string]: 'cover ' + (44 + i * 5) + '%',
            }}
            className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-hairline py-6 first:border-t-0 first:pt-0"
          >
            <span aria-hidden="true" className="label tabular-nums text-ink-3">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div>
              <h3 className="display-4 text-balance">{item.title}</h3>
              <p className="caption mt-3 text-ink-2">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
