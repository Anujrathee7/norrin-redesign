import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
mkdirSync('.shots/gap-forward', { recursive: true })
try {
  for (const width of [1512, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 950 } })
    await page.goto('http://127.0.0.1:5173/')
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto' })
    await page.waitForTimeout(400)
    const scroll = async (y) => {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
      await page.waitForTimeout(120)
    }
    const state = () => page.locator('#gap [data-scene-part]').evaluateAll((parts) =>
      parts.filter((part) => part.getClientRects().length).map((part) => {
        const css = getComputedStyle(part)
        return [css.transform, css.translate, css.rotate, css.scale, css.clipPath, css.opacity]
      }))
    const bounds = await page.locator(width > 768 ? '#gap [data-scene-runway]' : '#gap .gap-rail').evaluate((el) => {
      const box = el.getBoundingClientRect()
      return { top: box.top + scrollY, height: box.height }
    })
    const middle = Math.round(bounds.top + (width > 768 ? (bounds.height - 950) * 0.45 : -500))
    await scroll(middle)
    const halfway = await state()
    await scroll(middle - 120)
    assert.deepEqual(await state(), halfway, `${width}: upward scroll must hold the frame`)
    await scroll(middle - 60)
    assert.deepEqual(await state(), halfway, `${width}: downward catch-up must hold the frame`)
    await scroll(middle + 250)
    assert.notDeepEqual(await state(), halfway, `${width}: new downward progress must animate`)
    await scroll(bounds.top + bounds.height)
    const finished = await state()
    await scroll(middle)
    assert.deepEqual(await state(), finished, `${width}: completed scene must stay completed`)
    await page.screenshot({ path: `.shots/gap-forward/${width}-return.png` })
    await scroll(0)
    assert.equal(await page.locator('#gap [data-scene-part][style*="animation-name: none"]').count(), 0)
    await scroll(middle)
    assert.deepEqual(await state(), halfway, `${width}: hero return must allow replay`)
    await scroll(middle - 100)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(100)
    assert.equal(await page.locator('#gap [data-scene-part][style*="animation-name: none"]').count(), 0)
    for (const values of await state()) {
      assert.equal(values[4], 'none', `${width}: reduced motion must reveal content`)
      assert.equal(values[5], '1')
    }
    console.log(`${width}: hold, catch-up, continuation, completion, hero reset, reduced motion PASS`)
    await page.close()
  }
} finally {
  await browser.close()
}


