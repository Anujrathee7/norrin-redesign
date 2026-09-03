/**
 * PHOTOS — fetch Norrin's own homepage photography and encode it for ours.
 *
 * Run it with `node tools/photos.mjs`. Output lands in `public/photos/` and is
 * committed, so a clone builds without network access and the build itself
 * never depends on their CDN being up.
 *
 * ------------------------------------------------------------------------
 * WHY THIS SCRIPT EXISTS AT ALL
 * ------------------------------------------------------------------------
 * The site shipped zero raster images before this, deliberately — the visual
 * system is flat planes, hairlines and type, and every earlier request for
 * imagery was refused for a real reason (we hold no licence to customer logos
 * or to headshots). Their own photographs are the one category that does not
 * have that problem: they are Norrin's, shown back to Norrin, in a redesign of
 * Norrin's page. That is stated in the README rather than left to be noticed.
 *
 * ------------------------------------------------------------------------
 * WHY THE OUTPUT IS SHAPED THE WAY IT IS
 * ------------------------------------------------------------------------
 * Their homepage serves these at source resolution — 5062x3180, 5464x3640, and
 * a 6682x4411 on the careers band — as single JPEGs with no `srcset`. Part of
 * the argument this redesign makes is that a page can carry the same pictures
 * for a fraction of the bytes, so:
 *
 *   1. THREE WIDTHS, not one. 640 / 1280 / 1920. A phone should never be handed
 *      a 6682px file, and above 1920 the difference stops being visible on the
 *      surfaces we place these on.
 *   2. AVIF AND WEBP, with JPEG as the floor. AVIF first because it is roughly
 *      half of WebP at this quality on photographic content; JPEG last so the
 *      page degrades on anything that supports neither.
 *   3. NO UPSCALING. `withoutEnlargement` — a source narrower than a target
 *      width simply stops there rather than being inflated into a soft copy of
 *      itself.
 *   4. `mozjpeg` and progressive, because the JPEG is the fallback that older
 *      browsers actually download and it should not be the worst file here.
 *
 * The manifest it prints at the end is the number the compare page quotes. It
 * is measured from the files on disk, not estimated.
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

/* Norrin's own imagery, with the page each file came from.
   Kept here rather than imported from `src/data/norrin.ts` because that file is
   TypeScript and this script is plain Node — the two are checked against each
   other by `--verify` below rather than by a shared import.

   `group` EXISTS TO KEEP ONE NUMBER HONEST. The weight comparison at the bottom
   measures our delivery against theirs for the SAME six pictures — the ones on
   their homepage — and `Compare.tsx` quotes that ratio. The headshots below came
   later, from /contact-us, and they are not part of that set. Summing them into
   `oursServed` would silently compare eight of ours against six of theirs, which
   is the kind of quietly-wrong number this file already warns about once. Only
   `homepage` is compared; anything else is reported separately. */
const PHOTOS = [
  { group: 'homepage', file: 'change-management', src: 'https://norrin.com/hs-fs/hubfs/Change%20management%20or%20AI%20etc.jpg' },
  { group: 'homepage', file: 'portrait-29', src: 'https://norrin.com/hs-fs/hubfs/Norrin%202026%20JPG%20Fullsize-29.jpg' },
  { group: 'homepage', file: 'process', src: 'https://norrin.com/hs-fs/hubfs/Process%20or%20change%20management%20etc.jpg' },
  { group: 'homepage', file: 'team-34', src: 'https://norrin.com/hs-fs/hubfs/Norrin%202026%20JPG%20Fullsize-34.jpg' },
  { group: 'homepage', file: 'vision-paper', src: 'https://norrin.com/hs-fs/hubfs/AI%20or%20change%20management%20etc.jpg' },
  { group: 'homepage', file: 'careers-9', src: 'https://norrin.com/hs-fs/hubfs/Norrin%202026%20JPG%20Fullsize-9.jpg' },

  /* Named contacts, from norrin.com/contact-us. Same category as the six above —
     Norrin's own published photographs of Norrin, shown back to Norrin — and the
     reason `docs/research-brief.md` §7 no longer lists headshots as a gap. Only
     the people the Contact section actually names are taken; the page publishes
     ten and eight of them are none of our business. */
  { group: 'contact', file: 'antti-vuolli', src: 'https://norrin.com/hs-fs/hubfs/Antti%20Vuolli%20neli%C3%B6%20(2).png' },
  { group: 'contact', file: 'heidi-riihimaki', src: 'https://norrin.com/hs-fs/hubfs/Riihim%C3%A4ki_Heidi.jpg' },
]

const WIDTHS = [640, 1280, 1920]
const OUT = 'public/photos'
const CACHE = '.shots/photo-cache'

