import { useEffect, useMemo, useRef } from 'react'
import Matter from 'matter-js'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const { Engine, Bodies, Body, Composite, Sleeping } = Matter
const RETURN_DELAY = 2000

/** Accessible text with a separate, rigid-body visual treatment. */
export function GravityMessage({ children }: { children: string }) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLParagraphElement>(null)
  const words = useMemo(() => children.split(' '), [children])

  useEffect(() => {
    const container = root.current
    if (!container) return
    const glyphs = Array.from(container.querySelectorAll<HTMLElement>('.gravity-message-glyph'))
    if (reduced) return
    const engine = Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8 })
    engine.gravity.y = 1
    let letters: Array<{ el: HTMLElement; body: Matter.Body; x: number; y: number }> = []
    let state: 'idle' | 'falling' | 'returning' = 'idle'
    let frame = 0
    let timer = 0
    let entranceTimer = 0
    let previous = 0
    let returnStart = 0
    let returnFrom: Array<{ x: number; y: number; angle: number }> = []
    let pointer: { x: number; y: number; time: number } | null = null

    const reset = () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      state = 'idle'
      pointer = null
      container.removeAttribute('data-active')
      glyphs.forEach(el => { el.style.transform = '' })
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
    const measure = () => {
      const box = container.getBoundingClientRect()
      letters = glyphs.map(el => {
        const r = el.getBoundingClientRect()
        const x = r.left - box.left + r.width / 2
        const y = r.top - box.top + r.height / 2
        const body = Bodies.rectangle(x, y, r.width + 2, r.height + 2, {
          restitution: 0.42, friction: 0.65, frictionStatic: 1, frictionAir: 0.025,
          sleepThreshold: 45,
        })
        return { el, body, x, y }
      })
      const w = box.width, h = box.height, thickness = 100
      Composite.add(engine.world, [
        ...letters.map(l => l.body),
        Bodies.rectangle(w / 2, h + thickness / 2, w + thickness * 2, thickness, { isStatic: true }),
        Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 3, { isStatic: true }),
        Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 3, { isStatic: true }),
        Bodies.rectangle(w / 2, -thickness / 2, w + thickness * 2, thickness, { isStatic: true }),
      ])
    }
    const paint = () => {
      for (const { el, body, x, y } of letters) {
        el.style.transform = `translate3d(${body.position.x - x}px, ${body.position.y - y}px, 0) rotate(${body.angle}rad)`
      }
    }
    const tick = (now: number) => {
      if (state === 'returning') {
        const progress = Math.min(1, (now - returnStart) / 700)
        const eased = 1 - Math.pow(1 - progress, 3)
        letters.forEach(({ body, x, y }, i) => {
          const from = returnFrom[i]
          Body.setPosition(body, { x: from.x + (x - from.x) * eased, y: from.y + (y - from.y) * eased })
          Body.setAngle(body, from.angle * (1 - eased))
        })
        paint()
        if (progress === 1) { reset(); return }
      } else {
        // Small fixed substeps keep fast cursor throws from crossing letters.
        const delta = Math.min(now - previous, 32)
        const steps = Math.max(1, Math.ceil(delta / 8))
        for (let i = 0; i < steps; i++) Engine.update(engine, delta / steps)
        paint()
      }
      previous = now
      frame = requestAnimationFrame(tick)
    }
    const scheduleReturn = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        state = 'returning'
        returnStart = performance.now()
        returnFrom = letters.map(({ body }) => ({ ...body.position, angle: Math.atan2(Math.sin(body.angle), Math.cos(body.angle)) }))
      }, RETURN_DELAY)
    }
    const start = () => {
      if (state === 'idle') {
        measure()
        letters.forEach(({ body }) => {
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: -2 - Math.random() * 2 })
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.16)
        })
        previous = performance.now()
        frame = requestAnimationFrame(tick)
        container.dataset.active = 'true'
      }
      state = 'falling'
      scheduleReturn()
    }
    const disturb = (event: PointerEvent) => {
      start()
      const box = container.getBoundingClientRect()
      const x = event.clientX - box.left, y = event.clientY - box.top
      const speed = pointer ? Math.hypot(x - pointer.x, y - pointer.y) / Math.max(8, event.timeStamp - pointer.time) : 0
      const power = Math.min(12, 4.5 + speed * 2)
      for (const { body } of letters) {
        const dx = body.position.x - x, dy = body.position.y - y
        const distance = Math.hypot(dx, dy)
        if (distance >= 92) continue
        Sleeping.set(body, false)
        const strength = (1 - distance / 92) * power
        const floor = body.bounds.max.y >= box.height - 5
        Body.setVelocity(body, {
          x: Math.max(-18, Math.min(18, body.velocity.x + dx / Math.max(distance, 1) * strength)),
          y: Math.max(-18, Math.min(18, body.velocity.y + (floor ? -Math.max(0.8, Math.abs(dy) / Math.max(distance, 1)) : dy / Math.max(distance, 1)) * strength)),
        })
        Body.setAngularVelocity(body, Math.max(-0.22, Math.min(0.22, body.angularVelocity + dx / 92 * strength * 0.025)))
      }
      pointer = { x, y, time: event.timeStamp }
    }
    const release = () => { pointer = null }
    container.addEventListener('pointermove', disturb)
    container.addEventListener('pointerup', release)
    container.addEventListener('pointercancel', release)
    container.addEventListener('pointerleave', release)
    let size = `${container.clientWidth}:${container.clientHeight}`
    const resize = new ResizeObserver(() => {
      const next = `${container.clientWidth}:${container.clientHeight}`
      if (next !== size) { reset(); size = next }
    })
    resize.observe(container)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      entranceTimer = window.setTimeout(start, 900)
    }, { threshold: 0.65 })
    observer.observe(container)
    return () => {
      reset()
      clearTimeout(entranceTimer)
      observer.disconnect()
      resize.disconnect()
      container.removeEventListener('pointermove', disturb)
      container.removeEventListener('pointerup', release)
      container.removeEventListener('pointercancel', release)
      container.removeEventListener('pointerleave', release)
    }
  }, [reduced, children])

  return (
    <p ref={root} className="gravity-message" aria-label={children}>
      <span aria-hidden="true" className="gravity-message-line">
        {words.map((word, i) => (
          <span key={i} className="gravity-message-word">
            {[...word].map((letter, j) => <span key={j} className="gravity-message-glyph">{letter}</span>)}
          </span>
        ))}
      </span>
    </p>
  )
}
