import { Container, Eyebrow, Grid } from '@/components/primitives/Layout'
import { Reveal } from '@/components/primitives/Reveal'
import { useDrawLine } from '@/hooks/useDrawLine'
import { contactEmail, contacts } from '@/data/norrin'
import { Nori } from '@/components/mascot/nori/Nori'

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
 * Note the sea mark is gone from this file. Nori waves here instead — the
 * primary call to action: it would compete with the only click that matters.
 *
 * Named humans rather than a faceless form — Norrin publishes these people and
 * their titles, and a named contact is a materially lower-anxiety ask for an
 * enterprise buyer than "submit".
 */
export function Contact() {
  const line = useDrawLine<SVGLineElement>(0.1)

  return (
    <section
      id="contact"
      data-shot="contact"
      aria-labelledby="contact-heading"
      data-tone="inverse"
      className="relative overflow-hidden bg-inverse py-24 text-inverse-ink md:py-36"
    >
      {/* The line completes. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4" aria-hidden="true">
        <svg className="h-4 w-full" viewBox="0 0 1000 16" preserveAspectRatio="none">
          <line
            ref={line}
            x1="0"
            y1="8"
            x2="1000"
            y2="8"
            stroke="var(--signal)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Held back until the rule has actually arrived — otherwise it reads
            as an orphaned square floating in the corner. */}
        <Reveal delay={1.15}>
          {/* Sits fully inside the band — a negative translate put half of it
              above the section edge, where overflow-hidden clipped it. */}
          <div className="absolute top-[3px] right-0 h-2.5 w-2.5 bg-signal" />
        </Reveal>
      </div>

      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-7">
            <Eyebrow index="07" label="Next" tone="inverse" className="mb-8" />
            <h2 id="contact-heading" className="display-2">
              Let&rsquo;s talk about what it takes to reach production.
            </h2>
            <p className="lead measure-serif mt-8 text-inverse-ink-2">
              Bring the pilot that stalled, the platform that needs rebuilding, or the roadmap you
              haven&rsquo;t written yet.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2">
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

          {/* Named humans. No headshots — we hold no rights to their images. */}
          <div className="col-span-4 mt-16 self-end md:col-span-4 md:col-start-9 md:mt-0">
            <Nori pose="wave" size={132} className="mb-8 block" />
            <p className="label mb-6 text-inverse-ink-3">Who you&rsquo;ll reach</p>
            <ul className="border-t border-inverse-hairline-strong">
              {contacts.map((c) => (
                <li
                  key={c.name}
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
