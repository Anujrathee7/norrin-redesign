import { useId, type FormEvent, type InputHTMLAttributes } from 'react'
import { Container, Eyebrow, Grid } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { contactEmail, contacts, photos } from '@/data/norrin'
import { cx } from '@/lib/cx'
import { Link } from 'react-router'

/**
 * Closing CTA.
 *
 * The production line, which has been dashed and then solid across the whole
 * page, finally runs edge to edge and terminates in a filled sun square. The
 * line is drawn on scroll, so the gesture completes as the reader arrives.
 *
 * THE BAND STANDS ON THE CAUSEWAY. `photos.vision` — a road crossing a lake to
 * the far shore — used to sit above Pillars as a strip with no heading and no
 * job (`PhotoInterlude`, deleted). Under the ask to reach production it has
 * one: it is the crossing the whole page has been describing. Chosen by the
 * repo owner from four rendered options (a blurred Gap backdrop, a reveal at
 * the end of the Gap, this, and a frame that opened in place).
 *
 * It sits under a flat `--scrim`, which is a treatment of a Norrin photograph
 * and so an explicit exception to CLAUDE.md §1.8, recorded there. The scrim is
 * 76% for a measured reason: type has to pass against the LIGHTEST pixel it
 * can land on (WCAG F83), and the pairs are gated in `tools/palette.mjs`.
 * `bg-inverse` stays on the section as the ground a still-loading image leaves.
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
 * FORM LEFT, PEOPLE RIGHT. Picked by the repo owner from four rendered layouts
 * (people stacked beside the form, a wide form under the people, a row of three
 * portraits, and this). The previous version put the ask on one row and three
 * portrait cards under it, which left the right half of the band empty. Now the
 * ask and a form hold the left, and the people — named humans rather than a
 * faceless form alone, since a name is a lower-anxiety ask for an enterprise
 * buyer than "submit" — hold the right, stepped in two columns.
 *
 * NO LINES, ANYWHERE IN THE BAND. Not over the group, not under a title, not
 * under a link, not under a field. The repo owner's verdict on separator rules
 * here was that they made it look generated, and the contact sections studied
 * (Siili, Bekk, Futurice, NoA Ignite, Clearleft) part the same content with a
 * real heading, space and type contrast instead. Fields are filled
 * (`--inverse-field`), not underlined — a bottom-border input is the same rule.
 */