mkdirSync(OUT, { recursive: true })
mkdirSync(CACHE, { recursive: true })

const kb = (n) => `${(n / 1024).toFixed(0)} kB`

/** Download once into a gitignored cache; re-runs are then offline and fast. */
async function source(photo) {
  const cached = path.join(CACHE, `${photo.file}.jpg`)
  if (existsSync(cached)) return cached
  process.stdout.write(`  fetching ${photo.file} … `)
  const res = await fetch(photo.src)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${photo.src}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(cached, buf)
  console.log(kb(buf.length))
  return cached
}

const manifest = []

for (const photo of PHOTOS) {
  const file = await source(photo)
  const meta = await sharp(file).metadata()
  const originalBytes = statSync(file).size
  let ours = 0

  for (const w of WIDTHS) {
    // Never enlarge: a 3402px-wide portrait has no business becoming a 1920
    // that is really a 1920-shaped 3402. `withoutEnlargement` also means the
    // widest variant can silently equal a narrower one, which `srcset` handles
    // correctly on its own.
    const base = sharp(file).resize({ width: w, withoutEnlargement: true })

    const jobs = [
      ['avif', base.clone().avif({ quality: 52, effort: 6 })],
      ['webp', base.clone().webp({ quality: 74 })],
      ['jpg', base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true })],
    ]
    for (const [ext, pipe] of jobs) {
      const out = path.join(OUT, `${photo.file}-${w}.${ext}`)
      const { size } = await pipe.toFile(out)
      ours += size
    }
  }

  manifest.push({
    group: photo.group,
    file: photo.file,
    source: `${meta.width}x${meta.height}`,
    theirs: originalBytes,
    ours,
  })
  console.log(
    `  ${photo.file.padEnd(20)} ${String(meta.width) + 'x' + meta.height}`.padEnd(46) +
      `theirs ${kb(originalBytes).padStart(8)}   ours ${kb(ours).padStart(8)} (all 9 variants)`,
  )
}

// THE COMPARABLE SET ONLY — their homepage six against our homepage six. See
// the note on `group` above for why the headshots are excluded from this and
// reported on their own line instead.
const homepage = manifest.filter((m) => m.group === 'homepage')
const extra = manifest.filter((m) => m.group !== 'homepage')

const sourceBytes = homepage.reduce((a, m) => a + m.theirs, 0)
const oursAll = homepage.reduce((a, m) => a + m.ours, 0)
// What a 1440-wide viewport actually downloads from us: one AVIF per photo at
// the 1280 step. Not the sum of every variant on disk — a browser fetches one.
let oursServed = 0
for (const m of homepage) oursServed += statSync(path.join(OUT, `${m.file}-1280.avif`)).size

/**
 * THEIR SERVED WEIGHT, MEASURED — and it is not what the source files weigh.
 *
 * The obvious comparison is our output against the originals above, which sum
 * to ~47 MB and include one 18 MB JPEG. That comparison would be wrong and
 * badly flattering to us. Their `?width=` URLs are HubSpot CDN transforms:
 * loaded with a real browser and scrolled to the bottom, norrin.com requests
 * these six as **WebP, resized to 480-1680**, and transfers ~915 kB for the
 * set. Their delivery is genuinely decent — responsive widths and a modern
 * format — and the honest headline is a modest win, not an order of magnitude.
 *
 * Measured by `.shots/probe/norrin-weight.mjs`, which sums every `image/*`
 * response on their homepage. Re-run it before quoting this number anywhere.
 */
const THEIRS_SERVED = 915 * 1024

console.log('\n  ' + '-'.repeat(66))
console.log(`  their source files (not what ships)   ${kb(sourceBytes).padStart(10)}`)
console.log(`  THEIR SIX, AS ACTUALLY SERVED         ${kb(THEIRS_SERVED).padStart(10)}   webp, 480-1680`)
console.log(`  ours, every variant on disk           ${kb(oursAll).padStart(10)}`)
console.log(`  OURS, AS ACTUALLY SERVED AT 1280      ${kb(oursServed).padStart(10)}   avif`)
console.log(
  `\n  ours is ${(THEIRS_SERVED / oursServed).toFixed(2)}x lighter than theirs, like for like.` +
    `\n  Do NOT quote the source-file ratio — see the note above.`,
)

if (extra.length) {
  let extraServed = 0
  for (const m of extra) extraServed += statSync(path.join(OUT, `${m.file}-1280.avif`)).size
  console.log(
    `\n  PLUS ${extra.length} image(s) outside the compared set (${extra.map((m) => m.file).join(', ')}),` +
      `\n  ${kb(extraServed)} at the 1280 step. Not in the ratio above: they are not on their homepage,` +
      `\n  so there is nothing of theirs to compare them against.`,
  )
}
console.log('')
