/**
 * BACKDROPS — third-party imagery for the `#backdrops` workbench.
 *
 * Run it with `node tools/backdrops.mjs`. Output lands in `public/backdrops/`.
 *
 * ------------------------------------------------------------------------
 * WHY THIS IS A SEPARATE SCRIPT FROM `tools/photos.mjs`
 * ------------------------------------------------------------------------
 * Two reasons, and the first is a number.
 *
 *   1. `photos.mjs` measures our delivered weight against norrin.com's for the
 *      SAME six homepage pictures, and `Compare.tsx` quotes that ratio. Adding
 *      four unrelated images to that script's `homepage` group would silently
 *      compare ten of ours against six of theirs. That file already warns, in
 *      its own comments, about exactly this class of quietly-wrong number.
 *
 *   2. THEY ARE A DIFFERENT KIND OF ASSET. Everything in `public/photos` is
 *      Norrin's own photography, shown back to Norrin. Nothing here is. Keeping
 *      them in separate directories means nobody has to remember which is which
 *      — `public/photos` is theirs, `public/backdrops` is borrowed, and the
 *      difference is visible in the import path at every call site.
 *
 * ------------------------------------------------------------------------
 * LICENCES ARE RECORDED, NOT ASSUMED
 * ------------------------------------------------------------------------
 * Every entry below carries its licence, its creator and the Commons page it
 * came from. Two are CC0 and two are public domain, so none of them legally
 * REQUIRE attribution — they are recorded anyway, because "we could not
 * remember where this came from" is how a licence problem starts, and because
 * this project's whole claim is that its provenance is checkable.
 *
 * THESE ARE FOR THE WORKBENCH. If one is adopted into the live page, the
 * attribution needs to become visible somewhere a reader can find it, and the
 * Hiroshige prints in particular are museum scans whose reproductions carry
 * their own institutional terms even where the underlying work is long out of
 * copyright. That is a conversation to have before shipping, not after.
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const UA = 'norrin-redesign/1.0 (design research; contact info@norrin.com)'

const BACKDROPS = [
  {
    file: 'tokaido-tsuchiyama',
    what: 'Hiroshige, “Tsuchiyama, Spring Rain”, station 49 of the Fifty-Three Stations of the Tōkaidō, c. 1834',
    creator: 'Utagawa Hiroshige',
    licence: 'Public domain',
    page: 'https://commons.wikimedia.org/wiki/File:Print,_Tsuchi-yama,_Spring_Rain,_in_The_Fifty-Three_Stations_of_the_Tokaido_Road_(Tokaido_Gojusan_Tsugi-no_Uchi),_ca._1834_(CH_18608909).jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Print%2C_Tsuchi-yama%2C_Spring_Rain%2C_in_The_Fifty-Three_Stations_of_the_Tokaido_Road_%28Tokaido_Gojusan_Tsugi-no_Uchi%29%2C_ca._1834_%28CH_18608909%29.jpg/3840px-Print%2C_Tsuchi-yama%2C_Spring_Rain%2C_in_The_Fifty-Three_Stations_of_the_Tokaido_Road_%28Tokaido_Gojusan_Tsugi-no_Uchi%29%2C_ca._1834_%28CH_18608909%29.jpg',
  },
  {
    file: 'tokaido-chiryu',
    what: 'Hiroshige, “Chiryū”, from the Fifty-Three Stations of the Tōkaidō, c. 1834',
    creator: 'Utagawa Hiroshige',
    licence: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Ando_Hiroshige_-_The_Fifty-Three_Stations_of_the_Tokaido-_Chiryu_-_1985.239_-_Cleveland_Museum_of_Art.jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Ando_Hiroshige_-_The_Fifty-Three_Stations_of_the_Tokaido-_Chiryu_-_1985.239_-_Cleveland_Museum_of_Art.jpg',
  },
  {
    file: 'purple-road',
    what: 'A road running away between trees at dusk',
    creator: 'Aaron Burden',
    licence: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Purple_road_(Unsplash).jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Purple_road_%28Unsplash%29.jpg/3840px-Purple_road_%28Unsplash%29.jpg',
  },
  {
    file: 'frozen-forest',
    what: 'An aerial view of a road cutting through snow-covered forest',
    creator: 'adrian aows',
    licence: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:Above_the_frozen_forest_(Unsplash).jpg',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Above_the_frozen_forest_%28Unsplash%29.jpg/3840px-Above_the_frozen_forest_%28Unsplash%29.jpg',
  },
]

const WIDTHS = [640, 1280, 1920]
const OUT = 'public/backdrops'
const CACHE = '.shots/backdrop-cache'

mkdirSync(OUT, { recursive: true })
mkdirSync(CACHE, { recursive: true })

const kb = (n) => `${(n / 1024).toFixed(0)} kB`

/** Download once into a gitignored cache; re-runs are then offline and fast. */
async function source(b) {
  const cached = path.join(CACHE, `${b.file}.bin`)
  if (existsSync(cached)) return cached
  process.stdout.write(`  fetching ${b.file} … `)
  const res = await fetch(b.src, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${b.src}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(cached, buf)
  console.log(kb(buf.length))
  return cached
}

console.log('backdrops\n')

for (const b of BACKDROPS) {
  const file = await source(b)
  const meta = await sharp(file).metadata()
  let ours = 0

  for (const w of WIDTHS) {
    const base = sharp(file).resize({ width: w, withoutEnlargement: true })
    const jobs = [
      ['avif', base.clone().avif({ quality: 52, effort: 6 })],
      ['webp', base.clone().webp({ quality: 74 })],
      ['jpg', base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true })],
    ]
    for (const [ext, pipe] of jobs) {
      const { size } = await pipe.toFile(path.join(OUT, `${b.file}-${w}.${ext}`))
      ours += size
    }
  }

  console.log(
    `  ${b.file.padEnd(20)} ${String(meta.width).padStart(5)}x${String(meta.height).padEnd(5)}` +
      `  source ${kb(statSync(file).size).padStart(8)}  ours ${kb(ours).padStart(8)}` +
      `  ${b.licence}`,
  )
}

console.log(`\n${BACKDROPS.length} backdrops → ${OUT}`)
console.log('Licences: ' + BACKDROPS.map((b) => `${b.file}=${b.licence}`).join('  '))