export function Contact() {
  return (
    <section
      id="contact"
      data-shot="contact"
      aria-labelledby="contact-heading"
      data-tone="inverse"
      className="relative isolate overflow-clip bg-inverse py-12 text-inverse-ink md:py-14"
    >
      {/* `isolate` so the two negative layers stay inside the band — without a
          stacking context of its own they would drop behind the page. */}
      <div className="absolute inset-0 -z-20">
        <Photo
          file={photos.vision.file}
          alt={photos.vision.alt}
          width={photos.vision.w}
          height={photos.vision.h}
          sizes="100vw"
          frame={false}
          className="h-full w-full"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim" />

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
        <Grid className="gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-6">
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
              <Eyebrow label="Next" tone="inverse" className="mb-3" />
            </div>
            <h2
              id="contact-heading"
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 14%',
                ['--scrub-to' as string]: 'cover 38%',
              }}
              className="display-3"
            >
              Let&rsquo;s talk about what it takes to reach production.
            </h2>
            <p
              data-scroll="enter"
              style={{
                ['--scrub-from' as string]: 'cover 18%',
                ['--scrub-to' as string]: 'cover 42%',
              }}
              className="body-serif measure-serif mt-3 text-inverse-ink-2"
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
              className="mt-5"
            >
              <ContactForm />
            </div>
          </div>

          {/* Compact contact rows rather than portrait cards. The names and
              direct details remain visible, while 80px square portraits keep
              the people recognisable without making this closing action feel
              like a second team section. The same row works at every width. */}
          <div className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
            <h3 className="display-4 text-inverse-ink">Who you&rsquo;ll reach</h3>
            <ul className="mt-4 grid grid-cols-1 gap-4">
              {contacts.map((c) => (
                <li
                  key={c.name}
                  data-scroll="enter"
                  style={{
                    ['--enter-y' as string]: '26px',
                    ['--scrub-from' as string]: 'cover 10%',
                    ['--scrub-to' as string]: 'cover 36%',
                  }}
                  className="flex items-center gap-4"
                >
                  <Photo
                    file={c.photo.file}
                    alt={c.photo.alt}
                    width={c.photo.w}
                    height={c.photo.h}
                    sizes="80px"
                    tone="inverse"
                    className="size-20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="display-4 text-inverse-ink">{c.name}</p>
                    <p className="label mt-1.5 text-inverse-ink-3">{c.title}</p>
                    {/* The visible text IS the address and the number, so each
                        link names itself — no "Email" label for a screen
                        reader to hear with nothing after it. Plain text, no
                        underline: the underline read as one more rule. */}
                    <div className="mt-2 flex flex-col items-start gap-0.5">
                      <a
                        href={`mailto:${c.email}`}
                        className="ui break-all text-inverse-ink-2 transition-colors hover:text-inverse-ink"
                      >
                        {c.email}
                      </a>
                      <a
                        href={`tel:${c.tel}`}
                        className="ui text-inverse-ink-2 transition-colors hover:text-inverse-ink"
                      >
                        {c.phone}
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

const fieldClass =
  'ui mt-1.5 block w-full rounded-(--radius-control) bg-inverse-field px-4 py-2.5 text-inverse-ink'

/**
 * THE FORM DOES NOT PRETEND TO SUBMIT ANYWHERE. There is no backend and no CRM
 * (the README lists CRM wiring among what a real build still needs), and a form
 * that swallows a message is a fabricated affordance under CLAUDE.md §3. So it
 * composes a `mailto:` from what was typed, and the line under the button says
 * that is what will happen. It replaces the old "Contact us" mailto button,
 * which went to the same address.
 *
 * Native inputs with real `<label>`s — nothing here is a Radix primitive, so
 * §2.1 has nothing to reach for, and no ARIA is hand-written.
 */
function ContactForm() {
  const id = useId()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const read = (key: string) => String(data.get(key) ?? '').trim()
    const subject = `Enquiry from ${read('name')}${read('company') ? `, ${read('company')}` : ''}`
    const body = `${read('message')}\n\n${read('name')}\n${read('email')}`
    window.location.href = `mailto:${contactEmail.address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Field id={`${id}-name`} name="name" label="Name" autoComplete="name" required />
      <Field id={`${id}-email`} name="email" label="Work email" type="email" autoComplete="email" required />
      <Field
        id={`${id}-company`}
        name="company"
        label="Company"
        autoComplete="organization"
        containerClassName="sm:col-span-2 lg:col-span-1"
      />
      <div className="sm:col-span-2 lg:col-span-3">
        <label htmlFor={`${id}-message`} className="ui text-inverse-ink-2">
          What are you trying to get into production?
        </label>
        <textarea id={`${id}-message`} name="message" required rows={2} className={cx(fieldClass, 'resize-y')} />
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="btn btn-signal">
            Send enquiry
          </button>
          {/* A ROUTE, NOT A FRAGMENT. This read `href="#thinking"` back when
              Thinking sat on the same page; on every route without that section
              it pointed at nothing and threw the reader to scrollY 0 — a
              fabricated affordance in §3's own words. The paper lives on
              /company, so the link goes there. */}
          <Link to="/company#thinking" className="btn btn-ghost">
            Or start with the Vision Paper
          </Link>
        </div>
        <p className="caption mt-3 text-inverse-ink-3">Sending opens your email app with this filled in.</p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  containerClassName,
  ...rest
}: {
  id: string
  label: string
  containerClassName?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="ui text-inverse-ink-2">
        {label}
      </label>
      <input id={id} className={fieldClass} {...rest} />
    </div>
  )
}
