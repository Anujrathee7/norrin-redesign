import { Container, Eyebrow, Grid } from '@/components/primitives/Layout'
import { contactEmail, contacts } from '@/data/norrin'

/**
 * Closing CTA.
 *
 * The production line, which has been dashed and then solid across the whole
 * page, finally runs edge to edge and terminates in a filled sun square. The
 * line is drawn on scroll, so the gesture completes as the reader arrives.
 *
 * The CTA stays sun. Moving it to moss to "spend less sun" was considered and
 * rejected on measurement: moss on forest is 1.40:1, so the button's shape would
 * have disappeared into the band — the same failure the focus ring has on these
 * sections. On an inverse ground sun is the stand-in for moss, not a budget
 * spend. The budget is stated once, in index.css, where it can be counted.
 *
 * No mascot in this section. The sea mark went first, then Nori pointing at the
 * contact list went too: this band exists to produce one click, and a drawing
 * beside the only call to action on the page competes with it for the eye at
 * the exact moment you want nothing else in the way.
 *
 * Named humans rather than a faceless form — Norrin publishes these people and
 * their titles, and a named contact is a materially lower-anxiety ask for an
 * enterprise buyer than "submit".
 */
export function Contact() {
  return (
    <section
      id="contact"
      data-shot="contact"
      aria-labelledby="contact-heading"
      data-tone="inverse"
      className="relative overflow-clip bg-inverse py-20 text-inverse-ink md:py-28"
    >
      {/* The line completes. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4" aria-hidden="true">
        <svg className="h-4 w-full" viewBox="0 0 1000 16" preserveAspectRatio="none">
          {/* `pathLength={1}` restates the line's length as 1 for dash maths,
              and that is the whole reason this no longer needs JavaScript.
              Measuring the real length was the one thing `useDrawLine` existed
              for: an IntersectionObserver, a `getTotalLength()` call and a
              transition, to draw a single stroke once and never again.
              Normalised to 1 the dash pattern is a constant a stylesheet can
              state, so the draw becomes scroll-driven like everything else here
              and runs backwards on the way up. */}
          {/* NO `vectorEffect="non-scaling-stroke"` here, and that is the whole
              reason this rule now reaches the square at the end of it.

              `non-scaling-stroke` moves stroke geometry into SCREEN space, and
              dashing goes with it. The viewBox is 1000 wide and stretched to
              the full band by `preserveAspectRatio="none"`, so a dash covering
              the path's 1000 units was being painted as 1000 SCREEN pixels
              across a rule that renders 1512px on a laptop and 1920px on a
              desktop. Hit-tested: the stroke stopped dead at 998px — 66%
              coverage at 1512, 52% at 1920 — while `stroke-dashoffset` sat at
              0 and every measurement in the DOM insisted it was finished. The
              closing gesture of the whole page had never once arrived at its
              own terminus on a wide screen, which is what made the sun square
              look orphaned in the corner.

              Removing it costs nothing: the svg is `h-4`, 16px, against a
              viewBox 16 units tall, so the vertical scale is exactly 1 and a
              horizontal line's stroke width is already 1px without any help.
              Only the x axis is stretched, and stroke width does not live on
              that axis. */}
          {/* Drawn over 40% of the rule's own pass rather than the layer's
              default 30%. At 30% it was finished 275px after the band's first
              pixel appeared — the closing gesture of the page completing before
              you had read a word of what it closes. */}
          <line
            data-scroll="draw-line"
            pathLength={1}
            style={{
              ['--scrub-from' as string]: 'cover 10%',
              ['--scrub-to' as string]: 'cover 46%',
            }}
            x1="0"
            y1="8"
            x2="1000"
            y2="8"
            stroke="var(--signal)"
            strokeWidth="1"
          />
        </svg>
        {/* Held back until the rule has actually arrived — otherwise it reads
            as an orphaned square floating in the corner. That used to be a
            1.15s delay chasing a 1.3s transition; it is a scroll range now that
            opens after the draw's has closed, which is the same intent stated
            in the units the line itself is measured in. */}
        {/* Sits fully inside the band — a negative translate put half of it
            above the section edge, where overflow-clip clipped it. */}
        {/* `pop`, not `enter`: `enter` only ever slides, so the square would be
            sitting in the corner from the moment the band appeared while the
            rule was still crawling towards it — measured at two thirds drawn
            with the terminus already fully in place. It is inside an
            `aria-hidden` wrapper and carries no text, which is what makes it
            eligible to fade. Its window opens just after the draw's closes. */}
        <div
          data-scroll="pop"
          style={{
            ['--scrub-from' as string]: 'cover 48%',
            ['--scrub-to' as string]: 'cover 56%',
          }}
          className="absolute top-[3px] right-0 h-2.5 w-2.5 bg-signal"
        />
      </div>

      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-7">
            {/* This column had no entrance at all — it was the one band on the
                page that simply appeared. Each line now runs off its own scroll
                range with an index offset, so the ask assembles as you arrive at
                it and comes apart again if you scroll back up. */}
            <div
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 10%',
                ['--scrub-to' as string]: 'cover 34%',
              }}
            >
              <Eyebrow index="08" label="Next" tone="inverse" className="mb-8" />
            </div>
            <h2
              id="contact-heading"
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 14%',
                ['--scrub-to' as string]: 'cover 38%',
              }}
              className="display-2"
            >
              Let&rsquo;s talk about what it takes to reach production.
            </h2>
            <p
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 18%',
                ['--scrub-to' as string]: 'cover 42%',
              }}
              className="lead measure-serif mt-8 text-inverse-ink-2"
            >
              Bring the pilot that stalled, the platform that needs rebuilding, or the roadmap you
              haven&rsquo;t written yet.
            </p>

            <div
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 22%',
                ['--scrub-to' as string]: 'cover 46%',
              }}
              className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2"
            >
              <a
                href={`mailto:${contactEmail.address}`}
                className="btn btn-signal"
              >
                Contact us
              </a>
              <a
                href="#thinking"
                className="btn btn-ghost"
              >
                Or start with the Vision Paper
              </a>
            </div>
          </div>

          {/* Named humans. No headshots — we hold no rights to their images.

              CENTRED AGAINST THE COPY, not pinned to its foot. This was
              `self-end`, which bottom-aligned the roster with the CTA row and
              left roughly 230px of empty band above it — the column reading as
              though it had slipped down rather than been placed. The left
              column runs headline, lede, then buttons; this list is about half
              its height, so centring is what makes the two read as a pair.

              `md:` only. Below that the column has stacked underneath and there
              is nothing left to centre against. */}
          <div className="col-span-4 mt-16 md:col-span-4 md:col-start-9 md:mt-0 md:self-center">
            {/* One label at every width. Nori used to point at it from the row
                above, which meant this column carried two copies of the same
                three words plus a `md:` branch to choose between them. The
                drawing is gone — see the note at the top of this file — and the
                branch went with it. */}
            <p className="label mb-6 text-inverse-ink-3">Who you&rsquo;ll reach</p>
            <ul className="border-t border-inverse-hairline-strong">
              {contacts.map((c, i) => (
                <li
                  key={c.name}
                  data-scroll="enter"
                  style={{
                    ['--enter-y' as string]: '26px',
                    ['--scrub-from' as string]: `cover ${10 + i * 4}%`,
                    ['--scrub-to' as string]: `cover ${10 + i * 4 + 26}%`,
                  }}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-inverse-hairline-strong py-4"
                >
                  <span>{c.name}</span>
                  <span className="label text-inverse-ink-3">{c.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
