/**
 * Visual QA harness.
 *
 * Usage:
 *   node tools/shot.mjs                          # full page, desktop
 *   node tools/shot.mjs --vp=mobile              # single viewport
 *   node tools/shot.mjs --clip=hero              # one [data-shot] region
 *   node tools/shot.mjs --all                    # every viewport
 *   node tools/shot.mjs --theme=dark
 *   node tools/shot.mjs --motion=reduce
 *   node tools/shot.mjs --nav                     # every header state
 *   node tools/shot.mjs --nav --variant=4         # a specific ?nav= variant
 *
 * Screenshots land in .shots/ (git-ignored). Console errors and failed
 * requests are reported to stdout so a silent runtime break can't slip past.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const VIEWPORTS = {
  desktop: { width: 1512, height: 950 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 834, height: 1112 },
  mobile: { width: 390, height: 844 },
  small: { width: 320, height: 640 },
}

const BASE = args.url ?? 'http://localhost:5173/'
const URL = args.variant ? `${BASE}?nav=${args.variant}` : BASE
const OUT = '.shots'
mkdirSync(OUT, { recursive: true })

const targets = args.all
  ? Object.keys(VIEWPORTS)
  : [args.vp ?? 'desktop']

/**
 * Scroll a section into view the way an anchor link does, honouring
 * `scroll-margin-top`. Falls back to a plain scroll for elements whose
 * `data-shot` name is not also an element id.
 */
async function scrollToSection(page, name) {
  const done = await page.evaluate((n) => {
    const el = document.querySelector(`[data-shot="${n}"]`)
    if (!el) return false
    const id = el.id
    if (id) {
      location.hash = `#${id}`
      return true
    }
    el.scrollIntoView({ block: 'start' })
    return true
  }, name)
  if (!done) await page.locator(`[data-shot="${name}"]`).first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
}

/**
 * Header states.
 *
 * The drawer only exists while a pointer is on a trigger, so it can never be
 * caught by a plain full-page capture — which is why every earlier nav
 * screenshot was taken by hand, and why axe had never seen one open.
 */
async function navShots(page, vp, suffix) {
  const dir = path.join(OUT, 'nav')
  mkdirSync(dir, { recursive: true })

  const shot = async (name) => {
    const box = await page.locator('header').first().boundingBox()
    await page.screenshot({
      path: path.join(dir, `${name}-${suffix}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.ceil(box?.height ?? 96) + 10 },
    })
    console.log(`→ ${dir}/${name}-${suffix}.png`)
  }

  const trigger = (label) => page.getByRole('button', { name: new RegExp(label) }).first()
  const settle = () => page.waitForTimeout(600)
  const localeTrigger = () => page.getByRole('button', { name: /^Language/ }).first()

  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(700)
  await shot('bar-solid')

  // The list opens onto both grounds and is built differently on each, so one
  // capture of it was never enough.
  if (await localeTrigger().count()) {
    await localeTrigger().click()
    await page.waitForTimeout(400)
    await shot('locale-open-paper')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  }

  await trigger('What we do').hover()
  await settle()
  await shot('drawer-4-items')

  // The moss rule completing on the second row.
  await page.locator('#nav-drawer a').nth(1).hover()
  await page.waitForTimeout(500)
  await shot('drawer-row-hover')

  // Switching menus must resize what is open, not close and reopen it.
  await trigger('Thinking').hover()
  await settle()
  await shot('drawer-3-items')

  await page.mouse.move(vp.width / 2, vp.height - 40)
  await page.waitForTimeout(500)

  // Over a forest band: the drawer has to invert with the bar.
  const dark = await page.evaluate(() => {
    // Scoped to main — the fixed header carries the same attribute now.
    const el = document.querySelector('main [data-tone="inverse"]')
    if (!el) return false
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + 200)
    return true
  })
  if (dark) {
    await page.waitForTimeout(700)
    await trigger('What we do').hover()
    await settle()
    await shot('drawer-inverse')
    await page.mouse.move(vp.width / 2, vp.height - 40)
    await page.waitForTimeout(400)
  }

  // Matched on /^EN/, which is the button's visible TEXT — but the control has
  // an aria-label ("Language: English"), and an accessible name overrides the
  // text. So this never matched, `count()` was 0, and the branch silently did
  // nothing: the locale panel has never once appeared in a screenshot run.
  const locale = localeTrigger()
  if (await locale.count()) {
    await locale.click()
    await page.waitForTimeout(400)
    await shot('locale-open-inverse')
  }
}

const browser = await chromium.launch()
const problems = []

for (const name of targets) {
  const vp = VIEWPORTS[name]
  if (!vp) {
    console.error(`unknown viewport: ${name}`)
    continue
  }

  const context = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 2,
    reducedMotion: args.motion === 'reduce' ? 'reduce' : 'no-preference',
    colorScheme: args.theme === 'dark' ? 'dark' : 'light',
  })
  const page = await context.newPage()

  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[console:${name}] ${m.text()}`)
  })
  page.on('pageerror', (e) => problems.push(`[pageerror:${name}] ${e.message}`))
  page.on('requestfailed', (r) =>
    problems.push(`[request:${name}] ${r.url()} — ${r.failure()?.errorText}`),
  )

  await page.goto(URL, { waitUntil: 'networkidle' })
  if (args.theme) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), args.theme)
  }
  await page.evaluate(() => document.fonts.ready)

  // Walk the page so every IntersectionObserver-driven reveal fires. Without
  // this, a fullPage capture resizes the viewport and the observers never
  // trigger, so the screenshot shows empty sections that are fine in a browser.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 140))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 250))
  })
  // Let entrance animations resolve before we judge the composition.
  await page.waitForTimeout(args.wait ? Number(args.wait) : 1400)

  const suffix = [name, args.variant && `v${args.variant}`, args.theme, args.motion]
    .filter(Boolean)
    .join('-')

  if (args.nav) {
    await navShots(page, vp, suffix)
  } else if (args.clip) {
    const el = page.locator(`[data-shot="${args.clip}"]`).first()
    // Navigate the way a visitor would, so scroll-margin-top is honoured and the
    // fixed header does not sit on top of the section's own heading.
    await scrollToSection(page, args.clip)
    await page.waitForTimeout(1900)
    await el.screenshot({ path: path.join(OUT, `${args.clip}-${suffix}.png`) })
    console.log(`→ ${OUT}/${args.clip}-${suffix}.png`)
  } else if (args.sections) {
    // One screenshot per marked section — the section-by-section review pass.
    const ids = await page.locator('[data-shot]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('data-shot')),
    )
    for (const id of ids) {
      const el = page.locator(`[data-shot="${id}"]`).first()
      await scrollToSection(page, id)
      await page.waitForTimeout(1400)
      await el.screenshot({ path: path.join(OUT, `s-${id}-${suffix}.png`) })
      console.log(`→ ${OUT}/s-${id}-${suffix}.png`)
    }
  } else {
    await page.screenshot({
      path: path.join(OUT, `page-${suffix}.png`),
      fullPage: !args.viewportOnly,
    })
    console.log(`→ ${OUT}/page-${suffix}.png`)
  }

  await context.close()
}

await browser.close()

if (problems.length) {
  console.log('\n--- PROBLEMS ---')
  for (const p of [...new Set(problems)]) console.log(p)
  process.exitCode = 1
} else {
  console.log('\nno console errors, no failed requests.')
}
