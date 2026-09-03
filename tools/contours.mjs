/**
 * CONTOURS — generate the hero's background field.
 *
 * Run it with `node tools/contours.mjs`. It prints SVG path data to stdout and
 * writes `src/components/sections/contours.ts`, which the hero imports.
 *
 * ------------------------------------------------------------------------
 * WHY THIS IS GENERATED RATHER THAN DRAWN
 * ------------------------------------------------------------------------
 * Hand-authored "topographic" curves look hand-authored: the spacing gives it
 * away, because a person spaces rings evenly and terrain does not. These are
 * produced by sampling a scalar field built from four sine harmonics and
 * tracing its level sets, which is the same reason real contours bunch on a
 * steep face and open out on a shallow one. The bunching is the tell that it
 * reads as terrain instead of as decoration.
 *
 * Deterministic on purpose — no RNG, no seed. The same command produces the
 * same file forever, so the committed output can be reviewed in a diff and a
 * regeneration is never a surprise.
 *
 * ------------------------------------------------------------------------
 * WHY CONTOURS AT ALL
 * ------------------------------------------------------------------------
 * It is not a texture picked because it looked nice. It is the one figure that
 * already belongs to three things this page is doing:
 *
 *   1. THE AERIAL VIEW. The band above it is three aerial photographs. A
 *      contour map is what those photographs are of, abstracted.
 *   2. THE PRODUCTION LINE. The page's whole device is a rule that is dashed
 *      while provisional and solid once real. A survey map says exactly that,
 *      with exactly that vocabulary: surveyed contours are solid, interpolated
 *      ones are dashed. The device recurs here at map scale rather than being
 *      restated.
 *   3. NORDIC, WITHOUT COSTUME. Cartography is the register; it does not need
 *      a flag, a pine tree or an aurora to say where this company is from.
 *
 * ------------------------------------------------------------------------
 * WHY IT IS NOT A RASTER, AND NOT A GIF
 * ------------------------------------------------------------------------
 * A GIF of this would be 256 colours (banding across every gradient), 1-bit
 * alpha (no soft edge over the page), several megabytes for a loop of any
 * length — against the 525 kB this site currently serves for all six
 * photographs — and it would animate straight through `prefers-reduced-motion`,
 * which nothing else here does. Vector costs a few kB, scales to any viewport
 * without a second asset, and takes its colours from CSS custom properties, so
 * it re-themes itself when the palette changes rather than needing to be
 * redrawn.
 */
import { writeFileSync } from 'node:fs'

const W = 1600
const H = 1000

/**
 * The terrain. Four harmonics at deliberately non-commensurate frequencies so
 * the field never repeats inside the frame — two harmonics look like a wave,
 * and anything periodic reads as wallpaper rather than as ground.
 */
function height(x, y) {
  const u = x / W
  const v = y / H
  return (
    Math.sin(u * 3.1 + 0.6) * Math.cos(v * 2.3 - 0.4) * 1.0 +
    Math.sin(u * 6.7 - 1.2) * Math.cos(v * 4.1 + 0.9) * 0.42 +
    Math.sin(u * 11.3 + 2.1) * Math.cos(v * 7.9 - 1.7) * 0.17 +
    // A single low, wide ridge running across the frame. Without it the field
    // is isotropic mush; this is what gives the picture a direction to read.
    Math.sin((u * 1.4 + v * 0.8) * Math.PI) * 0.75
  )
}

/* Marching squares. One cell, one level: return the segments crossing it. */
const lerp = (a, b, t) => a + (b - a) * t

function cellSegments(x0, y0, step, level) {
  const x1 = x0 + step
  const y1 = y0 + step
  const tl = height(x0, y0)
  const tr = height(x1, y0)
  const br = height(x1, y1)
  const bl = height(x0, y1)

  const idx =
    (tl > level ? 8 : 0) + (tr > level ? 4 : 0) + (br > level ? 2 : 0) + (bl > level ? 1 : 0)
  if (idx === 0 || idx === 15) return []

  const top = () => [lerp(x0, x1, (level - tl) / (tr - tl)), y0]
  const right = () => [x1, lerp(y0, y1, (level - tr) / (br - tr))]
  const bottom = () => [lerp(x0, x1, (level - bl) / (br - bl)), y1]
  const left = () => [x0, lerp(y0, y1, (level - tl) / (bl - tl))]

  switch (idx) {
    case 1: case 14: return [[left(), bottom()]]
    case 2: case 13: return [[bottom(), right()]]
    case 3: case 12: return [[left(), right()]]
    case 4: case 11: return [[top(), right()]]
    case 6: case 9:  return [[top(), bottom()]]
    case 7: case 8:  return [[left(), top()]]
    // Saddles. Resolved consistently rather than by the average, because the
    // two choices differ only in which way the lines cross and an inconsistent
    // rule produces a visible stitch along the saddle row.
    case 5:  return [[left(), top()], [bottom(), right()]]
    case 10: return [[left(), bottom()], [top(), right()]]
    default: return []
  }
}

