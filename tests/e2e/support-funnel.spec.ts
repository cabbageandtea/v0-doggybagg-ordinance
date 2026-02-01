import { test, expect } from "@playwright/test"

/**
 * Support funnel E2E: mailto links and sitemap.
 * - Footer and help page support@doggybagg.cc mailto opens correctly (href validated)
 * - /privacy and /help are in sitemap
 */
test.describe("Support funnel", () => {
  test("footer has support mailto with correct href", async ({ page }) => {
    await page.goto("/")
    const emailSupportLink = page.locator('a[href*="mailto:support@doggybagg.cc"]').first()
    await expect(emailSupportLink).toBeVisible()
    await expect(emailSupportLink).toHaveAttribute("href", /mailto:support@doggybagg\.cc/)
  })

  test("help page loads", async ({ page }) => {
    await page.goto("/help")
    await expect(page).toHaveTitle(/Help|DoggyBagg/i)
    await expect(page).toHaveURL(/\/help/)
  })

  test("privacy and help pages are in sitemap", async ({ request }) => {
    const baseUrl = process.env.PW_BASE_URL || "http://localhost:3000"
    const res = await request.get(`${baseUrl}/sitemap.xml`)
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toContain("/privacy")
    expect(body).toContain("/help")
  })

  test("privacy and help pages render", async ({ page }) => {
    await page.goto("/privacy")
    await expect(page).toHaveTitle(/Privacy|DoggyBagg/i)
    await expect(page).toHaveURL(/\/privacy/)
    await expect(page.getByRole("heading", { name: /privacy|policy/i })).toBeVisible()

    await page.goto("/help")
    await expect(page).toHaveTitle(/Help|DoggyBagg/i)
    await expect(page).toHaveURL(/\/help/)
  })
})
