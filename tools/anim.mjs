import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:4210/'
mkdirSync('.shots/anim', { recursive: true })
const browser = await chromium.launch()

/**
 * Nothing on the page may be left invisible or clipped away.
 *
 * `scope` matters. There are now two entirely different mechanisms here and
 * they fail in different directions:
 *
 *   [data-reveal]   hidden by CSS scoped to `html.js`, undone by JavaScript.
 *                   If the JS half never runs, the content is hidden FOREVER.
 *                   That is the failure this harness was built for and it must
 *                   be checked with the page sitting still.
 *
 *   [data-scroll]   hidden by a scroll-driven animation and undone by the act
 *   [data-scene-*]  of scrolling. Below the fold at 0% progress it is SUPPOSED
 *                   to be clipped or offset — that is the animation's start,
 *                   not a stuck element, and asserting otherwise just asserts
 *                   that no entrance may exist. What has to be true of these is
 *                   that they COMPLETE, which is what the full-scroll pass
 *                   below checks, and that a browser which cannot run them
 *                   never sees the start state at all, which is what the
 *                   `@supports` check at the end of this file proves.
 */
async function assertVisible(page, label, scope = '[data-reveal], .line-mask > *, [data-scroll], [data-scene-part]') {
  const bad = await page.evaluate((sel) => {
    const out = []
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      const op = parseFloat(cs.opacity)
      const clipped = cs.clipPath && cs.clipPath.includes('100%')
      if (op < 0.99 || clipped) {
        out.push(
          `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 30)} opacity=${cs.opacity} clip=${cs.clipPath}`,
        )
      }
    }
    return out
  }, scope)
  console.log(`${label}: ${bad.length ? 'STUCK ->\n   ' + bad.join('\n   ') : 'all visible'}`)
  return bad.length === 0
}

// 1. Normal load, scrolled through the whole page.
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: '.shots/anim/hero-settled.png', clip: { x: 0, y: 0, width: 1512, height: 950 } })

  // Walk the page so every observer fires, then check nothing stayed hidden.
  const h = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(180)
  }
  await page.waitForTimeout(1200)
  await assertVisible(page, 'after full scroll')
  console.log('console errors:', errs.length ? errs.join(' | ') : 'none')
  await ctx.close()
}

// 2. Reduced motion — the page must be complete and still.
{
  const ctx = await browser.newContext({
    viewport: { width: 1512, height: 950 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await assertVisible(page, 'reduced motion')
  await page.screenshot({ path: '.shots/anim/hero-reduced.png' })
  await ctx.close()
}

// 3. The failure mode that can actually happen in this app: React mounts, but
//    IntersectionObserver never fires (unsupported, or an observer that misses).
//    Reveal must fall back to showing everything.
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    // Remove it before the bundle runs, so Reveal takes its fallback path.
    delete window.IntersectionObserver
  })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const ok = await assertVisible(page, 'no IntersectionObserver')
  await page.screenshot({ path: '.shots/anim/no-io.png' })
  if (!ok) process.exitCode = 1
  await ctx.close()
}

// 4. html.js never applied (bundle ran but the class was lost): the hidden
//    state is scoped to that class, so nothing may be hidden.
//
//    Scoped to `[data-reveal]` ONLY. The scroll-driven parts have no
//    relationship to `html.js` at all — they are CSS start states waiting for a
//    scroll, and checking them here with the page parked at the top reports
//    every entrance on the page as a failure.
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.documentElement.classList.remove('js'))
  // Long enough for the longest transition plus the largest stagger delay to
  // finish; measuring earlier just catches elements on their way back in.
  await page.waitForTimeout(2500)
  const ok4 = await assertVisible(page, 'html.js removed', '[data-reveal]')
  if (!ok4) process.exitCode = 1
  await ctx.close()
}

// 5. Reduced motion, checked properly: not just "nothing is transparent" but
//    "nothing is DISPLACED". A reader who asked for less motion should get the
//    finished page, and a part frozen 38px below where it belongs is a layout
//    bug that an opacity check sails straight past.
{
  const ctx = await browser.newContext({
    viewport: { width: 1512, height: 950 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const moved = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('[data-scroll], [data-scene-part]')) {
      const t = getComputedStyle(el).transform
      if (t && t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)') {
        out.push(`${el.getAttribute('data-scroll') ?? el.getAttribute('data-scene-part')} -> ${t}`)
      }
    }
    return out
  })
  console.log(
    `reduced motion, at rest: ${moved.length ? 'DISPLACED ->\n   ' + moved.join('\n   ') : 'nothing displaced'}`,
  )
  if (moved.length) process.exitCode = 1
  await ctx.close()
}

