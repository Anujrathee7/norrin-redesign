/**
 * Contrast probe.
 *
 * The palette is small enough that every new token can be checked against every
 * ground it is actually allowed to sit on, rather than spot-checked. Pairs are
 * declared here as { fg, bg, min, note } and the script prints a measured ratio
 * and a pass/fail — so "this clears AA" is a number in the log, not a claim in
 * a comment.
 *
 * Alpha is composited against the stated background before measuring, which is
 * the whole point: the inverse bands are built from translucent ink and an
 * uncomposited ratio there is meaningless.
 *
 *   node tools/contrast.mjs
 */

const hex = (h) => {
  const s = h.replace('#', '')
  const n = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
}

/** `#rrggbb` or `#rrggbb@0.75` — the alpha form composites onto `over`. */
const parse = (spec, over) => {
  const [h, a] = spec.split('@')
  const rgb = hex(h)
  if (!a) return rgb
  const t = Number(a)
  return rgb.map((c, i) => Math.round(c * t + over[i] * (1 - t)))
}

const lin = (c) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

export function check(pairs) {
  let failed = 0
  let width = 0
  for (const p of pairs) width = Math.max(width, p.note.length)

  for (const p of pairs) {
    const bg = hex(p.bg)
    const r = ratio(parse(p.fg, bg), bg)
    const ok = r >= p.min
    if (!ok) failed++
    console.log(
      `${ok ? ' ok ' : 'FAIL'}  ${p.note.padEnd(width)}  ${r.toFixed(2).padStart(5)}:1  (needs ${p.min})`,
    )
  }
  return failed
}
