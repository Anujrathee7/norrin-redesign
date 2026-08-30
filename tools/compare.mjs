/**
 * COMPARE — capture both sides of the argument.
 *
 * `node tools/compare.mjs` shoots norrin.com's homepage section by section, then
 * shoots the matching section of this rebuild, and writes both into
 * `public/compare/` as committed WebP. The `#compare` surface renders the pairs.
 *
 * Needs the production preview running for our side:
 *   npm run build && npx vite preview --port 4322
 *   node tools/compare.mjs --ours=http://localhost:4322/
 *
 * ------------------------------------------------------------------------
 * WHY STILLS AND NOT LIVE SECTIONS
 * ------------------------------------------------------------------------
 * The obvious build is their screenshot beside our real components. Two things
 * kill it. Rendering our sections inline duplicates every `id` on the page,
 * which is an axe failure and breaks the anchors the nav depends on. Rendering
 * them in iframes avoids that but puts every scroll-driven section into a
 * 600px-tall viewport, where `animation-timeline: view()` resolves against a
 * scroller that never scrolls — so our side would show its pre-roll state and
 * we would be comparing their finished page against our unfinished one.
 *
 * Stills are also simply the right medium for the job. This page exists to be
 * opened once, by someone who was sent a link, and understood in ten seconds.
 *
 * The cost is that stills go stale, so BOTH sides are captured by this one
 * command. Re-run it after changing any section; never hand-edit the output.
 *
 * ------------------------------------------------------------------------
 * ON SCREENSHOTTING SOMEONE ELSE'S SITE
 * ------------------------------------------------------------------------
 * These are third-party screenshots used to criticise the thing they depict,
 * beside a named, dated, unaffiliated alternative. That is what the whole
 * artefact is; the README says so on their behalf as well as ours.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'
import path from 'node:path'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const OURS = args.ours ?? 'http://localhost:4322/'
const THEIRS = 'https://norrin.com/'
const OUT = 'public/compare'
const VP = { width: 1440, height: 900 }

mkdirSync(OUT, { recursive: true })

/**
 * The pairings, by SUBJECT rather than by scroll position.
 *
 * Their order and ours differ on purpose — their thesis sits below a webinar
 * promo and ours does not — so pairing by position would compare unrelated
 * things and quietly hide the one structural change worth arguing for.
 *
 * `theirs` is the heading text to scroll to on norrin.com; `ours` is the
 * `[data-shot]` name here. `h` is how tall a slice to take, in viewport
 * heights: a band that is mostly one statement needs less than a card grid.
 */
const PAIRS = [
  // `seekVideo` shows their hero at its RESOLVED frame, not a random one.
  //
  // The brand line is a looping <video> of letterforms flying into the
  // sentence, so a screenshot taken on any fixed delay catches whatever the
  // loop happens to be doing — mid-scatter, most of the time. That is honestly
  // what a visitor sees for several seconds, but it is not the designed state,
  // and a comparison that screenshots the least flattering frame of someone's
  // work is one they would be right to dismiss.
  //
  // So the video is paused and seeked to a known-good frame instead of waited
  // on. 3.0s of a 9.03s loop: sampling eleven frames across the timeline
  // (`.shots/probe/video-scan.mjs`, sheet at `video-sheet.png`) shows the
  // sentence formed from roughly 1.8s to 4.5s and scattered either side of
  // that, so the midpoint of the readable window is deterministic and is their
  // design at its best. Seeking to the END lands on scatter, which is what the
  // first attempt did.
  { id: 'hero', theirs: null, ours: 'hero', h: 1, seekVideo: 3.0 },
  { id: 'thesis', theirs: 'Enabling enterprise AI', ours: 'gap', h: 1 },
  { id: 'services', theirs: 'Enabling Enterprise AI', ours: 'pillars', h: 1 },
  { id: 'publications', theirs: 'Highlights and News', ours: 'thinking', h: 1 },
  { id: 'customers', theirs: 'Our Customers', ours: 'work', h: 1 },
  { id: 'careers', theirs: 'Work at Norrin', ours: 'careers', h: 1 },
]

/** WebP at 1440 is ~5x lighter than the PNG and identical at this size. */
async function encode(buffer, name) {
  const file = path.join(OUT, `${name}.webp`)
  await sharp(buffer).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
  return file
}

const browser = await chromium.launch()

/* ---------------------------------------------------------------- theirs */
{
  const page = await browser.newPage({ viewport: VP, deviceScaleFactor: 2 })
  await page.goto(THEIRS, { waitUntil: 'networkidle', timeout: 90000 })

  // The cookie banner covers the lower third of every shot. Decline rather than
  // accept: we are not agreeing to anything on their behalf, and declining
  // leaves the page in the state a first-time visitor sees after one click.
  for (const label of ['Decline', 'Hylkää', 'Neka']) {
    const btn = page.getByRole('button', { name: label, exact: true })
    if (await btn.count()) {
      await btn.first().click().catch(() => {})
      break
    }
  }
  await page.waitForTimeout(800)

  // Their photography is lazy — walk the page so every band has loaded before
  // any of them is captured.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 160))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1500)

  for (const pair of PAIRS) {
    let top = 0
    if (pair.theirs) {
      top = await page.evaluate((text) => {
        const h = [...document.querySelectorAll('h1,h2,h3')].find(
          (n) => n.textContent.trim() === text,
        )
        if (!h) return -1
        // Back off above the heading so the band reads as a band, not as a
        // heading stuck to the top edge of a crop.
        return Math.max(0, h.getBoundingClientRect().top + window.scrollY - 120)
      }, pair.theirs)
      if (top < 0) {
        console.log(`  ! theirs/${pair.id}: heading "${pair.theirs}" not found — skipped`)
        continue
      }
    }
    await page.evaluate((y) => window.scrollTo(0, y), top)
    await page.waitForTimeout(900)

    if (pair.seekVideo) {
      await page.evaluate(async (t) => {
        for (const v of document.querySelectorAll('video')) {
          try {
            v.pause()
            v.currentTime = t
          } catch {}
        }
        await new Promise((r) => setTimeout(r, 1200))
      }, pair.seekVideo)
      await page.waitForTimeout(600)
    }
    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: VP.width, height: Math.round(VP.height * pair.h) },
    })
    console.log('  →', await encode(buf, `theirs-${pair.id}`))
  }
  await page.close()
}

/* ------------------------------------------------------------------ ours */
{
  const page = await browser.newPage({ viewport: VP, deviceScaleFactor: 2 })
  await page.goto(OURS, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(600)

  for (const pair of PAIRS) {
    const found = await page.evaluate((name) => {
      const el = document.querySelector(`[data-shot="${name}"]`)
      if (!el) return false
      if (el.id) location.hash = `#${el.id}`
      else el.scrollIntoView({ block: 'start' })
      return true
    }, pair.ours)
    if (!found) {
      console.log(`  ! ours/${pair.id}: [data-shot="${pair.ours}"] not found — skipped`)
      continue
    }
    // Scroll-driven sections need a beat to settle on their finished state.
    await page.waitForTimeout(1200)
    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: VP.width, height: Math.round(VP.height * pair.h) },
    })
    console.log('  →', await encode(buf, `ours-${pair.id}`))
  }
  await page.close()
}

await browser.close()
console.log('\n  Re-run this whenever a section changes. Both sides move together.\n')
