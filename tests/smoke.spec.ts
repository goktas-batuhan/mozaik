import { expect, test } from '@playwright/test'
import { listItems, loadVariants } from '../scripts/items.mjs'

// Her öğe ve her varyantı: ?c=<ad>[&v=<varyant>]. Test adı gate'in anahtarıyla aynı ("<ad>/<varyant>").
const targets: { key: string; query: string }[] = []
for (const item of listItems()) {
  targets.push({ key: item.name, query: `c=${item.name}` })
  for (const v of await loadVariants(item)) targets.push({ key: `${item.name}/${v.name}`, query: `c=${item.name}&v=${v.name}` })
}

for (const { key, query } of targets) {
  test(`${key} renders`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.goto(`/?${query}`)
    const root = page.locator('[data-demo-root]')
    await expect(root).toBeVisible()
    await page.waitForTimeout(600)
    const box = await root.locator(':scope > *').first().boundingBox()
    expect(box && box.width * box.height, 'demo has a visible box').toBeGreaterThan(0)
    expect(errors, 'no runtime errors').toEqual([])
  })

  test(`${key} holds still under reduced motion`, async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`/?${query}`)
    await page.waitForTimeout(800)
    const a = await page.screenshot()
    await page.waitForTimeout(700)
    const b = await page.screenshot()
    expect(errors, 'no runtime errors').toEqual([])
    expect(a.equals(b), 'frame is static under prefers-reduced-motion').toBe(true)
    await context.close()
  })
}
