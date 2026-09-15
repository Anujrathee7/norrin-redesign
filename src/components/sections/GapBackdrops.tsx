import type { ReactNode } from 'react'
import { Container, Eyebrow } from '@/components/primitives/Layout'
import { Photo } from '@/components/primitives/Photo'
import { ThemeToggle } from '@/components/primitives/ThemeToggle'
import { photos, positioning } from '@/data/norrin'

/**
 * `#backdrops` — seven ways The Gap could carry a picture behind it.
 *
 * A WORKBENCH, NOT A PROPOSAL. Nothing here is adopted. It exists so the choice
 * between these is made by looking at seven rendered options in both themes,
 * rather than by describing them, which is the same reason `#compare` exists
 * rather than living in `docs/`.
 *
 * ---------------------------------------------------------------------------
 * WHERE THE PICTURES CAME FROM, because this is the part worth being straight
 * about.
 *
 * The brief was "get some cool gifs from the internet, some cartoon or manga
 * style". None of the backdrops here are that, and the reason is not squeamish-
 * ness about scope:
 *
 *   1. THE REFERENCE IMAGE IS ALREADY NORRIN'S. The causeway-over-a-lake shot
 *      that prompted this is `photos.vision` — it is on norrin.com, it is
 *      already committed to this repo at three widths in three formats, and it
 *      is the single best picture of this section's own argument that exists.
 *      Two more aerials of the same subject came with it: a road switchbacking
 *      down a hillside, and a river cutting between fields. Three real pathways,
 *      already licensed, already optimised. Going shopping for someone else's
 *      drone footage when the client's own is sitting in `public/photos` is the
 *      wrong trade.
 *
 *   2. A THIRD-PARTY GIF IS A LICENCE PROBLEM WEARING A DESIGN COSTUME. This is
 *      client-facing work for a named company. Footage pulled off the internet
 *      goes out under Norrin's name with no rights behind it, and "it was a
 *      mockup" stops being true the moment the mockup is shown to anyone.
 *
 *   3. MANGA AND CARTOON STYLE IS COVERED, but drawn rather than downloaded.
 *      Variants 05 and 06 are authored SVG — one line-art, one flat cel with a
 *      screentone field. Authored graphics are explicitly ours to treat freely,
 *      which is exactly why they can be stylised when the photographs cannot.
 *
 * If you want actual third-party footage in here, give me the source and the
 * licence and I will wire it in — that is a ten-minute job. I am not picking it
 * unilaterally.
 * ---------------------------------------------------------------------------
 *
 * THE ONE RULE NONE OF THESE BREAK: Norrin's photographs are never filtered,
 * tinted, duotoned or washed. Every variant below that puts type over a
 * photograph does it on a panel — a separate opaque object sitting on top —
 * and never by darkening the picture. That is not a technicality: a scrim
 * across a whole image is a treatment of the image, and treating a client's
 * photograph quietly makes it ours.
 *
 * It is also the thing that keeps this measurable. Text on a panel has a known
 * background and a real contrast ratio; text floating on a photograph has
 * whatever ratio that pixel happens to be, which axe cannot check and neither
 * can anyone else.
 */

/* ------------------------------------------------------------------ *
 * Shared parts
 * ------------------------------------------------------------------ */

/**
 * A compact stand-in for the section's rail, so heading placement can be
 * judged against the thing it has to share a composition with rather than in
 * isolation. Labels only — the serif captions are omitted on purpose, because
 * seven full copies of the section would make this page about reading and not
 * about looking.
 */
