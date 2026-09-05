import { Container, Grid, SectionHeader } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { careers, photos } from '@/data/norrin'

/**
 * Careers — "Work at Norrin".
 *
 * THE ONE SECTION OF THEIR HOMEPAGE THIS SITE HAD NO COUNTERPART FOR. Every
 * other band on norrin.com mapped onto something here — their hero to ours,
 * their thesis to `TheGap`, their three service cards to `Roles` + `Pillars`,
 * their customer list to `Work`, their vision paper and podcast into
 * `Thinking`. Careers had nothing, and for a company whose stated problem is
 * that it is growing faster than it can hire, that is not a small omission.
 *
 * WHY IT SITS HERE, immediately before the track record. Norrin runs it
 * directly after the customer roster, and the logic of that is right — the
 * roster answers "who trusts them", this answers "who are they", and `Proof`
 * then answers "will they still be here in three years".
 *
 * It is one place later than theirs for a structural reason, not a taste one.
 * The navbar marks the current section with its own length of the bar's bottom
 * rule, and that only reads as wayfinding if each nav item owns a CONTIGUOUS
 * run of sections (see the note in `App.tsx`). Careers belongs under "Company"
 * alongside `Proof`; dropping it between `Work` and `Thinking` would split that
 * item's run in two and send the marker backwards on the way down the page.
 * So it sits after `Thinking`, and Company owns `careers` + `proof` as one run.
 *
 * THE PHOTOGRAPH IS THE POINT OF THE SECTION, and it is the only place on the
 * site where that is true. Everywhere else the argument is carried by type and
 * one rule; here the claim is "this is a place worth working" and no amount of
 * typography makes that case. It is also the right section to spend the site's
 * first photograph on, because it is the one making a human claim rather than a
 * technical one.
 *
 * NO INVENTED PROOF. Their page has no headcount-growth figure, no glassdoor
 * score, no employee quote, and no open-roles count, so neither does this. The
 * growth numbers that DO exist publicly are already in `Proof`, where they are
 * evidence about the business rather than a recruitment claim. The CTA states
 * where roles live rather than linking to a URL we have not verified — the same
 * rule the `Thinking` rungs follow.
 */
export function Careers() {
  return (
    // `data-scene` declares the timeline everything below is scrubbed against
    // (`view-timeline-name: --scene`), so the photograph and the copy are timed
    // against THIS section's own scroll range rather than each against its own.
    // That is what lets them be choreographed relative to one another.
    //
    // Note the SectionHeader inside carries its own `data-scene`; its parts
    // resolve to the nearest named ancestor, so the heading keeps its own
    // entrance and the parts here take the section's. Nested on purpose.
    <section
      id="careers"
      data-shot="careers"
      aria-labelledby="careers-heading"
      data-scene
      className="py-20 md:py-28"
    >
      <Container>
        <Grid>
          {/* Copy left, photograph right. The reverse — a full-bleed image with
              text over it — is their layout and it is the reason their careers
              band says nothing: white type on a mid-tone photograph at whatever
              contrast the crop happens to give you. Keeping them side by side
              means the type sits on the page's own ground and the photograph
              does not have to be legible as a background. */}
          {/* Centred against the photograph from `lg`, where the two sit side
              by side. The copy is three short paragraphs and the image is a 3:2
              at half the grid, so top-aligning them leaves ~250px of empty
              column under the CTA — the same dead-corner problem the hero had.
              Below `lg` they stack and there is nothing to centre against. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:self-center">
            <SectionHeader label="Careers" id="careers-heading" gap="tight">
              {careers.title}
            </SectionHeader>

            <p
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 22%', ['--scene-to' as string]: 'cover 48%' }}
              className="body-serif measure-serif mt-6 text-reading"
            >
              {careers.body}
            </p>

            {/* Text, not a link — we hold no sourced URL for their careers page
                and a button whose destination we invented is the same failure
                as an invented statistic. `Thinking` states its destinations the
                same way and for the same reason. */}
            <p
              data-scene-part="enter"
              style={{ ['--scene-from' as string]: 'cover 28%', ['--scene-to' as string]: 'cover 54%' }}
              className="label mt-8 text-ink-3"
            >
              {careers.cta} <span aria-hidden="true">·</span> norrin.com
            </p>
          </div>

          {/* `sizes` is measured off the grid, not guessed: this column is 6 of
              12 from `lg` and full width below it. Getting this wrong is silent
              — the browser picks a variant against a claim that is not true —
              which is why `Photo` refuses to default it. */}
          {/* TWO MOTIONS, AND THEY DO DIFFERENT JOBS.

              `uncover` is the ARRIVAL: the frame is wiped in left to right on
              `clip-path` as the section is read. index.css picks this part for
              "a ruled row or a framed block, where the rule above it is already
              a horizontal gesture and a rise would fight it" — which is exactly
              a bordered 3:2 sitting beside a ruled eyebrow.

              `photo-pan` is what happens AFTER it has arrived. The wipe is a
              one-shot; the pan runs for the whole time the section is on screen
              and unwinds on the way back up, which is the difference between a
              page that animates and a page that played an animation once.

              They do not collide: the wipe is a `clip-path` on this box against
              the section's `--scene` timeline, the pan is a `transform` on the
              <img> inside against its own `view()`. Different properties,
              different elements, different timelines. */}
          <div
            data-scene-part="uncover"
            data-scroll="photo-pan"
            style={{ ['--scene-from' as string]: 'cover 18%', ['--scene-to' as string]: 'cover 52%' }}
            className="col-span-4 mt-10 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-0"
          >
            <Photo
              file={photos.careers.file}
              alt={photos.careers.alt}
              width={photos.careers.w}
              height={photos.careers.h}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[3/2]"
            />
          </div>
        </Grid>
      </Container>
    </section>
  )
}
