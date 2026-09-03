/**
 * Contrast, measured in the browser.
 *
 * `tools/contrast.mjs` checks declared pairs at build time against hexes typed
 * into `tools/palette.mjs`. This is its runtime twin, and it exists because the
 * style guide must not restate those hexes — a guide that quotes a number a
 * human copied across is a guide that can be wrong the moment a token moves.
 *
 * So nothing here takes a colour as an argument. It reads what the browser
 * ACTUALLY PAINTED, which means `light-dark()` has already resolved to the live
 * theme and every `color-mix()` alpha has already been computed. The number on
 * the page is therefore a measurement of the page.
 *
 * The maths is deliberately identical to `tools/contrast.mjs` — same sRGB
 * linearisation, same coefficients, same +0.05 — so the two gates cannot
 * disagree about the same pair. If they ever do, one of them has a bug.
 */

export type Rgb = [number, number, number]

/** `rgb(r g b)`, `rgb(r, g, b)`, `rgba(r, g, b, a)` — all forms the browser returns. */
export function parseComputed(css: string): { rgb: Rgb; alpha: number } {
  const nums = css.match(/[\d.]+/g)
  if (!nums || nums.length < 3) return { rgb: [0, 0, 0], alpha: 1 }
  const [r, g, b, a] = nums.map(Number)
  return { rgb: [r, g, b], alpha: a === undefined ? 1 : a }
}

/** Composite a translucent foreground onto the ground it really sits on. */
export function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  return fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha))) as Rgb
}

const lin = (c: number) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

const lum = ([r, g, b]: Rgb) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

export function contrast(a: Rgb, b: Rgb): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/**
 * Resolve a custom property to painted RGB.
 *
 * Via a real probe element rather than `getPropertyValue`, which hands back the
 * unresolved token text — `light-dark(#f8f7f3, #0e120f)` is not a colour, and
 * parsing it here would mean reimplementing theme selection and getting to be
 * wrong about it. Setting `color` and reading it back makes the engine do that
 * work, correctly, for whichever theme is live.
 *
 * The probe is attached to `parent` so it inherits the same `color-scheme` and
 * any `data-theme` above it. Detached or parked on `<body>`, an inverse band's
 * tokens would resolve against the wrong scheme.
 */
export function resolve(name: string, parent: HTMLElement): { rgb: Rgb; alpha: number } {
  const probe = document.createElement('span')
  probe.style.cssText = `color: var(${name}); position: absolute; width: 0; height: 0; overflow: hidden;`
  parent.appendChild(probe)
  const out = parseComputed(getComputedStyle(probe).color)
  probe.remove()
  return out
}

/**
 * The ratio of one token against another, composited if the foreground is
 * translucent — which the inverse ramp always is.
 */
export function measure(fg: string, bg: string, parent: HTMLElement): number {
  const b = resolve(bg, parent)
  const f = resolve(fg, parent)
  return contrast(composite(f.rgb, f.alpha, b.rgb), b.rgb)
}