function MiniRail({ tone = 'paper' }: { tone?: 'paper' | 'inverse' }) {
  const dim = tone === 'inverse' ? 'text-inverse-ink-3' : 'text-ink-3'
  const on = tone === 'inverse' ? 'text-signal' : 'text-accent'
  const dash = tone === 'inverse' ? 'border-inverse-inactive' : 'border-inactive'
  const solid = tone === 'inverse' ? 'bg-signal' : 'bg-accent'
  const node = tone === 'inverse' ? 'bg-inverse-inactive' : 'bg-inactive'

  return (
    <ol className="relative">
      {['01 — Pilot', '02 — Deployment', '03 — Production'].map((s, i) => (
        <li key={s} className="relative pb-9 last:pb-12">
          <span
            aria-hidden="true"
            className={
              'absolute top-0 bottom-0 left-0 -translate-x-1/2 ' +
              (i === 2 ? 'w-px ' + solid : 'w-0 border-l border-dashed ' + dash)
            }
          />
          <span
            aria-hidden="true"
            className={
              'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ' +
              (i === 2 ? 'h-1.5 w-1.5 ' + solid : 'h-1 w-1 ' + node)
            }
          />
          <p className={'label -mt-2 pl-6 ' + (i === 2 ? on : dim)}>{s}</p>
        </li>
      ))}
    </ol>
  )
}

/**
 * The panel type sits on when it sits over a photograph.
 *
 * `--overlay` closed with `--hairline-strong` is the system's existing "lifted
 * off the page" plane — the one the locale list opens onto. Reusing it here
 * means the contrast pairs are already solved and already gated, instead of a
 * new translucent grey nobody has measured.
 *
 * OPAQUE, NOT TRANSLUCENT, and that is the difference between this and the
 * reference screenshot that started this page. A frosted panel takes its
 * contrast from whatever is behind it, which on a photograph is a different
 * number every few pixels and no number at all in a screenshot.
 */
function Plate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        'rounded-panel border border-hairline-strong bg-overlay p-8 md:p-10 ' + (className ?? '')
      }
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Authored backdrops — ours, so these may be stylised
 * ------------------------------------------------------------------ */

/**
 * 05 — line art. A causeway drawn in the page's own hairlines.
 *
 * This is `ContourField`'s language applied to a pathway instead of terrain:
 * survey convention, where a solid line is measured ground and a dashed one is
 * interpolated. It is the only backdrop here that is made of the same strokes
 * the rest of the page rules with, so it is the one that will never look
 * pasted on.
 */
function LineCauseway() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.55">
        {/* Shorelines. */}
        <path
          d="M0 232 C 210 208, 372 268, 520 300 S 852 322, 1040 268 S 1392 190, 1600 214"
          stroke="var(--hairline-strong)"
        />
        <path
          d="M0 470 C 232 452, 400 508, 596 486 S 940 420, 1128 452 S 1420 502, 1600 470"
          stroke="var(--hairline-strong)"
        />
        {/* Depth contours, dashed the way interpolated ones are. */}
        {[268, 306, 344, 382, 420].map((y, i) => (
          <path
            key={y}
            d={`M0 ${y} C 240 ${y - 18}, 430 ${y + 22}, 640 ${y + 8} S 1010 ${y - 20}, 1220 ${y + 6} S 1450 ${y + 18}, 1600 ${y - 4}`}
            stroke={i === 2 ? 'var(--hairline-strong)' : 'var(--hairline)'}
            strokeDasharray={i === 2 ? undefined : '5 8'}
          />
        ))}
      </g>
      {/* The road itself: the page's device at map scale — provisional on the
          approach, committed across the crossing. */}
      <g fill="none" strokeWidth="2.5" vectorEffect="non-scaling-stroke">
        <path
          d="M0 612 C 190 596, 300 520, 452 470 S 660 386, 800 350"
          stroke="var(--inactive)"
          strokeDasharray="10 12"
        />
        <path
          d="M800 350 C 940 314, 1130 250, 1290 186 S 1500 104, 1600 86"
          stroke="var(--accent)"
        />
      </g>
      <rect x="794" y="344" width="12" height="12" fill="var(--accent)" />
    </svg>
  )
}

/**
 * 06 — flat cel, with a screentone field. The manga-adjacent one.
 *
 * Posterised into four flats and one halftone, which is what makes it read as
 * drawn rather than rendered: no gradient, no blur, hard edges only. The tone
 * is a real SVG pattern rather than a texture image, so it re-themes itself
 * with the palette and costs nothing to ship.
 *
 * This is allowed to be this stylised for exactly one reason — it is ours.
 * The same treatment applied to `photos.vision` would be the rule this whole
 * page is careful about.
 */
