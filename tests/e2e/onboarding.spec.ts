import { test, expect } from '@playwright/test'

// This is a simple smoke test that the onboarding pages render.
// Full auth flows require credentials / fixtures; add them if desired.

test('onboarding route loads', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/dashboard/)
  const heading = page.locator('h1')
  await expect(heading.first()).toBeVisible()
})
