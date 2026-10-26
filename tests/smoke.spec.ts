import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const root = path.resolve(import.meta.dirname, '../registry')
const names = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== 'lib')
  .flatMap((cat) =>
    readdirSync(path.join(root, cat.name), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => JSON.parse(readFileSync(path.join(root, cat.name, d.name, 'meta.json'), 'utf8')).name as string),
  )

for (const name of names) {
  test(`${name} renders`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.goto(`/?c=${name}`)
    const root = page.locator('[data-demo-root]')
    await expect(root).toBeVisible()
    await page.waitForTimeout(600)
    const box = await root.locator(':scope > *').first().boundingBox()
    expect(box && box.width * box.height, 'demo has a visible box').toBeGreaterThan(0)
    expect(errors, 'no runtime errors').toEqual([])
  })

  test(`${name} holds still under reduced motion`, async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(`/?c=${name}`)
    await page.waitForTimeout(800)
    const a = await page.screenshot()
    await page.waitForTimeout(700)
    const b = await page.screenshot()
    expect(errors, 'no runtime errors').toEqual([])
    expect(a.equals(b), 'frame is static under prefers-reduced-motion').toBe(true)
    await context.close()
  })
}
