import { Container, Eyebrow, Grid, SectionHeader } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { aboutHeadline, beliefs, careers, photos, waysOfWorking } from '@/data/norrin'

/**
 * Careers — "Work at Norrin", with Norrin's values beside it.
 *
 * THE ONE SECTION OF THEIR HOMEPAGE THIS SITE HAD NO COUNTERPART FOR. Every
 * other band on norrin.com mapped onto something here; Careers had nothing, and
 * for a company whose stated problem is that it is growing faster than it can
 * hire, that is not a small omission.
 *
 * ONE BAND, TWO BLOCKS. Careers and Values used to be consecutive sections on
 * `/company` — a copy/photograph split, then a heading held against a tab row.
 * The repo owner merged them and picked this layout from four rendered options:
 * the invitation on the left, and the claims that back it on the right.
 *
 * THE BAND STANDS ON THE PHOTOGRAPH, under a flat `--scrim-deep`. That is the
 * second treated Norrin photograph on the site and so the second recorded
 * exception to CLAUDE.md §1.8 — granted by the repo owner, not inherited from
 * the first. 88% rather than Contact's 76%: this picture is faces at close
 * range, and at 76% the repo owner found the copy hard to focus on. Every pair
 * is still measured against the LIGHTEST pixel type can land on (WCAG F83) and
 * gated in `tools/palette.mjs`. The photograph used to sit in its own
 * framed 3:2 with a wipe and a pan; as a ground it holds still, because a
 * moving picture under running text is a reading problem, not a flourish.
 *
 * NO LINES. The values list's hairlines between statements and the tab row's
 * rule are both gone — the repo owner's verdict on separator rules was that
 * they read as generated. Space and type contrast part the statements, and the
 * active tab is a filled pill (`--inverse-field`) rather than a stretch of rule.
 *
 * THE TABS ARE THE SOURCE'S OWN STRUCTURE. `/about-us` prints "We believe in"
 * and "Ways of working" as two separately headed sections; the trigger labels
 * are those headings verbatim, and every statement is shown in full in its
 * panel.
 *
 * NO INVENTED PROOF. No headcount figure, no Glassdoor score, no employee
 * quote, no open-roles count — Norrin publishes none of them. The CTA states
 * where roles live rather than linking to a URL we have not verified.
 */
export function Careers() {
  return (
    // `data-scene` declares the timeline the parts below are scrubbed against,
    // so the copy on both sides arrives against THIS section's scroll range.
    <section
      id="careers"
      data-shot="careers"
      aria-labelledby="careers-heading"
      data-scene
      data-tone="inverse"
      className="relative isolate overflow-clip bg-inverse pt-28 pb-20 text-inverse-ink md:py-28"
    >
      {/* `isolate` so the two negative layers stay inside the band. */}
      <div className="absolute inset-0 -z-20">
        <Photo
          file={photos.careers.file}
          alt={photos.careers.alt}
          width={photos.careers.w}
          height={photos.careers.h}
          sizes="100vw"
          loading="eager"
          frame={false}
          // Anchored to the top, so a band shorter than the 3:2 source loses
          // the table and laptops from the bottom and keeps the people's heads.
          // The default centre crop took them off at the forehead.
          className="h-full w-full [&_img]:object-top"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim-deep" />

      <Container>
        <Grid className="gap-y-16">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionHeader label="Careers" id="careers-heading" gap="tight" tone="inverse">
              {careers.title}
            </SectionHeader>

            <p
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 22%', ['--scene-to' as string]: 'cover 48%' }}
              className="body-serif measure-serif mt-6 text-inverse-ink-2"
            >
              {careers.body}
            </p>

            {/* Text, not a link — we hold no sourced URL for their careers page
                and a button whose destination we invented is the same failure
                as an invented statistic. */}
            <p
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 28%', ['--scene-to' as string]: 'cover 54%' }}
              className="label mt-8 text-inverse-ink-3"
            >
              {careers.cta} <span aria-hidden="true">·</span> norrin.com
            </p>
          </div>

          <div className="col-span-4 md:col-span-12 lg:col-span-6 lg:col-start-7">
            <div
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 18%', ['--scene-to' as string]: 'cover 44%' }}
            >
              <Eyebrow label="Values" tone="inverse" />
            </div>
            <h3
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 22%', ['--scene-to' as string]: 'cover 48%' }}
              className="display-2 mt-8"
            >
              {aboutHeadline}
            </h3>

            <Tabs defaultValue="believe" className="mt-10">
              {/* Pills, not the primitive's ruled row: classes only, behaviour
                  untouched (§2.3). There is no track behind them — shadcn's
                  stock tell is the filled track holding a lighter pill — just
                  the active trigger filled with the band's field step. */}
              <TabsList className="gap-2 border-b-0">
                <TabsTrigger value="believe" className={pill}>
                  We believe in
                </TabsTrigger>
                <TabsTrigger value="ways" className={pill}>
                  Ways of working
                </TabsTrigger>
              </TabsList>

              {/* THREE BELIEFS, NOT FOUR, so the two panels have the same shape
                  and switching tabs does not change the band's height. The repo
                  owner asked for three a side. Norrin publishes four, so one is
                  left out rather than any being reworded or merged (§3 governs
                  their words, not how many we set): "integrity in every
                  interaction", whose body — direct, transparent, full ownership
                  — is already said by the first way of working. `norrin.ts`
                  still carries all four. */}
              <TabsContent value="believe" className="mt-10">
                <StatementList items={beliefs.slice(0, 3).map((b) => ({ title: b.predicate, body: b.body }))} />
              </TabsContent>
              <TabsContent value="ways" className="mt-10">
                <StatementList items={waysOfWorking.map((w) => ({ title: w.title, body: w.body }))} />
              </TabsContent>
            </Tabs>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

const pill =
  'mb-0 rounded-(--radius-action) border-b-0 px-4 py-2 text-inverse-ink-2 hover:text-inverse-ink data-[state=active]:bg-inverse-field data-[state=active]:text-inverse-ink'

/**
 * One panel's statements.
 *
 * The beliefs pass their `predicate`: the active trigger already reads "We
 * believe in", so each item carries the rest of Norrin's sentence and the
 * wording is unchanged. Numbered because these ARE a sequence in the source —
 * statements printed in order under one heading. The number is `aria-hidden`;
 * an ordered list already announces position.
 */
function StatementList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-8">
      {items.map((item, i) => (
        <li
          key={item.title}
          data-scene-part="enter"
          style={{
            ['--scene-from' as string]: `cover ${18 + i * 5}%`,
            ['--scene-to' as string]: `cover ${44 + i * 5}%`,
          }}
          className="grid grid-cols-[auto_1fr] gap-x-6"
        >
          <span aria-hidden="true" className="label pt-1.5 tabular-nums text-inverse-ink-3">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h4 className="display-4 text-balance text-inverse-ink">{item.title}</h4>
            {/* `ui`, not `caption`: 13px over a photograph was the first thing
                to dissolve into it. */}
            <p className="ui mt-3 text-inverse-ink-2">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
