import { expect, test } from '@playwright/test'

test('hero, hardware sequence, and footer work end to end', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text())
  })

  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'NOIR' })).toBeVisible()
  await expect(page.locator('.hero__version-base')).toHaveText('v0')

  const viewport = page.viewportSize()
  if (!viewport) throw new Error('Expected a browser viewport')

  await page.mouse.move(viewport.width * 0.24, viewport.height * 0.31)
  await expect
    .poll(() =>
      page.locator('#noir').evaluate((element) =>
        Number.parseFloat((element as HTMLElement).style.getPropertyValue('--pointer-x')),
      ),
    )
    .toBeCloseTo(24, 0)

  await testInfo.attach('hero', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  const hardware = page.locator('#hardware')
  await hardware.scrollIntoViewIfNeeded()
  await expect(hardware.locator('canvas')).toBeVisible({ timeout: 15_000 })

  await page.evaluate(() => {
    const element = document.querySelector<HTMLElement>('#hardware')
    if (!element) throw new Error('Hardware section was not mounted')
    const distance = element.offsetHeight - window.innerHeight
    const documentTop = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, documentTop + distance * 0.96)
  })

  await expect(page.locator('.phase-readout strong')).toHaveText('COMPONENTS')
  await testInfo.attach('components', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })

  const footerLink = page.getByRole('link', { name: 'Follow @NoirWallet on X' })
  await footerLink.scrollIntoViewIfNeeded()
  await expect(footerLink).toHaveAttribute('href', 'https://x.com/NoirWallet')
  await footerLink.focus()
  await expect(footerLink).toBeFocused()

  expect(runtimeErrors).toEqual([])
})
