import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Scenes that are ALREADY on screen at first paint arrive without a scroll.
 *
 * The scroll layer's fail-safe is written for the browser that has no scroll
 * timelines at all: it never enters `@supports (animation-timeline: view())`,
 * so nothing is ever hidden. That contract is real, and it is not the one that
 * broke.
 *
 * In a browser that DOES support them, `[data-scene-part]` carries
 * `animation-fill-mode: both`, so a part sits pinned at its FROM state until
 * its range opens. The ranges are written in `cover`/`contain` — measured from
 * the moment the scene crosses the viewport edge — which silently assumes the
 * scene scrolled in from below. A scene sitting in the first viewport at load
 * never had that runway, so its parts hold their diminished state until the
 * reader scrolls, and a reader who never scrolls never sees them.
 *
 * MEASURED, at 1728x1150 on `/work`, at scroll zero: the Roles heading sat in
 * a 107px `overflow: hidden` mask with its line translated 110px down — fully
 * out of view — and the "Scope" eyebrow, in a 17px mask translated 11.5px, was
 * rendering as a horizontal slice of itself. `cover` progress at that scroll
 * position is 23% against a range opening at 28%: short by about 92px of
 * scroll that the top of a document does not have.
 *
 * The fix marks those parts arrived and lets them render at their resting
 * state, which is the finished one — the same shape as `Reveal`'s own
 * first-paint check, for the same defect on the other code path.
 *
 * TWO ATTRIBUTES, ONE DEFECT. `[data-scene-part]` reads the shared `--scene`
 * timeline; `[data-scroll]` reads the element's OWN `view()`. They are
 * different timelines with identical failure: a `cover`/`contain` range that
 * has not opened at scroll zero. The first pass here handled only the named
 * one, and `/company` at 1728x1150 showed the cost — the Thinking heading
 * arrived and the NorrInsights grid beneath it, a `data-scroll="uncover"`,
 * stayed clipped to nothing at 12.6% of a range that opens at 16%.
 *
 * PINNED SCENES ARE EXCLUDED, and that exclusion is the whole reason this is a
 * per-part check rather than a per-scene one. A `[data-scene-runway]` is a tall
 * box whose sticky child advances THROUGH stages as it is scrolled; its parts
 * are a sequence, not an arrival, and dropping their animation would render
 * every stage at once on top of itself. A pinned scene also cannot exhibit the
 * bug: its runway guarantees the scroll distance the range is measured against.
 */
export function useSceneArrival() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Nothing to correct where the block never applies: without scroll-timeline
    // support the parts are never animated in the first place.
    if (typeof CSS === 'undefined' || !CSS.supports?.('animation-timeline: view()')) return
    if (typeof IntersectionObserver === 'undefined') return

    let marked = 0
    let armed = true

    const arrive = (part: HTMLElement) => {
      if (!armed || part.dataset.sceneArrived === 'true') return
      /* Staggered by position in the run, so the section arrives as a sequence
         rather than as one block that all moves at once — the same reading
         `Reveal`'s own `stagger` gives its children. Capped so a long run
         cannot push its last part into a wait the reader notices. */
      part.style.setProperty('--arrive-delay', `${Math.min(marked * 0.06, 0.36)}s`)
      part.dataset.sceneArrived = 'true'
      marked += 1
    }

    /* ASK THE BROWSER WHETHER IT IS ON SCREEN; DO NOT GUESS WHEN TO MEASURE.
       Three earlier versions of this read `getBoundingClientRect()` on a
       schedule — two animation frames, then `load`, then `fonts.ready`, then a
       ResizeObserver on the body. Every one of them missed the same case: at
       768x1024 on `/company` the NorrInsights grid settles at top 1010,
       fourteen pixels inside the viewport, and the reflow that lifts it there
       lands after all four signals and does not change the body's height, so
       the observer never fired either. The predicate was right the whole time —
       measured `wouldMark: true` at rest — and it was never asked.
       An IntersectionObserver is the thing that cannot be early: it reports the
       current state when it starts AND again whenever layout changes that
       state, which is exactly the question being asked. */
    const owner = new WeakMap<Element, HTMLElement>()
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const part = owner.get(entry.target)
        if (part) arrive(part)
        io.unobserve(entry.target)
      }
    })

    for (const part of document.querySelectorAll<HTMLElement>('[data-scene-part], [data-scroll]')) {
      /* PINNED SCENES ARE EXCLUDED, and that exclusion is why this is a
         per-part check rather than a per-scene one. A `[data-scene-runway]` is a
         tall box whose sticky child advances THROUGH stages as it is scrolled;
         its parts are a sequence, not an arrival, and dropping their scroll
         animation would render every stage at once on top of itself. A pinned
         scene also cannot exhibit the bug: its runway guarantees the scroll
         distance its ranges are measured against. */
      if (part.closest('[data-scene-runway], [data-scene-pin]')) continue

      owner.set(part, part)
      io.observe(part)

      /* The part's OWN box is the transformed one — a masked line reports the
         position it has been pushed to, not the one it occupies in layout — so
         a line shoved far enough down reads as off-screen while the mask
         holding it is plainly in view. Observing the mask as well covers that.
         ONLY A REAL MASK MAY VOUCH. Letting any parent do it was too generous
         by exactly the case it was meant to catch: on `/work` at 860px tall it
         marked a Roles card 177px BELOW the fold, because its parent is the
         section's full-height container. That part then spends its entrance
         while nobody is looking. A mask is `overflow: hidden` AND close to the
         child's own height; a tall container is neither. */
      const host = part.parentElement
      if (!host) continue
      const hb = host.getBoundingClientRect()
      const ownH = part.getBoundingClientRect().height
      if (getComputedStyle(host).overflow === 'hidden' && hb.height <= ownH * 1.75 + 8) {
        owner.set(host, part)
        io.observe(host)
      }
    }

    /* THE SCROLL GATE. The defect is content sitting in the FIRST viewport;
       everywhere else the scroll ranges work exactly as written. Without this,
       the observer would keep firing as the reader scrolls and swap their
       scroll choreography for a time-based entrance they never asked for —
       which is the `/company` complaint in a new costume. */
    const disarm = () => {
      armed = false
      io.disconnect()
    }
    window.addEventListener('scroll', disarm, { passive: true, once: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', disarm)
    }
  }, [pathname])
}
