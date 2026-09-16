import { useEffect, useMemo, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Body = {
  el: HTMLSpanElement
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  va: number
  width: number
  height: number
  left: number
  top: number
}

type Drag = { index: number; pointerId: number; x: number; y: number; time: number }

const GRAVITY = 1050
const RETURN_DELAY = 2800

/**
 * A readable sentence that temporarily becomes a small gravity field.
 *
 * The source text never leaves the accessibility tree. The individual glyphs
 * are visual only; pointer physics changes transforms, never DOM order. If JS
 * or animation is unavailable the sentence is ordinary, selectable text.
 */
export function GravityMessage({ children }: { children: string }) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLParagraphElement>(null)
  const glyphs = useRef<Array<HTMLSpanElement | null>>([])
  const bodies = useRef<Body[]>([])
  const frame = useRef(0)
  const resetTimer = useRef(0)
  const active = useRef(false)
  const returning = useRef(false)
  const drag = useRef<Drag | null>(null)
  const activate = useRef<() => void>(() => {})

  const words = useMemo(() => {
    let index = 0
    return children.split(' ').map((word) => ({
      word,
      letters: [...word].map((letter) => ({ letter, index: index++ })),
    }))
  }, [children])

  useEffect(() => {
    const container = root.current
    if (!container || reduced) return

    const measure = () => {
      if (active.current) return
      bodies.current = glyphs.current.flatMap((el) => {
        if (!el) return []
        const parent = el.offsetParent instanceof HTMLElement ? el.offsetParent : null
        return [{
          el,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          angle: 0,
          va: 0,
          width: el.offsetWidth,
          height: el.offsetHeight,
          left: el.offsetLeft + (parent?.offsetLeft ?? 0),
          top: el.offsetTop + (parent?.offsetTop ?? 0),
        }]
      })
    }

    const paint = (body: Body) => {
      body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`
    }

    const finishReturn = () => {
      active.current = false
      returning.current = false
      container.removeAttribute('data-active')
      for (const body of bodies.current) {
        body.x = 0
        body.y = 0
        body.vx = 0
        body.vy = 0
        body.angle = 0
        body.va = 0
        body.el.style.transform = ''
      }
      measure()
    }

    const scheduleReturn = () => {
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => {
        returning.current = true
      }, RETURN_DELAY)
    }

    let previous = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.032)
      previous = now
      const box = container.getBoundingClientRect()
      let settled = true

      for (const body of bodies.current) {
        if (returning.current) {
          body.vx += (-body.x * 34 - body.vx * 10) * dt
          body.vy += (-body.y * 34 - body.vy * 10) * dt
          body.va += (-body.angle * 28 - body.va * 9) * dt
        } else if (drag.current?.index !== bodies.current.indexOf(body)) {
          body.vy += GRAVITY * dt
        }

        if (drag.current?.index !== bodies.current.indexOf(body)) {
          body.x += body.vx * dt
          body.y += body.vy * dt
          body.angle += body.va * dt
        }

        if (!returning.current) {
          const floor = box.height - body.top - body.height
          const leftWall = -body.left
          const rightWall = box.width - body.left - body.width
          if (body.y > floor) {
            body.y = floor
            body.vy *= -0.3
            body.vx *= 0.84
            body.va *= 0.78
            if (Math.abs(body.vy) < 18) body.vy = 0
          }
          if (body.x < leftWall || body.x > rightWall) {
            body.x = Math.max(leftWall, Math.min(rightWall, body.x))
            body.vx *= -0.45
          }
        }

        if (Math.abs(body.x) > 0.25 || Math.abs(body.y) > 0.25 || Math.abs(body.angle) > 0.3) {
          settled = false
        }
        paint(body)
      }

      // Soft circular collisions are enough for letters to push their
      // neighbours without turning this decorative field into a physics engine.
      if (!returning.current) {
        const list = bodies.current
        for (let i = 0; i < list.length; i += 1) {
          for (let j = i + 1; j < list.length; j += 1) {
            const a = list[i]
            const b = list[j]
            const ax = a.left + a.x + a.width / 2
            const ay = a.top + a.y + a.height / 2
            const bx = b.left + b.x + b.width / 2
            const by = b.top + b.y + b.height / 2
            const dx = bx - ax
            const dy = by - ay
            const distance = Math.hypot(dx, dy) || 0.01
            const minimum = Math.max(7, Math.min(a.height, b.height) * 0.34)
            if (distance >= minimum) continue
            const force = (minimum - distance) * 8
            const nx = dx / distance
            const ny = dy / distance
            if (drag.current?.index !== i) {
              a.vx -= nx * force
              a.vy -= ny * force
            }
            if (drag.current?.index !== j) {
              b.vx += nx * force
              b.vy += ny * force
            }
          }
        }
      }

      if (returning.current && settled) {
        finishReturn()
        return
      }
      if (active.current) frame.current = requestAnimationFrame(tick)
    }

    activate.current = () => {
      if (!active.current) {
        measure()
        active.current = true
        returning.current = false
        container.dataset.active = 'true'
        bodies.current.forEach((body, index) => {
          body.vx = (Math.random() - 0.5) * 100
          body.vy = -80 - Math.random() * 150
          body.va = (index % 2 ? 1 : -1) * (20 + Math.random() * 55)
        })
        previous = performance.now()
        frame.current = requestAnimationFrame(tick)
      } else {
        returning.current = false
      }
      scheduleReturn()
    }

    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(container)

    let entranceTimer = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      entranceTimer = window.setTimeout(() => activate.current(), 1100)
    }, { threshold: 0.7 })
    observer.observe(container)

    return () => {
      observer.disconnect()
      resize.disconnect()
      window.clearTimeout(entranceTimer)
      window.clearTimeout(resetTimer.current)
      cancelAnimationFrame(frame.current)
    }
  }, [reduced])

  const onPointerDown = (index: number, event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced || event.button !== 0) return
    activate.current()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { index, pointerId: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp }
  }

  const onPointerMove = (index: number, event: ReactPointerEvent<HTMLSpanElement>) => {
    const held = drag.current
    if (!held || held.index !== index || held.pointerId !== event.pointerId) return
    const body = bodies.current[index]
    if (!body) return
    const now = event.timeStamp
    const dt = Math.max((now - held.time) / 1000, 0.008)
    const dx = event.clientX - held.x
    const dy = event.clientY - held.y
    body.x += dx
    body.y += dy
    body.vx = dx / dt
    body.vy = dy / dt
    held.x = event.clientX
    held.y = event.clientY
    held.time = now
  }

  const release = (index: number, event: ReactPointerEvent<HTMLSpanElement>) => {
    if (drag.current?.index !== index || drag.current.pointerId !== event.pointerId) return
    drag.current = null
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => { returning.current = true }, RETURN_DELAY)
  }

  return (
    <p ref={root} className="gravity-message" aria-label={children}>
      <span aria-hidden="true" className="gravity-message-line">
        {words.map(({ word, letters }) => (
          <span key={word} className="gravity-message-word">
            {letters.map(({ letter, index }) => (
              <span
                key={`${letter}-${index}`}
                ref={(node) => { glyphs.current[index] = node }}
                className="gravity-message-glyph"
                onPointerDown={(event) => onPointerDown(index, event)}
                onPointerMove={(event) => onPointerMove(index, event)}
                onPointerUp={(event) => release(index, event)}
                onPointerCancel={(event) => release(index, event)}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </span>
    </p>
  )
}
