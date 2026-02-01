/**
 * Performance stress test for the Tactile landing page.
 * Simulates 50 rapid interactions with 3D Tilt cards and Tactile Buttons,
 * and reports First Contentful Paint (FCP).
 *
 * Usage:
 *   1. Start the app: pnpm run build && pnpm start
 *   2. Run: node scripts/performance-bench.js
 *
 * Or with dev server: pnpm dev (in another terminal) then node scripts/performance-bench.js
 */

const { chromium } = require('@playwright/test')

const BASE_URL = process.env.PW_BASE_URL || 'http://localhost:3000'
const INTERACTIONS = 50
const BATCH_DELAY_MS = 16 // ~60fps

async function getPerfMetrics(page) {
  return page.evaluate(() => {
    const timing = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    const fcpEntry = paint.find((e) => e.name === 'first-contentful-paint')
    // Fallback: LCP-like proxy from resource timing
    const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : null
    return {
      fcp,
      domContentLoaded: timing ? Math.round(timing.domContentLoadedEventEnd - timing.fetchStart) : null,
      loadComplete: timing ? Math.round(timing.loadEventEnd - timing.fetchStart) : null,
    }
  })
}

async function stressTestTiltCards(page) {
  // BentoTiltCard has data-bento-tilt; fallback to card-like containers in #features
  let tiltCards = page.locator('#features [data-bento-tilt]')
  let count = await tiltCards.count()
  if (count === 0) {
    tiltCards = page.locator('#features [class*="rounded-2xl"]')
    count = await tiltCards.count()
  }
  if (count === 0) {
    tiltCards = page.locator('[data-bento-tilt]')
    count = await tiltCards.count()
  }
  count = Math.max(1, count)
  const n = Math.max(1, count)
  const results = { hovers: 0, errors: 0 }
  for (let i = 0; i < INTERACTIONS; i++) {
    const idx = i % n
    try {
      const box = await tiltCards.nth(idx).boundingBox()
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.waitForTimeout(BATCH_DELAY_MS)
        results.hovers++
      }
    } catch (e) {
      results.errors++
    }
  }
  return results
}

async function stressTestTactileButtons(page) {
  // Hover + mousedown/up to trigger TactileButton scale animation
  // Prefer buttons (no nav) over links to avoid navigation during rapid clicks
  const buttons = page.locator('button, a[href^="/auth"], a[href^="#"]').filter({
    hasText: /Get Started|Sign In|Sign Up|Start Free|View All|Book a|Get My \$499|Accept/i,
  })
  const count = Math.max(1, await buttons.count())
  const results = { interactions: 0, errors: 0 }
  for (let i = 0; i < INTERACTIONS; i++) {
    const idx = i % count
    try {
      const btn = buttons.nth(idx)
      const box = await btn.boundingBox()
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.up()
        results.interactions++
      }
      await page.waitForTimeout(BATCH_DELAY_MS)
    } catch (e) {
      results.errors++
    }
  }
  return results
}

async function runBenchmark() {
  console.log('🐕 DoggyBagg Performance Benchmark')
  console.log('================================')
  console.log(`Target: ${BASE_URL}`)
  console.log(`Interactions per test: ${INTERACTIONS}`)
  console.log('')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // BentoTiltCard includes data-bento-tilt; fallback to liquid-glass cards

    const start = Date.now()
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 })
    const loadTime = Date.now() - start

    await page.waitForLoadState('networkidle')
    // Scroll to features so tilt cards are in view
    await page.locator('#features').scrollIntoViewIfNeeded().catch(() => {})
    await page.waitForTimeout(200)
    const perf = await getPerfMetrics(page)

    console.log('📊 Core Web Vitals')
    console.log(`   FCP (First Contentful Paint): ${perf.fcp ?? 'N/A'} ms`)
    console.log(`   DOM Content Loaded:          ${perf.domContentLoaded ?? 'N/A'} ms`)
    console.log(`   Load Complete:               ${perf.loadComplete ?? 'N/A'} ms`)
    console.log(`   Navigation (client):         ${loadTime} ms`)
    console.log('')

    // Stress test 1: 3D Tilt cards
    console.log('🔄 Stress Test: 3D Tilt Cards (50 rapid hovers)')
    const tiltStart = Date.now()
    const tiltResults = await stressTestTiltCards(page)
    const tiltDuration = Date.now() - tiltStart
    console.log(`   Hovers completed: ${tiltResults.hovers}`)
    console.log(`   Errors: ${tiltResults.errors}`)
    console.log(`   Duration: ${tiltDuration} ms`)
    console.log('')

    // Stress test 2: Tactile Buttons
    console.log('🔄 Stress Test: Tactile Buttons (50 rapid clicks)')
    const btnStart = Date.now()
    const btnResults = await stressTestTactileButtons(page)
    const btnDuration = Date.now() - btnStart
    console.log(`   Interactions completed: ${btnResults.interactions}`)
    console.log(`   Errors: ${btnResults.errors}`)
    console.log(`   Duration: ${btnDuration} ms`)
    console.log('')

    console.log('✅ Benchmark complete')
    return { perf, tiltResults, btnResults }
  } catch (err) {
    console.error('❌ Benchmark failed:', err?.message || err)
    throw err
  } finally {
    await browser.close()
  }
}

runBenchmark().catch((err) => {
  console.error(err)
  process.exit(1)
})
