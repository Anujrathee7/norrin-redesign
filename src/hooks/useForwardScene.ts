import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

const properties = ['transform', 'translate', 'rotate', 'scale', 'clip-path', 'opacity']

/** Keep the presentation's furthest frame until the reader returns to the hero.
 * CSS still owns the choreography. Only its painted values are held on rewind;
 * the section itself stays in normal scroll flow. No React renders per frame.
 */
export function useForwardScene() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = ref.current
    if (!section || reducedMotion || !CSS.supports('animation-timeline: view()')) return

    const parts = [...section.querySelectorAll<HTMLElement>('[data-scene-part]')]
    const scenes = [...section.querySelectorAll<HTMLElement>('[data-scene]')]
    const entries = parts.map((part) => ({
      part,
      original: [...properties, 'animation-name'].map((name) => [
        name, part.style.getPropertyValue(name), part.style.getPropertyPriority(name),
      ]),
      frame: [] as string[],
    }))
    let furthest = window.scrollY
    let held = false
    let frame = 0

    const release = () => {
      if (!held) return
      for (const { part, original } of entries) {
        for (const [name, value, priority] of original) {
          if (value) part.style.setProperty(name, value, priority)
          else part.style.removeProperty(name)
        }
      }
      held = false
    }

    const capture = () => {
      for (const entry of entries) {
        const style = getComputedStyle(entry.part)
        entry.frame = properties.map((name) => style.getPropertyValue(name))
      }
    }

    const update = () => {
      frame = 0
      const y = window.scrollY
      // The Gap's section edge slightly overlaps the hero. Use the first
      // visible scene's edge, not the section's padding, as the replay boundary.
      const firstScene = scenes.find((scene) => scene.getClientRects().length > 0)
      if (y <= 1 || (firstScene && firstScene.getBoundingClientRect().top >= window.innerHeight - 1)) {
        release()
        furthest = y
        capture()
      } else if (y >= furthest) {
        release()
        furthest = y
        capture()
      } else if (!held) {
        for (const { part, frame: values } of entries) {
          part.style.setProperty('animation-name', 'none')
          properties.forEach((name, i) => part.style.setProperty(name, values[i]))
        }
        held = true
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // A resize changes the CSS geometry: keep progress held until the reader
    // catches up, then let the native timelines resolve against the new layout.
    capture()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
      release()
    }
  }, [reducedMotion])

  return ref
}

