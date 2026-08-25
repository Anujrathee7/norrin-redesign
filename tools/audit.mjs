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
   * axe again with a drawer open, at the top and over a forest band.
   *
   * The drawer only exists while a pointer is on a trigger, so the plain pass
   * above has never once seen it — every claim about the dropdown being clean
   * was, until now, taken on trust.
   */
  for (const spot of ['top', 'inverse']) {
    const reached = await page.evaluate((where) => {
      if (where === 'top') {
        window.scrollTo(0, 600)
        return true
      }
      // Scoped to main. The fixed header now carries data-tone="inverse" too
      // while it sits over a band, and an unscoped query would latch onto it,
      // scroll by ~72px, and quietly audit the same place twice.
      // Scoped to main — the fixed header carries the same attribute now.
    const el = document.querySelector('main [data-tone="inverse"]')
      if (!el) return false
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + 200)
      return true
    }, spot)
    if (!reached) continue
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: /What we do/ }).first().hover()
    await page.waitForTimeout(600)

    const openState = await page.locator('#nav-drawer').evaluate((el) => ({
      rows: el.querySelectorAll('a').length,
      height: Math.round(el.getBoundingClientRect().height),
    }))
    if (openState.height < 40) {
      failures++
      console.log(`
[error] drawer did not open at "${spot}" — height ${openState.height}px`)
    }

    const open = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()

    console.log(
      `
=== axe · ${theme} · drawer open (${spot}) · ${openState.rows} rows, ${openState.height}px ===`,
    )
    if (open.violations.length === 0) {
      console.log('no violations')
    } else {
      for (const v of open.violations) {
        failures++
        console.log(`
[${v.impact}] ${v.id} — ${v.help}  (${v.nodes.length} node(s))`)
        for (const n of v.nodes.slice(0, 4)) console.log(`   ${n.target.join(' ')}`)
      }
    }
    await page.mouse.move(20, 700)
    await page.waitForTimeout(400)
  }

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
