import { test, expect } from '@playwright/test'

const EMAIL = process.env.PW_TEST_EMAIL
const PASSWORD = process.env.PW_TEST_PASSWORD

// These tests require a pre-created test user and secrets set in CI or locally.
// If the secrets are not set, these tests are skipped.

test('sign-in using test account (skipped if creds not set)', async ({ page }) => {
  test.skip(!EMAIL || !PASSWORD, 'PW_TEST_EMAIL and PW_TEST_PASSWORD must be set to run this test')

  await page.goto('/auth/sign-in')
  await page.fill('#email', EMAIL!)
  await page.fill('#password', PASSWORD!)
  await page.click('text=Sign In')

  await page.waitForURL('**/dashboard')
  await expect(page).toHaveURL(/dashboard/)
  await expect(page.locator('h1').first()).toBeVisible()
})