/** Join loose segments into polylines by walking endpoints. */
function chain(segments) {
  const key = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`
  const open = new Map()
  for (const [a, b] of segments) {
    const ka = key(a)
    const kb = key(b)
    const pa = open.get(ka)
    const pb = open.get(kb)
    if (pa && pb && pa !== pb) {
      open.delete(ka)
      open.delete(kb)
      const joined = pa[pa.length - 1] === undefined ? pa : pa.concat(pb.slice().reverse())
      open.set(key(joined[0]), joined)
      open.set(key(joined[joined.length - 1]), joined)
    } else if (pa) {
      pa.push(b)
      open.delete(ka)
      open.set(kb, pa)
    } else if (pb) {
      pb.push(a)
      open.delete(kb)
      open.set(ka, pb)
    } else {
      const line = [a, b]
      open.set(ka, line)
      open.set(kb, line)
    }
  }
  // LONG LINES ONLY. The first pass kept everything over 6 points and produced
  // 657 fragments and 1.4 MB of path data — heavier than the GIF this exists to
  // avoid, which would have made the whole argument for vector self-defeating.
  // Short fragments are also the ones that read as noise rather than as terrain:
  // a contour you can see the ends of is a scratch, not a line.
  //
  return [...new Set(open.values())].filter((l) => l.length > 26)
}

/** Catmull-Rom through the points, emitted as cubic beziers. Polylines from
 *  marching squares are faceted at the sampling step; smoothing is what stops
 *  the field looking like a low-poly mesh. */
function toPath(points) {
  // INTEGER COORDINATES. The field is 1600 units wide and renders at a few
  // hundred CSS pixels, so a tenth of a unit is well under a tenth of a device
  // pixel — invisible, and it was costing two characters on every number in a
  // file with tens of thousands of them.
  const r = (n) => Math.round(n)
  const p = points.map(([x, y]) => [r(x), r(y)])
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    d +=
      `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${p2[0]} ${p2[1]}`
  }
  return d
}

/* STEP 26, not 10. The polylines are smoothed into beziers afterwards, so a
   finer sample buys no visible fidelity — it only multiplies the point count,
   and every point is characters in the shipped bundle.

   The three numbers below (step, level spacing, minimum line length) were tuned
   against a measured target rather than by eye. The first pass shipped 657
   contours and 1.4 MB of path data, which is heavier than the GIF this exists
   to avoid — an argument that defeats itself. Current output: 51 contours,
   55 kB raw, 7.2 kB gzipped. Re-measure with:

     gzip -c src/components/sections/contours.ts | wc -c

   If a change to these numbers takes it far above ~10 kB gzipped, the vector
   case stops being obviously right and should be re-argued, not assumed. */
const STEP = 26
const LEVELS = []
for (let l = -1.5; l <= 1.5; l += 0.43) LEVELS.push(Math.round(l * 100) / 100)

const out = []
for (const level of LEVELS) {
  const segs = []
  for (let y = 0; y < H; y += STEP) {
    for (let x = 0; x < W; x += STEP) segs.push(...cellSegments(x, y, STEP, level))
  }
  for (const line of chain(segs)) {
    out.push({ level, d: toPath(line) })
  }
}

/* INDEX CARRIES THE ARGUMENT. Every third contour is a surveyed line — solid,
   full weight. The rest are interpolated — dashed and quieter. That is real
   survey convention and it is also this page's own device, so the background
   is saying the same thing as the rule at the bottom of the hero rather than
   just sitting behind it. */
const paths = out.map((c, i) => ({ d: c.d, solid: i % 3 === 0 }))

const bytes = paths.reduce((a, p) => a + p.d.length, 0)
console.log(`${paths.length} contours, ${LEVELS.length} levels, ${(bytes / 1024).toFixed(1)} kB of path data`)
console.log(`${paths.filter((p) => p.solid).length} surveyed (solid), ${paths.filter((p) => !p.solid).length} interpolated (dashed)`)

writeFileSync(
  'src/components/sections/contours.ts',
  `/* GENERATED by tools/contours.mjs — do not edit by hand.\n` +
    ` * ${paths.length} contour paths over a ${W}x${H} field. Regenerate with:\n` +
    ` *   node tools/contours.mjs\n */\n` +
    `export const CONTOURS: { d: string; solid: boolean }[] = ${JSON.stringify(paths)}\n`,
)
console.log('→ src/components/sections/contours.ts')
