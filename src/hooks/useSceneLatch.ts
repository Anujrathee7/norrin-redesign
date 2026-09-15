import { useEffect } from 'react'
import type { RefObject } from 'react'

/** How long an interrupted part takes to finish once the reader turns back. */
const FINISH_MS = 260

/**
 * A scene that plays on the way down and never rewinds on the way up.
 *
 * Scroll ranges are reversible by construction: scrolling back up runs every
 * `[data-scene-part]` the other way, so the Track record's cards re-covered and
 * its rail un-drew as the reader went back to look at it. The repo owner asked
 * for the sequence to play every time the reader scrolls down through it, and
 * not to play backwards when they scroll up.
 *
 * THIS IS A LATCH, NOT A DRIVER, and the distinction is the §3 motion rule.
 * The animation is still the native CSS scroll timeline; nothing here moves an
 * element or reads scroll to decide a value. JS only ever takes a part OFF its
 * timeline, which renders it at its resting state — and the resting state is
 * the finished one, by the scroll layer's own fail-safe contract. So if this
 * never runs the page behaves exactly as it did before, reversible and
 * complete; there is no failure of it that can hide anything.
 *
 * THREE TRANSITIONS.
 *   - A part reaches the end of its range: marked, and `animation: none` holds
 *     it finished however the reader scrolls from there.
 *   - The reader turns back up while a part is part-way: rather than rewind, it
 *     moves onto the document timeline and finishes from where it stands over a
 *     quarter of a second, then latches. Snapping it would be a jump; leaving it
 *     scroll-bound would be the rewind this exists to remove. A part that has
 *     not started is left alone.
 *   - Every animated part is below the viewport — the reader has gone back
 *     above them: every latch is released, so the next pass down plays it
 *     again. This is the only moment a reset is invisible: nothing that moves
 *     is on screen, and every range is measured from the scene entering, so
 *     every part's scroll progress is already zero.
 *
 * Reduced motion needs no case: that block sets `animation: none`, so there is
 * no animation to find and every pass does nothing.
 */
export function useSceneLatch(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scene = ref.current
    if (!scene) return
    if (typeof CSS === 'undefined' || !CSS.supports?.('animation-timeline: view()')) return

    const parts = [...scene.querySelectorAll<HTMLElement>('[data-scene-part]')]
    let lastY = window.scrollY
    let frame = 0

    const latch = (part: HTMLElement) => {
      part.dataset.sceneLatched = 'true'
    }

    const finish = (part: HTMLElement, anim: Animation, progress: number) => {
      // Not 'true' yet: the CSS latch would cancel the animation mid-finish.
      part.dataset.sceneLatched = 'finishing'
      try {
        anim.timeline = document.timeline
        anim.effect?.updateTiming({ delay: 0, duration: FINISH_MS })
        anim.currentTime = progress * FINISH_MS
        anim.play()
        anim.finished.then(
          // A reset may have released this part while it was finishing.
          () => part.dataset.sceneLatched === 'finishing' && latch(part),
          () => {},
        )
      } catch {
        latch(part)
      }
    }

    /* Back onto the scroll. Setting `'true'` and flushing style FIRST is what
       makes this safe for a part caught mid-finish: that part's animation was
       moved onto the document timeline, and a CSS animation whose timeline was
       set from script no longer listens to `animation-timeline`. Cancelling it
       through `animation: none` and then removing the attribute has the browser
       build a fresh one, bound to `--scene` again. */
    const release = () => {
      const held = parts.filter((part) => part.dataset.sceneLatched)
      if (held.length === 0) return
      for (const part of held) part.dataset.sceneLatched = 'true'
      void getComputedStyle(held[0]).animationName
      for (const part of held) delete part.dataset.sceneLatched
    }

    const check = () => {
      frame = 0
      const y = window.scrollY
      const up = y < lastY
      lastY = y

      /* THE PARTS, NOT THE SCENE. The first version waited for the whole scene
         to leave the bottom of the screen, and at 2560x1440 it never can: the
         Track record's heading is inside the first viewport at scroll zero, so
         the cards stayed latched and a second pass down played nothing. What
         has to be off screen for a release to be invisible is only what
         animates — and every part below the fold also means the scene has not
         reached `contain 0%`, so every range here is back at zero. */
      /* Boxless parts do not count. The Track record carries a horizontal AND a
         vertical fill per segment and shows one per breakpoint; the hidden one
         is `display: none`, whose rect is all zeros — `top: 0`, "on screen"
         forever — and that alone kept every latch held at every size. */
      const below = parts.every((part) => {
        const r = part.getBoundingClientRect()
        return (r.width === 0 && r.height === 0) || r.top >= window.innerHeight
      })
      if (below) {
        release()
        return
      }

      /* THE FLOOR. A range written against a scene near the foot of the
         document can end a few pixels past the last scroll the page has:
         measured at 2560x1440, the Track record's last card closes at 728px
         past `contain 0%` and the document stops at 714. At the bottom there is
         no further scroll to finish it with, so the clock does. */
      const atFloor = y >= document.documentElement.scrollHeight - window.innerHeight - 1

      for (const part of parts) {
        if (part.dataset.sceneLatched) continue
        // Transitions share `getAnimations()`; only the scroll animation counts.
        const anim = part.getAnimations().find((a) => 'animationName' in a)
        if (!anim) continue
        const progress = anim.effect?.getComputedTiming().progress ?? 0
        if (progress >= 1) latch(part)
        else if ((up || atFloor) && progress > 0) finish(part, anim, progress)
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    // A reload restored mid-page has parts already past their ranges.
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
