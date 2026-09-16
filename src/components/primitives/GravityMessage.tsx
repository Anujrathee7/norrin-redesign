import { useEffect, useMemo, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Body = {
  el: HTMLSpanElement
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  left: number
  top: number
  asleep: boolean
  stillFrames: number
}

type Cursor = { x: number; y: number; vx: number; vy: number; active: boolean; time: number }

const GRAVITY = 980
const CURSOR_RADIUS = 92
const RETURN_DELAY = 2000

/** A readable sentence whose visual glyphs become a small bounce field. */
export function GravityMessage({ children }: { children: string }) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLParagraphElement>(null)
  const glyphs = useRef<Array<HTMLSpanElement | null>>([])
  const bodies = useRef<Body[]>([])
  const frame = useRef(0)
  const returnTimer = useRef(0)
  const active = useRef(false)
  const returning = useRef(false)
  const start = useRef<() => void>(() => {})
  const kick = useRef<(x: number, y: number, vx: number, vy: number) => void>(() => {})
  const scheduleReturn = useRef<() => void>(() => {})
  const cursor = useRef<Cursor>({ x: 0, y: 0, vx: 0, vy: 0, active: false, time: 0 })

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
      const box = container.getBoundingClientRect()
      bodies.current = glyphs.current.flatMap((el) => {
        if (!el) return []
        const glyph = el.getBoundingClientRect()
        return [{
          el,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          width: glyph.width,
          height: glyph.height,
          left: glyph.left - box.left,
          top: glyph.top - box.top,
          asleep: false,
          stillFrames: 0,
        }]
      })
    }

    let previous = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.032)
      previous = now
      const box = container.getBoundingClientRect()
      const list = bodies.current
      const supported = list.map(() => false)

      if (returning.current) {
        let home = true
        for (const body of list) {
          body.vx += (-body.x * 32 - body.vx * 9) * dt
          body.vy += (-body.y * 32 - body.vy * 9) * dt
          body.x += body.vx * dt
          body.y += body.vy * dt
          body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`
          if (Math.abs(body.x) > 0.3 || Math.abs(body.y) > 0.3 || Math.abs(body.vx) > 1 || Math.abs(body.vy) > 1) {
            home = false
          }
        }
        if (home) {
          for (const body of list) {
            body.x = 0
            body.y = 0
            body.vx = 0
            body.vy = 0
            body.el.style.transform = ''
          }
          active.current = false
          returning.current = false
          container.removeAttribute('data-active')
          return
        }
        frame.current = requestAnimationFrame(tick)
        return
      }

      for (let index = 0; index < list.length; index += 1) {
        const body = list[index]
        if (!body.asleep) {
          body.vy += GRAVITY * dt
          body.x += body.vx * dt
          body.y += body.vy * dt
        }

        const floor = box.height - body.top - body.height
        const right = box.width - body.left - body.width
        if (body.y >= floor) {
          body.y = floor
          body.vy *= -0.38
          body.vx *= 0.78
          supported[index] = true
          if (Math.abs(body.vy) < 24) body.vy = 0
          if (Math.abs(body.vx) < 7) body.vx = 0
        }
        if (body.x <= -body.left || body.x >= right) {
          body.x = Math.max(-body.left, Math.min(right, body.x))
          body.vx *= -0.55
        }
      }

      // Separate visible glyph boxes, then exchange velocity only on the
      // collision axis. This produces a bounce without corrective jitter.
      for (let pass = 0; pass < 8; pass += 1) {
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
            const overlapX = (a.width + b.width) / 2 + 1 - Math.abs(dx)
            const overlapY = (a.height + b.height) / 2 + 1 - Math.abs(dy)
            if (overlapX <= 0 || overlapY <= 0) continue

            a.asleep = false
            b.asleep = false
            if (overlapX < overlapY) {
              const direction = dx >= 0 ? 1 : -1
              a.x -= direction * overlapX / 2
              b.x += direction * overlapX / 2
              const av = a.vx
              a.vx = b.vx * 0.46
              b.vx = av * 0.46
            } else {
              const direction = dy >= 0 ? 1 : -1
              a.y -= direction * overlapY / 2
              b.y += direction * overlapY / 2
              const av = a.vy
              a.vy = b.vy * 0.28
              b.vy = av * 0.28
              supported[direction > 0 ? i : j] = true
            }
          }
        }

        for (const body of list) {
          body.x = Math.max(-body.left, Math.min(box.width - body.left - body.width, body.x))
          body.y = Math.max(-body.top, Math.min(box.height - body.top - body.height, body.y))
        }
      }

      for (let index = 0; index < list.length; index += 1) {
        const body = list[index]
        if (supported[index] && Math.abs(body.vx) < 5 && Math.abs(body.vy) < 5) {
          body.stillFrames += 1
          if (body.stillFrames > 24) {
            body.vx = 0
            body.vy = 0
            body.asleep = true
          }
        } else {
          body.stillFrames = 0
        }
        body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`
      }

      frame.current = requestAnimationFrame(tick)
    }

    kick.current = (x, y, pointerVx, pointerVy) => {
      const pointerSpeed = Math.hypot(pointerVx, pointerVy)
      const impulse = (85 + Math.min(pointerSpeed * 0.035, 115)) * 1.5
      const box = container.getBoundingClientRect()
      for (const body of bodies.current) {
        const cx = body.left + body.x + body.width / 2
        const cy = body.top + body.y + body.height / 2
        let dx = cx - x
        let dy = cy - y
        let distance = Math.hypot(dx, dy)
        if (distance >= CURSOR_RADIUS) continue
        if (distance < 2) {
          dx = pointerVx === 0 ? 1 : -pointerVx
          dy = pointerVy === 0 ? -1 : -pointerVy
          distance = Math.hypot(dx, dy)
        }
        const strength = 1 - distance / CURSOR_RADIUS
        body.vx += (dx / distance) * impulse * strength
        body.vy += (dy / distance) * impulse * strength
        const floor = box.height - body.top - body.height
        if (body.y >= floor - 2) body.vy -= impulse * strength * 0.65
        body.asleep = false
        body.stillFrames = 0
      }
    }

    scheduleReturn.current = () => {
      window.clearTimeout(returnTimer.current)
      returnTimer.current = window.setTimeout(() => {
        returning.current = true
        bodies.current.forEach((body) => { body.asleep = false })
      }, RETURN_DELAY)
    }

    start.current = () => {
      if (active.current) return
      measure()
      active.current = true
      returning.current = false
      container.dataset.active = 'true'
      bodies.current.forEach((body) => {
        body.vx = (Math.random() - 0.5) * 260
        body.vy = -110 - Math.random() * 190
      })
      previous = performance.now()
      frame.current = requestAnimationFrame(tick)
      scheduleReturn.current()
    }

    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(container)
    let entranceTimer = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      entranceTimer = window.setTimeout(() => start.current(), 900)
    }, { threshold: 0.65 })
    observer.observe(container)

    return () => {
      observer.disconnect()
      resize.disconnect()
      window.clearTimeout(entranceTimer)
      window.clearTimeout(returnTimer.current)
      cancelAnimationFrame(frame.current)
    }
  }, [reduced])

  const disturb = (event: ReactPointerEvent<HTMLParagraphElement>) => {
    if (reduced) return
    returning.current = false
    start.current()
    const bounds = event.currentTarget.getBoundingClientRect()
    const now = event.timeStamp
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const dt = Math.max((now - cursor.current.time) / 1000, 0.008)
    const pointerVx = cursor.current.active ? (x - cursor.current.x) / dt : 0
    const pointerVy = cursor.current.active ? (y - cursor.current.y) / dt : 0
    kick.current(x, y, pointerVx, pointerVy)
    scheduleReturn.current()

    cursor.current = {
      x,
      y,
      vx: pointerVx,
      vy: pointerVy,
      active: true,
      time: now,
    }
  }

  return (
    <p
      ref={root}
      className="gravity-message"
      aria-label={children}
      onPointerMove={disturb}
      onPointerUp={() => { cursor.current.active = false }}
      onPointerCancel={() => { cursor.current.active = false }}
      onPointerLeave={() => { cursor.current.active = false }}
    >
      <span aria-hidden="true" className="gravity-message-line">
        {words.map(({ word, letters }) => (
          <span key={word} className="gravity-message-word">
            {letters.map(({ letter, index }) => (
              <span
                key={`${letter}-${index}`}
                ref={(node) => { glyphs.current[index] = node }}
                className="gravity-message-glyph"
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