// 7. Nothing may be left MID-TRAVEL when the document runs out of scroll.
//
//    A `view()` range that cannot complete freezes part-way and reads as a
//    permanently crooked element. It is the specific hazard at the very bottom
//    of the page, which is why the footer had no motion at all for a long time
//    and why its legal line still doesn't. Anything that does animate down
//    there has to actually finish.
{
  const ctx = await browser.newContext({ viewport: { width: 1512, height: 950 } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(900)
  const stranded = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('[data-scroll], [data-scene-part]')) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) continue      // off-screen is fine
      const cs = getComputedStyle(el)
      const t = cs.transform
      if (t && t !== 'none') {
        const m = new DOMMatrixReadOnly(t)
        // sway rocks on purpose and is exempt; everything else must be at rest
        if (el.getAttribute('data-scroll') === 'nori-sway') continue
        if (Math.abs(m.e) > 1 || Math.abs(m.f) > 1 || Math.abs(m.a - 1) > 0.01)
          out.push(`${el.getAttribute('data-scroll') ?? el.getAttribute('data-scene-part')} -> ${t}`)
      }
      if (cs.clipPath && cs.clipPath.includes('%') && !cs.clipPath.includes('0%'))
        out.push(`${el.getAttribute('data-scroll') ?? el.getAttribute('data-scene-part')} clip ${cs.clipPath}`)
    }
    return out
  })
  console.log(
    `bottom of page, on-screen elements at rest: ${stranded.length ? 'STRANDED ->\n   ' + stranded.join('\n   ') : 'all finished'}`,
  )
  if (stranded.length) process.exitCode = 1
  await ctx.close()
}

await browser.close()