function CelCauseway() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="bd-tone" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2.2" cy="2.2" r="1.5" fill="var(--hairline-strong)" />
        </pattern>
      </defs>
      {/* Water: the page ground, left bare. */}
      <rect width="1600" height="700" fill="var(--ground)" />
      {/* Two land masses as flats. */}
      <path
        d="M0 0 H1600 V132 C 1380 176, 1180 132, 980 168 S 618 244, 392 210 S 130 150, 0 176 Z"
        fill="var(--surface)"
      />
      <path
        d="M0 700 H1600 V536 C 1372 502, 1156 566, 936 540 S 590 458, 344 496 S 118 556, 0 528 Z"
        fill="var(--surface)"
      />
      {/* Screentone over the lower mass only — depth by density, the way a cel
          does it, rather than by value. */}
      <path
        d="M0 700 H1600 V536 C 1372 502, 1156 566, 936 540 S 590 458, 344 496 S 118 556, 0 528 Z"
        fill="url(#bd-tone)"
        opacity="0.6"
      />
      {/* Shorelines, inked. */}
      <g fill="none" strokeWidth="3" vectorEffect="non-scaling-stroke" stroke="var(--ink)">
        <path d="M1600 132 C 1380 176, 1180 132, 980 168 S 618 244, 392 210 S 130 150, 0 176" />
        <path d="M1600 536 C 1372 502, 1156 566, 936 540 S 590 458, 344 496 S 118 556, 0 528" />
      </g>
      {/* The causeway, crossing the water. Dashed approach, solid crossing. */}
      <g fill="none" strokeWidth="7" vectorEffect="non-scaling-stroke" strokeLinecap="square">
        <path
          d="M232 700 C 300 600, 352 556, 430 508 S 596 424, 700 386"
          stroke="var(--inactive)"
          strokeDasharray="16 18"
        />
        <path d="M700 386 C 830 338, 1000 272, 1130 218 S 1360 140, 1470 96" stroke="var(--accent)" />
      </g>
      <rect x="686" y="372" width="28" height="28" fill="var(--accent)" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * The frame each variant is shown in
 * ------------------------------------------------------------------ */

type VariantProps = {
  n: string
  title: string
  /** What the treatment is, in one line. */
  what: string
  /** What it costs, or what to watch. Honest, not a sales note. */
  cost: string
  children: ReactNode
}

function Variant({ n, title, what, cost, children }: VariantProps) {
  return (
    <section className="border-t border-hairline pt-10 pb-20">
      <Container>
        <div className="mb-6 grid grid-cols-4 gap-x-6 md:grid-cols-12">
          <p className="label col-span-4 text-ink-3 md:col-span-2">
            <span className="tabular-nums">{n}</span>
          </p>
          <h2 className="label col-span-4 text-accent md:col-span-3">{title}</h2>
          <p className="caption col-span-4 text-ink-2 md:col-span-4">{what}</p>
          <p className="caption col-span-4 text-ink-3 md:col-span-3">{cost}</p>
        </div>
      </Container>
      {children}
    </section>
  )
}

/** The height every variant is shown at, so they compare like for like. */
const STAGE = 'relative h-[640px] overflow-clip md:h-[720px]'

