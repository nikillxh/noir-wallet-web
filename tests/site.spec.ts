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
  await expect(page.getByRole('link', { name: 'Read the paper' })).toHaveAttribute(
    'href',
    '/paper',
  )
  await footerLink.focus()
  await expect(footerLink).toBeFocused()

  expect(runtimeErrors).toEqual([])
})

test('paper page embeds the PDF and exposes social metadata', async ({ page, request }) => {
  const crawlerResponse = await request.get('/paper', {
    headers: { 'user-agent': 'Twitterbot/1.0' },
  })
  expect(crawlerResponse.ok()).toBe(true)
  expect(await crawlerResponse.text()).toContain(
    'content="https://noirwallet.vercel.app/social/noir-paper-card.png"',
  )

  await page.goto('/paper')

  await expect(page).toHaveTitle('The Custody–Privacy Gap — NOIR Wallet')
  await expect(page.getByRole('heading', { name: 'The Custody–Privacy Gap' })).toBeVisible()
  await expect(page.locator('object[type="application/pdf"]')).toHaveAttribute(
    'data',
    '/paper/Noir_Wallet.pdf#view=FitH',
  )
  await expect(page.getByRole('link', { name: 'Download' })).toHaveAttribute(
    'href',
    '/paper/Noir_Wallet.pdf',
  )
  await expect(page.locator('object .fallback a')).toHaveAttribute(
    'href',
    '/paper/Noir_Wallet.pdf',
  )
  await expect(page.getByRole('link', { name: 'Back to NOIR home' })).toHaveAttribute(
    'href',
    '/',
  )

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://noirwallet.vercel.app/paper',
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://noirwallet.vercel.app/paper',
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'The Custody–Privacy Gap',
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  )
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    'content',
    'The Custody–Privacy Gap',
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://noirwallet.vercel.app/social/noir-paper-card.png',
  )
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '680',
  )
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
    'content',
    '381',
  )
  await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
    'content',
    'image/png',
  )
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    'content',
    'First page of The Custody–Privacy Gap research paper',
  )
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    'https://noirwallet.vercel.app/social/noir-paper-card.png',
  )

  const pdf = await request.get('/paper/Noir_Wallet.pdf')
  expect(pdf.ok()).toBe(true)
  expect(pdf.headers()['content-type']).toContain('application/pdf')

  const card = await request.get('/social/noir-paper-card.png')
  expect(card.ok()).toBe(true)
  expect(card.headers()['content-type']).toContain('image/png')
})
