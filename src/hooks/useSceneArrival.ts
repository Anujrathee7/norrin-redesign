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

    let raf = 0
    const mark = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      const onScreen = (r: DOMRect | undefined) => !!r && r.top < vh && r.bottom > 0

      for (const part of document.querySelectorAll<HTMLElement>('[data-scene-part], [data-scroll]')) {
        if (part.dataset.sceneArrived === 'true') continue
        if (part.closest('[data-scene-runway], [data-scene-pin]')) continue

        /* The part's OWN box is the transformed one — a masked line reports the
           position it has been pushed to, not the position it occupies in
           layout — so a line shoved far enough down can read as off-screen
           while the mask holding it is plainly in view. Its parent is that
           mask. Either box counts, because the failure this guards against is
           content staying hidden, and every ambiguity here resolves toward
           showing it. */
        if (onScreen(part.getBoundingClientRect()) || onScreen(part.parentElement?.getBoundingClientRect())) {
          part.dataset.sceneArrived = 'true'
        }
      }
    }

    // Two frames: one for the route's own layout, one for the fonts and images
    // that move it. Reading rects in the first frame after a route change
    // measures a page that has not finished being placed.
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(mark)
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])
}
