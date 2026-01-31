import { test, expect } from '@playwright/test'

test('home page has header and CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/DoggyBagg|Ordinance/i)
  const header = page.locator('header')
  await expect(header).toBeVisible()
  // Check for a visible CTA or main hero element
  const hero = page.locator('main')
  await expect(hero).toBeVisible()
})