export function GapBackdrops() {
  const vision = photos.vision
  const process = photos.process
  const change = photos.change

  return (
    <>
      <a href="#backdrops-main" className="skip-link">
        Skip to content
      </a>

      <header className="border-b border-hairline py-6">
        <Container className="flex items-center justify-between gap-6">
          <a href="/" className="wordmark control -mx-2 px-2 py-1">
            Norrin <span className="text-ink-3">gap backdrops</span>
          </a>
          <ThemeToggle />
        </Container>
      </header>

      <main id="backdrops-main">
        <Container>
          <div className="max-w-[62ch] py-16 md:py-24">
            <Eyebrow label="Workbench" className="mb-7" />
            <h1 className="display-3">Seven backdrops for the gap.</h1>
            <p className="lead measure-serif mt-7 text-ink-2">
              Each one is the same claim and the same rail, placed and set differently for the
              picture behind it. Nothing here is adopted. Flip the theme with the control above —
              a backdrop that only works in one theme has not been solved.
            </p>
            <p className="caption mt-6 text-ink-3">
              Backdrops 01–04 and 07 use Norrin&rsquo;s own aerials, already in this repo:
              the causeway that prompted this, a switchback road, and a river through fields.
              05 and 06 are drawn. No photograph on this page is filtered, tinted or washed —
              where type sits over one, it sits on an opaque panel, which is also the only way
              its contrast can be measured.
            </p>
          </div>
        </Container>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="01"
          title="Causeway, panel low-left"
          what="Full-bleed photograph, claim on an opaque panel in the lower left, display-3."
          cost="Closest to the reference. The panel covers a third of the picture — the more it protects the type, the less photograph is left."
        >
          <div className={STAGE}>
            <Photo
              file={vision.file}
              alt={vision.alt}
              width={vision.w}
              height={vision.h}
              sizes="100vw"
              frame={false}
              loading="eager"
              className="absolute inset-0 h-full w-full"
            />
            <Container className="relative flex h-full items-end pb-14">
              <Plate className="max-w-[46ch]">
                <Eyebrow label="The gap" />
                <h3 className="display-3 mt-4">{positioning.thesisOpening}</h3>
              </Plate>
            </Container>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="02"
          title="Switchback, panel high-right"
          what="Photograph panned slowly on scroll. Claim top-right, right-aligned, thesis size."
          cost="The pan is the honest version of “make it a gif” — Norrin's own frame, moving. Right-aligned display type is the least forgiving setting here."
        >
          <div className={STAGE}>
            <div data-scroll="photo-pan" className="absolute inset-0">
              <Photo
                file={process.file}
                alt={process.alt}
                width={process.w}
                height={process.h}
                sizes="100vw"
                frame={false}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <Container className="relative flex h-full items-start pt-14">
              <div className="ml-auto">
                <Plate className="max-w-[40ch] text-right">
                  <Eyebrow label="The gap" className="justify-end" />
                  <h3 className="thesis mt-4">{positioning.thesisOpening}</h3>
                </Plate>
              </div>
            </Container>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="03"
          title="Split — picture left, page right"
          what="Photograph holds the left 55% and bleeds off that edge. Claim and rail on paper, no panel, display-2."
          cost="The only variant with zero type over photograph, so nothing about its contrast is a judgement call. Also the least dramatic."
        >
          <div className={STAGE}>
            <div className="grid h-full grid-cols-12">
              <div className="relative col-span-7">
                <Photo
                  file={vision.file}
                  alt={vision.alt}
                  width={vision.w}
                  height={vision.h}
                  sizes="58vw"
                  frame={false}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="col-span-5 flex flex-col justify-center bg-ground py-12 pr-(--spacing-gutter) pl-10">
                <Eyebrow label="The gap" />
                <h3 className="display-2 mt-4 max-w-[16ch]">{positioning.thesisOpening}</h3>
                <div className="mt-10">
                  <MiniRail />
                </div>
              </div>
            </div>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="04"
          title="Picture as a band, rail crossing it"
          what="River aerial as a horizontal band through the middle. Claim on paper above, rail runs down across the band."
          cost="Keeps the page's flat planes and adds one picture — the least disruptive to the system. The rail crossing the photo needs checking against the water, where it is nearly the same value."
        >
          <div className={STAGE + ' bg-ground'}>
            <div className="absolute inset-x-0 top-[38%] h-[42%]">
              <Photo
                file={change.file}
                alt={change.alt}
                width={change.w}
                height={change.h}
                sizes="100vw"
                frame={false}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <Container className="relative grid h-full grid-cols-12 gap-x-6 pt-14">
              <div className="col-span-6">
                <Eyebrow label="The gap" />
                <h3 className="thesis mt-4 max-w-[20ch]">{positioning.thesisOpening}</h3>
              </div>
              <div className="col-span-5 col-start-8">
                <MiniRail />
              </div>
            </Container>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="05"
          title="Drawn — line art"
          what="No photograph. The causeway drawn in the page's own hairlines, survey convention, dashed approach and solid crossing."
          cost="The only backdrop made of the same strokes as the rest of the page, so it can never look pasted on. Quiet — it will not carry a hero moment on its own."
        >
          <div className={STAGE + ' bg-ground'}>
            <LineCauseway />
            <Container className="relative grid h-full grid-cols-12 items-center gap-x-6">
              <div className="col-span-6">
                <Eyebrow label="The gap" />
                <h3 className="display-2 mt-4 max-w-[15ch]">{positioning.thesisOpening}</h3>
              </div>
              <div className="col-span-4 col-start-9">
                <MiniRail />
              </div>
            </Container>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="06"
          title="Drawn — flat cel and screentone"
          what="Posterised flats, inked shorelines, halftone on the near land mass. Claim set large over it, display-1."
          cost="This is the cartoon/manga direction, drawn rather than sourced — which is why it is allowed to be this stylised. Furthest from the rest of the site; judge whether that is range or a second brand."
        >
          <div className={STAGE + ' bg-ground'}>
            <CelCauseway />
            <Container className="relative flex h-full flex-col justify-center">
              <Eyebrow label="The gap" />
              <h3 className="display-1 mt-4 max-w-[13ch]">{positioning.thesisOpening}</h3>
            </Container>
          </div>
        </Variant>

        {/* ---------------------------------------------------------------- */}
        <Variant
          n="07"
          title="The road is the line"
          what="Causeway photograph, with the production rule tracked onto the road itself — dashed over the approach, solid across the built crossing."
          cost="The strongest idea here and the most fragile: the overlay is hand-placed against one crop, so it comes apart at other aspect ratios. Worth it only if the crop is pinned."
        >
          <div className={STAGE}>
            <Photo
              file={vision.file}
              alt={vision.alt}
              width={vision.w}
              height={vision.h}
              sizes="100vw"
              frame={false}
              className="absolute inset-0 h-full w-full"
            />
            {/* The device, laid along the causeway. Values are eyeballed against
                the 1920 crop and are the reason the note above says this is
                fragile — nothing here is derived from the image. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1600 720"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <g fill="none" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="square">
                <path
                  d="M40 668 C 200 640, 330 600, 470 556 S 640 512, 700 496"
                  stroke="var(--signal)"
                  strokeDasharray="12 14"
                />
                <path d="M700 496 C 900 452, 1120 300, 1300 176 S 1520 84, 1600 62" stroke="var(--signal)" />
              </g>
              <rect x="688" y="484" width="24" height="24" fill="var(--signal)" />
            </svg>
            <Container className="relative flex h-full items-start pt-14">
              <Plate className="max-w-[34ch]">
                <Eyebrow label="The gap" />
                <h3 className="thesis mt-4">{positioning.thesisOpening}</h3>
              </Plate>
            </Container>
          </div>
        </Variant>

        <Container>
          <div className="max-w-[62ch] border-t border-hairline py-16">
            <h2 className="display-4">What to decide.</h2>
            <p className="body-serif mt-5 text-reading">
              Three questions, in the order they matter. Does the section want a picture at all, or
              is 05 enough? If it wants one, does the type sit on the picture (01, 02, 07) or beside
              it (03, 04)? And is 06 range or a second brand?
            </p>
            <p className="caption mt-6 text-ink-3">
              Whichever wins still has to pass the same gates as everything else: axe in both
              themes, the palette pairs, and a hand check of focus rings. Type over a photograph
              only has a measurable ratio because every variant here puts it on an opaque panel.
            </p>
          </div>
        </Container>
      </main>
    </>
  )
}
