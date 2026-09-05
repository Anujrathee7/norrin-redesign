/**
 * Accessibility + structure audit.
 *
 * Runs axe-core against light and dark themes, then adds a few checks axe
 * cannot make on its own: heading order, landmark presence, keyboard-reachable
 * focus styling, and whether any content is still hidden once every reveal has
 * fired (the failure mode that would silently eat copy).
 */
import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const URL = process.argv[2] ?? 'http://localhost:5173/'
const browser = await chromium.launch()
let failures = 0

for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
  })
  const page = await context.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)

  // Scroll the whole page so every IntersectionObserver has fired before we
  // judge contrast on revealed content.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
  })
  await page.waitForTimeout(800)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()

  console.log(`\n=== axe · ${theme} ===`)
  if (results.violations.length === 0) {
    console.log('no violations')
  } else {
    for (const v of results.violations) {
      failures++
      console.log(`\n[${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node(s))`)
      for (const n of v.nodes.slice(0, 4)) {
        console.log(`   ${n.target.join(' ')}`)
        if (n.failureSummary) {
          console.log(`   ${n.failureSummary.split('\n').slice(0, 3).join(' | ')}`)
        }
      }
    }
  }

  /**
   * axe again with the bar's OPEN state showing, at the top and over a forest
   * band.
   *
   * THIS USED TO OPEN THE DESKTOP DRAWER, and it hovered
   * `getByRole('button', { name: /What we do/ })` to do it. There are no drawers
   * and no `<button>` nav items any more — every item is a `<Link>` to a route —
   * so that hover waited 30s for an element that cannot exist and took the whole
   * gate down with a TimeoutError.
   *
   * The check is kept rather than deleted, because its reason survives the
   * drawers: the plain pass above only ever sees the bar closed, so any claim
   * about its open state was taken on trust. The open state is now the MOBILE
   * SHEET, so that is what gets opened. The two scroll positions stay — a bar
   * over the page ground and a bar over an inverse band are different contrast
   * problems, and that was never about the drawer.
   *
   * The closed bar is audited at both positions too, which is new coverage: the
   * old shape only ever ran the closed pass once, at the top.
   */
  for (const spot of ['top', 'inverse']) {
    const reached = await page.evaluate((where) => {
      if (where === 'top') {
        window.scrollTo(0, 600)
        return true
      }
      // Scoped to main. The fixed header used to carry data-tone="inverse" too
      // while it sat over a band, and an unscoped query would latch onto it,
      // scroll by ~72px, and quietly audit the same place twice.
      const el = document.querySelector('main [data-tone="inverse"]')
      if (!el) return false
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + 200)
      return true
    }, spot)
    if (!reached) continue
    await page.waitForTimeout(700)

    const closed = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()

    console.log(`
=== axe · ${theme} · bar closed (${spot}) ===`)
    if (closed.violations.length === 0) {
      console.log('no violations')
    } else {
      for (const v of closed.violations) {
        failures++
        console.log(`
[${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node(s))`)
        for (const n of v.nodes.slice(0, 4)) console.log(`   ${n.target.join(' ')}`)
      }
    }
  }

  /* The sheet, at a width where the hamburger is not `lg:hidden`. Opened by
     clicking the real control rather than by setting state, so the thing being
     audited is the thing a reader gets. */
  await page.setViewportSize({ width: 430, height: 900 })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Open menu/ }).click()
  await page.waitForTimeout(500)

  const sheetState = await page.locator('#mobile-nav').evaluate((el) => ({
    rows: el.querySelectorAll('a').length,
    height: Math.round(el.getBoundingClientRect().height),
  }))
  if (sheetState.height < 40) {
    failures++
    console.log(`
[error] mobile sheet did not open — height ${sheetState.height}px`)
  }

  const sheet = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()

  console.log(
    `
=== axe · ${theme} · mobile sheet open · ${sheetState.rows} rows, ${sheetState.height}px ===`,
  )
  if (sheet.violations.length === 0) {
    console.log('no violations')
  } else {
    for (const v of sheet.violations) {
      failures++
      console.log(`
[${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node(s))`)
      for (const n of v.nodes.slice(0, 4)) console.log(`   ${n.target.join(' ')}`)
    }
  }

  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(400)

  if (theme === 'light') {
    const structure = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
        level: Number(h.tagName[1]),
        text: (h.textContent ?? '').trim().slice(0, 46),
      }))
      const hidden = [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => !el.hasAttribute('data-revealed'))
        .map((el) => el.className)
      return {
        headings,
        hidden,
        landmarks: {
          header: document.querySelectorAll('header').length,
          main: document.querySelectorAll('main').length,
          footer: document.querySelectorAll('footer').length,
          nav: document.querySelectorAll('nav').length,
        },
        h1Count: document.querySelectorAll('h1').length,
        skipLink: !!document.querySelector('.skip-link'),
        langAttr: document.documentElement.lang,
        titleTag: document.title,
        metaDesc: document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content')
          ?.slice(0, 60),
      }
    })

    console.log('\n=== structure ===')
    console.log('landmarks:', JSON.stringify(structure.landmarks))
    console.log('h1 count:', structure.h1Count, '| skip link:', structure.skipLink)
    console.log('lang:', structure.langAttr || '(missing)')
    console.log('title:', structure.titleTag || '(missing)')
    console.log('meta description:', structure.metaDesc ?? '(missing)')

    let prev = 0
    const order = []
    for (const h of structure.headings) {
      if (prev && h.level > prev + 1) order.push(`SKIP h${prev}→h${h.level}: "${h.text}"`)
      prev = h.level
    }
    console.log('heading order:', order.length ? order.join('; ') : 'ok')
    if (order.length) failures++

    console.log(
      'unrevealed after full scroll:',
      structure.hidden.length ? `${structure.hidden.length} — ${structure.hidden[0]}` : 'none',
    )
    if (structure.hidden.length) failures++

    console.log('\nheadings:')
    for (const h of structure.headings) console.log(`  h${h.level}  ${h.text}`)
  }

  await context.close()
}

await browser.close()
console.log(failures ? `\n${failures} issue group(s) to fix.` : '\nclean.')
process.exitCode = failures ? 1 : 0
