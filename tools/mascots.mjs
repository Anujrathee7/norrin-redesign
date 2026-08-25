/**
 * Mascot exporter — writes the character set to standalone animated SVG files.
 *
 * Usage:
 *   npm run dev                  # in another terminal
 *   node tools/mascots.mjs
 *   node tools/mascots.mjs --url=http://localhost:4173/
 *
 * Files land in public/mascots/.
 *
 * WHY IT DRIVES A BROWSER instead of rendering React in Node. The components
 * are TSX and they import a stylesheet, so rendering them in Node needs a JSX
 * transform plus a CSS stub plus a way to resolve `light-dark()` and the theme
 * tokens the characters inherit — which is a bundler, and there is already one
 * running. Reading the finished DOM is both less machinery and a stronger
 * guarantee: what gets exported is literally what the site renders, so the
 * files cannot drift from the components.
 *
 * WHAT MAKES THE OUTPUT SELF-CONTAINED. Three things are inlined:
 *   1. characters.css in full, so every keyframe travels with the drawing.
 *   2. The palette RESOLVED to concrete hex, measured off the live page in
 *      both colour schemes — the source uses `light-dark()` and inherits
 *      `--inverse` and `--signal` from the app, none of which exist in a bare
 *      file. The resolved block is written at `svg.ch` so it outranks the
 *      `.ch` defaults it is overriding.
 *   3. An explicit xmlns, which the DOM does not always serialise.
 *
 * The result opens in a browser, drops into a README, or imports into Figma —
 * animation included, and it respects prefers-color-scheme on its own.
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import path from 'node:path'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const BASE = (args.url ?? 'http://localhost:5173/').replace(/#.*$/, '')
const URL = `${BASE}#mascots`
const OUT = 'public/mascots'
const CSS_SRC = 'src/components/mascot/characters/characters.css'

/** The custom properties the drawings actually read. */
const TOKENS = ['--c-body', '--c-line', '--c-rim', '--c-paper', '--c-shade', '--c-sun', '--c-moss']

/**
 * What to pull out. Each entry is a CSS selector matched against the lab page;
 * the FIRST match wins, which is why the lab renders each character at card
 * size before it renders the ladder.
 */
const TARGETS = [
  { file: 'fyr', sel: '.chFyr[data-state="production"]' },
  { file: 'fyr-pilot', sel: '.chFyr[data-state="pilot"]' },
  { file: 'fyr-deploying', sel: '.chFyr[data-state="deploying"]' },
  { file: 'fyr-gap', sel: '.chFyr[data-state="gap"]' },
  { file: 'lunni', sel: '.chLunni' },
  { file: 'hirvi', sel: '.chHirvi' },
  { file: 'valo', sel: '.chValo' },
]

const block = (vars) =>
  TOKENS.map((t) => `    ${t}: ${vars[t]};`).join('\n')

async function main() {
  mkdirSync(OUT, { recursive: true })
  const css = readFileSync(CSS_SRC, 'utf8')

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1512, height: 950 } })

  const problems = []
  page.on('console', (m) => m.type() === 'error' && problems.push(m.text()))
  page.on('pageerror', (e) => problems.push(String(e)))

  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForSelector('.chFyr', { timeout: 10_000 })

  /** Read the resolved palette off a real character in one colour scheme. */
  const paletteFor = async (scheme) => {
    await page.emulateMedia({ colorScheme: scheme })
    // A repaint has to land before getComputedStyle reports the new values.
    await page.waitForTimeout(120)
    return page.evaluate((tokens) => {
      const el = document.querySelector('.ch')
      const cs = getComputedStyle(el)
      const out = {}
      for (const t of tokens) out[t] = cs.getPropertyValue(t).trim()
      return out
    }, TOKENS)
  }

  const light = await paletteFor('light')
  const dark = await paletteFor('dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.waitForTimeout(120)

  let written = 0
  const missing = []

  for (const t of TARGETS) {
    const markup = await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const svg = el.cloneNode(true)
      // The lab sizes every instance for the layout it sits in. A file wants
      // to scale to whatever contains it, so the fixed pixel size comes off
      // and the viewBox does the work.
      svg.removeAttribute('width')
      svg.removeAttribute('height')
      svg.removeAttribute('aria-hidden')
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svg.setAttribute('width', '512')
      svg.setAttribute('height', '512')
      return svg.outerHTML
    }, t.sel)

    if (!markup) {
      missing.push(t.sel)
      continue
    }

    const style = `<style>\n${css}\n\n/* Palette resolved off the live page. Written at svg.ch so it outranks\n   the .ch defaults above, which reference tokens a bare file lacks. */\n  svg.ch {\n${block(light)}\n  }\n  @media (prefers-color-scheme: dark) {\n    svg.ch {\n${block(dark)}\n    }\n  }\n</style>`

    const out = markup.replace(/(<svg[^>]*>)/, `$1\n${style}\n`)
    const header = `<!-- Norrin mascot: ${t.file}. Generated by tools/mascots.mjs — do not edit by hand.\n     Self-contained: palette and keyframes inlined, animation included,\n     honours prefers-color-scheme. Source: ${t.sel} -->\n`
    writeFileSync(path.join(OUT, `${t.file}.svg`), header + out + '\n', 'utf8')
    written += 1
    console.log(`  wrote ${OUT}/${t.file}.svg  (${(header + out).length} bytes)`)
  }

  await browser.close()

  console.log(`\n${written}/${TARGETS.length} written`)
  if (missing.length) {
    console.error(`MISSING selectors (nothing exported for these):\n  ${missing.join('\n  ')}`)
  }
  if (problems.length) {
    console.error(`\nPage problems:\n  ${problems.join('\n  ')}`)
  }
  // A silent partial export is the failure mode worth guarding: the files look
  // fine and one of them simply is not there.
  if (missing.length || problems.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