// 6. The guarantee for a browser with no scroll timelines at all.
//
//    There is no way to switch the feature off in a browser that has it, so
//    this is checked statically instead, on the BUILT stylesheet: every rule
//    that can hide or displace something on scroll must live inside
//    `@supports (animation-timeline: view())`. If one leaks out, an engine
//    without support applies the start state and never gets an animation to
//    undo it — content clipped to nothing, permanently, on exactly the browsers
//    least able to tell you about it. That is the whole fail-safe, and it is
//    one brace away from being lost at any time.
{
  const { readFileSync, readdirSync } = await import('node:fs')
  const dir = 'dist/assets'
  let css = ''
  try {
    for (const f of readdirSync(dir)) if (f.endsWith('.css')) css += readFileSync(`${dir}/${f}`, 'utf8')
  } catch {
    console.log('@supports guard: SKIPPED (no dist — run `npm run build` first)')
  }
  if (css) {
    const start = css.indexOf('@supports (animation-timeline:view())')
    const startAlt = start === -1 ? css.indexOf('@supports (animation-timeline: view())') : start
    if (startAlt === -1) {
      console.log('@supports guard: FAIL — the block is not in the built CSS at all')
      process.exitCode = 1
    } else {
      // Walk braces to find where the block ends.
      let i = css.indexOf('{', startAlt)
      let depth = 0
      let end = -1
      for (; i < css.length; i++) {
        if (css[i] === '{') depth++
        else if (css[i] === '}' && --depth === 0) {
          end = i
          break
        }
      }
      const leakedExtra = []

      // Block ranges, by brace walking. There are FOUR reduced-motion blocks in
      // the built sheet, not one, and the first is a two-line `scroll-behavior`
      // rule nowhere near the scroll layer — taking `indexOf` and stopping was
      // how this check reported a false leak on its first run.
      const blockAt = (openBraceFrom) => {
        let j = css.indexOf('{', openBraceFrom)
        if (j === -1) return null
        let d = 0
        for (let k = j; k < css.length; k++) {
          if (css[k] === '{') d++
          else if (css[k] === '}' && --d === 0) return [j, k]
        }
        return null
      }

      // Every reduced-motion block, and whether it is purely a reset. Anything
      // it contains sets a resting value (`animation:none`, `transform:none`,
      // `opacity:1`, `clip-path:none`), so it can only make content MORE
      // visible and is safe — required, even — outside the `@supports` gate.
      // That is not taken on trust: a block naming these selectors alongside a
      // translate, a scale or an `inset()` would be hiding something on exactly
      // the browsers this whole gate exists to protect, and is rejected.
      //
      // THE RESETS ARE STRIPPED BEFORE THE QUESTION IS ASKED, and this is the
      // whole correctness of the check rather than a nicety.
      //
      // The first version tested the raw block for the word "translate". That
      // is wrong twice over. `translate`, `rotate` and `scale` are individual
      // transform PROPERTIES as well as transform functions, so `translate:none`
      // — the most reset-shaped declaration there is — matched. And worse, this
      // check reads the BUILT stylesheet, where the minifier rewrites
      // `transform:none` into `transform:translate(0)rotate(0)scale(1)`: an
      // identity transform that displaces nothing and contains all three words.
      //
      // Either misfire cost two failing lines, not one: the block was classed as
      // displacing, which also dropped it out of `resetRanges`, so the
      // `[data-scene-part]` selector inside it was then reported a second time
      // as having escaped the `@supports` gate. The CSS was correct throughout.
      //
      // So a declaration is judged on its VALUE. Every tooth is kept:
      // `transform:translateY(20px)` still displaces, `scale(.9)` still
      // displaces, `clip-path:inset(50%)` still displaces, `opacity:0` still
      // displaces. Only genuine identities are removed.
      const isResting = (raw) => {
        const v = raw.trim().replace(/!important\s*$/, '').trim()
        if (v === '' || v === 'none') return true
        const FN = /[a-zA-Z0-9]+\([^()]*\)/g
        const fns = v.match(FN)
        // Anything that is not a function call — a length, a keyword — means
        // this is not a plain identity and the block keeps its declaration.
        if (!fns || v.replace(FN, '').trim() !== '') return false
        return fns.every((f) => {
          const [, name, args] = f.match(/^([a-zA-Z0-9]+)\(([^()]*)\)$/)
          const n = args.split(',').map((a) => a.trim())
          if (/^translate/i.test(name)) return n.every((x) => /^[-+]?0(px|%|em|rem|vh|vw)?$/.test(x))
          if (/^rotate/i.test(name)) return n.every((x) => /^[-+]?0(deg|rad|grad|turn)?$/.test(x))
          if (/^scale/i.test(name)) return n.every((x) => /^1(\.0+)?$/.test(x))
          if (name.toLowerCase() === 'matrix') return n.join(',') === '1,0,0,1,0,0'
          return false
        })
      }

      const stripResets = (body) =>
        body.replace(
          /(^|[;{])(\s*(?:translate|rotate|scale|transform|clip-path)\s*:\s*)([^;}]*)/g,
          (whole, lead, decl, value) => (isResting(value) ? lead : whole),
        )

      const resetRanges = []
      const rmRe = /prefers-reduced-motion:\s*reduce/g
      let rm
      while ((rm = rmRe.exec(css))) {
        const r = blockAt(rm.index)
        if (!r) continue
        const body = stripResets(css.slice(r[0], r[1]))
        const displaces = /(translate|scale\(|rotate|matrix|inset\(|opacity:\s*0[^.\d])/.test(body)
        if (displaces && /\[data-scroll|\[data-scene-part/.test(body)) {
          leakedExtra.push('a reduced-motion block displaces the scroll parts instead of resetting them')
        } else if (!displaces) {
          resetRanges.push(r)
        }
      }

      const leaked = [...leakedExtra]
      for (const needle of ['[data-scroll=', '[data-scene-part', 'view-timeline-name']) {
        let at = css.indexOf(needle)
        while (at !== -1) {
          const inSupports = at >= startAlt && at <= end
          const inReset = resetRanges.some(([a, b]) => at >= a && at <= b)
          if (!inSupports && !inReset) leaked.push(`${needle} at ${at}`)
          at = css.indexOf(needle, at + 1)
        }
      }
      console.log(
        leaked.length
          ? `@supports guard: LEAKED OUTSIDE ->\n   ${leaked.join('\n   ')}`
          : `@supports guard: every scroll rule is inside the block (${end - startAlt} bytes)`,
      )
      if (leaked.length) process.exitCode = 1
    }
  }
}
